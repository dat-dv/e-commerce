import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/api/users/domain/entities/user.entity';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
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
        LoginUseCase,
        { provide: IUsersRepository, useValue: mockUsersRepository },
        { provide: IAuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
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
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password incorrect', async () => {
    const user: IUser = {
      id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      password: 'correct-password',
    };
    mockUsersRepository.findByEmail.mockResolvedValue(user);

    await expect(useCase.execute({ email: 'test@example.com', password: 'wrong-password' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should login successfully and return tokens', async () => {
    const user: IUser = {
      id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      password: 'password',
    };
    mockUsersRepository.findByEmail.mockResolvedValue(user);
    mockJwtService.signAsync.mockResolvedValueOnce('at').mockResolvedValueOnce('rt');

    const result = await useCase.execute({ email: 'test@example.com', password: 'password' });

    expect(result.user).toBe(user);
    expect(result.accessToken).toBe('at');
    expect(result.refreshToken).toBe('rt');
    expect(mockAuthRepository.saveRefreshToken).toHaveBeenCalled();
  });
});
