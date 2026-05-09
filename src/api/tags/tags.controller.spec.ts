import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const mockTagsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return success response', async () => {
      const dto = { name: 'Test' } as unknown as CreateTagDto;
      const serviceResult = { id: 'tag-1', name: 'Test' };

      mockTagsService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(dto);

      expect(mockTagsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockTagsService.findAll.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockTagsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return success response', async () => {
      const serviceResult = { id: 'tag-1', name: 'Test' };

      mockTagsService.findOne.mockResolvedValue(serviceResult);

      const result = await controller.findOne('tag-1');

      expect(mockTagsService.findOne).toHaveBeenCalledWith('tag-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call service.update and return success response', async () => {
      const dto = { name: 'Updated' } as unknown as UpdateTagDto;
      const serviceResult = { id: 'tag-1', name: 'Updated' };

      mockTagsService.update.mockResolvedValue(serviceResult);

      const result = await controller.update('tag-1', dto);

      expect(mockTagsService.update).toHaveBeenCalledWith('tag-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success response', async () => {
      const serviceResult = { id: 'tag-1', name: 'Test' };

      mockTagsService.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove('tag-1');

      expect(mockTagsService.remove).toHaveBeenCalledWith('tag-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
