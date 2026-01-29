import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:shortCode([a-zA-Z0-9]{1,8})",
        destination: "http://localhost:5000/:shortCode",
      },
    ];
  },
};

export default nextConfig;
