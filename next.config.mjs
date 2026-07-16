/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output so the Docker image only ships the compiled server.
  output: "standalone",
  experimental: {
    // The group pages enumerate public/members at runtime to build the member
    // grid and archive carousel. On serverless (Vercel) that folder is not in
    // the function bundle by default, so force it in or the scans come back
    // empty and no portraits render.
    outputFileTracingIncludes: {
      "/group": ["./public/members/**/*"],
      "/group/tidligere": ["./public/members/**/*"],
    },
  },
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
