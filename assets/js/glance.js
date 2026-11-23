/* GiGi Ventures — glance.js
   Renders the data-driven blocks from assets/data/*.js:
     [data-levers]     → vegan.html  Two levers: consumed vs wasted per region, and what each lever can reach
     [data-dashboard]  → vegan.html  tree · two dual grids (A|B, C|D) · the chain      (GIGI_DATA.vegan)
     [data-paths]      → vegan.html  Germany: the animal-lives path vs the weight path
     [data-europe]     → vegan.html  Europe country by country, one chart per dimension (+ the drill-downs, drawn under their cards)
     [data-foodglance] → food.html   KPIs + decision gates                            (GIGI_DATA.food)
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

  /* ---------- Source footnotes (one numbering per page) ---------- */
  const footnotes = (sources) => {
    const keys = Object.keys(sources);
    const number = (key) => keys.indexOf(key) + 1;
    const target = (key) => sources[key].href || `#src-${key}`;

    // "Klaura et al. 2023 [1], GfK 2020 [10]" — each [n] is a link with a full accessible name.
    const cite = (srcKeys, used) => {
      const span = el('span', 'fn');
      [].concat(srcKeys).forEach((key, i) => {
        const s = sources[key];
        if (!s) return;
        if (used && !used.includes(key)) used.push(key);
        if (i) span.append(', ');
        span.append(`${s.short} `);
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

  // One value box. Solid / dashed / dotted / red is never the only signal: every box carries a text tag.
  const valueBox = (item, ui, fn, used, cls = 'dval') => {
    const kind = item.kind || 'sourced';
    const box = el('div', `${cls} ${cls}--${kind}`);
    box.appendChild(tagsFor(item, ui));
    box.appendChild(el('p', `${cls}__big`, item.value));
    box.appendChild(el('p', `${cls}__label`, item.label));
    if (item.meter) box.appendChild(meter(item.meter, !/%$/.test(item.value) || item.value !== `${item.meter.value}%`));
    if (item.sub) box.appendChild(el('p', `${cls}__sub`, item.sub));
    if (item.src) {
      const p = el('p', 'gfact__src');
      p.append(`${ui.source}: `, fn.cite(item.src, used));
      box.appendChild(p);
    }
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

  const legend = (ui) => {
    const key = list('mkey dkey');
    key.setAttribute('aria-label', ui.keyLabel);
    [['solid', ui.keySourced], ['dash', ui.keyScenario], ['dot', ui.keyGap]].forEach(([kind, text]) => {
      const li = el('li');
      li.append(hidden(el('span', `mkey__swatch mkey__swatch--${kind}`)), text);
      key.appendChild(li);
    });
    if (ui.keyScope) key.appendChild(el('li', 'dkey__scope', ui.keyScope));
    return key;
  };

  /* ---------- Dashboard (vegan.html) ---------- */
  const block = (cls, id, title, lead) => {
    const sec = el('section', `dblock ${cls}`);
    sec.setAttribute('aria-labelledby', id);
    const h = el('h3', 'dblock__title', title);
    h.id = id;
    sec.appendChild(h);
    if (lead) sec.appendChild(el('p', 'dblock__lead', lead));
    return sec;
  };

  const badge = (text, extra = '') => hidden(el('span', `dbadge${extra}`, text));

  /* · The tree: all food waste → meat (lives + weight in one node) → before / at the plate */
  const treeNode = (n, cols, ui, gapTag) => {
    const li = el('li', `tnode${n.focus ? ' tnode--focus' : ''}`);
    li.dataset.node = n.id;
    const card = el('div', 'tcard');

    const head = el('div', 'tcard__head');
    const title = el('p', 'tcard__title');
    if (n.badge) title.appendChild(badge(n.badge, n.badge.length > 1 ? ' dbadge--wide' : ''));
    title.appendChild(el('span', null, n.title));
    if (n.focus) title.appendChild(el('span', 'mtag tcard__focus', ui.focus));
    head.append(title, el('p', 'tcard__note', n.note));
    if (gapTag) head.appendChild(el('span', 'mtag mtag--gap', gapTag));
    card.appendChild(head);

    const rows = list('trows');
    n.rows.forEach((r) => {
      const row = el('li', `trow${r.focus ? ' trow--focus' : ''}`);
      row.appendChild(el('span', 'trow__label', r.label));
      r.cells.forEach((c, i) => {
        const cellEl = el('span', `tcell${c ? '' : ' tcell--none'}${c && c.kind === 'scenario' ? ' tcell--scenario' : ''}`);
        cellEl.appendChild(el('span', 'tcell__geo', cols[i]));
        const v = el('span', 'tcell__v', c ? c.v : '—');
        if (!c) v.appendChild(el('span', 'sr-only', ' not available'));
        cellEl.appendChild(v);
        row.appendChild(cellEl);
      });
      rows.appendChild(row);
    });
    card.appendChild(rows);
    li.appendChild(card);

    if (n.children && n.children.length) {
      const ul = list(`tnodes${gapTag === undefined && n.id === 'C' ? ' tnodes--dotted' : ''}`);
      n.children.forEach((c, i) => ul.appendChild(treeNode(c, cols, ui, n.id === 'C' && i === 0 ? ui.treeEdgeGap : undefined)));
      li.appendChild(ul);
    }
    return li;
  };

  const tree = (d) => {
    const t = d.tree;
    const sec = block('dtree', 'dtree-title', t.title, t.lead);
    const cols = hidden(el('div', 'dtree__cols'));
    t.cols.forEach((c) => cols.appendChild(el('span', null, c)));
    const top = list('tnodes tnodes--root');
    top.setAttribute('aria-label', d.ui.treeLabel);
    top.appendChild(treeNode(t.root, t.cols, { ...d.ui, treeEdgeGap: t.edgeGap }));
    sec.append(cols, top, el('p', 'dtree__foot', t.foot));
    return sec;
  };

  /* · An item; one with a `child` is drawn connected to the part of it lost at consumption */
  const item = (it, ui, fn, used) => {
    if (!it.child) return valueBox(it, ui, fn, used);
    const pair = el('div', 'dpair');
    const child = valueBox({ ...it.child, tags: [{ text: ui.atConsumption, tone: 'rule' }, ...(it.child.tags || [])] }, ui, fn, used);
    child.classList.add('dval--child');
    pair.append(valueBox(it, ui, fn, used), hidden(el('span', 'dpair__joint')), child);
    return pair;
  };

  const cell = (c, dim, ui, fn, used) => {
    const box = el('div', `dcell${dim.focus ? ' dcell--focus' : ''}`);
    box.dataset.dim = dim.id;
    const label = el('p', 'dcell__dim');
    label.append(badge(dim.id, ' dbadge--sm'), dim.name);
    box.append(label, el('p', 'dcell__scope', c.scope));
    const items = el('div', 'ditems');
    c.items.forEach((it) => items.appendChild(item(it, ui, fn, used)));
    box.appendChild(items);
    if (c.note) {
      const note = typeof c.note === 'string' ? { text: c.note } : c.note;
      const p = el('p', 'dcell__note', note.text);
      if (note.src) p.append(' ', fn.cite(note.src, used));
      box.appendChild(p);
    }
    return box;
  };

  const dhead = (dim, ui) => {
    const head = el('div', `dhead${dim.focus ? ' dhead--focus' : ''}`);
    const title = el('h4', 'dhead__title');
    title.append(badge(dim.id), el('span', null, dim.name));
    if (dim.focus) title.appendChild(el('span', 'mtag dhead__focus', ui.focus));
    const unit = el('p', 'dhead__unit');
    unit.append(el('span', 'sr-only', `${ui.unit}: `), dim.unit);
    head.append(title, unit, el('p', 'dhead__q', dim.question), el('p', 'dhead__so', dim.soWhat));
    if (dim.drill) head.appendChild(el('p', 'dhead__drill')).appendChild(link(dim.drill.href, `${ui.drill}: ${dim.drill.label} →`, 'link'));
    return head;
  };

  /* · A dual grid: two dimensions side by side, one row per region */
  const dual = (b, d, fn, used) => {
    const ui = d.ui;
    const dims = b.dims.map((id) => d.dims.find((x) => x.id === id));
    const sec = block(`dual${b.link ? ' dual--link' : ''}`, `dual-${b.id}`, b.title, b.lead);
    const heads = el('div', 'dual__heads');
    dims.forEach((dim) => heads.appendChild(dhead(dim, ui)));
    const rows = list('dual__rows', 'ol');
    d.geos.forEach((g) => {
      const row = el('li', 'dgeo');
      row.dataset.geo = g.id;
      const gh = el('div', 'dgeo__head');
      gh.append(el('h4', 'dgeo__name', g.name), el('p', 'dgeo__basis', g.basis));
      row.appendChild(gh);
      dims.forEach((dim) => row.appendChild(cell(dim.cells[g.id], dim, ui, fn, used)));
      const drills = dims.map((dim) => dim.cells[g.id].drill).filter(Boolean);
      if (drills.length) row.appendChild(drillPanel(drills, d, fn, used));
      rows.appendChild(row);
    });
    sec.append(heads, rows);
    return sec;
  };

  /* · The chain: what "at consumption" means */
  const segClass = (s) => `cseg--${s.at ? (s.at === 'service' ? 'service' : 'home') : 'before'}`;

  const chain = (d, fn, used) => {
    const c = d.chain;
    const ui = d.ui;
    const sec = block('dchain', 'dchain-title', c.title, c.lead);

    // The key: the five links, the last two bracketed as "at consumption".
    const stages = list('cstages', 'ol');
    stages.setAttribute('aria-label', ui.chainLabel);
    c.stages.slice(0, c.atFrom).forEach((name) => stages.appendChild(el('li', 'cstage', name)));
    const atItem = el('li', 'cstages__at');
    atItem.appendChild(el('span', 'cstages__atlabel', c.atLabel));
    const atList = list('cstages__atlist', 'ol');
    c.stages.slice(c.atFrom).forEach((name) => atList.appendChild(el('li', 'cstage is-at', name)));
    atItem.appendChild(atList);
    stages.appendChild(atItem);
    sec.appendChild(stages);

    const bars = list('cbars');
    c.bars.forEach((b) => {
      const sum = b.segs.reduce((t, s) => t + s.v, 0);
      const at = b.segs.filter((s) => s.at).reduce((t, s) => t + s.v, 0);
      const li = el('li', 'cbar');

      const head = el('div', 'cbar__head');
      const name = el('p', 'cbar__name');
      name.append(badge(b.dim, ' dbadge--sm'), el('strong', null, b.title), el('span', 'cbar__scope', b.scope));
      head.append(name, el('p', 'cbar__total', b.total), el('p', 'cbar__share', `${fmt((at / sum) * 100, 1)}% ${c.shareWord}`));

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
      li.append(head, track, items, note);
      bars.appendChild(li);
    });
    sec.append(bars, el('p', 'dchain__foot', c.foot));
    return sec;
  };

  const dashboard = (root, d) => {
    const fn = footnotes(d.sources);
    const used = [];
    const [meat, ...rest] = d.blocks;
    const warn = warningBox(d.warning, 'gwarn-title', '≠', fn, used);
    root.replaceChildren(
      tree(d),
      legend(d.ui),
      dual(meat, d, fn, used),
      chain(d, fn, used),
      ...rest.map((b) => dual(b, d, fn, used)),
      warn,
      fn.summary(d.ui.sources, used),
    );
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
  const pc = (v, digits = 1) => `${fmt(v * 100, digits)}%`;

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
  const levBar = (b, L, fn, used) => {
    const ui = L.ui;
    const card = el('div', 'lbar');
    card.dataset.bar = b.id;

    const head = el('div', 'lbar__head');
    head.append(el('p', 'lbar__measure', b.measure), el('p', 'lbar__scope', b.scope));
    const total = el('p', 'lbar__total');
    total.append(el('span', `lbar__tv${b.total.unknown ? ' lbar__tv--unknown' : ''}`, b.total.value), el('span', null, ` ${b.total.text}`));
    card.append(head, total);
    const meta = el('p', 'lbar__sub');
    (b.total.tags || []).forEach((t) => meta.append(el('span', `mtag mtag--${t.tone || 'flag'}`, t.text), ' '));
    if (b.total.sub) meta.append(`${b.total.sub}${b.total.src ? ' · ' : ''}`);
    if (b.total.src) meta.append(fn.cite(b.total.src, used));
    if (b.total.tags || b.total.sub || b.total.src) card.appendChild(meta);

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

    const items = list('lbar__list');
    b.segs.forEach((s) => {
      const li = el('li', `lbar__item lbar__item--${s.role}`);
      li.appendChild(hidden(el('span', `lswatch ${lClass(s)}`)));
      const body = el('div', 'lbar__body');
      const line = el('p', 'lbar__line');
      line.append(el('span', 'lbar__iname', s.name), ' ', el('strong', 'lbar__ival', s.value));
      if (s.share) line.append(' ', el('span', 'lbar__ishare', s.share));
      body.appendChild(line);
      if (s.sub) body.appendChild(el('p', 'lbar__isub', s.sub));
      const foot = el('p', 'lbar__ifoot');
      const tags = tagsFor({ ...s, kind: s.kind === 'unknown' ? 'gap' : s.kind }, { sourced: ui.sourced, scenario: ui.scenario, gap: ui.unknown, invalid: '' });
      foot.appendChild(tags);
      if (s.src) foot.appendChild(fn.cite(s.src, used));
      body.appendChild(foot);
      li.appendChild(body);
      items.appendChild(li);
    });
    card.appendChild(items);
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
      p.append(hidden(el('span', 'lswatch lseg--unknown')), r.notHarmonized);
      sec.appendChild(p);
    }
    r.bars.forEach((b) => sec.appendChild(levBar(b, L, fn, used)));
    return sec;
  };

  /* · Impact: grouped bars (waste only = f·x, demand only = x) with the "max via waste" line */
  const lPlot = (cls, ticks) => {
    const plot = el('div', `lplot ${cls}`);
    ticks.forEach((t) => {
      const g = el('span', 'lplot__grid');
      g.style.setProperty('--y', t);
      const lab = hidden(el('span', 'lplot__tick', `${t}%`));
      lab.style.setProperty('--y', t);
      plot.append(g, lab);
    });
    return plot;
  };

  const lTable = (ui, head, rows) => {
    const det = el('details', 'tableview');
    det.appendChild(el('summary', null, 'View as table'));
    const scroll = el('div', 'tableview__scroll');
    const table = el('table');
    const thead = el('thead');
    const hr = el('tr');
    head.forEach((t) => {
      const th = el('th', null, t);
      th.scope = 'col';
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    const tbody = el('tbody');
    rows.forEach((r) => {
      const tr = el('tr');
      r.forEach((t, i) => {
        const c = el(i ? 'td' : 'th', null, t);
        if (!i) c.scope = 'row';
        tr.appendChild(c);
      });
      tbody.appendChild(tr);
    });
    table.append(thead, tbody);
    scroll.appendChild(table);
    det.appendChild(scroll);
    return det;
  };

  const levGrouped = (L) => {
    const I = L.impact;
    const fig = el('figure', 'lchart');
    fig.setAttribute('aria-labelledby', 'lchart-cap');
    const cap = el('figcaption', 'lchart__cap');
    cap.id = 'lchart-cap';
    cap.append(el('span', 'hbar__title', I.groupTitle), el('span', 'hbar__sub', I.groupSub));
    fig.appendChild(cap);

    const waste = I.steps.map((x) => I.f * x * 100);
    const demand = I.steps.map((x) => x * 100);
    const plot = lPlot('lplot--bars', [0, 25, 50, 75, 100]);
    plot.setAttribute('role', 'img');
    plot.setAttribute('aria-label', `${I.series.waste} saves ${waste.map((v) => `${fmt(v, 1)}%`).join(', ')}; ${I.series.demand.toLowerCase()} saves ${demand.map((v) => `${fmt(v, 0)}%`).join(', ')} of all animal lives, at ${I.steps.map((x) => pc(x, 0)).join(', ')} of each lever’s reach. Waste can never save more than ${pc(I.f, 0)}.`);

    const cap22 = el('span', 'lplot__cap');
    cap22.style.setProperty('--y', I.f * 100);
    cap22.appendChild(el('span', 'lplot__captext', `${I.capMax} · ${pc(I.f, 0)}`));
    plot.appendChild(cap22);

    const groups = el('div', 'lgroups');
    I.steps.forEach((x, i) => {
      const g = el('div', 'lgroup');
      [['waste', waste[i]], ['demand', demand[i]]].forEach(([k, v]) => {
        const bar = el('span', `lvbar lvbar--${k}`);
        bar.style.setProperty('--v', v);
        const lab = el('span', 'lvbar__v');
        if (!i) lab.appendChild(el('span', 'lvbar__n', I.series[k]));
        lab.appendChild(el('span', null, `${fmt(v, v % 1 ? 1 : 0)}%`));
        bar.appendChild(lab);
        g.appendChild(bar);
      });
      g.appendChild(el('span', 'lgroup__label', pc(x, 0)));
      groups.appendChild(g);
    });
    plot.appendChild(groups);

    const frame = el('div', 'lchart__frame');
    frame.append(plot, el('p', 'lchart__x', I.xLabel));
    fig.appendChild(frame);

    const legend = list('lchart__legend');
    [['waste', I.series.waste], ['demand', I.series.demand]].forEach(([k, t]) => {
      const li = el('li');
      li.append(hidden(el('span', `lswatch lswatch--${k}`)), t);
      legend.appendChild(li);
    });
    fig.appendChild(legend);
    fig.appendChild(lTable(L.ui, ['Lever applied at', I.series.waste, I.series.demand], I.steps.map((x, i) => [pc(x, 0), `${fmt(waste[i], 1)}%`, `${fmt(demand[i], 0)}%`])));
    return fig;
  };

  /* · Impact: both levers in sequence, saved = 1 − (1 − d)(1 − w·f) */
  const levCurve = (L) => {
    const I = L.impact;
    const C = I.curve;
    const saved = (d, w) => 1 - (1 - d) * (1 - w * I.f);
    const fig = el('figure', 'lchart lcurve');
    fig.setAttribute('aria-labelledby', 'lcurve-cap');
    const cap = el('figcaption', 'lchart__cap');
    cap.id = 'lcurve-cap';
    cap.append(el('span', 'hbar__title', C.title), el('span', 'hbar__sub', C.sub));
    fig.appendChild(cap);

    const m = saved(C.mark.d, C.mark.w);
    const additive = C.mark.d + C.mark.w * I.f;
    const plot = lPlot('lplot--curve', [0, 25, 50, 75, 100]);
    plot.setAttribute('role', 'img');
    plot.setAttribute('aria-label', `Lives saved against demand cut, for three levels of waste removal. With a ${pc(C.mark.d, 0)} demand cut and ${pc(C.mark.w, 0)} less waste, ${pc(m)} of all animal lives are saved — not ${pc(additive, 0)}.`);
    [0, 25, 50, 75, 100].forEach((x) => {
      const t = hidden(el('span', 'lplot__xtick', `${x}%`));
      t.style.setProperty('--x', x);
      plot.appendChild(t);
    });

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'lcurve__svg');
    C.wasteCuts.forEach((w, i) => {
      const pts = [];
      for (let d = 0; d <= 100; d += 5) pts.push(`${d},${(100 - saved(d / 100, w) * 100).toFixed(2)}`);
      const line = document.createElementNS(NS, 'polyline');
      line.setAttribute('points', pts.join(' '));
      line.setAttribute('class', `lcurve__line lcurve__line--${i}`);
      svg.appendChild(line);
    });
    plot.appendChild(svg);

    const dot = hidden(el('span', 'lcurve__dot'));
    dot.style.setProperty('--x', C.mark.d * 100);
    dot.style.setProperty('--y', m * 100);
    const call = el('p', 'lcurve__call');
    call.style.setProperty('--x', C.mark.d * 100);
    call.style.setProperty('--y', m * 100);
    call.append(el('strong', null, `${pc(C.mark.d, 0)} + ${pc(C.mark.w, 0)} = ${pc(m)}`), el('span', null, ` not ${pc(additive, 0)}`));
    plot.append(dot, call);

    const frame = el('div', 'lchart__frame');
    frame.append(el('p', 'lchart__y', C.yLabel), plot, el('p', 'lchart__x', C.xLabel));
    fig.appendChild(frame);

    const legend = list('lchart__legend');
    C.wasteCuts.forEach((w, i) => {
      const li = el('li');
      li.append(hidden(el('span', `lswatch lswatch--line lswatch--line${i}`)), C.labels[w]);
      legend.appendChild(li);
    });
    fig.appendChild(legend);
    const dRows = [0, 0.25, 0.5, 0.75, 1];
    fig.appendChild(lTable(L.ui, ['Demand cut', ...C.wasteCuts.map((w) => C.labels[w])], dRows.map((d) => [pc(d, 0), ...C.wasteCuts.map((w) => pc(saved(d, w)))])));
    return fig;
  };

  /* · Germany: halving meat consumption vs ending all household meat waste */
  const levGermany = (L, fn, used) => {
    const G = L.germany;
    const half = G.total * G.share;
    const ratio = Math.floor(half / G.household);
    const sec = el('div', 'lger');
    const h = el('h4', 'lger__title', G.title);
    h.id = 'lger-title';
    sec.setAttribute('role', 'group');
    sec.setAttribute('aria-labelledby', 'lger-title');
    sec.appendChild(h);
    const rows = el('div', 'lger__rows');
    [
      { v: half, label: G.halveLabel, kind: 'scenario', cls: 'a' },
      { v: G.household, label: G.householdLabel, kind: 'sourced', cls: 'b' },
    ].forEach((r) => {
      const row = el('div', `lger__row lger__row--${r.cls}`);
      const num = el('p', 'lger__num', `≈ ${fmt(r.v, r.v % 1 ? 1 : 0)} ${G.unit}`);
      const bar = hidden(el('span', `lger__bar lseg--${r.kind}`));
      bar.style.setProperty('--w', ((r.v / half) * 100).toFixed(2));
      const txt = el('p', 'lger__label', r.label);
      const tag = tagsFor({ kind: r.kind }, { sourced: L.ui.sourced, scenario: L.ui.scenario, gap: '', invalid: '' });
      row.append(num, txt, bar, tag);
      rows.appendChild(row);
    });
    const ratioEl = el('p', 'lger__ratio');
    ratioEl.append(el('strong', null, `≈ ${ratio}×`), ` ${G.ratioLabel}`);
    sec.append(rows, ratioEl);
    const src = el('p', 'lger__src');
    src.append(`${L.ui.source}: `, fn.cite(G.src, used));
    sec.appendChild(src);
    return sec;
  };

  const levSpecies = (L, fn, used) => {
    const S = L.species;
    const per = Math.round(S.bovine.kg / S.chicken.kg / 10) * 10;
    const sec = el('div', 'lsp');
    const h = el('h4', 'lsp__title', L.blocks.species.title);
    h.id = 'lsp-title';
    sec.setAttribute('role', 'group');
    sec.setAttribute('aria-labelledby', 'lsp-title');
    const nums = el('p', 'lsp__nums');
    nums.append(
      el('span', null, `${S.chicken.name} ≈ ${fmt(S.chicken.kg, 1)} kg`),
      hidden(el('span', 'lsp__sep', '·')),
      el('span', null, `${S.bovine.name} ≈ ${fmt(S.bovine.kg, 0)} kg`),
      hidden(el('span', 'lsp__sep', '→')),
      el('strong', null, `≈ ${per} chickens per bovine`),
    );
    const text = el('p', 'lsp__text', `${S.text} `);
    text.appendChild(fn.cite(S.src, used));
    sec.append(h, nums, text);
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
    system.append(levLegend(L), el('p', 'lregions__hint', L.ui.swipe), regions);

    const impact = block('limpact', 'limpact-title', L.blocks.impact.title, L.blocks.impact.lead);
    const grid = el('div', 'limpact__grid');
    grid.append(levGrouped(L), levCurve(L));
    impact.append(grid, el('p', 'limpact__cap', L.impact.caption));

    const tangible = block('lcase', 'lcase-title', L.blocks.germany.title);
    const pair = el('div', 'lcase__grid');
    pair.append(levGermany(L, fn, used), levSpecies(L, fn, used));
    tangible.appendChild(pair);

    const box = el('div', 'passume');
    box.appendChild(el('h3', 'passume__title', L.blocks.assumptions.title));
    const ol = list('passume__list', 'ol');
    L.assumptions.forEach((a) => {
      const li = el('li');
      li.id = `assume-${a.id}`;
      li.append(el('span', 'passume__id', a.id), el('span', null, a.text));
      ol.appendChild(li);
    });
    box.appendChild(ol);

    root.replaceChildren(system, impact, tangible, box, fn.summary(d.ui.sources, used));

    // A sideways-scrolling row must be reachable by keyboard — but only while it actually scrolls.
    const sync = () => {
      if (regions.scrollWidth > regions.clientWidth + 1) regions.tabIndex = 0;
      else regions.removeAttribute('tabindex');
    };
    sync();
    window.addEventListener('resize', sync);
  };

  /* ---------- Germany: two paths (vegan.html) ---------- */
  const paths = (root, d) => {
    const ui = d.ui;
    const fn = footnotes(d.sources);
    const used = [];

    const lanes = el('div', 'plane-grid');
    d.paths.lanes.forEach((lane) => {
      const sec = el('section', `plane plane--${lane.tone}`);
      const hid = `plane-${lane.id}`;
      sec.setAttribute('aria-labelledby', hid);
      const head = el('header', 'plane__head');
      const h = el('h3', 'plane__title', lane.title);
      h.id = hid;
      head.append(h, el('p', 'plane__verdict', lane.verdict));
      sec.appendChild(head);

      const steps = list('psteps', 'ol');
      lane.steps.forEach((s) => {
        if (s.op) {
          const op = el('li', `pop${s.invalid ? ' pop--invalid' : ''}`);
          const code = el('span', 'pop__code', s.op);
          op.appendChild(code);
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
      lanes.appendChild(sec);
    });

    const box = el('div', 'passume');
    box.appendChild(el('h3', 'passume__title', ui.assumptions));
    const ol = list('passume__list', 'ol');
    d.paths.assumptions.forEach((a) => {
      const li = el('li');
      li.id = `assume-${a.id}`;
      li.append(el('span', 'passume__id', a.id), el('span', null, a.text));
      ol.appendChild(li);
    });
    box.appendChild(ol);

    root.replaceChildren(lanes, box, fn.summary(ui.sources, used));
  };

  /* ---------- Europe, country by country (vegan.html) ---------- */

  const barChart = (c, ui, fn, used) => {
    const digits = c.digits == null ? 1 : c.digits;
    const fig = el('figure', 'hbar is-in');
    const capId = `${c.id}-cap`;
    fig.setAttribute('aria-labelledby', capId);
    const cap = el('figcaption', 'hbar__cap');
    cap.id = capId;
    const title = el('span', 'hbar__title');
    title.append(hidden(el('span', 'dbadge dbadge--sm', c.dim)), c.title);
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
    const hid = `${c.id}-cap`;
    box.setAttribute('role', 'group');
    box.setAttribute('aria-labelledby', hid);
    const head = el('div', 'wflow__head');
    const title = el('p', 'hbar__title');
    title.id = hid;
    title.append(hidden(el('span', 'dbadge dbadge--sm', c.dim)), c.title);
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

  // Drill-downs attached to the cards of one region's row; open by default, can be folded away.
  const drillPanel = (drills, d, fn, used) => {
    const ui = d.ui;
    const det = el('details', 'ddrill');
    det.open = true;
    const sum = el('summary', 'ddrill__sum');
    sum.append(el('span', 'ddrill__tag', ui.drillOn), el('span', 'ddrill__what', drills.map((x) => x.label).join(' · ')));
    det.appendChild(sum);
    const body = el('div', 'ddrill__body');
    drills.forEach((x) =>
      x.ids.forEach((id) => {
        const c = { ...d.drills[id], id: `drill-${id}` };
        body.appendChild(c.type === 'flow' ? flowFigure(c, ui, fn, used) : barChart(c, ui, fn, used));
      }),
    );
    det.appendChild(body);
    return det;
  };

  const europe = (root, d) => {
    const fn = footnotes(d.sources);
    const used = [];
    const grid = el('div', 'eurogrid');
    d.europe.charts.forEach((c) => grid.appendChild(barChart(c, d.ui, fn, used)));
    root.replaceChildren(grid);
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

  /* ---------- A footnote may point into a closed <details>: open it first ---------- */
  const openTarget = (hash) => {
    const id = decodeURIComponent((hash || '').replace(/^#/, ''));
    const t = id && document.getElementById(id);
    const d = t && t.closest('details');
    if (d && !d.open) d.open = true;
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) openTarget(a.hash);
  });
  window.addEventListener('hashchange', () => openTarget(location.hash));
  openTarget(location.hash);

  /* ---------- Go ---------- */
  const run = (sel, key, fnc) => document.querySelectorAll(sel).forEach((root) => DATA[key] && fnc(root, DATA[key]));
  run('[data-levers]', 'vegan', levers);
  run('[data-dashboard]', 'vegan', dashboard);
  run('[data-paths]', 'vegan', paths);
  run('[data-europe]', 'vegan', europe);
  run('[data-foodglance]', 'food', foodGlance);
})();
