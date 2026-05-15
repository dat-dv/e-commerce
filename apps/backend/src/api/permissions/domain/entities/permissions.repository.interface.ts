import { IPermission, IPaginatedResult, ICreatePermissionRequest, IUpdatePermissionRequest } from '@ecommerce/shared';

export interface IPermissionsRepository {
  create(data: ICreatePermissionRequest): Promise<IPermission>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<IPermission>>;

  findById(id: string): Promise<IPermission | null>;

  findByName(name: string): Promise<IPermission | null>;

  update(id: string, data: IUpdatePermissionRequest): Promise<IPermission>;

  delete(id: string): Promise<IPermission>;

  countRolesWithPermission(permissionId: string): Promise<number>;
}

export const IPermissionsRepository = Symbol('IPermissionsRepository');
