import { INestApplication } from '@nestjs/common';

export const enableCors = (app: INestApplication) => {
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const isAllowed =
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:3000' ||
        /^http:\/\/.*\.localhost:5173$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'timezone'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
};
