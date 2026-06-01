import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import { IUserResponse } from '@ecommerce/shared';
import { EGender } from '@ecommerce/shared';
import { TokenService } from 'src/shared/services/token/token.service';

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
  };

  const mockTokenService = {
    generateResetPasswordToken: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'RESET_PASSWORD_TOKEN_SECRET') return 'reset-secret';
      if (key === 'FE_URL') return 'http://localhost:3000';
      return key;
    }),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordUseCase,
        { provide: IUsersRepository, useValue: mockUsersRepository },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    useCase = module.get<ForgotPasswordUseCase>(ForgotPasswordUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'test@example.com' })).rejects.toThrow(BadRequestException);
  });

  it('should send reset password mail successfully', async () => {
    const user: IUserResponse = {
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
    mockTokenService.generateResetPasswordToken.mockResolvedValue('token');

    const result = await useCase.execute({ email: 'test@example.com' });

    expect(result).toEqual({ success: true });
    expect(mockMailService.sendMail).toHaveBeenCalled();
  });
});
