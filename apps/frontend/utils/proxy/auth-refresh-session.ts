import { handleRefreshToken } from "../request/server/refresh-token";
import { RefreshResult } from "./auth-refresh.types";

function extractRefreshResult(
  setCookies: string[],
  refreshToken: string,
): RefreshResult | null {
  let newAccessToken = "";
  let newRefreshToken = "";

  setCookies.forEach((cookieStr) => {
    if (cookieStr.startsWith("access_token=")) {
      newAccessToken = cookieStr.split(";")[0].replace("access_token=", "");
    }
    if (cookieStr.startsWith("refresh_token=")) {
      newRefreshToken = cookieStr.split(";")[0].replace("refresh_token=", "");
    }
  });

  if (!newAccessToken) {
    console.log(`[handleAuthRefresh] Failed: newAccessToken is empty`);
    return null;
  }

  return {
    newAccessToken,
    newRefreshToken: newRefreshToken || refreshToken,
  };
}

export async function refreshSession(
  refreshToken: string,
  cookieHeader: string,
): Promise<RefreshResult | null> {
  console.log(`[handleAuthRefresh] Triggering handleRefreshToken()...`);
  const res = await handleRefreshToken(cookieHeader);
  console.log(`[handleAuthRefresh] handleRefreshToken status: ${res.status}`);

  if (!res.ok) return null;

  const tokens = extractRefreshResult(res.headers.getSetCookie(), refreshToken);
  if (!tokens) return null;

  console.log(
    `[handleAuthRefresh] Success: Extracted access_token: ${tokens.newAccessToken.substring(0, 15)}...`,
  );
  if (tokens.newRefreshToken !== refreshToken) {
    console.log(
      `[handleAuthRefresh] Success: Extracted refresh_token: ${tokens.newRefreshToken.substring(0, 15)}...`,
    );
  }

  return tokens;
}
