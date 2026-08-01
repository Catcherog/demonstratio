import { defineConfig } from "@playwright/test";

const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
  ?? (process.platform === "win32"
    ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    : undefined);
const externalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === "1";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.mjs/,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:3004",
    headless: true,
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  webServer: externalServer
    ? undefined
    : {
        command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3004 --webpack",
        url: "http://127.0.0.1:3004/",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
