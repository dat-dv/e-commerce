import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { seedBrands } from './brands';
import { seedFlashSales } from './flash-sale';
import { seedHomepageSections } from './homepage-sections';
import { setupLanguage } from './language';
import { seedNotifications } from './notifications';
import { seedPhase1 } from './phase1';
import { seedProductsAndCategories } from './products-n-categories';
import { seedRBAC } from './rbac';
import { updateTopBrands } from './update-top-brands';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function cleanDatabase() {
  console.log('🗑️ Đang xóa dữ liệu cũ...');
  // Xóa theo thứ tự để tránh lỗi khóa ngoại
  await prisma.skuAttributeValue.deleteMany({});
  await prisma.attributeValue.deleteMany({});
  await prisma.attribute.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.notificationToken.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.featuredCategory.deleteMany({});
  await prisma.userFavoriteCategory.deleteMany({});
  await prisma.userBrowsingHistory.deleteMany({});
  await prisma.flashSaleProduct.deleteMany({});
  await prisma.flashSale.deleteMany({});
  await prisma.flashSaleTimeSlot.deleteMany({});
  await prisma.sku.deleteMany({});
  await prisma.productTranslation.deleteMany({});
  await prisma.productCategoryTranslation.deleteMany({});
  await prisma.brandTranslation.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.productCategoryMapping.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.language.deleteMany({});
  await prisma.userPhone.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
}

async function main() {
  await cleanDatabase();
  console.log('🌱 Đang tạo dữ liệu mẫu...');

  // --- Phase 0: Setup ---
  await seedRBAC(prisma);
  await setupLanguage(prisma);

  // --- Phase 1: Core Entities ---
  await seedPhase1(prisma);
  const brandMap = await seedBrands(prisma);

  // --- Phase 2: Business Data ---
  await seedProductsAndCategories(prisma, brandMap);

  // --- Phase 3: Config & Optimization ---
  await seedHomepageSections(prisma);
  await updateTopBrands(prisma);

  // --- Phase 4: Promotions ---
  await seedFlashSales(prisma);

  // --- Phase 5: Notifications ---
  await seedNotifications(prisma);

  console.log('🚀 Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
