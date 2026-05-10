import { Test, TestingModule } from '@nestjs/testing';
import { RemovePermissionUseCase } from './remove-permission.use-case';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RemovePermissionUseCase', () => {
  let useCase: RemovePermissionUseCase;

  const mockPermissionsRepository = {
    findById: jest.fn(),
    countRolesWithPermission: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RemovePermissionUseCase, { provide: IPermissionsRepository, useValue: mockPermissionsRepository }],
    }).compile();

    useCase = module.get<RemovePermissionUseCase>(RemovePermissionUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if permission not found', async () => {
    mockPermissionsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if permission is assigned to roles', async () => {
    mockPermissionsRepository.findById.mockResolvedValue({ permission_id: '1', permission_name: 'TEST' });
    mockPermissionsRepository.countRolesWithPermission.mockResolvedValue(1);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should delete successfully if not assigned to roles', async () => {
    mockPermissionsRepository.findById.mockResolvedValue({ permission_id: '1', permission_name: 'TEST' });
    mockPermissionsRepository.countRolesWithPermission.mockResolvedValue(0);
    mockPermissionsRepository.delete.mockResolvedValue({ permission_id: '1', permission_name: 'TEST' });

    const result = await useCase.execute('1');

    expect(result).toEqual({ permission_id: '1', permission_name: 'TEST' });
    expect(mockPermissionsRepository.delete).toHaveBeenCalledWith('1');
  });
});
