
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('MobileTest_2026-01-30', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173/');

    // Take desktop screenshot
    await page.screenshot({ path: 'homepage.png', fullPage: true });

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Take mobile screenshot
    await page.screenshot({ path: 'mobile_homepage.png', fullPage: true });
});