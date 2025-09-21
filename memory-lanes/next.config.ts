import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qdlsyfvlokwkgxrgfhon.supabase.co",
        pathname: "/storage/v1/object/public/memory-images/**",
      },
      {
        protocol: "https",
        hostname: "placekitten.com",
      },
    ],
  },
};

export default nextConfig;
