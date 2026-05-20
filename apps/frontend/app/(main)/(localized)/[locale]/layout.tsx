import { PUBLIC_ENV } from "@/config/public.env.config";
import { getTranslations } from "next-intl/server";

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common.rootMetadata" });

  return {
    title: {
      template: `%s | ${t("siteName")}`,
      default: t("siteName"),
    },
    description: t("description"),
    metadataBase: PUBLIC_ENV.NEXT_PUBLIC_SITE_URL,
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      url: "/",
      siteName: t("siteName"),
      title: t("siteName"),
      description: t("openGraphDesc"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("openGraphAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("openGraphDesc"),
      images: ["/og-image.png"],
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
      apple: "/icon.svg",
    },
  };
}

export default async function LocalizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
