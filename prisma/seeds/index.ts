import { PrismaClient } from '../../generated/prisma/client';
import { seedPhase1 } from './phase1';
import { seedPhase2 } from './phase2';
import { seedPhase3 } from './phase3';
import { seedRBAC } from './rbac';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function cleanDatabase() {
  console.log('🗑️ Đang xóa dữ liệu cũ...');
  await prisma.postTag.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.permissionCategory.deleteMany({});
  await prisma.role.deleteMany({});
}

async function main() {
  await cleanDatabase();
  console.log('🌱 Đang tạo dữ liệu mẫu theo các Phase...');

  // phase 0: Tạo Roles & Permissions
  const { adminRole, userRole } = await seedRBAC(prisma);

  // phase 1: Tạo user và tag
  const { defaultUser, listUsers, listTags } = await seedPhase1(prisma, adminRole, userRole);

  // phase 2: Tạo bài viết
  const posts = await seedPhase2(prisma, defaultUser, listUsers, listTags);

  // phase 3: Tạo comment
  await seedPhase3(prisma, posts, defaultUser, listUsers);

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
