export const AUTH_REFRESH_TOKEN_EXPIRES_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const isProduction = process.env.NODE_ENV === 'production';

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const, // Changed to lax to allow cookie transmission on cross-subdomain transitions
};
