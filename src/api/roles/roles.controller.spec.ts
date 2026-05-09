import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRolesDto } from './dto/get-roles.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockRolesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockRolesService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return success response', async () => {
      const dto = { role_name: 'CUSTOM_ROLE' } as unknown as CreateRoleDto;
      const serviceResult = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };

      mockRolesService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(dto);

      expect(mockRolesService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockRolesService.findAll.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockRolesService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return success response', async () => {
      const serviceResult = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };

      mockRolesService.findOne.mockResolvedValue(serviceResult);

      const result = await controller.findOne('role-1');

      expect(mockRolesService.findOne).toHaveBeenCalledWith('role-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call service.update and return success response', async () => {
      const dto = { role_name: 'UPDATED_ROLE' } as unknown as UpdateRoleDto;
      const serviceResult = { role_id: 'role-1', role_name: 'UPDATED_ROLE' };

      mockRolesService.update.mockResolvedValue(serviceResult);

      const result = await controller.update('role-1', dto);

      expect(mockRolesService.update).toHaveBeenCalledWith('role-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success response', async () => {
      const serviceResult = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };

      mockRolesService.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove('role-1');

      expect(mockRolesService.remove).toHaveBeenCalledWith('role-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
