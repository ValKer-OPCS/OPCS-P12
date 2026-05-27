import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [ '192.168.1.102' ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zvwygodrezphdvzxnxwb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
