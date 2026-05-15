import { IUserResponse, IPaginatedResult } from '@ecommerce/shared';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserDto } from '../../dto/create-user.dto';

export interface IUsersRepository {
  findById(id: string): Promise<IUserResponse | null>;
  findByEmail(email: string): Promise<IUserResponse | null>;
  updateUserProfile(id: string, updateData: UpdateUserDto): Promise<IUserResponse>;
  updatePassword(id: string, passwordRaw: string): Promise<IUserResponse>;
  create(data: CreateUserDto): Promise<IUserResponse>;
  findAll(page: number, limit: number): Promise<IPaginatedResult<IUserResponse>>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserAvatarPublicId(userId: string): Promise<string | null>;
  addUserPhone(
    userId: string,
    data: { phone_number: string; phone_code: string; is_verified: boolean; is_default: boolean },
  ): Promise<boolean>;
  remove(id: string): Promise<void>;
}

export const IUsersRepository = Symbol('IUsersRepository');
