import { IAuthRequest, IRegisterRequest, TUser } from "./auth.model";

// ===== IRepository =====
export interface IAuthRepository {
  login(request: IAuthRequest): Promise<TUser>;
  register(request: IRegisterRequest): Promise<void>;
  fetchMe(): Promise<TUser>;
  updateProfile(user: Partial<TUser>): Promise<TUser>;
  logout(): Promise<void>;
}
