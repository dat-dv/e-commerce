import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Messaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

    if (!serviceAccountPath) {
      this.logger.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found. Firebase Admin will not be initialized.');
      return;
    }

    try {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin initialized successfully.');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error instanceof Error ? error.message : String(error));
    }
  }

  getMessaging(): Messaging | null {
    if (!this.firebaseApp) {
      this.logger.error('Firebase Admin not initialized. Cannot get Messaging service.');
      return null;
    }
    return this.firebaseApp.messaging();
  }
}
