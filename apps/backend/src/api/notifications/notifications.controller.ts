import {
  IApiResponse,
  INotificationListResponse,
  INotificationResponse,
  INotificationTokenResponse,
  INotificationUnreadCountResponse,
} from '@ecommerce/shared';
import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { INotificationsRepository } from './domain/entities/notifications.repository.interface';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { SaveTokenDto } from './dto/save-token.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(
    @Inject(INotificationsRepository)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  @Post('tokens')
  async saveToken(@Req() req: Request, @Body() dto: SaveTokenDto): Promise<IApiResponse<INotificationTokenResponse>> {
    const userId = req.user?.sub;
    const result = await this.notificationsRepository.saveToken(userId, dto);
    return createSuccessResponse(result);
  }

  @Get()
  async getNotifications(
    @Req() req: Request,
    @Query() query: GetNotificationsDto,
  ): Promise<IApiResponse<INotificationListResponse>> {
    const userId = req.user?.sub;
    const result = await this.notificationsRepository.getNotifications(userId, query);
    return createSuccessResponse(result);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request): Promise<IApiResponse<INotificationUnreadCountResponse>> {
    const userId = req.user?.sub;
    const count = await this.notificationsRepository.countUnread(userId);
    return createSuccessResponse({ count });
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string): Promise<IApiResponse<INotificationResponse>> {
    const userId = req.user?.sub;
    const result = await this.notificationsRepository.markAsRead(userId, id);
    return createSuccessResponse(result);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: Request): Promise<IApiResponse<void>> {
    const userId = req.user?.sub;
    await this.notificationsRepository.markAllAsRead(userId);
    return createSuccessResponse(undefined);
  }
}
