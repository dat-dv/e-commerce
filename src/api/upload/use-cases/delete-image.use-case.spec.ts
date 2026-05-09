import { Test, TestingModule } from '@nestjs/testing';
import { DeleteImageUseCase } from './delete-image.use-case';
import { CloudinaryService } from '../cloudinary.service';

describe('DeleteImageUseCase', () => {
  let useCase: DeleteImageUseCase;

  const mockCloudinaryService = {
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteImageUseCase, { provide: CloudinaryService, useValue: mockCloudinaryService }],
    }).compile();

    useCase = module.get<DeleteImageUseCase>(DeleteImageUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call deleteImage on storage service', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue(true);

    const result = await useCase.execute('public-id');

    expect(result).toBe(true);
    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith('public-id');
  });
});
