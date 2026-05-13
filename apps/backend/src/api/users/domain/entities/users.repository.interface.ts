import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';
import { IUser } from '@ecommerce/shared';

export interface IUsersRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  create(data: { email: string; password?: string; first_name?: string; last_name?: string }): Promise<IUser>;
  findAll(page: number, limit: number): Promise<PaginatedResult<IUser>>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserAvatarPublicId(userId: string): Promise<string | null>;
  addUserPhone(
    userId: string,
    data: { phone: string; phone_code: string; is_verified: boolean; is_default: boolean },
  ): Promise<boolean>;
}

export const IUsersRepository = Symbol('IUsersRepository');
