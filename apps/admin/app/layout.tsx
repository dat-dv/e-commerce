import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
      <body className="bg-surface text-content min-h-screen">{children}</body>
    </html>
  );
}
