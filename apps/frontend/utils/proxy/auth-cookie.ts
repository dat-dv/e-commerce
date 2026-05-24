import { RefreshResult } from "./auth-refresh.types";

export function getCookieDomain(): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;

  const hostname = new URL(siteUrl).hostname;
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return undefined;
  }

  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join(".")}`;
  }
  return undefined;
}

export function buildCookieHeader(
  currentCookieHeader: string,
  tokens: RefreshResult,
): string {
  const cookies = new Map<string, string>();

  currentCookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .forEach((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      if (separatorIndex === -1) return;

      cookies.set(
        cookie.slice(0, separatorIndex),
        cookie.slice(separatorIndex + 1),
      );
    });

  cookies.set("access_token", tokens.newAccessToken);
  cookies.set("refresh_token", tokens.newRefreshToken);

  return Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}
