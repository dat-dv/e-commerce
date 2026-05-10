import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePostUseCase } from './update-post.use-case';
import { IPostsRepository } from '../entities/posts.repository.interface';
import { UploadImageUseCase } from '../../../upload/domain/use-cases/upload-image.use-case';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('UpdatePostUseCase', () => {
  let useCase: UpdatePostUseCase;

  const mockPostsRepository = {
    findById: jest.fn(),
    getUserPermissions: jest.fn(),
    update: jest.fn(),
  };

  const mockUploadImageUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePostUseCase,
        { provide: IPostsRepository, useValue: mockPostsRepository },
        { provide: UploadImageUseCase, useValue: mockUploadImageUseCase },
      ],
    }).compile();

    useCase = module.get<UpdatePostUseCase>(UpdatePostUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if post not found', async () => {
    mockPostsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'user1', { title: 'New Title' })).rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user lacks permission (not owner)', async () => {
    const mockPost = { user_id: 'user2', slug: 'slug' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue([]); // No permissions!

    await expect(useCase.execute('1', 'user1', { title: 'New Title' })).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user lacks permission (owner but no own permission)', async () => {
    const mockPost = { user_id: 'user1', slug: 'slug' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue([]); // No permissions!

    await expect(useCase.execute('1', 'user1', { title: 'New Title' })).rejects.toThrow(ForbiddenException);
  });

  it('should update successfully as owner', async () => {
    const mockPost = { user_id: 'user1', slug: 'slug' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue(['UPDATE:OWN_POST']);
    mockPostsRepository.update.mockResolvedValue({ id: '1', title: 'New Title' });

    const result = await useCase.execute('1', 'user1', { title: 'New Title' });

    expect(result).toEqual({ id: '1', title: 'New Title' });
    expect(mockPostsRepository.update).toHaveBeenCalled();
  });

  it('should update successfully as non-owner with any permission', async () => {
    const mockPost = { user_id: 'user2', slug: 'slug' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue(['UPDATE:ANY_POST']);
    mockPostsRepository.update.mockResolvedValue({ id: '1', title: 'New Title' });

    const result = await useCase.execute('1', 'user1', { title: 'New Title' });

    expect(result).toEqual({ id: '1', title: 'New Title' });
    expect(mockPostsRepository.update).toHaveBeenCalled();
  });
});
