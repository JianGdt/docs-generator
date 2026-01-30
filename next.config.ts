import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  // Optimize production builds
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "next-auth", "@/components/ui"],
  },
};

export default nextConfig;
