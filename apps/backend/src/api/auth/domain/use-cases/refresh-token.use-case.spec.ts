import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from 'generated/prisma/client';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { TokenService } from 'src/shared/services/token/token.service';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  const mockAuthRepository = {
    findRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
    saveRefreshToken: jest.fn(),
  };

  const mockTokenService = {
    verifyRefreshToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    generateAccessToken: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ACCESS_TOKEN_SECRET') return 'at-secret';
      if (key === 'REFRESH_TOKEN_SECRET') return 'rt-secret';
      return key;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        { provide: IAuthRepository, useValue: mockAuthRepository },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw UnauthorizedException if tokens missing', async () => {
    await expect(useCase.execute('rt')).rejects.toThrow(BadRequestException);
    await expect(useCase.execute('at')).rejects.toThrow(BadRequestException);
  });

  it('should throw UnauthorizedException if refresh token not in db', async () => {
    mockTokenService.verifyRefreshToken.mockResolvedValue({ sub: '1', email: 'test@example.com' });
    mockAuthRepository.findRefreshToken.mockResolvedValue(null);

    await expect(useCase.execute('rt')).rejects.toThrow(BadRequestException);
  });

  it('should refresh tokens successfully', async () => {
    const dbToken: Prisma.RefreshTokenGetPayload<Record<string, never>> = {
      token: 'rt',
      user_id: '1',
      expires_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockTokenService.verifyRefreshToken.mockResolvedValue({ sub: '1', email: 'test@example.com' });
    mockAuthRepository.findRefreshToken.mockResolvedValue(dbToken);
    mockTokenService.generateRefreshToken.mockResolvedValue('new-rt');
    mockTokenService.generateAccessToken.mockResolvedValue('new-at');

    const result = await useCase.execute('rt');

    expect(result.accessToken).toBe('new-at');
    expect(result.refreshToken).toBe('new-rt');
    expect(mockAuthRepository.removeRefreshToken).toHaveBeenCalledWith('rt');
    expect(mockAuthRepository.saveRefreshToken).toHaveBeenCalled();
  });
});
