import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleAuthRefresh } from "./utils/proxy/handle-auth-refresh";
import { rewriteLocalizedStaticPage } from "./utils/proxy/localized-rewrite";

export async function proxy(request: NextRequest) {
  const response = await handleAuthRefresh(request);

  const cleanPathname = request.nextUrl.pathname.replace(/\/$/, "");

  const localizedResponse = rewriteLocalizedStaticPage(request, cleanPathname);
  if (localizedResponse) {
    if (response) {
      response.cookies.getAll().forEach((cookie) => {
        localizedResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
    }
    return localizedResponse;
  }

  return response || NextResponse.next();
}

export const config = {
  // không chạy cho /api
  // Không chạy cho toàn bộ /_next
  // Không chạy cho bất kỳ path có extension, ví dụ .ico, .svg, .xml, .webmanifest, .js, .css
  // Vẫn chạy cho page routes bình thường: /, /profile, /products, /help, /terms
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
