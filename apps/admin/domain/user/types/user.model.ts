export interface IAdminRole {
  id: string;
  roleName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string | null;
  gender?: number | null;
  avatarId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  roleId: string;
  role?: IAdminRole | null;
  avatar?: { url: string } | null;
  avatarUrl?: string | null;
  phones?: unknown[];
}
