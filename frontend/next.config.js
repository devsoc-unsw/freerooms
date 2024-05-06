/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  swcMinify: true,
  experimental: {
    appDir: true,
    externalDir: true,
  },
};

module.exports = nextConfig;
