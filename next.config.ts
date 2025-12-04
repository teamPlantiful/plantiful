import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nongsaro.go.kr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mlslddsfprsobkfdnjjb.supabase.co',
        pathname: '/storage/v1/object/public/plant-images/**',
      },
    ],
  },
}

export default nextConfig
