import { PrismaClient, Prisma, Role } from '../../generated/prisma/client';

export async function seedPhase1(prisma: PrismaClient, adminRole: Role, userRole: Role) {
  console.log('--- Phase 1: Users & Tags ---');
  if (!userRole) {
    throw new Error('Role USER không tồn tại. Vui lòng chạy seedRBAC trước.');
  }

  // 1. Tạo User đặc biệt để test Auth
  const defaultUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: 'string',
      first_name: 'string',
      last_name: 'string',
      role_id: adminRole.id,
    },
  });

  // 2. Tạo 100 Users ngẫu nhiên
  const users: Prisma.UserCreateManyInput[] = Array(100)
    .fill(0)
    .map((_, i) => ({
      email: `example-${i}@gmail.com`,
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
      role_id: userRole.id,
    }));

  await prisma.user.createMany({
    data: users,
  });

  // Lấy ra danh sách 100 User mẫu (loại trừ user đặc biệt ra để dễ xử lý riêng)
  const listUsers = await prisma.user.findMany({
    where: {
      NOT: {
        email: 'user@example.com',
      },
    },
  });

  // ==== Tags ====
  const tags: Prisma.TagCreateInput[] = Array(20)
    .fill(0)
    .map((_, i) => ({
      tag_name: `Tag-${i}`,
    }));

  await prisma.tag.createMany({
    data: tags,
  });

  const listTags = await prisma.tag.findMany();

  console.log(`👥 Đã tạo thêm ${listUsers.length} Users mẫu`);
  console.log(`🏷️ Đã tạo ${listTags.length} Tags`);

  // Trả về riêng defaultUser
  return { defaultUser, listUsers, listTags };
}
