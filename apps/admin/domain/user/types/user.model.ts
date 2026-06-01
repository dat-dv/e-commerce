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
  phones?: Array<{
    id: string;
    phone: string;
    phone_code: string;
    is_verified: boolean;
  }>;
}

export interface IAdminUserAvatar {
  id: string;
  imageId: string;
  url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  isCurrent: boolean;
  createdAt: string;
}

export interface IAdminUpdateUserInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: number;
  avatarId?: string;
  roleId?: string;
}
