import * as fs from 'fs';
import { promises as fsAsync } from 'fs';
import * as path from 'path';
import { jsonrepair } from 'jsonrepair';
import pLimit from 'p-limit';

// ==========================================
// 1. CẤU HÌNH HỆ THỐNG
// ==========================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:0.5b';

// TỐI ƯU LUỒNG: Để 4-8 tuỳ vào cấu hình máy (VRAM/RAM)
const CONCURRENCY = 5;
const SAVE_EVERY = 100;
const FETCH_TIMEOUT = 45000; // 45 giây tối đa cho 1 sản phẩm tránh treo

const DATASET_DIR = path.join(__dirname, '../dataset/products');
const ENRICHED_DIR = path.join(__dirname, '../dataset/enriched/products');
const PROGRESS_FILE = path.join(__dirname, '../dataset/progress.json');

const limit = pLimit(CONCURRENCY);

// ==========================================
// 2. INTERFACE & BIẾN TOÀN CỤC
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

interface OllamaResult {
  description_vi: string;
  description_en: string;
  reviews: Review[];
}

interface OllamaGenerateResponse {
  response: string;
}

// Biến cờ hiệu để bắt sự kiện Tạm Dừng (Ctrl + C)
let isPaused = false;

// Bắt sự kiện người dùng bấm Ctrl + C
process.on('SIGINT', () => {
  console.log(
    '\n🛑 NHẬN LỆNH DỪNG (PAUSE)! Đang hoàn tất các tác vụ dang dở và lưu file an toàn. Vui lòng đợi vài giây...',
  );
  isPaused = true;
});

const REVIEW_PROMPT_TEMPLATE = `
Generate professional ecommerce content for this product.
Return ONLY valid JSON.

Product: {{PRODUCT_INFO}}

JSON Structure:
{
  "description_vi": "50-80 words in Vietnamese, persuasive",
  "description_en": "30-50 words in English",
  "reviews": [
    {"rating": 5, "comment": "natural short review"}
  ]
}
`;

// ==========================================
// 3. CÁC HÀM XỬ LÝ TIẾN ĐỘ (TRACKING)
// ==========================================
function getCompletedFiles(): string[] {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')) as string[];
    } catch {
      return [];
    }
  }
  return [];
}

function markFileAsCompleted(filePath: string) {
  const completedFiles = getCompletedFiles();
  if (!completedFiles.includes(filePath)) {
    completedFiles.push(filePath);
    fs.mkdirSync(path.dirname(PROGRESS_FILE), { recursive: true });
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(completedFiles, null, 2));
  }
}

// ==========================================
// 4. HÀM GỌI OLLAMA (CÓ TIMEOUT & JSON MODE)
// ==========================================
async function callOllama(product: Product): Promise<OllamaResult | null> {
  const productInfo = `Name: ${product.name}, Category: ${product.sub_category || 'N/A'}`;
  const prompt = REVIEW_PROMPT_TEMPLATE.replace('{{PRODUCT_INFO}}', productInfo);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        format: 'json', // Bắt buộc trả về JSON chuẩn, chống rác chữ
        options: {
          temperature: 0.3,
          num_predict: 500,
          num_ctx: 2048,
        },
      }),
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;

    const data = (await response.json()) as OllamaGenerateResponse;
    const content = data.response;

    try {
      return JSON.parse(content) as OllamaResult;
    } catch {
      return JSON.parse(jsonrepair(content)) as OllamaResult;
    }
  } catch (e: unknown) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === 'AbortError') {
      console.log(`⏳ Timeout: Bỏ qua ${product.name.substring(0, 20)}...`);
    } else {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error(`⚠️ Lỗi Ollama: ${errorMsg}`);
    }
    return null;
  }
}

// ==========================================
// 5. HÀM XỬ LÝ TỪNG FILE
// ==========================================
async function processFile(filePath: string) {
  const relativePath = path.relative(DATASET_DIR, filePath);
  const targetPath = path.join(ENRICHED_DIR, relativePath);

  await fsAsync.mkdir(path.dirname(targetPath), { recursive: true });

  let products: Product[] = JSON.parse(await fsAsync.readFile(filePath, 'utf-8')) as Product[];

  // Nạp lại file đích nếu đã chạy dở dang trước đó
  if (fs.existsSync(targetPath)) {
    try {
      const existing = JSON.parse(await fsAsync.readFile(targetPath, 'utf-8')) as Product[];
      if (existing.length === products.length) products = existing;
    } catch (e) {
      // Bỏ qua nếu file không tồn tại hoặc lỗi định dạng
    }
  }

  console.log(`\n📄 Đang xử lý: ${relativePath} (${products.length} sản phẩm)`);

  let count = 0;
  let processedItems = 0;

  const tasks = products.map((product) =>
    limit(async () => {
      // DỪNG LẠI nếu người dùng bấm Ctrl + C
      if (isPaused) return;

      // BỎ QUA nếu sản phẩm này đã được làm (Resume ở cấp độ dòng)
      if (product.description_vi && product.reviews && product.reviews.length >= 1) return;

      const result = await callOllama(product);
      if (result) {
        product.description_vi = result.description_vi;
        product.description_en = result.description_en;
        product.reviews = result.reviews;
      }

      count++;
      processedItems++;

      // Ghi file định kỳ
      if (count % SAVE_EVERY === 0 && !isPaused) {
        await fsAsync.writeFile(targetPath, JSON.stringify(products, null, 2));
        console.log(`💾 Checkpoint: ${count} - ${relativePath}`);
      }
    }),
  );

  // Chờ tất cả luồng chạy xong (hoặc chờ các luồng hiện tại dừng hẳn nếu Pause)
  await Promise.all(tasks);

  // Bắt buộc lưu lại file lần cuối
  await fsAsync.writeFile(targetPath, JSON.stringify(products, null, 2));

  if (isPaused) {
    console.log(`⏸️ Đã lưu an toàn tiến độ. Đang dừng ở file: ${relativePath}`);
    process.exit(0); // Tắt script hoàn toàn
  } else {
    // Chỉ khi không bị pause (tức là chạy xong trọn vẹn 100% file) thì mới đánh dấu completed
    markFileAsCompleted(filePath);
    console.log(`✅ Hoàn thành 100% và đã ghi nhận tiến độ: ${relativePath}`);
  }
}

// ==========================================
// 6. HÀM CHÍNH (MAIN)
// ==========================================
async function main() {
  console.log('🚀 KHỞI ĐỘNG HỆ THỐNG LÀM GIÀU DỮ LIỆU...');

  const getAllFiles = (dir: string): string[] => {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fp = path.join(dir, file);
      if (fs.statSync(fp).isDirectory()) results.push(...getAllFiles(fp));
      else if (file.endsWith('.json')) results.push(fp);
    }
    return results;
  };

  const files = getAllFiles(DATASET_DIR);
  const completedFiles = getCompletedFiles();

  for (const file of files) {
    // NHẢY CÓC các file đã xử lý xong (Resume ở cấp độ File)
    if (completedFiles.includes(file)) {
      continue;
    }

    await processFile(file);

    // Nếu script bị Pause, thoát khỏi vòng lặp quét file
    if (isPaused) break;
  }

  if (!isPaused) {
    console.log('\n🏁 HOÀN THÀNH TOÀN BỘ DATASET! CHÚC MỪNG!');
  }
}

main().catch(console.error);
