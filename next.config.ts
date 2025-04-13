import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // We've fixed all ESLint errors, so we can enforce ESLint checks during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // We've fixed all TypeScript errors, so we can enforce type checking during builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
