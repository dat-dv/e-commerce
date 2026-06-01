import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from './register.use-case';
import { TokenService } from 'src/shared/services/token/token.service';
import { CreateUserUseCase } from 'src/api/users/domain/use-cases/create-user.use-case';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { User, EGender } from '@ecommerce/shared';
import { ICartRepository } from 'src/api/cart/domain/entities/cart.repository.interface';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockAuthRepository = {
    saveRefreshToken: jest.fn(),
  };

  const mockCartRepository = {
    createCart: jest.fn(),
  };

  const mockTokenService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ACCESS_TOKEN_SECRET') return 'at-secret';
      if (key === 'REFRESH_TOKEN_SECRET') return 'rt-secret';
      if (key === 'ACCESS_TOKEN_EXPIRES_IN') return 3600;
      if (key === 'REFRESH_TOKEN_EXPIRES_IN') return 2592000;
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
        { provide: ICartRepository, useValue: mockCartRepository },
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
    const user: User = {
      id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      active_phone_id: null,
      password: 'password',
      role_id: '1',
      created_at: new Date(),
      updated_at: new Date(),
      date_of_birth: null,
      gender: EGender.FEMALE,

      deleted_at: null,
    };
    mockCreateUserUseCase.execute.mockResolvedValue(user);
    mockCartRepository.createCart.mockResolvedValue({ id: 'cart-1', user_id: user.id });
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
