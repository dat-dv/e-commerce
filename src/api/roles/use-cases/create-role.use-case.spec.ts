import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleUseCase } from './create-role.use-case';
import { IRolesRepository } from '../domain/roles.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('CreateRoleUseCase', () => {
  let useCase: CreateRoleUseCase;

  const mockRolesRepository = {
    findByName: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRoleUseCase, { provide: IRolesRepository, useValue: mockRolesRepository }],
    }).compile();

    useCase = module.get<CreateRoleUseCase>(CreateRoleUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if role name already exists', async () => {
    mockRolesRepository.findByName.mockResolvedValue({ role_id: '1', role_name: 'ADMIN' });

    await expect(useCase.execute({ role_name: 'ADMIN' })).rejects.toThrow(BadRequestException);
  });

  it('should create role successfully', async () => {
    mockRolesRepository.findByName.mockResolvedValue(null);
    mockRolesRepository.create.mockResolvedValue({ role_id: '1', role_name: 'ADMIN' });

    const result = await useCase.execute({ role_name: 'ADMIN' });

    expect(result).toEqual({ role_id: '1', role_name: 'ADMIN' });
    expect(mockRolesRepository.create).toHaveBeenCalledWith({ role_name: 'ADMIN' });
  });
});
