/** @description Environment variable accessor with build-time safety */
export const ENV = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
  NODE_ENV: process.env.NODE_ENV,
};
