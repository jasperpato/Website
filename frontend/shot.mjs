import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const [name, w, h] of [['desktop', 1280, 800], ['mobile', 390, 800]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://localhost:5183/');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/tmp/landing-${name}.png` });
  await page.close();
}
await browser.close();
