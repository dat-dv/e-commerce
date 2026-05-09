import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { BadRequestException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  const mockPrisma = {
    permission: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      count: jest.fn(),
    },
  };

  const mockPagination = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a permission', async () => {
      const dto = { permission_name: 'CUSTOM_PERMISSION' };
      mockPrisma.permission.findUnique.mockResolvedValue(null);
      mockPrisma.permission.create.mockResolvedValue({ permission_id: 'perm-1', ...dto });

      const result = await service.create(dto);

      expect(mockPrisma.permission.create).toHaveBeenCalled();
      expect(result).toHaveProperty('permission_id', 'perm-1');
    });

    it('should throw BadRequestException if permission name exists', async () => {
      const dto = { permission_name: 'CUSTOM_PERMISSION' };
      mockPrisma.permission.findUnique.mockResolvedValue({ permission_id: 'perm-1', ...dto });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if permission is assigned to roles', async () => {
      mockPrisma.role.count.mockResolvedValue(1); // Assigned to 1 role

      await expect(service.remove('perm-1')).rejects.toThrow(BadRequestException);
    });

    it('should delete permission if not assigned', async () => {
      const permission = { permission_id: 'perm-1', permission_name: 'CUSTOM_PERMISSION' };
      mockPrisma.role.count.mockResolvedValue(0);
      mockPrisma.permission.delete.mockResolvedValue(permission);

      const result = await service.remove('perm-1');

      expect(mockPrisma.permission.delete).toHaveBeenCalled();
      expect(result).toEqual(permission);
    });
  });
});
