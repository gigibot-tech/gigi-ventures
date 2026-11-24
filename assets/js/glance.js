/* GiGi Ventures — glance.js
   Renders the data-driven blocks from assets/data/*.js:
     [data-levers]     → levers.html  The total system: consumed vs wasted per region, and what each lever can reach
     [data-totals]     → vegan.html  A · total food (eaten + wasted) per level, A.1 waste | A.2 consumption, the meat directly under each
     [data-waste]      → vegan.html  B · ONE section, one switch (weight | animal lives): the chain, the gaps, the foldable drill-downs
     [data-consumption]→ vegan.html  C · what the eaten meat is made of, Europe from supply to plate
     [data-foodglance] → food.html   KPIs + decision gates                            (GIGI_DATA.food)
     [data-notes]      → "When a number changes": the ≠a notes behind the marks             (GIGI_DATA.notes)
   The shared helpers are exported as window.GIGI_UI for assets/js/projection.js (the projection page).
   All text goes in with textContent / text nodes (data is treated as untrusted). No dependencies.
   Source footnotes are numbered by the order of `sources` in the data file — the same order as the
   numbered "Sources & method" list — and link to #src-<key> (or `href`); following one opens that
   closed <details> list. */
(() => {
  'use strict';

  const DATA = window.GIGI_DATA || {};

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  // <ul>/<ol> with an explicit role so list semantics survive `list-style: none` in Safari.
  const list = (cls, tag = 'ul') => {
    const n = el(tag, cls);
    n.setAttribute('role', 'list');
    return n;
  };
  const link = (href, text, cls) => {
    const a = el('a', cls, text);
    a.href = href;
    return a;
  };
  const hidden = (node) => {
    node.setAttribute('aria-hidden', 'true');
    return node;
  };
  const fmt = (v, digits) => v.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const pc = (v, digits = 1) => `${fmt(v * 100, digits)}%`;

  /* ---------- Number notes: the same thing, a different number ---------- */
  let NOTES = {};
  let NOTE_WORD = 'Number note';
  const USED = new Set();
  const setNotes = (d) => {
    const all = (window.GIGI_DATA && window.GIGI_DATA.notes) || [];
    NOTES = Object.fromEntries(all.map((n) => [n.id, n]));
    NOTE_WORD = (d && d.ui && d.ui.noteMark) || NOTE_WORD;
  };
  // ≠i ≠ii … — each mark links to the note under the page: what changed, and where the other versions are.
  const marks = (ids) => {
    const wrap = el('span', 'nmarks');
    [].concat(ids || []).forEach((id) => {
      const n = NOTES[id];
      if (!n) return;
      USED.add(id);
      const a = link(`#note-${id}`, `≠${id}`);
      a.setAttribute('aria-label', `${NOTE_WORD} ${id}: ${n.topic}`);
      const sup = el('sup', 'nmark');
      sup.appendChild(a);
      wrap.append(' ', sup);
    });
    return wrap;
  };

  /* ---------- Source footnotes (one numbering per page) ---------- */
  const footnotes = (sources) => {
    const keys = Object.keys(sources);
    const number = (key) => keys.indexOf(key) + 1;
    const target = (key) => sources[key].href || `#src-${key}`;

    // "Klaura et al. 2023 [1], GfK 2020 [10]" — each [n] is a link with a full accessible name.
    const cite = (srcKeys, used, compact) => {
      const span = el('span', compact ? 'fn fn--compact' : 'fn');
      [].concat(srcKeys).forEach((key, i) => {
        const s = sources[key];
        if (!s) return;
        if (used && !used.includes(key)) used.push(key);
        if (i) span.append(compact ? ' ' : ', ');
        if (!compact) span.append(`${s.short} `);
        const sup = el('sup');
        const n = number(key);
        const a = link(target(key), `[${n}]`);
        a.setAttribute('aria-label', `Source ${n}: ${s.label}`);
        sup.appendChild(a);
        span.appendChild(sup);
      });
      return span;
    };

    // The sources one block used, spelled out under it, in number order.
    const summary = (heading, used) => {
      const p = el('p', 'gnotes');
      p.appendChild(el('span', 'gnotes__h', heading));
      used
        .slice()
        .sort((a, b) => number(a) - number(b))
        .forEach((key) => p.append(' ', link(target(key), `[${number(key)}] ${sources[key].label}`, 'gnotes__a')));
      return p;
    };
    return { cite, summary };
  };

  /* ---------- Shared pieces ---------- */
  // Thin bar + caption. The bar is decoration; the caption carries the value for everyone.
  const meter = (v, showValue = true) => {
    const wrap = el('div', 'gviz');
    const bar = hidden(el('div', 'gmeter'));
    const fill = el('span', 'gmeter__fill');
    fill.style.setProperty('--v', `${Math.min(100, Math.max(v.value, 1))}%`);
    bar.appendChild(fill);
    wrap.append(bar, el('p', 'gviz__cap', showValue ? `${v.value}% ${v.caption}` : v.caption));
    return wrap;
  };

  const tagsFor = (item, ui) => {
    const tags = el('div', 'gfact__tags');
    const kind = item.kind || 'sourced';
    const main = { sourced: ['mtag', ui.sourced], scenario: ['mtag mtag--scenario', ui.scenario], gap: ['mtag mtag--gap', ui.gap], invalid: ['mtag mtag--invalid', ui.invalid] }[kind];
    tags.appendChild(el('span', main[0], item.tag || main[1]));
    (item.tags || []).forEach((t) => tags.appendChild(el('span', `mtag mtag--${t.tone || 'flag'}`, t.text)));
    return tags;
  };

  /* ---------- A number with its unit: the digits big, the unit small and tight against them — one cluster, never split across lines ---------- */
  const numUnit = (text) => {
    const m = /^([≈≥≤<>~]\s*)?(\d[\d.,]*)(?:\s*(\S.*))?$/.exec(String(text).trim());
    if (!m) return document.createTextNode(text);
    const wrap = el('span', 'nv');
    if (m[1]) wrap.appendChild(el('span', 'nv__pre', `${m[1].trim()}\u00a0`));
    wrap.appendChild(el('span', 'nv__n', m[2]));
    if (m[3]) wrap.appendChild(el('span', 'nv__u', `\u00a0${m[3].replace(/ /g, '\u00a0')}`));
    return wrap;
  };

  /* ---------- Drill-down links: a number that goes somewhere wears the colour of where it goes — and says so in words ---------- */
  let DD = {};
  let DRILL_TO = 'Drill down to';
  const ddLink = (dd, href, text) => {
    const a = link(href, '', `dd dd--${dd}`);
    a.appendChild(numUnit(text));
    if (DD[dd]) a.setAttribute('aria-label', `${text}: ${DRILL_TO.toLowerCase()} ${DD[dd].title.toLowerCase()}`);
    return a;
  };
  // The destination in words, in its colour; a link when it has somewhere to go.
  const ddChip = (dd, href, where) => {
    const t = DD[dd];
    const n = href ? link(href, t.word, `ddchip ddchip--${dd}`) : el('span', `ddchip ddchip--${dd}`, t.word);
    if (href) n.setAttribute('aria-label', `${t.word}${where ? ` (${where})` : ''}: ${DRILL_TO.toLowerCase()} ${t.title.toLowerCase()}`);
    return n;
  };

  // The other-year / other-model version of a number: one slim line inside its box, a 90° arrow in front.
  const otherRow = (o, ui, fn, used) => {
    const p = el('p', 'dval__other');
    if (o.id) p.id = o.id;
    p.append(hidden(el('span', 'dval__arrow', '↳')), el('span', 'dval__otherk', `≠ ${o.label}:`), ' ', el('strong', null, o.value), ` · ${o.sub}`);
    (o.tags || []).forEach((t) => p.append(' ', el('span', `mtag mtag--${t.tone || 'flag'}`, t.text)));
    if (o.src) p.append(' ', fn.cite(o.src, used));
    if (o.mark) p.appendChild(marks(o.mark));
    return p;
  };

  // One value box. Solid / dashed / dotted / red is never the only signal: every box carries a text tag.
  const valueBox = (item, ui, fn, used, cls = 'dval') => {
    const kind = item.kind || 'sourced';
    const box = el('div', `${cls} ${cls}--${kind}`);
    box.appendChild(tagsFor(item, ui));
    const big = el('p', `${cls}__big`);
    big.appendChild(item.to ? ddLink(item.dd, item.to, item.value) : numUnit(item.value));
    box.appendChild(big);
    box.appendChild(el('p', `${cls}__label`, item.label));
    if (item.meter) box.appendChild(meter(item.meter, !/%$/.test(item.value) || item.value !== `${item.meter.value}%`));
    if (item.sub) box.appendChild(el('p', `${cls}__sub`, item.sub));
    if (item.src || item.mark) {
      const p = el('p', 'gfact__src');
      if (item.src) p.append(item.compactSrc ? '' : `${ui.source}: `, fn.cite(item.src, used, item.compactSrc));
      if (item.mark) p.appendChild(marks(item.mark));
      box.appendChild(p);
    }
    if (item.at) {
      const p = el('p', `${cls}__at${item.at.gap ? ` ${cls}__at--gap` : ''}`);
      p.append(hidden(el('span', `${cls}__atmark`)), item.at.text);
      if (item.at.mark) p.appendChild(marks(item.at.mark));
      box.appendChild(p);
    }
    if (item.other) box.appendChild(otherRow(item.other, ui, fn, used));
    if (item.link) box.appendChild(el('p', `${cls}__link`)).appendChild(link(item.link.href, item.link.label, 'link link--go'));
    return box;
  };

  const warningBox = (w, id, badgeText, fn, used) => {
    const warn = el('div', 'mwarn gwarn');
    warn.setAttribute('role', 'note'); // a labelled note, not a landmark
    warn.setAttribute('aria-labelledby', id);
    const body = el('div');
    const title = el('p', 'gwarn__title', w.title);
    title.id = id;
    const text = el('p', null, `${w.text}${w.src ? ' ' : ''}`);
    if (w.src) text.appendChild(fn.cite(w.src, used));
    body.append(title, text);
    if (w.link) body.appendChild(el('p', 'gwarn__link')).appendChild(link(w.link.href, `${w.link.label} →`, 'link'));
    warn.append(hidden(el('span', 'mwarn__badge', badgeText)), body);
    return warn;
  };

  const legend = (ui, d) => {
    const key = list('mkey dkey');
    key.setAttribute('aria-label', ui.keyLabel);
    [['solid', ui.keySourced], ['dash', ui.keyScenario], ['dot', ui.keyGap]].forEach(([kind, text]) => {
      const li = el('li');
      li.append(hidden(el('span', `mkey__swatch mkey__swatch--${kind}`)), text);
      key.appendChild(li);
    });
    if (d && d.dd && ui.keyDrill) {
      const li = el('li', 'dkey__drill');
      li.append(ui.keyDrill);
      Object.keys(d.dd).forEach((k) => li.append(' ', ddChip(k)));
      key.appendChild(li);
    }
    if (ui.keyScope) key.appendChild(el('li', 'dkey__scope', ui.keyScope));
    return key;
  };

  /* ---------- Shared blocks of the GiGi Vegan page ---------- */
  const block = (cls, id, title, lead, hideTitle) => {
    const sec = el('section', `dblock ${cls}`);
    sec.setAttribute('aria-labelledby', id);
    const h = el('h3', `dblock__title${hideTitle ? ' sr-only' : ''}`, title);
    h.id = id;
    sec.appendChild(h);
    if (lead) sec.appendChild(el('p', 'dblock__lead', lead));
    return sec;
  };

  /* · The chain: what "at consumption" means. The key once per view, one bar per measure under the rows of B. */
  const segClass = (s) => `cseg--${s.at ? (s.at === 'service' ? 'service' : 'home') : 'before'}`;

  // The five links, the last two bracketed as "at consumption".
  const chainKey = (d) => {
    const c = d.chain;
    const wrap = el('div', 'dchain');
    wrap.appendChild(el('p', 'dchain__lead', c.lead));
    const stages = list('cstages', 'ol');
    stages.setAttribute('aria-label', d.ui.chainLabel);
    c.stages.slice(0, c.atFrom).forEach((name) => stages.appendChild(el('li', 'cstage', name)));
    const atItem = el('li', 'cstages__at');
    atItem.appendChild(el('span', 'cstages__atlabel', c.atLabel));
    const atList = list('cstages__atlist', 'ol');
    c.stages.slice(c.atFrom).forEach((name) => atList.appendChild(el('li', 'cstage is-at', name)));
    atItem.appendChild(atList);
    stages.appendChild(atItem);
    wrap.appendChild(stages);
    return wrap;
  };

  // One bar: a measure cut along the chain, with its own total and its own model.
  const chainBar = (b, d, fn, used) => {
    const c = d.chain;
    const ui = d.ui;
    const sum = b.segs.reduce((t, s) => t + s.v, 0);
    const at = b.segs.filter((s) => s.at).reduce((t, s) => t + s.v, 0);
    const box = el('div', 'cbar cbar--waste');
    box.dataset.bar = b.id;

    const head = el('div', 'cbar__head');
    const name = el('p', 'cbar__name');
    name.append(el('strong', null, b.title), el('span', 'cbar__scope', b.scope));
    if (b.mark) name.appendChild(marks(b.mark));
    const share = el('p', 'cbar__share', `${fmt((at / sum) * 100, 1)}% ${c.shareWord}${b.atText ? ` · ${b.atText}` : ''}`);
    if (b.shareMark) share.appendChild(marks(b.shareMark));
    const total = el('p', 'cbar__total');
    total.appendChild(numUnit(b.total));
    head.append(name, total, share);

    const track = hidden(el('div', 'cbar__track'));
    b.segs.forEach((s) => {
      const seg = el('span', `cseg ${segClass(s)}`);
      seg.style.setProperty('--v', s.v);
      track.appendChild(seg);
    });

    const items = list('cbar__list');
    b.segs.forEach((s) => {
      const it = el('li', s.at ? 'is-at' : '');
      it.append(hidden(el('span', `cswatch ${segClass(s)}`)), el('span', 'cbar__stage', s.name), el('span', 'cbar__val', s.text));
      items.appendChild(it);
    });

    const note = el('p', 'cbar__note');
    if (b.note) note.append(`${b.note} `);
    note.append(`${ui.source}: `, fn.cite(b.src, used));
    box.append(head, track, items, note);
    return box;
  };

  /* ---------- A · The totals (vegan.html) ---------- */
  const tile = (t, d, fn, used, extra) => {
    const box = valueBox({ kind: 'sourced', ...t }, d.ui, fn, used);
    box.classList.add('ttile');
    if (extra) box.classList.add(extra);
    if (t.id) box.id = t.id;
    return box;
  };

  // ↓ between two levels: "zoom", never a ratio
  const zoom = (z) => {
    const s = el('div', 'rel rel--zoom');
    const core = el('span', 'rel__core');
    core.append(hidden(el('span', 'rel__arrow')), hidden(el('span', 'rel__zlabel', z.text)));
    const tail = el('span', 'rel__tail');
    tail.appendChild(el('span', 'sr-only', z.label));
    if (z.mark) tail.appendChild(marks(z.mark));
    s.append(hidden(el('span', 'rel__pad')), core, tail);
    return s;
  };

  // Meat per person on one shared scale: a card with the bar in it.
  const personCard = (b, max, d, fn, used) => {
    const card = el('div', 'dval dval--sourced dval--mini ttile tpp');
    if (b.id) card.id = b.id;
    const track = hidden(el('div', 'cbar__track'));
    const a = el('span', 'cseg cseg--home');
    a.style.setProperty('--v', b.value);
    const r = el('span', 'cseg cseg--rest');
    r.style.setProperty('--v', Math.max(max - b.value, 0));
    track.append(a, r);
    const cap = el('p', 'tbar__cap');
    const num = b.to ? ddLink(b.dd, b.to, b.text) : numUnit(b.text);
    const strong = el('strong');
    strong.appendChild(num);
    cap.append(strong, ` ${b.sub}`);
    card.append(el('p', 'tbar__k', d.ui.perPerson), track, cap);
    if (b.src) {
      const s = el('p', 'gfact__src');
      s.append(`${d.ui.source}: `, fn.cite(b.src, used));
      card.appendChild(s);
    }
    return card;
  };

  // The compact version of the chain for all food: before the plate | at consumption (the five stages stay in B).
  const stageBar = (spec, d) => {
    const cb = d.chain.bars.find((x) => x.id === spec.chain);
    const sum = (f) => cb.segs.filter(f).reduce((t, s) => t + s.v, 0);
    const at = sum((s) => s.at);
    const before = sum((s) => !s.at);
    const dg = (v) => fmt(v, v >= 100 ? 0 : 1);
    const wrap = el('div', 'tbar tbar--stage');
    const track = hidden(el('div', 'cbar__track'));
    [['cseg--before', before], ['cseg--home', at]].forEach(([c, v]) => {
      const seg = el('span', `cseg ${c}`);
      seg.style.setProperty('--v', v);
      track.appendChild(seg);
    });
    const cap = el('p', 'tbar__cap');
    cap.append(el('strong', null, `${fmt((at / (at + before)) * 100, 1)}%`), ` ${d.chain.shareWord} · ${dg(at)} Mt`);
    wrap.append(el('p', 'tbar__k', d.chain.atLabel), track, cap, el('p', 'tbar__sub', `${d.ui.beforePlate} · ${dg(before)} Mt`));
    return wrap;
  };

  const cellHead = (h, hid) => {
    const head = el('header', 'thead');
    const t = el('h4', 'thead__title');
    t.id = hid;
    if (h.tag) t.append(el('span', 'dbadge dbadge--wide tgroup__tag', h.tag), ' ');
    t.append(h.title);
    head.append(t, el('p', 'thead__sub', h.sub));
    return head;
  };

  // The germany species mix, small, right under the number it explains (4.6 Mt · 54.9 kg per person)
  const speciesInline = (S, d, fn, used) => {
    const box = el('div', 'cbar tsp tsp--inline');
    box.appendChild(el('p', 'tsp__title', S.title));
    const total = S.segs.reduce((t, s) => t + s.v, 0);
    const cls = ['cseg--home', 'cseg--service', 'cseg--before', 'cseg--rest'];
    const track = hidden(el('div', 'cbar__track'));
    const items = list('cbar__list cbar__list--col');
    S.segs.forEach((s, i) => {
      const seg = el('span', `cseg ${cls[i % cls.length]}`);
      seg.style.setProperty('--v', s.v);
      track.appendChild(seg);
      const li = el('li');
      li.append(hidden(el('span', `cswatch ${cls[i % cls.length]}`)), el('span', 'cbar__stage', s.name), el('span', 'cbar__val', `${fmt(s.v, 1)} ${S.unit}`), el('span', 'cbar__pct', `${fmt((s.v / total) * 100, 1)}%`));
      items.appendChild(li);
    });
    const note = el('p', 'cbar__note');
    note.append(`${S.sub} · ${d.ui.source}: `, fn.cite(S.src, used, true));
    box.append(track, items, note);
    return box;
  };

  // The meat of one column: small boxes, the sources as plain footnote numbers (the full line sits in the drill-down)
  const meatGroup = (items, label, d, fn, used, extra) => {
    const grp = el('div', 'tmeat');
    grp.appendChild(el('p', 'tmeat__k', label));
    items.forEach((m) => {
      const box = valueBox({ kind: 'sourced', compactSrc: true, ...m }, d.ui, fn, used);
      box.classList.add('ttile', 'dval--mini');
      if (m.id) box.id = m.id;
      grp.appendChild(box);
    });
    if (extra) grp.appendChild(extra);
    return grp;
  };

  // One drill-down line per row: where this row's numbers go, in words and in colour.
  const drillLine = (items, d, geoName) => {
    const p = el('p', 'tdrill');
    p.append(el('span', 'tdrill__k', d.ui.drill));
    items.forEach((it) => p.append(' ', ddChip(it.dd, it.to, geoName)));
    return p;
  };

  // The check under a total: do the two parts add up to it?
  const checkBox = (c, d, fn, used) => {
    const chk = el('div', `tcheck tcheck--${c.est ? 'est' : c.ok ? 'ok' : 'no'}`);
    const first = el('p', 'tcheck__text');
    first.append(el('span', 'tcheck__badge', c.est ? d.ui.checkEst : c.ok ? d.ui.checkOk : d.ui.checkNo), ' ', c.text);
    chk.appendChild(first);
    if (c.outside) {
      const out = el('p', 'tcheck__text', `${c.outside} `);
      if (c.src) out.appendChild(fn.cite(c.src, used));
      if (c.link) out.append(' ', ddLink(c.link.dd, c.link.to, c.link.label));
      chk.appendChild(out);
    }
    return chk;
  };

  // The split of a total on one bar: wasted (A.1) on the LEFT, consumed (A.2) on the RIGHT — the order of the columns below.
  const splitBar = (f, d) => {
    const bar = el('div', 'tsplitbar');
    const parts = f.split ? f.split.parts : [{ role: 'wasted', v: 50, name: 'wasted — A.1' }, { role: 'consumed', v: 50, name: 'consumed — A.2' }];
    // the key first, the bar last: the dashed connectors start right under the bar
    if (f.split) {
      const items = list('cbar__list');
      parts.forEach((p) => {
        const li = el('li');
        li.append(hidden(el('span', `cswatch cseg--${p.role}${f.split.est ? ' cseg--est' : ''}`)), el('span', 'cbar__stage', p.name), el('span', 'cbar__val', p.text));
        items.appendChild(li);
      });
      bar.append(items, el('p', 'tbar__sub', f.split.caption));
    } else {
      bar.appendChild(el('p', 'tbar__sub', d.totals.unknownSplit));
    }
    if (f.inset) {
      // the meat inside each part: a marker in the bar, its numbers in words (not to scale)
      const ul = list('tinset');
      ['wasted', 'consumed'].forEach((role) => {
        if (!f.inset[role]) return;
        const li = el('li', `tinset__item tinset__item--${role}`);
        li.append(hidden(el('span', 'tinset__mark')), el('span', null, `meat inside: ${f.inset[role].text}`));
        ul.appendChild(li);
      });
      bar.append(ul, el('p', 'tbar__sub', f.inset.note));
    }
    const track = el('div', 'cbar__track');
    track.setAttribute('role', 'img');
    track.setAttribute('aria-label', f.split ? parts.map((p) => `${p.name} ${p.text}`).join(', ') : d.totals.unknownSplit);
    parts.forEach((p) => {
      const seg = el('span', `cseg ${f.split ? `cseg--${p.role}${f.split.est ? ' cseg--est' : ''}` : 'cseg--unknown'}`);
      seg.style.setProperty('--v', p.v);
      if (f.inset && f.inset[p.role]) seg.appendChild(hidden(el('span', 'cseg__meat')));
      track.appendChild(seg);
    });
    bar.appendChild(track);
    return bar;
  };

  // Dashed connectors from the middle of each part of the bar down to its column: this part of the total IS that column.
  const funnel = (split) => {
    const NS = 'http://www.w3.org/2000/svg';
    const w = split ? split.parts[0].v : 50;
    const from = [w / 2, w + (100 - w) / 2]; // middle of the wasted part, middle of the consumed part
    const to = [24.5, 75.5];                  // middle of column A.1, middle of column A.2
    const wrap = el('div', `tlink${split ? '' : ' tlink--unknown'}`);
    wrap.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 20');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('focusable', 'false');
    ['wasted', 'consumed'].forEach((role, i) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('class', `tlink__edge tlink__edge--${role}`);
      p.setAttribute('d', from[i] === to[i] ? `M${from[i]} 0 V20` : `M${from[i]} 0 V9 H${to[i]} V20`);
      svg.appendChild(p);
      const tip = el('span', `tlink__tip tlink__tip--${role}`);
      tip.style.left = `${to[i]}%`;
      wrap.appendChild(tip);
    });
    wrap.prepend(svg);
    return wrap;
  };

  // A total: the number, the check, and the split on one bar.
  const totalStrip = (head, f, d, fn, used, hid) => {
    const box = el('div', 'tfood');
    box.setAttribute('role', 'group');
    box.setAttribute('aria-labelledby', hid);
    box.appendChild(cellHead(head, hid));
    const main = el('div', 'tfood__main');
    main.append(tile(f.tile, d, fn, used), checkBox(f.check, d, fn, used));
    box.append(main, splitBar(f, d));
    return box;
  };

  const column = (key, geo, label, rows) => {
    const col = el('div', `tcol tcol--${key}`);
    col.setAttribute('role', 'group');
    col.setAttribute('aria-label', `${label} — ${geo}`);
    rows.forEach((r) => col.appendChild(r));
    return col;
  };

  // A dashed line down the left side of a level card: from the "meat inside" lines in the food total
  // to "Total meat — inside the food" — the meat marker in the bar IS that block. Placed from the real layout.
  const placeRail = (card) => {
    const from = card.querySelector('.tinset__item');
    const to = card.querySelector('[id^="tmeat-"]');
    if (!from || !to) return;
    const rail = el('div', 'trail');
    rail.setAttribute('aria-hidden', 'true');
    rail.appendChild(el('span', 'trail__tip'));
    card.appendChild(rail);
    const place = () => {
      const c = card.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(card).paddingLeft) || 10;
      const x = Math.max(3, pad / 2 - 1);
      const ya = a.top + a.height / 2 - c.top;
      const yb = b.top + b.height / 2 - c.top;
      rail.style.cssText = `left:${x}px;top:${ya}px;height:${Math.max(yb - ya, 0)}px;--stub-a:${Math.max(a.left - c.left - x, 4)}px;--stub-b:${Math.max(b.left - c.left - x, 4)}px`;
    };
    place();
    if (window.ResizeObserver) new ResizeObserver(place).observe(card);
    window.addEventListener('load', place);
  };

  const totals = (root, d) => {
    const T = d.totals;
    const fn = footnotes(d.sources);
    const used = [];
    const wrap = el('div', 'totals');
    wrap.appendChild(legend(d.ui, d));
    T.levels.forEach((lv) => {
      const geo = d.geos.find((g) => g.id === lv.geo).name;
      const card = el('section', 'tlevel');
      const hid = `tlevel-${lv.geo}`;
      card.setAttribute('aria-labelledby', hid);
      const h = el('h3', 'tlevel__name', geo);
      h.id = hid;

      // block 1 — all food: the total, its split, the two parts (A.1 | A.2)
      const duo1 = el('div', 'tduo2');
      duo1.style.setProperty('--rows', 2);
      [['waste', lv.waste, T.heads.waste], ['consumption', lv.consumption, T.heads.consumption]].forEach(([key, part, head]) => {
        const hidc = `tcol-${key}-${lv.geo}`;
        const base = el('div', 'tbase');
        base.appendChild(tile(part.tile, d, fn, used));
        if (part.bar) base.appendChild(stageBar(part.bar, d));
        const col = column(key, geo, head.title, [cellHead(head, hidc), base]);
        col.setAttribute('aria-labelledby', hidc);
        col.removeAttribute('aria-label');
        duo1.appendChild(col);
      });

      // block 2 — the meat inside it: the same shape, then one drill-down line per column
      const duo2 = el('div', 'tduo2');
      duo2.style.setProperty('--rows', 2);
      [['waste', lv.waste, T.heads.meatWaste], ['consumption', lv.consumption, T.heads.meatConsumption]].forEach(([key, part, label]) => {
        const extra = part.species ? speciesInline(d.consumption.species, d, fn, used) : null;
        duo2.appendChild(column(key, geo, label, [meatGroup(part.meat, label, d, fn, used, extra), drillLine(part.drill, d, geo)]));
      });

      card.append(
        h,
        totalStrip(T.heads.food, lv.food, d, fn, used, `tfood-${lv.geo}`),
        funnel(lv.food.split),
        duo1,
        totalStrip(T.heads.meat, lv.meat, d, fn, used, `tmeat-${lv.geo}`),
        funnel(lv.meat.split),
        duo2,
      );
      wrap.appendChild(card);
      if (lv.zoom) wrap.appendChild(zoom(lv.zoom));
    });
    if (T.foot) wrap.appendChild(el('p', 'tfoot', T.foot));
    root.replaceChildren(wrap, fn.summary(d.ui.sources, used));
    wrap.querySelectorAll('.tlevel').forEach(placeRail);
  };

  /* ---------- Two levers (vegan.html) ---------- */
  // Segment widths (% of the bar): from `v`, or `fixed` for a segment that has no value (unknown).
  const lGeometry = (segs) => {
    const fixed = segs.reduce((t, s) => t + (s.v == null ? s.fixed || 0 : 0), 0);
    const sum = segs.reduce((t, s) => t + (s.v == null ? 0 : s.v), 0);
    const k = (100 - fixed) / sum;
    return segs.map((s) => (s.v == null ? s.fixed || 0 : s.v * k));
  };
  const lClass = (s) => `lseg--${s.role} lseg--${s.kind}${s.tone === 'soft' ? ' lseg--soft' : ''}`;
  const levLegend = (L) => {
    const wrap = el('div', 'lkey');
    const levers = list('lkey__levers');
    levers.setAttribute('aria-label', L.ui.leverKey);
    L.keys.forEach((k) => {
      const li = el('li', `lkey__lever lkey__lever--${k.id.toLowerCase()}`);
      li.append(hidden(el('span', 'lkey__badge', k.id)), el('strong', null, k.name), ` — ${k.acts}`);
      levers.appendChild(li);
    });
    const marks = list('mkey dkey');
    marks.setAttribute('aria-label', L.ui.keyLabel);
    [['consumed', L.ui.keyConsumed], ['wasted', L.ui.keyWasted], ['solid', L.ui.keySolid], ['dash', L.ui.keyDash], ['hatch', L.ui.keyHatch]].forEach(([kind, text]) => {
      const li = el('li');
      li.append(hidden(el('span', `mkey__swatch mkey__swatch--${kind}`)), text);
      marks.appendChild(li);
    });
    wrap.append(levers, marks);
    return wrap;
  };

  // One total-system bar: green consumed + coral wasted. A reaches the whole bar, B only the wasted part.
  // The text version under it is a small table: name on the left, the numbers in the right-hand columns.
  const levBar = (b, L, fn, used, region) => {
    const ui = L.ui;
    const card = el('div', 'lbar');
    card.dataset.bar = b.id;

    const head = el('div', 'lbar__head');
    head.append(el('p', 'lbar__measure', b.measure), el('p', 'lbar__scope', b.scope));
    const total = el('p', 'lbar__total');
    if (b.total.id) total.id = b.total.id;
    total.append(el('span', `lbar__tv${b.total.unknown ? ' lbar__tv--unknown' : ''}`, b.total.value), el('span', null, ` ${b.total.text}`));
    card.append(head, total);
    const meta = el('p', 'lbar__sub');
    (b.total.tags || []).forEach((t) => meta.append(el('span', `mtag mtag--${t.tone || 'flag'}`, t.text), ' '));
    if (b.total.sub) meta.append(`${b.total.sub}${b.total.src ? ' · ' : ''}`);
    if (b.total.src) meta.append(fn.cite(b.total.src, used));
    if (b.total.mark) meta.appendChild(marks(b.total.mark));
    if (b.total.tags || b.total.sub || b.total.src || b.total.mark) card.appendChild(meta);

    // Lever A — the whole bar
    const a = el('div', 'lbar__lev lbar__lev--a');
    a.append(el('p', 'lbar__levtext', L.keys[0].short), hidden(el('span', 'lbar__brace lbar__brace--a')));
    card.appendChild(a);

    const widths = lGeometry(b.segs);
    const track = hidden(el('div', 'lbar__track'));
    b.segs.forEach((s, i) => {
      const seg = el('span', `lseg ${lClass(s)}`);
      seg.style.setProperty('--w', widths[i].toFixed(3));
      track.appendChild(seg);
    });
    card.appendChild(track);

    // Lever B — only the wasted segments
    const wastedAt = b.segs.map((s, i) => (s.role === 'wasted' ? i : -1)).filter((i) => i >= 0);
    if (wastedAt.length) {
      const start = widths.slice(0, wastedAt[0]).reduce((t, w) => t + w, 0);
      const span = wastedAt.reduce((t, i) => t + widths[i], 0);
      const bl = el('div', 'lbar__lev lbar__lev--b');
      bl.style.setProperty('--ws', `${start.toFixed(3)}%`);
      bl.style.setProperty('--ww', `${span.toFixed(3)}%`);
      bl.append(hidden(el('span', 'lbar__brace lbar__brace--b')), el('p', 'lbar__levtext', L.keys[1].short));
      card.appendChild(bl);
    }

    // The overview: the shares, with their ≠ marks, and one way down into the waste matrix.
    const strip = el('p', 'lbar__shares');
    (b.shares || []).forEach((sh) => {
      const one = el('span', 'lbar__share');
      one.append(hidden(el('span', `lswatch ${lClass({ role: sh.role, kind: sh.kind || 'sourced' })}`)), `${sh.label} `, el('strong', null, sh.text));
      if (sh.mark) one.appendChild(marks(sh.mark));
      strip.appendChild(one);
    });
    if (b.drill) {
      const go = link(`vegan.html#waste-${b.drill}`, ui.drill, 'link link--go lbar__go');
      go.setAttribute('aria-label', `${ui.drill}: ${b.measure}, ${region.name}, in the waste matrix`);
      strip.appendChild(go);
    }
    card.appendChild(strip);

    const items = list('lbar__list');
    b.segs.forEach((s) => {
      const li = el('li', `lbar__item lbar__item--${s.role}${s.share ? '' : ' lbar__item--noshare'}`);
      if (s.id) li.id = s.id;
      li.appendChild(hidden(el('span', `lswatch ${lClass(s)}`)));
      li.appendChild(el('span', 'lbar__iname', s.name));
      li.appendChild(el('strong', 'lbar__ival', s.value));
      if (s.share) li.appendChild(el('span', 'lbar__ishare', s.share));
      if (s.sub) li.appendChild(el('span', 'lbar__isub', s.sub));
      const foot = el('div', 'lbar__ifoot');
      foot.appendChild(tagsFor({ ...s, kind: s.kind === 'unknown' ? 'gap' : s.kind }, { sourced: ui.sourced, scenario: ui.scenario, gap: ui.unknown, invalid: '' }));
      if (s.src) foot.appendChild(fn.cite(s.src, used));
      if (s.mark) foot.appendChild(marks(s.mark));
      // Wasted figures lead into the drill-down matrix (that region's row); a scenario leads to its derivation.
      const go = s.drill ? { href: `vegan.html#waste-${s.drill}`, text: ui.drill, name: `${ui.drill}: ${b.measure}, ${region.name}, in the waste section` } : s.link ? { href: s.link.href, text: s.link.label, name: s.link.label } : null;
      if (go) {
        const l = link(go.href, go.text, 'link link--go lbar__go');
        l.setAttribute('aria-label', go.name);
        foot.appendChild(l);
      }
      li.appendChild(foot);
      items.appendChild(li);
    });
    const more = el('details', 'lbar__more');
    more.appendChild(el('summary', null, ui.details));
    more.appendChild(items);
    card.appendChild(more);
    return card;
  };

  const levRegion = (r, L, fn, used) => {
    const sec = el('section', 'lregion');
    const hid = `lregion-${r.id}`;
    sec.setAttribute('aria-labelledby', hid);
    const h = el('h4', 'lregion__name', r.name);
    h.id = hid;
    sec.append(h, el('p', 'lregion__basis', r.basis));
    if (r.notHarmonized) {
      const p = el('p', 'lregion__hatch');
      const txt = el('span', null, r.notHarmonized);
      if (r.notHarmonizedMark) txt.appendChild(marks(r.notHarmonizedMark));
      p.append(hidden(el('span', 'lswatch lseg--unknown')), txt);
      sec.appendChild(p);
    }
    r.bars.forEach((b) => sec.appendChild(levBar(b, L, fn, used, r)));
    return sec;
  };

  const levers = (root, d) => {
    const L = d.levers;
    const fn = footnotes(d.sources);
    const used = [];

    const system = block('lsys', 'lsys-title', L.blocks.system.title, L.blocks.system.lead);
    const regions = el('div', 'lregions');
    regions.setAttribute('role', 'group');
    regions.setAttribute('aria-label', L.ui.regionsLabel);
    L.regions.forEach((r) => regions.appendChild(levRegion(r, L, fn, used)));

    // One switch for every "Details" under the bars.
    const toggle = el('button', 'btn btn--sm btn--ghost lsys__toggle', L.ui.showAll);
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      regions.querySelectorAll('details.lbar__more').forEach((x) => { x.open = open; });
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? L.ui.hideAll : L.ui.showAll;
    });
    const tools = el('div', 'lsys__tools');
    tools.append(levLegend(L), toggle);
    system.append(tools, el('p', 'lregions__hint', L.ui.swipe), regions);

    // The assumptions behind the bars: folded away, one click.
    const box = el('details', 'sources lassume');
    box.appendChild(el('summary', null, L.blocks.assumptions.title));
    const ol = list('passume__list', 'ol');
    L.assumptions.forEach((a) => {
      const li = el('li');
      li.id = `assume-${a.id}`;
      li.append(el('span', 'passume__id', a.id), el('span', null, a.text));
      ol.appendChild(li);
    });
    box.appendChild(ol);

    root.replaceChildren(system, box, fn.summary(d.ui.sources, used));

    // A sideways-scrolling row must be reachable by keyboard — but only while it actually scrolls.
    const sync = () => {
      if (regions.scrollWidth > regions.clientWidth + 1) regions.tabIndex = 0;
      else regions.removeAttribute('tabindex');
    };
    sync();
    window.addEventListener('resize', sync);
  };

  /* ---------- B · Waste: one section, one switch (vegan.html) ---------- */
  const barChart = (c, ui, fn, used) => {
    const digits = c.digits == null ? 1 : c.digits;
    const fig = el('figure', 'hbar is-in');
    fig.id = c.id;
    const capId = `${c.id}-cap`;
    fig.setAttribute('aria-labelledby', capId);
    const cap = el('figcaption', 'hbar__cap');
    cap.id = capId;
    const title = el('span', 'hbar__title');
    title.append(c.title);
    cap.append(title, el('span', 'hbar__sub', c.sub));
    if (c.tag) cap.appendChild(el('span', `mtag mtag--${c.tag.tone || 'flag'} hbar__tag`, c.tag.text));
    fig.appendChild(cap);

    // Rows are either [name, value] (value, share and table cells are computed from `total`) or full objects.
    const rows = c.rows.map((r) => {
      if (!Array.isArray(r)) return r;
      const share = c.total ? `${fmt((r[1] / c.total) * 100, 1)}%` : '';
      return { name: r[0], v: r[1], text: `${fmt(r[1], digits)} ${c.unit} `, share, table: [fmt(r[1], digits === 0 ? 1 : 2), share], emph: r[0] === c.highlight };
    });

    // "Other N countries": whatever the total has beyond the listed rows. Derived, so it is drawn hatched and labelled.
    let restNote = '';
    if (c.others && c.total) {
      const rest = c.total - rows.reduce((t, r) => t + r.v, 0);
      if (rest > 0) {
        const share = `${fmt((rest / c.total) * 100, 1)}%`;
        const name = `${ui.others} ${c.others.count} ${c.others.word}`;
        rows.push({ name, v: rest, text: `≈ ${fmt(rest, digits)} ${c.unit} `, share, table: [`≈ ${fmt(rest, digits === 0 ? 0 : 1)}`, share], rest: true });
        restNote = ` ${name}: ≈ ${fmt(rest, digits)} ${c.unit} (${share}), about ${fmt(rest / c.others.count, digits === 0 ? 0 : 1)} ${c.unit} each — ${ui.othersNote}.`;
      }
    }

    const max = Math.max(...rows.map((r) => r.v));
    const ol = list('hbar__rows', 'ol');
    rows.forEach((r) => {
      const li = el('li', `hbar__row${r.emph ? ' is-emph' : ''}${r.rest ? ' is-rest' : ''}`);
      li.style.setProperty('--p', (r.v / max).toFixed(4));
      li.tabIndex = 0;
      const bar = el('span', 'hbar__bar');
      const val = el('span', 'hbar__val', r.text);
      if (r.share) val.appendChild(el('small', null, r.share));
      bar.append(el('span', 'hbar__fill'), val);
      li.append(el('span', 'hbar__label', r.name), bar);
      ol.appendChild(li);
    });
    fig.appendChild(ol);

    const note = el('p', 'hbar__note', `${c.note || ''}${restNote} `);
    if (c.src) note.appendChild(fn.cite(c.src, used));
    if (c.mark) note.appendChild(marks(c.mark));
    fig.appendChild(note);

    // Table twin
    const det = el('details', 'tableview');
    det.appendChild(el('summary', null, ui.tableView));
    const scroll = el('div', 'tableview__scroll');
    const table = el('table');
    const thead = el('thead');
    const hr = el('tr');
    (c.cols || ['Country', `${c.title} (${c.unit})`, `Share of ${c.totalLabel}`]).forEach((t) => {
      const th = el('th', null, t);
      th.scope = 'col';
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    const tbody = el('tbody');
    rows.forEach((r) => {
      const tr = el('tr');
      const th = el('th', null, r.tableName || r.name);
      th.scope = 'row';
      tr.appendChild(th);
      (r.table || [r.text.trim(), r.share].filter(Boolean)).forEach((t) => tr.appendChild(el('td', null, t)));
      tbody.appendChild(tr);
    });
    table.append(thead, tbody);
    scroll.appendChild(table);
    det.appendChild(scroll);
    fig.appendChild(det);
    return fig;
  };

  // A four-step chain ending in the animal estimate (Germany).
  const flowFigure = (c, ui, fn, used) => {
    const box = el('div', 'wflow');
    box.id = c.id;
    const hid = `${c.id}-cap`;
    box.setAttribute('role', 'group');
    box.setAttribute('aria-labelledby', hid);
    const head = el('div', 'wflow__head');
    const title = el('p', 'hbar__title');
    title.id = hid;
    title.append(c.title);
    head.append(title, el('p', 'hbar__sub', c.sub));
    box.appendChild(head);

    const steps = list('wsteps', 'ol');
    c.steps.forEach((s) => {
      const li = el('li', `wstep${s.end ? ' wstep--end' : ''}`);
      li.append(el('p', 'wstep__big', s.big), el('p', null, s.text));
      steps.appendChild(li);
    });
    box.appendChild(steps);

    const gap = el('div', 'wgap');
    const gp = el('p');
    gp.append(el('strong', null, c.gap.title), ` ${c.gap.text}`);
    gap.append(hidden(el('span', 'wgap__badge', '!')), gp);
    box.appendChild(gap);

    const note = el('p', 'hbar__note', `${c.note} `);
    note.append(el('strong', null, c.noteStrong), '. ');
    if (c.src) note.appendChild(fn.cite(c.src, used));
    box.appendChild(note);
    return box;
  };

  // One Germany path (animal lives | weight): the steps from the households' numbers to the whole chain.
  const pathLane = (lane, d, fn, used) => {
    const ui = d.ui;
    const sec = el('section', `plane plane--${lane.tone}`);
    const hid = `plane-${lane.id}`;
    sec.setAttribute('aria-labelledby', hid);
    const head = el('header', 'plane__head');
    const h = el('h4', 'plane__title', lane.title);
    h.id = hid;
    head.append(h, el('p', 'plane__verdict', lane.verdict));
    sec.appendChild(head);

    const steps = list('psteps', 'ol');
    lane.steps.forEach((s) => {
      if (s.op) {
        const op = el('li', `pop${s.invalid ? ' pop--invalid' : ''}`);
        op.appendChild(el('span', 'pop__code', s.op));
        if (s.ref) op.appendChild(el('span', 'pop__ref', s.ref));
        if (s.text) op.appendChild(el('span', 'pop__text', s.text));
        if (s.invalid) op.appendChild(el('span', 'sr-only', ` — ${ui.invalid}`));
        steps.appendChild(op);
      } else {
        const li = el('li', 'pstep');
        li.appendChild(valueBox(s, ui, fn, used));
        steps.appendChild(li);
      }
    });
    sec.appendChild(steps);
    if (lane.note) sec.appendChild(el('p', 'plane__note', lane.note));
    return sec;
  };

  // The assumptions behind the Germany scenarios: named, numbered, folded away.
  const assumptionsBox = (d) => {
    const box = el('details', 'sources lassume');
    box.id = 'assumptions';
    box.appendChild(el('summary', null, d.ui.assumptions));
    const ol = list('passume__list', 'ol');
    d.paths.assumptions.forEach((a) => {
      const li = el('li');
      li.id = `assume-${a.id}`;
      li.append(el('span', 'passume__id', a.id), el('span', null, a.text));
      ol.appendChild(li);
    });
    box.appendChild(ol);
    return box;
  };

  // The drill-down line of a row: one foldable panel, named by what is in it, in the colour of its view.
  const drillBox = (r, v, d, fn, used) => {
    const charts = (r.drills || []).map((id) => {
      const src = d.drills[id] ? { ...d.drills[id], id: `drill-${id}` } : d.europe.charts.find((c) => c.id === id);
      return src;
    });
    const lane = r.paths && d.paths.lanes.find((l) => l.id === r.paths);
    if (!charts.length && !lane) return null;
    const det = el('details', `ddrill ddrill--${v.dd}`);
    det.id = `drill-waste-${v.id}-${r.geo}`;
    det.open = !!r.open;
    const sum = el('summary', 'ddrill__sum');
    const names = charts.map((c) => c.title);
    if (lane) names.push(r.paths === 'lives' ? 'Germany: how the households’ animals scale up' : 'Germany: why the tonnes don’t scale');
    sum.append(ddChip(v.dd), el('span', 'ddrill__tag', d.ui.drill), el('span', 'ddrill__what', names.join(' · ')));
    det.appendChild(sum);
    const body = el('div', 'ddrill__body');
    charts.forEach((c) => body.appendChild(c.type === 'flow' ? flowFigure(c, d.ui, fn, used) : barChart(c, d.ui, fn, used)));
    if (lane) {
      const lp = el('div', 'ddrill__lane');
      lp.id = r.paths === 'lives' ? 'paths' : 'paths-weight';
      lp.appendChild(pathLane(lane, d, fn, used));
      body.appendChild(lp);
    }
    det.appendChild(body);
    return det;
  };

  const wasteRow = (r, v, d, fn, used) => {
    const li = el('li', `wrow wrow--${v.dd}`);
    li.id = `waste-${v.id}-${r.geo}`;
    const g = d.geos.find((x) => x.id === r.geo);
    li.appendChild(el('h3', 'wrow__name', g.name));
    const items = el('div', 'wrow__items');
    r.items.forEach((it) => {
      if (it.bar) items.appendChild(chainBar(d.chain.bars.find((b) => b.id === it.bar), d, fn, used));
      else items.appendChild(valueBox(it.box, d.ui, fn, used));
    });
    li.appendChild(items);
    if (r.note) {
      const note = typeof r.note === 'string' ? { text: r.note } : r.note;
      const p = el('p', 'wrow__note', note.text);
      if (note.src) p.append(' ', fn.cite(note.src, used));
      if (note.mark) p.appendChild(marks(note.mark));
      li.appendChild(p);
    }
    const dr = drillBox(r, v, d, fn, used);
    if (dr) li.appendChild(dr);
    return li;
  };

  let showWasteView = null; // set by waste(); openTarget() uses it to open the view a link points into

  const waste = (root, d) => {
    const fn = footnotes(d.sources);
    const used = [];
    const W = d.waste;
    const wrap = el('div', 'waste');

    // The switch: two real radio buttons — keyboard, labels and screen readers come for free.
    const set = el('fieldset', 'wswitch');
    set.appendChild(el('legend', 'wswitch__legend', d.ui.switchLabel));
    const panels = {};
    const opts = el('div', 'wswitch__opts');
    W.views.forEach((v, i) => {
      const lab = el('label', `wswitch__opt wswitch__opt--${v.dd}`);
      const inp = el('input');
      inp.type = 'radio';
      inp.name = 'waste-view';
      inp.value = v.id;
      inp.checked = i === 0;
      lab.append(inp, el('span', null, v.label));
      opts.appendChild(lab);
    });
    set.appendChild(opts);
    wrap.appendChild(set);

    W.views.forEach((v, i) => {
      const panel = el('div', `wpanel wpanel--${v.dd}`);
      panel.id = `waste-${v.id}`;
      panel.dataset.wview = v.id;
      panel.hidden = i !== 0;
      panel.appendChild(el('p', 'wpanel__lead', v.lead));
      panel.appendChild(chainKey(d));
      const rows = list('wrows', 'ol');
      v.rows.forEach((r) => rows.appendChild(wasteRow(r, v, d, fn, used)));
      panel.appendChild(rows);
      panel.appendChild(el('p', 'dchain__foot', d.chain.foot));
      panels[v.id] = panel;
      wrap.appendChild(panel);
    });

    showWasteView = (id) => {
      Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== id; });
      set.querySelectorAll('input').forEach((inp) => { inp.checked = inp.value === id; });
    };
    set.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'waste-view') {
        showWasteView(e.target.value);
        if (history.replaceState) history.replaceState(null, '', `#waste-${e.target.value}`);
      }
    });

    wrap.append(assumptionsBox(d), warningBox(d.warning, 'gwarn-title', '≠', fn, used), fn.summary(d.ui.sources, used));
    root.replaceChildren(wrap);
  };

  /* ---------- C · Consumption (vegan.html) ---------- */
  const perPersonBlock = (P, d, fn, used) => {
    const sec = block('dperson', 'perperson-title', P.title, P.sub);
    const grid = el('div', 'tpp3');
    P.items.forEach((it) => {
      const item = el('div', 'tpp3__item');
      item.appendChild(el('h4', 'tpp3__geo', d.geos.find((g) => g.id === it.geo).name));
      item.appendChild(personCard(it, P.max, d, fn, used));
      grid.appendChild(item);
    });
    sec.append(grid, el('p', 'dblock__lead', P.note));
    return sec;
  };

  const knownBlock = (K, d, fn, used) => {
    const sec = block('dknown', 'known-title', K.title, K.sub);
    const box = valueBox({ kind: 'sourced', ...K.box }, d.ui, fn, used);
    box.classList.add('ttile', 'tknown');
    if (K.box.id) box.id = K.box.id;
    sec.appendChild(box);
    return sec;
  };

  const consumption = (root, d) => {
    const fn = footnotes(d.sources);
    const used = [];
    const C = d.consumption;
    root.replaceChildren(perPersonBlock(C.perPerson, d, fn, used), knownBlock(C.known, d, fn, used), fn.summary(d.ui.sources, used));
  };

  /* ---------- FoodGlance (food.html) ---------- */
  const foodGlance = (root, d) => {
    const ui = d.ui;
    const fn = footnotes(d.sources);
    const used = [];

    const kpis = list('facts gkpis');
    d.kpis.forEach((k) => {
      const li = el('li', 'fact');
      li.append(el('p', 'fact__value', k.value), el('p', 'fact__label', k.label));
      if (k.note) li.appendChild(el('p', 'gkpi__note', k.note));
      const src = el('p', 'fact__src');
      src.append(`${ui.source}: `, fn.cite(k.src, used));
      li.appendChild(src);
      kpis.appendChild(li);
    });

    const heading = el('h3', 'gdecision__title', ui.gatesTitle);
    const lead = el('p', 'gdecision__lead', ui.gatesLead);

    const stages = list('gstages', 'ol');
    d.stages.forEach((s) => {
      const now = s.type === 'now';
      const li = el('li', `gstage${now ? ' gstage--now' : ''}`);
      li.appendChild(el('span', now ? 'mtag' : 'mtag mtag--rule', s.tag));
      li.appendChild(el('h4', 'gstage__title', s.title));
      li.appendChild(el('p', 'gstage__lead', s.lead));
      const pts = list(now ? 'gpoints' : 'gcond');
      s.points.forEach((p) => pts.appendChild(el('li', null, p)));
      li.appendChild(pts);
      const res = el('p', 'gstage__result');
      s.result.forEach((r) => res.appendChild(el('span', null, r)));
      li.appendChild(res);
      stages.appendChild(li);
    });

    const stop = warningBox({ title: d.stop.title, text: d.stop.text, src: d.stop.src }, 'gstop-title', '!', fn, used);
    stop.classList.replace('gwarn', 'gstop');

    root.replaceChildren(kpis, heading, lead, stages, stop, fn.summary(ui.sources, used));
  };

  /* ---------- "When a number changes": the list behind the ≠a marks ---------- */
  const numberNotes = (root, d) => {
    const ui = d.ui;
    const ol = list('numnotes__list', 'ol');
    Object.values(NOTES).filter((n) => USED.has(n.id)).forEach((n) => {
      const li = el('li', 'numnote');
      li.id = `note-${n.id}`;
      const head = el('p', 'numnote__head');
      head.append(el('span', 'numnote__id', `≠${n.id}`), el('strong', null, n.topic));
      const at = list('numnote__at');
      n.at.forEach((w) => {
        const item = el('li');
        item.append(link(w.href, w.value, 'link'), ` — ${w.where} · ${w.scope}`);
        at.appendChild(item);
      });
      li.append(head, el('p', 'numnote__text', n.text), at);
      ol.appendChild(li);
    });
    root.replaceChildren(el('p', 'numnotes__lead', ui.notesLead), ol);
  };
  const renderNotes = () => {
    document.querySelectorAll('[data-notes]').forEach((root) => {
      const d = DATA[root.dataset.notes || 'vegan'];
      if (d) numberNotes(root, d);
    });
  };

  /* ---------- A footnote may point into a closed <details>: open it first ---------- */
  const openTarget = (hash) => {
    const id = decodeURIComponent((hash || '').replace(/^#/, ''));
    const t = id && document.getElementById(id);
    if (!t) return;
    const view = t.closest('[data-wview]'); // a view of the waste switch that is not showing: show it first
    if (view && view.hidden && showWasteView) showWasteView(view.dataset.wview);
    let d = t.closest('details');
    while (d) {
      if (!d.open) d.open = true;
      d = d.parentElement && d.parentElement.closest('details');
    }
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (a && a.hash && a.origin === location.origin && a.pathname === location.pathname) openTarget(a.hash);
  });
  window.addEventListener('hashchange', () => openTarget(location.hash));
  openTarget(location.hash);

  /* ---------- Go ---------- */
  const primary = DATA.vegan || DATA.projection;
  if (primary) setNotes(primary);
  if (DATA.vegan) {
    DD = DATA.vegan.dd || {};
    DRILL_TO = DATA.vegan.ui.drillTo || DRILL_TO;
  }
  // Shared with the projection page's own script (loaded after this one).
  window.GIGI_UI = { el, list, link, hidden, fmt, pc, footnotes, block, tagsFor, marks, setNotes, renderNotes, openTarget };
  const run = (sel, key, fnc) => document.querySelectorAll(sel).forEach((root) => DATA[key] && fnc(root, DATA[key]));
  document.querySelectorAll('[data-levers]').forEach((root) => {
    const d = [DATA.projection, DATA.vegan].find((x) => x && x.levers);
    if (d) levers(root, d);
  });
  run('[data-totals]', 'vegan', totals);
  run('[data-waste]', 'vegan', waste);
  run('[data-consumption]', 'vegan', consumption);
  run('[data-foodglance]', 'food', foodGlance);
  renderNotes();
  // A deep link (e.g. vegan.html#lv-world-lives-total) points at something drawn just now: go there.
  if (location.hash.length > 1) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) {
      openTarget(location.hash);
      requestAnimationFrame(() => t.scrollIntoView());
    }
  }
})();
