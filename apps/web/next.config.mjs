/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@neptlium/design-system"],
  turbopack: {
    root: "../../"
  }
};

export default nextConfig;
