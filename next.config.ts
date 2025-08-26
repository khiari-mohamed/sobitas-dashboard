import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.protein.tn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'protein.tn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '145.223.118.9',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
