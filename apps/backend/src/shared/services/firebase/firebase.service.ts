import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Messaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  private normalizePrivateKey(privateKey: string): string {
    return privateKey
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n');
  }

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase config missing (Project ID, Client Email, or Private Key). Firebase Admin will not be initialized.',
      );
      return;
    }

    try {
      if (admin.apps.length > 0) {
        this.firebaseApp = admin.app();
        this.logger.log('Reusing existing Firebase Admin app.');
      } else {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: this.normalizePrivateKey(privateKey),
          }),
        });
        this.logger.log('Firebase Admin initialized successfully.');
      }
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
