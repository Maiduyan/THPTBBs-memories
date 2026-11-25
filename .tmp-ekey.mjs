import { chromium } from 'playwright-core';

const errors = [];
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForSelector('canvas');
await page.waitForTimeout(2200);
const hint = page.getByRole('button', { name: 'Đóng gợi ý' });
if (await hint.count()) await hint.click({ force: true }).catch(() => {});
await page.keyboard.down('ArrowDown');
await page.waitForTimeout(950);
await page.keyboard.up('ArrowDown');
await page.waitForTimeout(500);

const state = async (label) => {
  console.log(label, {
    dialog: await page.locator('[role="dialog"]').count(),
    active: await page.evaluate(() => document.activeElement?.tagName + '#' + (document.activeElement?.id || '') + '.' + (document.activeElement?.className || '').slice(0, 30)),
    prompt: await page.locator('button[aria-label^="Khám phá"]').count(),
    zoneText: (await page.locator('main').innerText()).includes('ĐANG Ở KHU VỰC'),
  });
};

await state('before open');
await page.keyboard.press('e');
await page.waitForTimeout(600);
await state('after first e');
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
await state('after esc');
await page.keyboard.press('e');
await page.waitForTimeout(600);
await state('after e #2');
await page.mouse.click(640, 500);
await page.waitForTimeout(300);
await page.keyboard.press('e');
await page.waitForTimeout(600);
await state('after canvas click + e');
if (await page.locator('[role="dialog"]').count()) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
}
await page.keyboard.press('Enter');
await page.waitForTimeout(600);
await state('after enter');
if (await page.locator('[role="dialog"]').count()) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
}
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
await state('after KeyE');

await browser.close();
console.log({ errors });
