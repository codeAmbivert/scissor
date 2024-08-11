/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",

  images: {
    domains: ["api.qrserver.com"],
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcLoader: true,
    swcMinify: true,
  },
};

export default nextConfig;
