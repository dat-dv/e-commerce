import { Test, TestingModule } from '@nestjs/testing';
import { RemoveUserUseCase } from './remove-user.use-case';
import { IUsersRepository } from '../domain/users.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { User } from '../domain/user.entity';

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
    const user = new User(
      'user-1',
      'Test',
      'User',
      'test@example.com',
      null,
      'password',
      new Date(),
      new Date(),
      null,
      null,
      [],
    );
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
