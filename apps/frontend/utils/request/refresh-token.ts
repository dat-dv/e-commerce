import { PUBLIC_ENV } from "@/config/public.env.config";
import { API_ROUTES } from "@/constants/routes";

export function refreshToken() {
  return fetch(
    `${PUBLIC_ENV.NEXT_PUBLIC_API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
    {
      method: "POST",
      credentials: "include", // Bắt buộc để gửi kèm cookie refresh_token
    },
  );
}
