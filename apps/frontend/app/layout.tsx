import "./globals.css";

import AppProvider from "@/components/molecules/providers/app-provider";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { themeScript } from "@/utils/theme-script";
import { Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Common.rootMetadata");
  const headersList = await headers();
  const host = headersList.get("host") || "vi.chotdon.shop";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title.default"),
      template: t("title.template"),
    },
    description: t("description"),
    openGraph: {
      title: t("title.default"),
      description: t("description"),
      url: "/",
      siteName: t("siteName"),
      locale: t("locale"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title.default"),
      description: t("description"),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} bg-surface h-full antialiased`}
    >
      <head>
        {PUBLIC_ENV.IS_DEBUG && (
          <Script
            src="//unpkg.com/react-scan/dist/auto.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>
      <body className="bg-surface text-content selection:bg-primary/30 flex min-h-full flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
