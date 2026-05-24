import { ENotificationType } from '@ecommerce/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/shared/services/firebase/firebase.service';
import { INotificationsRepository } from './domain/entities/notifications.repository.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(INotificationsRepository)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async sendToUser(
    userId: string,
    title: string,
    body: string,
    type: ENotificationType = ENotificationType.SYSTEM,
    data?: Record<string, string>,
  ) {
    await this.notificationsRepository.createNotification(userId, {
      title,
      content: body,
      type: type,
      link: data?.link,
      metadata: data,
    });

    const tokens = await this.notificationsRepository.getUserTokens(userId);

    this.logger.log(`Found ${tokens.length} tokens for user ${userId}: ${JSON.stringify(tokens)}`);

    if (tokens.length === 0) {
      this.logger.log(`No notification tokens found for user ${userId}`);
      return;
    }

    const messaging = this.firebaseService.getMessaging();
    if (!messaging) {
      this.logger.error('Cannot send notification: Firebase Messaging not initialized.');
      return;
    }

    const message = {
      notification: { title, body },
      data: {
        ...data,
        type: type.toString(),
      },
      tokens: tokens,
    };

    try {
      const response = await messaging.sendEachForMulticast(message);
      this.logger.log(`Successfully sent ${response.successCount} notifications to user ${userId}`);

      if (response.failureCount > 0) {
        for (let idx = 0; idx < response.responses.length; idx++) {
          const resp = response.responses[idx];
          if (!resp.success) {
            const errorCode = resp.error?.code;
            this.logger.warn(
              `Firebase token send failed for user ${userId}, tokenIndex=${idx}, code=${errorCode}, message=${resp.error?.message}`,
            );
            if (
              errorCode === 'messaging/registration-token-not-registered' ||
              errorCode === 'messaging/invalid-registration-token'
            ) {
              await this.notificationsRepository.removeToken(tokens[idx]);
              this.logger.log(`Removed invalid token: ${tokens[idx]}`);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Error sending notification to user ${userId}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
