/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cse-quiz/shared'],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
