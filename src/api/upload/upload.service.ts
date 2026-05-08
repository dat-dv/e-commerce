import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class UploadService implements OnModuleInit {
  private bucket: Bucket | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const storageBucket = this.configService.get<string>('FIREBASE_STORAGE_BUCKET');

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
      this.bucket = admin.storage().bucket();
    } else {
      console.warn('Firebase credentials not found. Upload service might not work.');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.bucket) {
      throw new Error('Firebase Storage is not initialized');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
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
        // Make the file public
        fileUpload
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${this.bucket!.name}/${fileName}`;
            resolve(publicUrl);
          })
          .catch((error) => {
            reject(error instanceof Error ? error : new Error(String(error)));
          });
      });

      stream.end(file.buffer);
    });
  }
}
