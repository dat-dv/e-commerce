import { SERVER_ENV } from "@/config/server.env.config";
import { API_ROUTES } from "@/constants/routes";
import { getServerCookies } from "../../cookies";

export async function refreshToken() {
  const options: RequestInit = {
    method: "POST",
    headers: {},
    credentials: "include",
  };
  const cookieStore = await getServerCookies();
  const cookieHeader = cookieStore?.toString();
  const headers: HeadersInit = {};

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  return fetch(`${SERVER_ENV.API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`, {
    ...options,
    headers,
  });
}
