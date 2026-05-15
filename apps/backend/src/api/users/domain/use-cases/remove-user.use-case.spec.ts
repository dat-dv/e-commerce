import { Test, TestingModule } from '@nestjs/testing';
import { RemoveUserUseCase } from './remove-user.use-case';
import { IUsersRepository } from '../entities/users.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { User, EGender } from '@ecommerce/shared';

describe('RemoveUserUseCase', () => {
  let useCase: RemoveUserUseCase;
  let mockUsersRepository: {
    findById: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findById: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveUserUseCase, { provide: IUsersRepository, useValue: mockUsersRepository }],
    }).compile();

    useCase = module.get<RemoveUserUseCase>(RemoveUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('user-1')).rejects.toThrow(BadRequestException);
  });

  it('should soft delete user', async () => {
    const user: User = {
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
      date_of_birth: null,
      gender: EGender.FEMALE,
      salt: 'salt',
    };
    mockUsersRepository.findById.mockResolvedValue(user);
    mockUsersRepository.remove.mockResolvedValue(undefined);

    await useCase.execute('user-1');

    expect(mockUsersRepository.remove).toHaveBeenCalledWith('user-1');
  });
});
