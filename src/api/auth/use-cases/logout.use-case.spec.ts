import { Test, TestingModule } from '@nestjs/testing';
import { LogoutUseCase } from './logout.use-case';
import { IAuthRepository } from '../domain/auth.repository.interface';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  const mockAuthRepository = {
    removeRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoutUseCase, { provide: IAuthRepository, useValue: mockAuthRepository }],
    }).compile();

    useCase = module.get<LogoutUseCase>(LogoutUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should remove refresh token if provided', async () => {
    await useCase.execute('rt');
    expect(mockAuthRepository.removeRefreshToken).toHaveBeenCalledWith('rt');
  });

  it('should not remove refresh token if not provided', async () => {
    await useCase.execute(undefined);
    expect(mockAuthRepository.removeRefreshToken).not.toHaveBeenCalled();
  });
});
