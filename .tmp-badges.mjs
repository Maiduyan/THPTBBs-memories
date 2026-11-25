import { chromium } from 'playwright-core';

const OUT = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\opencode';
const results = {};
const errors = [];
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const intersect = (a, b) => Boolean(a && b) && a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

for (const [w, h, name] of [[360, 740, '360'], [390, 844, '390'], [640, 900, '640'], [1440, 900, '1440']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 900, hasTouch: w < 900, deviceScaleFactor: w < 900 ? 2 : 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2200);
  const hint = page.getByRole('button', { name: 'Đóng gợi ý' });
  if (await hint.count()) await hint.click({ force: true }).catch(() => {});
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(950);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(500);

  const zoneBadge = page.locator('main > div.pointer-events-none.absolute.left-3').first();
  const author = page.locator('button[title="Thông tin tác giả & hướng dẫn"]');
  const zb = await zoneBadge.boundingBox().catch(() => null);
  const ab = await author.boundingBox();
  results[name] = {
    zoneBadge: zb,
    author: ab,
    overlap: intersect(zb, ab),
    zoneTruncated: await zoneBadge.locator('span.truncate').evaluate((el) => el.scrollWidth > el.clientWidth).catch(() => null),
    pageOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
  };
  await page.screenshot({ path: `${OUT}\\badge-${name}.png` });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify({ results, errors }, null, 2));
