import type { RequestWithUser } from 'src/shared/types/request.type';
import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { INotificationsRepository } from './domain/entities/notifications.repository.interface';
import { SaveTokenDto } from './dto/save-token.dto';
import { Inject } from '@nestjs/common';
import { IApiResponse, INotificationTokenResponse, INotificationResponse } from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(
    @Inject(INotificationsRepository)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  @Post('tokens')
  async saveToken(
    @Req() req: RequestWithUser,
    @Body() dto: SaveTokenDto,
  ): Promise<IApiResponse<INotificationTokenResponse>> {
    const userId = req.user.sub;
    const result = await this.notificationsRepository.saveToken(userId, dto);
    return createSuccessResponse(result);
  }

  @Get()
  async getNotifications(@Req() req: RequestWithUser): Promise<IApiResponse<INotificationResponse[]>> {
    const userId = req.user.sub;
    const result = await this.notificationsRepository.getNotifications(userId);
    return createSuccessResponse(result);
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: RequestWithUser, @Param('id') id: string): Promise<IApiResponse<INotificationResponse>> {
    const userId = req.user.sub;
    const result = await this.notificationsRepository.markAsRead(userId, id);
    return createSuccessResponse(result);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: RequestWithUser): Promise<IApiResponse<void>> {
    const userId = req.user.sub;
    await this.notificationsRepository.markAllAsRead(userId);
    return createSuccessResponse(undefined);
  }
}
