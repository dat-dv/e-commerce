import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PaginationService } from '../../shared/services/pagination/pagination.service';
import { BadRequestException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;

  const mockPrisma = {
    tag: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPagination = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const dto = { tag_name: 'Test Tag' };
      const expectedResult = { id: 'tag-1', name: 'Test Tag' };
      mockPrisma.tag.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(mockPrisma.tag.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call paginate', async () => {
      const expectedResult = { items: [], total: 0 };
      mockPagination.paginate.mockResolvedValue(expectedResult);

      const result = await service.findAll(1, 10);

      expect(mockPagination.paginate).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find one tag', async () => {
      const expectedResult = { id: 'tag-1', name: 'Test Tag' };
      mockPrisma.tag.findUniqueOrThrow.mockResolvedValue(expectedResult);

      const result = await service.findOne('tag-1');

      expect(mockPrisma.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'tag-1', deleted_at: null },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const dto = { tag_name: 'Updated Tag' };
      const expectedResult = { id: 'tag-1', name: 'Updated Tag' };
      mockPrisma.tag.update.mockResolvedValue(expectedResult);

      const result = await service.update('tag-1', dto);

      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: { id: 'tag-1', deleted_at: null },
        data: dto,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should soft delete a tag', async () => {
      const mockDate = new Date('2026-05-09T00:00:00Z');
      jest.useFakeTimers().setSystemTime(mockDate);

      const expectedResult = { id: 'tag-1', name: 'Test Tag', deleted_at: mockDate };
      mockPrisma.tag.update.mockResolvedValue(expectedResult);

      const result = await service.remove('tag-1');

      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: { id: 'tag-1', deleted_at: null },
        data: { deleted_at: mockDate },
      });
      expect(result).toEqual(expectedResult);

      jest.useRealTimers();
    });
  });
});
