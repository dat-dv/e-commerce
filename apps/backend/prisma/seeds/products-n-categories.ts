import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export interface AmazonSku {
  sku_code: string;
  price: number;
  stock: number;
  attributes: Record<string, string> | null;
}

export interface AmazonProduct {
  name: string;
  main_category: string;
  sub_category: string;
  image: string | string[];
  link: string;
  ratings: string | null;
  no_of_ratings: string | null;
  discount_price?: string | null;
  actual_price?: string | null;
  actual_price_vnd: number;
  discount_price_vnd: number;
  pure_name: string;
  attributes: Record<string, string> | null;
  name_vi: string;
  description_vi: string;
  description_en: string;
  skus: AmazonSku[];
  brand?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng -
    .replace(/[^\w-]+/g, '') // Xoá ký tự đặc biệt
    .replace(/--+/g, '-'); // Xoá nhiều - liên tiếp
}

export async function seedProductsAndCategories(prisma: PrismaClient, brandMap: Record<string, string> = {}) {
  const fileName = process.argv[2];
  let filesToProcess: string[] = [];

  const isDevSeed = !true;
  const datasetDir = path.join(__dirname, '../dataset/products');

  if (fileName) {
    filesToProcess.push(fileName);
  } else {
    console.log('ℹ️ Không có file cụ thể được chỉ định. Đang quét toàn bộ file JSON trong thư mục dataset...');
    if (fs.existsSync(datasetDir)) {
      const files = fs.readdirSync(datasetDir);
      filesToProcess = files.filter((file) => {
        if (!file.endsWith('.json')) return false;
        const stats = fs.statSync(path.join(datasetDir, file));
        return stats.size <= 5 * 1024 * 1024;
      });

      if (isDevSeed) {
        filesToProcess = filesToProcess.slice(0, 5);
        console.log(`ℹ️ Chế độ Dev Seed: Chỉ lấy ${filesToProcess.length} file đầu tiên để seed.`);
      }
    }
    console.log(`Tìm thấy ${filesToProcess.length} file JSON hợp lệ để seed.`);
  }

  const langVi = await prisma.language.findUnique({ where: { code: 'vi' } });
  const langEn = await prisma.language.findUnique({ where: { code: 'en' } });

  if (!langVi || !langEn) {
    console.error('❌ Không tìm thấy ngôn ngữ "vi" hoặc "en" trong DB. Vui lòng chạy seed hệ thống trước!');
    return;
  }

  for (const file of filesToProcess) {
    const filePath = path.join(datasetDir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Không tìm thấy file tại: ${filePath}`);
      continue;
    }

    console.log(`\n🚀 Bắt đầu seed dữ liệu từ file: ${file}...`);

    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
      console.error(`❌ Lỗi khi đọc file ${file}`);
      continue;
    }

    let products: AmazonProduct[];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      products = JSON.parse(fileContent || '');
      if (!Array.isArray(products)) {
        console.log(`⏩ Bỏ qua ${file} vì không phải là mảng sản phẩm.`);
        continue;
      }
    } catch (e) {
      console.log(`⏩ Bỏ qua ${file} vì lỗi parse JSON.`);
      continue;
    }

    console.log(`Tìm thấy ${products.length} sản phẩm. Đang xử lý...`);

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (i % 50 === 0 && i > 0) {
        console.log(`... Đã xử lý ${i}/${products.length} sản phẩm`);
      }

      const imageUrl = Array.isArray(p.image) ? p.image[0] : p.image;

      try {
        // 1. Tạo Category (Main & Sub) trước để lấy ID
        const mainCategorySlug = slugify(p.main_category);
        const subCategorySlug = slugify(p.sub_category);

        const mainCategory = await prisma.productCategory.upsert({
          where: { slug: mainCategorySlug },
          update: {},
          create: {
            slug: mainCategorySlug,
            level: 1,
            translations: {
              create: [
                { language_id: langVi.id, name: p.main_category },
                { language_id: langEn.id, name: p.main_category },
              ],
            },
          },
        });

        const subCategory = await prisma.productCategory.upsert({
          where: { slug: subCategorySlug },
          update: {},
          create: {
            slug: subCategorySlug,
            level: 2,
            parent_id: mainCategory.id,
            translations: {
              create: [
                { language_id: langVi.id, name: p.sub_category },
                { language_id: langEn.id, name: p.sub_category },
              ],
            },
          },
        });

        // 2. KIỂM TRA TRÙNG SKU TRƯỚC KHI TẠO PRODUCT
        // Lấy danh sách mã SKU của sản phẩm hiện tại
        const skuCodes = p.skus.map((sku) => sku.sku_code);

        // Tìm xem có SKU nào đã tồn tại trong DB chưa
        const existingSku = await prisma.sku.findFirst({
          where: {
            sku_code: { in: skuCodes },
          },
        });

        if (existingSku) {
          // Sản phẩm đã tồn tại! Ta chỉ cần link nó vào danh mục mới nếu chưa có
          const existingMapping = await prisma.productCategoryMapping.findUnique({
            where: {
              product_id_category_id: {
                product_id: existingSku.product_id,
                category_id: subCategory.id,
              },
            },
          });

          if (!existingMapping) {
            await prisma.productCategoryMapping.create({
              data: {
                product_id: existingSku.product_id,
                category_id: subCategory.id,
              },
            });
            // console.log(`🔗 Đã liên kết sản phẩm trùng "${p.pure_name}" vào danh mục mới.`);
          }

          // Bỏ qua không tạo sản phẩm mới nữa
          continue;
        }

        // 3. Tạo Image cho Thumbnail
        const thumbnail = await prisma.image.create({
          data: {
            url: imageUrl || '',
            publicId: imageUrl || `placeholder-${Date.now()}`,
          },
        });

        // 4. Tạo Product và các mối quan hệ (Vì chưa tồn tại)
        await prisma.product.create({
          data: {
            status: 1, // ACTIVE
            thumbnail_id: thumbnail.id,
            brand_id: p.brand ? brandMap[p.brand] : null,
            translations: {
              create: [
                { language_id: langVi.id, name: p.name_vi, description: p.description_vi },
                { language_id: langEn.id, name: p.name, description: p.description_en },
              ],
            },
            categories: {
              create: [{ category_id: subCategory.id }],
            },
            skus: {
              create: p.skus.map((sku) => ({
                sku_code: sku.sku_code,
                price: sku.price,
                original_price: p.actual_price_vnd,
                stock: sku.stock,
                image_url: imageUrl,
              })),
            },
          },
        });
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error(`❌ Lỗi khi seed sản phẩm ${p.pure_name}:`, error.message);
      }
    }
    console.log(`✅ Hoàn thành seed file: ${file}!`);
  }
}
