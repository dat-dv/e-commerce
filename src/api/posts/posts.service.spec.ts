import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { UploadService } from '../upload/upload.service';
import { BadRequestException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;
  let pagination: PaginationService;
  let upload: UploadService;

  const mockPrisma = {
    post: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockPagination = {
    paginate: jest.fn(),
  };

  const mockUpload = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
        { provide: UploadService, useValue: mockUpload },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
    pagination = module.get<PaginationService>(PaginationService);
    upload = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-1';
    const createPostDto = {
      title: 'Test Post',
      content: { text: 'Hello' },
      tag_ids: ['tag-1'],
    };

    it('should throw BadRequestException if tags do not exist', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([]); // No tags found

      await expect(service.create(userId, createPostDto)).rejects.toThrow(BadRequestException);
    });

    it('should create a post without file', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([{ id: 'tag-1' }]);
      mockPrisma.post.create.mockResolvedValue({ id: 'post-1', title: 'Test Post' });

      const result = await service.create(userId, createPostDto);

      expect(result).toBeDefined();
      expect(mockPrisma.post.create).toHaveBeenCalled();
    });

    it('should create a post with file', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      mockPrisma.tag.findMany.mockResolvedValue([{ id: 'tag-1' }]);
      mockUpload.uploadImage.mockResolvedValue({ id: 'image-1' });
      mockPrisma.post.create.mockResolvedValue({ id: 'post-1', title: 'Test Post', thumbnail_id: 'image-1' });

      const result = await service.create(userId, createPostDto, file);

      expect(result).toBeDefined();
      expect(mockUpload.uploadImage).toHaveBeenCalledWith(file);
      expect(mockPrisma.post.create).toHaveBeenCalled();
    });
  });
});
