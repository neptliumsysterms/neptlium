/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@netlium/ui", "@netlium/lib", "@netlium/types"]
  }
};

export default nextConfig;
