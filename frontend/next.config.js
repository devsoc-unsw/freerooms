/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    appDir: true,
    externalDir: true,
  },
};

module.exports = nextConfig;
