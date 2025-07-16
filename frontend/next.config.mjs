import nextMdx from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // app directory enabled by default
    // contentlayer: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
}

const withMDX = nextMdx({
  extension: /\.mdx$/,
})

export default withMDX(nextConfig)
