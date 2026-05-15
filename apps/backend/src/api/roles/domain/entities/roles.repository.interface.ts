import type { IRoleResponse, IPaginatedResult } from '@ecommerce/shared';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { UpdateRoleDto } from '../../dto/update-role.dto';

export interface IRolesRepository {
  create(data: CreateRoleDto): Promise<IRoleResponse>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<IRoleResponse>>;

  findById(id: string): Promise<IRoleResponse | null>;

  findByName(name: string): Promise<IRoleResponse | null>;

  update(id: string, data: UpdateRoleDto): Promise<IRoleResponse>;

  delete(id: string): Promise<IRoleResponse>;

  countUsersWithRole(roleId: string): Promise<number>;
}

export const IRolesRepository = Symbol('IRolesRepository');
