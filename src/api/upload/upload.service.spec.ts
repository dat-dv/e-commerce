import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { FirebaseService } from './firebase.service';
import { CloudinaryService } from './cloudinary.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

describe('UploadService', () => {
  let service: UploadService;
  let prisma: PrismaService;
  let cloudinary: CloudinaryService;

  const mockPrisma = {
    image: {
      create: jest.fn(),
    },
  };

  const mockCloudinary = {
    uploadImage: jest.fn(),
  };

  const mockFirebase = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CloudinaryService, useValue: mockCloudinary },
        { provide: FirebaseService, useValue: mockFirebase },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    prisma = module.get<PrismaService>(PrismaService);
    cloudinary = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyImage', () => {
    it('should throw error if file size exceeds 5MB', () => {
      const file = { size: 6 * 1024 * 1024, mimetype: 'image/jpeg' } as Express.Multer.File;
      expect(() => service.verifyImage(file)).toThrow('Image size exceeds 5MB');
    });

    it('should throw error if invalid image format', () => {
      const file = { size: 1 * 1024 * 1024, mimetype: 'application/pdf' } as Express.Multer.File;
      expect(() => service.verifyImage(file)).toThrow('Invalid image format');
    });

    it('should return true for valid image', () => {
      const file = { size: 1 * 1024 * 1024, mimetype: 'image/png' } as Express.Multer.File;
      expect(service.verifyImage(file)).toBe(true);
    });
  });

  describe('uploadImage', () => {
    it('should upload image and save to DB', async () => {
      const file = { size: 1 * 1024 * 1024, mimetype: 'image/png' } as Express.Multer.File;
      const mockUploadResult = { url: 'http://res.cloudinary.com/demo/image/upload/v1234/sample.jpg' };
      const mockDbResult = { id: 'image-1', ...mockUploadResult };

      mockCloudinary.uploadImage.mockResolvedValue(mockUploadResult);
      mockPrisma.image.create.mockResolvedValue(mockDbResult);

      const result = await service.uploadImage(file);

      expect(mockCloudinary.uploadImage).toHaveBeenCalledWith(file, 'images');
      expect(mockPrisma.image.create).toHaveBeenCalledWith({ data: mockUploadResult });
      expect(result).toEqual(mockDbResult);
    });
  });
});
