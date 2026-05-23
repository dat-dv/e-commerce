import { PUBLIC_ENV } from "@/config/public.env.config";
import { API_ROUTES } from "@/constants/routes";

export async function handleRefreshToken() {
  const options: RequestInit = {
    method: "POST",
    headers: {},
    credentials: "include",
  };

  return fetch(
    `${PUBLIC_ENV.NEXT_PUBLIC_API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
    options,
  );
}
