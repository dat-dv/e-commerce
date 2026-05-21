import "./globals.css";

import AppProvider from "@/components/molecules/providers/app-provider";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { themeScript } from "@/utils/theme-script";
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
      <body className="bg-surface text-content selection:bg-primary/30 flex min-h-full flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
