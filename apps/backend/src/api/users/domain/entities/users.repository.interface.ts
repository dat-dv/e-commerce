import { IUserResponse, IPaginatedResult, IUserAvatarResponse } from '@ecommerce/shared';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserDto } from '../../dto/create-user.dto';
import { GetUsersDto } from '../../dto/get-users.dto';

export interface IUsersRepository {
  findById(id: string): Promise<IUserResponse | null>;
  findByEmail(email: string): Promise<IUserResponse | null>;
  updateUserProfile(id: string, updateData: UpdateUserDto): Promise<IUserResponse>;
  updatePassword(id: string, passwordRaw: string): Promise<IUserResponse>;
  create(data: CreateUserDto): Promise<IUserResponse>;
  findAll(query: GetUsersDto): Promise<IPaginatedResult<IUserResponse>>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserAvatarPublicId(userId: string): Promise<string | null>;
  findUserAvatars(userId: string): Promise<IUserAvatarResponse[] | null>;
  addUserPhone(userId: string, data: { phone: string; phone_code: string; is_verified: boolean }): Promise<boolean>;
  remove(id: string): Promise<void>;
}

export const IUsersRepository = Symbol('IUsersRepository');
