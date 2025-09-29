
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/nepal-emart',
  assetPrefix: '/nepal-emart/',
};

module.exports = nextConfig;
