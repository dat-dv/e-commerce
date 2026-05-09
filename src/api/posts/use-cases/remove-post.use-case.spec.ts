import { Test, TestingModule } from '@nestjs/testing';
import { RemovePostUseCase } from './remove-post.use-case';
import { IPostsRepository } from '../domain/posts.repository.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('RemovePostUseCase', () => {
  let useCase: RemovePostUseCase;

  const mockPostsRepository = {
    findById: jest.fn(),
    getUserPermissions: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RemovePostUseCase, { provide: IPostsRepository, useValue: mockPostsRepository }],
    }).compile();

    useCase = module.get<RemovePostUseCase>(RemovePostUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if post not found', async () => {
    mockPostsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'user1')).rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user lacks permission (not owner)', async () => {
    const mockPost = { user_id: 'user2' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue([]);

    await expect(useCase.execute('1', 'user1')).rejects.toThrow(ForbiddenException);
  });

  it('should delete successfully as owner', async () => {
    const mockPost = { user_id: 'user1' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue(['DELETE:OWN_POST']);
    mockPostsRepository.delete.mockResolvedValue({ id: '1', deleted_at: new Date() });

    const result = await useCase.execute('1', 'user1');

    expect(result).toEqual(expect.objectContaining({ id: '1' }));
    expect(mockPostsRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should delete successfully as non-owner with any permission', async () => {
    const mockPost = { user_id: 'user2' };
    mockPostsRepository.findById.mockResolvedValue(mockPost);
    mockPostsRepository.getUserPermissions.mockResolvedValue(['DELETE:ANY_POST']);
    mockPostsRepository.delete.mockResolvedValue({ id: '1', deleted_at: new Date() });

    const result = await useCase.execute('1', 'user1');

    expect(result).toEqual(expect.objectContaining({ id: '1' }));
    expect(mockPostsRepository.delete).toHaveBeenCalledWith('1');
  });
});
