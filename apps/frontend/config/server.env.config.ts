import { z } from "zod";

export const serverEnvSchema = z.object({
  API_URL: z.string(),
});

const isServer = typeof window === "undefined";

let parsedData: Partial<z.infer<typeof serverEnvSchema>> = {};

if (isServer) {
  const parsed = serverEnvSchema.safeParse({
    API_URL: process.env.API_URL,
  });

  if (!parsed.success) {
    console.error("❌ Invalid SERVER env:", parsed.error.flatten());
    throw new Error("Invalid server environment variables");
  }
  parsedData = parsed.data;
}

export const SERVER_ENV = parsedData as z.infer<typeof serverEnvSchema>;
