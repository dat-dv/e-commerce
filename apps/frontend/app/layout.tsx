import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { themeScript } from "@/utils/theme-script";
import AppProvider from "@/components/molecules/providers/app-provider";
import { getTranslations } from "next-intl/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col bg-surface text-content selection:bg-primary/30">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
