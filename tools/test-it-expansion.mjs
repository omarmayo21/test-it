import { chromium } from 'playwright';

async function verifyItExpansion() {
  console.log('=== VERIFYING IT SOLUTIONS EXPANSION & INTERACTION ===');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/it-services/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verify Service Categories Section Exists
  const sectionTitle = await page.$eval('#service-categories .title', el => el.textContent.trim());
  console.log(`- Service Categories Section Title (EN): "${sectionTitle}"`);

  // 2. Count Enterprise Services
  const entCards = await page.$$eval('.ent-service-card', els => els.length);
  console.log(`- Enterprise Services Count: ${entCards} (Expected: 9) ${entCards === 9 ? '✓' : '✗'}`);

  // 3. Count AI Solution Groups
  const aiGroups = await page.$$eval('.ai-group-card', els => els.length);
  console.log(`- AI Solution Groups Count: ${aiGroups} (Expected: 4) ${aiGroups === 4 ? '✓' : '✗'}`);

  // 4. Test Tab Switching
  console.log('- Testing Tab Switching to AI & Automation...');
  await page.click('.svc-tab[data-target-cat="cat-ai"]');
  await page.waitForTimeout(200);

  const entVisible = await page.$eval('#cat-enterprise', el => getComputedStyle(el).display !== 'none');
  const aiVisible = await page.$eval('#cat-ai', el => getComputedStyle(el).display !== 'none');
  console.log(`  Enterprise Block Visible: ${entVisible} (Expected: false), AI Block Visible: ${aiVisible} (Expected: true) ${!entVisible && aiVisible ? '✓' : '✗'}`);

  // 5. Test CTA Click & Form Pre-selection
  console.log('- Testing "Discuss This Solution" CTA preselection...');
  await page.click('.svc-tab[data-target-cat="all"]');
  await page.waitForTimeout(100);

  await page.click('a[data-select-service="crm"]');
  await page.waitForTimeout(300);

  const selectedVal = await page.$eval('#t-service', el => el.value);
  console.log(`  Dropdown value after CTA click: "${selectedVal}" (Expected: "crm") ${selectedVal === 'crm' ? '✓' : '✗'}`);

  // 6. Test Sequence Visual
  const seqHeading = await page.$eval('#foundation-sequence .title', el => el.textContent.trim());
  console.log(`- Visual Sequence Heading (EN): "${seqHeading}"`);
  const stepCount = await page.$$eval('.seq-step-card', els => els.length);
  console.log(`- Visual Sequence Step Count: ${stepCount} (Expected: 4) ${stepCount === 4 ? '✓' : '✗'}`);

  // 7. Test Language Switch to Arabic
  console.log('- Testing Bilingual Language Switch to Arabic...');
  await page.click('#langSwitch [data-lang="ar"]');
  await page.waitForTimeout(300);

  const sectionTitleAr = await page.$eval('#service-categories .title', el => el.textContent.trim());
  const seqHeadingAr = await page.$eval('#foundation-sequence .title', el => el.textContent.trim());
  const htmlLang = await page.$eval('html', el => el.getAttribute('lang'));
  const htmlDir = await page.$eval('html', el => el.getAttribute('dir'));

  console.log(`  Language: ${htmlLang}, Dir: ${htmlDir}`);
  console.log(`  Section Title (AR): "${sectionTitleAr}" (Expected: "فئات الحلول والخدمات")`);
  console.log(`  Sequence Heading (AR): "${seqHeadingAr}" (Expected: "نبني الأساس الرقمي، ثم نمنحه الذكاء والقدرة على التطور.")`);

  const passed = (entCards === 9 && aiGroups === 4 && selectedVal === 'crm' && stepCount === 4 && htmlLang === 'ar' && htmlDir === 'rtl');
  console.log(`\n=== IT EXPANSION VALIDATION: ${passed ? 'ALL CHECKS PASSED ✓' : 'FAILED ✗'} ===`);

  await browser.close();
  process.exit(passed ? 0 : 1);
}

verifyItExpansion().catch(err => {
  console.error(err);
  process.exit(1);
});
