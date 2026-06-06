import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Serves linguist/cyborg/ statically so the admin HTML + config.js load.
// API calls are mocked in each spec via page.route() — no Cloudflare Access
// auth dance needed for v1 click-through tests.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');  // linguist/
const PORT = process.env.TEST_PORT ? Number(process.env.TEST_PORT) : 4173;

export default defineConfig({
  testDir: __dirname,
  fullyParallel: false,        // small surface; sequential is fine and easier to debug
  reporter: [['list'], ['html', { open: 'never', outputFolder: path.join(__dirname, 'playwright-report') }]],
  outputDir: path.join(__dirname, 'test-results'),
  timeout: 20_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 5_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    // Serve linguist/cyborg/ at /. Admin assets live under /cyborg/admin/...,
    // which is exactly the path the HTML uses (/cyborg/admin/config.js),
    // so links resolve correctly.
    command: `python3 -m http.server ${PORT} --directory ${PROJECT_ROOT}`,
    url: `http://localhost:${PORT}/cyborg/admin/`,
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
