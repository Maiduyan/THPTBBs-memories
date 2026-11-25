import { chromium } from 'playwright-core';

const OUT = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\opencode';
const results = {};
const errors = [];
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--enable-unsafe-swiftshader'],
});

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.evaluate(() => {
    const base = window.location.origin;
    const memories = [
      {
        id: 'seed-oldest',
        zone_id: 'cong_truong',
        author_name: 'Cựu học sinh A',
        cohort: 'K65',
        caption: 'OLDEST_MEMORY ' + 'a '.repeat(105),
        image_url: `${base}/assets/zones/cong_truong.svg`,
        created_at: '2024-01-01T08:00:00.000Z',
      },
      {
        id: 'seed-newest',
        zone_id: 'cong_truong',
        author_name: 'Cựu học sinh B',
        cohort: 'K68',
        caption: 'NEWEST_MEMORY ' + 'b '.repeat(105),
        image_url: `${base}/assets/zones/cong_truong.svg`,
        created_at: '2025-06-01T08:00:00.000Z',
      },
    ];
    window.localStorage.setItem('thptbb:demo-memories:v1', JSON.stringify(memories));
    window.localStorage.setItem('thptbb:has-visited-v1', '1');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2200);

  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(900);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(500);
  await page.locator('button[aria-label^="Khám phá"]').click({ force: true });
  await page.waitForTimeout(1200);

  const captions = async () =>
    page.locator('article p.whitespace-pre-line').allInnerTexts();

  results.defaultOrder = (await captions()).map((c) => c.split(' ')[0]);
  results.defaultSortPressed = await page.locator('button[aria-pressed="true"]').innerText();

  results.defaultCohortValue = await page.locator('#cohort-filter').inputValue();
  results.countLabel = await page.getByText('kỷ niệm').last().innerText().catch(() => '');

  await page.getByRole('button', { name: /Mới nhất trước/ }).click();
  await page.waitForTimeout(900);
  results.newestOrder = (await captions()).map((c) => c.split(' ')[0]);
  results.newestSortPressed = await page.locator('button[aria-pressed="true"]').innerText();

  await page.getByRole('button', { name: /Cũ nhất trước/ }).click();
  await page.waitForTimeout(900);
  results.backToOldest = (await captions()).map((c) => c.split(' ')[0]);

  await page.selectOption('#cohort-filter', 'K71');
  await page.waitForTimeout(1500);
  results.k71Count = await page.locator('article').count();
  await page.selectOption('#cohort-filter', 'K65');
  await page.waitForTimeout(1500);
  results.k65Captions = (await captions()).map((c) => c.split(' ')[0]);
  results.k65Count = await page.locator('article').count();

  await page.selectOption('#cohort-filter', 'ALL');
  await page.waitForTimeout(1000);
  await page.getByText('Kho ảnh kỷ niệm từ mọi người').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}\\thptbb-19-sort-filter.png` });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await context.close();

  // Landscape mobile sanity check
  const landContext = await browser.newContext({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const land = await landContext.newPage();
  await land.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await land.waitForSelector('canvas');
  await land.waitForTimeout(2200);
  const hint = land.getByRole('button', { name: 'Đóng gợi ý' });
  if (await hint.count()) await hint.click();
  await land.keyboard.down('ArrowDown').catch(() => {});
  await land.waitForTimeout(900);
  await land.keyboard.up('ArrowDown').catch(() => {});
  await land.waitForTimeout(500);
  await land.screenshot({ path: `${OUT}\\thptbb-20-landscape.png` });
  results.landscapePrompt = await land.locator('button[aria-label^="Khám phá"]').isVisible().catch(() => false);
  const dpad = land.locator('[role="group"][aria-label="Điều khiển di chuyển nhân vật"]');
  results.landscapeDpad = await dpad.isVisible().catch(() => false);
  if (results.landscapePrompt && results.landscapeDpad) {
    const p = await land.locator('button[aria-label^="Khám phá"]').boundingBox();
    const d = await dpad.boundingBox();
    results.landscapeGap = p && d ? Math.round(d.y - (p.y + p.height)) : null;
  }
  await landContext.close();
} catch (error) {
  errors.push(`FLOW: ${error.message}`);
  console.error(error);
}

await browser.close();
console.log(JSON.stringify({ results, errors }, null, 2));
