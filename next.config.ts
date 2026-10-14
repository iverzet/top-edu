import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.openstreetcam.org" },
      { protocol: "https", hostname: "api.panoramax.xyz" },
      { protocol: "https", hostname: "**.panoramax.fr" },
    ],
  },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
