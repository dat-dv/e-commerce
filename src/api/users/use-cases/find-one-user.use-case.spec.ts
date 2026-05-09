import { Test, TestingModule } from '@nestjs/testing';
import { FindOneUserUseCase } from './find-one-user.use-case';
import { IUsersRepository } from '../domain/users.repository.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { User } from '../domain/user.entity';

describe('FindOneUserUseCase', () => {
  let useCase: FindOneUserUseCase;
  let mockUsersRepository: {
    findById: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findById: jest.fn(),
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

    await expect(useCase.execute('user-1', 'user-1')).rejects.toThrow(ForbiddenException);
  });

  it('should return user if has permission', async () => {
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
      ['DETAIL:OWN_USER'],
    );
    mockUsersRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute('user-1', 'user-1');

    expect(result).toEqual(user);
  });
});
