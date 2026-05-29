import { AxiosInstance } from "axios";

export async function handleRefreshToken(
  instance: AxiosInstance,
): Promise<void> {
  await instance.post("/auth/refresh-token");
}
