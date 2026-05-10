import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { CreatePostUseCase } from './domain/use-cases/create-post.use-case';
import { FindAllPostsUseCase } from './domain/use-cases/find-all-posts.use-case';
import { FindOnePostUseCase } from './domain/use-cases/find-one-post.use-case';
import { UpdatePostUseCase } from './domain/use-cases/update-post.use-case';
import { RemovePostUseCase } from './domain/use-cases/remove-post.use-case';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';

describe('PostsController', () => {
  let controller: PostsController;

  const mockCreatePostUseCase = { execute: jest.fn() };
  const mockFindAllPostsUseCase = { execute: jest.fn() };
  const mockFindOnePostUseCase = { execute: jest.fn() };
  const mockUpdatePostUseCase = { execute: jest.fn() };
  const mockRemovePostUseCase = { execute: jest.fn() };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: CreatePostUseCase, useValue: mockCreatePostUseCase },
        { provide: FindAllPostsUseCase, useValue: mockFindAllPostsUseCase },
        { provide: FindOnePostUseCase, useValue: mockFindOnePostUseCase },
        { provide: UpdatePostUseCase, useValue: mockUpdatePostUseCase },
        { provide: RemovePostUseCase, useValue: mockRemovePostUseCase },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    controller = module.get<PostsController>(PostsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreatePostUseCase.execute and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { title: 'Test' } as unknown as CreatePostDto;
      const file = {} as Express.Multer.File;
      const serviceResult = { id: 'post-1' };

      mockCreatePostUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.create(req, dto, file);

      expect(mockCreatePostUseCase.execute).toHaveBeenCalledWith('user-1', dto, file);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('findAll', () => {
    it('should call FindAllPostsUseCase.execute and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockFindAllPostsUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockFindAllPostsUseCase.execute).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('findOne', () => {
    it('should call FindOnePostUseCase.execute and return success response', async () => {
      const serviceResult = { id: 'post-1' };

      mockFindOnePostUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.findOne('post-1');

      expect(mockFindOnePostUseCase.execute).toHaveBeenCalledWith('post-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('update', () => {
    it('should call UpdatePostUseCase.execute and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { title: 'Updated' } as unknown as UpdatePostDto;
      const file = {} as Express.Multer.File;
      const serviceResult = { id: 'post-1' };

      mockUpdatePostUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.update(req, 'post-1', dto, file);

      expect(mockUpdatePostUseCase.execute).toHaveBeenCalledWith('post-1', 'user-1', dto, file);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('remove', () => {
    it('should call RemovePostUseCase.execute and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const serviceResult = { id: 'post-1' };

      mockRemovePostUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.remove(req, 'post-1');

      expect(mockRemovePostUseCase.execute).toHaveBeenCalledWith('post-1', 'user-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });
});
