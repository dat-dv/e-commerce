import { Test, TestingModule } from '@nestjs/testing';
import { FindOneTagUseCase } from './find-one-tag.use-case';
import { ITagsRepository } from '../entities/tags.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('FindOneTagUseCase', () => {
  let useCase: FindOneTagUseCase;

  const mockTagsRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneTagUseCase, { provide: ITagsRepository, useValue: mockTagsRepository }],
    }).compile();

    useCase = module.get<FindOneTagUseCase>(FindOneTagUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if tag not found', async () => {
    mockTagsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should return tag if found', async () => {
    const mockTag = { id: '1', name: 'Tech' };
    mockTagsRepository.findById.mockResolvedValue(mockTag);

    const result = await useCase.execute('1');

    expect(result).toBe(mockTag);
  });
});
