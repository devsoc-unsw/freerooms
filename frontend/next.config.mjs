import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, ".."),
  turbopack: {
    root: path.join(import.meta.dirname, ".."),
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

export default nextConfig;