import { Test, TestingModule } from '@nestjs/testing';
import { CreateTagUseCase } from './create-tag.use-case';
import { ITagsRepository } from '../domain/tags.repository.interface';

describe('CreateTagUseCase', () => {
  let useCase: CreateTagUseCase;

  const mockTagsRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTagUseCase, { provide: ITagsRepository, useValue: mockTagsRepository }],
    }).compile();

    useCase = module.get<CreateTagUseCase>(CreateTagUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create tag successfully', async () => {
    const mockTag = { id: '1', name: 'Tech' };
    mockTagsRepository.create.mockResolvedValue(mockTag);

    const result = await useCase.execute({ name: 'Tech' });

    expect(result).toBe(mockTag);
    expect(mockTagsRepository.create).toHaveBeenCalledWith({ name: 'Tech' });
  });
});
