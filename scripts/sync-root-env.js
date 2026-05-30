const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();

const ENV_NAME = process.argv[2] || "production";
const TARGET_FILE_NAME = `.env.${ENV_NAME}`;

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
]);

const SERVICE_MAP = {
  "apps/backend": ".env.backend",
  "apps/frontend": ".env.frontend",
  "apps/admin": ".env.admin",
};

/**
 * Recursively walks a directory to find target environment files.
 * @param {string} dir - Directory to search.
 * @param {string[]} results - Accumulator of found file paths.
 * @returns {string[]} Found file paths.
 */
function walk(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;

      walk(fullPath, results);
      continue;
    }

    if (entry.isFile() && entry.name === TARGET_FILE_NAME) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Prints shell script content that can be copied and pasted on the server.
 */
function printServerEnvScript() {
  const destFileNames = Object.values(SERVICE_MAP);

  console.log("");
  console.log("");
  console.log("# ==================================================");
  console.log("# Copy everything below and paste it on the server");
  console.log("# ==================================================");
  console.log("");
  console.log("set -e");
  console.log("");

  for (const destFileName of destFileNames) {
    const destPath = path.join(ROOT_DIR, destFileName);

    if (!fs.existsSync(destPath)) {
      console.log(`# Skipped ${destFileName}: file not found`);
      console.log("");
      continue;
    }

    const content = fs.readFileSync(destPath, "utf8").trim();

    console.log(`cat > ${destFileName} <<'EOF'`);
    console.log(content);
    console.log("EOF");
    console.log("");
  }

  console.log("echo 'Env files synced successfully.'");
}

/**
 * Main execution function.
 */
function main() {
  const files = walk(ROOT_DIR);

  if (files.length === 0) {
    console.log(`No ${TARGET_FILE_NAME} files found.`);
    return;
  }

  console.log(`Processing ${TARGET_FILE_NAME} files...`);

  files.forEach((filePath) => {
    const relativePath = path.relative(ROOT_DIR, filePath);
    const normalizedPath = relativePath.replace(/\\/g, "/");

    let matchedService = null;

    for (const serviceKey of Object.keys(SERVICE_MAP)) {
      if (normalizedPath.startsWith(serviceKey)) {
        matchedService = serviceKey;
        break;
      }
    }

    if (matchedService) {
      const destFileName = SERVICE_MAP[matchedService];
      const destPath = path.join(ROOT_DIR, destFileName);
      const content = fs.readFileSync(filePath, "utf8").trim();

      const output = [
        `# ==================================================`,
        `# Generated from: ${normalizedPath}`,
        `# ==================================================`,
        content,
        "",
      ].join("\n");

      fs.writeFileSync(destPath, output, "utf8");
      console.log(`- Synced ${normalizedPath} -> ${destFileName}`);
    } else {
      console.log(`- Ignored: ${normalizedPath} (no matching service)`);
    }
  });

  printServerEnvScript();
}

main();
