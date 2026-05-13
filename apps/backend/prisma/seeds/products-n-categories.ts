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
  reviews?: {
    rating: number;
    title: string;
    comment: string;
  }[];
}

export enum ProductStatus {
  DRAFT = 0,
  ACTIVE = 1,
  OUT_OF_STOCK = 2,
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

function getAllJsonFiles(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath, baseDir));
    } else if (file.endsWith('.json')) {
      // Giới hạn size file JSON là 5MB để tránh crash memory
      if (stat.size <= 5 * 1024 * 1024) {
        results.push(path.relative(baseDir, filePath));
      } else {
        console.warn(`⚠️ Bỏ qua file quá lớn (>5MB): ${filePath}`);
      }
    }
  });
  return results;
}

export async function seedProductsAndCategories(prisma: PrismaClient, brandMap: Record<string, string> = {}) {
  const fileName = process.argv[2];
  let filesToProcess: string[] = [];

  const isDevSeed = false;
  const originalDatasetDir = path.join(__dirname, '../dataset/products');
  const enrichedDatasetDir = path.join(__dirname, '../dataset/enriched/products');

  // Ưu tiên dùng thư mục đã được AI xử lý (enriched)
  const datasetDir = fs.existsSync(enrichedDatasetDir) ? enrichedDatasetDir : originalDatasetDir;

  if (datasetDir === enrichedDatasetDir) {
    console.log('✅ Đang sử dụng dữ liệu ĐÃ ĐƯỢC XỬ LÝ (Enriched) từ thư mục enriched/products');
  } else {
    console.log('ℹ️ Đang sử dụng dữ liệu GỐC (Original) từ thư mục products');
  }

  if (fileName) {
    filesToProcess.push(fileName);
  } else {
    console.log(
      'ℹ️ Không có file cụ thể được chỉ định. Đang quét toàn bộ file JSON trong thư mục dataset (bao gồm cả thư mục con)...',
    );
    filesToProcess = getAllJsonFiles(datasetDir, datasetDir);

    if (isDevSeed) {
      filesToProcess = filesToProcess.slice(0, 5);
      console.log(`ℹ️ Chế độ Dev Seed: Chỉ lấy ${filesToProcess.length} file đầu tiên để seed.`);
    }
    console.log(`Tìm thấy ${filesToProcess.length} file JSON hợp lệ để seed.`);
  }

  const langVi = await prisma.language.findUnique({ where: { code: 'vi' } });
  const langEn = await prisma.language.findUnique({ where: { code: 'en' } });

  if (!langVi || !langEn) {
    console.error('❌ Không tìm thấy ngôn ngữ "vi" hoặc "en" trong DB. Vui lòng chạy seed hệ thống trước!');
    return;
  }

  // Lấy danh sách User để gán Review ngẫu nhiên
  const users = await prisma.user.findMany({ select: { id: true }, take: 100 });
  if (users.length === 0) {
    console.warn('⚠️ Không tìm thấy User nào trong DB. Review sẽ không được seed.');
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
      products = JSON.parse(fileContent || '') as AmazonProduct[];
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

        // 2. Tạo Image cho Thumbnail
        const thumbnail = await prisma.image.create({
          data: {
            url: imageUrl || '',
            publicId: imageUrl || `placeholder-${Date.now()}`,
          },
        });

        // 3. Tạo Product và các mối quan hệ
        const createdProduct = await prisma.product.create({
          data: {
            slug: `${slugify(p.pure_name)}-${p.skus[0]?.sku_code}`,
            status: ProductStatus.ACTIVE,
            thumbnail_id: thumbnail.id,
            brand_id: (p.brand && brandMap[p.brand]) ? brandMap[p.brand] : null,
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
              create: p.skus.map((sku) => {
                const price = sku.price > 0 ? sku.price : p.actual_price_vnd > 0 ? p.actual_price_vnd : 100000;
                const originalPrice = p.actual_price_vnd > 0 ? p.actual_price_vnd : price;

                return {
                  sku_code: sku.sku_code,
                  price: price,
                  original_price: originalPrice,
                  unit_price: 'VND',
                  stock: sku.stock,
                  image_url: imageUrl,
                };
              }),
            },
          },
          include: {
            skus: true,
          },
        });

        // 4. Seed Reviews nếu có
        if (p.reviews && p.reviews.length > 0 && users.length > 0) {
          const firstSku = createdProduct.skus[0];
          if (firstSku) {
            await prisma.review.createMany({
              data: p.reviews.map((rev) => ({
                product_id: createdProduct.id,
                sku_id: firstSku.id,
                user_id: users[Math.floor(Math.random() * users.length)].id,
                rating: rev.rating,
                comment: rev.title ? `[${rev.title}] ${rev.comment}` : rev.comment,
              })),
            });
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ Lỗi khi seed sản phẩm ${p.pure_name}:`, message);
      }
    }
    console.log(`✅ Hoàn thành seed file: ${file}!`);
  }
}
