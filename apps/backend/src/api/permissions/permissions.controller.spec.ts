import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { FindAllPermissionsUseCase } from './domain/use-cases/find-all-permissions.use-case';
import { FindOnePermissionUseCase } from './domain/use-cases/find-one-permission.use-case';
import { UpdatePermissionUseCase } from './domain/use-cases/update-permission.use-case';
import { RemovePermissionUseCase } from './domain/use-cases/remove-permission.use-case';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { GetPermissionsDto } from './dto/get-permissions.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

describe('PermissionsController', () => {
  let controller: PermissionsController;

  const mockFindAllPermissionsUseCase = { execute: jest.fn() };
  const mockFindOnePermissionUseCase = { execute: jest.fn() };
  const mockUpdatePermissionUseCase = { execute: jest.fn() };
  const mockRemovePermissionUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        { provide: FindAllPermissionsUseCase, useValue: mockFindAllPermissionsUseCase },
        { provide: FindOnePermissionUseCase, useValue: mockFindOnePermissionUseCase },
        { provide: UpdatePermissionUseCase, useValue: mockUpdatePermissionUseCase },
        { provide: RemovePermissionUseCase, useValue: mockRemovePermissionUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call FindAllPermissionsUseCase.execute and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockFindAllPermissionsUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockFindAllPermissionsUseCase.execute).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call FindOnePermissionUseCase.execute and return success response', async () => {
      const serviceResult = { permission_id: 'perm-1', permission_name: 'CUSTOM_PERMISSION' };

      mockFindOnePermissionUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findOne('perm-1');

      expect(mockFindOnePermissionUseCase.execute).toHaveBeenCalledWith('perm-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call UpdatePermissionUseCase.execute and return success response', async () => {
      const dto = { permission_name: 'UPDATED_PERMISSION' } as unknown as UpdatePermissionDto;
      const serviceResult = { permission_id: 'perm-1', permission_name: 'UPDATED_PERMISSION' };

      mockUpdatePermissionUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.update('perm-1', dto);

      expect(mockUpdatePermissionUseCase.execute).toHaveBeenCalledWith('perm-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call RemovePermissionUseCase.execute and return success response', async () => {
      const serviceResult = { permission_id: 'perm-1', permission_name: 'CUSTOM_PERMISSION' };

      mockRemovePermissionUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.remove('perm-1');

      expect(mockRemovePermissionUseCase.execute).toHaveBeenCalledWith('perm-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
