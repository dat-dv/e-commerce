import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostUseCase } from './create-post.use-case';
import { IPostsRepository } from '../domain/posts.repository.interface';
import { UploadImageUseCase } from '../../upload/use-cases/upload-image.use-case';
import { BadRequestException } from '@nestjs/common';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;

  const mockPostsRepository = {
    countTags: jest.fn(),
    create: jest.fn(),
  };

  const mockUploadImageUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        { provide: IPostsRepository, useValue: mockPostsRepository },
        { provide: UploadImageUseCase, useValue: mockUploadImageUseCase },
      ],
    }).compile();

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if tags do not exist', async () => {
    mockPostsRepository.countTags.mockResolvedValue(1); // Only 1 found, but 2 requested!

    await expect(useCase.execute('user1', { title: 'Title', tag_ids: ['tag1', 'tag2'], content: {} })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should create post successfully without file', async () => {
    mockPostsRepository.countTags.mockResolvedValue(2);
    mockPostsRepository.create.mockResolvedValue({ id: '1', title: 'Title' });

    const result = await useCase.execute('user1', { title: 'Title', tag_ids: ['tag1', 'tag2'], content: {} });

    expect(result).toEqual({ id: '1', title: 'Title' });
    expect(mockPostsRepository.create).toHaveBeenCalled();
  });

  it('should create post successfully with file', async () => {
    mockPostsRepository.countTags.mockResolvedValue(0);
    mockUploadImageUseCase.execute.mockResolvedValue({ id: 'img1' });
    mockPostsRepository.create.mockResolvedValue({ id: '1', title: 'Title' });

    const file = { buffer: Buffer.from('abc') } as Express.Multer.File;
    const result = await useCase.execute('user1', { title: 'Title', content: {} }, file);

    expect(result).toEqual({ id: '1', title: 'Title' });
    expect(mockUploadImageUseCase.execute).toHaveBeenCalledWith(file);
    expect(mockPostsRepository.create).toHaveBeenCalled();
  });
});
