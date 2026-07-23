import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Allow loading .wasm files from public
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  // Required for Stockfish WASM SharedArrayBuffer
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
