import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IPermissionsRepository {
  create(data: Prisma.PermissionCreateInput): Promise<Prisma.PermissionGetPayload<Record<string, never>>>;

  findAll(page: number, limit: number): Promise<PaginatedResult<Prisma.PermissionGetPayload<Record<string, never>>>>;

  findById(id: string): Promise<Prisma.PermissionGetPayload<Record<string, never>> | null>;

  findByName(name: string): Promise<Prisma.PermissionGetPayload<Record<string, never>> | null>;

  update(id: string, data: Prisma.PermissionUpdateInput): Promise<Prisma.PermissionGetPayload<Record<string, never>>>;

  delete(id: string): Promise<Prisma.PermissionGetPayload<Record<string, never>>>;

  countRolesWithPermission(permissionId: string): Promise<number>;
}

export const IPermissionsRepository = Symbol('IPermissionsRepository');
