import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const bridgeDir = path.join(rootDir, "bridge");
const promptsDir = path.join(rootDir, "prompts");
const targetPatchPath = path.join(rootDir, "patches", "latest.generated.patch.js");

async function readText(filePath) {
  return fs.readFile(filePath, "utf8");
}

async function loadDotEnv() {
  try {
    const source = await readText(path.join(rootDir, ".env"));
    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index <= 0) continue;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
      if (key && !process.env[key]) process.env[key] = value;
    }
  } catch {
  }
}

function parseArgs(argv) {
  const args = {
    briefPath: path.join(bridgeDir, "latest-brief.md"),
    dryRun: false,
    model: process.env.OPENAI_MODEL || "gpt-5-codex",
    sourceMode: process.env.PONGDANG_SOURCE_MODE || "github"
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    if (argv[i] === "--brief" && argv[i + 1]) args.briefPath = path.resolve(rootDir, argv[++i]);
    if (argv[i] === "--model" && argv[i + 1]) args.model = argv[++i];
    if (argv[i] === "--source-mode" && argv[i + 1]) args.sourceMode = argv[++i];
  }
  return args;
}

async function fetchGitHubTextFile(filePath) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO_FULL_NAME || "tantarus71-ctrl/pongdang-v5-web";
  const branch = process.env.GITHUB_REPO_BRANCH || "main";
  if (!token) throw new Error("GITHUB_TOKEN is not set.");
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`GitHub fetch failed for ${filePath}: ${response.status} ${await response.text()}`);
  const json = await response.json();
  return Buffer.from(json.content, "base64").toString("utf8");
}

async function loadSources(args) {
  if (args.sourceMode === "local") {
    return {
      baseApp: await readText(path.join(rootDir, "app_assets", "index.html")),
      currentPatch: await readText(targetPatchPath).catch(() => ""),
      manifest: await readText(path.join(rootDir, "project-manifest.json")).catch(() => "")
    };
  }
  return {
    baseApp: await fetchGitHubTextFile("app_assets/index.html"),
    currentPatch: await fetchGitHubTextFile("patches/latest.generated.patch.js").catch(() => ""),
    manifest: await fetchGitHubTextFile("project-manifest.json").catch(() => "")
  };
}

function extractOutputText(json) {
  if (typeof json.output_text === "string" && json.output_text.trim()) return json.output_text.trim();
  const chunks = [];
  for (const item of json.output || []) for (const content of item.content || []) if (content.type === "output_text" && content.text) chunks.push(content.text);
  return chunks.join("\n").trim();
}

function stripCodeFence(text) {
  return text.replace(/^```(?:javascript|js)?\s*/i, "").replace(/\s*```$/, "").trim();
}

function assertPatchLooksSafe(source) {
  if (!source.includes("window.PONDANG_AUTO_PATCH")) throw new Error("Generated patch is missing window.PONDANG_AUTO_PATCH.");
  if (!source.includes("apply()")) throw new Error("Generated patch is missing apply().");
}

async function main() {
  await loadDotEnv();
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  if (apiKey.includes("여기에_") || /[^\x20-\x7E]/.test(apiKey)) throw new Error("OPENAI_API_KEY is still a placeholder.");

  const [systemTemplate, userTemplate, brief, sources] = await Promise.all([
    readText(path.join(promptsDir, "patch-system.md")),
    readText(path.join(promptsDir, "patch-user-template.md")),
    readText(args.briefPath),
    loadSources(args)
  ]);

  const projectContext = [
    "Stable runtime entry: app_assets/index.html",
    "Auto patch target: patches/latest.generated.patch.js",
    "Manifest snapshot:",
    sources.manifest.trim() || "(manifest unavailable)"
  ].join("\n");

  const userPrompt = userTemplate
    .replace("{{PROJECT_CONTEXT}}", projectContext)
    .replace("{{USER_BRIEF}}", brief.trim())
    .replace("{{CURRENT_PATCH}}", sources.currentPatch.trim())
    .replace("{{BASE_APP_SNIPPET}}", sources.baseApp.slice(-18000).trim());

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: args.model, input: [{ role: "system", content: [{ type: "input_text", text: systemTemplate }] }, { role: "user", content: [{ type: "input_text", text: userPrompt }] }] })
  });
  if (!response.ok) throw new Error(`Responses API request failed: ${response.status} ${await response.text()}`);

  const patchSource = stripCodeFence(extractOutputText(await response.json()));
  assertPatchLooksSafe(patchSource);
  if (args.dryRun) process.stdout.write(patchSource);
  else {
    await fs.mkdir(path.dirname(targetPatchPath), { recursive: true });
    await fs.writeFile(targetPatchPath, patchSource + "\n", "utf8");
    process.stdout.write(`Updated patch: ${targetPatchPath}\n`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
