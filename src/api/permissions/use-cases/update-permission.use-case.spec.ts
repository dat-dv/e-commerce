import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePermissionUseCase } from './update-permission.use-case';
import { IPermissionsRepository } from '../domain/permissions.repository.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UpdatePermissionUseCase', () => {
  let useCase: UpdatePermissionUseCase;

  const mockPermissionsRepository = {
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatePermissionUseCase, { provide: IPermissionsRepository, useValue: mockPermissionsRepository }],
    }).compile();

    useCase = module.get<UpdatePermissionUseCase>(UpdatePermissionUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if permission not found', async () => {
    mockPermissionsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', { permission_name: 'NEW' })).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if new name already exists', async () => {
    mockPermissionsRepository.findById.mockResolvedValue({ permission_id: '1', permission_name: 'OLD' });
    mockPermissionsRepository.findByName.mockResolvedValue({ permission_id: '2', permission_name: 'NEW' });

    await expect(useCase.execute('1', { permission_name: 'NEW' })).rejects.toThrow(BadRequestException);
  });

  it('should update successfully if name is same or unique', async () => {
    mockPermissionsRepository.findById.mockResolvedValue({ permission_id: '1', permission_name: 'OLD' });
    mockPermissionsRepository.findByName.mockResolvedValue(null);
    mockPermissionsRepository.update.mockResolvedValue({ permission_id: '1', permission_name: 'NEW' });

    const result = await useCase.execute('1', { permission_name: 'NEW' });

    expect(result).toEqual({ permission_id: '1', permission_name: 'NEW' });
    expect(mockPermissionsRepository.update).toHaveBeenCalledWith('1', { permission_name: 'NEW' });
  });
});
