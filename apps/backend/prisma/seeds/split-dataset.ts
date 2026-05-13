import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.join(__dirname, '../dataset/products');
const targetDir = path.join(__dirname, '../dataset/products_split');

const CHUNK_SIZE = 100;

function splitFile(filePath: string, fileName: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const products = JSON.parse(content) as unknown[];
    if (!Array.isArray(products)) {
      console.log(`⏩ Bỏ qua ${fileName} vì không phải là mảng.`);
      return;
    }

    const baseName = path.basename(fileName, '.json');
    const fileDir = path.join(targetDir, baseName);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    if (products.length <= CHUNK_SIZE) {
      fs.writeFileSync(path.join(fileDir, fileName), JSON.stringify(products, null, 2));
      console.log(`Copied ${fileName} to ${baseName}/`);
      return;
    }

    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      const chunk = products.slice(i, i + CHUNK_SIZE);
      const partNumber = Math.floor(i / CHUNK_SIZE) + 1;
      const newFileName = `${baseName}_part${partNumber}.json`;
      fs.writeFileSync(path.join(fileDir, newFileName), JSON.stringify(chunk, null, 2));
      console.log(`Generated ${newFileName} with ${chunk.length} products in ${baseName}/`);
    }
  } catch (e) {
    console.error(`❌ Lỗi khi xử lý file ${fileName}:`, e);
  }
}

function main() {
  console.log('🚀 Bắt đầu phân nhỏ file JSON...');

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Không tìm thấy thư mục nguồn: ${sourceDir}`);
    return;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Đã tạo thư mục đích: ${targetDir}`);
  }

  const files = fs.readdirSync(sourceDir);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  console.log(`Tìm thấy ${jsonFiles.length} file JSON.`);

  for (const file of jsonFiles) {
    splitFile(path.join(sourceDir, file), file);
  }

  console.log('✅ Hoàn thành phân nhỏ dataset!');
}

main();
