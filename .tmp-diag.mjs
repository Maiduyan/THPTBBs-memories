import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE:', m.text()); });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForSelector('canvas');
await page.waitForTimeout(2200);
const hint = page.getByRole('button', { name: 'Đóng gợi ý' });
if (await hint.count()) await hint.click();
await page.evaluate(() => {
  window.__keys = [];
  window.addEventListener('keydown', (e) => window.__keys.push(`${e.key}/${e.code}`), true);
});
await page.keyboard.down('ArrowDown');
await page.waitForTimeout(900);
await page.keyboard.up('ArrowDown');
await page.waitForTimeout(600);
console.log('keys seen:', await page.evaluate(() => window.__keys));
console.log('zone badge:', await page.locator('main').innerText());
const explore = page.locator('button[aria-label^="Khám phá"]');
console.log('explore count/visible:', await explore.count(), await explore.isVisible().catch(() => false));
console.log('dialog before:', await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').count());
await page.keyboard.press('e');
await page.waitForTimeout(800);
console.log('dialog after lowercase e:', await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').count());
if ((await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').count()) === 0) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(800);
  console.log('dialog after KeyE:', await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').count());
}
console.log('keys seen final:', await page.evaluate(() => window.__keys));
await browser.close();
