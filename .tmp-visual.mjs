import { chromium } from 'playwright-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:5173';
const OUT = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\opencode';
const errors = [];
const results = {};

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--enable-unsafe-swiftshader'],
});

async function dismissHint(page) {
  const hint = page.getByRole('button', { name: 'Đóng gợi ý' });
  if (await hint.count()) await hint.click();
}

try {
  // ---------------- DESKTOP ----------------
  const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`desktop: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2200);
  await dismissHint(page);

  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(900);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(600);
  const gatePrompt = page.locator('button[aria-label^="Khám phá"]');
  if (await gatePrompt.count()) {
    await gatePrompt.click({ force: true });
  } else {
    await page.keyboard.press('e');
  }
  await page.waitForSelector('[role="dialog"][aria-labelledby="memory-modal-title"]');
  await page.waitForTimeout(600);

  await page.screenshot({ path: `${OUT}\\thptbb-10-modal-top.png` });

  const formTitle = page.getByText('Đăng ảnh kỷ niệm của bạn');
  await formTitle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}\\thptbb-11-form.png` });

  await page.fill('#author-name', 'Trần Bảo Ngọc');
  await page.selectOption('#cohort', 'K68');
  const caption92 =
    'Mỗi lần đi ngang qua căn tin, tôi lại nhớ đến những buổi ra chơi mười lăm phút ngắn ngủi mà đủ để cả lũ kể cho nhau nghe đủ thứ chuyện trên đời. ' +
    Array.from({ length: 76 }, (_, i) => `chuyen${i + 1}`).join(' ');
  await page.fill('#caption', caption92);
  await page.waitForTimeout(250);
  results.counterColor = await page.locator('#caption-counter p').first().evaluate((el) => getComputedStyle(el).color);
  results.submitWith92 = await page.locator('form button[type=submit]').isDisabled();

  await page.fill('#caption', Array.from({ length: 128 }, (_, i) => `tu${i + 1}`).join(' '));
  await page.setInputFiles('#memory-image', 'D:\\MiniGameProject\\KyNiemTHPTBB\\public\\assets\\zones\\cong_truong.svg').catch(() => {});
  await page.waitForTimeout(400);
  results.svgRejected = await page.getByText('Chỉ hỗ trợ ảnh JPG').isVisible().catch(() => false);

  // Tạo file JPEG thật từ canvas trong trình duyệt để test preview.
  const jpegBase64 = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 900, 600);
    grad.addColorStop(0, '#1d4ed8');
    grad.addColorStop(1, '#f0b429');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('THPT BAC BINH', 180, 300);
    ctx.font = '32px sans-serif';
    ctx.fillText('Ky niem thanh xuan', 280, 360);
    return canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
  });
  const fs = await import('node:fs');
  const jpegPath = `${OUT}\\thptbb-test-photo.jpg`;
  fs.writeFileSync(jpegPath, Buffer.from(jpegBase64, 'base64'));
  await page.setInputFiles('#memory-image', jpegPath);
  await page.waitForTimeout(600);
  results.previewLoaded = await page.locator('img[alt="Ảnh xem trước trước khi đăng"]').isVisible();
  await formTitle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}\\thptbb-12-form-filled.png` });

  const gallery = page.getByText('Kho ảnh kỷ niệm từ mọi người');
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}\\thptbb-13-gallery-empty.png` });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  results.desktopLegend = await page.getByText('khám phá').last().isVisible();
  await page.screenshot({ path: `${OUT}\\thptbb-14-desktop-gate.png` });

  await context.close();

  // ---------------- MOBILE ----------------
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', (e) => errors.push(`mobile: ${e.message}`));
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForSelector('canvas');
  await mobile.waitForTimeout(2200);
  await dismissHint(mobile);

  const down = mobile.locator('button[aria-label="Đi xuống"]');
  await down.dispatchEvent('pointerdown', { pointerId: 3, pointerType: 'touch', isPrimary: true });
  await mobile.waitForTimeout(700);
  await down.dispatchEvent('pointerup', { pointerId: 3, pointerType: 'touch', isPrimary: true });
  await mobile.waitForTimeout(700);
  await mobile.screenshot({ path: `${OUT}\\thptbb-15-mobile-prompt.png` });

  // Kiểm tra khoảng cách dọc giữa nút khám phá và D-Pad.
  const prompt = mobile.locator('button[aria-label^="Khám phá"]');
  if (await prompt.count()) {
    const pb = await prompt.boundingBox();
    const db = await mobile.locator('[role="group"][aria-label="Điều khiển di chuyển nhân vật"]').boundingBox();
    results.promptBox = pb;
    results.dpadBox = db;
    results.gap = pb && db ? Math.round(db.y - (pb.y + pb.height)) : null;
    await prompt.click({ force: true });
    await mobile.waitForTimeout(1200);
    await mobile.screenshot({ path: `${OUT}\\thptbb-16-mobile-modal-top.png` });
    await mobile.getByText('Đăng ảnh kỷ niệm của bạn').scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(500);
    await mobile.screenshot({ path: `${OUT}\\thptbb-17-mobile-form.png` });
    await mobile.getByText('Kho ảnh kỷ niệm từ mọi người').scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(500);
    await mobile.screenshot({ path: `${OUT}\\thptbb-18-mobile-gallery.png` });
  }

  await mobileContext.close();
} catch (error) {
  errors.push(`FLOW: ${error.message}`);
  console.error(error);
} finally {
  await browser.close();
}

console.log(JSON.stringify({ results, errors }, null, 2));
