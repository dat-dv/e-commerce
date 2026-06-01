import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { SeedRegistry } from './registry';
import * as crypto from 'crypto';

export async function seedPhase1(prisma: PrismaClient) {
  console.log('--- Phase 1: Users & Tags ---');

  // Fetch dependencies from registry instead of passing them as props
  const adminRole = await SeedRegistry.getAdminRole(prisma);
  const userRole = await SeedRegistry.getUserRole(prisma);

  // 1. Tạo User đặc biệt để test Auth
  const hashedPass1 = crypto.pbkdf2Sync('string', 'password', 1000, 64, 'sha512').toString('hex');
  const hashedPass2 = crypto.pbkdf2Sync('datdoan.dev@gmail.com', 'password', 1000, 64, 'sha512').toString('hex');

  const defaultUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPass1,
      first_name: 'string',
      last_name: 'string',
      role_id: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'datdoan.dev@gmail.com' },
    update: {},
    create: {
      email: 'datdoan.dev@gmail.com',
      password: hashedPass2,
      first_name: 'Dat',
      last_name: 'Doan',
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

  console.log(`👥 Đã tạo thêm ${listUsers.length} Users mẫu`);

  // Trả về riêng defaultUser (nếu các phase sau thực sự cần return value,
  // nhưng lý tưởng nhất là các phase sau cũng query listUsers nếu cần)
  return { defaultUser, listUsers };
}
