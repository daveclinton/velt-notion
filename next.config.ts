import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["picsum.photos"],
  },
};

export default nextConfig;
