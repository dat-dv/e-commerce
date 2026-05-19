"use server";

export const getServerCookies = async () => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore;
  } catch {
    return undefined;
  }
};
