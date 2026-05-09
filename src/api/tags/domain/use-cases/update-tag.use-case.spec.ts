import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTagUseCase } from './update-tag.use-case';
import { ITagsRepository } from '../entities/tags.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('UpdateTagUseCase', () => {
  let useCase: UpdateTagUseCase;

  const mockTagsRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateTagUseCase, { provide: ITagsRepository, useValue: mockTagsRepository }],
    }).compile();

    useCase = module.get<UpdateTagUseCase>(UpdateTagUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if tag not found', async () => {
    mockTagsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', { tag_name: 'New Name' })).rejects.toThrow(BadRequestException);
  });

  it('should update successfully', async () => {
    mockTagsRepository.findById.mockResolvedValue({ id: '1', tag_name: 'Old Name' });
    mockTagsRepository.update.mockResolvedValue({ id: '1', tag_name: 'New Name' });

    const result = await useCase.execute('1', { tag_name: 'New Name' });

    expect(result).toEqual({ id: '1', tag_name: 'New Name' });
    expect(mockTagsRepository.update).toHaveBeenCalledWith('1', { tag_name: 'New Name' });
  });
});
