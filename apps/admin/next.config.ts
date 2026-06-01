import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ecommerce/shared", "@ecommerce/ui"],
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
