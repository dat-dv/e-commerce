import { PrismaClient } from '../../generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { createId } from '@paralleldrive/cuid2';
import { TOP_BRANDS_DATA } from './top-brands.data';

interface BrandDetailed {
  name: string;
  slug?: string;
  description_vi?: string;
  description_en?: string;
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
    banner_url: string | null;
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
    story: string | null;
  }

  const brandsToCreate: any[] = [];
  const translationsToCreate: BrandTranslationCreateInput[] = [];
  const imagesToCreate: any[] = [];
  const brandMap: Record<string, string> = {};
  const usedSlugs = new Set<string>();

  // --- PHASE 1: Seed Top Brands (Dữ liệu chất lượng cao) ---
  TOP_BRANDS_DATA.forEach((brand, index) => {
    const brandId = createId();
    const logoId = brand.logo ? createId() : null;
    const bannerId = brand.banner ? createId() : null;

    if (logoId) {
      imagesToCreate.push({
        id: logoId,
        url: brand.logo,
        public_id: `brands/logo/${brand.slug}`,
      });
    }

    if (bannerId) {
      imagesToCreate.push({
        id: bannerId,
        url: brand.banner,
        public_id: `brands/banner/${brand.slug}`,
      });
    }

    usedSlugs.add(brand.slug);

    brandsToCreate.push({
      id: brandId,
      slug: brand.slug,
      logo_id: logoId,
      banner_id: bannerId,
      logo_url: brand.logo,
      banner_url: brand.banner,
      website_url: brand.website || null,
      is_verified: true,
      is_featured: true,
      order: index,
    });

    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: langVi.id,
      name: brand.name,
      description: brand.description_vi,
      story: brand.story_vi,
    });

    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: langEn.id,
      name: brand.name,
      description: brand.description_en,
      story: brand.story_en,
    });

    brandMap[brand.name.toLowerCase()] = brandId;
  });

  // --- PHASE 2: Seed Other Brands from JSON ---
  rawData.forEach((item, index) => {
    const brandName = isDetailed ? (item as BrandDetailed).name : (item as string);
    if (brandMap[brandName.toLowerCase()]) return; // Bỏ qua nếu đã có trong Top Brands

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
      banner_url: null,
      website_url: detail?.website_url ?? null,
      is_verified: detail?.is_verified ?? false,
      is_featured: false,
      order: index + TOP_BRANDS_DATA.length,
    });

    // Chuẩn bị dữ liệu bảng BrandTranslation
    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: langVi.id,
      name: brandName,
      description: detail && detail.description_vi ? detail.description_vi : `Thương hiệu ${brandName} chính hãng.`,
      story: null,
    });

    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: langEn.id,
      name: brandName,
      description: detail && detail.description_en ? detail.description_en : `Official ${brandName} brand store.`,
      story: null,
    });

    brandMap[brandName.toLowerCase()] = brandId;
  });

  // Bulk Insert
  await prisma.image.createMany({ data: imagesToCreate });
  await prisma.brand.createMany({ data: brandsToCreate });
  await prisma.brandTranslation.createMany({ data: translationsToCreate });

  console.log(`--> Hoàn thành seed ${brandsToCreate.length} thương hiệu!`);
  return brandMap;
}
