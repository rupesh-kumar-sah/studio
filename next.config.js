
/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    output: 'export',
    // These are only needed for GitHub Pages deployment
    basePath: isProd ? '/studio' : '',
    assetPrefix: isProd ? '/studio/' : '',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
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
