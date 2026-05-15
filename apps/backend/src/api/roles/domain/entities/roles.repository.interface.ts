import type { IRoleResponse, IPaginatedResult } from '@ecommerce/shared';
import { Prisma } from 'generated/prisma/client';

export interface IRolesRepository {
  create(data: Prisma.RoleCreateInput): Promise<IRoleResponse>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<IRoleResponse>>;

  findById(id: string): Promise<IRoleResponse | null>;

  findByName(name: string): Promise<IRoleResponse | null>;

  update(id: string, data: Prisma.RoleUpdateInput): Promise<IRoleResponse>;

  delete(id: string): Promise<IRoleResponse>;

  countUsersWithRole(roleId: string): Promise<number>;
}

export const IRolesRepository = Symbol('IRolesRepository');
