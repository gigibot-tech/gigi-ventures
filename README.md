# GiGi Ventures — website v2 (static HTML)

Five pages, no build step, no framework, no cookies, no trackers. Fonts come from Bunny Fonts (EU, no logging).

| Page | What it is |
| --- | --- |
| `index.html` — **Concept** | The manifesto experience: hero (“Big Tech is ~~sh\*t~~ built to keep you”), 4 changed words, 3 rules (People · Explainable · Private & interoperable by default), the ecosystem tree, **GiGi Social × Gigolingo × 4some** in one section, **GiGi AI** (on-device multimodal, concept) with **iDO × GiGi** next to it, and GiGi Food / GiGi Vegan as two concepts side by side. |
| `company.html` — **Company** | A conventional company site: portfolio in three groups, how we work, **future roles\*** (9, with filters), partners & investors, contact. |
| `food.html` — **GiGi Food** | An idea that starts with a €500 grain cooker: basic meals as infrastructure — the idea (“Start with the €500 cooker. Not the €250,000 robot.”), the automation ladder, economics, why every bowl is vegan (links to GiGi Vegan), a 365-day pilot plan and the ask. |
| `vegan.html` — **GiGi Vegan** | An overview first: **Two levers** — per region one total-system bar (consumed + wasted), meat weight then animal lives, with one line of shares and a way down into the matrix; the numbers, sources and links are folded under “Details”. Then the drill-down: a **tree** (all food waste → meat, lives and weight in one node → before the plate / at the plate, the focus: meat eaten; wasted meat in coral), **Europe** country by country, **the waste matrix** (A\|B and C\|D dual grids, drill-downs under their cards, the “at consumption” chain), Germany’s two paths side by side, and three anchors. Numbers that differ between places carry a Roman-numeral mark (≠i) that points to “When a number changes”. |
| `levers.html` — **Two levers: projection** | A page of its own for “how far can each lever go?”: the reach charts (grouped bars, both levers together), what that means in Germany, a **yearly projection** you can steer (region, goal presets, two sliders per lever, per year or cumulative), and the goals of ProVeg, the Albert Schweitzer Foundation, UN SDG 12.3 and the EU 2030 law read in animal lives, each with a caveat. |

The header switch flips **Concept | Company** on the main pages and **GiGi Food | GiGi Vegan** on the two concept pages.

## Run it

```bash
python3 -m http.server 4321 --directory gigi-ventures
```

Then open http://localhost:4321. Opening the HTML files straight from Finder works too.

## Structure

```
gigi-ventures/
├── index.html · company.html · food.html · vegan.html · levers.html
├── netlify.toml · CHANGELOG.md
├── assets/
│   ├── css/base.css        tokens, reset, header, buttons, logo, footer, reveal (shared)
│   ├── css/concept.css     concept page sections
│   ├── css/company.css     company page sections
│   ├── css/food-vegan.css  GiGi Food + GiGi Vegan pages (charts, ladder, receipt, anchors)
│   ├── css/levers.css      the levers page: reach charts, projection controls and chart, goal cards
│   ├── data/vegan.js       GiGi Vegan two levers, tree, dual grids, chain, drill-downs, Europe charts, Germany paths: every number, caveat, source key
│   ├── data/projection.js  the levers page: baselines, goals (paraphrased, with sources), presets, assumptions P1–P7, number notes
│   ├── data/food.js        GiGi Food glance: KPIs, decision gates, sources
│   ├── js/glance.js        renders the data files (two levers, tree, dual grids, chain, paths, Europe charts, food glance) + footnotes
│   ├── js/projection.js    the levers page: reach charts, the projection model, goal cards (uses window.GIGI_UI from glance.js)
│   ├── js/shared.js        header colour per section, mobile menu, reveal on scroll
│   ├── js/concept.js       hero rewrite, 8-language Gigolingo demo, ecosystem tree
│   ├── js/food-vegan.js    free-meal calculator, segmented-bar labels
│   ├── js/company.js       role counts, team filters, #role-… deep links
│   └── favicon.svg
└── README.md
```

## Where to edit

