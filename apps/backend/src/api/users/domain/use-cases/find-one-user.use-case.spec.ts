import { Test, TestingModule } from '@nestjs/testing';
import { FindOneUserUseCase } from './find-one-user.use-case';
import { IUsersRepository } from '../entities/users.repository.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IUser } from '../entities/user.entity';

describe('FindOneUserUseCase', () => {
  let useCase: FindOneUserUseCase;
  let mockUsersRepository: {
    findById: jest.Mock;
    getUserPermissions: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findById: jest.fn(),
      getUserPermissions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneUserUseCase, { provide: IUsersRepository, useValue: mockUsersRepository }],
    }).compile();

    useCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('user-1', 'user-1')).rejects.toThrow(BadRequestException);
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

    await expect(useCase.execute('user-1', 'user-1')).rejects.toThrow(ForbiddenException);
  });

  it('should return user if has permission', async () => {
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
    mockUsersRepository.getUserPermissions.mockResolvedValue(['DETAIL:OWN_USER']);

    const result = await useCase.execute('user-1', 'user-1');

    expect(result).toEqual(user);
  });
});
