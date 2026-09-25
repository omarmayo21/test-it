import { chromium } from 'playwright';

const b = await chromium.launch({ args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];

p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('requestfailed', r => errs.push('REQ FAIL ' + r.url()));

console.log('=== TESTING NAVIGATION ROUTING FLOWS ===');

// 1. Clean Landing Page Load
await p.goto('http://127.0.0.1:3000/');
await p.waitForTimeout(1000);

const r = await p.evaluate(() => ({
  debugVisible: !document.getElementById('debug').hidden,
  scrollable: document.documentElement.scrollHeight > window.innerHeight * 5,
  heroFilled: document.querySelector('.display .mask__i').getBoundingClientRect().width > 400,
  navVisible: getComputedStyle(document.getElementById('nav')).opacity,
  tier: document.body.dataset.q
}));
console.log('clean URL:', JSON.stringify(r));

// 2. Keyboard scrolling on Landing Page
await p.keyboard.press('PageDown');
await p.waitForTimeout(600);
console.log('after PageDown, scrollY =', await p.evaluate(() => Math.round(window.scrollY)));

await p.keyboard.press('End');
await p.waitForTimeout(1000);
console.log('after End, scrollY =', await p.evaluate(() => Math.round(window.scrollY)));

// 3. Test Navigation: Home -> About Us
console.log('\nTesting Home -> About Us click...');
await p.click('.nav__link[href="/about/"]');
await p.waitForURL('**/about/');
console.log('  URL is now:', p.url());
console.log('  About Us H1:', await p.$eval('h1', el => el.textContent.trim().substring(0, 30)) + '...');

// 4. Test Navigation: About Us -> IT Services
console.log('\nTesting About Us -> IT Services click...');
await p.click('.nav__link[href="/it-services/"]');
await p.waitForURL('**/it-services/');
console.log('  URL is now:', p.url());
console.log('  IT Services H1:', await p.$eval('h1', el => el.textContent.trim().substring(0, 30)) + '...');

// 5. Test Navigation: IT Services -> Training
console.log('\nTesting IT Services -> Training click...');
await p.click('.nav__link[href="/training/"]');
await p.waitForURL('**/training/');
console.log('  URL is now:', p.url());
console.log('  Training H1:', await p.$eval('h1', el => el.textContent.trim().substring(0, 30)) + '...');

// 6. Test Navigation: Training -> Contact
console.log('\nTesting Training -> Contact click...');
await p.click('.nav__link[href="/contact/"]');
await p.waitForURL('**/contact/');
console.log('  URL is now:', p.url());
console.log('  Contact H1:', await p.$eval('h1', el => el.textContent.trim().substring(0, 30)) + '...');

// 7. Test Navigation: Contact -> Home
console.log('\nTesting Contact -> Home click...');
await p.click('.nav__link[href="/"]');
await p.waitForURL('http://127.0.0.1:3000/');
console.log('  URL is now:', p.url());

// 8. Test Direct Landing Page clicks for IT Services and Training
console.log('\nTesting Landing Page direct click -> IT Services...');
await p.click('.nav__link[href="/it-services/"]');
await p.waitForURL('**/it-services/');
console.log('  Verified IT Services opened:', p.url());

await p.goto('http://127.0.0.1:3000/');
await p.waitForTimeout(500);

console.log('\nTesting Landing Page direct click -> Training...');
await p.click('.nav__link[href="/training/"]');
await p.waitForURL('**/training/');
console.log('  Verified Training opened:', p.url());

// 9. Test Mobile Menu Navigation
console.log('\nTesting Mobile Menu Navigation...');
const mobilePage = await b.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('http://127.0.0.1:3000/');
await mobilePage.waitForTimeout(500);

// Open mobile drawer
await mobilePage.click('#burger');
await mobilePage.waitForTimeout(300);

// Click IT Services in mobile drawer
await mobilePage.click('.menu__nav a[href="/it-services/"]');
await mobilePage.waitForURL('**/it-services/');
console.log('  Mobile menu routed to IT Services:', mobilePage.url());

await mobilePage.close();

console.log('\nNavigation Test Errors:', errs);
if (errs.length > 0) {
  console.error('FAILED WITH ERRORS');
  process.exit(1);
} else {
  console.log('ALL NAVIGATION TESTS PASSED! ✓');
}

await b.close();
