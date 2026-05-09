import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAvatarUseCase } from './update-avatar.use-case';
import { IUsersRepository } from '../domain/users.repository.interface';
import { UploadService } from 'src/api/upload/upload.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { User } from '../domain/user.entity';

describe('UpdateAvatarUseCase', () => {
  let useCase: UpdateAvatarUseCase;
  let mockUsersRepository: {
    findById: jest.Mock;
    update: jest.Mock;
  };
  let mockUploadService: {
    uploadImage: jest.Mock;
    deleteImage: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockUploadService = {
      uploadImage: jest.fn(),
      deleteImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAvatarUseCase,
        { provide: IUsersRepository, useValue: mockUsersRepository },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    useCase = module.get<UpdateAvatarUseCase>(UpdateAvatarUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const file = { buffer: Buffer.from('test'), originalname: 'test.jpg' } as Express.Multer.File;

    await expect(useCase.execute('user-1', 'user-1', file)).rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user does not have permission', async () => {
    const user = new User(
      'user-1',
      'Test',
      'User',
      'test@example.com',
      null,
      'password',
      new Date(),
      new Date(),
      null,
      null,
      [],
    );
    mockUsersRepository.findById.mockResolvedValue(user);

    const file = { buffer: Buffer.from('test'), originalname: 'test.jpg' } as Express.Multer.File;

    await expect(useCase.execute('user-1', 'user-1', file)).rejects.toThrow(ForbiddenException);
  });

  it('should upload avatar and update user', async () => {
    const user = new User(
      'user-1',
      'Test',
      'User',
      'test@example.com',
      null,
      'password',
      new Date(),
      new Date(),
      null,
      null,
      ['UPDATE:OWN_USER'],
    );
    const image = { id: 'img-1', url: 'http://example.com/avatar.jpg' };

    mockUsersRepository.findById.mockResolvedValue(user);
    mockUploadService.uploadImage.mockResolvedValue(image);
    mockUsersRepository.update.mockResolvedValue({ ...user, avatar_id: 'img-1' });

    const file = { buffer: Buffer.from('test'), originalname: 'test.jpg' } as Express.Multer.File;

    const result = await useCase.execute('user-1', 'user-1', file);

    expect(mockUploadService.uploadImage).toHaveBeenCalledWith(file);
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-1', { avatar_id: 'img-1' });
    expect(result.avatar_id).toBe('img-1');
  });

  it('should delete old avatar if exists', async () => {
    const user = new User(
      'user-1',
      'Test',
      'User',
      'test@example.com',
      'old-img-1',
      'password',
      new Date(),
      new Date(),
      null,
      { id: 'old-img-1', publicId: 'old-public-id', url: '...' },
      ['UPDATE:OWN_USER'],
    );
    const image = { id: 'new-img-1', url: 'http://example.com/new-avatar.jpg' };

    mockUsersRepository.findById.mockResolvedValue(user);
    mockUploadService.uploadImage.mockResolvedValue(image);
    mockUploadService.deleteImage.mockResolvedValue(true);
    mockUsersRepository.update.mockResolvedValue({ ...user, avatar_id: 'new-img-1' });

    const file = { buffer: Buffer.from('test'), originalname: 'test.jpg' } as Express.Multer.File;

    await useCase.execute('user-1', 'user-1', file);

    expect(mockUploadService.deleteImage).toHaveBeenCalledWith('old-public-id');
  });
});
