import { NextRequest, NextResponse } from "next/server";
import { handleRefreshToken } from "../request/server/refresh-token";

export async function handleAuthRefresh(
  request: NextRequest,
): Promise<NextResponse | null> {
  const accessToken = request.cookies.get("accessToken")?.value || "";
  const refreshToken = request.cookies.get("refreshToken")?.value || "";

  const isExpireAccess = isTokenExpiringSoon(accessToken) || true;

  if (isExpireAccess) {
    try {
      const res = await handleRefreshToken();

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
        if (!newAccessToken) return null;

        // 2. Cập nhật header cho Next.js Request (Để Server Components đọc được ngay)
        request.headers.set("Authorization", `Bearer ${newAccessToken}`);
        request.headers.set(
          "Cookie",
          `accessToken=${newAccessToken}; refreshToken=${newRefreshToken || refreshToken}`,
        );

        const response = NextResponse.next({
          request: { headers: request.headers },
        });

        // 3. Set cookie mới trả về cho Trình duyệt (Dùng lại tên camelCase của Frontend)
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true trên production
          path: "/",
          sameSite: "lax",
          // Bạn có thể set maxAge tĩnh hoặc bóc tách từ chuỗi cookieStr ở trên
        });

        if (newRefreshToken) {
          response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
          });
        }

        return response;
      }
    } catch {
      // Im lặng bỏ qua để App tự văng 401
    }
  }

  return null;
}

function isTokenExpiringSoon(token: string) {
  if (!token) return true;
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedJson = Buffer.from(payloadBase64, "base64").toString();
    const decoded = JSON.parse(decodedJson);

    const exp = decoded.exp * 1000;
    const now = Date.now();

    // Nếu token hết hạn hoặc sẽ hết hạn trong vòng 2 phút tới
    return exp - now < 2 * 60 * 1000;
  } catch (e) {
    return true;
  }
}
