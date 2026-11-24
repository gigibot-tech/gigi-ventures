# GiGi Ventures — website v2 (static HTML)

Five pages, no build step, no framework, no cookies, no trackers. Fonts come from Bunny Fonts (EU, no logging).

| Page | What it is |
| --- | --- |
| `index.html` — **Concept** | The manifesto experience: hero (“Big Tech is ~~sh\*t~~ built to keep you”), 4 changed words, 3 rules (People · Explainable · Private & interoperable by default), the ecosystem tree (leaves in three groups — connect · learn · meet, AI, food; AI is a layer, so 4some uses it and YHM could), **GiGi Social × Gigolingo × 4some** in one section, **GiGi AI** (on-device multimodal, concept) with **iDO × GiGi** next to it, **GiGi × YHM** (YourHealthMatch — matching patients with doctors in Germany, live at yourhealthmatch.de, with buttons to its live waitlist and match questionnaire) as its own section, and GiGi Food / GiGi Vegan as two projects side by side. |
| `company.html` — **Company** | A conventional company site: portfolio in three groups (food and health included), how we work, **future roles\*** (9, with filters), partners & investors, contact. |
| `food.html` — **GiGi Food** | An idea that starts with a €500 grain cooker: basic meals as infrastructure — the idea (“Start with the €500 cooker. Not the €250,000 robot.”), the automation ladder, economics, why every bowl is vegan (links to GiGi Vegan), a 365-day pilot plan and the ask. |
| `vegan.html` — **GiGi Vegan** | **A Total food:** one card per level (World · Europe · Germany) — the total food on top with a check (do waste and consumption add up to all there is? yes for the world inside UNEP’s scope, no for Europe and Germany), then **A.1** waste | **A.2** consumption side by side with the meat directly under each (the other-year version of a number is one slim line inside its box). **B Waste:** one section with one switch, *weight | animal lives*: per level, where along the chain it is lost, what is known and what is a gap, and one foldable drill-down per row (by country, sector, product, species, the two Germany paths). **C Consumption:** what the eaten meat is made of, Europe from supply to plate. Then three anchors (**D**). Numbers that drill down are underlined in the colour of where they go — coral = waste by weight, blue = waste in animal lives, green = consumption — and every row has a “Drill down” line naming the same destinations in words. Numbers that differ between places carry a Roman-numeral mark (≠i) that points to “When a number changes”. |
| `levers.html` — **Two levers: projection** | A page of its own for “how far can each lever go?”: **the total system** (per region one bar, consumed + wasted, meat weight then animal lives; lever A acts on the whole bar, lever B on the wasted part; details, sources and links folded under each bar), the reach charts (grouped bars, both levers together), what that means in Germany, a **yearly projection** you can steer (region, goal presets, two sliders per lever, per year or cumulative), and the goals of ProVeg, the Albert Schweitzer Foundation, UN SDG 12.3 and the EU 2030 law read in animal lives, each with a caveat. |

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
│   ├── data/vegan.js       GiGi Vegan: the totals grid, tree, dual grids, chain, consumption chapter, drill-downs, Europe charts, Germany paths: every number, caveat, source key
│   ├── data/projection.js  the levers page: the total-system bars (levers), baselines, goals (paraphrased, with sources), presets, assumptions L1–L6 and P1–P7
│   ├── data/notes.js       “When a number changes”: one list for both pages — each page shows only the notes whose marks it uses
│   ├── data/food.js        GiGi Food glance: KPIs, decision gates, sources
│   ├── js/glance.js        renders the data files (totals + relation arrows, tree, dual grids, chain, consumption chapter, paths, Europe charts, total-system bars, food glance) + footnotes + number notes
│   ├── js/projection.js    the levers page: reach charts, the projection model, goal cards (uses window.GIGI_UI from glance.js)
│   ├── js/shared.js        header colour per section, mobile menu, reveal on scroll
│   ├── js/concept.js       hero rewrite, 8-language Gigolingo demo, ecosystem tree
│   ├── js/food-vegan.js    free-meal calculator, segmented-bar labels
│   ├── js/company.js       role counts, team filters, #role-… deep links
│   └── favicon.svg
└── README.md
```

## Where to edit

- **Data-driven numbers (GiGi Vegan; GiGi Food KPIs and gates):** `assets/data/vegan.js` and `assets/data/food.js`. `vegan.js` is read top to
  bottom like the page. `totals.levels` (A): per level a `food` block (the total tile, its `split` — wasted first —, the `check`, the `inset` of meat numbers) and a `meat` block (the same three), then `waste` (A.1: food tile, stage `bar`, `meat` boxes — weight first) and `consumption` (A.2: food tile, `meat` boxes, `species: true` to draw the species mix under them). A tile may carry an `other` year/model line.
  `waste.views` (B): `weight` and `lives`, each a list of `rows` (one per level) whose `items` are a stage bar from `chain.bars` (by `id`) or a value `box`, plus `drills` (ids in `drills` or `europe.charts`), `open` (start unfolded) and `paths` (which Germany lane). `consumption` (C): `perPerson`, `species`, `known`.
  A number with `to` + `dd` is a drill-down link: `dd` (`weight` · `lives` · `consumption`, defined in `dd`) picks its colour; the destination is
  always named in words next to it. Each box names its own scope (region · year · model) and has a `kind` (`sourced` = solid, `scenario` =
  dashed — also for a derived total —, `gap` = dotted, `invalid` = red pen), optional `tags`, a `meter`, and `src` keys. Footnote numbers follow
  the order of `sources` in the data file, which must match the numbered list in that page’s “Sources & method” (`id="src-<key>"`) — add both,
  at the END, when you add a source. Numbers are never baked into images; edit the data file and the page re-renders. (Plain `.js`, not `.json`,
  so the pages still work when opened from disk.)

- **The levers page (`levers.html`):** `assets/data/projection.js`. `levers` holds the total-system bars (regions → bars → segments;
  `v` sets a segment’s width, a segment with `fixed` and `kind: 'unknown'` is the hatched grey one; `assumptions` is L1–L6; a segment’s
  `drill` links back into the vegan page’s matrix). `regions` hold the baselines (animals slaughtered a year) and the size of the waste
  slice `f` (Germany has three: households only, whole chain low / high); `goals` are paraphrases with a source key, a caveat and either
  `model` (a demand cut and a year — lever A) or `stageCuts` + `year` (a food-waste goal, read as a share of the wasted lives with the
  stage shares in `stages`); `presets` combine goals. The model is on the page (P1–P7) and in the file header: lives saved =
  1 − (1 − d)(1 − w·f). Sources are numbered by their order in the file, which must match the list in `levers.html`.
- **“When a number changes”:** one list, `assets/data/notes.js`, loaded by both pages. Put `mark: 'iii'` on an item, segment, cell or tile
  where a number differs from the same thing elsewhere (year, model, scope, rounding); the note lists every version with a
  page-qualified link (`vegan.html#…`, `levers.html#…`). A page lists only the notes whose marks it draws, in numeral order.

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
