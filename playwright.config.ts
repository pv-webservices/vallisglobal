import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PREVIEW_PORT ?? 4330);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list'], ['json', { outputFile: 'output/playwright/results.json' }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices['Desktop Chrome'],
    reducedMotion: 'reduce',
    // Uses the locally installed Google Chrome; run `npx playwright install chromium` and remove this line to use the bundled build.
    channel: process.env.PW_CHANNEL ?? 'chrome',
  },
  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
