import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from './update-user.use-case';
import { IUsersRepository } from '../domain/users.repository.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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
      providers: [UpdateUserUseCase, { provide: IUsersRepository, useValue: mockUsersRepository }],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const dto: UpdateUserDto = { first_name: 'Updated' };

    await expect(useCase.execute('user-1', 'user-1', dto)).rejects.toThrow(BadRequestException);
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

    const dto: UpdateUserDto = { first_name: 'Updated' };

    await expect(useCase.execute('user-1', 'user-1', dto)).rejects.toThrow(ForbiddenException);
  });

  it('should update user', async () => {
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
      ['UPDATE:OWN_USER'],
    );
    mockUsersRepository.findById.mockResolvedValue(user);
    mockUsersRepository.update.mockResolvedValue({ ...user, first_name: 'Updated' });

    const dto: UpdateUserDto = { first_name: 'Updated' };

    const result = await useCase.execute('user-1', 'user-1', dto);

    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-1', dto);
    expect(result.first_name).toBe('Updated');
  });
});
