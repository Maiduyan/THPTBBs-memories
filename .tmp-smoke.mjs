import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const errors = [];
const out = {};
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2200);
  const hint = page.getByRole('button', { name: 'Đóng gợi ý' });
  if (await hint.count()) await hint.click({ force: true }).catch(() => {});

  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(950);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(500);

  const prompt = page.locator('button[aria-label^="Khám phá"]');
  out.prompt = await prompt.isVisible();
  await prompt.click({ force: true });
  await page.waitForTimeout(800);
  out.dialog = await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').isVisible();
  out.intro = await page.getByText('Giới thiệu khu vực').first().isVisible();

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  out.closed = (await page.locator('[role="dialog"]').count()) === 0;

  // E key path
  await page.keyboard.press('e');
  await page.waitForTimeout(700);
  out.openedWithE = await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').isVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  out.closedAgain = (await page.locator('[role="dialog"]').count()) === 0;
  out.canvasAlive = (await page.locator('canvas').count()) === 1;
} catch (error) {
  errors.push(`FLOW: ${error.message}`);
} finally {
  await browser.close();
}
console.log(JSON.stringify({ base: BASE, out, errors }, null, 2));
