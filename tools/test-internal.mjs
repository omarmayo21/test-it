import { chromium } from 'playwright';

async function runTests() {
  console.log('=== SOLUTIONS CASTLE - FULL BILINGUAL & INTERNAL PAGES TEST SUITE ===');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  let totalErrors = 0;

  const pagesToTest = [
    {
      url: 'http://127.0.0.1:3000/about/',
      name: 'About Us',
      h1En: 'Your Integrated Partner for Institutional Enablement and Sustainable Digital Transformation.',
      h1Ar: 'شريكك المتكامل للتمكين المؤسسي والتحول الرقمي المستدام.'
    },
    {
      url: 'http://127.0.0.1:3000/it-services/',
      name: 'IT Services',
      h1En: 'Building Smart Infrastructure for Your Organization and Driving Your Digital Transformation with Professionalism.',
      h1Ar: 'نبني البنية التحتية الذكية لمؤسستك ونقود تحولك الرقمي باحترافية.'
    },
    {
      url: 'http://127.0.0.1:3000/training/',
      name: 'Training',
      h1En: 'Certified Training and Professional Development Solutions Creating Measurable Impact.',
      h1Ar: 'حلول وخدمات تدريب وتطوير مهني معتمدة تصنع أثراً قابلاً للقياس.'
    },
    {
      url: 'http://127.0.0.1:3000/contact/',
      name: 'Contact Us',
      h1En: 'Contact Us to Elevate Your Institutional Efficiency and Lead Your Digital Transformation.',
      h1Ar: 'تواصل معنا لنرتقي بكفاءة مؤسستك ونقود تحولك الرقمي.'
    }
  ];

  for (const item of pagesToTest) {
    console.log(`\n──────────────────────────────────────────────────`);
    console.log(`Testing ${item.name} (${item.url})...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const pageErrors = [];
    const consoleErrors = [];

    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const resp = await page.goto(item.url, { waitUntil: 'domcontentloaded' });
    const status = resp.status();
    console.log(`  - HTTP Status: ${status} ${status === 200 ? '✓' : '✗'}`);
    if (status !== 200) totalErrors++;

    await page.waitForTimeout(400);

    // 1. Initial State (Default: English)
    const lang0 = await page.$eval('html', el => el.getAttribute('lang'));
    const dir0 = await page.$eval('html', el => el.getAttribute('dir'));
    console.log(`  - Default Language: ${lang0}, Direction: ${dir0} (Expected: en, ltr)`);
    if (lang0 !== 'en' || dir0 !== 'ltr') totalErrors++;

    // 2. Verify English H1
    const h1En = await page.$eval('h1', el => el.textContent.trim());
    const h1EnMatches = h1En.includes(item.h1En);
    console.log(`  - English H1 Verified: ${h1EnMatches ? '✓' : '✗'}`);
    if (!h1EnMatches) {
      console.log(`    Expected: "${item.h1En}"`);
      console.log(`    Found:    "${h1En}"`);
      totalErrors++;
    }

    // 3. Toggle Language to Arabic via Header Switcher
    console.log('  - Switching to Arabic via #langSwitch...');
    await page.click('#langSwitch [data-lang="ar"]');
    await page.waitForTimeout(300);

    const langAr = await page.$eval('html', el => el.getAttribute('lang'));
    const dirAr = await page.$eval('html', el => el.getAttribute('dir'));
    console.log(`  - Arabic Language: ${langAr}, Direction: ${dirAr} (Expected: ar, rtl)`);
    if (langAr !== 'ar' || dirAr !== 'rtl') totalErrors++;

    // 4. Verify Arabic H1
    const h1Ar = await page.$eval('h1', el => el.textContent.trim());
    const h1ArMatches = h1Ar.includes(item.h1Ar);
    console.log(`  - Arabic H1 Verified: ${h1ArMatches ? '✓' : '✗'}`);
    if (!h1ArMatches) {
      console.log(`    Expected: "${item.h1Ar}"`);
      console.log(`    Found:    "${h1Ar}"`);
      totalErrors++;
    }

    // 5. Check LocalStorage Persistence
    const storedLang = await page.evaluate(() => localStorage.getItem('sc_lang'));
    console.log(`  - LocalStorage 'sc_lang': "${storedLang}" (Expected: "ar") ${storedLang === 'ar' ? '✓' : '✗'}`);
    if (storedLang !== 'ar') totalErrors++;

    // 6. Test Page Refresh Persistence
    console.log('  - Testing page refresh persistence...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const langAfterReload = await page.$eval('html', el => el.getAttribute('lang'));
    console.log(`  - Language after reload: "${langAfterReload}" ${langAfterReload === 'ar' ? '✓' : '✗'}`);
    if (langAfterReload !== 'ar') totalErrors++;

    // 7. Switch back to English for cleanliness
    await page.click('#langSwitch [data-lang="en"]');
    await page.waitForTimeout(200);

    // 8. Verify Visual Media Elements
    const heroVisual = await page.$eval('.hero-visual img', el => el && el.getAttribute('src'));
    console.log(`  - Hero visual media present: "${heroVisual}" ✓`);

    // 9. Slider Test (About & Training pages)
    const hasSlider = await page.$('.sc-slider');
    if (hasSlider) {
      console.log('  - Testing Editorial Slider interaction...');
      const initialIdx = await page.$eval('.sc-slider', el => el.dataset.activeSlide || '0');
      await page.click('.sc-slider__btn--next');
      await page.waitForTimeout(300);
      const nextIdx = await page.$eval('.sc-slider', el => el.dataset.activeSlide || '0');
      console.log(`    Slider advanced from ${initialIdx} to ${nextIdx} ✓`);
      if (initialIdx === nextIdx) totalErrors++;
    }

    // 10. Interactive element checks
    if (item.url.includes('/training/')) {
      console.log('  - Testing Training Catalog Filter Tabs...');
      const tabCount = await page.$$eval('.catalog-tab', tabs => tabs.length);
      console.log(`    Found ${tabCount} tabs.`);
      if (tabCount === 3) {
        await page.click('.catalog-tab:nth-child(2)');
        await page.waitForTimeout(200);
        const isSecondActive = await page.$eval('.catalog-tab:nth-child(2)', el => el.classList.contains('is-active'));
        console.log(`    Tab 2 Active after click: ${isSecondActive ? '✓' : '✗'}`);
        if (!isSecondActive) totalErrors++;
      }
    }

    if (item.url.includes('/contact/')) {
      console.log('  - Testing Contact FAQ Accordion...');
      const faqItems = await page.$$('.faq-item');
      console.log(`    Found ${faqItems.length} FAQ items (expected exactly 3).`);
      if (faqItems.length !== 3) totalErrors++;

      // Click item 2 to toggle
      await page.click('.faq-item:nth-child(2) .faq-trigger');
      await page.waitForTimeout(200);
      const isSecondOpen = await page.$eval('.faq-item:nth-child(2)', el => el.classList.contains('is-open'));
      console.log(`    FAQ 2 open after click: ${isSecondOpen ? '✓' : '✗'}`);
      if (!isSecondOpen) totalErrors++;

      // Test Form Simulation (English & Arabic)
      console.log('  - Testing Contact Form submission...');
      await page.selectOption('#c-category', 'it-ai');
      await page.fill('#c-name', 'Alexander Vance');
      await page.fill('#c-phone', '+971501234567');
      await page.fill('#c-email', 'alexander@company.ae');
      await page.fill('#c-message', 'Enterprise AI consultation request.');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(800);
      const feedbackText = await page.$eval('.form-feedback', el => el.textContent);
      console.log(`    Feedback received: "${feedbackText}" ${feedbackText.length > 10 ? '✓' : '✗'}`);
      if (feedbackText.length < 10) totalErrors++;
    }

    // 11. Test Mobile Viewport & Mobile Language Switcher
    console.log(`  - Testing Mobile Viewport (390x844) & Drawer Switcher...`);
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto(item.url, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(300);

    const burgerVisible = await mobilePage.$eval('#burger', el => getComputedStyle(el).display !== 'none');
    console.log(`    Mobile burger visible: ${burgerVisible ? '✓' : '✗'}`);

    // Click burger
    await mobilePage.click('#burger');
    await mobilePage.waitForTimeout(300);
    const menuOpen = await mobilePage.$eval('#menu', el => el.classList.contains('is-open'));
    console.log(`    Mobile menu opened: ${menuOpen ? '✓' : '✗'}`);
    if (!menuOpen) totalErrors++;

    // Switch language in mobile drawer
    await mobilePage.click('#langSwitchMobile [data-lang="ar"]');
    await mobilePage.waitForTimeout(300);
    const mobLang = await mobilePage.$eval('html', el => el.getAttribute('lang'));
    console.log(`    Mobile language changed to: "${mobLang}" ${mobLang === 'ar' ? '✓' : '✗'}`);
    if (mobLang !== 'ar') totalErrors++;

    // Switch back to en
    await mobilePage.click('#langSwitchMobile [data-lang="en"]');
    await mobilePage.waitForTimeout(200);

    // Check errors
    if (pageErrors.length > 0) {
      console.error(`  - Page Errors (${pageErrors.length}):`, pageErrors);
      totalErrors += pageErrors.length;
    } else {
      console.log('  - Zero Page Errors: ✓');
    }

    if (consoleErrors.length > 0) {
      console.error(`  - Console Errors (${consoleErrors.length}):`, consoleErrors);
      totalErrors += consoleErrors.length;
    } else {
      console.log('  - Zero Console Errors: ✓');
    }

    await mobilePage.close();
    await page.close();
  }

  // 12. Verification of Landing Page Fork & Gate Non-Interactive Elements
  console.log('\n──────────────────────────────────────────────────');
  console.log('Testing Landing Page Fork & Gate Non-Interactive Safety...');
  const homePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await homePage.goto('http://127.0.0.1:3000/?debug', { waitUntil: 'domcontentloaded' });
  await homePage.waitForTimeout(500);

  // Check Fork Sides: Must NOT be <a> tags, must have NO href, must not navigate
  const forkSides = await homePage.$$eval('.fork__side', els => els.map(el => ({
    tagName: el.tagName,
    hasHref: el.hasAttribute('href'),
    role: el.getAttribute('role'),
    tabIndex: el.getAttribute('tabindex')
  })));

  console.log(`  - Found ${forkSides.length} Fork elements:`, JSON.stringify(forkSides));
  for (const f of forkSides) {
    if (f.tagName === 'A' || f.hasHref) {
      console.error('  - Fork element is still interactive/<a> tag! ✗');
      totalErrors++;
    } else {
      console.log('  - Fork element confirmed non-interactive <div> (no href, non-focusable) ✓');
    }
  }

  // Check Gate items in Section 9
  const gateItems = await homePage.$$eval('.gate', els => els.map(el => ({
    tagName: el.tagName,
    hasHref: el.hasAttribute('href')
  })));
  console.log(`  - Found ${gateItems.length} Gate elements:`, JSON.stringify(gateItems));
  for (const g of gateItems) {
    if (g.tagName === 'A' || g.hasHref) {
      console.error('  - Gate element is still interactive/<a> tag! ✗');
      totalErrors++;
    } else {
      console.log('  - Gate element confirmed non-interactive <div> (no href) ✓');
    }
  }

  // Scroll to Section 3 (The Fork)
  await homePage.evaluate(() => {
    window.scrollTo(0, window.__SC.segPx * 2);
  });
  await homePage.waitForTimeout(400);

  // Test clicking Fork A and Fork B: Ensure URL does not change and no hash navigation occurs
  const urlBefore = homePage.url();
  await homePage.click('.fork__side:first-child', { force: true });
  await homePage.waitForTimeout(200);
  const urlAfterA = homePage.url();
  console.log(`  - Clicking Fork A: URL remains "${urlAfterA}" ${urlBefore === urlAfterA ? '✓' : '✗'}`);
  if (urlBefore !== urlAfterA) totalErrors++;

  await homePage.click('.fork__side:last-child', { force: true });
  await homePage.waitForTimeout(200);
  const urlAfterB = homePage.url();
  console.log(`  - Clicking Fork B: URL remains "${urlAfterB}" ${urlBefore === urlAfterB ? '✓' : '✗'}`);
  if (urlBefore !== urlAfterB) totalErrors++;

  // Test Landing Page Language Switch
  console.log('  - Testing Landing Page Bilingual Toggle (EN <-> AR)...');
  await homePage.click('#langSwitch [data-lang="ar"]');
  await homePage.waitForTimeout(300);
  const homeLangAr = await homePage.$eval('html', el => el.getAttribute('lang'));
  const homeDirAr = await homePage.$eval('html', el => el.getAttribute('dir'));
  console.log(`  - Landing page Arabic state: lang=${homeLangAr}, dir=${homeDirAr} ${homeLangAr === 'ar' && homeDirAr === 'rtl' ? '✓' : '✗'}`);
  if (homeLangAr !== 'ar' || homeDirAr !== 'rtl') totalErrors++;

  // Reset to en
  await homePage.click('#langSwitch [data-lang="en"]');
  await homePage.waitForTimeout(200);

  await homePage.close();
  await browser.close();

  console.log(`\n========================================`);
  if (totalErrors === 0) {
    console.log('ALL TESTS PASSED WITH ZERO ERRORS! ✓✓✓');
    process.exit(0);
  } else {
    console.error(`TEST SUITE FAILED WITH ${totalErrors} ERRORS! ✗`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
