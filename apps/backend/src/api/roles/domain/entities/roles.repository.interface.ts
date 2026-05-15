import { Role, IPaginatedResult } from '@ecommerce/shared';
import { Prisma } from 'generated/prisma/client';

export interface IRolesRepository {
  create(data: Prisma.RoleCreateInput): Promise<Role>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<Role>>;

  findById(id: string): Promise<Role | null>;

  findByName(name: string): Promise<Role | null>;

  update(id: string, data: Prisma.RoleUpdateInput): Promise<Role>;

  delete(id: string): Promise<Role>;

  countUsersWithRole(roleId: string): Promise<number>;
}

export const IRolesRepository = Symbol('IRolesRepository');
