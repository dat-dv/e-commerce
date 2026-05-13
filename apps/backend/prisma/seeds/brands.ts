import { PrismaClient } from '../../generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { createId } from '@paralleldrive/cuid2';

interface BrandDetailed {
  name: string;
  slug?: string;
  description_vi?: string;
  website_url?: string;
  logo_url?: string;
  is_verified?: boolean;
}

export async function seedBrands(prisma: PrismaClient) {
  console.log('📦 Đang seed dữ liệu Brand (phiên bản Detailed)...');

  const detailedPath = path.join(__dirname, '../dataset/brands/brands_detailed.json');
  const basicPath = path.join(__dirname, '../dataset/brands/brands.json');

  let rawData: (BrandDetailed | string)[] = [];
  let isDetailed = false;

  if (fs.existsSync(detailedPath)) {
    rawData = JSON.parse(fs.readFileSync(detailedPath, 'utf-8')) as (BrandDetailed | string)[];
    isDetailed = true;
    console.log('✅ Phát hiện brands_detailed.json. Đang sử dụng dữ liệu chi tiết.');
  } else if (fs.existsSync(basicPath)) {
    rawData = JSON.parse(fs.readFileSync(basicPath, 'utf-8')) as (BrandDetailed | string)[];
    console.log('ℹ️ Không thấy bản chi tiết. Sử dụng brands.json cơ bản.');
  } else {
    console.warn('⚠️ Không tìm thấy bất kỳ file brand nào. Bỏ qua.');
    return {};
  }

  const langVi = await prisma.language.findUnique({ where: { code: 'vi' } });
  const langEn = await prisma.language.findUnique({ where: { code: 'en' } });

  if (!langVi || !langEn) {
    console.error('❌ Thiếu ngôn ngữ hệ thống. Vui lòng seed Language trước.');
    return {};
  }

  interface BrandCreateInput {
    id: string;
    slug: string;
    logo_url: string | null;
    website_url: string | null;
    is_verified: boolean;
    is_featured: boolean;
    order: number;
  }

  interface BrandTranslationCreateInput {
    id: string;
    brand_id: string;
    language_id: string;
    name: string;
    description: string | null;
  }

  const brandsToCreate: BrandCreateInput[] = [];
  const translationsToCreate: BrandTranslationCreateInput[] = [];
  const brandMap: Record<string, string> = {};
  const usedSlugs = new Set<string>();

  rawData.forEach((item, index) => {
    const brandName = isDetailed ? (item as BrandDetailed).name : (item as string);
    const detail = isDetailed ? (item as BrandDetailed) : null;
    const brandId = createId();

    // Tạo slug
    let slug =
      detail && detail.slug
        ? detail.slug
        : brandName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

    if (!slug) slug = `brand-${brandId}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${brandId.substring(0, 5)}`;
    usedSlugs.add(slug);

    // Chuẩn bị dữ liệu bảng Brand
    brandsToCreate.push({
      id: brandId,
      slug: slug,
      logo_url: detail?.logo_url ?? null,
      website_url: detail?.website_url ?? null,
      is_verified: detail?.is_verified ?? false,
      is_featured: index < 20, // 20 thương hiệu đầu tiên làm Featured cho đẹp
      order: index,
    });

    // Chuẩn bị dữ liệu bảng BrandTranslation (Tiếng Việt)
    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: langVi.id,
      name: brandName,
      description: detail && detail.description_vi ? detail.description_vi : `Thương hiệu ${brandName} chính hãng.`,
    });

    // Chuẩn bị dữ liệu bảng BrandTranslation (Tiếng Anh - mặc định)
    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: langEn.id,
      name: brandName,
      description: `Official ${brandName} brand store.`,
    });

    brandMap[brandName] = brandId;
  });

  // Bulk Insert
  await prisma.brand.createMany({ data: brandsToCreate });
  await prisma.brandTranslation.createMany({ data: translationsToCreate });

  console.log(`--> Hoàn thành seed ${brandsToCreate.length} thương hiệu!`);
  return brandMap;
}
