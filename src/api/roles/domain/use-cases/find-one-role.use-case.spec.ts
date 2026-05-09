import { Test, TestingModule } from '@nestjs/testing';
import { FindOneRoleUseCase } from './find-one-role.use-case';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('FindOneRoleUseCase', () => {
  let useCase: FindOneRoleUseCase;

  const mockRolesRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneRoleUseCase, { provide: IRolesRepository, useValue: mockRolesRepository }],
    }).compile();

    useCase = module.get<FindOneRoleUseCase>(FindOneRoleUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if role not found', async () => {
    mockRolesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should return role if found', async () => {
    const mockRole = { role_id: '1', role_name: 'ADMIN' };
    mockRolesRepository.findById.mockResolvedValue(mockRole);

    const result = await useCase.execute('1');

    expect(result).toBe(mockRole);
  });
});
