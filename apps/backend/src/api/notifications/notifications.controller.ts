import type { RequestWithUser } from 'src/shared/types/request.type';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { INotificationsRepository } from './domain/entities/notifications.repository.interface';
import { SaveTokenDto } from './dto/save-token.dto';
import { Inject } from '@nestjs/common';
import { IApiResponse, INotificationTokenResponse } from '@ecommerce/shared';
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
}
