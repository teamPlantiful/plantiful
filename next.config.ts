import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nongsaro.go.kr',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
