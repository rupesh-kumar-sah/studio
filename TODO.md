# GitHub Pages Deployment TODO

- [x] Update next.config.js for static export (output: 'export', basePath: '/studio', assetPrefix: '/studio', trailingSlash: true, images: { unoptimized: true })
- [x] Update package.json to add export script
- [x] Create .github/workflows/deploy.yml for GitHub Actions deployment
- [ ] Convert product-actions.ts to client-side (remove 'use server', use localStorage for data persistence)
- [ ] Update admin/products/page.tsx to client component
- [ ] Update other pages using server actions to client-side
- [ ] Test build and export
- [ ] Push to GitHub and enable Pages
