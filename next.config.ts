import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.production.midtrans.com',
        port: '',
        pathname: '/v2/qris/**',
      },
    ],
  },
};

export default nextConfig;
