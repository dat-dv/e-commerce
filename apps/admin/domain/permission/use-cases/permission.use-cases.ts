import { type IAdminPermissionRepository } from "../types/permission.repository";

export class AdminGetRolesUseCase {
  constructor(
    private readonly permissionRepository: IAdminPermissionRepository,
  ) {}

  async execute(page?: number, limit?: number) {
    return this.permissionRepository.getRoles(page, limit);
  }
}

export class AdminGetPermissionsUseCase {
  constructor(
    private readonly permissionRepository: IAdminPermissionRepository,
  ) {}

  async execute(page?: number, limit?: number) {
    return this.permissionRepository.getPermissions(page, limit);
  }
}

export class AdminCreateRoleUseCase {
  constructor(
    private readonly permissionRepository: IAdminPermissionRepository,
  ) {}

  async execute(data: Parameters<IAdminPermissionRepository["createRole"]>[0]) {
    return this.permissionRepository.createRole(data);
  }
}

export class AdminUpdateRolePermissionsUseCase {
  constructor(
    private readonly permissionRepository: IAdminPermissionRepository,
  ) {}

  async execute(roleId: string, permissionIds: string[]) {
    return this.permissionRepository.updateRolePermissions(
      roleId,
      permissionIds,
    );
  }
}
