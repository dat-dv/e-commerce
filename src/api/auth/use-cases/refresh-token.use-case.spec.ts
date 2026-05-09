import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from 'generated/prisma/client';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  const mockAuthRepository = {
    findRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
    saveRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
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
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw UnauthorizedException if tokens missing', async () => {
    await expect(useCase.execute(undefined, 'rt')).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute('at', undefined)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if refresh token not in db', async () => {
    mockJwtService.verifyAsync
      .mockResolvedValueOnce({ sub: '1', email: 'test@example.com' })
      .mockResolvedValueOnce({ sub: '1' });
    mockAuthRepository.findRefreshToken.mockResolvedValue(null);

    await expect(useCase.execute('at', 'rt')).rejects.toThrow(UnauthorizedException);
  });

  it('should refresh tokens successfully', async () => {
    const dbToken: Prisma.RefreshTokenGetPayload<Record<string, never>> = {
      token: 'rt',
      user_id: '1',
      expires_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockJwtService.verifyAsync
      .mockResolvedValueOnce({ sub: '1', email: 'test@example.com' })
      .mockResolvedValueOnce({ sub: '1' });
    mockAuthRepository.findRefreshToken.mockResolvedValue(dbToken);
    mockJwtService.signAsync.mockResolvedValueOnce('new-rt').mockResolvedValueOnce('new-at');

    const result = await useCase.execute('at', 'rt');

    expect(result.accessToken).toBe('new-at');
    expect(result.refreshToken).toBe('new-rt');
    expect(mockAuthRepository.removeRefreshToken).toHaveBeenCalledWith('rt');
    expect(mockAuthRepository.saveRefreshToken).toHaveBeenCalled();
  });
});
