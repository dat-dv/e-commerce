import { Prisma } from 'generated/prisma/client';
import { PrismaClient } from '../../generated/prisma/client';

export async function seedHomepageSections(prisma: PrismaClient) {
  console.log('🏠 Seeding homepage sections...');

  await prisma.homepageSection.deleteMany({});

  const langVi = await prisma.language.findUnique({ where: { code: 'vi' } });
  const langEn = await prisma.language.findUnique({ where: { code: 'en' } });

  if (!langVi || !langEn) {
    console.error('Languages vi, en not found, skipping homepage sections seed');
    return;
  }

  // Lấy vài category để link
  const techCat = await prisma.productCategory.findUnique({ where: { slug: 'electronics' } });
  const fashionCat = await prisma.productCategory.findUnique({ where: { slug: 'amazon-fashion' } });
  const homeCat = await prisma.productCategory.findUnique({ where: { slug: 'home-kitchen' } });
  const babyCat = await prisma.productCategory.findUnique({ where: { slug: 'baby-products' } });
  const sportsCat = await prisma.productCategory.findUnique({ where: { slug: 'sports-fitness-and-outdoors' } });
  const beautyCat = await prisma.productCategory.findUnique({ where: { slug: 'beauty-and-grooming' } });

  const sections: Prisma.HomepageSectionCreateInput[] = [
    {
      type: 'flash_sale',
      order: 1,
      is_enabled: true,
      require_login: false,
      translations: {
        create: [
          { language_id: langVi.id, title: 'Flash Sale Công Nghệ' },
          { language_id: langEn.id, title: 'Tech Flash Sale' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 2,
      is_enabled: true,
      require_login: false,
      categories: { connect: techCat ? [{ id: techCat.id }] : [] },
      translations: {
        create: [
          { language_id: langVi.id, title: 'Top Hot Công Nghệ' },
          { language_id: langEn.id, title: 'Top Tech Deals' },
        ],
      },
    },
    {
      type: 'recommends',
      order: 3,
      is_enabled: true,
      require_login: true,
      translations: {
        create: [
          { language_id: langVi.id, title: 'Gợi ý riêng cho bạn' },
          { language_id: langEn.id, title: 'Recommended for You' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 4,
      is_enabled: true,
      require_login: false,
      categories: { connect: fashionCat ? [{ id: fashionCat.id }] : [] },
      translations: {
        create: [
          { language_id: langVi.id, title: 'Xu hướng Thời trang' },
          { language_id: langEn.id, title: 'Fashion Trends' },
        ],
      },
    },
    {
      type: 'recent_view',
      order: 5,
      is_enabled: true,
      require_login: true,
      translations: {
        create: [
          { language_id: langVi.id, title: 'Sản phẩm bạn vừa xem' },
          { language_id: langEn.id, title: 'Recently Viewed' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 6,
      is_enabled: true,
      require_login: false,
      categories: { connect: homeCat ? [{ id: homeCat.id }] : [] },
      translations: {
        create: [
          { language_id: langVi.id, title: 'Nhà cửa & Đời sống' },
          { language_id: langEn.id, title: 'Home & Living' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 7,
      is_enabled: true,
      require_login: false,
      categories: { connect: babyCat ? [{ id: babyCat.id }] : [] },
      translations: {
        create: [
          { language_id: langVi.id, title: 'Mẹ và Bé' },
          { language_id: langEn.id, title: 'Baby & Kids' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 8,
      is_enabled: true,
      require_login: false,
      categories: { connect: sportsCat ? [{ id: sportsCat.id }] : [] },
      translations: {
        create: [
          { language_id: langVi.id, title: 'Thể thao & Dã ngoại' },
          { language_id: langEn.id, title: 'Sports & Outdoors' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 9,
      is_enabled: true,
      require_login: false,
      categories: { connect: beautyCat ? [{ id: beautyCat.id }] : [] },
      translations: {
        create: [
          { language_id: langVi.id, title: 'Làm đẹp & Chăm sóc' },
          { language_id: langEn.id, title: 'Beauty & Grooming' },
        ],
      },
    },
  ];

  for (const s of sections) {
    await prisma.homepageSection.create({ data: s });
  }

  console.log(`✅ Created ${sections.length} homepage sections.`);
}
