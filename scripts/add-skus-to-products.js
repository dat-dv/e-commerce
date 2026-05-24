// ...existing code...
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const datasetDir = path.resolve(
  __dirname,
  "../apps/backend/prisma/dataset/products",
);
const minSkus = 4; // đổi nếu muốn 3/5

async function ensureSkusForProduct(prod) {
  if (!prod) return false;
  if (!Array.isArray(prod.skus)) prod.skus = [];
  const src = prod.skus[0] ?? null;
  let changed = false;
  while (prod.skus.length < minSkus) {
    const idx = prod.skus.length + 1;
    const newId = crypto.randomUUID();
    const newSku = src
      ? { ...src }
      : {
          id: newId,
          sku: `${prod.id ?? prod.slug ?? "product"}-sku-${idx}`,
          price: prod.price ?? 0,
          inventory: 10,
        };
    newSku.id = newId;
    if (newSku.sku) newSku.sku = `${newSku.sku}-${idx}`;
    if (newSku.sku_code) newSku.sku_code = `${newSku.sku_code}-${idx}`;
    if (newSku.barcode) newSku.barcode = `${newSku.barcode}-${idx}`;
    prod.skus.push(newSku);
    changed = true;
  }
  return changed;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else if (entry.isFile() && res.endsWith(".json")) {
      yield res;
    }
  }
}

async function main() {
  try {
    const stat = await fs.stat(datasetDir);
    if (!stat.isDirectory()) {
      console.error("Dataset path is not a directory:", datasetDir);
      process.exit(1);
    }
  } catch (err) {
    console.error("Dataset directory not found:", datasetDir);
    process.exit(1);
  }

  console.log("Dataset dir:", datasetDir);

  let updated = 0;
  let processed = 0;
  for await (const filePath of walk(datasetDir)) {
    processed++;
    const rel = path.relative(datasetDir, filePath);
    console.log("Processing:", rel);
    let raw;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch (err) {
      console.warn(`Cannot read ${rel}:`, err.message);
      continue;
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.warn(`Skipping ${rel}: invalid JSON (${err.message})`);
      continue;
    }
    const products = Array.isArray(data) ? data : [data];
    let anyChanged = false;
    for (const p of products) {
      const before = (p.skus || []).length;
      const ch = await ensureSkusForProduct(p);
      console.log(
        `  - product id:${p.id ?? p.slug ?? "<no-id>"} skus:${before} -> ${(p.skus || []).length}`,
      );
      if (ch) anyChanged = true;
    }
    if (anyChanged) {
      const out = Array.isArray(data) ? products : products[0];
      await fs.writeFile(filePath, JSON.stringify(out, null, 2), "utf8");
      updated++;
      console.log(` Updated ${rel}`);
    } else {
      console.log(` No change for ${rel}`);
    }
  }

  console.log(`Done. Processed ${processed} files. Updated ${updated} files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
// ...existing code...
