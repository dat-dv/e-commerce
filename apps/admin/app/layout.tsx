import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeSync } from "@/components/atoms/theme-sync";
import { AuthGuard } from "@/components/organisms/auth-guard";
import { adminThemeScript } from "@/utils/theme-script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | Chốt Đơn",
    template: "%s | Admin — Chốt Đơn",
  },
  description:
    "Internal admin panel for managing the Chốt Đơn e-commerce platform.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} font-sans antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: adminThemeScript }} />
      </head>
      <body className="bg-surface text-content min-h-screen">
        <ThemeSync />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
