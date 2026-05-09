import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from './register.use-case';
import { CreateUserUseCase } from 'src/api/users/use-cases/create-user.use-case';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/api/users/domain/user.entity';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockAuthRepository = {
    saveRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ACCESS_TOKEN_SECRET') return 'at-secret';
      if (key === 'REFRESH_TOKEN_SECRET') return 'rt-secret';
      if (key === 'ACCESS_TOKEN_EXPIRES_IN') return '1h';
      if (key === 'REFRESH_TOKEN_EXPIRES_IN') return '30d';
      return key;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: IAuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    useCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should register successfully and return tokens', async () => {
    const user = new User('1', 'Test', 'User', 'test@example.com', null, 'password');
    mockCreateUserUseCase.execute.mockResolvedValue(user);
    mockJwtService.signAsync.mockResolvedValueOnce('at').mockResolvedValueOnce('rt');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password',
      confirm_password: 'password',
      first_name: 'Test',
      last_name: 'User',
    });

    expect(result.user).toBe(user);
    expect(result.accessToken).toBe('at');
    expect(result.refreshToken).toBe('rt');
    expect(mockAuthRepository.saveRefreshToken).toHaveBeenCalled();
  });
});
