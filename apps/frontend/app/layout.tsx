import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import AppToast from "@/components/atoms/toast";
import { AuthProvider } from "@/components/molecules/providers/auth-provider";
import { ConfigProvider } from "@/components/molecules/providers/config-provider";
import { CategoriesProvider } from "@/components/molecules/providers/categories-provider";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { themeScript } from "@/utils/theme-script";
import { allSafe } from "@/utils/promise";
import { getLanguageSubdomain } from "@/utils/sub-domain/extract-sub-domain";
import { AddressProvider } from "@/components/molecules/providers/address-provider";
import { CartProvider } from "@/components/molecules/providers/cart-provider";
import { FavoritesProvider } from "@/components/molecules/providers/favorites-provider";
import { CartDrawer } from "@/components/organisms/cart-drawer";
import { addressesUseCase } from "@/domain/addresses";
import { cartUseCase } from "@/domain/cart/use-cases";
import { NotificationProvider } from "@/components/providers/notification-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | E-Commerce Platform",
    default: "E-Commerce Platform",
  },
  description: "E-commerce platform with real-time focus.",
  metadataBase: PUBLIC_ENV.NEXT_PUBLIC_SITE_URL,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "E-Commerce Platform",
    title: "E-Commerce Platform",
    description:
      "The minimalist, high-performance e-commerce platform for power users.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Task Manager Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Platform",
    description:
      "The minimalist, high-performance e-commerce platform for power users.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categoriesRes, language, initialCartState, initialAddressesState] =
    await allSafe([
      categoriesUseCase.getTree.execute(),
      getLanguageSubdomain(),
      cartUseCase.getCart.execute(),
      addressesUseCase.getAddresses.execute(),
    ]);

  const categories =
    categoriesRes?.status === "success" ? categoriesRes.data : [];

  return (
    <html
      lang="en"
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
        <ConfigProvider initState={{ language: language || "en" }}>
          <CategoriesProvider initState={{ categories }}>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider initState={initialCartState?.data?.items || []}>
                  <AddressProvider
                    initState={initialAddressesState?.data || []}
                  >
                    <FavoritesProvider>
                      {children}
                      <CartDrawer />
                    </FavoritesProvider>
                  </AddressProvider>
                </CartProvider>
              </NotificationProvider>
            </AuthProvider>
          </CategoriesProvider>
          <AppToast />
        </ConfigProvider>
      </body>
    </html>
  );
}
