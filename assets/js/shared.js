/* GiGi Ventures — shared.js
   Header state, mobile menu, mail-link hint, reveal-on-scroll, optional time-on-page counters. */
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

  /* ---------- Mail links: say what is happening, and offer the address if no mail app opens ---------- */
  (() => {
    let toast = null;
    let hideTimer = 0;
    const hide = () => {
      if (toast) toast.classList.remove('is-on');
      window.clearTimeout(hideTimer);
    };
    const copy = (text, btn) => {
      const done = () => { btn.textContent = 'Copied ✓'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, () => {});
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { if (document.execCommand('copy')) done(); } catch (e) { /* nothing to do */ }
      ta.remove();
    };
    const show = (addr) => {
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'mail-toast';
        toast.setAttribute('role', 'status');
        const msg = document.createElement('p');
        msg.className = 'mail-toast__msg';
        const who = document.createElement('strong');
        who.className = 'mail-toast__addr';
        msg.append('Opening your mail app. If nothing opens, write to ', who, '.');
        const cp = document.createElement('button');
        cp.type = 'button';
        cp.className = 'mail-toast__btn';
        cp.dataset.copy = '';
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'mail-toast__x';
        x.setAttribute('aria-label', 'Close');
        x.textContent = '×';
        toast.append(msg, cp, x);
        document.body.appendChild(toast);
        cp.addEventListener('click', () => copy(toast.dataset.addr, cp));
        x.addEventListener('click', hide);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
      }
      toast.dataset.addr = addr;
      toast.querySelector('.mail-toast__addr').textContent = addr;
      toast.querySelector('[data-copy]').textContent = 'Copy address';
      toast.classList.add('is-on');
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hide, 14000);
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="mailto:"]');
      if (!a) return;
      let addr = a.getAttribute('href').slice(7).split('?')[0];
      try { addr = decodeURIComponent(addr); } catch (err) { /* keep it as is */ }
      show(addr);
    });
  })();

  window.GiGi = Object.freeze({ reduceMotion });
})();
