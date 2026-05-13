import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from './update-user.use-case';
import { IUsersRepository } from '../entities/users.repository.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IUser } from '@ecommerce/shared';
import { UpdateUserDto } from '../../dto/update-user.dto';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUsersRepository: {
    findById: jest.Mock;
    update: jest.Mock;
    getUserPermissions: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      getUserPermissions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateUserUseCase, { provide: IUsersRepository, useValue: mockUsersRepository }],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const dto: UpdateUserDto = { first_name: 'Updated', id: 'user-1', date_of_birth: new Date() };

    await expect(useCase.execute('user-1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user does not have permission', async () => {
    const user: IUser = {
      id: 'user-1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      password: 'password',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      role_id: null,
    };
    mockUsersRepository.findById.mockResolvedValue(user);
    mockUsersRepository.getUserPermissions.mockResolvedValue([]);

    const dto: UpdateUserDto = { first_name: 'Updated', id: 'user-1', date_of_birth: new Date() };

    await expect(useCase.execute('user-1', dto)).rejects.toThrow(ForbiddenException);
  });

  it('should update user', async () => {
    const user: IUser = {
      id: 'user-1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      password: 'password',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      role_id: null,
    };
    mockUsersRepository.findById.mockResolvedValue(user);
    mockUsersRepository.getUserPermissions.mockResolvedValue(['UPDATE:OWN_USER']);
    mockUsersRepository.update.mockResolvedValue({ ...user, first_name: 'Updated' });

    const dto: UpdateUserDto = { first_name: 'Updated', id: 'user-1', date_of_birth: new Date() };

    const result = await useCase.execute('user-1', dto);

    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-1', dto);
    expect(result.first_name).toBe('Updated');
  });
});
