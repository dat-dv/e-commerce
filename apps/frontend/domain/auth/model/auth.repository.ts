import { IAuthRequest, IRegisterRequest, IUser } from './auth.model';

// ===== IRepository =====
export interface IAuthRepository {
  login(request: IAuthRequest): Promise<IUser>;
  register(request: IRegisterRequest): Promise<void>;
  fetchMe(): Promise<IUser>;
  updateProfile(user: Partial<IUser>): Promise<IUser>;
  logout(): Promise<void>;
}
