import {
  User,
  IPaginatedResult,
  ICreateUserRequest,
  IUpdateUserRequest,
  IAddUserPhoneRequest,
} from '@ecommerce/shared';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string, includeSecret?: boolean): Promise<User | null>;
  updateUserProfile(id: string, data: IUpdateUserRequest): Promise<User>;
  updatePassword(id: string, passwordRaw: string): Promise<User>;
  create(data: ICreateUserRequest): Promise<User>;
  findAll(page: number, limit: number): Promise<IPaginatedResult<User>>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserAvatarPublicId(userId: string): Promise<string | null>;
  addUserPhone(userId: string, data: IAddUserPhoneRequest): Promise<boolean>;
  remove(id: string): Promise<void>;
}

export const IUsersRepository = Symbol('IUsersRepository');
