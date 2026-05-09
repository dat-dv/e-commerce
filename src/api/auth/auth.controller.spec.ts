import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import express from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockResponse = {} as express.Response;
  const mockRequest = {} as express.Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call service.login and return success response', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const serviceResult = { user_id: 'user-1' };

      mockAuthService.login.mockResolvedValue(serviceResult);

      const result = await controller.login(dto, mockResponse);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto, mockResponse);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('register', () => {
    it('should call service.register and return success response', async () => {
      const dto = { email: 'test@example.com' } as RegisterDto;
      const serviceResult = { user_id: 'user-1' };

      mockAuthService.register.mockResolvedValue(serviceResult);

      const result = await controller.register(dto, mockResponse);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto, mockResponse);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('forgotPassword', () => {
    it('should call service.forgotPassword and return success response', async () => {
      const dto = { email: 'test@example.com' };
      const serviceResult = { message: 'Email sent' };

      mockAuthService.forgotPassword.mockResolvedValue(serviceResult);

      const result = await controller.forgotPassword(dto);

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('resetPassword', () => {
    it('should call service.resetPassword and return success response', async () => {
      const dto = { token: 'token', new_password: 'password' } as ResetPasswordDto;
      const serviceResult = { message: 'Password reset' };

      mockAuthService.resetPassword.mockResolvedValue(serviceResult);

      const result = await controller.resetPassword(dto);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('logout', () => {
    it('should call service.logout and return success response', async () => {
      const serviceResult = true;

      mockAuthService.logout.mockResolvedValue(serviceResult);

      const result = await controller.logout(mockRequest, mockResponse);

      expect(mockAuthService.logout).toHaveBeenCalledWith(mockRequest, mockResponse);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('refreshToken', () => {
    it('should call service.refreshToken and return success response', async () => {
      const serviceResult = true;

      mockAuthService.refreshToken.mockResolvedValue(serviceResult);

      const result = await controller.refreshToken(mockRequest, mockResponse);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(mockRequest, mockResponse);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
