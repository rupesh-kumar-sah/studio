
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Replace 'nepal-emart' with your repository name
    basePath: '/nepal-emart',
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
