import { Module, Global } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { INotificationsRepository } from './domain/entities/notifications.repository.interface';
import { NotificationsRepository } from './domain/infrastructure/notifications.repository';
import { FirebaseService } from 'src/shared/services/firebase/firebase.service';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    FirebaseService,
    {
      provide: INotificationsRepository,
      useClass: NotificationsRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
