import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/api/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import express from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'REFRESH_TOKEN_EXPIRES_IN') return 3600;
      if (key === 'ACCESS_TOKEN_EXPIRES_IN') return 900;
      return key;
    }),
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  const mockCookie = jest.fn();
  const mockResponse = {
    cookie: mockCookie,
    clearCookie: jest.fn(),
  } as unknown as express.Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password' };

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ email: 'test@example.com', password: 'wrong_password' });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(UnauthorizedException);
    });

    it('should login successfully and set cookies', async () => {
      const user = { user_id: 'user-1', email: 'test@example.com', password: 'password' };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token');
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login(loginDto, mockResponse);

      expect(mockCookie).toHaveBeenCalledTimes(2); // Access and Refresh tokens
      expect(result).not.toHaveProperty('password');
      expect(result.user_id).toBe('user-1');
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password',
      confirm_password: 'password',
      first_name: 'John',
      last_name: 'Doe',
    };

    it('should register successfully and set cookies', async () => {
      const user = { user_id: 'user-1', email: 'test@example.com' };
      mockUsersService.create.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token');
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.register(registerDto, mockResponse);

      expect(mockCookie).toHaveBeenCalledTimes(2);
      expect(result.user_id).toBe('user-1');
    });
  });
});
