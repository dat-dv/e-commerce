import { Prisma, PrismaClient } from '../../../generated/prisma/client';

export interface PhoneSeedData {
  vi: string;
  en: string;
  descVi: string;
  descEn: string;
  skuPrefix: string;
}

/**
 * Seeds phone products using bulk operations.
 * Why: Separated to make the seed file easier to maintain and faster to execute.
 */
export async function seedPhones(prisma: PrismaClient, viId: string, enId: string) {
  console.log('--- Seeding Phones ---');

  const phoneData: PhoneSeedData[] = [
    {
      vi: 'iPhone 15 Pro Max',
      en: 'iPhone 15 Pro Max',
      descVi: 'iPhone đỉnh nhất với khung titan.',
      descEn: 'Top-tier iPhone with titanium frame.',
      skuPrefix: 'IP15PM',
    },
    {
      vi: 'iPhone 14 Pro',
      en: 'iPhone 14 Pro',
      descVi: 'iPhone với Dynamic Island.',
      descEn: 'iPhone with Dynamic Island.',
      skuPrefix: 'IP14P',
    },
    {
      vi: 'Samsung Galaxy S24 Ultra',
      en: 'Samsung Galaxy S24 Ultra',
      descVi: 'Flagship Samsung với camera 200MP.',
      descEn: 'Samsung flagship with 200MP camera.',
      skuPrefix: 'S24U',
    },
    {
      vi: 'Samsung Galaxy Z Fold 5',
      en: 'Samsung Galaxy Z Fold 5',
      descVi: 'Điện thoại màn hình gập cao cấp.',
      descEn: 'Premium foldable phone.',
      skuPrefix: 'ZF5',
    },
    {
      vi: 'Samsung Galaxy A54',
      en: 'Samsung Galaxy A54',
      descVi: 'Điện thoại tầm trung bán chạy.',
      descEn: 'Best-selling mid-range phone.',
      skuPrefix: 'A54',
    },
  ];

  // 1. Tạo Products hàng loạt và lấy về danh sách đã tạo (để lấy ID)
  const productsToCreate: Prisma.ProductCreateManyInput[] = phoneData.flatMap((): Prisma.ProductCreateManyInput[] =>
    Array.from({ length: 5 }, () => ({ status: 'ACTIVE' })),
  );

  const createdProducts = await prisma.product.createManyAndReturn({
    data: productsToCreate,
  });

  // 2. Tạo Translations hàng loạt
  const translationsToCreate: Prisma.ProductTranslationCreateManyInput[] = [];
  createdProducts.forEach((p, index) => {
    const dataIndex = Math.floor(index / 5); // Chia sẻ data gốc cho các bản sao
    const data = phoneData[dataIndex];
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
    const data = phoneData[dataIndex];
    const copyNum = (index % 5) + 1;

    skusToCreate.push({
      product_id: p.id,
      sku_code: `${data.skuPrefix}-SAMPLE-${copyNum}-${p.id.slice(-5)}`, // Tránh trùng lặp code
      price: Math.floor(Math.random() * 1000) + 500,
      stock: Math.floor(Math.random() * 100) + 10,
    });
  });

  await prisma.sku.createMany({
    data: skusToCreate,
  });

  // 4. Link Categories hàng loạt
  const dienThoaiCat = await prisma.productCategory.findUnique({ where: { slug: 'dien-thoai' } });
  const doCongNgheCat = await prisma.productCategory.findUnique({ where: { slug: 'do-cong-nghe' } });

  const mappingsToCreate: Prisma.ProductCategoryMappingCreateManyInput[] = [];
  createdProducts.forEach((p) => {
    if (dienThoaiCat) mappingsToCreate.push({ product_id: p.id, category_id: dienThoaiCat.id });
    if (doCongNgheCat) mappingsToCreate.push({ product_id: p.id, category_id: doCongNgheCat.id });
  });

  await prisma.productCategoryMapping.createMany({
    data: mappingsToCreate,
  });

  console.log(`🚀 Đã seed ${createdProducts.length} sản phẩm điện thoại!`);
}
