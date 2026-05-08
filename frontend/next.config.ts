import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: '@use "@/theme.scss" as *;',
  },
}

export default nextConfig
