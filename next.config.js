const config = require('./config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? `/${config.github.repository}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${config.github.repository}/` : '',
}

module.exports = nextConfig 