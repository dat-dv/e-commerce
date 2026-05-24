interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const payloadBase64 = token.split(".")[1];
  if (!payloadBase64) return null;

  const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const decodedJson = atob(paddedBase64);
  const decoded = JSON.parse(decodedJson);

  if (!decoded || typeof decoded !== "object") return null;

  return decoded as JwtPayload;
}

export function getTokenMaxAge(token: string): number | undefined {
  try {
    const decoded = decodeJwtPayload(token);
    if (!decoded?.exp) return undefined;

    return Math.max(0, Math.floor(decoded.exp - Date.now() / 1000));
  } catch {
    return undefined;
  }
}

export function isTokenExpiringSoon(token: string) {
  if (!token) {
    console.log(`[isTokenExpiringSoon] No token provided`);
    return true;
  }
  try {
    const decoded = decodeJwtPayload(token);
    if (!decoded?.exp) return true;

    const exp = decoded.exp * 1000;
    const now = Date.now();
    const diff = exp - now;

    console.log(
      `[isTokenExpiringSoon] Exp: ${new Date(exp).toLocaleTimeString()}, Now: ${new Date(now).toLocaleTimeString()}, Diff: ${diff}ms`,
    );

    // Token is expired or will expire within the next 2 minutes.
    return diff < 2 * 60 * 1000;
  } catch (e) {
    console.log(`[isTokenExpiringSoon] Parse error:`, e);
    return true;
  }
}
