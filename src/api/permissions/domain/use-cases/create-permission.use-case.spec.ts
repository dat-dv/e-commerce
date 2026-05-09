import { Test, TestingModule } from '@nestjs/testing';
import { CreatePermissionUseCase } from './create-permission.use-case';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('CreatePermissionUseCase', () => {
  let useCase: CreatePermissionUseCase;

  const mockPermissionsRepository = {
    findByName: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePermissionUseCase, { provide: IPermissionsRepository, useValue: mockPermissionsRepository }],
    }).compile();

    useCase = module.get<CreatePermissionUseCase>(CreatePermissionUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if permission name exists', async () => {
    mockPermissionsRepository.findByName.mockResolvedValue({ permission_id: '1', permission_name: 'TEST' });

    await expect(useCase.execute({ permission_name: 'TEST' })).rejects.toThrow(BadRequestException);
  });

  it('should create permission successfully', async () => {
    const mockPermission = { permission_id: '1', permission_name: 'TEST' };
    mockPermissionsRepository.findByName.mockResolvedValue(null);
    mockPermissionsRepository.create.mockResolvedValue(mockPermission);

    const result = await useCase.execute({ permission_name: 'TEST' });

    expect(result).toBe(mockPermission);
    expect(mockPermissionsRepository.create).toHaveBeenCalledWith({ permission_name: 'TEST' });
  });
});
