import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordUseCase } from './reset-password.use-case';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { UnauthorizedException } from '@nestjs/common';
import { User, EGender } from '@ecommerce/shared';
import { TokenService } from 'src/shared/services/token/token.service';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;

  const mockUsersRepository = {
    findById: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockTokenService = {
    verifyResetPasswordToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        { provide: IUsersRepository, useValue: mockUsersRepository },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    useCase = module.get<ResetPasswordUseCase>(ResetPasswordUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw UnauthorizedException if token invalid', async () => {
    mockTokenService.verifyResetPasswordToken.mockRejectedValue(new Error('Invalid token'));

    await expect(useCase.execute({ token: 'invalid', new_password: 'new', confirm_password: 'new' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user not found (due to try/catch)', async () => {
    mockTokenService.verifyResetPasswordToken.mockResolvedValue({ userId: '1' });
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ token: 'valid', new_password: 'new', confirm_password: 'new' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reset password successfully', async () => {
    const user: User = {
      id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      avatar_id: null,
      password: 'old-password',
      role_id: '1',
      created_at: new Date(),
      updated_at: new Date(),
      date_of_birth: null,
      gender: EGender.FEMALE,
      salt: 'salt',
      deleted_at: null,
    };
    mockTokenService.verifyResetPasswordToken.mockResolvedValue({ userId: '1' });
    mockUsersRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute({
      token: 'valid',
      new_password: 'new-password',
      confirm_password: 'new-password',
    });

    expect(result).toEqual({ success: true });
    expect(mockUsersRepository.updatePassword).toHaveBeenCalledWith('1', 'new-password');
  });
});
