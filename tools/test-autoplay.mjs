import { chromium } from 'playwright';

async function testAutoplay() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  
  // Test Autoplay on About Us page
  console.log('Testing About Us Slider Autoplay (scrolling into view, then waiting 5.2s)...');
  const pageAbout = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageAbout.goto('http://127.0.0.1:3000/about/', { waitUntil: 'domcontentloaded' });
  await pageAbout.waitForTimeout(300);
  
  // Scroll slider into view
  await pageAbout.$eval('#aboutSlider', el => el.scrollIntoView());
  await pageAbout.waitForTimeout(300);

  const initialSlideAbout = await pageAbout.$eval('#aboutSlider', el => el.dataset.activeSlide);
  console.log('Initial active slide:', initialSlideAbout);
  
  await pageAbout.waitForTimeout(5200);
  
  const autoSlideAbout = await pageAbout.$eval('#aboutSlider', el => el.dataset.activeSlide);
  console.log('Active slide after 5.2s autoplay:', autoSlideAbout);
  if (autoSlideAbout !== '1') {
    console.error('FAIL: About slider did not advance automatically! Found:', autoSlideAbout);
    process.exit(1);
  }
  console.log('PASS: About Us slider autoplays successfully! ✓');

  // Test Autoplay on Training page
  console.log('\nTesting Training Slider Autoplay (scrolling into view, then waiting 5.2s)...');
  const pageTr = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageTr.goto('http://127.0.0.1:3000/training/', { waitUntil: 'domcontentloaded' });
  await pageTr.waitForTimeout(300);
  
  await pageTr.$eval('#trainingSlider', el => el.scrollIntoView());
  await pageTr.waitForTimeout(300);

  const initialSlideTr = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Initial active slide:', initialSlideTr);
  
  await pageTr.waitForTimeout(5200);
  
  const autoSlideTr = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Active slide after 5.2s autoplay:', autoSlideTr);
  if (autoSlideTr !== '1') {
    console.error('FAIL: Training slider did not advance automatically! Found:', autoSlideTr);
    process.exit(1);
  }
  console.log('PASS: Training slider autoplays successfully! ✓');

  // Test Loop back after last slide
  console.log('\nTesting slider looping back to first slide...');
  await pageTr.waitForTimeout(4800);
  const slide2 = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Active slide at ~10s:', slide2);
  await pageTr.waitForTimeout(4800);
  const slide0 = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Active slide after full loop (~15s):', slide0);

  if (slide0 !== '0') {
    console.error('FAIL: Slider did not loop back to 0! Found:', slide0);
    process.exit(1);
  }
  console.log('PASS: Training slider loops back to slide 0! ✓');

  // Test Hover pause on desktop
  console.log('\nTesting Desktop Hover Pause...');
  await pageTr.hover('#trainingSlider');
  const hoveredSlide = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Hovered slide:', hoveredSlide);
  await pageTr.waitForTimeout(5200);
  const stillHoveredSlide = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Slide after 5.2s while hovered:', stillHoveredSlide);
  if (hoveredSlide !== stillHoveredSlide) {
    console.error('FAIL: Slider moved while hovered!');
    process.exit(1);
  }
  console.log('PASS: Slider paused while hovered! ✓');

  // Test resume after mouse leave
  await pageTr.mouse.move(0, 0);
  await pageTr.waitForTimeout(5200);
  const resumedSlide = await pageTr.$eval('#trainingSlider', el => el.dataset.activeSlide);
  console.log('Slide after mouse leave + 5.2s:', resumedSlide);
  if (resumedSlide === stillHoveredSlide) {
    console.error('FAIL: Slider did not resume after hover leave!');
    process.exit(1);
  }
  console.log('PASS: Slider resumed autoplay after mouse leave! ✓');

  await pageAbout.close();
  await pageTr.close();
  await browser.close();
  console.log('\n========================================');
  console.log('ALL AUTOPLAY & INTERACTION CHECKS PASSED PERFECTLY! ✓✓✓');
  process.exit(0);
}

testAutoplay().catch(err => {
  console.error('Autoplay test error:', err);
  process.exit(1);
});
