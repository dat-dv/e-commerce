import { MetadataRoute } from "next";

import { PUBLIC_ENV } from "@/config/public.env.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = PUBLIC_ENV.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
