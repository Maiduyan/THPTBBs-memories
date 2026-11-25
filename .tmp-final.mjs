import { chromium } from 'playwright-core';
import fs from 'node:fs';

const OUT = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\opencode';
const BASE = 'http://localhost:5173';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const results = {};
const errors = [];

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--enable-unsafe-swiftshader'] });

const intersect = (a, b) =>
  Boolean(a && b) && a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

const box = async (locator) => (await locator.count()) ? locator.boundingBox() : null;

async function dismissHint(page) {
  const hint = page.getByRole('button', { name: 'Đóng gợi ý' });
  if (await hint.count()) await hint.click({ force: true }).catch(() => {});
}

async function walkToGate(page) {
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(950);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(500);
}

try {
  /* ---------------- DESKTOP ---------------- */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`desktop pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`desktop console: ${m.text()}`); });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2300);
  await dismissHint(page);

  results.canvas = await page.locator('canvas').evaluate((c) => ({ w: c.width, h: c.height }));
  results.desktopPromptInitially = await page.locator('button[aria-label^="Khám phá"]').count();

  await walkToGate(page);
  const prompt = page.locator('button[aria-label^="Khám phá"]');
  results.desktopPromptAtGate = await prompt.isVisible();
  results.desktopPromptBox = await box(prompt);
  await page.screenshot({ path: `${OUT}\\final-01-desktop-gate.png` });

  await prompt.click({ force: true });
  await page.waitForSelector('[role="dialog"][aria-labelledby="memory-modal-title"]');
  await page.waitForTimeout(700);

  results.modal = {
    visible: true,
    bodyOverflow: await page.evaluate(() => document.body.style.overflow),
    dialogBox: await box(page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]')),
    introY: (await box(page.getByText('Giới thiệu khu vực').first()))?.y,
    formY: (await box(page.getByText('Đăng ảnh kỷ niệm của bạn').first()))?.y,
    galleryY: (await box(page.getByText('Kho ảnh kỷ niệm từ mọi người').first()))?.y,
    bannerLoaded: await page.locator('img[alt^="Ảnh đại diện khu vực"]').evaluate((img) => img.naturalWidth > 0).catch(() => false),
  };

  const scroller = page.locator('[role="dialog"] > div.overflow-y-auto');
  results.scroll = await scroller.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    scrollable: el.scrollHeight > el.clientHeight + 40,
    horizontalOverflow: el.scrollWidth > el.clientWidth + 1,
  }));
  results.pageHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );

  // Validation: caption below range.
  await page.fill('#author-name', 'Lê Hoàng Nam');
  await page.selectOption('#cohort', 'K66');
  await page.fill('#caption', Array.from({ length: 80 }, (_, i) => `tu${i}`).join(' '));
  await page.waitForTimeout(200);
  results.form = {
    counter80: (await page.locator('#caption-counter p').first().innerText()),
    submitDisabled80: await page.locator('form button[type=submit]').isDisabled(),
    cohortCount: await page.locator('#cohort option').count(),
  };

  // Valid caption and real JPEG upload.
  await page.fill('#caption', Array.from({ length: 130 }, (_, i) => `kyniem${i}`).join(' '));
  const jpeg = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 1200; c.height = 800;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1200, 800);
    g.addColorStop(0, '#0b2a6b'); g.addColorStop(1, '#e8b64c');
    x.fillStyle = g; x.fillRect(0, 0, 1200, 800);
    x.fillStyle = '#fff'; x.font = 'bold 84px sans-serif'; x.fillText('THPT BAC BINH', 180, 390);
    x.font = '40px sans-serif'; x.fillText('Ky niem thanh xuan', 380, 470);
    return c.toDataURL('image/jpeg', 0.95).split(',')[1];
  });
  const jpegPath = `${OUT}\\final-test-photo.jpg`;
  fs.writeFileSync(jpegPath, Buffer.from(jpeg, 'base64'));
  await page.setInputFiles('#memory-image', jpegPath);
  await page.waitForTimeout(500);
  results.form.previewLoaded = await page.locator('img[alt="Ảnh xem trước trước khi đăng"]').evaluate((i) => i.naturalWidth > 0);
  results.form.submitEnabled130 = await page.locator('form button[type=submit]').isEnabled();
  results.form.noHorizontalOverflow = !(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1));

  await page.locator('form button[type=submit]').click();
  await page.waitForSelector('text=/Đã đăng kỷ niệm ở chế độ demo|đã được đăng thành công/', { timeout: 90000 });
  await page.waitForTimeout(1800);
  results.upload = {
    success: true,
    galleryCount: await page.locator('article').count(),
    firstImageLoaded: await page.locator('article img').first().evaluate((i) => i.complete && i.naturalWidth > 0),
    highlighted: await page.locator('article.ring-2').count(),
  };

  results.gallery = {
    defaultFilter: await page.locator('#cohort-filter').inputValue(),
    defaultSort: (await page.locator('button[aria-pressed="true"]').innerText()).split('\n')[0],
    countLabel: await page.locator('section span.rounded-full').last().innerText(),
  };

  await page.getByRole('button', { name: /Mới nhất trước/ }).click();
  await page.waitForTimeout(800);
  results.gallery.newestPressed = (await page.locator('button[aria-pressed="true"]').innerText()).split('\n')[0];

  await page.selectOption('#cohort-filter', 'K50');
  await page.waitForTimeout(800);
  results.gallery.filteredEmpty = await page.getByText('Chưa có kỷ niệm nào ở đây').isVisible();
  await page.selectOption('#cohort-filter', 'K66');
  await page.waitForTimeout(800);
  results.gallery.filteredOwnCount = await page.locator('article').count();
  await page.selectOption('#cohort-filter', 'ALL');
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /Cũ nhất trước/ }).click();
  await page.waitForTimeout(600);

  await page.getByText('Kho ảnh kỷ niệm từ mọi người').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}\\final-02-desktop-gallery.png` });

  // Lightbox
  await page.locator('article button[aria-label^="Xem ảnh"]').first().click({ force: true });
  await page.waitForTimeout(500);
  results.lightbox = {
    visible: await page.locator('[aria-label^="Ảnh kỷ niệm của"]').isVisible(),
    imageLoaded: await page.locator('[aria-label^="Ảnh kỷ niệm của"] img').first().evaluate((i) => i.complete && i.naturalWidth > 0).catch(() => false),
  };
  await page.screenshot({ path: `${OUT}\\final-03-desktop-lightbox.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  results.lightbox.closedWithEsc = (await page.locator('[aria-label^="Ảnh kỷ niệm của"]').count()) === 0;

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  results.modalClosed = (await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').count()) === 0;
  results.bodyOverflowRestored = await page.evaluate(() => document.body.style.overflow);

  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(400);
  await page.keyboard.up('ArrowLeft');
  await page.waitForTimeout(300);
  results.gameAliveAfterClose = (await page.locator('canvas').count()) === 1;

  await page.locator('button[title="Thông tin tác giả & hướng dẫn"]').click();
  await page.waitForTimeout(400);
  results.help = {
    visible: await page.getByText('Cách khám phá').isVisible(),
    author: await page.getByText('Mai Duy An').first().isVisible(),
  };
  await page.screenshot({ path: `${OUT}\\final-04-desktop-help.png` });
  await page.getByRole('button', { name: 'Bắt đầu khám phá' }).click();
  await page.waitForTimeout(300);

  await ctx.close();

  /* ---------------- MOBILE PORTRAIT ---------------- */
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mobile = await mctx.newPage();
  mobile.on('pageerror', (e) => errors.push(`mobile pageerror: ${e.message}`));
  mobile.on('console', (m) => { if (m.type() === 'error') errors.push(`mobile console: ${m.text()}`); });
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForSelector('canvas');
  await mobile.waitForTimeout(2300);
  await dismissHint(mobile);

  const dpad = mobile.locator('[role="group"][aria-label="Điều khiển di chuyển nhân vật"]');
  const author = mobile.locator('button[title="Thông tin tác giả & hướng dẫn"]');
  const dpadBox = await box(dpad);
  const authorBox = await box(author);
  results.portrait = {
    dpadVisible: await dpad.isVisible(),
    authorVisible: await author.isVisible(),
    dpadAuthorOverlap: intersect(dpadBox, authorBox),
    dpadBox,
    authorBox,
    pageHorizontalOverflow: await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
  };

  await mobile.locator('button[aria-label="Đi xuống"]').dispatchEvent('pointerdown', { pointerId: 11, pointerType: 'touch', isPrimary: true });
  await mobile.waitForTimeout(1200);
  await mobile.locator('button[aria-label="Đi xuống"]').dispatchEvent('pointerup', { pointerId: 11, pointerType: 'touch', isPrimary: true });
  await mobile.waitForTimeout(600);

  const mPrompt = mobile.locator('button[aria-label^="Khám phá"]');
  const mPromptBox = await box(mPrompt);
  results.portrait.promptVisible = await mPrompt.isVisible().catch(() => false);
  results.portrait.promptDpadOverlap = intersect(mPromptBox, dpadBox);
  results.portrait.promptBox = mPromptBox;
  await mobile.screenshot({ path: `${OUT}\\final-05-mobile-portrait.png` });

  if (results.portrait.promptVisible) {
    await mPrompt.click({ force: true });
    await mobile.waitForTimeout(900);
    results.portrait.modalVisible = await mobile.locator('[role="dialog"]').isVisible();
    await mobile.getByText('Đăng ảnh kỷ niệm của bạn').scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: `${OUT}\\final-06-mobile-form.png` });
    await mobile.getByText('Kho ảnh kỷ niệm từ mọi người').scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(500);
    await mobile.screenshot({ path: `${OUT}\\final-07-mobile-gallery.png` });
    results.portrait.modalHorizontalOverflow = await mobile
      .locator('[role="dialog"] > div.overflow-y-auto')
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    await mobile.keyboard.press('Escape');
  }
  await mctx.close();

  /* ---------------- MOBILE LANDSCAPE ---------------- */
  for (const [w, h, name] of [[568, 320, 'small'], [844, 390, 'wide']]) {
    const lctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const land = await lctx.newPage();
    land.on('pageerror', (e) => errors.push(`landscape ${name} pageerror: ${e.message}`));
    await land.goto(BASE, { waitUntil: 'networkidle' });
    await land.waitForSelector('canvas');
    await land.waitForTimeout(2300);
    await dismissHint(land);

    const lDpad = land.locator('[role="group"][aria-label="Điều khiển di chuyển nhân vật"]');
    await lDpad.locator('button[aria-label="Đi xuống"]').dispatchEvent('pointerdown', { pointerId: 21, pointerType: 'touch', isPrimary: true });
    await land.waitForTimeout(1200);
    await lDpad.locator('button[aria-label="Đi xuống"]').dispatchEvent('pointerup', { pointerId: 21, pointerType: 'touch', isPrimary: true });
    await land.waitForTimeout(600);

    const lPrompt = land.locator('button[aria-label^="Khám phá"]');
    const lDpadBox = await box(lDpad);
    const lPromptBox = await box(lPrompt);
    const lAuthorBox = await box(land.locator('button[title="Thông tin tác giả & hướng dẫn"]'));

    results[`landscape_${name}`] = {
      dpadBox: lDpadBox,
      promptBox: lPromptBox,
      promptVisible: await lPrompt.isVisible().catch(() => false),
      promptDpadOverlap: intersect(lPromptBox, lDpadBox),
      dpadAuthorOverlap: intersect(lDpadBox, lAuthorBox),
      promptInViewport: lPromptBox ? lPromptBox.y >= 0 && lPromptBox.x >= 0 && lPromptBox.x + lPromptBox.width <= w : null,
      hasEHint: await lPrompt.getByText('hoặc chạm').count(),
      pageHorizontalOverflow: await land.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
    };
    await land.screenshot({ path: `${OUT}\\final-08-landscape-${name}.png` });
    await lctx.close();
  }
} catch (error) {
  errors.push(`FLOW: ${error.message}`);
  console.error(error);
} finally {
  await browser.close();
}

console.log(JSON.stringify({ results, errors }, null, 2));
