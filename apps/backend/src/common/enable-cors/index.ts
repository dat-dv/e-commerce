import { INestApplication } from '@nestjs/common';

export const getBaseDomain = (urlStr: string): string | null => {
  try {
    const { hostname } = new URL(urlStr.startsWith('http') ? urlStr : `http://${urlStr}`);

    const parts = hostname.split('.');

    return parts.length >= 2 ? parts.slice(-2).join('.') : null;
  } catch {
    return null;
  }
};

export const enableCors = (app: INestApplication): void => {
  const isProd = process.env.NODE_ENV === 'production';

  const baseDomain = getBaseDomain(process.env.FE_URL ?? '');

  if (isProd && !baseDomain) {
    throw new Error('[CORS] NODE_ENV=production but FE_URL is invalid or missing.');
  }

  app.enableCors({
    origin: !isProd
      ? true
      : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
          try {
            const isServerCall = !origin;

            if (isServerCall) {
              return callback(null, true);
            }

            const hostname = new URL(origin).hostname;

            const browserAllowed = hostname === baseDomain || hostname.endsWith(`.${baseDomain}`);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            browserAllowed ? callback(null, true) : callback(new Error(`[CORS] Blocked: ${origin}`));
          } catch {
            callback(new Error(`[CORS] Blocked: ${origin}`));
          }
        },

    credentials: true,

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'timezone'],

    exposedHeaders: ['set-cookie'],
  });
};
