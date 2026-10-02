import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SHOTS_DIR = 'shots/refinements';
fs.mkdirSync(SHOTS_DIR, { recursive: true });

async function runVisualAudit() {
  console.log('=== RUNNING VISUAL AUDIT & PAGE VERIFICATION ===\n');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  let issues = 0;

  const pages = [
    { url: 'http://127.0.0.1:3000/it-services/', name: 'it-services' },
    { url: 'http://127.0.0.1:3000/about/', name: 'about' },
    { url: 'http://127.0.0.1:3000/training/', name: 'training' }
  ];

  for (const p of pages) {
    console.log(`Auditing ${p.name} (${p.url})...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    const failedRequests = [];

    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('requestfailed', req => {
      failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
    });

    await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // 1. Verify images loaded without errors
    const imgAudit = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: Math.round(img.getBoundingClientRect().width),
        renderedHeight: Math.round(img.getBoundingClientRect().height)
      }));
    });

    console.log(`  Found ${imgAudit.length} images:`);
    imgAudit.forEach(img => {
      const ok = img.complete && img.naturalWidth > 0;
      console.log(`    - [${ok ? 'OK' : 'FAIL'}] ${img.src} -> ${img.naturalWidth}x${img.naturalHeight} (rendered ${img.renderedWidth}x${img.renderedHeight}px) | alt="${img.alt}"`);
      if (!ok) issues++;
    });

    // 2. Capture English Desktop Screenshot
    await page.screenshot({ path: path.join(SHOTS_DIR, `${p.name}-en-desktop.png`), fullPage: true });

    // 3. Switch to Arabic and capture RTL Screenshot
    await page.click('#langSwitch [data-lang="ar"]');
    await page.waitForTimeout(300);
    const dir = await page.$eval('html', el => el.getAttribute('dir'));
    console.log(`  Arabic switch direction: ${dir} (expected rtl)`);
    if (dir !== 'rtl') issues++;

    await page.screenshot({ path: path.join(SHOTS_DIR, `${p.name}-ar-desktop.png`), fullPage: true });

    // 4. Test Mobile Viewport
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobilePage.goto(p.url, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(SHOTS_DIR, `${p.name}-en-mobile.png`) });

    // Open mobile menu to switch language
    await mobilePage.click('#burger');
    await mobilePage.waitForTimeout(300);
    await mobilePage.click('#langSwitchMobile [data-lang="ar"]');
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(SHOTS_DIR, `${p.name}-ar-mobile.png`) });

    await mobilePage.close();
    await page.close();

    if (errors.length > 0) {
      console.error(`  Console Errors (${errors.length}):`, errors);
      issues += errors.length;
    } else {
      console.log('  Zero Console / Runtime Errors ✓');
    }

    if (failedRequests.length > 0) {
      console.error(`  Failed Network Requests (${failedRequests.length}):`, failedRequests);
      issues += failedRequests.length;
    } else {
      console.log('  Zero Failed Image / Asset Requests ✓\n');
    }
  }

  await browser.close();
  if (issues === 0) {
    console.log('========================================');
    console.log('VISUAL AUDIT PASSED WITH 0 ISSUES! ✓✓✓');
    process.exit(0);
  } else {
    console.error(`VISUAL AUDIT FOUND ${issues} ISSUES!`);
    process.exit(1);
  }
}

runVisualAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
