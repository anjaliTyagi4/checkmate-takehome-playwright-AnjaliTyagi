import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  // ✅ Correct reporter format
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    headless: false, // show browser
    // ✅ slowMo belongs here
    launchOptions: {
      slowMo: 800,
    },
    screenshot: 'only-on-failure',
    video: 'off',
  },
});
