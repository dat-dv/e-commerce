import { PrismaClient } from '../../generated/prisma/client';

/**
 * Seed cấu hình homepage.
 * Dùng category_slug (ổn định) thay vì category_id (cuid thay đổi khi reset DB).
 */
export async function seedHomepageSections(prisma: PrismaClient) {
  console.log('🏠 Seeding homepage sections...');

  await prisma.homepageSection.deleteMany({});

  const viLang = await prisma.language.findUnique({ where: { code: 'vi' } });
  const enLang = await prisma.language.findUnique({ where: { code: 'en' } });

  if (!viLang || !enLang) {
    console.error('Languages vi, en not found, skipping homepage sections seed');
    return;
  }

  // Lấy vài category để link
  const techCat = await prisma.productCategory.findUnique({ where: { slug: 'electronics' } });
  const beautyCat = await prisma.productCategory.findUnique({ where: { slug: 'beauty-health' } });

  const sections = [
    // --- KHÔNG YÊU CẦU LOGIN (Public) ---
    {
      type: 'flash_sale',
      order: 1,
      is_enabled: true,
      require_login: false,
      translations: {
        create: [
          { language_id: viLang.id, title: 'Flash Sale Công Nghệ' },
          { language_id: enLang.id, title: 'Tech Flash Sale' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 2,
      is_enabled: true,
      require_login: false,
      categories: techCat ? { connect: [{ id: techCat.id }] } : undefined,
      translations: {
        create: [
          { language_id: viLang.id, title: 'Top Hot Công Nghệ' },
          { language_id: enLang.id, title: 'Trending Electronics' },
        ],
      },
    },
    {
      type: 'product_carousel',
      order: 3,
      is_enabled: true,
      require_login: false,
      categories: beautyCat ? { connect: [{ id: beautyCat.id }] } : undefined,
      translations: {
        create: [
          { language_id: viLang.id, title: 'Làm Đẹp Mùa Hè' },
          { language_id: enLang.id, title: 'Summer Beauty' },
        ],
      },
    },

    // --- YÊU CẦU LOGIN (Personalized) ---
    {
      type: 'recommends',
      order: 4,
      is_enabled: true,
      require_login: true,
      translations: {
        create: [
          { language_id: viLang.id, title: 'Gợi ý riêng cho bạn' },
          { language_id: enLang.id, title: 'Recommended For You' },
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
          { language_id: viLang.id, title: 'Sản phẩm bạn vừa xem' },
          { language_id: enLang.id, title: 'Recently Viewed' },
        ],
      },
    },
  ];

  for (const s of sections) {
    await prisma.homepageSection.create({ data: s });
  }

  console.log(`✅ Created ${sections.length} homepage sections.`);
}
