import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { IUsersRepository } from '../entities/users.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUsersRepository: {
    findByEmail: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserUseCase, { provide: IUsersRepository, useValue: mockUsersRepository }],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if email exists', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue({ user_id: '1' });

    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      confirm_password: 'password',
      first_name: 'Test',
      last_name: 'User',
    };

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create user', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.create.mockResolvedValue({ user_id: '1', email: 'test@example.com' });

    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      confirm_password: 'password',
      first_name: 'Test',
      last_name: 'User',
    };

    const result = await useCase.execute(dto);

    expect(mockUsersRepository.create).toHaveBeenCalledWith({
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      password: dto.password,
    });
    expect(result.user_id).toBe('1');
  });
});
