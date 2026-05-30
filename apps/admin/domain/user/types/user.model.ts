export interface IAdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roleName?: string | null;
  avatarUrl?: string | null;
}
