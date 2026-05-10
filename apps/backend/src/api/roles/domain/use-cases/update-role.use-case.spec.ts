import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRoleUseCase } from './update-role.use-case';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('UpdateRoleUseCase', () => {
  let useCase: UpdateRoleUseCase;

  const mockRolesRepository = {
    findByName: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateRoleUseCase, { provide: IRolesRepository, useValue: mockRolesRepository }],
    }).compile();

    useCase = module.get<UpdateRoleUseCase>(UpdateRoleUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if role name already exists for another role', async () => {
    mockRolesRepository.findByName.mockResolvedValue({ role_id: '2', role_name: 'ADMIN' });

    await expect(useCase.execute('1', { role_name: 'ADMIN' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if role not found', async () => {
    mockRolesRepository.findByName.mockResolvedValue(null);
    mockRolesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', { role_name: 'NEW_NAME' })).rejects.toThrow(BadRequestException);
  });

  it('should update successfully', async () => {
    mockRolesRepository.findByName.mockResolvedValue(null);
    mockRolesRepository.findById.mockResolvedValue({ role_id: '1', role_name: 'OLD_NAME' });
    mockRolesRepository.update.mockResolvedValue({ role_id: '1', role_name: 'NEW_NAME' });

    const result = await useCase.execute('1', { role_name: 'NEW_NAME' });

    expect(result).toEqual({ role_id: '1', role_name: 'NEW_NAME' });
    expect(mockRolesRepository.update).toHaveBeenCalledWith('1', { role_name: 'NEW_NAME' });
  });
});
