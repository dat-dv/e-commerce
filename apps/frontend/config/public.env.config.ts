import { z } from 'zod';

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_IS_DEBUG: z
    .string()
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
  // NODE_ENV luôn có sẵn ở client
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_IS_DEBUG: process.env.NEXT_PUBLIC_IS_DEBUG,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error('❌ Invalid CLIENT env:', parsed.error.flatten());
  throw new Error('Invalid client environment variables');
}

export const PUBLIC_ENV = Object.assign(parsed.data, {
  IS_PROD: parsed.data.NODE_ENV === 'production',
  IS_DEV: parsed.data.NODE_ENV === 'development',
  IS_DEBUG: parsed.data.NEXT_PUBLIC_IS_DEBUG,
});
