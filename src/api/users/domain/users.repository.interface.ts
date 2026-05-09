import { User } from './user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  create(data: { email: string; first_name: string; last_name: string; password?: string }): Promise<User>;
  findAll(page: number, limit: number): Promise<{ data: User[]; meta: any }>;
}

export const IUsersRepository = Symbol('IUsersRepository');
