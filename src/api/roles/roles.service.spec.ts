import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { BadRequestException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: PrismaService;

  const mockPrisma = {
    role: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
  };

  const mockPagination = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const dto = { role_name: 'CUSTOM_ROLE' };
      mockPrisma.role.findUnique.mockResolvedValue(null);
      mockPrisma.role.create.mockResolvedValue({ role_id: 'role-1', ...dto });

      const result = await service.create(dto);

      expect(mockPrisma.role.create).toHaveBeenCalled();
      expect(result).toHaveProperty('role_id', 'role-1');
    });

    it('should throw BadRequestException if role name exists', async () => {
      const dto = { role_name: 'CUSTOM_ROLE' };
      mockPrisma.role.findUnique.mockResolvedValue({ role_id: 'role-1', ...dto });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.remove('role-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if role is assigned to users', async () => {
      const role = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };
      mockPrisma.role.findUnique.mockResolvedValue(role);
      mockPrisma.user.count.mockResolvedValue(5); // 5 users have this role

      await expect(service.remove('role-1')).rejects.toThrow(BadRequestException);
    });

    it('should delete role if not assigned and not system role', async () => {
      const role = { role_id: 'role-1', role_name: 'CUSTOM_ROLE' };
      mockPrisma.role.findUnique.mockResolvedValue(role);
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.role.delete.mockResolvedValue(role);

      const result = await service.remove('role-1');

      expect(mockPrisma.role.delete).toHaveBeenCalled();
      expect(result).toEqual(role);
    });
  });
});
