import { PrismaClient } from '../../generated/prisma/client';

export async function seedHomepageSections(prisma: PrismaClient) {
  console.log('🌟 Seeding featured categories on homepage...');

  await prisma.featuredCategory.deleteMany({});

  const categories = [
    // High traffic / high conversion
    { slug: 'electronics', order: 1 },
    { slug: 'tv-audio-cameras', order: 2 },

    // Fashion
    { slug: 'womens-shoes', order: 3 },
    { slug: 'bags-luggage', order: 4 },

    // Home
    { slug: 'home-kitchen', order: 5 },

    // Beauty
    { slug: 'beauty-health', order: 6 },

    // Sports
    { slug: 'sports-fitness', order: 7 },

    // Grocery
    { slug: 'grocery-gourmet-foods', order: 8 },

    // Baby / Kids
    { slug: 'toys-baby-products', order: 9 },
    { slug: 'kids-fashion', order: 10 },

    // Automotive
    { slug: 'car-motorbike', order: 11 },

    // Pets
    { slug: 'pet-supplies', order: 12 },

    // Lifestyle / extra
    { slug: 'music', order: 13 },

    // B2B / low CTR
    { slug: 'industrial-supplies', order: 14 },

    // Misc / campaigns
    { slug: 'stores', order: 15 },
  ];

  for (const cat of categories) {
    const dbCat = await prisma.productCategory.findUnique({ where: { slug: cat.slug } });
    if (dbCat) {
      await prisma.featuredCategory.create({
        data: {
          category_id: dbCat.id,
          order: cat.order,
          is_active: true,
        },
      });
    }
  }

  console.log(`✅ Seeding of ${categories.length} featured categories completed.`);
}
