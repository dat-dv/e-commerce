import { Test, TestingModule } from '@nestjs/testing';
import { RemoveTagUseCase } from './remove-tag.use-case';
import { ITagsRepository } from '../domain/tags.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('RemoveTagUseCase', () => {
  let useCase: RemoveTagUseCase;

  const mockTagsRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveTagUseCase, { provide: ITagsRepository, useValue: mockTagsRepository }],
    }).compile();

    useCase = module.get<RemoveTagUseCase>(RemoveTagUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if tag not found', async () => {
    mockTagsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should delete successfully', async () => {
    mockTagsRepository.findById.mockResolvedValue({ id: '1', name: 'Tech' });
    mockTagsRepository.delete.mockResolvedValue({ id: '1', name: 'Tech', deleted_at: new Date() });

    const result = await useCase.execute('1');

    expect(result).toEqual(expect.objectContaining({ id: '1', name: 'Tech' }));
    expect(mockTagsRepository.delete).toHaveBeenCalledWith('1');
  });
});
