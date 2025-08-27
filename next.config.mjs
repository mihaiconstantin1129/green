/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
