/* ============================================================================
   Solutions Castle — real-browser verification
   PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 node tools/verify.mjs
   ========================================================================= */
import { chromium } from 'playwright';
import fs from 'fs';

const URL = process.env.URL || 'http://127.0.0.1:3000/?debug';
const OUT = 'shots';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const ok   = (n, d = '') => results.push(['PASS', n, d]);
const bad  = (n, d = '') => results.push(['FAIL', n, d]);
const info = (n, d = '') => results.push(['INFO', n, d]);

const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);

/* ── 1 · native scrolling ───────────────────────────────────────────────── */
const geom = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  vh: window.innerHeight,
  maxScroll: window.__SC.maxScroll,
  segPx: window.__SC.segPx,
  transPx: window.__SC.transPx,
  htmlOverflow: getComputedStyle(document.documentElement).overflow,
  bodyOverflowY: getComputedStyle(document.body).overflowY,
  panelPosition: getComputedStyle(document.querySelector('.panel')).position
}));
const { segPx: SEG, transPx: TRANS, vh: VH } = geom;

geom.scrollHeight === SEG * 10
  ? ok('document has real scrollable height', `${geom.scrollHeight}px  (10 × ${SEG}px, viewport ${geom.vh}px)`)
  : bad('document height', `${geom.scrollHeight} != ${SEG * 10}`);
(geom.htmlOverflow !== 'hidden' && geom.bodyOverflowY !== 'hidden')
  ? ok('nothing locks the document scroll', `html:${geom.htmlOverflow}  body-y:${geom.bodyOverflowY}`)
  : bad('scroll lock detected', JSON.stringify(geom));

/* ── 2 · real mouse wheel ───────────────────────────────────────────────── */
await page.mouse.move(720, 450);
const y0 = await page.evaluate(() => window.scrollY);
for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(16); }
await page.waitForTimeout(400);
const y1 = await page.evaluate(() => window.scrollY);
const dbg1 = await page.evaluate(() => ['dbgY', 'dbgS', 'dbgP'].map(id => document.getElementById(id).textContent));
y1 > y0 + 500 && +dbg1[0] > 0
  ? ok('mouse wheel scrolls & debug values change', `scrollY ${y0} → ${y1} | Y=${dbg1[0]} SECTION=${dbg1[1]} PROGRESS=${dbg1[2]}`)
  : bad('wheel did not scroll', `${y0} → ${y1}`);

/* ── sample helper ──────────────────────────────────────────────────────── */
async function sample(yPx, shot) {
  // jump instantly, then wait for two real rendered frames so the rAF-driven
  // render() has definitely run with the new window.scrollY
  await page.evaluate(y => new Promise(res => {
    window.scrollTo({ top: y, behavior: 'instant' });
    requestAnimationFrame(() => requestAnimationFrame(() => res()));
  }), yPx);
  await page.waitForTimeout(60);
  if (shot) await page.waitForTimeout(420);      // let the masked reveal settle
  const s = await page.evaluate(() => {
    const st = window.__SC.state;
    const P = [...document.querySelectorAll('.panel')];
    const box = i => { const r = P[i].getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) }; };
    const mat = i => { const m = new DOMMatrixReadOnly(getComputedStyle(P[i]).transform); return { z: +m.m43.toFixed(1) }; };
    const soEl = document.getElementById('so');
    const soM = new DOMMatrixReadOnly(getComputedStyle(soEl).transform);
    return {
      y: Math.round(window.scrollY),
      p: +st.p.toFixed(4), t: st.t, from: st.from, to: st.to, active: st.activeIdx,
      out: st.out, in: st.in, soOp: +(+getComputedStyle(soEl).opacity).toFixed(3),
      soZ: +soM.m43.toFixed(0), soX: +soM.m41.toFixed(0), soScale: +Math.hypot(soM.m11, soM.m12).toFixed(2),
      cls: P.map(p => p.className.replace('panel ', '')),
      op: P.map(p => +(+getComputedStyle(p).opacity).toFixed(3)),
      vis: P.map(p => getComputedStyle(p).visibility),
      appliedZ: P.map((_, i) => mat(i).z),
      // rendered (post-transform) height — proves the 3D flip is really painted
      rect: [box(st.from), box(st.to)],
      vh: window.innerHeight
    };
  });
  if (shot) await page.screenshot({ path: `${OUT}/${shot}.png` });
  return s;
}

