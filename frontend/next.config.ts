/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["http://192.168.1.161:3000"],
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
