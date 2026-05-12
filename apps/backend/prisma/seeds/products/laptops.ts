import { Prisma, PrismaClient } from '../../../generated/prisma/client';

export interface LaptopSeedData {
  vi: string;
  en: string;
  descVi: string;
  descEn: string;
  skuPrefix: string;
}

export async function seedLaptops(prisma: PrismaClient, viId: string, enId: string) {
  console.log('--- Seeding Laptops ---');

  const laptopData: LaptopSeedData[] = [
    {
      vi: 'MacBook Pro 14 M3',
      en: 'MacBook Pro 14 M3',
      descVi: 'Laptop chuyên nghiệp cho đồ họa.',
      descEn: 'Professional laptop for graphics.',
      skuPrefix: 'MBP14',
    },
    {
      vi: 'Dell XPS 13',
      en: 'Dell XPS 13',
      descVi: 'Laptop Windows mỏng nhẹ cao cấp.',
      descEn: 'Premium thin and light Windows laptop.',
      skuPrefix: 'XPS13',
    },
    {
      vi: 'ASUS ROG Zephyrus G14',
      en: 'ASUS ROG Zephyrus G14',
      descVi: 'Laptop gaming nhỏ gọn mạnh mẽ.',
      descEn: 'Compact and powerful gaming laptop.',
      skuPrefix: 'ROG14',
    },
    {
      vi: 'Lenovo ThinkPad X1 Carbon',
      en: 'Lenovo ThinkPad X1 Carbon',
      descVi: 'Laptop doanh nhân bền bỉ.',
      descEn: 'Durable business laptop.',
      skuPrefix: 'X1C',
    },
    {
      vi: 'HP Spectre x360',
      en: 'HP Spectre x360',
      descVi: 'Laptop xoay gập 2-trong-1.',
      descEn: '2-in-1 convertible laptop.',
      skuPrefix: 'HPX360',
    },
  ];

  // 1. Tạo Products hàng loạt và lấy về danh sách đã tạo (để lấy ID)
  const productsToCreate: Prisma.ProductCreateManyInput[] = laptopData.flatMap((): Prisma.ProductCreateManyInput[] =>
    Array.from({ length: 5 }, () => ({ status: 'ACTIVE' })),
  );

  const createdProducts = await prisma.product.createManyAndReturn({
    data: productsToCreate,
  });

  // 2. Tạo Translations hàng loạt
  const translationsToCreate: Prisma.ProductTranslationCreateManyInput[] = [];
  createdProducts.forEach((p, index) => {
    const dataIndex = Math.floor(index / 5); // Chia sẻ data gốc cho các bản sao
    const data = laptopData[dataIndex];
    const copyNum = (index % 5) + 1;

    translationsToCreate.push(
      { product_id: p.id, language_id: viId, name: `${data.vi} - Bản mẫu ${copyNum}`, description: data.descVi },
      { product_id: p.id, language_id: enId, name: `${data.en} - Sample ${copyNum}`, description: data.descEn },
    );
  });

  await prisma.productTranslation.createMany({
    data: translationsToCreate,
  });

  // 3. Tạo SKUs hàng loạt
  const skusToCreate: Prisma.SkuCreateManyInput[] = [];
  createdProducts.forEach((p, index) => {
    const dataIndex = Math.floor(index / 5);
    const data = laptopData[dataIndex];
    const copyNum = (index % 5) + 1;

    skusToCreate.push({
      product_id: p.id,
      sku_code: `${data.skuPrefix}-SAMPLE-${copyNum}-${p.id.slice(-5)}`, // Tránh trùng lặp code
      price: Math.floor(Math.random() * 1500) + 1000,
      stock: Math.floor(Math.random() * 50) + 5,
    });
  });

  await prisma.sku.createMany({
    data: skusToCreate,
  });

  // 4. Link Categories hàng loạt
  const laptopCat = await prisma.productCategory.findUnique({ where: { slug: 'laptop' } });
  const doCongNgheCat = await prisma.productCategory.findUnique({ where: { slug: 'do-cong-nghe' } });

  const mappingsToCreate: Prisma.ProductCategoryMappingCreateManyInput[] = [];
  createdProducts.forEach((p) => {
    if (laptopCat) mappingsToCreate.push({ product_id: p.id, category_id: laptopCat.id });
    if (doCongNgheCat) mappingsToCreate.push({ product_id: p.id, category_id: doCongNgheCat.id });
  });

  await prisma.productCategoryMapping.createMany({
    data: mappingsToCreate,
  });

  console.log(`🚀 Đã seed ${createdProducts.length} sản phẩm laptop!`);
}
