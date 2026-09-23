import { chromium } from 'playwright';
const b = await chromium.launch({ args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:3000/');
await p.waitForTimeout(1200);
const out = await p.evaluate(() => {
  const seg = window.__SC.segPx, rows = [];
  const rect = el => { const r = el.getBoundingClientRect(); return `x${Math.round(r.left)}..${Math.round(r.right)} y${Math.round(r.top)}..${Math.round(r.bottom)}`; };
  // nav
  rows.push(['NAV  brand  ', rect(document.querySelector('.nav__brand'))]);
  rows.push(['NAV  links  ', rect(document.querySelector('.nav__links'))]);
  rows.push(['NAV  cta    ', rect(document.querySelector('.nav__cta'))]);
  rows.push(['NAV  font   ', getComputedStyle(document.querySelector('.nav__link')).fontSize + ' ' + getComputedStyle(document.querySelector('.nav__link')).color]);
  document.querySelectorAll('.panel').forEach((panel, i) => {
    window.scrollTo({top: i*seg, behavior:'instant'});
    const inner = panel.querySelector('.panel__inner');
    const cs = [...inner.children];
    rows.push([`SEC${String(i+1).padStart(2,'0')} inner `, rect(inner)]);
    cs.forEach(k => {
      const tag = k.tagName.toLowerCase() + (k.className ? '.'+String(k.className).split(' ')[0] : '');
      let extra='';
      if (k.classList.contains('display')||k.classList.contains('title')) {
        extra = ' fs=' + getComputedStyle(k).fontSize + ' lh=' + getComputedStyle(k).lineHeight;
        [...k.querySelectorAll('.mask__i')].forEach((m,j)=> extra += ` |L${j}: ${rect(m)}`);
      }
      rows.push([`   ${tag.padEnd(18)}`, rect(k) + extra]);
    });
  });
  window.scrollTo({top:0, behavior:'instant'});
  return rows;
});
for (const [a,b2] of out) console.log(a, b2);
await b.close();
