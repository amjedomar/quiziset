import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * set the "turbopack.root" to this project folder. without it next.js detects multiple
   * npm lockfiles (this one + the root package-lock.json used for husky) and results in warning
   * see https://stackoverflow.com/questions/79797750/next-js-inferred-the-wrong-workspace-root-error/79844648#79844648
   */
  turbopack: {
    root: __dirname,
  },
  sassOptions: {
    additionalData: '@use "@/theme.scss" as *;',
  },
  /**
   * fully disable streaming metadata of `generateMetadata`
   * so meta tags are returned instantly with the SSR rendered page
   * see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata
   */
  htmlLimitedBots: /.*/,
}

export default nextConfig
