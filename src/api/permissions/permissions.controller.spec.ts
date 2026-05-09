import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { GetPermissionsDto } from './dto/get-permissions.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  const mockPermissionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [{ provide: PermissionsService, useValue: mockPermissionsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockPermissionsService.findAll.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockPermissionsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return success response', async () => {
      const serviceResult = { permission_id: 'perm-1', permission_name: 'CUSTOM_PERMISSION' };

      mockPermissionsService.findOne.mockResolvedValue(serviceResult);

      const result = await controller.findOne('perm-1');

      expect(mockPermissionsService.findOne).toHaveBeenCalledWith('perm-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call service.update and return success response', async () => {
      const dto = { permission_name: 'UPDATED_PERMISSION' } as unknown as UpdatePermissionDto;
      const serviceResult = { permission_id: 'perm-1', permission_name: 'UPDATED_PERMISSION' };

      mockPermissionsService.update.mockResolvedValue(serviceResult);

      const result = await controller.update('perm-1', dto);

      expect(mockPermissionsService.update).toHaveBeenCalledWith('perm-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success response', async () => {
      const serviceResult = { permission_id: 'perm-1', permission_name: 'CUSTOM_PERMISSION' };

      mockPermissionsService.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove('perm-1');

      expect(mockPermissionsService.remove).toHaveBeenCalledWith('perm-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
