/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/{имя-репозитория}' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/{имя-репозитория}/' : '',
}

module.exports = nextConfig 