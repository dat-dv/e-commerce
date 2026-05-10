import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageUseCase } from './upload-image.use-case';
import { IUploadRepository } from '../entities/upload.repository.interface';
import { StorageService } from '../../storage.service';

describe('UploadImageUseCase', () => {
  let useCase: UploadImageUseCase;

  const mockUploadRepository = {
    createImage: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadImageUseCase,
        { provide: IUploadRepository, useValue: mockUploadRepository },
        { provide: StorageService, useValue: mockCloudinaryService },
      ],
    }).compile();

    useCase = module.get<UploadImageUseCase>(UploadImageUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw error if image size exceeds 5MB', () => {
    const file = { size: 6 * 1024 * 1024, mimetype: 'image/jpeg' } as Express.Multer.File;
    expect(() => useCase.verifyImage(file)).toThrow('Image size exceeds 5MB');
  });

  it('should throw error if invalid image format', () => {
    const file = { size: 1 * 1024 * 1024, mimetype: 'application/pdf' } as Express.Multer.File;
    expect(() => useCase.verifyImage(file)).toThrow('Invalid image format');
  });

  it('should upload image successfully', async () => {
    const file = { size: 1 * 1024 * 1024, mimetype: 'image/jpeg' } as Express.Multer.File;
    const storageResult = { public_id: '1', secure_url: 'http://url' };
    const dbResult = { id: '1', ...storageResult };

    mockCloudinaryService.uploadImage.mockResolvedValue(storageResult);
    mockUploadRepository.createImage.mockResolvedValue(dbResult);

    const result = await useCase.execute(file);

    expect(result).toBe(dbResult);
    expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file, 'images');
    expect(mockUploadRepository.createImage).toHaveBeenCalledWith(storageResult);
  });
});
