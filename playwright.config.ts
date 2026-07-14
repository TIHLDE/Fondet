import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    // mirrors the Docker image: standalone server, static assets copied in
    command:
      "npm run build && cp -rT .next/static .next/standalone/.next/static && cp -rT public .next/standalone/public && PORT=3100 node .next/standalone/server.js",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
