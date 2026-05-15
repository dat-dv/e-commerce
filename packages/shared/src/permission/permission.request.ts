export interface ICreatePermissionRequest {
  permission_name: string;
  description?: string;
  module: string;
}

export interface IUpdatePermissionRequest {
  permission_name?: string;
  description?: string;
  module?: string;
}
