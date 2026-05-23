import { NextResponse, type NextRequest } from "next/server";
import { getSubdomainByHostname } from "../sub-domain/get-client-sub-domain";

const SSG_LOCALIZED_PAGES = [
  "/terms",
  "/privacy",
  "/help",
  "/help/faq",
  "/help/shipping",
  "/help/contact",
];

export const rewriteLocalizedStaticPage = (
  request: NextRequest,
  cleanPathname: string,
) => {
  if (!SSG_LOCALIZED_PAGES.includes(cleanPathname)) return undefined;

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const lang = getSubdomainByHostname(host);

  url.pathname = `/${lang}${cleanPathname}`;
  return NextResponse.rewrite(url);
};
