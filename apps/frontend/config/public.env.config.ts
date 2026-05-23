import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_IS_DEBUG: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  // Firebase Config
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: z.string().optional(),
  // NODE_ENV luôn có sẵn ở client
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = publicEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_IS_DEBUG: process.env.NEXT_PUBLIC_IS_DEBUG,

  // firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
});

if (!parsed.success) {
  console.error("❌ Invalid CLIENT env:", parsed.error.flatten());
  throw new Error("Invalid client environment variables");
}

export const PUBLIC_ENV = Object.assign(parsed.data, {
  IS_PROD: parsed.data.NODE_ENV === "production",
  IS_DEV: parsed.data.NODE_ENV === "development",
  IS_DEBUG: parsed.data.NEXT_PUBLIC_IS_DEBUG,
});
