/* ============================================================================
   SOLUTIONS CASTLE — Internal Pages Interactive Engine
   Handles: Navigation, Mobile Menu, Dust Canvas, Sliders, Catalog Filter, FAQ, Forms
   ========================================================================= */
(() => {
  'use strict';

  // ── Navigation & Sticky Header ──────────────────────────────────────────
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  function onScroll() {
    if (!nav) return;
    const y = window.scrollY || window.pageYOffset || 0;
    nav.classList.toggle('is-stuck', y > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile Menu ─────────────────────────────────────────────────────────
  if (burger && menu) {
    function openMenu() {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
    }
    function closeMenu() {
      if (!menu.classList.contains('is-open')) return;
      menu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 450);
    }
    burger.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => {
      if (e.target.closest('.menu__nav a')) closeMenu();
    });
  }

  // ── SlideTabs Navigation Indicator ───────────────────────────────────────
  function initSlideTabs() {
    const navContainer = document.querySelector('.nav__links');
    if (!navContainer) return;

    let pill = navContainer.querySelector('.nav__pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'nav__pill';
      pill.setAttribute('aria-hidden', 'true');
      navContainer.prepend(pill);
    }

    const links = Array.from(navContainer.querySelectorAll('.nav__link'));
    if (links.length === 0) return;

    function getActiveLink() {
      const rawPath = window.location.pathname.replace(/\/index\.html$/, '/');
      const path = (rawPath === '' || rawPath === '/solutions-it' || rawPath === '/solutions-it/') ? '/' : rawPath;
      
      let active = null;
      if (path === '/') {
        active = links.find(l => {
          const href = l.getAttribute('href');
          return href === '/' || href === '/index.html' || href === './' || href === '#section-1';
        }) || links[0];
      } else {
        links.forEach(l => {
          const href = l.getAttribute('href');
          if (!href.startsWith('#')) {
            const cleanHref = href.split('#')[0].replace(/\/index\.html$/, '/');
            if (cleanHref !== '/' && cleanHref !== '' && path.startsWith(cleanHref)) {
              active = l;
            }
          }
        });
      }
      return active || links[0];
    }

    function movePillTo(el, instant = false) {
      if (!el) {
        pill.classList.remove('is-visible');
        links.forEach(l => l.classList.remove('is-pill-active'));
        return;
      }
      const containerRect = navContainer.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const left = elRect.left - containerRect.left;
      const width = elRect.width;

      if (instant) {
        pill.style.transition = 'none';
      }
      pill.style.transform = `translateX(${left}px)`;
      pill.style.width = `${width}px`;
      pill.classList.add('is-visible');

      if (instant) {
        pill.offsetHeight;
        requestAnimationFrame(() => {
          pill.style.transition = '';
        });
      }

      links.forEach(l => {
        l.classList.toggle('is-pill-active', l === el);
      });
    }

    function resetToActive(instant = false) {
      const active = getActiveLink() || links[0];
      links.forEach(l => {
        const isCurrent = (l === active);
        l.classList.toggle('is-current', isCurrent);
        if (isCurrent) l.setAttribute('aria-current', 'page');
        else l.removeAttribute('aria-current');
      });
      movePillTo(active, instant);
    }

    // Initial placement (snap instantly, then confirm once fonts/layout settle)
    resetToActive(true);
    requestAnimationFrame(() => {
      resetToActive(true);
      setTimeout(() => resetToActive(true), 80);
      setTimeout(() => resetToActive(true), 250);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => resetToActive(true));
    }

    links.forEach(link => {
      link.addEventListener('mouseenter', () => movePillTo(link, false));
      link.addEventListener('focus', () => movePillTo(link, false));
    });

    navContainer.addEventListener('mouseleave', () => {
      resetToActive(false);
    });

    window.addEventListener('resize', () => {
      resetToActive(true);
    }, { passive: true });

    window.addEventListener('sc:languageChanged', () => {
      setTimeout(() => resetToActive(true), 50);
    });
  }
  initSlideTabs();

  // ── Cinematic Editorial Sliders ─────────────────────────────────────────
  function initSliders() {
    const sliders = Array.from(document.querySelectorAll('.sc-slider'));
    sliders.forEach(slider => {
      const track = slider.querySelector('.sc-slider__track');
      const slides = Array.from(slider.querySelectorAll('.sc-slider__slide'));
      const prevBtn = slider.querySelector('.sc-slider__btn--prev');
      const nextBtn = slider.querySelector('.sc-slider__btn--next');
      const counter = slider.querySelector('.sc-slider__counter');
      const dots = Array.from(slider.querySelectorAll('.sc-slider__dot'));
      if (!track || slides.length === 0) return;

      let current = 0;
      const total = slides.length;

      function update(index) {
        current = (index + total) % total;
        slider.dataset.activeSlide = String(current);
        const isRtl = document.documentElement.dir === 'rtl';
        const offset = current * -100;
        track.style.transform = `translateX(${isRtl ? -offset : offset}%)`;

        if (counter) {
          const curStr = String(current + 1).padStart(2, '0');
          const totStr = String(total).padStart(2, '0');
          counter.textContent = `${curStr} / ${totStr}`;
        }

        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === current);
        });
      }

      slider.dataset.activeSlide = '0';

      if (prevBtn) prevBtn.addEventListener('click', () => update(current - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => update(current + 1));

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => update(idx));
      });

      // Keyboard arrow navigation on hover/focus
      slider.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') update(document.documentElement.dir === 'rtl' ? current + 1 : current - 1);
        if (e.key === 'ArrowRight') update(document.documentElement.dir === 'rtl' ? current - 1 : current + 1);
      });

      // Swipe support
      let startX = 0;
      slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) update(document.documentElement.dir === 'rtl' ? current + 1 : current - 1);
          else update(document.documentElement.dir === 'rtl' ? current - 1 : current + 1);
        }
      }, { passive: true });

      // Language change refresh
      window.addEventListener('sc:languageChanged', () => update(current));

      update(0);
    });
  }
  initSliders();

  // ── Training Catalog Filter Tabs ────────────────────────────────────────
  const catalogTabs = Array.from(document.querySelectorAll('.catalog-tab'));
  const catalogPanels = Array.from(document.querySelectorAll('.catalog-panel'));

  if (catalogTabs.length > 0) {
    catalogTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        catalogTabs.forEach(t => t.classList.remove('is-active'));
        catalogPanels.forEach(p => p.classList.remove('is-active'));

        tab.classList.add('is-active');
        const targetId = tab.dataset.target;
        const panel = document.getElementById(targetId) || catalogPanels[index];
        if (panel) panel.classList.add('is-active');
      });
    });
  }

  // ── Contact FAQ Accordion ───────────────────────────────────────────────
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('is-open');
      });
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // ── Form Submit Feedback UX ─────────────────────────────────────────────
  const forms = Array.from(document.querySelectorAll('form[data-ajax="false"], .ajax-form'));
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .btn');
      const feedback = form.querySelector('.form-feedback');
      const isAr = document.documentElement.lang === 'ar';

      if (btn) {
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = isAr ? 'جاري الإرسال...' : 'Sending request...';
        setTimeout(() => {
          btn.innerHTML = isAr ? 'تم الإرسال بنجاح ✓' : 'Submitted successfully ✓';
          btn.style.background = 'var(--cyan-400)';
          btn.style.color = 'var(--navy-900)';
          if (feedback) {
            feedback.classList.add('is-visible');
            feedback.textContent = isAr
              ? 'شكراً لتواصلك. تم استلام طلبك بنجاح وسيتواصل معك مستشارنا خلال يوم عمل واحد.'
              : 'Thank you for reaching out. Your request has been received and our consultant will contact you within 1 business day.';
          }
          form.reset();
          setTimeout(() => {
            btn.innerHTML = origText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '';
            btn.style.color = '';
          }, 4500);
        }, 350);
      }
    });
  });

  // ── Atmospheric Canvas Dust Simulation ──────────────────────────────────
  const cvs = document.getElementById('dust');
  if (cvs) {
    const ctx = cvs.getContext('2d', { alpha: true });
    let dustP = [];
    let vw = window.innerWidth, vh = window.innerHeight;
    const DS = 0.62;
    const TAU = Math.PI * 2;

    function resizeDust() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      cvs.width = Math.max(1, Math.floor(vw * DS));
      cvs.height = Math.max(1, Math.floor(vh * DS));
      cvs.style.width = vw + 'px';
      cvs.style.height = vh + 'px';
      ctx.setTransform(DS, 0, 0, DS, 0, 0);

      const count = Math.min(45, Math.max(16, Math.round((vw * vh) / 32000)));
      dustP = new Array(count);
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        dustP[i] = {
          x: Math.random() * vw,
          y: Math.random() * vh,
          z, r: 0.5 + z * 1.5,
          sp: 0.08 + z * 0.25,
          ph: Math.random() * TAU,
          white: z > 0.82
        };
      }
    }

    let lastT = 0;
    function loopDust(now) {
      const dt = lastT ? Math.min(40, now - lastT) : 16.7;
      lastT = now;

      ctx.setTransform(DS, 0, 0, DS, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      for (let i = 0; i < dustP.length; i++) {
        const d = dustP[i];
        d.y -= d.sp * (dt / 16.7);
        d.ph += 0.015 * (dt / 16.7);

        if (d.y < -20) d.y = vh + 20;

        const a = (0.12 + d.z * 0.40) * (0.6 + 0.4 * Math.sin(d.ph));
        ctx.fillStyle = d.white ? `rgba(225,255,253,${a})` : `rgba(0,240,230,${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, TAU);
        ctx.fill();
      }

      requestAnimationFrame(loopDust);
    }

    window.addEventListener('resize', resizeDust, { passive: true });
    resizeDust();
    requestAnimationFrame(loopDust);
  }
})();
