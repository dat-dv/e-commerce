import { IPermission, IPaginatedResult } from '@ecommerce/shared';
import { Prisma } from 'generated/prisma/client';

export interface IPermissionsRepository {
  create(data: Prisma.PermissionCreateInput): Promise<IPermission>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<IPermission>>;

  findById(id: string): Promise<IPermission | null>;

  findByName(name: string): Promise<IPermission | null>;

  update(id: string, data: Prisma.PermissionUpdateInput): Promise<IPermission>;

  delete(id: string): Promise<IPermission>;

  countRolesWithPermission(permissionId: string): Promise<number>;
}

export const IPermissionsRepository = Symbol('IPermissionsRepository');
