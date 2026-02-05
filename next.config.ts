import type { NextConfig } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is required for deployment.");
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;