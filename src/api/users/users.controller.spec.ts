import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return success response', async () => {
      const dto = { email: 'test@example.com' } as unknown as CreateUserDto;
      const serviceResult = { user_id: 'user-1' };

      mockUsersService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockUsersService.findAll.mockResolvedValue(serviceResult);

      const result = await controller.findAll(query);

      expect(mockUsersService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const serviceResult = { user_id: 'user-2' };

      mockUsersService.findOne.mockResolvedValue(serviceResult);

      const result = await controller.findOne(req, 'user-2');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-2', 'user-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call service.update and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { first_name: 'Updated' } as unknown as UpdateUserDto;
      const serviceResult = { user_id: 'user-2' };

      mockUsersService.update.mockResolvedValue(serviceResult);

      const result = await controller.update(req, 'user-2', dto);

      expect(mockUsersService.update).toHaveBeenCalledWith('user-2', 'user-1', dto);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('uploadAvatar', () => {
    it('should call service.updateAvatar and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const file = { buffer: Buffer.from('test'), originalname: 'test.jpg' } as Express.Multer.File;
      const serviceResult = { user_id: 'user-2', avatar_id: 'img-1' };

      mockUsersService.updateAvatar.mockResolvedValue(serviceResult);

      const result = await controller.uploadAvatar(req, 'user-2', file);

      expect(mockUsersService.updateAvatar).toHaveBeenCalledWith('user-2', 'user-1', file);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success response', async () => {
      const serviceResult = { user_id: 'user-2' };

      mockUsersService.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove('user-2');

      expect(mockUsersService.remove).toHaveBeenCalledWith('user-2');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
