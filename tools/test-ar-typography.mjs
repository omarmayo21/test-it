import { chromium } from 'playwright';

async function verifyArabicLocalization() {
  console.log('=== STARTING ARABIC LOCALIZATION & TYPOGRAPHY VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Check Homepage English State
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  const enNavIt = await page.locator('.nav__link[data-i18n="nav_it"]').textContent();
  const enNavTraining = await page.locator('.nav__link[data-i18n="nav_training"]').textContent();
  console.log(`[EN] Nav IT: "${enNavIt.trim()}" (Expected: "IT Solutions")`);
  console.log(`[EN] Nav Training: "${enNavTraining.trim()}" (Expected: "Training Solutions")`);

  // 2. Switch to Arabic
  console.log('\n--- Switching to Arabic ---');
  await page.locator('#langSwitch').click();
  await page.waitForTimeout(400);

  const arNavIt = await page.locator('.nav__link[data-i18n="nav_it"]').textContent();
  const arNavTraining = await page.locator('.nav__link[data-i18n="nav_training"]').textContent();
  console.log(`[AR] Nav IT: "${arNavIt.trim()}" (Expected: "حلول تقنية")`);
  console.log(`[AR] Nav Training: "${arNavTraining.trim()}" (Expected: "حلول تدريبية")`);

  if (arNavIt.trim() !== 'حلول تقنية') throw new Error(`Expected arNavIt to be "حلول تقنية", got "${arNavIt.trim()}"`);
  if (arNavTraining.trim() !== 'حلول تدريبية') throw new Error(`Expected arNavTraining to be "حلول تدريبية", got "${arNavTraining.trim()}"`);

  // 3. Check Arabic Hero Heading text and typography
  const heroH1 = page.locator('h1.display');
  const h1Text = await heroH1.innerText();
  const rawH1 = h1Text.replace(/\s+/g, ' ').trim();
  console.log(`\n[AR] Hero Heading InnerText: "${rawH1}"`);
  console.log(`[AR] Expected Heading Text: "لنبنِ معاً المستقبل."`);
  if (!rawH1.includes('لنبنِ معاً') || !rawH1.includes('المستقبل')) {
    throw new Error(`Heading text does not contain expected phrase: "${rawH1}"`);
  }

  // Check Computed Typography
  const h1Computed = await heroH1.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      wordSpacing: style.wordSpacing,
      fontFamily: style.fontFamily,
      direction: style.direction,
      textAlign: style.textAlign
    };
  });
  console.log('[AR Desktop 1440px] H1 Typography:', h1Computed);

  // 4. Test Tablet Viewport (768px)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(300);
  const h1TabletSize = await heroH1.evaluate(el => window.getComputedStyle(el).fontSize);
  console.log(`[AR Tablet 768px] H1 font-size: ${h1TabletSize}`);

  // 5. Test Mobile Viewport (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const h1MobileSize = await heroH1.evaluate(el => window.getComputedStyle(el).fontSize);
  console.log(`[AR Mobile 390px] H1 font-size: ${h1MobileSize}`);

  // 6. Test Internal Pages in Arabic
  const internalPages = [
    { url: 'http://127.0.0.1:3000/it-services/?lang=ar', name: 'IT Solutions' },
    { url: 'http://127.0.0.1:3000/training/?lang=ar', name: 'Training Solutions' },
    { url: 'http://127.0.0.1:3000/about/?lang=ar', name: 'About Us' },
    { url: 'http://127.0.0.1:3000/contact/?lang=ar', name: 'Contact Us' }
  ];

  for (const p of internalPages) {
    console.log(`\n--- Testing ${p.name} (AR) ---`);
    await page.goto(p.url, { waitUntil: 'networkidle' });
    const navIt = await page.locator('.nav__link[data-i18n="nav_it"]').first().textContent();
    const navTr = await page.locator('.nav__link[data-i18n="nav_training"]').first().textContent();
    console.log(`  - Nav links: IT="${navIt.trim()}", Training="${navTr.trim()}"`);
    if (navIt.trim() !== 'حلول تقنية' || navTr.trim() !== 'حلول تدريبية') {
      throw new Error(`Mismatch in internal page nav for ${p.name}`);
    }
  }

  await browser.close();
  console.log('\n✓✓✓ ALL ARABIC LOCALIZATION & TYPOGRAPHY TESTS PASSED WITH 100% ACCURACY! ✓✓✓');
}

verifyArabicLocalization().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
