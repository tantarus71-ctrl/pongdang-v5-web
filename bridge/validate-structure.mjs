import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const requiredFiles = [
  "index.html",
  "manifest.json",
  "project-manifest.json",
  "app_assets/index.html",
  "patches/latest.generated.patch.js",
  "bridge/generate-patch.mjs"
];

async function read(relPath) {
  return fs.readFile(path.join(rootDir, relPath), "utf8");
}

async function exists(relPath) {
  try {
    await fs.access(path.join(rootDir, relPath));
    return true;
  } catch {
    return false;
  }
}

function fail(message) {
  throw new Error(message);
}

async function main() {
  for (const file of requiredFiles) {
    if (!(await exists(file))) fail(`Missing required file: ${file}`);
  }

  const [manifestText, projectManifestText, appHtml, rootHtml, patchText] = await Promise.all([
    read("manifest.json"),
    read("project-manifest.json"),
    read("app_assets/index.html"),
    read("index.html"),
    read("patches/latest.generated.patch.js")
  ]);

  const manifest = JSON.parse(manifestText);
  const projectManifest = JSON.parse(projectManifestText);

  if (manifest.entrypoints?.app !== "app_assets/index.html") fail("manifest app entrypoint must be app_assets/index.html");
  if (projectManifest.html !== "app_assets/index.html") fail("project-manifest html must be app_assets/index.html");
  if (!appHtml.includes("../patches/latest.generated.patch.js")) fail("app must load latest generated patch");
  if (!patchText.includes("window.PONDANG_AUTO_PATCH")) fail("patch must expose window.PONDANG_AUTO_PATCH");
  if (!rootHtml.includes("./app_assets/index.html")) fail("root index must redirect to ./app_assets/index.html");

  process.stdout.write("Structure validation passed.\n");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
