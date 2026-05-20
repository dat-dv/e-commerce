import * as crypto from 'crypto';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../../generated/prisma/client';
import { TOP_BRANDS_DATA } from './top-brands.data';

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

function resolveSkuCode(originalCode: string, productName: string, color: string, size: string): string {
  const raw = `${originalCode}|${productName}|${color}|${size}`;
  const hash = crypto.createHash('sha256').update(raw).digest('hex').toUpperCase();
  // Lấy 8 ký tự đầu của hash → xác suất collision gần như 0 với dataset ~100k SKU
  return `SKU-${hash.slice(0, 8)}-${color.slice(0, 3).toUpperCase()}-${size.slice(0, 1).toUpperCase()}`;
}

function fallbackSkuCode(color: string, size: string): string {
  const rand = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `SKU-${rand}-${color.slice(0, 3).toUpperCase()}-${size.slice(0, 1).toUpperCase()}`;
}

function findBrandIdByProductName(productName: string, brandMap: Record<string, string>): string | null {
  const nameLower = productName.toLowerCase();

  // 1. Kiểm tra theo keywords của Top Brands
  for (const brand of TOP_BRANDS_DATA) {
    if (brand.keywords.some((k) => nameLower.includes(k.toLowerCase()))) {
      return brandMap[brand.name.toLowerCase()] || null;
    }
  }

  // 2. Fallback kiểm tra trực tiếp trong brandMap
  for (const [brandName, brandId] of Object.entries(brandMap)) {
    if (nameLower.includes(brandName.toLowerCase())) {
      return brandId;
    }
  }

  return null;
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

const CATEGORY_TRANSLATIONS_VI: Record<string, string> = {
  'home & kitchen': 'Nhà cửa & Nhà bếp',
  'home, kitchen, pets': 'Nhà cửa & Nhà bếp',
  appliances: 'Thiết bị gia dụng',
  'car & motorbike': 'Ô tô & Xe máy',
  'sports & fitness': 'Thể thao & Thể hình',
  'grocery & gourmet foods': 'Thực phẩm & Bách hóa',
  'pet supplies': 'Đồ dùng thú cưng',
  stores: 'Cửa hàng',
  electronics: 'Thiết bị điện tử',
  'toys & baby products': 'Đồ chơi & Mẹ bé',
  "kids' fashion": 'Thời trang trẻ em',
  'bags & luggage': 'Túi xách & Hành lý',
  "women's shoes": 'Giày nữ',
  'beauty & health': 'Làm đẹp & Sức khỏe',
  'tv, audio & cameras': 'Tivi & Thiết bị âm thanh',
  'industrial supplies': 'Thiết bị công nghiệp',
  music: 'Âm nhạc',
  'amazon fashion': 'Thời trang Amazon',
};

const SUB_CATEGORY_TRANSLATIONS_VI: Record<string, string> = {
  smartphones: 'Điện thoại thông minh',
  laptops: 'Máy tính xách tay',
  accessories: 'Phụ kiện',
  'baby products': 'Sản phẩm em bé',
  'beauty & grooming': 'Làm đẹp & Chăm sóc',
  'sports, fitness & outdoors': 'Thể thao & Dã ngoại',
  backpacks: 'Ba lô',
  running: 'Chạy bộ',
  'refurbished & open box': 'Hàng đổi trả & Trưng bày',
  'refurbished-open-box': 'Hàng đổi trả & Trưng bày',
  'baby bath, skin & grooming': 'Tắm & Chăm sóc da em bé',
  'baby bath-skin-grooming': 'Tắm & Chăm sóc da em bé',
  'baby fashion': 'Thời trang em bé',
  badminton: 'Cầu lông',
  ballerinas: 'Giày búp bê',
  'camping & hiking': 'Cắm trại & Dã ngoại',
  'camping-hiking': 'Cắm trại & Dã ngoại',
  'car & bike care': 'Chăm sóc ô tô & xe máy',
  'car-bike-care': 'Chăm sóc ô tô & xe máy',
  'car accessories': 'Phụ kiện ô tô',
  'car-accessories': 'Phụ kiện ô tô',
  'car electronics': 'Thiết bị điện tử ô tô',
  'car-electronics': 'Thiết bị điện tử ô tô',
  'car parts': 'Phụ tùng ô tô',
  'car-parts': 'Phụ tùng ô tô',
  'dog supplies': 'Đồ dùng cho chó',
  'dog-supplies': 'Đồ dùng cho chó',
  'fashion sales & deals': 'Khuyến mãi thời trang',
  'fashion-sales-deals': 'Khuyến mãi thời trang',
  'fashion sandals': 'Sandal thời trang',
  'fashion-sandals': 'Sandal thời trang',
  furniture: 'Nội thất',
  'garden & outdoors': 'Sân vườn & Ngoài trời',
  'garden-outdoors': 'Sân vườn & Ngoài trời',
  'home decor': 'Trang trí nhà cửa',
  'home-dcor': 'Trang trí nhà cửa',
  'home décor': 'Trang trí nhà cửa',
  'home furnishing': 'Đồ gỗ nội thất',
  'home-furnishing': 'Đồ gỗ nội thất',
  'home improvement': 'Cải thiện nhà cửa',
  'home-improvement': 'Cải thiện nhà cửa',
  'kitchen & dining': 'Nhà bếp & Phòng ăn',
  'kitchen-dining': 'Nhà bếp & Phòng ăn',
  'kitchen storage & containers': 'Hộp & Hũ đựng thực phẩm',
  'kitchen-storage-containers': 'Hộp & Hũ đựng thực phẩm',
  televisions: 'Tivi',
  'toys & games': 'Đồ chơi & Trò chơi',
  'toys-games': 'Đồ chơi & Trò chơi',
  'travel accessories': 'Phụ kiện du lịch',
  'travel-accessories': 'Phụ kiện du lịch',
  'travel duffles': 'Túi du lịch duffle',
  'travel-duffles': 'Túi du lịch duffle',
  wallets: 'Ví nam nữ',
  'washing machines': 'Máy giặt',
  'washing-machines': 'Máy giặt',
  "women's fashion": 'Thời trang nữ',
  'womens-fashion': 'Thời trang nữ',
  yoga: 'Yoga',
  // New translations added
  'air conditioners': 'Máy điều hòa',
  'air-conditioners': 'Máy điều hòa',
  refrigerators: 'Tủ lạnh',
  'all car & motorbike products': 'Tất cả sản phẩm ô tô & xe máy',
  'all-car-motorbike-products': 'Tất cả sản phẩm ô tô & xe máy',
  'motorbike accessories & parts': 'Phụ tùng & Phụ kiện xe máy',
  'motorbike-accessories-parts': 'Phụ tùng & Phụ kiện xe máy',
  'all exercise & fitness': 'Tất cả bài tập & Thể hình',
  'all-exercise-fitness': 'Tất cả bài tập & Thể hình',
  'all sports, fitness & outdoors': 'Tất cả thể thao, Thể hình & Dã ngoại',
  'all-sports-fitness-outdoors': 'Tất cả thể thao, Thể hình & Dã ngoại',
  'cardio equipment': 'Thiết bị Cardio',
  'cardio-equipment': 'Thiết bị Cardio',
  cricket: 'Cricket',
  cycling: 'Đạp xe',
  'fitness accessories': 'Phụ kiện thể hình',
  'fitness-accessories': 'Phụ kiện thể hình',
  football: 'Bóng đá',
  'strength training': 'Luyện tập sức mạnh',
  'strength-training': 'Luyện tập sức mạnh',
  'all grocery & gourmet foods': 'Tất cả thực phẩm & bách hóa',
  'all-grocery-gourmet-foods': 'Tất cả thực phẩm & bách hóa',
  'coffee, tea & beverages': 'Cà phê, trà & đồ uống',
  'coffee-tea-beverages': 'Cà phê, trà & đồ uống',
  'snack foods': 'Đồ ăn vặt',
  'snack-foods': 'Đồ ăn vặt',
  'all home & kitchen': 'Tất cả nhà cửa & nhà bếp',
  'all-home-kitchen': 'Tất cả nhà cửa & nhà bếp',
  'bedroom linen': 'Ga trải giường phòng ngủ',
  'bedroom-linen': 'Ga trải giường phòng ngủ',
  'home storage': 'Đồ dùng lưu trữ gia đình',
  'home-storage': 'Đồ dùng lưu trữ gia đình',
  'sewing & craft supplies': 'Đồ may vá & thủ công',
  'sewing-craft-supplies': 'Đồ may vá & thủ công',
  'all pet supplies': 'Tất cả đồ dùng thú cưng',
  'all-pet-supplies': 'Tất cả đồ dùng thú cưng',
  'amazon fashion': 'Thời trang Amazon',
  'amazon-fashion': 'Thời trang Amazon',
  'the designer boutique': 'Cửa hàng thiết kế',
  'the-designer-boutique': 'Cửa hàng thiết kế',
  diapers: 'Tã bỉm',
  'nursing & feeding': 'Chăm sóc & Cho bé ăn',
  'nursing-feeding': 'Chăm sóc & Cho bé ăn',
  'strollers & prams': 'Xe đẩy em bé',
  'strollers-prams': 'Xe đẩy em bé',
  'toys gifting store': 'Cửa hàng quà tặng đồ chơi',
  'toys-gifting-store': 'Cửa hàng quà tặng đồ chơi',
  "kids' clothing": 'Quần áo trẻ em',
  'kids-clothing': 'Quần áo trẻ em',
  "kids' shoes": 'Giày dép trẻ em',
  'kids-shoes': 'Giày dép trẻ em',
  "kids' watches": 'Đồng hồ trẻ em',
  'kids-watches': 'Đồng hồ trẻ em',
  'school bags': 'Balo đi học',
  'school-bags': 'Balo đi học',
  rucksacks: 'Balo du lịch',
  'suitcases & trolley bags': 'Vali & túi kéo',
  'suitcases-trolley-bags': 'Vali & túi kéo',
  shoes: 'Giày dép',
  'diet & nutrition': 'Dinh dưỡng & chế độ ăn',
  'diet-nutrition': 'Dinh dưỡng & chế độ ăn',
  'health & personal care': 'Sức khỏe & chăm sóc cá nhân',
  'health-personal-care': 'Sức khỏe & chăm sóc cá nhân',
  'household supplies': 'Đồ dùng gia đình',
  'household-supplies': 'Đồ dùng gia đình',
  'luxury beauty': 'Mỹ phẩm cao cấp',
  'luxury-beauty': 'Mỹ phẩm cao cấp',
  'make-up': 'Trang điểm',
  'personal care appliances': 'Thiết bị chăm sóc cá nhân',
  'personal-care-appliances': 'Thiết bị chăm sóc cá nhân',
  'value bazaar': 'Khu giá rẻ',
  'value-bazaar': 'Khu giá rẻ',
  'home audio & theater': 'Âm thanh gia đình & Rạp hát',
  'home-audio-theater': 'Âm thanh gia đình & Rạp hát',
  'industrial & scientific supplies': 'Thiết bị công nghiệp & khoa học',
  'industrial-scientific-supplies': 'Thiết bị công nghiệp & khoa học',
  'janitorial & sanitation supplies': 'Dụng cụ vệ sinh & diệt khuẩn',
  'janitorial-sanitation-supplies': 'Dụng cụ vệ sinh & diệt khuẩn',
  'lab & scientific': 'Thiết bị phòng thí nghiệm',
  'lab-scientific': 'Thiết bị phòng thí nghiệm',
  'test, measure & inspect': 'Kiểm tra, đo lường & giám định',
  'test-measure-inspect': 'Kiểm tra, đo lường & giám định',
  'musical instruments & professional audio': 'Nhạc cụ & âm thanh chuyên nghiệp',
  'musical-instruments-professional-audio': 'Nhạc cụ & âm thanh chuyên nghiệp',
};

async function seedOneProduct(params: {
  prisma: PrismaClient;
  product: AmazonProduct;
  file: string;
  categoryCache: Record<string, string>;
  brandMap: Record<string, string>;
  langViId: string;
  langEnId: string;
  users: { id: string }[];
  seedLogsPath: string;
}): Promise<void> {
  const { prisma, product: p, file, categoryCache, brandMap, langViId, langEnId, users, seedLogsPath } = params;
  const imageUrl = Array.isArray(p.image) ? p.image[0] : p.image;

  try {
    const subCategorySlug = slugify(p.sub_category);
    const subCategoryId = categoryCache[subCategorySlug];

    if (!subCategoryId) {
      throw new Error(`Không tìm thấy categoryId trong cache cho slug: ${subCategorySlug}`);
    }

    let brandId = p.brand ? brandMap[p.brand.toLowerCase()] : null;
    if (!brandId) {
      brandId = findBrandIdByProductName(p.name, brandMap);
    }

    const skuPrices = p.skus.map((sku) =>
      sku.price > 0 ? sku.price : p.actual_price_vnd > 0 ? p.actual_price_vnd : 100000,
    );
    const basePrice =
      skuPrices.length > 0 ? Math.min(...skuPrices) : p.actual_price_vnd > 0 ? p.actual_price_vnd : 100000;

    const createdProduct = await prisma.product.create({
      data: {
        slug: `${slugify(p.pure_name)}-${p.skus[0]?.sku_code}`,
        status: ProductStatus.ACTIVE,
        thumbnail: {
          create: {
            url: imageUrl || '',
            public_id: imageUrl || `placeholder-${Date.now()}`,
          },
        },
        brand: brandId ? { connect: { id: brandId } } : undefined,
        base_price: basePrice,
        rating: p.ratings && !isNaN(parseFloat(p.ratings)) ? parseFloat(p.ratings) : 0,
        review_count: p.no_of_ratings ? parseInt(p.no_of_ratings.replace(/[^0-9]/g, '')) || 0 : 0,
        sold_count: Math.floor(Math.random() * 1000),
        translations: {
          create: [
            { language_id: langViId, name: p.name_vi, description: p.description_vi },
            { language_id: langEnId, name: p.name, description: p.description_en },
          ],
        },
        categories: {
          create: [{ category_id: subCategoryId }],
        },
        skus: {
          create: p.skus.map((sku) => {
            const price = sku.price > 0 ? sku.price : p.actual_price_vnd > 0 ? p.actual_price_vnd : 100000;
            const originalPrice = p.actual_price_vnd > 0 ? p.actual_price_vnd : price;
            const color = sku.attributes?.color ?? 'NA';
            const size = sku.attributes?.size ?? 'NA';
            const safeSkuCode = resolveSkuCode(sku.sku_code, p.pure_name, color, size);

            return {
              sku_code: safeSkuCode,
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

    type ParsedReview = { rating?: number | string | null; title?: string | null; comment?: string | null };
    const validReviews = p.reviews?.filter((rev: ParsedReview) => rev.rating != null || rev.comment != null) || [];
    if (validReviews.length > 0 && users.length > 0) {
      const firstSku = createdProduct.skus[0];
      if (firstSku) {
        await prisma.review.createMany({
          data: validReviews.map((rev: ParsedReview) => ({
            product_id: createdProduct.id,
            sku_id: firstSku.id,
            user_id: users[Math.floor(Math.random() * users.length)].id,
            rating: Number(rev.rating) || 5,
            comment: rev.title ? `[${rev.title}] ${rev.comment || ''}` : rev.comment || '',
          })),
        });
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isSkuCollision = message.includes('sku_code') || message.includes('Unique constraint failed');
    const errorLog = `❌ Lỗi khi seed sản phẩm ${p.pure_name} (File: ${file})${isSkuCollision ? ' [SKU_COLLISION]' : ''}:\n${message}\n-----------------------------------------\n`;
    console.error(errorLog);
    fs.appendFileSync(seedLogsPath, errorLog, 'utf-8');
    throw error;
  }
}

export async function seedProductsAndCategories(prisma: PrismaClient, brandMap: Record<string, string> = {}) {
  const startTime = Date.now();
  const isDevSeed = false;

  const seedLogsPath = path.join(process.cwd(), `seedlogs-${Date.now()}.txt`);
  fs.writeFileSync(
    seedLogsPath,
    `Bắt đầu seed dữ liệu lúc: ${new Date().toLocaleString()}\n=========================================\n`,
    'utf-8',
  );

  const fileName = process.argv[2];
  let filesToProcess: string[] = [];

  const originalDatasetDir = path.join(__dirname, '../dataset/products');
  const datasetDir = originalDatasetDir;

  console.log('ℹ️ Đang sử dụng dữ liệu GỐC (Original) từ thư mục products');

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

  const users = await prisma.user.findMany({ select: { id: true }, take: 100 });
  if (users.length === 0) {
    console.warn('⚠️ Không tìm thấy User nào trong DB. Review sẽ không được seed.');
  }

  console.log('🔍 Đang quét và pre-create categories từ dữ liệu...');
  const categoryCache: Record<string, string> = {};

  const existingCats = await prisma.productCategory.findMany({
    select: { id: true, slug: true },
  });
  for (const cat of existingCats) {
    categoryCache[cat.slug] = cat.id;
  }

  const uniqueCategories = new Map<string, { main: string; sub: string }>();
  for (const file of filesToProcess) {
    const filePath = path.join(datasetDir, file);
    if (!fs.existsSync(filePath)) continue;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const products = JSON.parse(fileContent) as AmazonProduct[];
      if (!Array.isArray(products)) continue;
      for (const p of products) {
        if (!p.main_category || !p.sub_category) continue;
        let normalizedMainCategory = p.main_category;
        if (normalizedMainCategory.toLowerCase() === 'home, kitchen, pets') {
          normalizedMainCategory = 'Home & Kitchen';
        }
        const subSlug = slugify(p.sub_category);
        if (!uniqueCategories.has(subSlug)) {
          uniqueCategories.set(subSlug, {
            main: normalizedMainCategory,
            sub: p.sub_category,
          });
        }
      }
    } catch (e) {
      // Ignore errors for metadata phase
    }
  }

  for (const [subSlug, catInfo] of uniqueCategories.entries()) {
    const mainSlug = slugify(catInfo.main);

    let mainId = categoryCache[mainSlug];
    if (!mainId) {
      const mainCatVi = CATEGORY_TRANSLATIONS_VI[catInfo.main.toLowerCase()] || catInfo.main;
      const mainCatEn = catInfo.main;
      try {
        const mainCat = await prisma.productCategory.upsert({
          where: { slug: mainSlug },
          update: {},
          create: {
            slug: mainSlug,
            level: 1,
            translations: {
              create: [
                { language_id: langVi.id, name: mainCatVi },
                { language_id: langEn.id, name: mainCatEn },
              ],
            },
          },
          select: { id: true },
        });
        mainId = mainCat.id;
        categoryCache[mainSlug] = mainId;
      } catch (error) {
        console.error(`Lỗi pre-create main category: ${catInfo.main}`, error);
      }
    }

    let subId = categoryCache[subSlug];
    if (!subId && mainId) {
      const subCatVi = SUB_CATEGORY_TRANSLATIONS_VI[catInfo.sub.toLowerCase()] || catInfo.sub;
      const subCatEn = catInfo.sub;
      try {
        const subCat = await prisma.productCategory.upsert({
          where: { slug: subSlug },
          update: {},
          create: {
            slug: subSlug,
            level: 2,
            parent_id: mainId,
            translations: {
              create: [
                { language_id: langVi.id, name: subCatVi },
                { language_id: langEn.id, name: subCatEn },
              ],
            },
          },
          select: { id: true },
        });
        subId = subCat.id;
        categoryCache[subSlug] = subId;
      } catch (error) {
        console.error(`Lỗi pre-create sub category: ${catInfo.sub}`, error);
      }
    }
  }
  console.log(`✅ Đã cache/pre-create ${Object.keys(categoryCache).length} categories.`);

  // --- 2. MAIN SEED LOOP FOR PRODUCTS ---
  const BATCH_SIZE = Number(process.env.SEED_BATCH_SIZE ?? 25);

  for (const file of filesToProcess) {
    const fileStartTime = Date.now();
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

    console.log(
      `Tìm thấy ${products.length} sản phẩm. Đang xử lý bằng Promise.allSettled với batch size = ${BATCH_SIZE}...`,
    );

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((product) =>
          seedOneProduct({
            prisma,
            product,
            file,
            categoryCache,
            brandMap,
            langViId: langVi.id,
            langEnId: langEn.id,
            users,
            seedLogsPath,
          }),
        ),
      );

      const failed = results.filter((r) => r.status === 'rejected').length;

      console.log(
        `... Đã xử lý ${Math.min(i + batch.length, products.length)}/${products.length} sản phẩm. Failed batch: ${failed}`,
      );
    }
    const fileDuration = ((Date.now() - fileStartTime) / 1000).toFixed(2);
    console.log(`✅ Hoàn thành seed file: ${file} trong ${fileDuration} giây!`);
  }
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 Hoàn thành seed products-n-categories trong ${totalDuration} giây!`);
}