/* ── 3 · rest positions ─────────────────────────────────────────────────── */
let restBad = [];
for (let i = 0; i < 10; i++) {
  const s = await sample(i * SEG, `rest-${String(i + 1).padStart(2, '0')}`);
  const visible = s.vis.filter((v, k) => v === 'visible' && s.op[k] > 0.01).length;
  const good = s.cls[i].includes('is-active') && s.op[i] > 0.99 &&
               Math.abs(s.appliedZ[i]) < 0.5 && s.soOp < 0.02 && visible === 1 &&
               Math.abs(s.rect[0].h - s.vh) < 4;
  if (!good) restBad.push(`sec${i + 1}: cls="${s.cls[i]}" op=${s.op[i]} z=${s.appliedZ[i]} so=${s.soOp} vis=${visible} h=${s.rect[0].h}`);
}
restBad.length === 0
  ? ok('all 10 rest positions flat, clean, SO hidden', 'one visible panel, identity transform, full-height render')
  : bad('rest positions', restBad.join(' | '));

/* ── 4 · the 9 transitions, scrubbed ────────────────────────────────────── */
const yAt = (t, f) => t * SEG - TRANS + f * TRANS;
const rows = [];
for (let t = 1; t <= 9; t++) {
  const start = t * SEG - TRANS;
  const r = { t, s: [] };
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    const s = await sample(Math.round(start + f * TRANS), f === 0.5 ? `trans-${String(t).padStart(2, '0')}-mid` : null);
    r.s.push(s);
  }
  rows.push(r);
}

let tBad = [];
const summary = [];
for (const r of rows) {
  const [a, b25, c, d75, e] = r.s;
  const errs = [];
  if (!(Math.abs(a.p) < 0.002 && Math.abs(e.p - 1) < 0.002)) errs.push(`p ends ${a.p}/${e.p}`);
  if (!(b25.p < c.p && c.p < d75.p)) errs.push(`p not monotonic ${r.s.map(x => x.p).join(',')}`);
  // outgoing: physically rotates backward + recedes + shrinks + fades
  if (!(c.out.rx < -8))   errs.push(`out rotateX ${c.out.rx}°`);
  if (!(c.out.z < -60))   errs.push(`out translateZ ${c.out.z}px`);
  if (!(c.out.s < 0.99))  errs.push(`out scale ${c.out.s}`);
  if (!(d75.out.op < b25.out.op)) errs.push('out not fading');
  if (!(Math.abs(c.appliedZ[r.t - 1] - c.out.z) < 1)) errs.push(`out Z not applied (${c.appliedZ[r.t - 1]} vs ${c.out.z})`);
  if (!(c.rect[0].h < c.vh * 0.95)) errs.push(`out not foreshortened (h=${c.rect[0].h})`);
  // incoming: unfolds forward from depth
  if (!(c.in.rx > 8))    errs.push(`in rotateX ${c.in.rx}°`);
  if (!(c.in.z < -60))   errs.push(`in translateZ ${c.in.z}px`);
  if (!(d75.in.op > b25.in.op)) errs.push('in not rising');
  if (!(Math.abs(c.appliedZ[r.t] - c.in.z) < 1)) errs.push(`in Z not applied (${c.appliedZ[r.t]} vs ${c.in.z})`);
  
  // SO presence: only transitions 3, 6, 8 show SO; transitions 1, 2, 4, 5, 7, 9 keep SO hidden
  const isSO = [3, 6, 8].includes(r.t);
  if (isSO) {
    if (!(c.soOp > 0.45)) errs.push(`SO mid opacity ${c.soOp}`);
    if (!(c.out.z > c.in.z)) errs.push('depth ordering wrong');
  } else {
    if (!(c.soOp < 0.02)) errs.push(`SO visible during non-SO transition (${c.soOp})`);
  }
  if (!(a.soOp < 0.05 && e.soOp < 0.05)) errs.push(`SO visible at rest (${a.soOp}/${e.soOp})`);
  if (c.y !== Math.round(yAt(r.t, 0.5))) errs.push(`landed at ${c.y} not ${Math.round(yAt(r.t, 0.5))}`);
  if (errs.length) tBad.push(`T${String(r.t).padStart(2, '0')}→${String(r.t + 1).padStart(2, '0')}: ${errs.join('; ')}`);
  summary.push(`${r.t}→${r.t + 1}[${isSO ? 'SO ' + c.soOp + ' @z' + c.soZ + ' s' + c.soScale : '3D panel'} · out ${c.out.rx}°/${c.out.z}px · in ${c.in.rx}°/${c.in.z}px]`);
}
tBad.length === 0
  ? ok('all 9 transitions verified (3 curated SO moments + 6 distinct 3D panel transitions)', 'verified on the live DOM + rendered geometry')
  : bad('transitions', tBad.join('\n         '));
