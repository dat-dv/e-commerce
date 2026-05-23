import { NextRequest, NextResponse } from "next/server";
import { handleRefreshToken } from "../request/server/refresh-token";

interface RefreshCache {
  oldRefreshToken: string;
  newAccessToken: string;
  newRefreshToken: string;
  timestamp: number;
}

let lastRefreshCache: RefreshCache | null = null;

export async function handleAuthRefresh(
  request: NextRequest,
): Promise<NextResponse | null> {
  const accessToken = request.cookies.get("access_token")?.value || "";
  const refreshToken = request.cookies.get("refresh_token")?.value || "";

  console.log(`[handleAuthRefresh] Path: ${request.nextUrl.pathname}`);
  console.log(
    `[handleAuthRefresh] Access Token: ${accessToken ? "exists" : "empty"}, Refresh Token: ${refreshToken ? "exists" : "empty"}`,
  );

  const isExpireAccess = isTokenExpiringSoon(accessToken);
  console.log(`[handleAuthRefresh] isExpireAccess: ${isExpireAccess}`);

  if (isExpireAccess) {
    // Nếu có một tiến trình refresh vừa chạy xong cho token này trong vòng 5 giây trước, tái sử dụng kết quả
    if (
      refreshToken &&
      lastRefreshCache &&
      lastRefreshCache.oldRefreshToken === refreshToken &&
      Date.now() - lastRefreshCache.timestamp < 5000
    ) {
      console.log(
        `[handleAuthRefresh] Concurrent refresh detected. Reusing cached session.`,
      );
      const cached = lastRefreshCache;

      request.headers.set("Authorization", `Bearer ${cached.newAccessToken}`);
      request.headers.set(
        "Cookie",
        `access_token=${cached.newAccessToken}; refresh_token=${cached.newRefreshToken}`,
      );

      const response = NextResponse.next({
        request: { headers: request.headers },
      });

      response.cookies.set("access_token", cached.newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      response.cookies.set("refresh_token", cached.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      return response;
    }

    try {
      console.log(`[handleAuthRefresh] Triggering handleRefreshToken()...`);
      const res = await handleRefreshToken();
      console.log(
        `[handleAuthRefresh] handleRefreshToken status: ${res.status}`,
      );

      if (res.ok) {
        // 1. Trích xuất cookie từ Header của NestJS
        const setCookies = res.headers.getSetCookie(); // Trả về mảng ['access_token=...', 'refresh_token=...']
        console.log(666, setCookies);
        let newAccessToken = "";
        let newRefreshToken = "";

        setCookies.forEach((cookieStr) => {
          if (cookieStr.startsWith("access_token=")) {
            newAccessToken = cookieStr
              .split(";")[0]
              .replace("access_token=", "");
          }
          if (cookieStr.startsWith("refresh_token=")) {
            newRefreshToken = cookieStr
              .split(";")[0]
              .replace("refresh_token=", "");
          }
        });

        // Nếu NestJS không trả về token mới trong cookie, coi như fail
        if (!newAccessToken) {
          console.log(`[handleAuthRefresh] Failed: newAccessToken is empty`);
          return null;
        }

        const finalRefreshToken = newRefreshToken || refreshToken;

        // Cập nhật cache
        if (refreshToken) {
          lastRefreshCache = {
            oldRefreshToken: refreshToken,
            newAccessToken,
            newRefreshToken: finalRefreshToken,
            timestamp: Date.now(),
          };
        }

        console.log(
          `[handleAuthRefresh] Success: Extracted access_token: ${newAccessToken.substring(0, 15)}...`,
        );
        if (newRefreshToken) {
          console.log(
            `[handleAuthRefresh] Success: Extracted refresh_token: ${newRefreshToken.substring(0, 15)}...`,
          );
        }

        // 2. Cập nhật header cho Next.js Request (Để Server Components đọc được ngay)
        request.headers.set("Authorization", `Bearer ${newAccessToken}`);
        request.headers.set(
          "Cookie",
          `access_token=${newAccessToken}; refresh_token=${finalRefreshToken}`,
        );

        const response = NextResponse.next({
          request: { headers: request.headers },
        });

        // 3. Set cookie mới trả về cho Trình duyệt (Dùng lại tên snake_case của Backend)
        response.cookies.set("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true trên production
          path: "/",
          sameSite: "lax",
          // Bạn có thể set maxAge tĩnh hoặc bóc tách từ chuỗi cookieStr ở trên
        });

        if (finalRefreshToken) {
          response.cookies.set("refresh_token", finalRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
          });
        }

        return response;
      }
    } catch (e) {
      console.log(`[handleAuthRefresh] Error refreshing:`, e);
    }
  }

  return null;
}

function isTokenExpiringSoon(token: string) {
  if (!token) {
    console.log(`[isTokenExpiringSoon] No token provided`);
    return true;
  }
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedJson = Buffer.from(payloadBase64, "base64").toString();
    const decoded = JSON.parse(decodedJson);

    const exp = decoded.exp * 1000;
    const now = Date.now();
    const diff = exp - now;

    console.log(
      `[isTokenExpiringSoon] Exp: ${new Date(exp).toLocaleTimeString()}, Now: ${new Date(now).toLocaleTimeString()}, Diff: ${diff}ms`,
    );

    // Nếu token hết hạn hoặc sẽ hết hạn trong vòng 2 phút tới
    return diff < 2 * 60 * 1000;
  } catch (e) {
    console.log(`[isTokenExpiringSoon] Parse error:`, e);
    return true;
  }
}
