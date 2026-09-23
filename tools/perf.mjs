import { chromium } from 'playwright';
const b = await chromium.launch({ args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:3000/');
await p.waitForTimeout(1600);

// instrument rAF frame timing while scrolling the whole world
const res = await p.evaluate(async () => {
  const max = window.__SC.maxScroll;
  const frames = [];
  let last = performance.now();
  let stop = false;
  const tick = (t) => { frames.push(t - last); last = t; if (!stop) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const t0 = performance.now();
  const steps = 260;
  for (let i = 0; i <= steps; i++) {
    window.scrollTo(0, Math.round(max * i / steps));
    await new Promise(r => requestAnimationFrame(r));
  }
  stop = true;
  const wall = performance.now() - t0;
  frames.shift();
  const sorted = [...frames].sort((a,b)=>a-b);
  return {
    wall: Math.round(wall), frames: frames.length,
    avgFps: +(1000 / (frames.reduce((a,c)=>a+c,0)/frames.length)).toFixed(1),
    p95: +sorted[Math.floor(sorted.length*0.95)].toFixed(2),
    worst: +sorted[sorted.length-1].toFixed(2),
    over32ms: frames.filter(f=>f>32).length
  };
});
console.log('scroll-through 260 steps:', JSON.stringify(res));

// pure render() cost
const cost = await p.evaluate(() => {
  const t0 = performance.now();
  for (let i=0;i<600;i++){ window.scrollTo(0, (i*23) % window.__SC.maxScroll); window.__SC.render(); }
  return +((performance.now()-t0)/600).toFixed(3);
});
console.log('render() cost:', cost, 'ms/frame');

// memory / node counts
const dom = await p.evaluate(() => ({
  nodes: document.getElementsByTagName('*').length,
  panels: document.querySelectorAll('.panel').length,
  cssRules: [...document.styleSheets].reduce((a,s)=>{try{return a+s.cssRules.length}catch(e){return a}},0)
}));
console.log('dom:', JSON.stringify(dom));

// paint/layout counts via CDP
const cdp = await p.context().newCDPSession(p);
await cdp.send('Performance.enable');
const m1 = await cdp.send('Performance.getMetrics');
await p.evaluate(async () => { for (let i=0;i<120;i++){ window.scrollTo(0,i*110); await new Promise(r=>requestAnimationFrame(r)); } });
const m2 = await cdp.send('Performance.getMetrics');
const get = (m,n) => m.metrics.find(x=>x.name===n)?.value ?? 0;
console.log('over 120 scroll frames → LayoutCount +' + (get(m2,'LayoutCount')-get(m1,'LayoutCount')),
            ' RecalcStyleCount +' + (get(m2,'RecalcStyleCount')-get(m1,'RecalcStyleCount')),
            ' LayoutDuration +' + ((get(m2,'LayoutDuration')-get(m1,'LayoutDuration'))*1000).toFixed(1) + 'ms',
            ' RecalcStyleDuration +' + ((get(m2,'RecalcStyleDuration')-get(m1,'RecalcStyleDuration'))*1000).toFixed(1) + 'ms',
            ' ScriptDuration +' + ((get(m2,'ScriptDuration')-get(m1,'ScriptDuration'))*1000).toFixed(1) + 'ms');
await b.close();
