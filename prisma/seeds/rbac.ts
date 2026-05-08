import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { ROLE_ADMIN, ROLE_USER } from '../../src/common/constants/roles.constant';

/**
 * Seeds the database with default roles, permissions, and categories.
 * Creates a master list of permissions and assigns them to default roles.
 *
 * @param prisma The Prisma client instance.
 * @returns The created default roles.
 */
export async function seedRBAC(prisma: PrismaClient) {
  console.log('--- Phase 0: Roles & Permissions ---');

  // 1. Định nghĩa danh sách quyền gốc (Master List)
  const permissions = [
    // Quản lý bài viết
    { permission_name: 'CREATE:POST', description: 'Quyền tạo bài viết', category: 'Quản lý bài viết' },
    { permission_name: 'LIST:POST', description: 'Quyền xem danh sách bài viết', category: 'Quản lý bài viết' },
    { permission_name: 'DETAIL:POST', description: 'Quyền xem chi tiết bài viết', category: 'Quản lý bài viết' },
    {
      permission_name: 'UPDATE:OWN_POST',
      description: 'Quyền sửa bài viết của chính mình',
      category: 'Quản lý bài viết',
    },
    {
      permission_name: 'UPDATE:ANY_POST',
      description: 'Quyền sửa bài viết của bất kỳ ai',
      category: 'Quản lý bài viết',
    },
    {
      permission_name: 'DELETE:OWN_POST',
      description: 'Quyền xóa bài viết của chính mình',
      category: 'Quản lý bài viết',
    },
    {
      permission_name: 'DELETE:ANY_POST',
      description: 'Quyền xóa bài viết của bất kỳ ai',
      category: 'Quản lý bài viết',
    },

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

    // Quản lý bình luận
    { permission_name: 'CREATE:COMMENT', description: 'Quyền tạo bình luận', category: 'Quản lý bình luận' },
    { permission_name: 'LIST:COMMENT', description: 'Quyền xem danh sách bình luận', category: 'Quản lý bình luận' },
    { permission_name: 'DETAIL:COMMENT', description: 'Quyền xem chi tiết bình luận', category: 'Quản lý bình luận' },
    {
      permission_name: 'UPDATE:OWN_COMMENT',
      description: 'Quyền sửa bình luận của chính mình',
      category: 'Quản lý bình luận',
    },
    {
      permission_name: 'UPDATE:ANY_COMMENT',
      description: 'Quyền sửa bình luận của bất kỳ ai',
      category: 'Quản lý bình luận',
    },
    {
      permission_name: 'DELETE:OWN_COMMENT',
      description: 'Quyền xóa bình luận của chính mình',
      category: 'Quản lý bình luận',
    },
    {
      permission_name: 'DELETE:ANY_COMMENT',
      description: 'Quyền xóa bình luận của bất kỳ ai',
      category: 'Quản lý bình luận',
    },

    // Quản lý vai trò
    { permission_name: 'CREATE:ROLE', description: 'Quyền tạo vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'LIST:ROLE', description: 'Quyền xem danh sách vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'DETAIL:ROLE', description: 'Quyền xem chi tiết vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'UPDATE:ROLE', description: 'Quyền sửa vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'DELETE:ROLE', description: 'Quyền xóa vai trò', category: 'Quản lý vai trò' },

    // Quản lý thẻ (Tag)
    { permission_name: 'CREATE:TAG', description: 'Quyền tạo thẻ', category: 'Quản lý thẻ' },
    { permission_name: 'LIST:TAG', description: 'Quyền xem danh sách thẻ', category: 'Quản lý thẻ' },
    { permission_name: 'DETAIL:TAG', description: 'Quyền xem chi tiết thẻ', category: 'Quản lý thẻ' },
    { permission_name: 'UPDATE:TAG', description: 'Quyền sửa thẻ', category: 'Quản lý thẻ' },
    { permission_name: 'DELETE:TAG', description: 'Quyền xóa thẻ', category: 'Quản lý thẻ' },
  ];

  // Tạo permissions hàng loạt
  await prisma.permission.createMany({
    data: permissions.map((p) => ({
      permission_name: p.permission_name,
      description: p.description,
      category: p.category,
    })),
  });

  // 3. Tạo Role Admin (Có tất cả các quyền)

  const adminRole = await prisma.role.upsert({
    where: { role_name: ROLE_ADMIN },
    update: {},
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
    'CREATE:POST',
    'LIST:POST',
    'DETAIL:POST',
    'UPDATE:OWN_POST',
    'DELETE:OWN_POST',
    'CREATE:COMMENT',
    'LIST:COMMENT',
    'DETAIL:COMMENT',
    'UPDATE:OWN_COMMENT',
    'DELETE:OWN_COMMENT',
    'LIST:TAG',
    'DETAIL:TAG',
    'DETAIL:OWN_USER',
    'UPDATE:OWN_USER',
  ];

  const userRole = await prisma.role.upsert({
    where: { role_name: ROLE_USER },
    update: {},
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
