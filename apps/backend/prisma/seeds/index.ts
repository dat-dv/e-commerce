import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { seedPhase1 } from './phase1';
import { seedProducts } from './products';
import { seedRBAC } from './rbac';
import { seedCategories } from './categories';
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
  await prisma.userBrowsingHistory.deleteMany({});
  await prisma.flashSaleProduct.deleteMany({});
  await prisma.flashSale.deleteMany({});
  await prisma.sku.deleteMany({});
  await prisma.productTranslation.deleteMany({});
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
  console.log('🌱 Đang tạo dữ liệu mẫu theo các Phase...');

  // phase 0: Tạo Roles & Permissions
  const { adminRole, userRole } = await seedRBAC(prisma);

  // phase 1: Tạo user
  const { defaultUser, listUsers } = await seedPhase1(prisma, adminRole, userRole);

  // phase 2: Tạo categories
  await seedCategories(prisma);

  // phase 3: Tạo sản phẩm
  await seedProducts(prisma);

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
