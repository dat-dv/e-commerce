import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Logger,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageUseCase } from './domain/use-cases/upload-image.use-case';
import { DeleteImageUseCase } from './domain/use-cases/delete-image.use-case';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UPLOAD_MAX_SIZE, UPLOAD_ALLOWED_TYPES } from 'src/common/constants/upload.constant';
import { IApiResponse, IImageResponse } from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(AuthGuard) // Yêu cầu đăng nhập mới được upload
export class UploadController {
  private readonly logger = new Logger(UploadController.name);
  constructor(
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload',
        },
      },
      required: ['image'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (invalid file type or size)' })
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<IApiResponse<IImageResponse>> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    if (!UPLOAD_ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    if (file.size > UPLOAD_MAX_SIZE) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    try {
      const uploadResult = await this.uploadImageUseCase.execute(file);
      return createSuccessResponse(uploadResult);
    } catch (error) {
      this.logger.error('File upload failed', error);
      throw new BadRequestException(
        `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Delete('image/:publicId')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (invalid file type or size)' })
  async deleteImage(@Param('publicId') publicId: string): Promise<IApiResponse<boolean>> {
    if (!publicId) {
      throw new BadRequestException('No publicId provided');
    }

    try {
      const deleteResult = await this.deleteImageUseCase.execute(publicId);
      return createSuccessResponse(deleteResult);
    } catch (error) {
      this.logger.error('File delete failed', error);
      throw new BadRequestException(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
