
/** @type {import('next').NextConfig} */

// IMPORTANT FOR GITHUB PAGES DEPLOYMENT:
// If you are deploying to a GitHub Pages repository, you need to set the `basePath`.
// The `basePath` should be the name of your GitHub repository.
// For example, if your repository is named "my-nepal-emart", you should change
// the basePath below to: `basePath: '/my-nepal-emart'`.
// If you are deploying to a custom domain or the root of your GitHub Pages site,
// you can remove the `basePath` line.

const nextConfig = {
  // Replace 'your-repo-name' with the name of your GitHub repository
  basePath: '/your-repo-name',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
