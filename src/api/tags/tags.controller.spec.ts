import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { CreateTagUseCase } from './domain/use-cases/create-tag.use-case';
import { FindAllTagsUseCase } from './domain/use-cases/find-all-tags.use-case';
import { FindOneTagUseCase } from './domain/use-cases/find-one-tag.use-case';
import { UpdateTagUseCase } from './domain/use-cases/update-tag.use-case';
import { RemoveTagUseCase } from './domain/use-cases/remove-tag.use-case';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';

describe('TagsController', () => {
  let controller: TagsController;

  const mockCreateTagUseCase = { execute: jest.fn() };
  const mockFindAllTagsUseCase = { execute: jest.fn() };
  const mockFindOneTagUseCase = { execute: jest.fn() };
  const mockUpdateTagUseCase = { execute: jest.fn() };
  const mockRemoveTagUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        { provide: CreateTagUseCase, useValue: mockCreateTagUseCase },
        { provide: FindAllTagsUseCase, useValue: mockFindAllTagsUseCase },
        { provide: FindOneTagUseCase, useValue: mockFindOneTagUseCase },
        { provide: UpdateTagUseCase, useValue: mockUpdateTagUseCase },
        { provide: RemoveTagUseCase, useValue: mockRemoveTagUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TagsController>(TagsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateTagUseCase.execute and return success response', async () => {
      const dto = { name: 'Test' } as unknown as CreateTagDto;
      const serviceResult = { id: 'tag-1', name: 'Test' };

      mockCreateTagUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.create(dto);

      expect(mockCreateTagUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findAll', () => {
    it('should call FindAllTagsUseCase.execute and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockFindAllTagsUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockFindAllTagsUseCase.execute).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call FindOneTagUseCase.execute and return success response', async () => {
      const serviceResult = { id: 'tag-1', name: 'Test' };

      mockFindOneTagUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findOne('tag-1');

      expect(mockFindOneTagUseCase.execute).toHaveBeenCalledWith('tag-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call UpdateTagUseCase.execute and return success response', async () => {
      const dto = { name: 'Updated' } as unknown as UpdateTagDto;
      const serviceResult = { id: 'tag-1', name: 'Updated' };

      mockUpdateTagUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.update('tag-1', dto);

      expect(mockUpdateTagUseCase.execute).toHaveBeenCalledWith('tag-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call RemoveTagUseCase.execute and return success response', async () => {
      const serviceResult = { id: 'tag-1', name: 'Test' };

      mockRemoveTagUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.remove('tag-1');

      expect(mockRemoveTagUseCase.execute).toHaveBeenCalledWith('tag-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
