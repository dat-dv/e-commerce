import {
  IPaginatedResult,
  ICreateUserRequest,
  IUpdateUserRequest,
  IAddUserPhoneRequest,
  IUserResponse,
} from '@ecommerce/shared';

export interface IUsersRepository {
  findById(id: string): Promise<IUserResponse | null>;
  findByEmail(email: string, includeSecret?: boolean): Promise<IUserResponse | null>;
  updateUserProfile(id: string, data: IUpdateUserRequest): Promise<IUserResponse>;
  updatePassword(id: string, passwordRaw: string): Promise<IUserResponse>;
  create(data: ICreateUserRequest): Promise<IUserResponse>;
  findAll(page: number, limit: number): Promise<IPaginatedResult<IUserResponse>>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserAvatarPublicId(userId: string): Promise<string | null>;
  addUserPhone(userId: string, data: IAddUserPhoneRequest): Promise<boolean>;
  remove(id: string): Promise<void>;
}

export const IUsersRepository = Symbol('IUsersRepository');
