import { INestApplication } from '@nestjs/common';

const LOCALHOST_PORTS = ['3000', '5173'];

const LOCALHOST_REGEX = new RegExp(`^http:\\/\\/([a-z0-9-]+\\.)?localhost:(${LOCALHOST_PORTS.join('|')})$`, 'i');

const LOCAL_IP_REGEX = /^http:\/\/192\.168\.\d+\.\d+:(3000|5173)$/;

export const enableCors = (app: INestApplication) => {
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // mobile app / postman / server-side request
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean);
      const isAllowed = LOCALHOST_REGEX.test(origin) || LOCAL_IP_REGEX.test(origin) || allowedOrigins.includes(origin);

      callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
    },

    credentials: true,

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'timezone'],

    exposedHeaders: ['set-cookie'],
  });
};
