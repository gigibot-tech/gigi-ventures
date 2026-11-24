/* GiGi Ventures — projection.js
   levers.html: (1) the reach of the two levers, (2) a year-by-year projection you can steer, (3) the goals of
   ProVeg, the Albert Schweitzer Foundation, the UN and the EU, read in animal lives.
   Data: assets/data/projection.js. Shared helpers come from glance.js (window.GIGI_UI), which loads first.
   Text goes in with textContent. The projection is a what-if on a flat baseline — see P1–P7 on the page. */
(() => {
  'use strict';

  const D = window.GIGI_DATA && window.GIGI_DATA.projection;
  const U = window.GIGI_UI;
  if (!D || !U) return;
  const { el, list, hidden, fmt, pc, footnotes, marks, setNotes, block, tagsFor } = U;
  setNotes(D);
  const fn = footnotes(D.sources);
  const used = [];
  const ui = D.ui;
  const M = D.model;
  const N = M.end - M.start + 1;
  const NS = 'http://www.w3.org/2000/svg';

  // 86.3 bn · 746 m · 4.6 m — the unit is always in the label.
  const count = (n) => {
    const a = Math.abs(n);
    if (a < 0.5) return '0';
    if (a >= 1e9) return `${fmt(n / 1e9, a >= 1e11 ? 0 : a >= 1e10 ? 1 : 2)} bn`;
    if (a >= 1e6) return `${fmt(n / 1e6, a >= 1e8 ? 0 : 1)} m`;
    return `${fmt(n / 1e3, 0)} k`;
  };
  const niceMax = (v) => {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  };

  /* ===================== 1 · Reach (moved here from GiGi Vegan) ===================== */
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

  const reach = (root) => {
    const L = { impact: D.impact, ui, germany: D.germany, species: D.species, blocks: D.blocks };
    const grid = el('div', 'limpact__grid');
    grid.append(levGrouped(L), levCurve(L));
    const tangible = block('lcase', 'lcase-title', D.blocks.germany.title);
    const pair = el('div', 'lcase__grid');
    pair.append(levGermany(L, fn, used), levSpecies(L, fn, used));
    tangible.appendChild(pair);
    root.replaceChildren(grid, el('p', 'limpact__cap', D.impact.caption), tangible);
  };

  /* ===================== 2 · The projection ===================== */
  const goalById = Object.fromEntries(D.goals.map((g) => [g.id, g]));
  const regionById = Object.fromEntries(D.regions.map((r) => [r.id, r]));
  // A food-waste goal, read as a share of the WASTED animal lives: Σ (stage share × the cut at that stage).
  const wasteCutOf = (g) => Object.entries(g.stageCuts).reduce((t, [stage, cut]) => t + D.stages.shares[stage] * cut, 0);
  const round3 = (v) => Math.round(v * 1000) / 1000;
  const presetState = (p) => {
    const s = { demand: { cut: 0, year: 2040 }, waste: { cut: 0, year: 2030 } };
    p.goals.forEach((id) => {
      const g = goalById[id];
      if (g.model) s.demand = { cut: g.model.demand, year: g.model.year };
      else s.waste = { cut: round3(wasteCutOf(g)), year: g.year };
    });
    return s;
  };

  const state = { region: M.defaultRegion, share: null, mode: 'year', preset: M.defaultPreset, ...presetState(D.presets.find((p) => p.id === M.defaultPreset)) };
  const regionNow = () => regionById[state.region];
  const shareNow = () => {
    const r = regionNow();
    return r.waste.find((w) => w.id === state.share) || r.waste.find((w) => w.id === r.defaultWaste) || r.waste[0];
  };
  const ramp = (year, target) => (target <= M.start ? 1 : Math.min(1, Math.max(0, (year - M.start) / (target - M.start))));
  const lastYear = () => Math.max(0, ...[state.demand, state.waste].filter((l) => l.cut > 0).map((l) => l.year));

  // s = 1 − (1 − d)(1 − w·f) = d + (1 − d)·w·f   — the demand part and the waste part, in animals
  const project = () => {
    const r = regionNow();
    const f = shareNow().f;
    let cumD = 0;
    let cumW = 0;
    return Array.from({ length: N }, (_, i) => {
      const year = M.start + i;
      const d = state.demand.cut * ramp(year, state.demand.year);
      const w = state.waste.cut * ramp(year, state.waste.year);
      const demandN = r.baseline * d;
      const wasteN = r.baseline * (1 - d) * w * f;
      cumD += demandN;
      cumW += wasteN;
      return { year, demandN, wasteN, savedN: demandN + wasteN, cumD, cumW, cumN: cumD + cumW, share: (demandN + wasteN) / r.baseline };
    });
  };

  let ctl = {};
  let hostStats;
  let hostChart;
  let statusEl;
  let statusTimer;

  const segRadio = (name, value, checked, onChange, body) => {
    const label = el('label', 'pseg');
    const input = el('input');
    input.type = 'radio';
    input.name = name;
    input.value = value;
    input.checked = checked;
    input.addEventListener('change', () => input.checked && onChange(value));
    label.append(input, body);
    return label;
  };

  const slider = (id, label, min, max, step, value, text, onInput) => {
    const wrap = el('div', 'pslider');
    const lab = el('label', 'pslider__label', label);
    lab.htmlFor = id;
    const out = el('output', 'pslider__out');
    out.htmlFor = id;
    const input = el('input');
    input.type = 'range';
    input.id = id;
    input.min = min;
    input.max = max;
    input.step = step;
    const show = (v) => {
      out.textContent = text(v);
      input.setAttribute('aria-valuetext', text(v));
    };
    input.addEventListener('input', () => {
      show(+input.value);
      onInput(+input.value);
    });
    input.value = value;
    show(value);
    const head = el('div', 'pslider__head');
    head.append(lab, out);
    wrap.append(head, input);
    return { wrap, input, set: (v) => { input.value = v; show(+input.value); } };
  };

  /* ---- outputs ---- */
  const renderStats = (rows) => {
    const r = regionNow();
    const Y = lastYear();
    const dl = el('dl', 'pstats');
    const add = (k, v, sub) => {
      const box = el('div', 'pstat');
      box.append(el('dt', 'pstat__k', k), el('dd', 'pstat__v', v));
      if (sub) box.appendChild(el('dd', 'pstat__sub', sub));
      dl.appendChild(box);
    };
    if (!Y) {
      add('Nothing changes', '0 fewer animals', `${count(r.baseline)} a year, held flat. Pick a goal or move a slider.`);
      return dl;
    }
    const row = rows[Y - M.start];
    add(`In ${Y}`, `${count(row.savedN)} fewer animals a year`, `${pc(row.share)} of today’s ${count(r.baseline)}`);
    add(`${M.start}–${Y}, added up`, `${count(row.cumN)} animals not slaughtered`, `against a flat ${count(r.baseline)} a year`);
    add('Of that, from lever B', `${count(row.wasteN)} a year in ${Y}`, row.savedN ? `${pc(row.wasteN / row.savedN)} of the yearly saving` : '');
    return dl;
  };

  const renderChart = (rows) => {
    const r = regionNow();
    const cum = state.mode === 'cum';
    const Y = lastYear();
    const vals = rows.map((x) => ({ d: cum ? x.cumD : x.demandN, w: cum ? x.cumW : x.wasteN }));
    const maxV = Math.max(0, ...vals.map((v) => v.d + v.w));
    const yMax = niceMax(Math.max(maxV, cum ? r.baseline * 2 : r.baseline * 0.1));

    const fig = el('figure', 'pchart');
    fig.setAttribute('aria-labelledby', 'pchart-cap');
    const cap = el('figcaption', 'lchart__cap');
    cap.id = 'pchart-cap';
    cap.append(
      el('span', 'hbar__title', cum ? `Animals not slaughtered, added up since ${M.start}` : 'Animals not slaughtered each year'),
      el('span', 'hbar__sub', `${r.name} · against a flat ${count(r.baseline)} a year · ${shareNow().label.toLowerCase()}`),
    );
    fig.appendChild(cap);

    const plot = el('div', 'pplot');
    [0, 0.25, 0.5, 0.75, 1].forEach((t) => {
      const g = el('span', 'lplot__grid');
      g.style.setProperty('--y', t * 100);
      const lab = hidden(el('span', 'lplot__tick', count(yMax * t)));
      lab.style.setProperty('--y', t * 100);
      plot.append(g, lab);
    });
    rows.forEach((x, i) => {
      if ((x.year - M.start) % 5) return;
      const t = hidden(el('span', 'lplot__xtick', String(x.year)));
      t.style.setProperty('--x', ((i + 0.5) / N) * 100);
      plot.appendChild(t);
    });

    // the target years of the two levers
    [['A', state.demand, 'a'], ['B', state.waste, 'b']].forEach(([id, lev, cls]) => {
      if (lev.cut <= 0) return;
      const m = hidden(el('span', `pmark pmark--${cls}`));
      m.style.setProperty('--x', ((lev.year - M.start + 0.5) / N) * 100);
      m.appendChild(el('span', 'pmark__t', `${id} · ${lev.year}`));
      plot.appendChild(m);
    });

    const ul = list('pcols');
    const readout = el('p', 'pchart__readout');
    const text = (i) => {
      const x = rows[i];
      const v = vals[i];
      return cum
        ? `${x.year}: ${count(v.d + v.w)} animals not slaughtered since ${M.start} — lever A ${count(v.d)} + lever B ${count(v.w)}.`
        : `${x.year}: ${count(v.d + v.w)} fewer animals a year (${pc(x.share)}) — lever A ${count(v.d)} + lever B ${count(v.w)}.`;
    };
    const defIdx = Math.min(N - 1, Math.max(0, (Y || 2040) - M.start));
    const show = (i) => { readout.textContent = text(i); };
    rows.forEach((x, i) => {
      const li = el('li', 'pcol');
      li.setAttribute('aria-label', text(i));
      const w = el('span', 'pcol__w');
      w.style.setProperty('--h', ((vals[i].w / yMax) * 100).toFixed(3));
      if (vals[i].w > 0) w.classList.add('has');
      const d = el('span', 'pcol__d');
      d.style.setProperty('--h', ((vals[i].d / yMax) * 100).toFixed(3));
      li.append(w, d);
      ul.appendChild(li);
    });
    const cols = [...ul.children];
    let cur = defIdx;
    cols.forEach((c, i) => {
      c.tabIndex = i === cur ? 0 : -1;
      c.addEventListener('focus', () => { cur = i; show(i); });
      c.addEventListener('mouseenter', () => show(i));
    });
    ul.addEventListener('keydown', (e) => {
      const n = { ArrowRight: Math.min(N - 1, cur + 1), ArrowLeft: Math.max(0, cur - 1), Home: 0, End: N - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      cols[cur].tabIndex = -1;
      cur = n;
      cols[cur].tabIndex = 0;
      cols[cur].focus();
    });
    ul.addEventListener('mouseleave', () => show(defIdx));
    ul.addEventListener('focusout', (e) => { if (!ul.contains(e.relatedTarget)) show(defIdx); });
    plot.appendChild(ul);
    show(defIdx);

    const frame = el('div', 'lchart__frame');
    frame.append(plot, el('p', 'lchart__x', 'Year'));
    fig.append(frame, readout);

    const legend = list('lchart__legend');
    [['demand', 'Lever A — reduce demand'], ['waste', 'Lever B — reduce food waste']].forEach(([k, t]) => {
      const li = el('li');
      li.append(hidden(el('span', `lswatch lswatch--${k}`)), t);
      legend.appendChild(li);
    });
    fig.appendChild(legend);
    fig.appendChild(lTable(ui, ['Year', 'Lever A (demand)', 'Lever B (waste)', 'Together', 'Share of today'], rows.map((x, i) => [String(x.year), count(vals[i].d), count(vals[i].w), count(vals[i].d + vals[i].w), cum ? '' : pc(x.share)])));
    return fig;
  };

  const update = () => {
    const rows = project();
    hostStats.replaceChildren(renderStats(rows));
    hostChart.replaceChildren(renderChart(rows));
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      const Y = lastYear();
      const row = Y ? rows[Y - M.start] : null;
      statusEl.textContent = row ? `${regionNow().name}: in ${Y}, ${count(row.savedN)} fewer animals a year; ${count(row.cumN)} added up since ${M.start}.` : `${regionNow().name}: nothing changes.`;
    }, 500);
  };

  /* ---- controls ---- */
  const syncSliders = () => {
    ctl.dCut.set(+(state.demand.cut * 100).toFixed(1));
    ctl.dYear.set(state.demand.year);
    ctl.wCut.set(+(state.waste.cut * 100).toFixed(1));
    ctl.wYear.set(state.waste.year);
  };
  const markPreset = () => {
    ctl.presets.forEach(([id, b]) => b.setAttribute('aria-pressed', String(id === state.preset)));
  };
  const applyPreset = (id) => {
    const p = D.presets.find((x) => x.id === id);
    if (!p) return;
    Object.assign(state, presetState(p), { preset: id });
    syncSliders();
    markPreset();
    update();
  };

  const renderBase = () => {
    const r = regionNow();
    const p = el('p', 'pbase');
    p.append(`Starting point: ${r.basis}. `);
    if (r.tag) p.append(el('span', 'mtag mtag--flag', r.tag), ' ');
    p.append(`${ui.source}: `, fn.cite(r.src, used));
    if (r.mark) p.appendChild(marks(r.mark));
    ctl.base.replaceChildren(p);
  };

  const renderShare = () => {
    const r = regionNow();
    if (r.waste.length < 2) {
      ctl.share.replaceChildren(el('p', 'pnote', `Waste slice: ${r.waste[0].sub}. The same share is used for the whole region (P6).`));
      return;
    }
    const field = el('fieldset', 'pfield');
    field.appendChild(el('legend', 'pfield__legend', ui.wasteLegend));
    const wrap = el('div', 'pseggroup');
    r.waste.forEach((w) => {
      const body = el('span', `pseg__body pseg__body--${w.kind}`);
      body.append(el('span', 'pseg__name', w.label), el('span', 'pseg__sub', w.sub));
      wrap.appendChild(segRadio('pshare', w.id, w.id === shareNow().id, (v) => { state.share = v; update(); }, body));
    });
    field.appendChild(wrap);
    ctl.share.replaceChildren(field);
  };

  const buildProjection = (root) => {
    // region
    const regionField = el('fieldset', 'pfield');
    regionField.appendChild(el('legend', 'pfield__legend', ui.regionLegend));
    const rw = el('div', 'pseggroup');
    D.regions.forEach((r) => {
      const body = el('span', 'pseg__body');
      const sub = el('span', 'pseg__sub', r.basis);
      sub.id = `base-${r.id}`;
      body.append(el('span', 'pseg__name', r.name), sub);
      rw.appendChild(segRadio('pregion', r.id, r.id === state.region, (v) => { state.region = v; state.share = null; renderBase(); renderShare(); update(); }, body));
    });
    regionField.appendChild(rw);
    ctl.base = el('div', 'pbase-host');
    ctl.share = el('div', 'pshare-host');

    // presets
    const presetBox = el('div', 'pfield');
    presetBox.appendChild(el('p', 'pfield__legend', ui.presetLegend));
    const pw = el('div', 'ppresets');
    ctl.presets = [];
    D.presets.forEach((p) => {
      const b = el('button', 'ppreset', p.label);
      b.type = 'button';
      b.addEventListener('click', () => applyPreset(p.id));
      ctl.presets.push([p.id, b]);
      pw.appendChild(b);
    });
    presetBox.appendChild(pw);

    // lever A / B
    const touch = () => { state.preset = null; markPreset(); update(); };
    ctl.dCut = slider('p-dcut', ui.cut, 0, 100, 1, state.demand.cut * 100, (v) => `${fmt(v, 0)}%`, (v) => { state.demand.cut = v / 100; touch(); });
    ctl.dYear = slider('p-dyear', ui.byYear, 2030, 2050, 1, state.demand.year, (v) => String(v), (v) => { state.demand.year = v; touch(); });
    ctl.wCut = slider('p-wcut', `${ui.cut} of the wasted lives`, 0, 100, 0.1, state.waste.cut * 100, (v) => `${fmt(v, 1)}%`, (v) => { state.waste.cut = v / 100; touch(); });
    ctl.wYear = slider('p-wyear', ui.byYear, 2026, 2050, 1, state.waste.year, (v) => String(v), (v) => { state.waste.year = v; touch(); });
    const lever = (cls, title, a, b) => {
      const f = el('fieldset', `pfield plever plever--${cls}`);
      f.append(el('legend', 'pfield__legend', title), a.wrap, b.wrap);
      return f;
    };

    const controls = el('div', 'proj__controls');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Projection settings');
    controls.append(regionField, ctl.base, ctl.share, presetBox, lever('a', ui.leverA, ctl.dCut, ctl.dYear), lever('b', ui.leverB, ctl.wCut, ctl.wYear));

    // outputs
    hostStats = el('div', 'pstats-host');
    hostChart = el('div', 'pchart-host');
    statusEl = el('p', 'sr-only');
    statusEl.setAttribute('role', 'status');
    const modeField = el('fieldset', 'pfield pfield--mode');
    modeField.appendChild(el('legend', 'pfield__legend', ui.modeLegend));
    const mw = el('div', 'pseggroup pseggroup--row');
    [['year', ui.modeYear], ['cum', ui.modeCum]].forEach(([v, t]) => {
      const body = el('span', 'pseg__body');
      body.appendChild(el('span', 'pseg__name', t));
      mw.appendChild(segRadio('pmode', v, v === state.mode, (m) => { state.mode = m; update(); }, body));
    });
    modeField.appendChild(mw);
    const out = el('div', 'proj__out');
    out.append(hostStats, modeField, hostChart, statusEl);

    const wrap = el('div', 'proj');
    wrap.append(controls, out);
    root.replaceChildren(wrap);
    renderBase();
    renderShare();
    markPreset();
    update();
  };

  /* ===================== 3 · The goals ===================== */
  const goalCard = (g) => {
    const art = el('article', 'pgoal');
    art.id = `goal-${g.id}`;
    art.setAttribute('aria-labelledby', `goal-${g.id}-h`);
    const head = el('header', 'pgoal__head');
    const h = el('h3', 'pgoal__org', g.org);
    h.id = `goal-${g.id}-h`;
    head.append(h, el('span', `mtag pgoal__lever pgoal__lever--${g.lever.toLowerCase()}`, `Lever ${g.lever} · ${g.lever === 'A' ? 'demand' : 'waste'}`));
    const said = el('p', 'pgoal__said', `${g.said} `);
    said.appendChild(fn.cite(g.src, used));
    if (g.mark) said.appendChild(marks(g.mark));
    art.append(head, said);
    if (g.aside) art.appendChild(el('p', 'pgoal__aside', g.aside));
    art.appendChild(el('p', 'pgoal__reading', g.reading));

    const res = list('pgoal__res');
    D.regions.forEach((r) => {
      const f = (r.waste.find((w) => w.id === r.defaultWaste) || r.waste[0]).f;
      const share = g.model ? g.model.demand : wasteCutOf(g) * f;
      const year = g.model ? g.model.year : g.year;
      const li = el('li');
      li.append(el('span', 'pgoal__reg', r.name), el('strong', 'pgoal__n', `${count(r.baseline * share)} a year`), el('span', 'pgoal__pct', `${pc(share)} of ${count(r.baseline)} · by ${year}${g.model && g.model.yearAssumed ? ` (${ui.assumed})` : ''}`));
      res.appendChild(li);
    });
    art.appendChild(res);
    art.appendChild(el('p', 'pgoal__caveat', g.caveat));
    const b = el('button', 'btn btn--sm btn--ink pgoal__go', ui.showIn);
    b.type = 'button';
    b.addEventListener('click', () => {
      applyPreset(g.id);
      const t = document.getElementById('projection');
      if (t) t.scrollIntoView();
    });
    art.appendChild(b);
    return art;
  };

  const goals = (root) => {
    const grid = el('div', 'pgoals');
    D.goals.forEach((g) => grid.appendChild(goalCard(g)));
    root.replaceChildren(grid, fn.summary(ui.sources, used));
  };

  const assumptions = (root) => {
    const box = el('div', 'passume');
    box.appendChild(el('h3', 'passume__title', 'Assumptions behind the projection'));
    const ol = list('passume__list', 'ol');
    D.assumptions.forEach((a) => {
      const li = el('li');
      li.id = `assume-${a.id}`;
      li.append(el('span', 'passume__id', a.id), el('span', null, a.text));
      ol.appendChild(li);
    });
    box.appendChild(ol);
    root.replaceChildren(box);
  };

  /* ---------- Go ---------- */
  document.querySelectorAll('[data-reach]').forEach(reach);
  document.querySelectorAll('[data-projection]').forEach(buildProjection);
  document.querySelectorAll('[data-passume]').forEach(assumptions);
  document.querySelectorAll('[data-goals]').forEach(goals);

  U.renderNotes(); // the marks of this page exist now: list their notes

  // A deep link (levers.html#base-world, #goal-sdg …) points at something drawn just now: go there.
  if (location.hash.length > 1) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) requestAnimationFrame(() => t.scrollIntoView());
  }
})();
