import { chromium } from 'playwright';
import fs from 'fs';

async function testHeroResponsive() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1366', width: 1366, height: 768 },
    { name: 'tablet-834', width: 834, height: 1112 },
    { name: 'mobile-390', width: 390, height: 844 },
  ];

  console.log('================================================================');
  console.log('HERO RESPONSIVE MEASUREMENTS & VISUAL VERIFICATION');
  console.log('================================================================\n');

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const display = document.querySelector('.display');
      const lede = document.querySelector('.lede');
      const ctaRow = document.querySelector('.cta-row');
      const cue = document.getElementById('cue');
      const meta = document.querySelector('.hero__meta');
      const panel = document.querySelector('.panel');

      const heroRect = hero.getBoundingClientRect();
      const displayRect = display.getBoundingClientRect();
      const ledeRect = lede.getBoundingClientRect();
      const ctaRect = ctaRow.getBoundingClientRect();
      const cueRect = cue ? cue.getBoundingClientRect() : null;
      const metaRect = meta ? meta.getBoundingClientRect() : null;

      const displayStyle = window.getComputedStyle(display);
      const ledeStyle = window.getComputedStyle(lede);

      return {
        viewportH: window.innerHeight,
        viewportW: window.innerWidth,
        hero: { top: Math.round(heroRect.top), bottom: Math.round(heroRect.bottom), height: Math.round(heroRect.height) },
        display: {
          fontSize: displayStyle.fontSize,
          lineHeight: displayStyle.lineHeight,
          height: Math.round(displayRect.height),
          width: Math.round(displayRect.width)
        },
        lede: {
          fontSize: ledeStyle.fontSize,
          lineHeight: ledeStyle.lineHeight,
          top: Math.round(ledeRect.top),
          height: Math.round(ledeRect.height),
          gapFromDisplay: Math.round(ledeRect.top - displayRect.bottom)
        },
        cta: {
          top: Math.round(ctaRect.top),
          bottom: Math.round(ctaRect.bottom),
          gapFromLede: Math.round(ctaRect.top - ledeRect.bottom)
        },
        cue: cueRect ? {
          top: Math.round(cueRect.top),
          bottom: Math.round(cueRect.bottom),
          gapFromCta: Math.round(cueRect.top - ctaRect.bottom),
          gapFromViewportBottom: Math.round(window.innerHeight - cueRect.bottom)
        } : null,
        meta: metaRect ? {
          top: Math.round(metaRect.top),
          bottom: Math.round(metaRect.bottom),
          visible: window.getComputedStyle(meta).display !== 'none'
        } : null,
        heroOccupancyPercent: Math.round((heroRect.height / window.innerHeight) * 100)
      };
    });

    console.log(`[${vp.name}] Viewport: ${metrics.viewportW}x${metrics.viewportH}px`);
    console.log(`  - Hero Height: ${metrics.hero.height}px (${metrics.heroOccupancyPercent}% of viewport)`);
    console.log(`  - Title Font: ${metrics.display.fontSize}, Line-Height: ${metrics.display.lineHeight}`);
    console.log(`  - Display Height: ${metrics.display.height}px`);
    console.log(`  - Lede Gap from Display: ${metrics.lede.gapFromDisplay}px`);
    console.log(`  - CTA Gap from Lede: ${metrics.cta.gapFromLede}px`);
    if (metrics.cue) {
      console.log(`  - Scroll Cue Gap from CTA: ${metrics.cue.gapFromCta}px`);
      console.log(`  - Scroll Cue from Viewport Bottom: ${metrics.cue.gapFromViewportBottom}px`);
    }
    console.log('----------------------------------------------------------------');

    await page.screenshot({ path: `shots/hero-${vp.name}.png` });
    await page.close();
  }

  await browser.close();
  console.log('\nAll screenshots saved to shots/hero-*.png');
}

testHeroResponsive();
