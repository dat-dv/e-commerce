// scripts/generate-messages.ts

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "messages");

const locales = fs.readdirSync(ROOT);

for (const locale of locales) {
  const localePath = path.join(ROOT, locale);

  // chỉ xử lý folder
  if (!fs.statSync(localePath).isDirectory()) continue;

  const files = fs
    .readdirSync(localePath)
    .filter(
      (file) =>
        file.endsWith(".json") &&
        !file.startsWith("_") &&
        file !== `${locale}.json`,
    );

  const merged: Record<string, unknown> = {};

  for (const file of files) {
    const filePath = path.join(localePath, file);

    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const key of Object.keys(content)) {
      if (key in merged) {
        throw new Error(`❌ Duplicate key "${key}" in ${locale}/${file}`);
      }
    }

    Object.assign(merged, content);
  }

  fs.writeFileSync(
    path.join(ROOT, `${locale}.json`),
    JSON.stringify(merged, null, 2) + "\n",
  );

  console.log(`✅ Generated messages/${locale}.json`);
}
