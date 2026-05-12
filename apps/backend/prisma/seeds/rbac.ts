import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { ROLE_ADMIN, ROLE_USER } from '../../src/common/constants/roles.constant';

export async function seedRBAC(prisma: PrismaClient) {
  console.log('--- Phase 0: Roles & Permissions ---');

  // 1. Định nghĩa danh sách quyền gốc (Master List)
  const permissions = [
    // Quản lý người dùng
    { permission_name: 'CREATE:USER', description: 'Quyền tạo người dùng', category: 'Quản lý người dùng' },
    { permission_name: 'LIST:USER', description: 'Quyền xem danh sách người dùng', category: 'Quản lý người dùng' },
    {
      permission_name: 'DETAIL:OWN_USER',
      description: 'Quyền xem thông tin của chính mình',
      category: 'Quản lý người dùng',
    },
    {
      permission_name: 'DETAIL:ANY_USER',
      description: 'Quyền xem thông tin của bất kỳ ai',
      category: 'Quản lý người dùng',
    },
    {
      permission_name: 'UPDATE:OWN_USER',
      description: 'Quyền sửa thông tin của chính mình',
      category: 'Quản lý người dùng',
    },
    {
      permission_name: 'UPDATE:ANY_USER',
      description: 'Quyền sửa thông tin của bất kỳ ai',
      category: 'Quản lý người dùng',
    },
    { permission_name: 'DELETE:USER', description: 'Quyền xóa người dùng', category: 'Quản lý người dùng' },

    // Quản lý vai trò
    { permission_name: 'CREATE:ROLE', description: 'Quyền tạo vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'LIST:ROLE', description: 'Quyền xem danh sách vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'DETAIL:ROLE', description: 'Quyền xem chi tiết vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'UPDATE:ROLE', description: 'Quyền sửa vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'DELETE:ROLE', description: 'Quyền xóa vai trò', category: 'Quản lý vai trò' },

    // Quản lý danh mục sản phẩm (Category)
    { permission_name: 'CREATE:CATEGORY', description: 'Quyền tạo danh mục sản phẩm', category: 'Quản lý danh mục' },
    { permission_name: 'LIST:CATEGORY', description: 'Quyền xem danh sách danh mục', category: 'Quản lý danh mục' },
    { permission_name: 'DETAIL:CATEGORY', description: 'Quyền xem chi tiết danh mục', category: 'Quản lý danh mục' },
    { permission_name: 'UPDATE:CATEGORY', description: 'Quyền sửa danh mục', category: 'Quản lý danh mục' },
    { permission_name: 'DELETE:CATEGORY', description: 'Quyền xóa danh mục', category: 'Quản lý danh mục' },

    // Quản lý đánh giá (Review)
    { permission_name: 'CREATE:REVIEW', description: 'Quyền tạo đánh giá', category: 'Quản lý đánh giá' },
    { permission_name: 'LIST:REVIEW', description: 'Quyền xem danh sách đánh giá', category: 'Quản lý đánh giá' },
    { permission_name: 'DETAIL:REVIEW', description: 'Quyền xem chi tiết đánh giá', category: 'Quản lý đánh giá' },
    { permission_name: 'UPDATE:REVIEW', description: 'Quyền sửa đánh giá', category: 'Quản lý đánh giá' },
    { permission_name: 'DELETE:REVIEW', description: 'Quyền xóa đánh giá', category: 'Quản lý đánh giá' },
  ];

  // Lấy danh sách permission đã có
  const existingPermissions = await prisma.permission.findMany({
    select: { permission_name: true },
  });
  const existingNames = existingPermissions.map((p) => p.permission_name);

  // Lọc ra các permission chưa có
  const newPermissions = permissions.filter((p) => !existingNames.includes(p.permission_name));

  if (newPermissions.length > 0) {
    // Tạo permissions hàng loạt
    await prisma.permission.createMany({
      data: newPermissions.map((p) => ({
        permission_name: p.permission_name,
        description: p.description,
        category: p.category,
      })),
    });
  }

  // 3. Tạo Role Admin (Có tất cả các quyền)

  const adminRole = await prisma.role.upsert({
    where: { role_name: ROLE_ADMIN },
    update: {
      permissions: {
        set: [],
        connect: permissions.map((p) => ({ permission_name: p.permission_name })),
      },
    },
    create: {
      role_name: ROLE_ADMIN,
      description: 'Quản trị viên hệ thống',
      permissions: {
        connect: permissions.map((p) => ({ permission_name: p.permission_name })),
      },
    },
  });

  // 4. Tạo Role User (Chỉ có một số quyền cơ bản)
  const userPermNames = [
    'LIST:CATEGORY',
    'DETAIL:CATEGORY',
    'CREATE:REVIEW',
    'LIST:REVIEW',
    'DETAIL:REVIEW',
    'DETAIL:OWN_USER',
    'UPDATE:OWN_USER',
  ];

  const userRole = await prisma.role.upsert({
    where: { role_name: ROLE_USER },
    update: {
      permissions: {
        set: [],
        connect: userPermNames.map((name) => ({ permission_name: name })),
      },
    },
    create: {
      role_name: ROLE_USER,
      description: 'Người dùng thông thường',
      permissions: {
        connect: userPermNames.map((name) => ({ permission_name: name })),
      },
    },
  });

  console.log(`🔑 Đã tạo Role ADMIN với ${permissions.length} quyền`);
  console.log(`🔑 Đã tạo Role USER với ${userPermNames.length} quyền`);

  return { adminRole, userRole };
}
