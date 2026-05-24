import { SERVER_ENV } from "@/config/server.env.config";
import { API_ROUTES } from "@/constants/routes";
import { getServerCookies } from "../../cookies";

export async function handleRefreshToken(cookieHeader?: string) {
  const options: RequestInit = {
    method: "POST",
    headers: {},
    credentials: "include",
  };
  const headers: HeadersInit = {};

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  } else {
    const cookieStore = await getServerCookies();
    const serverCookieHeader = cookieStore?.toString();

    if (serverCookieHeader) {
      headers.Cookie = serverCookieHeader;
    }
  }

  return fetch(`${SERVER_ENV.API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`, {
    ...options,
    headers,
  });
}
