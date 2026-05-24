import { NextRequest, NextResponse } from "next/server";
import { RefreshResult } from "./auth-refresh.types";
import { buildCookieHeader, getCookieDomain } from "./auth-cookie";
import { getTokenMaxAge } from "./jwt";

export function createRefreshResponse(
  request: NextRequest,
  tokens: RefreshResult,
) {
  const requestHeaders = new Headers(request.headers);
  const currentCookieHeader = request.headers.get("cookie") || "";
  const cookieDomain = getCookieDomain();

  requestHeaders.set("Authorization", `Bearer ${tokens.newAccessToken}`);
  requestHeaders.set("Cookie", buildCookieHeader(currentCookieHeader, tokens));

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.cookies.set("access_token", tokens.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    domain: cookieDomain,
    maxAge: getTokenMaxAge(tokens.newAccessToken),
  });

  response.cookies.set("refresh_token", tokens.newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    domain: cookieDomain,
    maxAge: getTokenMaxAge(tokens.newRefreshToken),
  });

  return response;
}
