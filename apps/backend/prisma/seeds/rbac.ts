import { PrismaClient } from '../../generated/prisma/client';
import { ROLE_ADMIN, ROLE_USER } from '../../src/common/constants/roles.constant';

export async function seedRBAC(prisma: PrismaClient) {
  console.log('--- Phase 0: Roles & Permissions ---');

  // 1. Định nghĩa danh sách quyền gốc (Master List)
  const permissions = [
    {
      permission_name: 'ACCESS:ADMIN',
      description: 'Quyền truy cập trang quản trị',
      category: 'Quản trị hệ thống',
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

    // Quản lý vai trò
    { permission_name: 'CREATE:ROLE', description: 'Quyền tạo vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'LIST:ROLE', description: 'Quyền xem danh sách vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'DETAIL:ROLE', description: 'Quyền xem chi tiết vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'UPDATE:ROLE', description: 'Quyền sửa vai trò', category: 'Quản lý vai trò' },
    { permission_name: 'DELETE:ROLE', description: 'Quyền xóa vai trò', category: 'Quản lý vai trò' },

    // Quản lý quyền
    { permission_name: 'LIST:PERMISSION', description: 'Quyền xem danh sách quyền', category: 'Quản lý quyền' },
    { permission_name: 'DETAIL:PERMISSION', description: 'Quyền xem chi tiết quyền', category: 'Quản lý quyền' },
    { permission_name: 'UPDATE:PERMISSION', description: 'Quyền sửa quyền', category: 'Quản lý quyền' },
    { permission_name: 'DELETE:PERMISSION', description: 'Quyền xóa quyền', category: 'Quản lý quyền' },

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

    // Quản lý đơn hàng (Order)
    { permission_name: 'CREATE:ORDER', description: 'Quyền tạo đơn hàng', category: 'Quản lý đơn hàng' },
    {
      permission_name: 'LIST:OWN_ORDER',
      description: 'Quyền xem danh sách đơn hàng của mình',
      category: 'Quản lý đơn hàng',
    },
    {
      permission_name: 'LIST:ANY_ORDER',
      description: 'Quyền xem danh sách tất cả đơn hàng',
      category: 'Quản lý đơn hàng',
    },
    {
      permission_name: 'DETAIL:OWN_ORDER',
      description: 'Quyền xem chi tiết đơn hàng của mình',
      category: 'Quản lý đơn hàng',
    },
    {
      permission_name: 'DETAIL:ANY_ORDER',
      description: 'Quyền xem chi tiết bất kỳ đơn hàng nào',
      category: 'Quản lý đơn hàng',
    },
    {
      permission_name: 'UPDATE:ORDER',
      description: 'Quyền cập nhật trạng thái đơn hàng',
      category: 'Quản lý đơn hàng',
    },

    // Quản lý yêu cầu trả hàng (Order Return)
    {
      permission_name: 'CREATE:ORDER_RETURN',
      description: 'Quyền tạo yêu cầu trả hàng',
      category: 'Quản lý trả hàng',
    },
    {
      permission_name: 'LIST:ANY_ORDER_RETURN',
      description: 'Quyền xem danh sách tất cả yêu cầu trả hàng',
      category: 'Quản lý trả hàng',
    },
    {
      permission_name: 'CANCEL:OWN_ORDER_RETURN',
      description: 'Quyền hủy yêu cầu trả hàng của chính mình',
      category: 'Quản lý trả hàng',
    },
    {
      permission_name: 'UPDATE:ORDER_RETURN',
      description: 'Quyền cập nhật trạng thái yêu cầu trả hàng',
      category: 'Quản lý trả hàng',
    },

    // Quản lý sản phẩm (Product)
    { permission_name: 'CREATE:PRODUCT', description: 'Quyền tạo sản phẩm', category: 'Quản lý sản phẩm' },
    { permission_name: 'LIST:PRODUCT', description: 'Quyền xem danh sách sản phẩm', category: 'Quản lý sản phẩm' },
    { permission_name: 'DETAIL:PRODUCT', description: 'Quyền xem chi tiết sản phẩm', category: 'Quản lý sản phẩm' },
    { permission_name: 'UPDATE:PRODUCT', description: 'Quyền sửa sản phẩm', category: 'Quản lý sản phẩm' },
    { permission_name: 'DELETE:PRODUCT', description: 'Quyền xóa sản phẩm', category: 'Quản lý sản phẩm' },

    // Quản lý Flash Sale
    {
      permission_name: 'CREATE:FLASH_SALE',
      description: 'Quyền tạo chiến dịch Flash Sale',
      category: 'Quản lý Flash Sale',
    },
    {
      permission_name: 'LIST:FLASH_SALE',
      description: 'Quyền xem danh sách Flash Sale',
      category: 'Quản lý Flash Sale',
    },
    {
      permission_name: 'DETAIL:FLASH_SALE',
      description: 'Quyền xem chi tiết Flash Sale',
      category: 'Quản lý Flash Sale',
    },
    {
      permission_name: 'UPDATE:FLASH_SALE',
      description: 'Quyền sửa chiến dịch Flash Sale',
      category: 'Quản lý Flash Sale',
    },
    {
      permission_name: 'DELETE:FLASH_SALE',
      description: 'Quyền xóa chiến dịch Flash Sale',
      category: 'Quản lý Flash Sale',
    },

    // Quản lý Thông báo
    {
      permission_name: 'CREATE:NOTIFICATION_TOKEN',
      description: 'Quyền đăng ký token thông báo',
      category: 'Quản lý thông báo',
    },
    {
      permission_name: 'DELETE:NOTIFICATION_TOKEN',
      description: 'Quyền xóa token thông báo',
      category: 'Quản lý thông báo',
    },
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

  const adminRole = await prisma.role.upsert({
    where: { role_name: ROLE_ADMIN },
    update: {
      description: 'Quản trị viên hệ thống',
    },
    create: {
      role_name: ROLE_ADMIN,
      description: 'Quản trị viên hệ thống',
    },
  });

  const grantMissingPermissions = async (roleId: string, permissionNames: string[]) => {
    const targetPermissions = await prisma.permission.findMany({
      where: {
        permission_name: {
          in: permissionNames,
        },
      },
      select: {
        id: true,
      },
    });

    const existingRolePermissions = await prisma.rolePermission.findMany({
      where: {
        role_id: roleId,
      },
      select: {
        permission_id: true,
      },
    });

    const existingPermissionIds = new Set(existingRolePermissions.map((item) => item.permission_id));
    const missingPermissions = targetPermissions.filter((permission) => !existingPermissionIds.has(permission.id));

    if (!missingPermissions.length) return;

    await prisma.rolePermission.createMany({
      data: missingPermissions.map((permission) => ({
        role_id: roleId,
        permission_id: permission.id,
      })),
    });
  };

  // 3. Tạo Role Admin và grant thêm các quyền còn thiếu, không xoá quyền đang có.
  await grantMissingPermissions(
    adminRole.id,
    permissions.map((p) => p.permission_name),
  );

  // 4. Tạo Role User và grant thêm các quyền cơ bản còn thiếu, không xoá quyền đang có.
  const userPermNames = [
    'LIST:CATEGORY',
    'DETAIL:CATEGORY',
    'CREATE:REVIEW',
    'LIST:REVIEW',
    'DETAIL:REVIEW',
    'DETAIL:OWN_USER',
    'UPDATE:OWN_USER',
    'LIST:PRODUCT',
    'DETAIL:PRODUCT',
    'LIST:FLASH_SALE',
    'DETAIL:FLASH_SALE',
    'CREATE:NOTIFICATION_TOKEN',
    'DELETE:NOTIFICATION_TOKEN',
    'CREATE:ORDER',
    'LIST:OWN_ORDER',
    'DETAIL:OWN_ORDER',
    'CREATE:ORDER_RETURN',
    'CANCEL:OWN_ORDER_RETURN',
  ];

  const userRole = await prisma.role.upsert({
    where: { role_name: ROLE_USER },
    update: {
      description: 'Người dùng thông thường',
    },
    create: {
      role_name: ROLE_USER,
      description: 'Người dùng thông thường',
    },
  });

  await grantMissingPermissions(userRole.id, userPermNames);

  console.log(`🔑 Đã đảm bảo Role ADMIN có tối thiểu ${permissions.length} quyền master`);
  console.log(`🔑 Đã đảm bảo Role USER có tối thiểu ${userPermNames.length} quyền cơ bản`);

  return { adminRole, userRole };
}
