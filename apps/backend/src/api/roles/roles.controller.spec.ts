import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { CreateRoleUseCase } from './domain/use-cases/create-role.use-case';
import { FindAllRolesUseCase } from './domain/use-cases/find-all-roles.use-case';
import { FindOneRoleUseCase } from './domain/use-cases/find-one-role.use-case';
import { UpdateRoleUseCase } from './domain/use-cases/update-role.use-case';
import { RemoveRoleUseCase } from './domain/use-cases/remove-role.use-case';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRolesDto } from './dto/get-roles.dto';

describe('RolesController', () => {
  let controller: RolesController;

  const mockCreateRoleUseCase = { execute: jest.fn() };
  const mockFindAllRolesUseCase = { execute: jest.fn() };
  const mockFindOneRoleUseCase = { execute: jest.fn() };
  const mockUpdateRoleUseCase = { execute: jest.fn() };
  const mockRemoveRoleUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: CreateRoleUseCase, useValue: mockCreateRoleUseCase },
        { provide: FindAllRolesUseCase, useValue: mockFindAllRolesUseCase },
        { provide: FindOneRoleUseCase, useValue: mockFindOneRoleUseCase },
        { provide: UpdateRoleUseCase, useValue: mockUpdateRoleUseCase },
        { provide: RemoveRoleUseCase, useValue: mockRemoveRoleUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RolesController>(RolesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateRoleUseCase.execute and return success response', async () => {
      const dto = { role_name: 'CUSTOM_ROLE' } as unknown as CreateRoleDto;
      const serviceResult = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };

      mockCreateRoleUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.create(dto);

      expect(mockCreateRoleUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findAll', () => {
    it('should call FindAllRolesUseCase.execute and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockFindAllRolesUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockFindAllRolesUseCase.execute).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call FindOneRoleUseCase.execute and return success response', async () => {
      const serviceResult = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };

      mockFindOneRoleUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findOne('role-1');

      expect(mockFindOneRoleUseCase.execute).toHaveBeenCalledWith('role-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call UpdateRoleUseCase.execute and return success response', async () => {
      const dto = { role_name: 'UPDATED_ROLE' } as unknown as UpdateRoleDto;
      const serviceResult = { role_id: 'role-1', role_name: 'UPDATED_ROLE' };

      mockUpdateRoleUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.update('role-1', dto);

      expect(mockUpdateRoleUseCase.execute).toHaveBeenCalledWith('role-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call RemoveRoleUseCase.execute and return success response', async () => {
      const serviceResult = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };

      mockRemoveRoleUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.remove('role-1');

      expect(mockRemoveRoleUseCase.execute).toHaveBeenCalledWith('role-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
