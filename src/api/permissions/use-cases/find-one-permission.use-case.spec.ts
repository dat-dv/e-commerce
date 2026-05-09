import { Test, TestingModule } from '@nestjs/testing';
import { FindOnePermissionUseCase } from './find-one-permission.use-case';
import { IPermissionsRepository } from '../domain/permissions.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('FindOnePermissionUseCase', () => {
  let useCase: FindOnePermissionUseCase;

  const mockPermissionsRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOnePermissionUseCase, { provide: IPermissionsRepository, useValue: mockPermissionsRepository }],
    }).compile();

    useCase = module.get<FindOnePermissionUseCase>(FindOnePermissionUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if permission not found', async () => {
    mockPermissionsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);
  });

  it('should return permission if found', async () => {
    const mockPermission = { permission_id: '1', permission_name: 'TEST' };
    mockPermissionsRepository.findById.mockResolvedValue(mockPermission);

    const result = await useCase.execute('1');

    expect(result).toBe(mockPermission);
  });
});
