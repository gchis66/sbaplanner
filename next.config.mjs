/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable server-side static generation for API routes
  output: "standalone",
  // Enable strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
