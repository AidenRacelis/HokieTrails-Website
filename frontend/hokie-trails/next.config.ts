import type { NextConfig } from "next";

// Backend origin the Next.js server proxies /api/* to (server-side only).
// Defaults to the local monolith; in Docker/K8s point it at the API gateway.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  // Produce a self-contained build for small Docker images.
  output: "standalone",

  // Don't 308-redirect "/api/trails/" -> "/api/trails"; let the rewrite proxy
  // the request (with its trailing slash) straight through to the backend.
  skipTrailingSlashRedirect: true,

  // Proxy API requests through the Next.js server so the browser only ever
  // talks to a single origin (no CORS, works behind one forwarded port).
  // This is skipped when NEXT_PUBLIC_API_URL is set (e.g. a public gateway URL).
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
