import * as fs from 'fs';
import { promises as fsAsync } from 'fs';
import * as path from 'path';
import { jsonrepair } from 'jsonrepair';

// ==========================================
// CONFIG
// ==========================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b';

const BATCH_SIZE = 30;
const FETCH_TIMEOUT = 60000;

const DATASET_DIR = path.join(__dirname, '../dataset/products');

let isPaused = false;

// ==========================================
// SIGNAL
// ==========================================
process.on('SIGINT', () => {
  console.log('\n🛑 Pausing safely...');
  isPaused = true;
});

// ==========================================
// TYPES
// ==========================================
interface Review {
  rating: number;
  comment: string;
}

interface Product {
  name: string;
  sub_category?: string;
  main_category?: string;
  description_en?: string;
  description_vi?: string;
  reviews?: Review[];
}

interface AIResult {
  id: number;
  en: string;
  vi: string;
}

interface OllamaResponse {
  response: string;
}

// ==========================================
// PROMPT (INDEX SAFE)
// ==========================================
function buildPrompt(items: { id: number; name: string; category: string }[]) {
  return `
Return ONLY JSON array.

Each item MUST keep same id.

Format:
[{id,en,vi}]

Rules:
- en: 45–65 words
- vi: 70–110 words

Input:
${items.map((i) => `${i.id}|${i.name}|${i.category}`).join('\n')}
`;
}

// ==========================================
// REVIEW GENERATOR
// ==========================================
function generateReviews(): Review[] {
  const templates = [
    'Great quality product',
    'Very satisfied with this purchase',
    'Works as expected',
    'Worth the price',
    'Highly recommended',
  ];

  const count = 2 + Math.floor(Math.random() * 3);

  return Array.from({ length: count }).map(() => ({
    rating: 4 + Math.floor(Math.random() * 2),
    comment: templates[Math.floor(Math.random() * templates.length)],
  }));
}

// ==========================================
// SAFE PARSE
// ==========================================
function safeParse(raw: string): AIResult[] | null {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : null;
  } catch {
    try {
      const p = JSON.parse(jsonrepair(raw));
      return Array.isArray(p) ? p : null;
    } catch {
      return null;
    }
  }
}

// ==========================================
// OLLAMA CALL
// ==========================================
async function callOllamaBatch(payload: any[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        format: 'json',
        keep_alive: '1h',
        prompt: buildPrompt(payload),
        options: {
          temperature: 0.2,
          num_predict: 180,
        },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = (await res.json()) as OllamaResponse;

    return safeParse(data.response);
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
}

// ==========================================
// SCAN FILES
// ==========================================
function scan(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;

  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out.push(...scan(p));
    else if (f.endsWith('.json')) out.push(p);
  }

  return out;
}

// ==========================================
// PROCESS FILE (FIXED CORE)
// ==========================================
async function processFile(filePath: string) {
  const relative = path.relative(DATASET_DIR, filePath);

  const products: Product[] = JSON.parse(await fsAsync.readFile(filePath, 'utf-8'));

  console.log(`\n📄 ${relative} (${products.length})`);

  // ❗ FIX: giữ INDEX GỐC, KHÔNG filter mất mapping
  const pendingIndexes: number[] = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.description_en || !p.description_vi) {
      pendingIndexes.push(i);
    }
  }

  console.log(`➡️ pending: ${pendingIndexes.length}`);

  let processed = 0;

  // chunk indexes
  for (let i = 0; i < pendingIndexes.length; i += BATCH_SIZE) {
    if (isPaused) break;

    const batchIndexes = pendingIndexes.slice(i, i + BATCH_SIZE);

    const payload = batchIndexes.map((idx) => ({
      id: idx,
      name: products[idx].name,
      category: products[idx].sub_category || products[idx].main_category || 'general',
    }));

    const results = await callOllamaBatch(payload);

    if (!Array.isArray(results)) {
      console.log('⚠️ AI returned invalid batch');
      continue;
    }

    console.log(`🧠 batch: ${payload.length}, result: ${results.length}`);

    for (const r of results) {
      const product = products[r.id];

      if (!product) continue;

      product.description_en = r.en;
      product.description_vi = r.vi;
      product.reviews = generateReviews();

      processed++;
    }

    // optional save checkpoint
    if (processed % 300 === 0) {
      await fsAsync.writeFile(filePath, JSON.stringify(products));
      console.log(`💾 saved ${processed}`);
    }
  }

  // final write
  await fsAsync.writeFile(filePath, JSON.stringify(products));

  console.log(`✅ DONE ${relative} | updated: ${processed}`);
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  console.log('🚀 FIXED PIPELINE START');

  const files = scan(DATASET_DIR);

  for (const file of files) {
    await processFile(file);
    if (isPaused) break;
  }

  console.log('\n🏁 ALL DONE');
}

main().catch(console.error);
