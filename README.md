# SOLUTIONS CASTLE — premium 3D editorial website

A single, continuous cinematic 3D world for **Solutions Castle** (IT Services & Training):
10 editorial sections connected by 9 **SO-powered 3D transitions**, driven entirely by
**native browser scrolling**.

```bash
npm start          # http://localhost:3000
npm run verify     # 19 automated browser checks (Playwright)
```

No build step, no runtime dependencies — plain HTML / CSS / ES2019 JS.

---

## 1 · Architecture

```
native document scroll
        ↓
window.scrollY                     ← passive listener, never preventDefault
        ↓
section-relative progress          ← scrollY − section.offsetTop + innerHeight
        ↓
requestAnimationFrame
        ↓
3D transforms (perspective · rotateX · translateZ · scale)
        ↓
SO transition
        ↓
next section
```

* **The document really scrolls.** `<main id="track">` holds 10 `<section class="scroll-section">`
  whose height is set in **px** from JS (`--seg-px`), giving 10 × 1.6vh of real scrollable
  height (14 400px on a 900px viewport). Nothing is `overflow:hidden`; no wheel/touch
  listener exists anywhere in the codebase.
* **Each section owns a `position:fixed` panel.** The markup stays semantic (real
  `<section>` → real `<h1>/<h2>`), while the panel is lifted out of the flow so it can be
  rotated in 3D. The scroll sections provide the height; the panels provide the picture.
* **One passive scroll listener** flips a `dirty` flag; a `requestAnimationFrame` loop does
  all the work. `render()` costs **0.04 ms**.

### Section-relative progress (the Jack reference principle)

```js
const sectionTop  = tops[t];                       // cached section.offsetTop
const localScroll = window.scrollY - sectionTop + window.innerHeight;
const p           = clamp(localScroll / transPx, 0, 1);   // transPx = innerHeight
```

At `p = 0` section *t−1* owns the screen; at `p = 1` section *t* does. Because the state is
**derived from scroll position** and never from a timer:

| scroll | what you see |
|---|---|
| 0 % | Section A is active |
| 25 % | A begins rotating backward |
| 50 % | A is deep in 3D space · **SO** fills the centre |
| 75 % | B starts emerging from behind the SO |
| 100 % | B is fully active |

Stop at 52 % and it **stays at 52 %**. Scroll up and it reverses — there is no separate
reverse animation, because there is no animation, only a function of `scrollY`.

### The flip

```js
// outgoing                       // incoming
rotateX  0°   → −66°              rotateX  62°  → 0°
translateZ 0  → −920px            translateZ −1500px → 0
scale    1    → 0.76              scale    0.80 → 1
opacity  1    → 0   (12–72 %)     opacity  0 → 1      (35–92 %)
```

Applied as `perspective(Npx) translate3d(…) rotateX(…) scale(…)` per panel, so no shared
3D context is needed and paint order stays predictable (out 21 → in 20 → SO 30).

## 2 · The SO — transition identity

`/public/So.png` is used verbatim (never redrawn, never re-created in CSS, never
distorted — only `transform`, `opacity` and `drop-shadow`). A **single** SO element is
reused for all 9 transitions, each with its own motion:

| # | Transition | Motion |
|---|---|---|
| 01 | Hero → Who We Are | emerges from depth, moves toward camera, controlled Y rotation |
| 02 | Who We Are → What We Do | X-tilt + forward move + cyan energy pulse |
| 03 | What We Do → IT Services | controlled Y rotation |
| 04 | IT Services → Training | expands into a portal, camera moves through the SO |
| 05 | Training → How We Work | orbital rotation |
| 06 | How We Work → Industries | becomes the central hub (rings + axis beams) |
| 07 | Industries → The Connection | travels to the panoramic centre |
| 08 | The Connection → Two Destinations | expands and creates two directions |
| 09 | Two Destinations → Final CTA | returns to centre and settles (with overshoot) |

The SO also appears **inside** sections 08 (The Connection) and 09 (Two Destinations).

## 3 · Files

```
index.html                 10 sections · nav · mobile menu · SO stage · debug overlay
assets/css/fonts.css       self-hosted Plus Jakarta Sans + Syne (woff2, no CDN)
assets/css/main.css        design system, atmosphere, panels, 3D, responsive, a11y
assets/js/main.js          scroll engine · 9 SO motions · dust canvas · adaptive quality
public/logo.png            the supplied logo lock-up
public/logo-clear.png      the same artwork with the flat #033349 backdrop keyed out
public/So.png              the supplied SO symbol — the transition identity
public/fonts/*.woff2
tools/serve.js             zero-dependency static server
tools/verify.mjs           19 real-browser checks
tools/{filmstrip,perf,audit}.mjs · tools/{analyze,metrics}.py   QA helpers
```

> **Note on `logo.png`:** the supplied file has a solid `#033349` square behind the
> wordmark. `logo-clear.png` is that exact artwork with the flat backdrop keyed to
> transparency (no redraw) so the logo sits cleanly on the `#02131E` page. Both files ship.

## 4 · Design system

* **Colour** — deep navy `#02131E` / `#051B2C`, energy cyan `#00CFC8` / `#00F0E6`,
  white. No other hues.
* **Type** — Plus Jakarta Sans (300/400/500/600/800) for everything, including headlines;
  Syne only for short accents (stage names, nexus labels, mobile menu). Headlines are
  size-fitted to their column at runtime (`data-fit`) so nothing ever breaks out.
* **Atmosphere** — fine architectural grid, two soft cyan glows, drifting dust, film grain,
  vignette; per-section line-work (castle skyline, infrastructure traces, concentric arcs,
  orbital paths, converging rays) at 5–14 % opacity.

## 5 · Performance

* `render()` = **0.04 ms**, canvas draw = **0.03 ms** — transform/opacity only.
* Dust canvas renders at 62 % and upscales; draws are batched into 8 alpha buckets and
  capped at 30 fps.
* **Adaptive quality** — a rolling frame-time average sheds load automatically
  (`3` full → `2` dust@20fps → `1` no dust → `0` no dust/grain/glow). Forced with `?q=0…3`.
* The rAF loop **stops itself** when the page is idle and the dust is off.
* Removed `filter: blur(90px)` from the parallax glows and the third `drop-shadow` from
  the SO — both were re-rasterising every frame.

## 6 · Accessibility & responsive

* `prefers-reduced-motion` → no 3D rotation, calm cross-fade, SO still bridges the sections,
  dust/grain/looping animations off, scrolling untouched.
* Only the settled section is interactive (`inert` on the rest), `aria-current` on the active
  nav link, visible `:focus-visible` rings, real heading order.
* Tablet reduces geometry; mobile keeps the **full** concept — native scrolling, the 3D flip,
  the SO transition, editorial type, burger menu — with a smaller perspective and fewer
  particles.
* Works without JS (`.no-js`): panels stack into a normal scrolling document.

## 7 · Debug overlay

Append **`?debug`** to the URL for `SCROLL Y / SECTION x / 10 / PROGRESS / TRANSITION`.
It is opt-in, so the shipped experience is clean.

## 8 · Verification

`npm run verify` drives a real Chromium and checks: real document height, no scroll lock,
real mouse-wheel + trackpad + touch scrolling, all 10 rest positions, all 9 transitions
(rotation, depth, foreshortening **and rendered geometry**), 9 distinct SO motions,
hold-at-52 %, reverse-scroll equality, full wheel journey down and back up, no wheel /
`preventDefault` / virtual-scroll in the source, content fit, reduced motion, mobile, tablet,
brand assets and console errors.

Screenshots land in `shots/`.
