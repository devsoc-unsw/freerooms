/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    appDir: true,
    externalDir: true,
    serverActions: true,
  },
};

module.exports = nextConfig;
