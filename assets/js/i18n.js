/* GiGi Ventures — i18n.js  (EN ⇄ DE)
   English is the source language: it is written in the HTML and in assets/data/*.js. German is laid on top at
   load time from assets/i18n/de.common.js + de.<page>.js — plain objects { "English text": "German text" }.
   Nothing in the pages carries a translation id; the English text itself is the key. An English sentence that is
   edited but not re-translated simply stays English (see `GIGI_I18N.misses`).

   How a string is found
     • text node ................. key = its text, whitespace collapsed            "Reach"
     • element with text AND inline markup (<p>Eat <a>less</a> …</p>)
                                   key = its innerHTML, whitespace collapsed       "Eat <a href=…>less</a> …"
     • attributes ................ aria-label, title, alt, placeholder; <title>; meta description / og:*
     • mailto: subject and body .. each decoded value is a key
   Rendered-later content (charts, panels, tooltips, the mail hint) is caught by a MutationObserver, so the data
   files and renderers stay English-only.

   Numbers are NOT in the dictionary: write them the English way in the German text (1,050 · 4.6 · €0.11 · 1.05 bn)
   and `localise()` turns them into 1.050 · 4,6 · 0,11 € · 1,05 Mrd. once, when the text reaches the page.

   Switching language stores the choice (localStorage "gigi-lang") and reloads the page, so every renderer simply
   runs again in the right language. ?lang=de | ?lang=en overrides and is remembered. First visit: the browser language. */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const me = doc.currentScript;
  const STORE = 'gigi-lang';
  const LANGS = ['en', 'de'];

  /* ---------- Which language ---------- */
  let stored = null;
  try { stored = window.localStorage.getItem(STORE); } catch (e) { /* storage blocked: fine */ }
  const asked = new URLSearchParams(window.location.search).get('lang');
  const lang = LANGS.includes(asked) ? asked : LANGS.includes(stored) ? stored : 'en';
  if (LANGS.includes(asked)) {
    try { window.localStorage.setItem(STORE, asked); } catch (e) { /* ignore */ }
  }

  root.lang = lang;
  root.dataset.lang = lang;

  let dictionariesReady = Promise.resolve();

  /* German: load this page's dictionaries before applying any translations. */
  if (lang === 'de' && me && me.src) {
    const dir = me.src.replace(/js\/i18n\.js(\?.*)?$/, 'i18n/');
    const page = (me.dataset && me.dataset.page) || 'index';
    root.dataset.i18n = 'pending';
    const style = doc.createElement('style');
    style.textContent = 'html[data-i18n="pending"] body{visibility:hidden}';
    doc.head.appendChild(style);
    dictionariesReady = Promise.all(['common', page].map((name) => new Promise((resolve) => {
      const script = doc.createElement('script');
      script.src = `${dir}de.${name}.js`;
      script.onload = resolve;
      script.onerror = resolve;
      doc.head.appendChild(script);
    })));
    window.setTimeout(() => root.removeAttribute('data-i18n'), 5000); // never leave the page blank
  }

  let dict = null;
  const misses = new Set();

  /* ---------- Helpers ---------- */
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const prose = (s) => /[A-Za-zÀ-ÿ]{2}/.test(s);

  /* English number style → German. Applied once, to text that is about to be shown. */
  const KEEP = /(?:SDG|ISO|Art\.|§|No\.|Nr\.|v)\s?$/; // "SDG 12.3" is a name, not a decimal
  const swap = (c) => (c === ',' ? '.' : ',');
  const localise = (s) => {
    if (!/\d/.test(s)) return s;
    return s
      .replace(/\d[\d.,]*\d/g, (m, at, whole) => {
        if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(m)) return m.replace(/[.,]/g, swap);
        if (/^\d+\.\d+$/.test(m) && !KEEP.test(whole.slice(Math.max(0, at - 6), at))) return m.replace('.', ',');
        return m;
      })
      .replace(/€(\d(?:[\d.,]*\d)?)(–\d(?:[\d.,]*\d)?)?/g, '$1$2 €')
      .replace(/(\d)\s?bn\b/g, '$1 Mrd.');
  };

  /* t('English {n}', { n: 3 }) — for strings a script builds itself. Returns the German text (numbers not yet localised:
     the DOM pass does that when the text lands on the page). */
  const t = (en, vars) => {
    const hit = dict && dict[norm(en)];
    const out = hit === undefined || hit === null ? en : hit;
    return vars ? out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : out;
  };

  /* ---------- The walker (one function for "apply" and for "collect the keys") ---------- */
  const SKIP = new Set(['script', 'style', 'noscript', 'template', 'textarea', 'iframe', 'canvas']);
  const NOT_INLINE = ':not(a,b,strong,em,i,span,sup,sub,br,abbr,small,mark,time,cite,q,code,wbr,del,ins,s,u,kbd,bdi,tspan)';
  const ATTRS = ['aria-label', 'title', 'alt', 'placeholder'];
  const done = new WeakMap();      // text node → the value it holds after we handled it
  const doneEls = new WeakSet();   // elements whose innerHTML we replaced

  const mixed = (el) => {
    let direct = false;
    let tags = false;
    for (let c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) { if (/\S/.test(c.nodeValue)) direct = true; } else if (c.nodeType === 1) tags = true;
    }
    return direct && tags && !el.querySelector(NOT_INLINE);
  };
  const markDone = (el) => {
    const w = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) done.set(n, n.nodeValue);
  };

  const attr = (el, name, out) => {
    const v = el.getAttribute(name);
    if (!v || !prose(v)) return;
    const k = norm(v);
    if (out) { out.add(k); return; }
    const d = dict[k];
    if (d !== undefined) el.setAttribute(name, localise(d)); else misses.add(k);
  };

  const mail = (el, out) => {
    const href = el.getAttribute('href');
    const q = href ? href.indexOf('?') : -1;
    if (q < 0 || href.slice(0, 7) !== 'mailto:') return;
    const params = new URLSearchParams(href.slice(q + 1));
    let changed = false;
    ['subject', 'body'].forEach((name) => {
      const v = params.get(name);
      if (!v) return;
      if (out) { out.add(v); return; }
      const d = dict[v];
      if (d !== undefined) { params.set(name, localise(d)); changed = true; } else misses.add(v);
    });
    if (changed) {
      const rebuilt = Array.from(params.entries()).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
      el.setAttribute('href', `${href.slice(0, q)}?${rebuilt}`);
    }
  };

  const text = (n, out) => {
    const raw = n.nodeValue;
    if (!/\S/.test(raw) || done.get(n) === raw) return;
    const k = norm(raw);
    if (out) { if (prose(k)) out.add(k); return; }
    const d = dict[k];
    let next = raw;
    if (d !== undefined) next = raw.match(/^\s*/)[0] + localise(d) + raw.match(/\s*$/)[0];
    else {
      next = localise(raw);
      if (prose(k)) misses.add(k);
    }
    if (next !== raw) n.nodeValue = next;
    done.set(n, n.nodeValue);
  };

  const visit = (node, out) => {
    if (node.nodeType === 3) { text(node, out); return; }
    if (node.nodeType !== 1 || SKIP.has(node.localName) || node.getAttribute('translate') === 'no') return;
    ATTRS.forEach((a) => attr(node, a, out));
    if (node.localName === 'a') mail(node, out);
    if (!node.firstChild) return;
    if (!doneEls.has(node) && mixed(node)) {
      const k = norm(node.innerHTML);
      if (out) { out.add(k); return; }
      const d = dict[k];
      if (d !== undefined) {
        node.innerHTML = localise(d);
        doneEls.add(node);
        markDone(node);
        return;
      }
      misses.add(k);
    }
    for (let c = node.firstChild; c;) {
      const next = c.nextSibling;
      visit(c, out);
      c = next;
    }
  };

  const head = (out) => {
    const one = (get, set) => {
      const v = get();
      if (!v || !prose(v)) return;
      const k = norm(v);
      if (out) { out.add(k); return; }
      const d = dict[k];
      if (d !== undefined) set(localise(d)); else misses.add(k);
    };
    one(() => doc.title, (v) => { doc.title = v; });
    doc.querySelectorAll('meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]').forEach((m) => {
      if (m.getAttribute('property') === 'og:type') return;
      one(() => m.getAttribute('content'), (v) => m.setAttribute('content', v));
    });
  };

  const collect = (scope) => {
    const out = new Set();
    head(out);
    visit(scope || doc.body, out);
    return Array.from(out);
  };

  /* ---------- Switch ---------- */
  const syncSwitches = () => {
    doc.querySelectorAll('[data-lang-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langSet === lang)));
  };
  doc.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-lang-set]');
    if (!b || b.dataset.langSet === lang || !LANGS.includes(b.dataset.langSet)) return;
    try { window.localStorage.setItem(STORE, b.dataset.langSet); } catch (err) { /* ignore */ }
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', b.dataset.langSet);
      window.location.replace(url.href);
    } else {
      window.location.reload();
    }
  });

  /* ---------- Go ---------- */
  const start = () => {
    dict = lang === 'de' ? (window.GIGI_DICT || {}) : null;
    syncSwitches();
    if (!dict) return;
    head(null);
    visit(doc.body, null);
    root.removeAttribute('data-i18n');
    const obs = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'characterData') { if (r.target.isConnected) text(r.target, null); } else if (r.type === 'attributes') {
          if (r.target.isConnected) attr(r.target, r.attributeName, null);
        } else {
          r.addedNodes.forEach((n) => { if (n.isConnected) visit(n, null); });
        }
      }
      obs.takeRecords(); // what we just wrote ourselves
    });
    obs.observe(doc.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };
  const startWhenReady = () => dictionariesReady.then(start);
  if (doc.readyState === 'complete') startWhenReady(); else window.addEventListener('load', startWhenReady, { once: true });

  window.GIGI_I18N = Object.freeze({
    lang,
    t,
    localise,
    collect,
    apply: (scope) => { if (dict) visit(scope || doc.body, null); },
    get misses() { return Array.from(misses); },
  });
})();
