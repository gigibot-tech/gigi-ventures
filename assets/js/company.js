/* GiGi Ventures — company.js
   Role counts, team filters and deep links (#role-…) for the careers list.
   Roles live in company.html so they render (and index) without JavaScript. */
(() => {
  'use strict';

  const roles = Array.from(document.querySelectorAll('[data-role]'));
  document.querySelectorAll('[data-role-count]').forEach((el) => {
    el.textContent = String(roles.length);
  });

  const filters = document.querySelector('[data-filters]');
  const empty = document.querySelector('[data-roles-empty]');
  if (filters) {
    const buttons = Array.from(filters.querySelectorAll('button[data-filter]'));
    buttons.forEach((btn) => {
      const team = btn.dataset.filter;
      const n = team === 'all' ? roles.length : roles.filter((r) => r.dataset.team === team).length;
      const badge = document.createElement('span');
      badge.className = 'c-filters__n';
      badge.textContent = String(n);
      btn.append(' ', badge); // the space keeps the accessible name "All 8", not "All8"
      if (team !== 'all' && n === 0) btn.hidden = true;
    });

    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      const team = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      roles.forEach((role) => {
        const match = team === 'all' || role.dataset.team === team;
        role.hidden = !match;
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  // Deep link straight into a role: company.html#role-food-ops
  const openFromHash = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target && target.matches('details[data-role]')) {
      target.hidden = false;
      target.open = true;
    }
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
