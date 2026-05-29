import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(dirname, "..");
const inputPath = path.join(packageRoot, "src/styles.css");
const outputPath = path.join(packageRoot, "dist/styles.css");

const css = await fs.readFile(inputPath, "utf8");
const result = await postcss([tailwindcss()]).process(css, {
  from: inputPath,
  to: outputPath,
});

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, result.css);

if (result.map) {
  await fs.writeFile(`${outputPath}.map`, result.map.toString());
}
