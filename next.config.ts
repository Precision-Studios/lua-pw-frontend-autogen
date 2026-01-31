import type { NextConfig } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is required for deployment.");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:shortCode([a-zA-Z0-9]{1,8})",
        destination: `${API_BASE_URL}/:shortCode`,
      },
    ];
  },
};

export default nextConfig;
