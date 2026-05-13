// @ts-nocheck
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as path from 'path';

const DATASET_DIR = path.join(__dirname, '../dataset/products');

// ==========================================
// TEMPLATES
// ==========================================
const REVIEW_COMMENTS = [
  'Great quality, very happy with this purchase!',
  'Exactly as described, fast delivery.',
  'Worth every penny, highly recommend.',
  'Good value for money.',
  'Works perfectly, no complaints.',
  'Exceeded my expectations.',
  'Solid product, will buy again.',
  'Very satisfied with the quality.',
  'Packaging was great, product is as expected.',
  'Highly recommended for anyone looking for this.',
  'Five stars! Amazing product.',
  'Does what it says. Very happy.',
  'Great purchase, loved it.',
  'Perfect for daily use.',
  'Top quality, fast shipping.',
];

const REVIEW_COMMENTS_VI = [
  'Sản phẩm chất lượng tốt, rất hài lòng.',
  'Đúng như mô tả, giao hàng nhanh.',
  'Xứng đáng với giá tiền, khuyên dùng.',
  'Giá trị tốt cho số tiền bỏ ra.',
  'Hoạt động hoàn hảo, không có vấn đề gì.',
  'Vượt quá kỳ vọng của tôi.',
  'Sản phẩm tốt, sẽ mua lại lần sau.',
  'Rất hài lòng với chất lượng sản phẩm.',
  'Đóng gói cẩn thận, sản phẩm đúng như kỳ vọng.',
  'Khuyên dùng cho ai đang tìm kiếm sản phẩm này.',
  'Tuyệt vời! Sản phẩm xuất sắc.',
  'Làm đúng chức năng. Rất hài lòng.',
  'Mua hàng tuyệt vời, rất thích.',
  'Phù hợp để sử dụng hàng ngày.',
  'Chất lượng cao, giao hàng nhanh.',
];

const DESCRIPTION_EN_TEMPLATES = [
  (name: string, cat: string) =>
    `${name} is a premium product in the ${cat} category. Designed for quality and reliability, it meets the needs of everyday users.`,
  (name: string, cat: string) =>
    `Discover ${name} — a top-rated item in ${cat}. Built with care and attention to detail for the best user experience.`,
  (name: string, cat: string) =>
    `${name} offers excellent performance and value in the ${cat} segment. A must-have for those seeking quality.`,
];

const DESCRIPTION_VI_TEMPLATES = [
  (name: string, cat: string) =>
    `${name} là sản phẩm cao cấp trong danh mục ${cat}. Được thiết kế để đảm bảo chất lượng và độ tin cậy, đáp ứng nhu cầu sử dụng hàng ngày.`,
  (name: string, cat: string) =>
    `Khám phá ${name} — sản phẩm được đánh giá cao trong danh mục ${cat}. Được chế tác tỉ mỉ mang lại trải nghiệm tốt nhất cho người dùng.`,
  (name: string, cat: string) =>
    `${name} mang lại hiệu suất và giá trị xuất sắc trong phân khúc ${cat}. Lựa chọn tuyệt vời cho những ai tìm kiếm chất lượng tốt.`,
];

function rng(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReviews() {
  const count = 2 + Math.floor(Math.random() * 3); // 2-4 reviews
  return Array.from({ length: count }).map(() => ({
    rating: 4 + Math.floor(Math.random() * 2), // 4 or 5
    comment: rng(REVIEW_COMMENTS),
  }));
}

function generateDescriptions(name: string, category: string) {
  const tplIdx = Math.floor(Math.random() * DESCRIPTION_EN_TEMPLATES.length);
  return {
    description_en: DESCRIPTION_EN_TEMPLATES[tplIdx](name, category),
    description_vi: DESCRIPTION_VI_TEMPLATES[tplIdx](name, category),
  };
}

// ==========================================
// SCAN
// ==========================================
function scan(dir: string): string[] {
  const out: string[] = [];
  if (!fsSync.existsSync(dir)) return out;

  for (const f of fsSync.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fsSync.statSync(p).isDirectory()) out.push(...scan(p));
    else if (f.endsWith('.json')) out.push(p);
  }
  return out;
}

// ==========================================
// PROCESS ONE FILE
// ==========================================
async function fillFile(filePath: string): Promise<{ file: string; filled: number }> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const products: any[] = JSON.parse(raw);

  let filled = 0;

  for (const p of products) {
    if (!p.reviews || p.reviews.length === 0) {
      p.reviews = generateReviews();
      filled++;
    }
    // Cũng fill description nếu trống hoặc là placeholder
    if (
      !p.description_en ||
      p.description_en === 'short ecommerce description' ||
      p.description_en.length < 20
    ) {
      const cat = p.sub_category || p.main_category || 'general';
      const descs = generateDescriptions(p.pure_name || p.name, cat);
      p.description_en = descs.description_en;
      p.description_vi = descs.description_vi;
    }
  }

  if (filled > 0) {
    await fs.writeFile(filePath, JSON.stringify(products));
  }

  return { file: path.relative(DATASET_DIR, filePath), filled };
}

// ==========================================
// MAIN — XỬ LÝ SONG SONG TẤT CẢ FILES
// ==========================================
async function main() {
  console.log('⚡ FAST-FILL START (no Ollama)');
  const start = Date.now();

  const allFiles = scan(DATASET_DIR);
  console.log(`📦 Tổng files: ${allFiles.length}`);

  // Đọc song song để check nhanh
  console.log('🔍 Scanning pending files...');
  const checkResults = await Promise.all(
    allFiles.map(async (file) => {
      const raw = await fs.readFile(file, 'utf-8');
      const products: any[] = JSON.parse(raw);
      const hasPending = products.some((p) => !p.reviews || p.reviews.length === 0);
      return { file, hasPending };
    }),
  );

  const pendingFiles = checkResults.filter((r) => r.hasPending).map((r) => r.file);
  console.log(`✅ Pending files: ${pendingFiles.length} / ${allFiles.length}`);

  // Fill tất cả song song (thuần JS, không Ollama → không cần giới hạn concurrency)
  console.log('\n🚀 Filling all pending files in parallel...');

  const CHUNK_SIZE = 50; // Xử lý 50 files/lần để tránh quá nhiều I/O
  let totalFilled = 0;
  let processed = 0;

  for (let i = 0; i < pendingFiles.length; i += CHUNK_SIZE) {
    const chunk = pendingFiles.slice(i, i + CHUNK_SIZE);
    const results = await Promise.all(chunk.map(fillFile));

    for (const r of results) {
      totalFilled += r.filled;
      processed++;
      if (r.filled > 0) {
        process.stdout.write(`\r✍️  ${processed}/${pendingFiles.length} files | ${totalFilled} products filled`);
      }
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n\n🏁 DONE! ${totalFilled} products filled in ${elapsed}s`);
}

main().catch(console.error);
