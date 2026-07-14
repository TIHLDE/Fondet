/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output so the Docker image only ships the compiled server.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.nntech.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
