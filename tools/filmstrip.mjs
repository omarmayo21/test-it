import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:3000/?debug');
await p.waitForTimeout(1300);
fs.rmSync('shots/film', {recursive:true, force:true}); fs.mkdirSync('shots/film', {recursive:true});
const SEG = await p.evaluate(()=>window.__SC.segPx), TR = await p.evaluate(()=>window.__SC.transPx);
for (let t=1;t<=9;t++){
  for (const f of [0.2,0.35,0.5,0.65,0.8]) {
    const y = Math.round(t*SEG - TR + f*TR);
    await p.evaluate(v => new Promise(r=>{window.scrollTo({top:v,behavior:'instant'});requestAnimationFrame(()=>requestAnimationFrame(r));}), y);
    await p.waitForTimeout(40);
    await p.screenshot({ path:`shots/film/t${t}-${String(Math.round(f*100)).padStart(3,'0')}.png` });
  }
}
await b.close();
console.log('captured');
