import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Bucket } from '@google-cloud/storage';
import { StorageService } from './storage.service';
import type { Image } from 'generated/prisma/client';

@Injectable()
export class FirebaseService extends StorageService implements OnModuleInit {
  private bucket: Bucket | null = null;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/^["']|["']$/g, '') // Remove surrounding quotes
      ?.replace(/\\n/g, '\n');
    const storageBucket = this.configService.get<string>('FIREBASE_STORAGE_BUCKET');

    if (projectId && clientEmail && privateKey) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          storageBucket,
        });
        this.bucket = admin.storage().bucket();
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin SDK', error);
      }
    } else {
      this.logger.warn('Firebase credentials not found or invalid. Upload service might not work.');
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    location: string,
  ): Promise<Omit<Image, 'id' | 'created_at' | 'updated_at'>> {
    if (!this.bucket) {
      throw new Error('Firebase Storage is not initialized');
    }

    const fileName = `${location}/${Date.now()}-${file.originalname}`;
    const fileUpload = this.bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error instanceof Error ? error : new Error(String(error)));
      });

      stream.on('finish', () => {
        fileUpload
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${this.bucket!.name}/${fileName}`;
            resolve({
              url: publicUrl,
              publicId: fileName,
              format: file.mimetype.split('/')[1],
              bytes: file.size,
              width: null,
              height: null,
            });
          })
          .catch((error) => {
            reject(error instanceof Error ? error : new Error(String(error)));
          });
      });

      stream.end(file.buffer);
    });
  }
}
