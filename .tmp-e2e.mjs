import { chromium } from 'playwright-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:5173';
const OUT = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\opencode';

const words = (n) => Array.from({ length: n }, (_, i) => `ky${i + 1}`).join(' ');
const logs = [];
const errors = [];
const results = {};

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    logs.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 20000 });
  await page.waitForTimeout(2500);

  results.canvas = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return c ? { width: c.width, height: c.height, cssWidth: c.clientWidth, cssHeight: c.clientHeight } : null;
  });
  results.gameReady = await page.locator('text=Đang mở cánh cổng trường').count() === 0;
  results.authorBadge = await page.getByText('Thực hiện bởi').first().isVisible();

  const hintClose = page.getByRole('button', { name: 'Đóng gợi ý' });
  if (await hintClose.count()) await hintClose.click();

  await page.screenshot({ path: `${OUT}\\thptbb-01-desktop.png` });

  // Đi xuống về phía cổng trường.
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(800);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(600);

  results.zoneBadgeText = await page.locator('main').getByText('Cổng Trường').first().textContent().catch(() => null);
  const explore = page.locator('button[aria-label^="Khám phá"]');
  results.exploreVisible = await explore.isVisible().catch(() => false);
  if (results.exploreVisible) {
    await page.screenshot({ path: `${OUT}\\thptbb-02-near-gate.png` });
    await explore.click({ force: true });
  } else {
    // Dự phòng: nhấn E
    await page.keyboard.press('KeyE');
  }

  await page.waitForSelector('[role="dialog"][aria-labelledby="memory-modal-title"]', { timeout: 5000 });
  results.modalVisible = true;
  results.part1 = await page.getByText('Giới thiệu khu vực').isVisible();
  results.part2 = await page.getByText('Đăng ảnh kỷ niệm của bạn').isVisible();
  results.part3 = await page.getByText('Kho ảnh kỷ niệm từ mọi người').isVisible();
  results.nameRequired = await page.locator('#author-name').isVisible();
  results.cohortOptions = await page.locator('#cohort option').count();
  results.submitDisabledEmpty = await page.locator('form button[type=submit]').isDisabled();

  await page.fill('#author-name', 'Nguyễn Minh Anh');
  await page.selectOption('#cohort', 'K65');
  await page.fill('#caption', words(60));
  await page.waitForTimeout(150);
  results.counter60 = await page.locator('#caption-counter').innerText();
  results.submitDisabled60 = await page.locator('form button[type=submit]').isDisabled();

  await page.fill('#caption', words(120));
  await page.waitForTimeout(200);
  results.counter120 = (await page.locator('#caption-counter').innerText()).split('\n')[0];
  results.submitEnabled120 = await page.locator('form button[type=submit]').isEnabled();

  await page.fill('#caption', words(210));
  await page.waitForTimeout(200);
  results.submitDisabled210 = await page.locator('form button[type=submit]').isDisabled();

  await page.fill('#caption', words(140));
  await page.setInputFiles('#memory-image', 'D:\\MiniGameProject\\KyNiemTHPTBB\\public\\assets\\map_thptbb.png');
  await page.waitForTimeout(500);
  results.previewVisible = await page.locator('img[alt="Ảnh xem trước trước khi đăng"]').isVisible();

  await page.locator('form button[type=submit]').click();
  await page.waitForSelector('text=/Đã đăng kỷ niệm|đăng thành công/', { timeout: 60000 });
  results.uploadSuccess = true;

  await page.waitForTimeout(1500);
  results.galleryCount = await page.locator('article').count();
  const noCohortFilter = await page.locator('#cohort-filter').inputValue();
  results.defaultCohortFilter = noCohortFilter;
  results.defaultSortOldest = await page
    .locator('button[aria-pressed="true"]')
    .innerText();

  // Cuộn xuống phần kho ảnh để chụp.
  await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-labelledby="memory-modal-title"]');
    const scroller = dialog?.querySelector('.overflow-y-auto');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}\\thptbb-03-modal-gallery.png` });

  // Bộ lọc khóa học
  await page.selectOption('#cohort-filter', 'K65');
  await page.waitForTimeout(700);
  results.filteredCount = await page.locator('article').count();
  await page.selectOption('#cohort-filter', 'K50');
  await page.waitForTimeout(700);
  results.filteredEmptyVisible = await page.getByText('Chưa có kỷ niệm nào ở đây').isVisible();
  await page.selectOption('#cohort-filter', 'ALL');
  await page.waitForTimeout(700);
  results.filteredAllCount = await page.locator('article').count();

  // Lightbox
  await page.locator('article button[aria-label^="Xem ảnh"]').first().click();
  await page.waitForTimeout(500);
  results.lightboxVisible = await page.locator('[aria-label^="Ảnh kỷ niệm của"]').isVisible();
  await page.screenshot({ path: `${OUT}\\thptbb-04-lightbox.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  results.modalClosed = (await page.locator('[role="dialog"][aria-labelledby="memory-modal-title"]').count()) === 0;

  // Help modal & author credit
  await page.locator('button[title="Thông tin tác giả & hướng dẫn"]').click();
  await page.waitForTimeout(500);
  results.helpVisible = await page.getByText('Cách khám phá').isVisible();
  results.helpAuthor = await page.getByText('Mai Duy An').first().isVisible();
  await page.screenshot({ path: `${OUT}\\thptbb-05-help.png` });
  await page.getByRole('button', { name: 'Bắt đầu khám phá' }).click();
  await page.waitForTimeout(400);

  // Kiểm tra game nhận lại điều khiển sau khi đóng modal.
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowLeft');
  await page.screenshot({ path: `${OUT}\\thptbb-06-after-close.png` });
  results.finalCanvas = (await page.locator('canvas').count()) === 1;

  await context.close();

  // ----- Mobile -----
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', (err) => errors.push(`mobile pageerror: ${err.message}`));
  mobile.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`mobile console: ${msg.text()}`);
  });
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForSelector('canvas', { timeout: 20000 });
  await mobile.waitForTimeout(2500);
  const mobileHint = mobile.getByRole('button', { name: 'Đóng gợi ý' });
  if (await mobileHint.count()) await mobileHint.click();

  results.mobileDpad = await mobile
    .locator('[role="group"][aria-label="Điều khiển di chuyển nhân vật"]')
    .isVisible();
  results.mobileHeader = await mobile.getByText('Kỷ Niệm THPT Bắc Bình').first().isVisible();
  await mobile.screenshot({ path: `${OUT}\\thptbb-07-mobile.png` });

  // Đi xuống bằng D-Pad ảo (dispatch pointer events).
  const downBtn = mobile.locator('button[aria-label="Đi xuống"]');
  await downBtn.dispatchEvent('pointerdown', { pointerId: 7, pointerType: 'touch', isPrimary: true });
  await mobile.waitForTimeout(1300);
  await downBtn.dispatchEvent('pointerup', { pointerId: 7, pointerType: 'touch', isPrimary: true });
  await mobile.waitForTimeout(700);
  results.mobileExplore = await mobile.locator('button[aria-label^="Khám phá"]').isVisible().catch(() => false);
  await mobile.screenshot({ path: `${OUT}\\thptbb-08-mobile-gate.png` });

  if (results.mobileExplore) {
    await mobile.locator('button[aria-label^="Khám phá"]').click({ force: true });
    await mobile.waitForTimeout(1200);
    await mobile.screenshot({ path: `${OUT}\\thptbb-09-mobile-modal.png` });
    results.mobileModal = await mobile
      .locator('[role="dialog"][aria-labelledby="memory-modal-title"]')
      .isVisible();
  }

  await mobileContext.close();
} catch (error) {
  errors.push(`TEST FLOW: ${error.message}`);
  console.error(error);
} finally {
  await browser.close();
}

console.log(JSON.stringify({ results, errors, logCount: logs.length }, null, 2));