info('mid-transition state (50%)', summary.join('\n         '));

/* ── 5 · three curated SO transition motions ────────────────────────────── */
const soRows = rows.filter(r => [3, 6, 8].includes(r.t));
const sigs = soRows.map(r => r.s.filter((_, i) => i !== 0 && i !== 4).map(s => [s.soX, s.soZ, s.soScale, s.soOp]));
const uniq = new Set(sigs.map(s => JSON.stringify(s)));
uniq.size === 3 ? ok('3 distinct curated SO transition motions', uniq.size + ' unique signatures')
                : bad('SO motions not distinct', uniq.size + '/3');

/* ── 6 · stop halfway and it stays there ────────────────────────────────── */
const y52 = Math.round(3 * SEG - TRANS + 0.52 * TRANS);
await sample(y52);
const snapA = await page.evaluate(() => document.querySelectorAll('.panel')[2].style.transform + '|' +
  document.querySelectorAll('.panel')[3].style.opacity + '|' + document.getElementById('so').style.opacity);
await page.waitForTimeout(2000);
const snapB = await page.evaluate(() => document.querySelectorAll('.panel')[2].style.transform + '|' +
  document.querySelectorAll('.panel')[3].style.opacity + '|' + document.getElementById('so').style.opacity);
snapA === snapB ? ok('holds at 52% while idle (no autoplay / timer)', snapA.slice(0, 72) + '…')
                : bad('drifted while idle', `${snapA}\n         ${snapB}`);
await page.screenshot({ path: `${OUT}/hold-52.png` });

/* ── 7 · reversal ───────────────────────────────────────────────────────── */
const probe = Math.round(3 * SEG - TRANS + 0.4 * TRANS);
await sample(probe);
const down = await page.evaluate(() => [...document.querySelectorAll('.panel')].map(p => p.style.transform + '@' + p.style.opacity).join('|'));
await sample(0);
await sample(probe);
const up = await page.evaluate(() => [...document.querySelectorAll('.panel')].map(p => p.style.transform + '@' + p.style.opacity).join('|'));
down === up ? ok('scrolling up reverses naturally', 'identical derived state from either direction')
            : bad('reverse mismatch', `\n  down: ${down}\n  up:   ${up}`);

/* ── 8 · full wheel journey down and back up ────────────────────────────── */
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.mouse.move(720, 450);
const trail = [];
for (let i = 0; i < 140; i++) {
  await page.mouse.wheel(0, 200);
  if (i % 20 === 0) trail.push(await page.evaluate(() => Math.round(window.scrollY) + ':' + document.getElementById('dbgS').textContent.replace(/\s/g, '')));
}
await page.waitForTimeout(600);
const endY = await page.evaluate(() => Math.round(window.scrollY));
await page.screenshot({ path: `${OUT}/end.png` });
endY > geom.maxScroll - 60 ? ok('wheel reaches the end of the world', `${endY} / ${geom.maxScroll}`)
                           : bad('wheel stopped early', `${endY} / ${geom.maxScroll}`);
info('sections passed while wheeling down', trail.join('  →  '));

for (let i = 0; i < 160; i++) await page.mouse.wheel(0, -240);
await page.waitForTimeout(600);
const backY = await page.evaluate(() => Math.round(window.scrollY));
backY === 0 ? ok('wheel back up returns to the hero') : bad('did not return to hero', 'scrollY=' + backY);

/* ── 9 · trackpad-style touch scroll ────────────────────────────────────── */
const tp = await b.newPage({ viewport: { width: 1280, height: 800 }, hasTouch: true });
await tp.goto(URL, { waitUntil: 'networkidle' });
await tp.waitForTimeout(900);
await tp.touchscreen.tap(640, 400).catch(() => {});
const tpBefore = await tp.evaluate(() => window.scrollY);
for (let i = 0; i < 30; i++) await tp.mouse.wheel(0, 160);
await tp.waitForTimeout(500);
const tpAfter = await tp.evaluate(() => ({ y: Math.round(window.scrollY), s: document.getElementById('dbgS').textContent }));
tpAfter.y > 1500 ? ok('trackpad / touch-device scrolling works', JSON.stringify(tpAfter)) : bad('trackpad scroll', JSON.stringify(tpAfter));
await tp.close();

