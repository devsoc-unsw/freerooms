/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["swiper", "ssr-window", "dom7"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.learningenvironments.unsw.edu.au",
      },
    ],
  },
};

module.exports = nextConfig;
