/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    basePath: '/studio',
    assetPrefix: '/studio',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
             {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            }
        ],
    },
};

module.exports = nextConfig;
