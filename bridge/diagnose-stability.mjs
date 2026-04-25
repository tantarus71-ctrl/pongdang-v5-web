import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

async function read(relPath) {
  return fs.readFile(path.join(rootDir, relPath), "utf8");
}

function collect(regex, text) {
  const safeRegex = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`);
  return Array.from(text.matchAll(safeRegex), (match) => match[1]);
}

async function main() {
  const [appHtml, patchText, manifestText, projectManifestText] = await Promise.all([
    read("app_assets/index.html"),
    read("patches/latest.generated.patch.js"),
    read("manifest.json"),
    read("project-manifest.json")
  ]);

  const manifest = JSON.parse(manifestText);
  const projectManifest = JSON.parse(projectManifestText);
  const patchVersion = collect(/version:\s*"([^"]+)"/, patchText)[0] || "";
  const issues = [];

  if (!patchVersion) issues.push("Patch version not found.");
  if (manifest.version !== patchVersion) issues.push(`manifest version ${manifest.version} does not match patch ${patchVersion}`);
  if (projectManifest.version !== patchVersion) issues.push(`project manifest version ${projectManifest.version} does not match patch ${patchVersion}`);
  if (!appHtml.includes("fishLayer")) issues.push("fishLayer missing from app html");
  if (!appHtml.includes("sheetLayer")) issues.push("sheetLayer missing from app html");
  if (!appHtml.includes("modalLayer")) issues.push("modalLayer missing from app html");
  if (patchText.includes("back.png") || patchText.includes('view: "back"')) issues.push("Forbidden back view reference found");

  const report = { ok: issues.length === 0, patchVersion, issues, generatedAt: new Date().toISOString() };
  await fs.mkdir(path.join(rootDir, "docs"), { recursive: true });
  await fs.writeFile(path.join(rootDir, "docs/stability-diagnostics-latest.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  if (issues.length) {
    console.error(`Stability diagnostics found errors for ${patchVersion || "unknown"}.`);
    for (const issue of issues) console.error(`[error] ${issue}`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Stability diagnostics passed for ${patchVersion}.\n`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
