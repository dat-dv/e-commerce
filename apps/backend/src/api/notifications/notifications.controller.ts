import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { INotificationsRepository } from './domain/entities/notifications.repository.interface';
import { SaveTokenDto } from './dto/save-token.dto';
import { Inject } from '@nestjs/common';
import createSuccessResponse from 'src/common/respomse';
import type { Request } from 'express';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(
    @Inject(INotificationsRepository)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  @Post('tokens')
  async saveToken(@Req() req: Request, @Body() dto: SaveTokenDto) {
    const userId = req.user.sub;
    const result = await this.notificationsRepository.saveToken(userId, dto.token, dto.deviceType);
    return createSuccessResponse(result);
  }
}
