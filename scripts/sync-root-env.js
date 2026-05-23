const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const OUTPUT_FILE = path.join(ROOT_DIR, ".env");

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

function main() {
  const files = walk(ROOT_DIR);

  if (files.length === 0) {
    console.log(`No ${TARGET_FILE_NAME} files found.`);
    return;
  }

  const output = files
    .map((filePath) => {
      const relativePath = path.relative(ROOT_DIR, filePath);
      const content = fs.readFileSync(filePath, "utf8").trim();

      return [
        "",
        "# ==================================================",
        `# Source: ${relativePath}`,
        "# ==================================================",
        content,
        "",
      ].join("\n");
    })
    .join("\n");

  fs.writeFileSync(OUTPUT_FILE, output, "utf8");

  console.log(`Generated .env from ${files.length} ${TARGET_FILE_NAME} files:`);
  files.forEach((file) => {
    console.log(`- ${path.relative(ROOT_DIR, file)}`);
  });
}

main();
