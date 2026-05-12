import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { seedPhase1 } from './phase1';
import { seedProductsAndCategories } from './products-n-categories';
import { seedRBAC } from './rbac';
import { setupLanguage } from './language';
import { seedHomepageSections } from './homepage-sections';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

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
  await prisma.homepageSectionTranslation.deleteMany({});
  await prisma.homepageSection.deleteMany({});
  await prisma.userFavoriteCategory.deleteMany({});
  await prisma.userBrowsingHistory.deleteMany({});
  await prisma.flashSaleProduct.deleteMany({});
  await prisma.flashSale.deleteMany({});
  await prisma.sku.deleteMany({});
  await prisma.productTranslation.deleteMany({});
  await prisma.productCategoryTranslation.deleteMany({});
  await prisma.productCategoryMapping.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.language.deleteMany({});
  await prisma.userPhone.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
}

async function main() {
  await cleanDatabase();
  console.log('🌱 Đang tạo dữ liệu mẫu...');

  // --- Phase 0: Setup (Foundational Data) ---
  console.log('--- Phase 0: Setup ---');
  await seedRBAC(prisma);
  await setupLanguage(prisma);
  // --- Phase 1: Core Entities ---
  await seedPhase1(prisma);
  // --- Phase 2: Business Data ---
  await seedProductsAndCategories(prisma);
  // --- Phase 3: Config ---
  await seedHomepageSections(prisma);

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
