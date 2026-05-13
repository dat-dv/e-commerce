import { PrismaClient } from '../../generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { createId } from '@paralleldrive/cuid2';

export async function seedBrands(prisma: PrismaClient) {
  console.log('📦 Đang seed dữ liệu Brand...');

  // 1. Đọc file brands.json
  const brandsPath = path.join(__dirname, '../dataset/brands/brands.json');
  if (!fs.existsSync(brandsPath)) {
    console.log('⚠️ Không tìm thấy file brands.json. Bỏ qua seed brand.');
    return {};
  }

  const brandsData = JSON.parse(fs.readFileSync(brandsPath, 'utf-8')) as string[];

  // Lấy ID của ngôn ngữ mặc định (ưu tiên tiếng Việt, không có thì tiếng Anh)
  const langVi = await prisma.language.findFirst({ where: { code: 'vi' } });
  const langEn = await prisma.language.findFirst({ where: { code: 'en' } });

  const defaultLangId = langVi?.id || langEn?.id;

  if (!defaultLangId) {
    console.log('⚠️ Không tìm thấy Language trong DB. Vui lòng seed Language trước!');
    return {};
  }

  const brandsToCreate: any[] = [];
  const translationsToCreate: any[] = [];
  const brandMap: Record<string, string> = {};

  brandsData.forEach((brandName) => {
    const brandId = createId();
    const slug = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    brandsToCreate.push({
      id: brandId,
      slug: slug || `brand-${brandId}`,
      is_verified: true,
      is_featured: Math.random() > 0.9, // Ngẫu nhiên 10% hãng nổi bật
    });

    translationsToCreate.push({
      id: createId(),
      brand_id: brandId,
      language_id: defaultLangId,
      name: brandName,
      description: `Thương hiệu ${brandName} chất lượng cao.`,
    });

    brandMap[brandName] = brandId;
  });

  // Bulk insert Brands bằng createMany (Siêu nhanh)
  await prisma.brand.createMany({
    data: brandsToCreate,
  });

  // Bulk insert Translations
  await prisma.brandTranslation.createMany({
    data: translationsToCreate,
  });

  console.log(`--> Đã seed thành công ${brandsToCreate.length} Brands!`);

  // Trả về brandMap để dùng cho việc seed Product
  return brandMap;
}
