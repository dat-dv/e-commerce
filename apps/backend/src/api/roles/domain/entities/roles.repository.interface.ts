import type { IRoleResponse, IPaginatedResult, ICreateRoleRequest, IUpdateRoleRequest } from '@ecommerce/shared';

export interface IRolesRepository {
  create(data: ICreateRoleRequest): Promise<IRoleResponse>;

  findAll(page: number, limit: number): Promise<IPaginatedResult<IRoleResponse>>;

  findById(id: string): Promise<IRoleResponse | null>;

  findByName(name: string): Promise<IRoleResponse | null>;

  update(id: string, data: IUpdateRoleRequest): Promise<IRoleResponse>;

  delete(id: string): Promise<IRoleResponse>;

  countUsersWithRole(roleId: string): Promise<number>;
}

export const IRolesRepository = Symbol('IRolesRepository');
