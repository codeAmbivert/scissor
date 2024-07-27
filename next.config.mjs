/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",

  images: {
    domains: ["api.qrserver.com"],
    unoptimized: true,
  },
};

export default nextConfig;
