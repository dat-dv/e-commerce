import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { UploadService } from 'src/api/upload/upload.service';
import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    image: {
      delete: jest.fn(),
    },
  };

  const mockPagination = {
    paginate: jest.fn(),
  };

  const mockUploadService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
      confirm_password: 'password',
      first_name: 'John',
      last_name: 'Doe',
    };

    it('should throw UnauthorizedException if passwords do not match', async () => {
      const invalidDto = { ...dto, confirm_password: 'wrong' };
      await expect(service.create(invalidDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should create a user if email is new', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // No existing user
      mockPrisma.user.create.mockResolvedValue({ user_id: 'user-1', ...dto });

      const result = await service.create(dto);

      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user_id', 'user-1');
    });

    it('should throw ConflictException if user exists and not deleted', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ email: dto.email, deleted_at: null });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if user exists and is soft deleted', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ email: dto.email, deleted_at: new Date() });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateUserDto = { first_name: 'Updated' };

    it('should throw ForbiddenException if user has no permission', async () => {
      const targetUser = { user_id: 'user-2' };
      const requestingUser = { user_id: 'user-1', role: { permissions: [] } };

      mockPrisma.user.findUnique.mockResolvedValue(requestingUser);

      await expect(service.update('user-2', 'user-1', updateUserDto)).rejects.toThrow(ForbiddenException);
    });

    it('should update if user is owner and has permission', async () => {
      const user = { user_id: 'user-1', role: { permissions: [{ permission_name: 'UPDATE:OWN_USER' }] } };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.user.update.mockResolvedValue({ user_id: 'user-1', ...updateUserDto });

      const result = await service.update('user-1', 'user-1', updateUserDto);

      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result.first_name).toBe('Updated');
    });
  });

  describe('updateAvatar', () => {
    const file = { buffer: Buffer.from('test'), originalname: 'test.jpg' } as Express.Multer.File;

    it('should throw BadRequestException if user not found', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ user_id: 'user-1', role: { permissions: [{ permission_name: 'UPDATE:OWN_USER' }] } })
        .mockResolvedValueOnce(null);

      await expect(service.updateAvatar('user-1', 'user-1', file)).rejects.toThrow(BadRequestException);
    });

    it('should upload avatar and update user', async () => {
      const user = { user_id: 'user-1', role: { permissions: [{ permission_name: 'UPDATE:OWN_USER' }] } };
      const image = { id: 'img-1', url: 'http://example.com/avatar.jpg' };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockUploadService.uploadImage.mockResolvedValue(image);
      mockPrisma.user.update.mockResolvedValue({ user_id: 'user-1', avatar_id: 'img-1' });

      const result = await service.updateAvatar('user-1', 'user-1', file);

      expect(mockUploadService.uploadImage).toHaveBeenCalledWith(file);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 'user-1' },
          data: { avatar_id: 'img-1' },
        }),
      );
      expect(result.avatar_id).toBe('img-1');
    });

    it('should delete old avatar if exists', async () => {
      const user = {
        user_id: 'user-1',
        avatar_id: 'old-img-1',
        avatar: { id: 'old-img-1', publicId: 'old-public-id' },
        role: { permissions: [{ permission_name: 'UPDATE:OWN_USER' }] },
      };
      const image = { id: 'new-img-1', url: 'http://example.com/new-avatar.jpg' };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockUploadService.uploadImage.mockResolvedValue(image);
      mockUploadService.deleteImage.mockResolvedValue(true);
      mockPrisma.image.delete.mockResolvedValue({ id: 'old-img-1' });
      mockPrisma.user.update.mockResolvedValue({ user_id: 'user-1', avatar_id: 'new-img-1' });

      await service.updateAvatar('user-1', 'user-1', file);

      expect(mockUploadService.deleteImage).toHaveBeenCalledWith('old-public-id');
    });
  });
});
