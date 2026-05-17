import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLanguageSubdomain } from "./utils/sub-domain/extract-sub-domain";

const SSG_LOCALIZED_PAGES = [
  "/terms",
  "/privacy",
  "/help",
  "/help/faq",
  "/help/shipping",
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  // Loại bỏ trailing slash để tránh lỗi double-slash (ví dụ /privacy//vi)
  const cleanPathname = url.pathname.replace(/\/$/, "");

  if (SSG_LOCALIZED_PAGES.includes(cleanPathname)) {
    const host = request.headers.get("host") || "";
    const lang = getLanguageSubdomain(host) || "en";

    url.pathname = `${cleanPathname}/${lang}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/terms", "/privacy", "/help", "/help/faq", "/help/shipping"],
};
