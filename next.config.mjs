/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  output: 'export',
  images: {
    // `output: "export"` disables the default Image Optimization, so all images
    // are served as static files. `unoptimized: true` is set automatically but
    // included here for clarity.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'green-news.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.green-news.ro',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
