import Footer from "@/components/atoms/footer";
import Header from "@/components/organisms/header/header-desktop";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Common.rootMetadata");

  return {
    title: {
      template: `%s | ${t("siteName")}`,
      default: t("siteName"),
    },
    description: t("description"),
    metadataBase: PUBLIC_ENV.NEXT_PUBLIC_SITE_URL,
    openGraph: {
      type: "website",
      locale: "en_US",
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

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
