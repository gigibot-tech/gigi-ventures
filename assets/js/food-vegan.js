/* GiGi Ventures — food-vegan.js
   Free-meal calculator and segmented-bar label fitting (food.html).
   Bar charts on both pages animate through the shared reveal (.is-in). */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // How many meals can be free? Paying guests must average opex / (1 − free share).
  const range = $('[data-free-range]');
  if (range) {
    const OPEX = 0.79;
    const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
    const freeOut = $('[data-free-out]');
    const needOut = $('[data-need-out]');
    const payOut = $('[data-pay-out]');
    const update = () => {
      const pct = Number(range.value);
      if (freeOut) freeOut.textContent = `${pct}%`;
      if (needOut) needOut.textContent = eur.format(OPEX / (1 - pct / 100));
      if (payOut) payOut.textContent = `${100 - pct}%`;
      range.style.setProperty('--fill', `${(pct / Number(range.max || 100)) * 100}%`);
    };
    range.addEventListener('input', update);
    update();
  }

  // Segmented bar: print a share inside its block only if it fits; otherwise the legend carries it.
  const segbar = $('[data-segbar]');
  if (segbar) {
    const fit = () => {
      $$('.seg', segbar).forEach((seg) => {
        const label = $('.seg__val', seg);
        const fits = seg.clientWidth >= label.scrollWidth + 14;
        seg.classList.toggle('is-tight', !fits);
        const legendShare = $(`[data-leg-share="${seg.dataset.seg}"]`);
        if (legendShare) legendShare.hidden = fits;
      });
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }
})();
