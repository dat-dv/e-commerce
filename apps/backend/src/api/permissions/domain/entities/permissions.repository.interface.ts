import type { IPermission, IPaginatedResult } from '@ecommerce/shared';
import { CreatePermissionDto } from '../../dto/create-permission.dto';
import { UpdatePermissionDto } from '../../dto/update-permission.dto';

export interface IPermissionsRepository {
  create(data: CreatePermissionDto): Promise<IPermission>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<IPermission>>;

  findById(id: string): Promise<IPermission | null>;

  findByName(name: string): Promise<IPermission | null>;

  update(id: string, data: UpdatePermissionDto): Promise<IPermission>;

  delete(id: string): Promise<IPermission>;

  countRolesWithPermission(permissionId: string): Promise<number>;
}

export const IPermissionsRepository = Symbol('IPermissionsRepository');
