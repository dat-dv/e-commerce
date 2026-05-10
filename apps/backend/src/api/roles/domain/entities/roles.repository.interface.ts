import { IRole } from './role.entity';
import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IRolesRepository {
  create(data: Prisma.RoleCreateInput): Promise<IRole>;

  findAll(page: number, limit: number): Promise<PaginatedResult<IRole>>;

  findById(id: string): Promise<IRole | null>;

  findByName(name: string): Promise<IRole | null>;

  update(id: string, data: Prisma.RoleUpdateInput): Promise<IRole>;

  delete(id: string): Promise<IRole>;

  countUsersWithRole(roleId: string): Promise<number>;
}

export const IRolesRepository = Symbol('IRolesRepository');
