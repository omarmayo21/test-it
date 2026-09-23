import { chromium } from 'playwright';
const b = await chromium.launch({ args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
p.on('requestfailed', r => errs.push('REQ FAIL '+r.url()));
await p.goto('http://127.0.0.1:3000/');            // clean URL, no ?debug
await p.waitForTimeout(2000);
const r = await p.evaluate(() => ({
  debugVisible: !document.getElementById('debug').hidden,
  scrollable: document.documentElement.scrollHeight > window.innerHeight*5,
  heroFilled: document.querySelector('.display .mask__i').getBoundingClientRect().width > 400,
  navVisible: getComputedStyle(document.getElementById('nav')).opacity,
  tier: document.body.dataset.q
}));
console.log('clean URL:', JSON.stringify(r));
await p.screenshot({ path:'shots/final-hero.png' });
// keyboard scrolling (no JS interception)
await p.keyboard.press('PageDown'); await p.waitForTimeout(900);
console.log('after PageDown, scrollY =', await p.evaluate(()=>Math.round(window.scrollY)));
await p.keyboard.press('End'); await p.waitForTimeout(1400);
console.log('after End, scrollY =', await p.evaluate(()=>Math.round(window.scrollY)), '/', await p.evaluate(()=>window.__SC.maxScroll));
// nav link jump
await p.click('.nav__link[data-goto="3"]'); await p.waitForTimeout(1800);
console.log('after clicking IT Services:', await p.evaluate(()=>Math.round(window.scrollY)), 'expected', await p.evaluate(()=>3*window.__SC.segPx));
console.log('errors:', errs);
await b.close();
