import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadImageUseCase } from './domain/use-cases/upload-image.use-case';
import { DeleteImageUseCase } from './domain/use-cases/delete-image.use-case';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';

describe('UploadController', () => {
  let controller: UploadController;

  const mockUploadImageUseCase = { execute: jest.fn() };
  const mockDeleteImageUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        { provide: UploadImageUseCase, useValue: mockUploadImageUseCase },
        { provide: DeleteImageUseCase, useValue: mockDeleteImageUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should call UploadImageUseCase and return result', async () => {
      const file = { size: 1, mimetype: 'image/jpeg' } as Express.Multer.File;
      const expectedResult = { id: '1', url: 'http://url' };
      mockUploadImageUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.uploadImage(file);

      expect(result).toBe(expectedResult);
      expect(mockUploadImageUseCase.execute).toHaveBeenCalledWith(file);
    });
  });

  describe('deleteImage', () => {
    it('should call DeleteImageUseCase and return result', async () => {
      mockDeleteImageUseCase.execute.mockResolvedValue(true);

      const result = await controller.deleteImage('public-id');

      expect(result).toBe(true);
      expect(mockDeleteImageUseCase.execute).toHaveBeenCalledWith('public-id');
    });
  });
});
