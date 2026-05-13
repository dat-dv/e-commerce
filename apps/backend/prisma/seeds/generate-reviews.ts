import * as fs from 'fs';
import { promises as fsAsync } from 'fs';
import * as path from 'path';
import { jsonrepair } from 'jsonrepair';
import pLimit from 'p-limit';

// ==========================================
// CONFIG
// ==========================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b';

const CONCURRENCY = 2; // Lưu ý: Ollama mặc định xử lý tuần tự, chỉnh cái này lên cao không làm Ollama nhanh hơn nếu chưa set biến môi trường OLLAMA_NUM_PARALLEL
const BATCH_SIZE = 20;
const SAVE_EVERY = 500;
const FETCH_TIMEOUT = 45000;

const DATASET_DIR = path.join(__dirname, '../dataset/products');
const ENRICHED_DIR = path.join(__dirname, '../dataset/enriched/products');
const PROGRESS_FILE = path.join(__dirname, '../dataset/progress.json');

const limit = pLimit(CONCURRENCY);

// ==========================================
// TYPES
// ==========================================
interface Review {
  rating: number;
  comment: string;
}

interface Product {
  id?: number;
  name: string;
  sub_category?: string;
  main_category?: string;
  description_en?: string;
  description_vi?: string;
  reviews?: Review[];
}

interface OllamaGenerateResponse {
  response: string;
}

interface AIProductResult {
  id: number;
  description_en: string;
  description_vi: string;
}

let isPaused = false;

// ==========================================
// SIGNAL HANDLER
// ==========================================
process.on('SIGINT', () => {
  console.log('\n🛑 Pause requested. Saving safely...');
  isPaused = true;
});

// ==========================================
// PROMPT
// ==========================================
function buildPrompt(products: Product[]) {
  return `
Return ONLY raw JSON array.

No markdown.
No explanation.
No wrapping object.

Format:
[
  {
    "id": 0,
    "description_en": "short ecommerce description",
    "description_vi": "mô tả sản phẩm ngắn"
  }
]

Products:
${JSON.stringify(
  products.map((p, index) => ({
    id: index,
    name: p.name,
    category: p.sub_category || p.main_category || 'General',
  })),
)}
`;
}

// ==========================================
// REVIEW GENERATOR (OPTIMIZED - LONG TEXT)
// ==========================================
const reviewOpenings = [
  'I recently purchased this item and I must say,',
  'After looking for a while, I decided to give this a try and',
  'To be completely honest,',
  "I've been using this for a few weeks now and",
  'Bought this as a gift, but I tested it first and',
  'I was initially skeptical about buying this online, however,',
];

const reviewCores = [
  'the overall quality has absolutely blown me away.',
  'it completely exceeded my initial expectations.',
  'it is exactly as described by the seller.',
  'the build quality feels extremely premium and durable.',
  'it offers fantastic value for the money.',
  'I am thoroughly impressed with how well it performs.',
];

const reviewDetails = [
  'The packaging was very secure and shipping was surprisingly fast.',
  'It fits perfectly into my daily routine and makes things so much easier.',
  'The design is incredibly sleek, modern, and very practical to use.',
  "I haven't encountered a single issue since I took it out of the box.",
  'Every minor detail seems to have been carefully thought out by the manufacturer.',
  'Customer service was also very responsive when I had a quick question.',
];

const reviewClosings = [
  'I highly recommend this to anyone on the fence about it!',
  'Will definitely be purchasing from this brand again in the future.',
  '10/10, worth every single penny spent.',
  "You really can't go wrong with this purchase.",
  "I'm already planning to buy another one for my family.",
  "A solid investment that I don't regret at all.",
];

// Bitwise floor cho tốc độ cao hơn Math.floor một chút
function random(min: number, max: number) {
  return ~~(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr: string[]) {
  return arr[random(0, arr.length - 1)];
}

function generateReviews(): Review[] {
  const count = random(2, 4);

  return Array.from({ length: count }).map(() => ({
    rating: random(4, 5),
    // Ghép các thành phần lại tạo thành một đoạn văn dài và tự nhiên
    comment: `${pickRandom(reviewOpenings)} ${pickRandom(reviewCores)} ${pickRandom(reviewDetails)} ${pickRandom(reviewClosings)}`,
  }));
}

// ==========================================
// PROGRESS
// ==========================================
function getCompletedFiles(): string[] {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')) as string[];
  } catch {
    return [];
  }
}

function markFileAsCompleted(filePath: string) {
  const completedFiles = getCompletedFiles();

  if (!completedFiles.includes(filePath)) {
    completedFiles.push(filePath);

    fs.mkdirSync(path.dirname(PROGRESS_FILE), { recursive: true });
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(completedFiles));
  }
}

