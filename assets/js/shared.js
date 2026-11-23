/* GiGi Ventures — shared.js
   Header state, mobile menu, reveal-on-scroll, optional time-on-page counters. */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: scrolled state + colour of the section underneath ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const adaptive = header.hasAttribute('data-adaptive');
    const sections = adaptive ? Array.from(document.querySelectorAll('[data-surface]')) : [];
    let ticking = false;

    const update = () => {
      ticking = false;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      if (!adaptive) return;
      const probe = header.offsetHeight / 2;
      for (const section of sections) {
        const r = section.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          const theme = section.dataset.surface;
          if (header.dataset.theme !== theme) header.dataset.theme = theme;
          break;
        }
      }
    };
    const queue = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    const setMenu = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if (header) header.classList.toggle('is-open', open);
      if (open) {
        const first = menu.querySelector('a');
        if (first) first.focus();
      }
    };
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.matchMedia('(min-width: 1120px)').addEventListener('change', (mq) => {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Optional time-on-page counters ([data-time-on-page]) ---------- */
  const start = performance.now();
  const timeEls = Array.from(document.querySelectorAll('[data-time-on-page]'));
  const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const human = (s) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return m ? `${m} min ${r} s` : `${r} s`;
  };
  const tick = () => {
    const s = (performance.now() - start) / 1000;
    timeEls.forEach((el) => {
      el.textContent = el.dataset.timeOnPage === 'human' ? human(s) : clock(s);
    });
  };
  if (timeEls.length) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  window.GiGi = Object.freeze({ reduceMotion });
})();
