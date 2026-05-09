import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { title: 'Test' } as unknown as CreatePostDto;
      const file = {} as Express.Multer.File;
      const serviceResult = { id: 'post-1' };

      mockPostsService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(req, dto, file);

      expect(mockPostsService.create).toHaveBeenCalledWith('user-1', dto, file);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockPostsService.findAll.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockPostsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return success response', async () => {
      const serviceResult = { id: 'post-1' };

      mockPostsService.findOne.mockResolvedValue(serviceResult);

      const result = await controller.findOne('post-1');

      expect(mockPostsService.findOne).toHaveBeenCalledWith('post-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('update', () => {
    it('should call service.update and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { title: 'Updated' } as unknown as UpdatePostDto;
      const file = {} as Express.Multer.File;
      const serviceResult = { id: 'post-1' };

      mockPostsService.update.mockResolvedValue(serviceResult);

      const result = await controller.update(req, 'post-1', dto, file);

      expect(mockPostsService.update).toHaveBeenCalledWith('post-1', 'user-1', dto, file);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const serviceResult = { id: 'post-1' };

      mockPostsService.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove(req, 'post-1');

      expect(mockPostsService.remove).toHaveBeenCalledWith('post-1', 'user-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult, message: null }));
    });
  });
});