// ==========================================
// UTILS
// ==========================================
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ==========================================
// SAFE JSON PARSER
// ==========================================
function safeParseAIResponse(raw: string): AIProductResult[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.results)) return parsed.results;
    if (Array.isArray(parsed.products)) return parsed.products;
    return null;
  } catch {
    try {
      const repaired = JSON.parse(jsonrepair(raw));
      if (Array.isArray(repaired)) return repaired;
      if (Array.isArray(repaired.results)) return repaired.results;
      if (Array.isArray(repaired.products)) return repaired.products;
      return null;
    } catch {
      return null;
    }
  }
}

// ==========================================
// OLLAMA BATCH CALL
// ==========================================
async function callOllamaBatch(products: Product[]): Promise<AIProductResult[] | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        format: 'json',
        keep_alive: '30m',
        prompt: buildPrompt(products),
        options: {
          temperature: 0.2,
          num_predict: 150, // Tăng nhẹ để đảm bảo generate đủ response nếu batch dài
          num_ctx: 2048,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}`);
      return null;
    }

    const data = (await response.json()) as OllamaGenerateResponse;
    const parsed = safeParseAIResponse(data.response);

    if (!parsed) {
      console.error('❌ Invalid AI response');
      return null;
    }

    return parsed;
  } catch (e: unknown) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === 'AbortError') {
      console.error('⏳ Request timeout');
    } else if (e instanceof Error) {
      console.error(`⚠️ ${e.message}`);
    }
    return null;
  }
}

// ==========================================
// PROCESS FILE
// ==========================================
async function processFile(filePath: string) {
  const relativePath = path.relative(DATASET_DIR, filePath);
  const targetPath = path.join(ENRICHED_DIR, relativePath);

  await fsAsync.mkdir(path.dirname(targetPath), { recursive: true });

  let products: Product[] = JSON.parse(await fsAsync.readFile(filePath, 'utf-8')) as Product[];

  // resume
  if (fs.existsSync(targetPath)) {
    try {
      const existing = JSON.parse(await fsAsync.readFile(targetPath, 'utf-8')) as Product[];
      if (existing.length === products.length) {
        products = existing;
      }
    } catch {
      // Ignore
    }
  }

  console.log(`\n📄 ${relativePath} (${products.length} products)`);

  const pendingProducts = products.filter((p) => !p.description_vi || !p.description_en || !p.reviews);

  const batches = chunkArray(pendingProducts, BATCH_SIZE);
  let processedCount = 0;

  // LOCK system để tránh ghi file đè chéo nhau khi xử lý song song gây corrupt JSON
  let isSaving = false;

  const tasks = batches.map((batch) =>
    limit(async () => {
      if (isPaused) return;

      const productMap = new Map<number, Product>();
      batch.forEach((product, index) => {
        productMap.set(index, product);
      });

      const results = await callOllamaBatch(batch);

      if (!Array.isArray(results)) return;

      for (const result of results) {
        const product = productMap.get(result.id);
        if (!product) continue;

        product.description_en = result.description_en;
        product.description_vi = result.description_vi;
        product.reviews = generateReviews();

        processedCount++;

        // Logic lưu file an toàn, sử dụng lock để tránh I/O bottleneck
        if (processedCount % SAVE_EVERY === 0 && !isPaused && !isSaving) {
          isSaving = true;
          try {
            await fsAsync.writeFile(targetPath, JSON.stringify(products));
            console.log(`💾 Saved ${processedCount} - ${relativePath}`);
          } finally {
            isSaving = false;
          }
        }
      }
    }),
  );

  await Promise.all(tasks);

  // Lưu final một lần nữa để chắc chắn không miss data cuối
  if (!isSaving) {
    await fsAsync.writeFile(targetPath, JSON.stringify(products));
  }

  if (isPaused) {
    console.log(`⏸️ Safely paused at ${relativePath}`);
    process.exit(0);
  }

  markFileAsCompleted(filePath);
  console.log(`✅ Done ${relativePath}`);
}

// ==========================================
// FILE SCAN
// ==========================================
function getAllFiles(dir: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) {
      results.push(...getAllFiles(fp));
    } else if (file.endsWith('.json')) {
      results.push(fp);
    }
  }

  return results;
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  console.log('🚀 Starting enrichment pipeline...');

  const files = getAllFiles(DATASET_DIR);
  const completedFiles = getCompletedFiles();

  for (const file of files) {
    if (completedFiles.includes(file)) continue;

    await processFile(file);

    if (isPaused) break;
  }

  if (!isPaused) {
    console.log('\n🏁 ALL DONE');
  }
}

main().catch(console.error);
