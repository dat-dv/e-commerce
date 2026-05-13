import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from './register.use-case';
import { TokenService } from 'src/shared/services/token/token.service';
import { CreateUserUseCase } from 'src/api/users/domain/use-cases/create-user.use-case';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@ecommerce/shared';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockAuthRepository = {
    saveRefreshToken: jest.fn(),
  };

  const mockTokenService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
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
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    useCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should register successfully and return tokens', async () => {
    const user: IUser = {
      id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      password: 'password',
    };
    mockCreateUserUseCase.execute.mockResolvedValue(user);
    mockTokenService.generateAccessToken.mockResolvedValue('at');
    mockTokenService.generateRefreshToken.mockResolvedValue('rt');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password',
      confirm_password: 'password',
    });

    expect(result.user).toBe(user);
    expect(result.accessToken).toBe('at');
    expect(result.refreshToken).toBe('rt');
    expect(mockAuthRepository.saveRefreshToken).toHaveBeenCalled();
  });
});
