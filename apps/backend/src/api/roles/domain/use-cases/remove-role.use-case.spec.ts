import { Test, TestingModule } from '@nestjs/testing';
import { RemoveRoleUseCase } from './remove-role.use-case';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { SYSTEM_ROLES } from 'src/common/constants/roles.constant';

describe('RemoveRoleUseCase', () => {
  let useCase: RemoveRoleUseCase;

  const mockRolesRepository = {
    findById: jest.fn(),
    countUsersWithRole: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveRoleUseCase, { provide: IRolesRepository, useValue: mockRolesRepository }],
    }).compile();

    useCase = module.get<RemoveRoleUseCase>(RemoveRoleUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if role not found', async () => {
    mockRolesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if role is a system role', async () => {
    mockRolesRepository.findById.mockResolvedValue({ role_id: '1', role_name: SYSTEM_ROLES[0] });

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if role is assigned to users', async () => {
    mockRolesRepository.findById.mockResolvedValue({ role_id: '1', role_name: 'CUSTOM_ROLE' });
    mockRolesRepository.countUsersWithRole.mockResolvedValue(5);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should delete successfully', async () => {
    mockRolesRepository.findById.mockResolvedValue({ role_id: '1', role_name: 'CUSTOM_ROLE' });
    mockRolesRepository.countUsersWithRole.mockResolvedValue(0);
    mockRolesRepository.delete.mockResolvedValue({ role_id: '1', role_name: 'CUSTOM_ROLE' });

    const result = await useCase.execute('1');

    expect(result).toEqual({ role_id: '1', role_name: 'CUSTOM_ROLE' });
    expect(mockRolesRepository.delete).toHaveBeenCalledWith('1');
  });
});
