import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordUseCase } from './reset-password.use-case';
import { IUsersRepository } from 'src/api/users/domain/users.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/api/users/domain/user.entity';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;

  const mockUsersRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'RESET_PASSWORD_TOKEN') return 'reset-secret';
      return key;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        { provide: IUsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    useCase = module.get<ResetPasswordUseCase>(ResetPasswordUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw UnauthorizedException if token invalid', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(useCase.execute({ token: 'invalid', new_password: 'new', confirm_password: 'new' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user not found (due to try/catch)', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({ sub: '1' });
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ token: 'valid', new_password: 'new', confirm_password: 'new' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reset password successfully', async () => {
    const user = new User('1', 'Test', 'User', 'test@example.com', null, 'old-password');
    mockJwtService.verifyAsync.mockResolvedValue({ sub: '1' });
    mockUsersRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute({
      token: 'valid',
      new_password: 'new-password',
      confirm_password: 'new-password',
    });

    expect(result).toEqual({ success: true });
    expect(mockUsersRepository.update).toHaveBeenCalledWith('1', { password: 'new-password' });
  });
});
