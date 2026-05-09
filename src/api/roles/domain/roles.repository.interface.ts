import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IRolesRepository {
  create(data: Prisma.RoleCreateInput): Promise<Prisma.RoleGetPayload<Record<string, never>>>;

  findAll(page: number, limit: number): Promise<PaginatedResult<Prisma.RoleGetPayload<Record<string, never>>>>;

  findById(id: string): Promise<Prisma.RoleGetPayload<Record<string, never>> | null>;

  findByName(name: string): Promise<Prisma.RoleGetPayload<Record<string, never>> | null>;

  update(id: string, data: Prisma.RoleUpdateInput): Promise<Prisma.RoleGetPayload<Record<string, never>>>;

  delete(id: string): Promise<Prisma.RoleGetPayload<Record<string, never>>>;

  countUsersWithRole(roleId: string): Promise<number>;
}

export const IRolesRepository = Symbol('IRolesRepository');
