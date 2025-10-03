/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
