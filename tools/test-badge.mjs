import { chromium } from 'playwright';

async function testHeroBadge() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const pages = [
    { url: 'http://127.0.0.1:3000/contact/', name: 'Contact Us' },
    { url: 'http://127.0.0.1:3000/about/', name: 'About Us' },
    { url: 'http://127.0.0.1:3000/it-services/', name: 'IT Solutions' },
    { url: 'http://127.0.0.1:3000/training/', name: 'Training Solutions' }
  ];

  for (const p of pages) {
    console.log(`\n=== Testing Hero Badge on ${p.name} ===`);
    await page.goto(p.url, { waitUntil: 'networkidle' });
    
    // Check Desktop EN
    const badge = page.locator('.hero-visual__badge');
    const badgeCount = await badge.count();
    console.log(`- Badge count: ${badgeCount}`);
    if (badgeCount > 0) {
      const isVisible = await badge.isVisible();
      const box = await badge.boundingBox();
      console.log(`- Desktop EN Visible: ${isVisible}, Box: w=${Math.round(box.width)}, h=${Math.round(box.height)}, x=${Math.round(box.x)}, y=${Math.round(box.y)}`);
    }

    // Toggle AR
    const switchBtn = page.locator('#langSwitch');
    if (await switchBtn.count() > 0) {
      await switchBtn.click();
      await page.waitForTimeout(300);
      const isVisibleAR = await badge.isVisible();
      const boxAR = await badge.boundingBox();
      console.log(`- Desktop AR Visible: ${isVisibleAR}, Box: w=${Math.round(boxAR.width)}, h=${Math.round(boxAR.height)}`);
    }

    // Mobile Viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const isVisibleMobile = await badge.isVisible();
    const boxMobile = await badge.boundingBox();
    console.log(`- Mobile AR (390px) Visible: ${isVisibleMobile}, Box: w=${Math.round(boxMobile.width)}, h=${Math.round(boxMobile.height)}`);
    
    // Reset Viewport
    await page.setViewportSize({ width: 1440, height: 900 });
  }

  await browser.close();
  console.log('\nAll badge tests completed successfully!');
}

testHeroBadge().catch(err => {
  console.error('Error during badge test:', err);
  process.exit(1);
});