/* ── 10 · pure native scroll implementation ─────────────────────────────── */
const js = fs.readFileSync('assets/js/main.js', 'utf8');
const css = fs.readFileSync('assets/css/main.css', 'utf8');
const offenses = [];
if (/addEventListener\(\s*['"](wheel|touchmove|touchstart|mousewheel|DOMMouseScroll)['"]/i.test(js)) offenses.push('wheel/touch listener');
if (/\.preventDefault\s*\(/.test(js)) offenses.push('preventDefault()');
if (/lenis|locomotive|scrolltrigger|ScrollSmoother|virtual-scroll/i.test(js + css)) offenses.push('virtual scroll lib');
if (/html\s*,\s*body\s*\{[^}]*overflow\s*:\s*hidden/i.test(css)) offenses.push('html/body overflow:hidden');
if (!/addEventListener\(\s*['"]scroll['"][^)]*passive\s*:\s*true/i.test(js)) offenses.push('no passive scroll listener');
offenses.length === 0
  ? ok('native scroll architecture only', 'passive scroll listener, no wheel/touch interception, no preventDefault, no virtual scroll')
  : bad('non-native constructs', offenses.join(', '));

/* ── 11 · content fits ──────────────────────────────────────────────────── */
const fit = await page.evaluate(() => {
  const out = [], seg = window.__SC.segPx;
  document.querySelectorAll('.panel').forEach((p, i) => {
    window.scrollTo({ top: i * seg, behavior: 'instant' });
    const inner = p.querySelector('.panel__inner');
    let minT = 1e9, maxB = -1e9;
    [...inner.children].forEach(k => { const r = k.getBoundingClientRect(); minT = Math.min(minT, r.top); maxB = Math.max(maxB, r.bottom); });
    out.push({ i: i + 1, top: Math.round(minT), bottom: Math.round(maxB), vh: window.innerHeight });
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  return out;
});
const over = fit.filter(f => f.top < 0 || f.bottom > f.vh);
over.length === 0 ? ok('every section fits the viewport', fit.map(f => `${f.i}:${f.top}–${f.bottom}`).join(' '))
                  : bad('content overflow', over.map(f => `sec${f.i} ${f.top}–${f.bottom} of ${f.vh}`).join(' | '));

/* ── 12 · reduced motion ────────────────────────────────────────────────── */
const rm = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await rm.goto(URL, { waitUntil: 'networkidle' });
await rm.waitForTimeout(900);
const rmS = await rm.evaluate(() => {
  const seg = window.__SC.segPx, tr = window.__SC.transPx;
  window.scrollTo({ top: Math.round(3 * seg - tr + 0.5 * tr), behavior: 'instant' });
  window.__SC.render();
  const mid = window.__SC.state;
  const soMid = +getComputedStyle(document.getElementById('so')).opacity;
  window.scrollTo({ top: Math.round(3 * seg - tr + 0.9 * tr), behavior: 'instant' });
  window.__SC.render();
  const late = window.__SC.state;
  window.scrollTo({ top: Math.round(seg * 3), behavior: 'instant' });
  window.__SC.render();
  const rest = +getComputedStyle(document.querySelectorAll('.panel')[3]).opacity;
  return { outRx: mid.out.rx, outZ: mid.out.z, soMid: +soMid.toFixed(2),
           incomingAt90: +late.in.op.toFixed(2), restingPanel: rest,
           scrollable: document.documentElement.scrollHeight > window.innerHeight * 5 };
});
await rm.screenshot({ path: `${OUT}/reduced-motion.png` });
(rmS.outRx === 0 && rmS.outZ === 0 && rmS.scrollable && rmS.soMid > 0.2 && rmS.incomingAt90 > 0.9 && rmS.restingPanel > 0.99)
  ? ok('reduced motion: 3D off, scroll + SO + content intact', JSON.stringify(rmS))
  : bad('reduced motion', JSON.stringify(rmS));
await rm.close();

/* ── 13 · mobile ────────────────────────────────────────────────────────── */
const mob = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const mobErr = [];
mob.on('pageerror', e => mobErr.push(e.message));
await mob.goto(URL, { waitUntil: 'networkidle' });
await mob.waitForTimeout(1200);
await mob.screenshot({ path: `${OUT}/mobile-01-hero.png` });
const mobS = await mob.evaluate(() => {
  const seg = window.__SC.segPx, tr = window.__SC.transPx;
  window.scrollTo({ top: Math.round(3 * seg - tr + 0.5 * tr), behavior: 'instant' });
  window.__SC.render();
  const st = window.__SC.state;
  return { docH: document.documentElement.scrollHeight, p: +st.p.toFixed(2), outRx: +st.out.rx.toFixed(1),
           inRx: +st.in.rx.toFixed(1), soOp: +(+getComputedStyle(document.getElementById('so')).opacity).toFixed(2),
           burger: getComputedStyle(document.getElementById('burger')).display };
});
await mob.waitForTimeout(250);
await mob.screenshot({ path: `${OUT}/mobile-02-transition.png` });
(mobS.outRx < -5 && mobS.inRx > 5 && mobS.soOp > 0.4 && mobS.burger !== 'none' && mobErr.length === 0)
  ? ok('mobile preserves the full experience', JSON.stringify(mobS))
  : bad('mobile', JSON.stringify(mobS) + ' errs:' + mobErr.join(','));
await mob.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await mob.click('#burger');
await mob.waitForTimeout(700);
const mOpen = await mob.evaluate(() => document.getElementById('menu').classList.contains('is-open'));
await mob.screenshot({ path: `${OUT}/mobile-03-menu.png` });
mOpen ? ok('mobile burger menu opens') : bad('mobile menu');
await mob.close();

/* ── 14 · tablet ────────────────────────────────────────────────────────── */
const tab = await b.newPage({ viewport: { width: 834, height: 1112 } });
await tab.goto(URL, { waitUntil: 'networkidle' });
await tab.waitForTimeout(900);
const tabS = await tab.evaluate(() => {
  const seg = window.__SC.segPx, tr = window.__SC.transPx;
  window.scrollTo({ top: Math.round(3 * seg - tr + 0.5 * tr), behavior: 'instant' });
  window.__SC.render();
  const st = window.__SC.state;
  const inner = document.querySelectorAll('.panel')[2].querySelector('.panel__inner');
  let minT = 1e9, maxB = -1e9;
  [...inner.children].forEach(k => { const r = k.getBoundingClientRect(); minT = Math.min(minT, r.top); maxB = Math.max(maxB, r.bottom); });
  return { p: +st.p.toFixed(2), outRx: +st.out.rx.toFixed(1), so: +(+getComputedStyle(document.getElementById('so')).opacity).toFixed(2), fits: minT > -1 && maxB < window.innerHeight + 1 };
});
await tab.screenshot({ path: `${OUT}/tablet.png` });
tabS.outRx < -5 && tabS.so > 0.4 && tabS.fits ? ok('tablet: 3D + layout OK', JSON.stringify(tabS)) : bad('tablet', JSON.stringify(tabS));
await tab.close();

/* ── 15 · assets + errors ───────────────────────────────────────────────── */
const assets = await page.evaluate(() => {
  const so = document.querySelector('.so__img'), lg = document.querySelector('.nav__logo');
  return { so: so.getAttribute('src') + ' ' + so.naturalWidth + '×' + so.naturalHeight, soOk: so.complete && so.naturalWidth > 0,
           logo: lg.getAttribute('src'), logoOk: lg.complete && lg.naturalWidth > 0,
           inlineSo: document.querySelectorAll('img[src*="So.png"]').length };
});
(assets.soOk && assets.logoOk && assets.inlineSo >= 3)
  ? ok('real brand assets render', `${assets.so} · ${assets.logo} · ${assets.inlineSo} So.png uses`)
  : bad('brand assets', JSON.stringify(assets));
errors.length === 0 ? ok('no console / runtime errors') : bad('console errors', errors.slice(0, 6).join(' | '));

/* ── report ─────────────────────────────────────────────────────────────── */
console.log('\n══════════════════ VERIFICATION ══════════════════');
for (const [st, n, d] of results) console.log(`${st === 'PASS' ? '✔' : st === 'FAIL' ? '✘' : '·'} ${st.padEnd(4)} ${n}${d ? '\n       ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
console.log('══════════════════════════════════════════════════');
console.log(`${results.filter(r => r[0] === 'PASS').length} passed, ${fails} failed\n`);
await b.close();
process.exit(fails ? 1 : 0);
