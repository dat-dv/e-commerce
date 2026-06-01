import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { TokenService } from 'src/shared/services/token/token.service';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { User, EGender } from '@ecommerce/shared';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
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
      if (key === 'ACCESS_TOKEN_EXPIRES_IN') return 3600;
      if (key === 'REFRESH_TOKEN_EXPIRES_IN') return 2592000;
      return key;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: IUsersRepository, useValue: mockUsersRepository },
        { provide: IAuthRepository, useValue: mockAuthRepository },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'test@example.com', password: 'password' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw UnauthorizedException if password incorrect', async () => {
    const user: User = {
      id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      active_phone_id: null,
      password: 'correct-password',
      role_id: '1',
      created_at: new Date(),
      updated_at: new Date(),
      date_of_birth: null,
      gender: EGender.FEMALE,
      deleted_at: null,
    };
    mockUsersRepository.findByEmail.mockResolvedValue(user);

    await expect(useCase.execute({ email: 'test@example.com', password: 'wrong-password' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should login successfully and return tokens', async () => {
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
    mockUsersRepository.findByEmail.mockResolvedValue(user);
    mockTokenService.generateAccessToken.mockResolvedValue('at');
    mockTokenService.generateRefreshToken.mockResolvedValue('rt');

    const result = await useCase.execute({ email: 'test@example.com', password: 'password' });

    expect(result.user).toEqual(expect.objectContaining({ id: user.id, email: user.email }));
    expect(result.user).not.toHaveProperty('password');
    expect(result.user).not.toHaveProperty('salt');
    expect(result.accessToken).toBe('at');
    expect(result.refreshToken).toBe('rt');
    expect(mockAuthRepository.saveRefreshToken).toHaveBeenCalled();
  });
});
