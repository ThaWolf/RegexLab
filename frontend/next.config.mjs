import nextMdx from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // app directory enabled by default
    // contentlayer: true,
  },
}

const withMDX = nextMdx({
  extension: /\.mdx$/,
})

export default withMDX(nextConfig)
