export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends IAuthRequest {
  fullName: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  address?: string | null;
  dob?: string | null;
  password?: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
