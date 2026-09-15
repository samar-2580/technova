import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 Starting local preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    stdio: 'inherit',
    shell: true,
  });

  // Give server time to bind
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('📸 Launching Chromium headless browser for screenshot capture...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:4173';

  try {
    // 1. Dashboard Overview
    console.log('Capturing dashboard.png...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard.png'), fullPage: true });

    // 2. Subscriptions Hub
    console.log('Capturing subscriptions.png...');
    const subTab = page.locator('button:has-text("Subscriptions")').first();
    if (await subTab.isVisible()) {
      await subTab.click();
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'subscriptions.png'), fullPage: true });

    // 3. Analytics
    console.log('Capturing analytics.png...');
    const analyticsTab = page.locator('button:has-text("Analytics")').first();
    if (await analyticsTab.isVisible()) {
      await analyticsTab.click();
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'analytics.png'), fullPage: true });

    // 4. Mobile Viewport
    console.log('Capturing mobile-view.png...');
    await page.setViewportSize({ width: 375, height: 812 }); // 375px standard mobile viewport
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-view.png') });

    console.log('✅ All screenshots captured successfully in docs/screenshots/!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
