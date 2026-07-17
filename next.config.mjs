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
      // src/data JSON is read with fs at request time (volume-first via
      // data-store, committed copy as fallback), so the fallback files must be
      // traced into every consumer.
      "/group": ["./public/members/**/*", "./src/data/*.json"],
      "/group/tidligere": ["./public/members/**/*", "./src/data/*.json"],
      // The holdings endpoint reads the quarterly report PDFs at runtime to pull
      // published portfolio weights, so they must be traced into the function.
      "/api/nordnet": ["./public/reports/**/*"],
      "/api/content": ["./src/data/*.json"],
      "/api/soknader": ["./src/data/*.json"],
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
