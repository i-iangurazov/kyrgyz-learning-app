import { defineConfig, devices } from "@playwright/test";

import { loadLocalEnvFiles } from "./scripts/lib/load-local-env";

loadLocalEnvFiles();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required for DB-backed E2E smoke validation. Set it in the environment or .env.local.",
  );
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: "db-content-smoke.spec.ts",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm build && pnpm start",
    env: {
      ...process.env,
      CONTENT_SOURCE: "postgres",
      DB_E2E: "1",
    },
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