- **Data-driven numbers (GiGi Vegan dashboard, Germany paths, Europe charts; GiGi Food KPIs and gates):** `assets/data/vegan.js`
  and `assets/data/food.js`. `vegan.js` opens with `levers` (regions → bars → segments; `v` sets a segment's width, a segment
  with `fixed` and `kind: 'unknown'` is the hatched grey one; `impact` holds f and the steps; `assumptions` is L1–L6). Below it, the
  waste matrix has three views of the same numbers:
  `tree` (the division: nodes are mini-tables over World · Europe · Germany), `blocks` + `dims` (two dual grids; `dims` A–D hold
  one cell per region, and an item may carry a `child` — the part of it lost at consumption, drawn connected to its parent) and
  `chain` (the same split cut over Farm → Households; a segment with `at` is “at consumption”). Each cell names its own scope
  (region · year · model), and each value has `kind` (`sourced` = solid, `scenario` = dashed, `gap` = dotted, `invalid` = red pen),
  optional `tags`, a `meter`, and `src` keys. Footnote numbers follow the order of `sources` in the data file, which must match the
  numbered list in that page’s “Sources & method” (`id="src-<key>"`) — add both when you add a source. Numbers are never baked into
  images; edit the data file and the page re-renders. (Plain `.js`, not `.json`, so the pages still work when opened from disk.)
  The drill-down charts (`drills`: species, stages, Germany’s food waste by sector and by product, the all-food-to-animals flow) are
  data too: a cell’s `drill: { label, ids }` draws them as a foldable panel under that region’s row, next to the card they explain.
  A Europe chart with `others: { count }` gets a hatched “Other N countries” row — the total minus the listed rows, marked derived.
  Tree numbers repeat figures from the grids; if you change one, change both.

- **The levers page (`levers.html`):** `assets/data/projection.js`. `regions` hold the baselines (animals slaughtered a year) and the
  size of the waste slice `f` (Germany has three: households only, whole chain low / high); `goals` are paraphrases with a source key,
  a caveat and either `model` (a demand cut and a year — lever A) or `stageCuts` + `year` (a food-waste goal, read as a share of the
  wasted lives with the stage shares in `stages`); `presets` combine goals. The model is on the page (P1–P7) and in the file header:
  lives saved = 1 − (1 − d)(1 − w·f). Sources are numbered by their order in the file, which must match the list in `levers.html`.
- **“When a number changes”:** `notes` in `vegan.js` and `projection.js`. Put `mark: 'a'` on an item, segment or cell where a number
  differs from the same thing elsewhere (year, model, scope, rounding); the note lists every version with a link.

- **Contact address:** `contact@gigolingo.com` is used everywhere (search and replace).
- **Future roles:** `company.html` → `#careers`, one `<details data-role data-team="…">` per role. Counts and filters update on their own.
- **Gigolingo demo lines:** `assets/js/concept.js` → `LINES` (one original example sentence per language; objects are tappable words).
- **Tree leaves and panel text:** `index.html` (SVG) and `assets/js/concept.js` → `DATA`.
- **Hero rewrites:** `assets/js/concept.js` → `phrases`.
- **Project colours:** `assets/css/base.css` → `--p-*`. They are checked for colour-blind safety where they sit next to each other
  (tree left: Gigolingo · Vegan · Food; tree right: 4some · AI · iDO), and every coloured mark also carries a text label.

## Before going live

- [ ] **Impressum** and **Datenschutz** pages (required in Germany); the footer links are placeholders (`#`).
- [ ] Future roles, “What you’ll get” and “How we’ll hire” are draft copy.
- [ ] GiGi AI is marked “concept · to be shared”; add details when you’re ready to share them.
- [ ] Food and vegan figures come from the November 2026 feasibility brief and the meat/animal-lives research
      (Klaura et al./Leiden 2019, JRC EU-28 2011, BZL 2025, GfK/UBA 2020). They are model values from different years
      and definitions; re-check before press use.
- [ ] Eurostat food waste (env_wasfw) and chicken slaughter (apro_mt_pann) were pulled from the Eurostat API in November 2026
      (2022 as revised). Eurostat revises past years — refresh before launch. UNEP 2024 was checked against the report.
- [ ] The food-waste stage split (“at consumption” = food service + households) is Eurostat env_wasfw, 2022 as revised (EU-27, Germany),
      and UNEP 2024 (631 / 290 / 131 Mt). The JRC and Klaura splits come from the research brief.
- [ ] Not re-verified by us: food-service meat waste ≈ 85.8 kt (marked “unconfirmed”), OECD-FAO ≈ 28.4 kg (derived),
      FAO 374 Mt (2024), EU outlook 66.6 kg / 37.47 Mt — all taken from our research brief.
- [ ] Gigolingo copy names eight languages “and more” — adjust to the current list.

## Next.js port (planned)

- `app/page.tsx`, `app/company/page.tsx`, `app/food/page.tsx`, `app/vegan/page.tsx`; one component per section.
- `next/font` self-hosts the fonts at build time; `output: 'export'` keeps it fully static.
- Roles, tree leaves, language lines and chart data move into typed modules in `content/`.
