import { PrismaClient } from '../../generated/prisma/client';

/**
 * Seed cấu hình homepage.
 * Dùng category_slug (ổn định) thay vì category_id (cuid thay đổi khi reset DB).
 */
export async function seedHomepageSections(prisma: PrismaClient) {
  console.log('🏠 Seeding homepage sections...');

  await prisma.homepageSection.deleteMany({});

  const sections = [
    {
      title: 'Flash Sale',
      type: 'flash_sale',
      order: 1,
      is_enabled: true,
      params: null,
    },
    {
      title: 'Popular Categories',
      type: 'categories',
      order: 2,
      is_enabled: true,
      params: null,
    },
    {
      title: 'Trending Now',
      type: 'product_carousel',
      order: 3,
      is_enabled: true,
      params: JSON.stringify({ category_slug: 'electronics' }),
    },
    {
      title: 'Technology',
      type: 'product_carousel',
      order: 4,
      is_enabled: true,
      params: JSON.stringify({ category_slug: 'tv-audio-cameras' }),
    },
    {
      title: 'Mom & Baby',
      type: 'product_carousel',
      order: 5,
      is_enabled: true,
      params: JSON.stringify({ category_slug: 'toys-baby-products' }),
    },
    {
      title: 'Beauty & Health',
      type: 'product_carousel',
      order: 6,
      is_enabled: true,
      params: JSON.stringify({ category_slug: 'beauty-health' }),
    },
    {
      title: 'Home & Kitchen',
      type: 'product_carousel',
      order: 7,
      is_enabled: true,
      params: JSON.stringify({ category_slug: 'home-kitchen' }),
    },
  ];

  await prisma.homepageSection.createMany({ data: sections });
  console.log(`✅ Created ${sections.length} homepage sections.`);
}
