// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import 'dotenv/config';
import * as fs from 'fs';
import { promises as fsAsync } from 'fs';
import * as path from 'path';
import { jsonrepair } from 'jsonrepair';

// ==========================================
// CONFIG (SAFE + WORKING)
// ==========================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b';

const BATCH_SIZE = 1; // ⚠️ FIX: Số lượng sản phẩm gom vào 1 prompt (để 1 cho an toàn)
const CONCURRENCY_LIMIT = 4; // 🚀 Tốc độ x4: Chạy song song 4 luồng
const FETCH_TIMEOUT = 120000; // Tăng timeout do model có thể sinh chậm

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
interface Product {
  name: string;
  sub_category?: string;
  main_category?: string;
  description_en?: string;
  description_vi?: string;
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
// PROMPT (ROBUST)
// ==========================================
function buildPrompt(items: { id: number; name: string; category: string }[]) {
  return `
You are a strict JSON generator.

Return ONLY valid JSON array.

Each item must match EXACTLY:
{id:number,en:string,vi:string}

Rules:
- no markdown
- no extra text
- keep id unchanged
- en: 50–70 words
- vi: 80–120 words

DATA:
${items.map((i) => `${i.id}|${i.name}|${i.category}`).join('\n')}
`;
}

// ==========================================
// REVIEW GENERATOR
// ==========================================
function generateReviews() {
  const templates = ['Great quality', 'Very satisfied', 'Worth the price', 'Works perfectly', 'Highly recommended'];

  const count = 2 + Math.floor(Math.random() * 3);

  return Array.from({ length: count }).map(() => ({
    rating: 4 + Math.floor(Math.random() * 2),
    comment: templates[Math.floor(Math.random() * templates.length)],
  }));
}

// ==========================================
// SAFE PARSER (VERY IMPORTANT)
// ==========================================
function safeParse(raw: string): AIResult[] | null {
  try {
    const p = JSON.parse(raw);
    if (Array.isArray(p)) return p;
    if (p && Array.isArray(p.results)) return p.results;
    if (p && Array.isArray(p.items)) return p.items;
    if (p && typeof p === 'object' && p.id !== undefined) return [p];
    return null;
  } catch {
    try {
      const p = JSON.parse(jsonrepair(raw));
      if (Array.isArray(p)) return p;
      if (p && Array.isArray(p.results)) return p.results;
      if (p && Array.isArray(p.items)) return p.items;
      if (p && typeof p === 'object' && p.id !== undefined) return [p];
      return null;
    } catch {
      return null;
    }
  }
}

// ==========================================
// OLLAMA CALL (FIXED)
// ==========================================
async function callOllamaBatch(batch: any[]) {
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
        prompt: buildPrompt(batch),
        options: {
          temperature: 0.2,
          num_ctx: 8192, // ⚠️ FIX: tăng context window
          num_predict: 4000, // ⚠️ FIX: tăng để không bị cut JSON
        },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.log('HTTP ERROR:', res.status);
      return null;
    }

    const data = (await res.json()) as OllamaResponse;

    const parsed = safeParse(data.response);

    if (!parsed) {
      console.log('❌ PARSE FAILED');
      console.log('RAW:', data.response.slice(0, 300));
      return null;
    }

    return parsed;
  } catch (e) {
    clearTimeout(timeout);
    console.log('❌ REQUEST FAILED', e);
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
// PROCESS FILE (FIXED CORE LOGIC)
// ==========================================
async function processFile(filePath: string) {
  const relative = path.relative(DATASET_DIR, filePath);

  const products: Product[] = JSON.parse(await fsAsync.readFile(filePath, 'utf-8'));

  console.log(`\n📄 ${relative} (${products.length})`);

  // ⚠️ FIX: GIỮ INDEX GỐC
  const pendingIndexes: number[] = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i] as any;
    // Nếu sản phẩm chưa có mảng reviews thì tức là chưa được AI xử lý
    if (!p.reviews || p.reviews.length === 0) {
      pendingIndexes.push(i);
    }
  }

  console.log(`➡️ pending: ${pendingIndexes.length}`);

  let updated = 0;

  // chunk
  for (let i = 0; i < pendingIndexes.length; i += BATCH_SIZE * CONCURRENCY_LIMIT) {
    if (isPaused) break;

    const chunkIdx = pendingIndexes.slice(i, i + BATCH_SIZE * CONCURRENCY_LIMIT);
    const promises = [];

    // Tạo các promise chạy song song
    for (let j = 0; j < chunkIdx.length; j += BATCH_SIZE) {
      const batchIdx = chunkIdx.slice(j, j + BATCH_SIZE);
      const payload = batchIdx.map((idx) => ({
        id: idx,
        name: products[idx].name,
        category: products[idx].sub_category || products[idx].main_category || 'general',
      }));
      promises.push(callOllamaBatch(payload));
    }

    // Chờ tất cả luồng chạy xong
    const resultsArray = await Promise.all(promises);

    for (const results of resultsArray) {
      if (!Array.isArray(results)) {
        console.log('⚠️ invalid batch result');
        continue;
      }

      console.log(`🧠 thread done → ${results.length}`);

      for (const r of results) {
        const product = products[r.id];

        if (!product) continue;

        product.description_en = r.en;
        product.description_vi = r.vi;
        product.reviews = generateReviews();

        updated++;
      }
    }

    // safe write
    if (updated % 200 === 0) {
      await fsAsync.writeFile(filePath, JSON.stringify(products));
      console.log(`💾 saved ${updated}`);
    }
  }

  await fsAsync.writeFile(filePath, JSON.stringify(products));

  console.log(`✅ DONE ${relative} | updated: ${updated}`);
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  console.log('🚀 PIPELINE START (FIXED)');

  const files = scan(DATASET_DIR);

  for (const file of files) {
    await processFile(file);

    if (isPaused) break;
  }

  console.log('\n🏁 DONE ALL');
}

main().catch(console.error);
