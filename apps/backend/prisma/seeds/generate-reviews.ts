import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b';
const CONCURRENCY = 5;
const SAVE_EVERY = 20;

const DATASET_DIR = path.join(__dirname, '../dataset/products');
const ENRICHED_DIR = path.join(__dirname, '../dataset/enriched/products');

interface Review {
  rating: number;
  title: string;
  comment: string;
}

interface Product {
  name: string;
  sub_category?: string;
  main_category?: string;
  description_en?: string;
  description_vi?: string;
  ratings?: number;
  reviews?: Review[];
}

interface OllamaResult {
  description_vi: string;
  reviews: Review[];
}

interface OllamaGenerateResponse {
  response: string;
}

interface QueueItem<T = unknown> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

function createLimit(concurrency: number) {
  const queue: QueueItem[] = [];
  let activeCount = 0;

  const next = () => {
    if (queue.length === 0 || activeCount >= concurrency) return;
    activeCount++;
    const item = queue.shift();
    if (!item) return;

    const { fn, resolve, reject } = item;
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeCount--;
        next();
      });
  };

  return <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}

const limit = createLimit(CONCURRENCY);

const REVIEW_PROMPT_TEMPLATE = `
Product Info:
{{PRODUCT_INFO}}

Task:
1. Write a professional, detailed product description in Vietnamese (description_vi), at least 150 words.
2. Generate 5 realistic customer reviews in Vietnamese (reviews).

Return ONLY a valid JSON object:
{
  "description_vi": "...",
  "reviews": [
    { "rating": 5, "title": "...", "comment": "..." }
  ]
}

Rules:
- Vietnamese only.
- Casual tone for reviews.
- Professional tone for description.
- No markdown, no extra text.
`;

function cleanJson(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return text.substring(start, end + 1);
  }
  return text.trim();
}

async function callOllama(product: Product): Promise<OllamaResult | null> {
  const productInfo = `
Name: ${product.name}
Category: ${product.sub_category || 'N/A'}
Description (EN): ${product.description_en || 'N/A'}
`;

  const prompt = REVIEW_PROMPT_TEMPLATE.replace('{{PRODUCT_INFO}}', productInfo);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.7, num_predict: 800 },
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as OllamaGenerateResponse;
    const cleaned = cleanJson(data.response);
    return JSON.parse(cleaned) as OllamaResult;
  } catch (e) {
    return null;
  }
}

function getAllJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  }
  return results;
}

async function processFile(filePath: string) {
  const relativePath = path.relative(DATASET_DIR, filePath);
  const targetPath = path.join(ENRICHED_DIR, relativePath);

  console.log(`\n📄 Processing: ${relativePath}`);

  // Đọc từ file gốc
  let products: Product[];
  try {
    products = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Product[];
  } catch (e) {
    console.error(`❌ Lỗi đọc file: ${filePath}`);
    return;
  }

  // Nếu file đích đã tồn tại (đã chạy dở), đọc từ file đích để không mất tiến độ
  if (fs.existsSync(targetPath)) {
    try {
      products = JSON.parse(fs.readFileSync(targetPath, 'utf-8')) as Product[];
    } catch (e) {
      //
    }
  }

  let processed = 0;
  const tasks = products.map((product, index) =>
    limit(async () => {
      // SKIP nếu đã có review và description dài (chống chạy trùng)
      if ((product.reviews?.length ?? 0) > 0 && (product.description_vi?.length ?? 0) > 200) return;

      console.log(`🤖 [${index + 1}/${products.length}] ${product.name.substring(0, 40)}`);
      const result = await callOllama(product);

      if (result) {
        if (result.description_vi) product.description_vi = result.description_vi;
        if (result.reviews) {
          if (!product.reviews) product.reviews = [];
          product.reviews.push(...result.reviews);
        }

        processed++;
        if (processed % SAVE_EVERY === 0) {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, JSON.stringify(products, null, 2));
        }
      }
    }),
  );

  await Promise.all(tasks);

  // Lưu file cuối cùng vào thư mục ENRICHED
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(products, null, 2));
  console.log(`✅ Saved to: ${targetPath}`);
}

async function main() {
  console.log('🚀 Bắt đầu quá trình "Xịn hóa" Dataset (Lưu vào thư mục enriched)...');
  const files = getAllJsonFiles(DATASET_DIR);

  for (const file of files) {
    await processFile(file);
  }

  console.log('\n🏁 Hoàn thành toàn bộ!');
}

main().catch(console.error);
