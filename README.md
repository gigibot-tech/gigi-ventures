# GiGi Ventures — website v2 (static HTML)

Four pages, no build step, no framework, no cookies, no trackers. Fonts come from Bunny Fonts (EU, no logging).

| Page | What it is |
| --- | --- |
| `index.html` — **Concept** | The manifesto experience: hero (“Big Tech is ~~sh\*t~~ built to keep you”), 4 changed words, 3 rules (People · Explainable · Private & interoperable by default), the ecosystem tree, **GiGi Social × Gigolingo × 4some** in one section, **GiGi AI** (on-device multimodal, concept) with **iDO × GiGi** next to it, and GiGi Food / GiGi Vegan as two concepts side by side. |
| `company.html` — **Company** | A conventional company site: portfolio in three groups, how we work, **future roles\*** (9, with filters), partners & investors, contact. |
| `food.html` — **GiGi Food** | An idea that starts with a €500 grain cooker: basic meals as infrastructure — the idea (“Start with the €500 cooker. Not the €250,000 robot.”), the automation ladder, economics, why every bowl is vegan (links to GiGi Vegan), a 365-day pilot plan and the ask. |
| `vegan.html` — **GiGi Vegan** | A dashboard story, top to bottom: a **tree** (all food waste → meat, lives and weight in one node → before the plate / at the plate, the focus: meat eaten), two **dual grids** (A animal lives | B meat weight, then C all food waste | D at the plate; World, Europe, Germany as rows, each total connected to its part lost at consumption), a **chain** that shows what “at consumption” means, drill-downs attached under the cards they explain, Europe country by country, Germany’s two paths side by side (animal lives scale with named assumptions; tonnes don’t), three anchors and what’s been achieved for chickens. |

The header switch flips **Concept | Company** on the main pages and **GiGi Food | GiGi Vegan** on the two concept pages.

## Run it

```bash
python3 -m http.server 4321 --directory gigi-ventures
```

Then open http://localhost:4321. Opening the HTML files straight from Finder works too.

## Structure

```
gigi-ventures/
├── index.html · company.html · food.html · vegan.html
├── assets/
│   ├── css/base.css        tokens, reset, header, buttons, logo, footer, reveal (shared)
│   ├── css/concept.css     concept page sections
│   ├── css/company.css     company page sections
│   ├── css/food-vegan.css  GiGi Food + GiGi Vegan pages (charts, ladder, receipt, anchors)
│   ├── data/vegan.js       GiGi Vegan tree, dual grids, chain, Germany paths, Europe charts: every number, caveat, source key
│   ├── data/food.js        GiGi Food glance: KPIs, decision gates, sources
│   ├── js/glance.js        renders the data files (tree, dual grids, chain, paths, Europe charts, food glance) + footnotes
│   ├── js/shared.js        header colour per section, mobile menu, reveal on scroll
│   ├── js/concept.js       hero rewrite, 8-language Gigolingo demo, ecosystem tree
│   ├── js/food-vegan.js    free-meal calculator, segmented-bar labels
│   ├── js/company.js       role counts, team filters, #role-… deep links
│   └── favicon.svg
└── README.md
```

## Where to edit

- **Data-driven numbers (GiGi Vegan dashboard, Germany paths, Europe charts; GiGi Food KPIs and gates):** `assets/data/vegan.js`
  and `assets/data/food.js`. The vegan dashboard has three views of the same numbers in `vegan.js`:
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
