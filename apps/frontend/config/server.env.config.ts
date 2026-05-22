import { z } from "zod";

export const serverEnvSchema = z.object({
  API_URL: z.string(),
});

const parsed = serverEnvSchema.safeParse({
  API_URL: process.env.API_URL,
});

if (!parsed.success) {
  console.error("❌ Invalid SERVER env:", parsed.error.flatten());
  throw new Error("Invalid server environment variables");
}

export const SERVER_ENV = parsed.data;
