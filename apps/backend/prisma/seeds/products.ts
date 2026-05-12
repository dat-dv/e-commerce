import { EProductStatus } from 'src/api/products/domain/entities/product.entity';
import { PrismaClient } from '../../generated/prisma/client';
import { SeedRegistry } from './registry';

export async function seedProducts(prisma: PrismaClient) {
  console.log('--- Phase 2: Products ---');

  // Fetch languages from registry
  const vi = await SeedRegistry.getLanguage(prisma, 'vi');
  const en = await SeedRegistry.getLanguage(prisma, 'en');

  // 2. Lấy categories từ DB
  const categories = await prisma.productCategory.findMany({ orderBy: { created_at: 'asc' } });
  if (categories.length === 0) throw new Error('No categories found. Chạy seedCategories trước.');

  // 3. Tạo Attributes
  const color = await prisma.attribute.create({ data: { name: 'Color' } });
  const storage = await prisma.attribute.create({ data: { name: 'Storage' } });
  const ram = await prisma.attribute.create({ data: { name: 'RAM' } });

  // Tạo Attribute Values
  const red = await prisma.attributeValue.create({ data: { attribute_id: color.id, value: 'Đỏ' } });
  const blue = await prisma.attributeValue.create({ data: { attribute_id: color.id, value: 'Xanh' } });
  const black = await prisma.attributeValue.create({ data: { attribute_id: color.id, value: 'Đen' } });
  const white = await prisma.attributeValue.create({ data: { attribute_id: color.id, value: 'Trắng' } });

  const s128 = await prisma.attributeValue.create({ data: { attribute_id: storage.id, value: '128GB' } });
  const s256 = await prisma.attributeValue.create({ data: { attribute_id: storage.id, value: '256GB' } });
  const s512 = await prisma.attributeValue.create({ data: { attribute_id: storage.id, value: '512GB' } });

  const r8 = await prisma.attributeValue.create({ data: { attribute_id: ram.id, value: '8GB' } });
  const r16 = await prisma.attributeValue.create({ data: { attribute_id: ram.id, value: '16GB' } });

  // Helper: tạo mapping product -> categories
  async function linkCategories(productId: string, categorySlugs: string[]) {
    for (const slug of categorySlugs) {
      const cat = categories.find((c) => c.slug === slug);
      if (cat) {
        await prisma.productCategoryMapping.create({
          data: { product_id: productId, category_id: cat.id },
        });
      }
    }
  }

  // 4. Tạo Products

  // Product 1: iPhone 15 (Điện thoại + Đồ Công Nghệ)
  const p1 = await prisma.product.create({
    data: {
      status: EProductStatus.ACTIVE,
      translations: {
        create: [
          {
            language_id: vi.id,
            name: 'Điện thoại iPhone 15',
            description: 'Apple iPhone 15 mới nhất với màn hình Dynamic Island.',
          },
          { language_id: en.id, name: 'iPhone 15', description: 'Brand new Apple iPhone 15 with Dynamic Island.' },
        ],
      },
    },
  });
  await linkCategories(p1.id, ['dien-thoai', 'do-cong-nghe']);

  await prisma.sku.create({
    data: {
      product_id: p1.id,
      sku_code: 'IP15-RED-128',
      price: 1000,
      stock: 100,
      sku_attribute_values: { create: [{ attribute_value_id: red.id }, { attribute_value_id: s128.id }] },
    },
  });

  await prisma.sku.create({
    data: {
      product_id: p1.id,
      sku_code: 'IP15-BLUE-256',
      price: 1200,
      stock: 50,
      sku_attribute_values: { create: [{ attribute_value_id: blue.id }, { attribute_value_id: s256.id }] },
    },
  });

  // Product 2: MacBook Air (Laptop + Đồ Công Nghệ)
  const p2 = await prisma.product.create({
    data: {
      status: EProductStatus.ACTIVE,
      translations: {
        create: [
          {
            language_id: vi.id,
            name: 'Laptop MacBook Air M2',
            description: 'MacBook Air siêu mỏng nhẹ với chip M2 cực mạnh.',
          },
          {
            language_id: en.id,
            name: 'MacBook Air M2',
            description: 'Super thin and light MacBook Air with powerful M2 chip.',
          },
        ],
      },
    },
  });
  await linkCategories(p2.id, ['laptop', 'do-cong-nghe']);

  await prisma.sku.create({
    data: {
      product_id: p2.id,
      sku_code: 'MBA-BLACK-8',
      price: 1500,
      stock: 30,
      sku_attribute_values: { create: [{ attribute_value_id: black.id }, { attribute_value_id: r8.id }] },
    },
  });

  await prisma.sku.create({
    data: {
      product_id: p2.id,
      sku_code: 'MBA-WHITE-16',
      price: 1800,
      stock: 20,
      sku_attribute_values: { create: [{ attribute_value_id: white.id }, { attribute_value_id: r16.id }] },
    },
  });

  // Product 3: Apple Watch (Đồng hồ thông minh + Đồ Công Nghệ)
  const p3 = await prisma.product.create({
    data: {
      status: EProductStatus.ACTIVE,
      translations: {
        create: [
          {
            language_id: vi.id,
            name: 'Đồng hồ Apple Watch Series 9',
            description: 'Đồng hồ thông minh theo dõi sức khỏe thế hệ mới.',
          },
          {
            language_id: en.id,
            name: 'Apple Watch Series 9',
            description: 'Next generation smart watch for health tracking.',
          },
        ],
      },
    },
  });
  await linkCategories(p3.id, ['dong-ho-thong-minh', 'do-cong-nghe']);

  await prisma.sku.create({
    data: {
      product_id: p3.id,
      sku_code: 'AW9-RED',
      price: 400,
      stock: 50,
      sku_attribute_values: { create: [{ attribute_value_id: red.id }] },
    },
  });

  await prisma.sku.create({
    data: {
      product_id: p3.id,
      sku_code: 'AW9-BLACK',
      price: 420,
      stock: 40,
      sku_attribute_values: { create: [{ attribute_value_id: black.id }] },
    },
  });

  // Product 4: AirPods Pro (Tai nghe + Đồ Công Nghệ)
  const p4 = await prisma.product.create({
    data: {
      status: EProductStatus.ACTIVE,
      translations: {
        create: [
          {
            language_id: vi.id,
            name: 'Tai nghe AirPods Pro 2',
            description: 'Tai nghe không dây chống ồn chủ động tốt nhất.',
          },
          { language_id: en.id, name: 'AirPods Pro 2', description: 'Best active noise cancelling wireless earbuds.' },
        ],
      },
    },
  });
  await linkCategories(p4.id, ['tai-nghe', 'do-cong-nghe']);

  await prisma.sku.create({
    data: {
      product_id: p4.id,
      sku_code: 'APP2-WHITE',
      price: 250,
      stock: 100,
      sku_attribute_values: { create: [{ attribute_value_id: white.id }] },
    },
  });

  // Tạo thêm dữ liệu mẫu thực tế (iPhone, Samsung, Laptop)
  console.log('--- Tạo thêm dữ liệu mẫu thực tế ---');

  const phones = [
    {
      vi: 'iPhone 15 Pro Max',
      en: 'iPhone 15 Pro Max',
      descVi: 'iPhone đỉnh nhất với khung titan.',
      descEn: 'Top-tier iPhone with titanium frame.',
    },
    {
      vi: 'iPhone 14 Pro',
      en: 'iPhone 14 Pro',
      descVi: 'iPhone với Dynamic Island.',
      descEn: 'iPhone with Dynamic Island.',
    },
    {
      vi: 'Samsung Galaxy S24 Ultra',
      en: 'Samsung Galaxy S24 Ultra',
      descVi: 'Flagship Samsung với camera 200MP.',
      descEn: 'Samsung flagship with 200MP camera.',
    },
    {
      vi: 'Samsung Galaxy Z Fold 5',
      en: 'Samsung Galaxy Z Fold 5',
      descVi: 'Điện thoại màn hình gập cao cấp.',
      descEn: 'Premium foldable phone.',
    },
    {
      vi: 'Samsung Galaxy A54',
      en: 'Samsung Galaxy A54',
      descVi: 'Điện thoại tầm trung bán chạy.',
      descEn: 'Best-selling mid-range phone.',
    },
  ];

  const laptops = [
    {
      vi: 'MacBook Pro 14 M3',
      en: 'MacBook Pro 14 M3',
      descVi: 'Laptop chuyên nghiệp cho đồ họa.',
      descEn: 'Professional laptop for graphics.',
    },
    {
      vi: 'Dell XPS 13',
      en: 'Dell XPS 13',
      descVi: 'Laptop Windows mỏng nhẹ cao cấp.',
      descEn: 'Premium thin and light Windows laptop.',
    },
    {
      vi: 'ASUS ROG Zephyrus G14',
      en: 'ASUS ROG Zephyrus G14',
      descVi: 'Laptop gaming nhỏ gọn mạnh mẽ.',
      descEn: 'Compact and powerful gaming laptop.',
    },
    {
      vi: 'Lenovo ThinkPad X1 Carbon',
      en: 'Lenovo ThinkPad X1 Carbon',
      descVi: 'Laptop doanh nhân bền bỉ.',
      descEn: 'Durable business laptop.',
    },
    {
      vi: 'HP Spectre x360',
      en: 'HP Spectre x360',
      descVi: 'Laptop xoay gập 2-trong-1.',
      descEn: '2-in-1 convertible laptop.',
    },
  ];

  // Tạo 5 bản sao cho mỗi sản phẩm để tăng số lượng (tổng 50 sản phẩm)
  for (let j = 1; j <= 5; j++) {
    // Seed Phones
    for (let i = 0; i < phones.length; i++) {
      const item = phones[i];
      const p = await prisma.product.create({
        data: {
          status: EProductStatus.ACTIVE,
          translations: {
            create: [
              { language_id: vi.id, name: `${item.vi} - Bản mẫu ${j}`, description: item.descVi },
              { language_id: en.id, name: `${item.en} - Sample ${j}`, description: item.descEn },
            ],
          },
        },
      });
      await linkCategories(p.id, ['dien-thoai', 'do-cong-nghe']);
      await prisma.sku.create({
        data: {
          product_id: p.id,
          sku_code: `PHONE-SAMPLE-${j}-${i}`,
          price: Math.floor(Math.random() * 1000) + 500,
          stock: Math.floor(Math.random() * 100) + 10,
        },
      });
    }

    // Seed Laptops
    for (let i = 0; i < laptops.length; i++) {
      const item = laptops[i];
      const p = await prisma.product.create({
        data: {
          status: EProductStatus.ACTIVE,
          translations: {
            create: [
              { language_id: vi.id, name: `${item.vi} - Bản mẫu ${j}`, description: item.descVi },
              { language_id: en.id, name: `${item.en} - Sample ${j}`, description: item.descEn },
            ],
          },
        },
      });
      await linkCategories(p.id, ['laptop', 'do-cong-nghe']);
      await prisma.sku.create({
        data: {
          product_id: p.id,
          sku_code: `LAPTOP-SAMPLE-${j}-${i}`,
          price: Math.floor(Math.random() * 1500) + 1000,
          stock: Math.floor(Math.random() * 50) + 5,
        },
      });
    }
  }

  console.log('🚀 Seed sản phẩm hoàn tất!');
}
