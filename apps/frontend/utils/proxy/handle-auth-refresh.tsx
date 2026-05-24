import { NextRequest, NextResponse } from "next/server";
import { createRefreshResponse } from "./auth-refresh-response";
import { RefreshCache, RefreshResult } from "./auth-refresh.types";
import { refreshSession } from "./auth-refresh-session";
import { getCookieDomain } from "./auth-cookie";
import { isTokenExpiringSoon } from "./jwt";

let lastRefreshCache: RefreshCache | null = null;
let refreshInFlight: {
  oldRefreshToken: string;
  promise: Promise<RefreshResult | null>;
} | null = null;

export async function handleAuthRefresh(
  request: NextRequest,
): Promise<NextResponse | null> {
  const accessToken = request.cookies.get("access_token")?.value || "";
  const refreshToken = request.cookies.get("refresh_token")?.value || "";
  const host = request.headers.get("host") || "";
  const cookieDomain = getCookieDomain();

  console.log(
    `[handleAuthRefresh] Path: ${request.nextUrl.pathname}, Host: ${host}, CookieDomain: ${cookieDomain}`,
  );
  console.log(
    `[handleAuthRefresh] Access Token: ${accessToken ? "exists" : "empty"}, Refresh Token: ${refreshToken ? "exists" : "empty"}`,
  );

  const isExpireAccess = isTokenExpiringSoon(accessToken);
  console.log(`[handleAuthRefresh] isExpireAccess: ${isExpireAccess}`);

  if (isExpireAccess) {
    if (!refreshToken) {
      console.log(`[handleAuthRefresh] Failed: refreshToken is empty`);
      return null;
    }

    // Nếu có một tiến trình refresh vừa chạy xong cho token này trong vòng 5 giây trước, tái sử dụng kết quả
    if (
      lastRefreshCache &&
      lastRefreshCache.oldRefreshToken === refreshToken &&
      Date.now() - lastRefreshCache.timestamp < 5000
    ) {
      console.log(
        `[handleAuthRefresh] Concurrent refresh detected. Reusing cached session.`,
      );
      const cached = lastRefreshCache;
      return createRefreshResponse(request, cached);
    }

    try {
      const cookieHeader = request.headers.get("cookie") || "";
      if (
        !refreshInFlight ||
        refreshInFlight.oldRefreshToken !== refreshToken
      ) {
        const promise = refreshSession(refreshToken, cookieHeader).finally(
          () => {
            refreshInFlight = null;
          },
        );

        refreshInFlight = {
          oldRefreshToken: refreshToken,
          promise,
        };
      } else {
        console.log(
          `[handleAuthRefresh] Concurrent refresh detected. Waiting for in-flight session.`,
        );
      }

      const tokens = await refreshInFlight.promise;
      if (tokens) {
        lastRefreshCache = {
          oldRefreshToken: refreshToken,
          ...tokens,
          timestamp: Date.now(),
        };

        return createRefreshResponse(request, tokens);
      }
    } catch (e) {
      console.log(`[handleAuthRefresh] Error refreshing:`, e);
    }
  }

  return null;
}
