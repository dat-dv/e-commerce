// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import { TOP_BRANDS_DATA } from './top-brands.data.ts';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
};

async function isImageAlive(url: string): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', headers: HEADERS, timeout: 5000 });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function main() {
  console.log('🚀 Bắt đầu kiểm tra và làm sạch hình ảnh cho Top Brands...');

  const results = [];

  for (const brand of TOP_BRANDS_DATA) {
    console.log(`\n🔍 Đang kiểm tra: ${brand.name}`);

    // 1. Check Logo & Banner
    if (!(await isImageAlive(brand.logo))) {
      console.log(`  ❌ Logo die. Đang tìm placeholder...`);
      brand.logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=random&size=512`;
    } else {
      process.stdout.write(' ✅ Logo OK');
    }

    if (!(await isImageAlive(brand.banner))) {
      console.log(`  ❌ Banner die. Xóa banner lỗi.`);
      brand.banner = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop'; // Default premium office banner
    } else {
      process.stdout.write(' ✅ Banner OK');
    }

    // 2. Check Gallery Images
    const validGallery = [];
    for (const img of brand.images) {
      if (await isImageAlive(img)) {
        validGallery.push(img);
        process.stdout.write(' ⭐');
      } else {
        process.stdout.write(' 🗑️');
      }
    }
    brand.images = validGallery;

    results.push(brand);
  }

  const filePath = path.join(__dirname, 'top-brands.data.ts');
  const fileContent = `export const TOP_BRANDS_DATA = ${JSON.stringify(results, null, 2)};`;
  fs.writeFileSync(filePath, fileContent);

  console.log('\n\n✅ HOÀN THÀNH! Dữ liệu hình ảnh đã được làm sạch và cập nhật.');
}

main();
