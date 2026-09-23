/* ============================================================================
   SOLUTIONS CASTLE — scroll-driven 3D world
   ----------------------------------------------------------------------------
   ARCHITECTURE
     native document scroll
        ↓
     window.scrollY            (passive listener, never preventDefault)
        ↓
     section-relative progress (window.scrollY - section.offsetTop + innerHeight)
        ↓
     requestAnimationFrame
        ↓
     3D transforms (perspective / rotateX / translateZ / scale)
        ↓
     SO transition
        ↓
     next section
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.remove('no-js');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ── constants ─────────────────────────────────────────────────────────── */
  const N          = 10;    // sections
  const SEG        = 1.6;   // section length, in viewport heights
  const TRANS      = 1.0;   // transition distance, in viewport heights
  const DEAD       = 0.04;  // settle window at each end of a transition

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let REDUCED = reduced.matches;
  reduced.addEventListener?.('change', e => { REDUCED = e.matches; layout(); dirty = true; });

  /* ── dom ───────────────────────────────────────────────────────────────── */
  const track    = document.getElementById('track');
  const sections = Array.from(track.querySelectorAll('.scroll-section'));
  const panels   = Array.from(track.querySelectorAll('.panel'));
  const inners   = panels.map(p => p.querySelector('.panel__inner'));

  const nav      = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const burger   = document.getElementById('burger');
  const menu     = document.getElementById('menu');
  const cue      = document.getElementById('cue');
  const railNum  = document.getElementById('railNum');
  const railFill = document.getElementById('railFill');

  const so       = document.getElementById('so');
  const soHalo   = so.querySelector('.so__halo');
  const soRing   = so.querySelector('.so__ring');
  const soBeamL  = so.querySelector('.so__beam--l');
  const soBeamR  = so.querySelector('.so__beam--r');

  const dbg      = document.getElementById('debug');
  const dbgY     = document.getElementById('dbgY');
  const dbgS     = document.getElementById('dbgS');
  const dbgP     = document.getElementById('dbgP');
  const dbgT     = document.getElementById('dbgT');
  const DEBUG    = /[?&]debug\b/.test(location.search);
  if (DEBUG) dbg.hidden = false;

  /* ── easing ────────────────────────────────────────────────────────────── */
  const clamp      = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp       = (a, b, t) => a + (b - a) * t;
  const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const inOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const outCubic   = t => 1 - Math.pow(1 - t, 3);
  const inQuad     = t => t * t;
  const outBack    = t => { const c = 1.42; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  /* ── state ─────────────────────────────────────────────────────────────── */
  let vw = 0, vh = 0, segPx = 0, transPx = 0, persp = 1500, maxScroll = 1;
  let tops = [];                 // cached section.offsetTop
  let y = 0;                     // latest scrollY (source of truth)
  let dirty = true;
  let liveSet = new Set();

  /* ── layout ────────────────────────────────────────────────────────────── */
  function layout() {
    vw = window.innerWidth;
    vh = window.innerHeight;

    segPx   = Math.round(vh * SEG);
    transPx = Math.round(vh * TRANS);
    persp   = Math.round(clamp(vw * 1.05, 900, 1700));
    if (vw < 820) persp = Math.round(clamp(vw * 0.95, 720, 1200));

    root.style.setProperty('--seg-px', segPx + 'px');
    root.style.setProperty('--persp', persp + 'px');
    fitText();

    // real document height — the browser must be able to scroll
    maxScroll = Math.max(1, N * segPx - vh);

    tops = sections.map(s => s.offsetTop);

    if (DEBUG) dbgT.textContent = 'seg ' + segPx + ' / doc ' + (N * segPx);
    dirty = true;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     SO — the transition identity.  Nine different controlled motions.
     ═════════════════════════════════════════════════════════════════════════ */
  const env = () => ({ vw, vh });

  const SO_MOTION = [
    /* 01 — HERO → WHO WE ARE
       emerges from depth + moves toward camera + controlled Y rotation */
    (e, m) => {
      const t = inOutCubic(e);
      return {
        x: 0, y: 0, z: lerp(-700, 480, t),
        rx: lerp(10, -8, t), ry: lerp(-58, 26, t), rz: 0,
        s: lerp(0.55, 1.25, t),
        halo: lerp(0.50, 1.20, t),
        ring: 0, ringS: 1,
        beam: 0, beamA: 0, beamS: 1,
        op: smoothstep(0.02, 0.20, e) * (1 - smoothstep(0.66, 0.95, e))
      };
    },

    /* 02 — WHO WE ARE → WHAT WE DO
       tilts on X + moves forward + subtle cyan energy pulse */
    (e, m) => {
      const t  = inOutCubic(e);
      const pu = Math.sin(Math.PI * e);
      return {
        x: 0, y: 0, z: lerp(-820, 430, t),
        rx: lerp(-68, 20, t), ry: lerp(14, -12, t), rz: 0,
        s: lerp(0.50, 1.30, t),
        halo: lerp(0.5, 1.15, t) + 0.55 * pu,
        ring: pu * pu, ringS: lerp(0.8, 2.7, e),
        beam: 0, beamA: 0, beamS: 1,
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.66, 0.95, e))
      };
    },

    /* 03 — WHAT WE DO → IT SERVICES
       controlled Y rotation */
    (e, m) => {
      const t = inOutCubic(e);
      return {
        x: 0, y: 0, z: lerp(-620, 400, t),
        rx: lerp(3, -3, t), ry: lerp(-78, 70, t), rz: 0,
        s: lerp(0.70, 1.15, t),
        halo: lerp(0.6, 1.05, t),
        ring: 0, ringS: 1,
        beam: 0, beamA: 0, beamS: 1,
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.66, 0.95, e))
      };
    },

    /* 04 — IT SERVICES → TRAINING
       expands into a portal + the camera moves through the SO */
    (e, m) => {
      const t  = Math.pow(e, 1.45);
      const t2 = Math.pow(e, 1.30);
      return {
        x: 0, y: 0, z: lerp(-520, 640, t),
        rx: 0, ry: 0, rz: lerp(-8, 10, inOutCubic(e)),
        s: lerp(0.45, 1.62, t2),
        halo: lerp(0.80, 1.22, t2),
        ring: smoothstep(0.04, 0.30, e) * (1 - smoothstep(0.80, 1.0, e)),
        ringS: lerp(0.7, 3.4, e),
        beam: 0, beamA: 0, beamS: 1,
        op: smoothstep(0.02, 0.16, e) * (1 - smoothstep(0.74, 0.97, e))
      };
    },

    /* 05 — TRAINING → HOW WE WORK
       orbital rotation */
    (e, m) => {
      const a  = (e - 0.5) * Math.PI;
      const R  = m.vw * 0.28;
      const t  = inOutCubic(e);
      return {
        x: Math.sin(a) * R,
        y: -Math.cos(a) * m.vh * 0.05 + m.vh * 0.02 * e,
        z: lerp(-750, 430, t) - Math.cos(a) * 160,
        rx: lerp(-8, 8, e), ry: lerp(-50, 50, e), rz: lerp(-4, 4, e),
        s: lerp(0.55, 1.20, t),
        halo: lerp(0.6, 1.2, t),
        ring: 0, ringS: 1,
        beam: 0, beamA: 0, beamS: 1,
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.68, 0.96, e))
      };
    },

    /* 06 — HOW WE WORK → INDUSTRIES
       the SO becomes the central hub */
    (e, m) => {
      const t = inOutCubic(e);
      return {
        x: 0, y: 0, z: lerp(-520, 200, t),
        rx: lerp(-6, 6, t), ry: lerp(-20, 20, t), rz: 0,
        s: lerp(0.80, 1.25, t),
        halo: lerp(0.7, 1.35, t),
        ring: smoothstep(0.04, 0.26, e) * (1 - smoothstep(0.78, 1.0, e)),
        ringS: lerp(0.75, 2.5, e) * (1 + 0.12 * Math.sin(e * Math.PI * 2)),
        beam: smoothstep(0.05, 0.35, e) * (1 - smoothstep(0.74, 1.0, e)),
        beamA: 0, beamS: lerp(0.20, 1.30, e),
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.70, 0.96, e))
      };
    },

    /* 07 — INDUSTRIES → THE CONNECTION
       moves toward the panoramic centre */
    (e, m) => {
      const t = inOutCubic(e);
      return {
        x: lerp(m.vw * 0.30, 0, t),
        y: lerp(m.vh * 0.09, 0, t),
        z: lerp(-800, 300, t),
        rx: 0, ry: lerp(-36, 0, t), rz: lerp(10, 0, t),
        s: lerp(0.70, 1.25, t),
        halo: lerp(0.6, 1.25, t),
        ring: 0, ringS: 1,
        beam: smoothstep(0.10, 0.45, e) * (1 - smoothstep(0.60, 0.96, e)),
        beamA: 0, beamS: lerp(0.10, 1.70, e),
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.70, 0.96, e))
      };
    },

    /* 08 — THE CONNECTION → TWO DESTINATIONS
       expands and visually creates two directions */
    (e, m) => {
      const t  = inOutCubic(e);
      const t2 = Math.pow(e, 1.2);
      return {
        x: 0, y: 0, z: lerp(-260, 470, t2),
        rx: lerp(0, -4, t), ry: 0, rz: 0,
        s: lerp(1.00, 1.42, t2),
        halo: lerp(0.80, 1.22, t2),
        ring: 0, ringS: 1,
        beam: smoothstep(0.15, 0.50, e) * (1 - smoothstep(0.86, 1.0, e)),
        beamA: lerp(0, 27, e), beamS: lerp(0.15, 1.10, e),
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.74, 0.97, e))
      };
    },

    /* 09 — TWO DESTINATIONS → FINAL CTA
       returns to the centre and settles */
    (e, m) => {
      const t = outBack(clamp(e, 0, 1));
      return {
        x: lerp(-m.vw * 0.22, 0, t),
        y: lerp(m.vh * 0.11, 0, t),
        z: lerp(-420, 60, t),
        rx: lerp(-14, 0, t), ry: lerp(30, 0, t), rz: 0,
        s: lerp(1.45, 1.05, t),
        halo: lerp(1.35, 1.00, t),
        ring: 0, ringS: 1,
        beam: 0, beamA: 0, beamS: 1,
        op: smoothstep(0.02, 0.18, e) * (1 - smoothstep(0.68, 0.96, e))
      };
    }
  ];

  const SO_NAMES = [
    'emerge / depth → camera',
    'x-tilt + energy pulse',
    'controlled Y rotation',
    'portal / through the SO',
    'orbital rotation',
    'central hub',
    'panoramic centre',
    'expands → two directions',
    'return + settle'
  ];

  function renderSO(t, p, active) {
    // t = transition index (1..9). No SO outside a transition.
    if (t < 1 || t > N - 1 || p <= 0.0005 || p >= 0.9995) {
      so.style.opacity = '0';
      so.style.transform = 'translate3d(0,0,-2600px)';
      return 0;
    }
    const e = clamp((p - DEAD) / (1 - 2 * DEAD), 0, 1);
    const m = env();

    let st;
    if (REDUCED) {
      st = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, halo: 1, ring: 0, ringS: 1,
             beam: 0, beamA: 0, beamS: 1,
             op: smoothstep(0.10, 0.30, p) * (1 - smoothstep(0.70, 0.92, p)) };
    } else {
      st = SO_MOTION[t - 1](e, m);
    }

    so.style.transform =
      `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, ${st.z.toFixed(2)}px)` +
      ` rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) rotateZ(${st.rz.toFixed(2)}deg)` +
      ` scale(${st.s.toFixed(4)})`;
    so.style.opacity = st.op.toFixed(4);

    soHalo.style.opacity = clamp(st.halo * st.op * 0.45, 0, 0.75).toFixed(3);
    soHalo.style.transform = `translate(-50%,-50%) scale(${(0.88 + (st.s - 1) * 0.14).toFixed(3)})`;

    soRing.style.opacity = (st.ring * st.op).toFixed(3);
    soRing.style.transform = `translate(-50%,-50%) scale(${st.ringS.toFixed(3)})`;

    const bo = (st.beam * st.op).toFixed(3);
    const bs = st.beamS.toFixed(3);
    soBeamL.style.opacity = bo;
    soBeamL.style.transform = `translate(0,-50%) rotate(${(-st.beamA).toFixed(2)}deg) scaleX(${bs})`;
    soBeamR.style.opacity = bo;
    soBeamR.style.transform = `translate(-100%,-50%) rotate(${(st.beamA).toFixed(2)}deg) scaleX(${bs})`;

    return st.op;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     FIT-TO-WIDTH — guarantees no headline ever breaks out of its column,
     at any viewport size, without ever clipping the words.
     ═════════════════════════════════════════════════════════════════════════ */
  const fitTargets = Array.from(document.querySelectorAll('[data-fit]'));
  function fitText() {
    for (const el of fitTargets) {
      el.style.fontSize = '';
      const cap = parseFloat(getComputedStyle(el).fontSize) || 100;
      const avail = el.clientWidth;
      if (!avail) continue;
      const ws = el.style.whiteSpace, w = el.style.width;
      el.style.whiteSpace = 'nowrap';
      el.style.width = 'max-content';
      el.style.fontSize = '100px';
      const natural = el.getBoundingClientRect().width;
      el.style.fontSize = ''; el.style.whiteSpace = ws; el.style.width = w;
      if (!natural) continue;
      const size = clamp(avail * 0.995 / (natural / 100), Math.min(cap, 15), cap);
      el.style.fontSize = size.toFixed(2) + 'px';
    }
  }

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER — one frame, derived purely from window.scrollY
     ═════════════════════════════════════════════════════════════════════════ */
  function render() {
    y = window.scrollY || window.pageYOffset || 0;

    /* ---- section-relative scroll progress (the Jack reference principle) ---- */
    const g = (y + vh) / segPx;
    let t = Math.floor(g);
    if (t < 1) t = 1;
    if (t > N - 1) t = N - 1;

    const sectionTop = tops[t] || (t * segPx);
    const localScroll = y - sectionTop + vh;              // window.scrollY - sectionTop + innerHeight
    const p = clamp(localScroll / transPx, 0, 1);         // 0 → 1, scrubbed

    const from = t - 1;
    const to   = t;
    const EPS     = 0.0005;
    const settled = p >= 1 - EPS;   // the incoming section owns the screen
    const atStart = p <= EPS;       // the outgoing section still owns the screen
    const activeIdx = settled ? to : from;

    /* ---- panels ---- */
    const e = clamp((p - DEAD) / (1 - 2 * DEAD), 0, 1);
    const outT = REDUCED ? e : Math.pow(e, 1.25);   // accelerates away from the camera
    const inT  = REDUCED ? e : inOutCubic(e);       // unfolds forward out of depth

    /* live numbers, exposed for browser verification */
    const outRx = REDUCED ? 0 : lerp(0, -66, outT);
    const outZ  = REDUCED ? 0 : lerp(0, -920, outT);
    const outS  = REDUCED ? 1 : lerp(1, 0.76, outT);
    const outOp = REDUCED ? 1 - smoothstep(0.10, 0.45, e) : 1 - smoothstep(0.12, 0.72, e);
    const inRx  = REDUCED ? 0 : lerp(62, 0, inT);
    const inZ   = REDUCED ? 0 : lerp(-1500, 0, inT);
    const inS   = REDUCED ? 1 : lerp(0.80, 1, inT);
    const inOp  = REDUCED ? smoothstep(0.45, 0.80, e) : smoothstep(0.35, 0.92, e);

    const setOff = (k) => {
      const panel = panels[k], inner = inners[k];
      if (panel.dataset.st === 'off') return;
      panel.dataset.st = 'off';
      panel.className = 'panel is-off' + (liveSet.has(k) ? ' is-live' : '');
      panel.inert = true;
      panel.style.removeProperty('transform');
      panel.style.removeProperty('opacity');
      inner.style.removeProperty('transform');
    };

    for (let k = 0; k < N; k++) {
      if (k !== from && k !== to) { setOff(k); continue; }

      let state = null, tf = 'translate3d(0,0,0)', op = 1, innerTf = 'translate3d(0,0,0)';

      if (k === from) {
        if (atStart) { state = 'active'; }
        else if (settled) { setOff(k); continue; }
        else {
          state = 'out';
          tf = `perspective(${persp}px) translate3d(0,0,${outZ.toFixed(2)}px) rotateX(${outRx.toFixed(3)}deg) scale(${outS.toFixed(4)})`;
          op = outOp;
          innerTf = `translate3d(0,${(-outT * 30).toFixed(2)}px,0)`;
        }
      } else {
        if (settled) { state = 'active'; }
        else if (atStart) { setOff(k); continue; }
        else {
          state = 'in';
          tf = `perspective(${persp}px) translate3d(0,0,${inZ.toFixed(2)}px) rotateX(${inRx.toFixed(3)}deg) scale(${inS.toFixed(4)})`;
          op = inOp;
          innerTf = `translate3d(0,${((1 - inT) * 46).toFixed(2)}px,0)`;
        }
      }

      const panel = panels[k], inner = inners[k];
      if (panel.dataset.st !== state) {
        panel.dataset.st = state;
        panel.className = 'panel is-' + state + (liveSet.has(k) ? ' is-live' : '');
        panel.inert = (state !== 'active');   // only the settled section is interactive
      }
      if (op > 0.002 && !liveSet.has(k)) { liveSet.add(k); panel.classList.add('is-live'); }

      panel.style.transform = tf;
      panel.style.opacity = op.toFixed(4);
      inner.style.transform = innerTf;
    }

    /* ---- SO ---- */
    const soOp = renderSO(t, p, activeIdx);

    /* ---- chrome ---- */
    const global = clamp(y / maxScroll, 0, 1);
    railFill.style.height = (global * 100).toFixed(2) + '%';
    const label = String(activeIdx + 1).padStart(2, '0');
    if (railNum.textContent !== label) railNum.textContent = label;

    nav.classList.toggle('is-stuck', y > 40);
    cue.classList.toggle('is-hidden', y > 40);

    for (let i = 0; i < navLinks.length; i++) {
      const target = +navLinks[i].dataset.goto;
      const on = target === activeIdx;
      navLinks[i].classList.toggle('is-current', on);
      if (on) navLinks[i].setAttribute('aria-current', 'true'); else navLinks[i].removeAttribute('aria-current');
    }

    /* ---- atmosphere parallax ---- */
    const gy = -(y * 0.045) % (vh * 2);
    const glowA = document.querySelector('.atmosphere__glow--a');
    const glowB = document.querySelector('.atmosphere__glow--b');
    if (glowA) glowA.style.transform = `translate3d(0,${(gy * 0.5).toFixed(1)}px,0)`;
    if (glowB) glowB.style.transform = `translate3d(0,${(gy * -0.35).toFixed(1)}px,0)`;
    const grid = document.querySelector('.atmosphere__grid');
    if (grid && !REDUCED) grid.style.transform = `translate3d(0,${(gy * 0.22).toFixed(1)}px,0)`;

    /* ---- debug ---- */
    if (DEBUG) {
      dbgY.textContent = Math.round(y);
      dbgS.textContent = (activeIdx + 1) + ' / ' + N;
      dbgP.textContent = p.toFixed(2);
      dbgT.textContent = (p > 0.0005 && p < 0.9995)
        ? String(from + 1).padStart(2, '0') + '→' + String(to + 1).padStart(2, '0') + '  ' + SO_NAMES[t - 1]
        : 'hold · ' + String(activeIdx + 1).padStart(2, '0');
    }

    const state = {
      y, t, p, from, to, activeIdx, settled, atStart, soOp,
      out: { rx: outRx, z: outZ, s: outS, op: outOp },
      in:  { rx: inRx,  z: inZ,  s: inS,  op: inOp  }
    };
    lastState = state;
    return state;
  }
  let lastState = null;

  /* ══════════════════════════════════════════════════════════════════════════
     FRAME LOOP + ADAPTIVE QUALITY
     The loop only runs when there is something to draw. If a device cannot
     keep up we shed the most expensive work first (dust → grain → glows),
     so the scroll-driven 3D never stutters.
     ═════════════════════════════════════════════════════════════════════════ */
  const Q_MAX = 3;
  let tier = 3;                 // 3 full · 2 dust@22fps · 1 no dust · 0 no dust/grain/glow
  let ema = 16.7, sampled = 0, lastT = 0, running = false, idle = 0, drops = 0;
  const dustFps = () => (tier >= 3 ? 30 : 20);

  function applyTier() {
    document.body.dataset.q = String(tier);
    if (tier < 2 && dustReady) { const c = cvs.getContext('2d'); c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,cvs.width,cvs.height); }
  }

  function frame(now) {
    const dt = lastT ? now - lastT : 16.7;
    lastT = now;

    // adaptive quality — ignore hitches from tab switches / long tasks
    if (dt > 4 && dt < 200) {
      ema += (dt - ema) * 0.06;
      if (++sampled > 30) {
        sampled = 0;
        if (ema > 24 && tier > 0) { tier--; drops++; applyTier(); ema = 16.7; }
        else if (ema < 13 && tier < Q_MAX && drops < 2) { tier++; applyTier(); ema = 16.7; }
      }
    }

    if (dirty) { render(); dirty = false; idle = 0; }
    else if (++idle > 4 && tier < 2) { running = false; lastT = 0; return; }  // sleep when idle

    if (tier >= 2) dust(now);
    if (running) requestAnimationFrame(frame);
  }

  function ensureLoop() {
    if (running) return;
    running = true; idle = 0; lastT = 0;
    requestAnimationFrame(frame);
  }

  /* passive scroll listener — native browser scrolling is the source of truth */
  function onScroll() { dirty = true; ensureLoop(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  let rw = 0, rh = 0, rt = 0;
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    // ignore mobile browser-chrome height jitter
    if (Math.abs(w - rw) < 2 && Math.abs(h - rh) < 140) return;
    rw = w; rh = h;
    clearTimeout(rt);
    rt = setTimeout(() => { layout(); sizeDust(); dirty = true; ensureLoop(); }, 90);
    layout(); sizeDust(); dirty = true; ensureLoop();
  }

  /* ══════════════════════════════════════════════════════════════════════════
     ATMOSPHERIC DUST
     ═════════════════════════════════════════════════════════════════════════ */
  const cvs = document.getElementById('dust');
  const ctx = cvs.getContext('2d', { alpha: true });
  let dustP = [], lastDust = 0, dustReady = false;
  const DS = 0.62;                       // render the dust at 62% and upscale: soft + cheap
  const TAU = Math.PI * 2;
  const NB = 4;                          // alpha buckets → 8 fills per frame instead of ~50
  const bkC = [[], [], [], []], bkW = [[], [], [], []];

  function sizeDust() {
    cvs.width  = Math.max(1, Math.floor(vw * DS));
    cvs.height = Math.max(1, Math.floor(vh * DS));
    cvs.style.width = vw + 'px';
    cvs.style.height = vh + 'px';
    ctx.setTransform(DS, 0, 0, DS, 0, 0);

    const dense = vw < 820 ? 34000 : vw < 1200 ? 26000 : 20000;
    const count = clamp(Math.round((vw * vh) / dense), 16, 70);

    dustP = new Array(count);
    for (let i = 0; i < count; i++) {
      const z = Math.random();                    // 0 = far, 1 = near
      dustP[i] = {
        x: Math.random() * vw,
        y: Math.random() * vh,
        z, r: 0.4 + z * 1.7,
        sp: 0.06 + z * 0.30,
        par: 0.02 + z * 0.10,
        ph: Math.random() * TAU,
        white: z > 0.82, px: 0, py: 0, rr: 1, len: 0
      };
    }
    dustReady = true;
  }

  function dust(now) {
    if (!dustReady || REDUCED) return;
    if (now - lastDust < 1000 / dustFps()) return;
    const dt = Math.min(48, now - lastDust);
    lastDust = now;

    // how "in transition" we are right now
    const g = (y + vh) / segPx;
    const ti = clamp(Math.floor(g), 1, N - 1);
    const pRaw = clamp((y - (tops[ti] || ti * segPx) + vh) / transPx, 0, 1);
    const act = Math.sin(clamp(pRaw, 0, 1) * Math.PI);   // 0 at rest, 1 mid-flip

    ctx.setTransform(DS, 0, 0, DS, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    for (let i = 0; i < NB; i++) { bkC[i].length = 0; bkW[i].length = 0; }

    const drift = (0.28 + act * 1.9) * (dt / 16.67);
    const span = vh + 80;

    for (let i = 0; i < dustP.length; i++) {
      const d = dustP[i];
      d.y -= d.sp * drift;
      d.ph += 0.012 * (dt / 16.67);

      let py = d.y - (y * d.par) % span;
      if (py < -40) { py += span; d.y = py + (y * d.par) % span; }
      else if (py > span - 40) { py -= span; }

      const tw = 0.55 + 0.45 * Math.sin(d.ph);
      const a = (0.10 + d.z * 0.42) * tw;
      d.px = d.x; d.py = py;
      d.rr = d.r * (1 + act * 0.4);
      d.len = act > 0.05 && d.z > 0.45 ? 4 + act * 44 * d.z : 0;
      (d.white ? bkW : bkC)[Math.min(NB - 1, (a * NB / 0.56) | 0)].push(d);
    }

    for (let c = 0; c < 2; c++) {
      ctx.fillStyle = c ? 'rgb(225,255,253)' : 'rgb(0,240,230)';
      const sets = c ? bkW : bkC;
      for (let bi = 0; bi < NB; bi++) {
        const arr = sets[bi];
        if (!arr.length) continue;
        ctx.globalAlpha = ((bi + 0.5) / NB) * 0.56;
        ctx.beginPath();
        for (let k = 0; k < arr.length; k++) {
          const d = arr[k];
          ctx.moveTo(d.px + d.rr, d.py);
          ctx.arc(d.px, d.py, d.rr, 0, TAU);
          if (d.len) ctx.rect(d.px - d.rr * 0.4, d.py, d.rr * 0.8, d.len);
        }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     NAVIGATION
     ═════════════════════════════════════════════════════════════════════════ */
  /* No scroll interception anywhere: navigation is plain native anchor
     jumping, made smooth by `scroll-behavior: smooth` on <html>. Native
     keyboard scrolling, wheel, trackpad and touch scrolling are untouched. */

  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-goto]')) closeMenu();
  });

  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = '';
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 520);
  }
  burger.addEventListener('click', () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ══════════════════════════════════════════════════════════════════════════
     BOOT
     ═════════════════════════════════════════════════════════════════════════ */
  function boot() {
    layout();
    sizeDust();
    rw = window.innerWidth; rh = window.innerHeight;

    const mem = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    if (vw < 820 || cores <= 2 || mem <= 2) tier = 2;
    const q = /[?&]q=(\d)/.exec(location.search);   // ?q=0..3 forces a quality tier
    if (q) { tier = clamp(+q[1], 0, Q_MAX); drops = 9; }
    applyTier();

    window.scrollTo({ top: 0, behavior: 'instant' });
    y = 0;
    render();

    // hero entrance
    requestAnimationFrame(() => document.body.classList.add('is-ready'));

    ensureLoop();
    window.addEventListener('load', () => { layout(); sizeDust(); render(); }, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitText(); render(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else boot();

  /* expose a tiny instrumentation hook for browser verification */
  window.__SC = { render, layout, get segPx(){ return segPx; }, get N(){ return N; },
                  get tops(){ return tops; }, get transPx(){ return transPx; },
                  get vh(){ return vh; }, get maxScroll(){ return maxScroll; },
                  get state(){ return lastState; } };
})();
