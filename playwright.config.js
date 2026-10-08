import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests: a real browser against the real stack, not mocks.
 *
 * Playwright starts two things itself:
 *   1. the SweetNest backend (from BACKEND_DIR) on its own empty test database,
 *      which seeds the featured cakes when it boots,
 *   2. the production build of this app, pointed at that backend.
 *
 * Run them with:  npm run test:e2e
 *
 * Needs MongoDB on localhost:27017 (a service container in CI) and the backend
 * repository checked out at BACKEND_DIR (default ../SweetNestBackend).
 * Set PW_CHANNEL=chrome to use an installed Chrome instead of downloading
 * Playwright's own browser.
 */

const BACKEND_DIR = path.resolve(process.env.BACKEND_DIR || '../SweetNestBackend');
const RESET_SCRIPT = path.resolve('e2e/support/resetDatabase.cjs');
const API_PORT = 5055;
const WEB_PORT = 4173;
const WEB_URL = `http://localhost:${WEB_PORT}`;

const backendEnv = {
  PORT: String(API_PORT),
  NODE_ENV: 'development',
  DB_URL: process.env.E2E_DB_URL || 'mongodb://127.0.0.1:27017/sweetnest-e2e',
  JWT_SECRET: 'e2e-only-secret-not-used-anywhere-else',
  CORS_EXTRA_ORIGINS: WEB_URL,
  DEMO_ACCOUNTS_ENABLED: 'true',
};

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // the journeys share one database
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: WEB_URL,
    channel: process.env.PW_CHANNEL || undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: [
    {
      // Empty the test database first, so every run starts from the same shop.
      // The server seeds the two featured cakes itself when it boots, which is
      // all the menu needs for these journeys.
      command: `node ${RESET_SCRIPT} && node server.js`,
      cwd: BACKEND_DIR,
      url: `http://localhost:${API_PORT}/health`,
      env: { ...backendEnv, BACKEND_DIR },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: `npm run build && npx vite preview --port ${WEB_PORT} --strictPort`,
      env: {
        VITE_API_BASE_URL: `http://localhost:${API_PORT}/api`,
        VITE_ENABLE_DEMO_LOGIN: 'true',
      },
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
