import { IUser } from './user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  create(data: { email: string; password?: string; first_name?: string; last_name?: string }): Promise<IUser>;
  findAll(page: number, limit: number): Promise<{ data: IUser[]; meta: any }>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserAvatarPublicId(userId: string): Promise<string | null>;
}

export const IUsersRepository = Symbol('IUsersRepository');
