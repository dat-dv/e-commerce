import { Test, TestingModule } from '@nestjs/testing';
import { RemoveUserUseCase } from './remove-user.use-case';
import { IUsersRepository } from '../entities/users.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { IUser } from '../entities/user.entity';

describe('RemoveUserUseCase', () => {
  let useCase: RemoveUserUseCase;
  let mockUsersRepository: {
    findById: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findById: jest.fn(),
      update: jest.fn(),
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
    mockUsersRepository.update.mockResolvedValue({ ...user, deleted_at: new Date() });

    await useCase.execute('user-1');

    expect(mockUsersRepository.update).toHaveBeenCalledWith(
      'user-1',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect.objectContaining({ deleted_at: expect.any(Date) }),
    );
  });
});
