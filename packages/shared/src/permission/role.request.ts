export interface ICreateRoleRequest {
  role_name: string;
  description?: string;
  permissions?: string[];
}

export interface IUpdateRoleRequest {
  role_name?: string;
  description?: string;
  permissions?: string[];
}
