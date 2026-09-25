import { chromium } from 'playwright';

async function runCompleteTestSuite() {
  console.log('================================================================');
  console.log('SOLUTIONS CASTLE — COMPREHENSIVE VERIFICATION & AUDIT SUITE');
  console.log('================================================================\n');

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  let totalErrors = 0;

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: LANDING PAGE — FORK & GATE INTERACTIVE CLICKABILITY & CTAS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('─── TEST 1: Landing Page (Fork, Gates, SlideTabs & CTAs) ───');
  const landingPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const landingErrs = [];
  landingPage.on('pageerror', err => landingErrs.push(err.message));
  landingPage.on('console', msg => { if (msg.type() === 'error') landingErrs.push(msg.text()); });

  await landingPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await landingPage.waitForTimeout(600);

  // 1.1 Verify SlideTabs pill on landing page
  const pillExists = await landingPage.$eval('#navPill', el => !!el).catch(() => false);
  console.log(`  - Nav pill element present: ${pillExists ? '✓' : '✗'}`);
  if (!pillExists) totalErrors++;

  const activeLink = await landingPage.$eval('#navLinks .nav__link.is-current', el => el.getAttribute('href')).catch(() => null);
  console.log(`  - Active nav item on home: "${activeLink}" (Expected: "/") ${activeLink === '/' ? '✓' : '✗'}`);
  if (activeLink !== '/') totalErrors++;

  // 1.2 Test SlideTabs hover and leave interaction
  const pillInitialTransform = await landingPage.$eval('#navPill', el => el.style.transform);
  await landingPage.hover('#navLinks .nav__link[href="/it-services/"]');
  await landingPage.waitForTimeout(400);
  const pillHoverTransform = await landingPage.$eval('#navPill', el => el.style.transform);
  const hoverWorked = pillHoverTransform !== pillInitialTransform;
  console.log(`  - SlideTabs pill smoothly tracked hover to IT Services: ${hoverWorked ? '✓' : '✗'}`);
  if (!hoverWorked) totalErrors++;

  // Leave nav container
  await landingPage.mouse.move(0, 500);
  await landingPage.waitForTimeout(500);
  const homeLinkLeft = await landingPage.evaluate(() => {
    const p = document.getElementById('navPill');
    const home = document.querySelector('#navLinks .nav__link.is-current');
    const pRect = p.getBoundingClientRect();
    const hRect = home.getBoundingClientRect();
    return {
      pLeft: Math.round(pRect.left),
      hLeft: Math.round(hRect.left),
      diff: Math.abs(pRect.left - hRect.left)
    };
  });
  const returnedToActive = homeLinkLeft.diff <= 2;
  console.log(`  - SlideTabs pill returned to Home on mouseleave: ${returnedToActive ? '✓' : '✗'}`);
  if (!returnedToActive) totalErrors++;

  // 1.3 Verify Fork A & Fork B Semantic Links and Clickability
  const forkSides = await landingPage.evaluate(() => {
    const sides = Array.from(document.querySelectorAll('.fork .fork__side'));
    return sides.map(s => ({
      tagName: s.tagName.toLowerCase(),
      href: s.getAttribute('href'),
      text: s.innerText
    }));
  });

  console.log(`  - Fork sides count: ${forkSides.length} (Expected: 2)`);
  if (forkSides.length !== 2) totalErrors++;

  const forkAOk = forkSides[0]?.tagName === 'a' && forkSides[0]?.href === '/it-services/';
  const forkBOk = forkSides[1]?.tagName === 'a' && forkSides[1]?.href === '/training/';
  console.log(`  - Fork A is link -> /it-services/: ${forkAOk ? '✓' : '✗'}`);
  console.log(`  - Fork B is link -> /training/: ${forkBOk ? '✓' : '✗'}`);
  if (!forkAOk || !forkBOk) totalErrors++;

  // Click Test Fork A (Scroll to Section 3)
  console.log('  - Scrolling to Section 3 (What We Do)...');
  await landingPage.evaluate(() => window.scrollTo(0, window.__SC.tops[2]));
  await landingPage.waitForTimeout(600);

  console.log('  - Testing click on Fork A...');
  await landingPage.click('.fork .fork__side:first-child');
  await landingPage.waitForURL('**/it-services/');
  console.log(`    Successfully navigated to: ${landingPage.url()} ✓`);

  // Return to home and scroll to Section 3 for Fork B
  await landingPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await landingPage.waitForTimeout(400);
  await landingPage.evaluate(() => window.scrollTo(0, window.__SC.tops[2]));
  await landingPage.waitForTimeout(600);

  console.log('  - Testing click on Fork B...');
  await landingPage.click('.fork .fork__side--r');
  await landingPage.waitForURL('**/training/');
  console.log(`    Successfully navigated to: ${landingPage.url()} ✓`);

  // Return to home
  await landingPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await landingPage.waitForTimeout(400);

  // 1.4 Verify Gate 01 & Gate 02 Semantic Links and Clickability
  const gateItems = await landingPage.evaluate(() => {
    const gates = Array.from(document.querySelectorAll('.gates .gate'));
    const core = document.querySelector('.gates .gate__core');
    return {
      gates: gates.map(g => ({
        tagName: g.tagName.toLowerCase(),
        href: g.getAttribute('href')
      })),
      coreIsSpan: core?.tagName.toLowerCase() === 'span' && !core.hasAttribute('href')
    };
  });

  const gate1Ok = gateItems.gates[0]?.tagName === 'a' && gateItems.gates[0]?.href === '/it-services/';
  const gate2Ok = gateItems.gates[1]?.tagName === 'a' && gateItems.gates[1]?.href === '/training/';
  console.log(`  - Gate 01 is link -> /it-services/: ${gate1Ok ? '✓' : '✗'}`);
  console.log(`  - Gate 02 is link -> /training/: ${gate2Ok ? '✓' : '✗'}`);
  console.log(`  - Central SO Core is non-clickable decorative element: ${gateItems.coreIsSpan ? '✓' : '✗'}`);
  if (!gate1Ok || !gate2Ok || !gateItems.coreIsSpan) totalErrors++;

  // Click Test Gate 01 (Scroll to Section 9)
  console.log('  - Scrolling to Section 9 (Two Destinations)...');
  await landingPage.evaluate(() => window.scrollTo(0, window.__SC.tops[8]));
  await landingPage.waitForTimeout(600);

  console.log('  - Testing click on Gate 01...');
  await landingPage.click('.gates .gate:first-child');
  await landingPage.waitForURL('**/it-services/');
  console.log(`    Successfully navigated to: ${landingPage.url()} ✓`);

  // Return to home and scroll to Section 9 for Gate 02
  await landingPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await landingPage.waitForTimeout(400);
  await landingPage.evaluate(() => window.scrollTo(0, window.__SC.tops[8]));
  await landingPage.waitForTimeout(600);

  console.log('  - Testing click on Gate 02...');
  await landingPage.click('.gates .gate--r');
  await landingPage.waitForURL('**/training/');
  console.log(`    Successfully navigated to: ${landingPage.url()} ✓`);

  await landingPage.close();

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: INTERNAL PAGES NAVBAR, FOOTER & CLICK-THROUGH FLOWS
  // ──────────────────────────────────────────────────────────────────────────
  const internalPages = [
    { path: '/about/', name: 'About Us', activeHref: '/about/' },
    { path: '/it-services/', name: 'IT Services', activeHref: '/it-services/' },
    { path: '/training/', name: 'Training', activeHref: '/training/' },
    { path: '/contact/', name: 'Contact', activeHref: '/contact/' }
  ];

  for (const pInfo of internalPages) {
    console.log(`\n─── TEST 2: ${pInfo.name} (${pInfo.path}) ───`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const pageErrs = [];
    page.on('pageerror', err => pageErrs.push(err.message));
    page.on('console', msg => { if (msg.type() === 'error') pageErrs.push(msg.text()); });

    await page.goto(`http://127.0.0.1:3000${pInfo.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // 2.1 Verify Shared Navbar is present
    const navExists = await page.$eval('header#nav .nav__links#navLinks', el => !!el).catch(() => false);
    console.log(`  - Global Navbar present on ${pInfo.name}: ${navExists ? '✓' : '✗'}`);
    if (!navExists) totalErrors++;

    // 2.2 Check SlideTabs Active Link
    const active = await page.$eval('#navLinks .nav__link.is-current', el => el.getAttribute('href')).catch(() => null);
    console.log(`  - SlideTabs active link: "${active}" (Expected: "${pInfo.activeHref}") ${active === pInfo.activeHref ? '✓' : '✗'}`);
    if (active !== pInfo.activeHref) totalErrors++;

    // 2.3 Check SlideTabs pill position
    const pill = await page.evaluate(() => {
      const p = document.getElementById('navPill');
      const cur = document.querySelector('#navLinks .nav__link.is-current');
      if (!p || !cur) return null;
      const pRect = p.getBoundingClientRect();
      const cRect = cur.getBoundingClientRect();
      return {
        pillLeft: Math.round(pRect.left),
        curLeft: Math.round(cRect.left),
        pillWidth: Math.round(pRect.width),
        curWidth: Math.round(cRect.width)
      };
    });
    const pillAligned = pill && Math.abs(pill.pillLeft - pill.curLeft) <= 2 && Math.abs(pill.pillWidth - pill.curWidth) <= 2;
    console.log(`  - SlideTabs pill perfectly aligned with active link: ${pillAligned ? '✓' : '✗'}`);
    if (!pillAligned) totalErrors++;

    // 2.4 Test Navbar cross-page clicking
    if (pInfo.path === '/it-services/') {
      console.log('  - Testing Navbar click from IT Services -> Training...');
      await page.click('#navLinks .nav__link[href="/training/"]');
      await page.waitForURL('**/training/');
      console.log(`    Successfully navigated to Training: ${page.url()} ✓`);

      console.log('  - Testing Navbar click from Training -> About Us...');
      await page.click('#navLinks .nav__link[href="/about/"]');
      await page.waitForURL('**/about/');
      console.log(`    Successfully navigated to About Us: ${page.url()} ✓`);

      console.log('  - Testing Navbar click from About Us -> Contact...');
      await page.click('#navLinks .nav__link[href="/contact/"]');
      await page.waitForURL('**/contact/');
      console.log(`    Successfully navigated to Contact: ${page.url()} ✓`);

      // Go back to current page for remaining checks
      await page.goto(`http://127.0.0.1:3000${pInfo.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
    }

    // 2.5 Check Footer Layout & Computed Styling
    const footerStyles = await page.evaluate(() => {
      const footer = document.querySelector('footer.footer');
      const inner = document.querySelector('.footer__inner');
      const cols = document.querySelector('.footer__cols');
      const brandLogo = document.querySelector('.footer__brand img');
      if (!footer || !inner || !cols) return null;
      const fStyle = window.getComputedStyle(footer);
      const innerStyle = window.getComputedStyle(inner);
      const colsStyle = window.getComputedStyle(cols);
      return {
        footerDisplay: fStyle.display,
        innerDisplay: innerStyle.display,
        colsDisplay: colsStyle.display,
        hasLogo: !!brandLogo && brandLogo.getAttribute('src').includes('logo-clear.png')
      };
    });

    console.log(`  - Footer computed layout: display=${footerStyles?.footerDisplay}, inner=${footerStyles?.innerDisplay}, cols=${footerStyles?.colsDisplay} ${footerStyles?.colsDisplay === 'grid' ? '✓' : '✗'}`);
    console.log(`  - Footer brand logo present & standard: ${footerStyles?.hasLogo ? '✓' : '✗'}`);
    if (footerStyles?.colsDisplay !== 'grid' || !footerStyles?.hasLogo) totalErrors++;

    // 2.6 Check Footer Quick Links Destinations
    const footerLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.footer__col:first-child a.footer__link'));
      return links.map(a => ({ href: a.getAttribute('href'), text: a.textContent.trim() }));
    });
    console.log(`  - Footer Quick Links count: ${footerLinks.length} (Expected: 6)`);
    const expectedHrefs = ['/', '/about/', '/it-services/', '/training/', '/#section-7', '/contact/'];
    let quickLinksOk = footerLinks.length === 6;
    footerLinks.forEach((l, idx) => {
      if (l.href !== expectedHrefs[idx]) quickLinksOk = false;
    });
    console.log(`  - Footer Quick Links destinations verified: ${quickLinksOk ? '✓' : '✗'}`);
    if (!quickLinksOk) totalErrors++;

    // 2.7 Test Bilingual Switch in Footer and RTL Adaptation
    await page.click('#langSwitch [data-lang="ar"]');
    await page.waitForTimeout(350);

    const isRtl = await page.$eval('html', el => el.getAttribute('dir') === 'rtl' && el.getAttribute('lang') === 'ar');
    const arQuickLinksTitle = await page.$eval('.footer__col-title', el => el.textContent.trim());
    console.log(`  - Switched to Arabic: dir=rtl ${isRtl ? '✓' : '✗'}, Footer title in Arabic: "${arQuickLinksTitle}" ${arQuickLinksTitle === 'روابط سريعة' ? '✓' : '✗'}`);
    if (!isRtl || arQuickLinksTitle !== 'روابط سريعة') totalErrors++;

    // 2.8 Check SlideTabs pill alignment in RTL
    const pillRtl = await page.evaluate(() => {
      const p = document.getElementById('navPill');
      const cur = document.querySelector('#navLinks .nav__link.is-current');
      if (!p || !cur) return null;
      const pRect = p.getBoundingClientRect();
      const cRect = cur.getBoundingClientRect();
      return {
        diffLeft: Math.abs(pRect.left - cRect.left),
        diffWidth: Math.abs(pRect.width - cRect.width)
      };
    });
    const pillRtlAligned = pillRtl && pillRtl.diffLeft <= 2 && pillRtl.diffWidth <= 2;
    console.log(`  - SlideTabs pill in Arabic RTL perfectly aligned: ${pillRtlAligned ? '✓' : '✗'}`);
    if (!pillRtlAligned) totalErrors++;

    // Switch back to EN
    await page.click('#langSwitch [data-lang="en"]');
    await page.waitForTimeout(300);

    if (pageErrs.length > 0) {
      console.log(`  - Page Console/Runtime Errors:`, pageErrs);
      totalErrors += pageErrs.length;
    }

    await page.close();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: MOBILE & TABLET VIEWPORT VERIFICATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n─── TEST 3: Mobile & Tablet Viewport Verification ───');
  const viewports = [
    { width: 375, height: 667, name: 'Mobile (375x667)' },
    { width: 768, height: 1024, name: 'Tablet (768x1024)' }
  ];

  for (const vp of viewports) {
    console.log(`Testing ${vp.name}...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://127.0.0.1:3000/it-services/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Verify burger is visible on mobile/tablet
    const burgerVisible = await page.$eval('#burger', el => window.getComputedStyle(el).display !== 'none');
    console.log(`  - Burger button visible: ${burgerVisible ? '✓' : '✗'}`);
    if (!burgerVisible) totalErrors++;

    // Open mobile menu
    await page.click('#burger');
    await page.waitForTimeout(350);
    const menuOpen = await page.$eval('#menu', el => el.classList.contains('is-open') && !el.hidden);
    console.log(`  - Mobile menu opened cleanly: ${menuOpen ? '✓' : '✗'}`);
    if (!menuOpen) totalErrors++;

    // Click link from mobile drawer
    console.log('  - Clicking Training in mobile drawer...');
    await page.click('#menu .menu__nav a[href="/training/"]');
    await page.waitForURL('**/training/');
    console.log(`    Mobile drawer navigated to: ${page.url()} ✓`);

    await page.close();
  }

  await browser.close();

  console.log('\n================================================================');
  console.log(`TEST SUITE COMPLETED WITH ${totalErrors} TOTAL ERRORS.`);
  console.log('================================================================');
  process.exit(totalErrors === 0 ? 0 : 1);
}

runCompleteTestSuite().catch(err => {
  console.error('Test Suite Failed with Exception:', err);
  process.exit(1);
});
