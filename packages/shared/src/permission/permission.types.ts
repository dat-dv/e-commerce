export interface IPermission {
  id: string;
  permission_name: string;
  description?: string | null;
  category?: string | null;
  created_at: Date;
  updated_at: Date;
}
