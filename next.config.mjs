/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://sbaplanner.vercel.app",
          },
          { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
  // Ensure API routes are included in the standalone output
  experimental: {
    outputFileTracingIncludes: {
      "/api/**/*": ["./src/app/api/**/*"],
    },
  },
};

export default nextConfig;
