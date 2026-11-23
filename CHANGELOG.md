# Changelog

All notable changes to the GiGi Ventures site. Dates are when the change was made.
The site is plain HTML/CSS/JS with no build step, so there are no version numbers.

## 2026-11-23

### Added
- **GiGi Vegan — "Two levers", the new primary view** (`vegan.html#levers`, first analytical section).
  - Per region (World · Europe · Germany) one *total system* bar per measure — animal lives and meat weight —
    split into **consumed** (green) and **wasted** (coral). **Lever A**, reduce demand / plant-based, is drawn
    across the whole bar; **lever B**, reduce food waste, only under the wasted segment.
  - Solid = sourced, dashed = scenario, hatched grey = unknown or not harmonized. Germany's whole-chain
    figures are dashed (lives) or hatched (weight); Europe carries a "not harmonized" note (Europe-43 lives
    vs EU-28 weight).
  - **Lever impact**: grouped bars (waste only = f·x, demand only = x, with the dashed "max via waste" line
    at 22%) and a curve for both levers in sequence, saved = 1 − (1 − d)(1 − w·f), with 50% + 50% = 55.5%
    marked (not the additive 61%).
  - **Germany**: halving meat consumption ≈ 373 m fewer animals a year vs ending all household meat waste
    ≈ 10.5 m (≈ 35×). **Species note**: ≈ 200 chickens per bovine, fish excluded.
  - **Lever assumptions L1–L6**, next to the existing A1–A6 ledger. L2 states a limit of the 22%: the
    ≈ 18 bn include animals lost on the farm before slaughter, the ≈ 80 bn count slaughtered animals.
  - Every number comes from `assets/data/vegan.js` (`levers`); three new sources, numbered 15–17
    (FAO slaughter counts, Destatis 2025, research brief). Existing footnote numbers are unchanged.
  - Layout: three columns on desktop, a keyboard-focusable scroll-snap row on tablet (640–1099 px),
    one column on mobile. Table views for both charts.
- `netlify.toml`: publish the repo root, no build; security headers; assets revalidate on every visit.
- This changelog.

### Added (later the same day)
- **`levers.html` — how far can each lever go?** A page of its own, linked from the Two levers section on GiGi Vegan.
  The reach charts and the Germany / species notes moved here from `vegan.html`; new: a **yearly projection** (2025–2050) for the
  world, Europe and Germany with goal presets, two sliders per lever, per-year or cumulative view, a keyboard-readable chart and a
  table view; and **four goals read in animal lives** — ProVeg International (50% of animal products replaced by 2040), the Albert
  Schweitzer Foundation (no number or year of its own; cites a 70–80% cut in European meat), UN SDG 12.3 and the EU 2030 food-waste
  law. Waste goals are read as a share of the *wasted* lives with the world stage shares (SDG ≈ 24%, EU ≈ 16%). Each goal has a caveat;
  assumptions P1–P7 are on the page. Goals are paraphrased and sourced; the ProVeg wording is dated (June 2024).
- **“When a number changes”** (GiGi Vegan and the levers page): wherever the same thing appears with a different number — another
  year, model, scope or rounding — a Roman-numeral mark (≠i) points to a note that says what changed and links to every version
  (≈ 18 bn vs 17.97 bn; 335 Mt vs 374 Mt; 16% vs 16.7%; Europe-43 / EU-28 / EU-27; 10.5 m vs 39–85 m; 74.6 kt vs ≈ 125 kt; …).
- Drill-down links from the wasted figures in the Two levers bars into that region’s row of the waste matrix; the ≥ 39.3 m scenario
  card links to “Germany, two paths”.

### Changed (third pass)
- The tree links into the matrix: a “Drill down” on its Total, Animal lives and Weight rows, and every number that has a card
  (10.8 Mt, 74.6 kt, …) is a link to that card.
- In the waste matrix, “All food waste → the plate” sits one block up (right after “Meat lost or wasted”, before the chain); the
  blocks are separated by a rule and more space and carry a short visible title.
- The number-note marks are Roman numerals (≠i … ≠ix) so they no longer collide with the dimension letters A–D.

### Changed (later the same day)
- **GiGi Vegan, first section as an overview:** meat weight before animal lives in every region; each bar shows its shares and a
  “Drill down” link, the full list (numbers in right-hand columns, sources, tags) is folded under “Details”, with one “Show all
  details” switch; the assumptions L1–L6 are folded too.
- **Section order:** Two levers → Drill-down (the tree) → Europe → the waste matrix (dual grids, chain, warning) → Germany → anchors.
- The dual grids lost their block titles, intro lines and A/B, C/D column headings (the repetition); each cell carries its own
  small label, and the “Focus” tag stays on the plate.
- In the tree, wasted meat wears the coral of the two levers; meat eaten stays green.
- Bar-chart rows stack the label above the bar on phones.

### Changed
- **GiGi Vegan** order is now: Two levers → drill-down (the waste matrix) → Europe → Germany → anchors.
  The World → Europe → Germany matrix (tree, A|B and C|D dual grids, "at consumption" chain) is demoted to
  a drill-down; its warning ("tonnes ≠ animal count") stays. Europe moved before Germany.
- Drill-downs (species, stages, Germany's food waste by sector and by product, the all-food-to-animals flow)
  are data now and sit under the card they explain, as foldable panels.
- Europe charts get a hatched "Other N countries" row: the total minus the listed countries
  (food waste ≈ 10.3 Mt, chickens ≈ 867 m), marked derived.
- Germany's two paths (animal lives | weight) now sit side by side.
- **GiGi Food** is framed as an idea that starts with a €500 grain cooker, not a finished plan.
- **Home**: GiGi Social is a leaf next to 4some (the trunk is shared, not an app); the GiGi Vegan panel no
  longer calls Vegan a menu — it says the kitchen is one place we'd act on these facts; "Vegan facts" joins
  "Vegan kitchen" in the ticker.

### Fixed
- Bar-chart labels sit above their bars on phones, so the bars keep their length.

### Notes
- Units are English (bn, m, Mt, kt), consistent with the rest of the site. The site has no i18n layer;
  nothing was removed.
- Verified against sources this round: FAO 2024 (86.3 bn animals, 91% chickens), Destatis 2025
  (48.5 m + 697.3 m ≈ 746 m; the sum is ours), Eurostat env_wasfw (EU-27, Germany, 2022), UNEP 2024
  (631 / 290 / 131 Mt). **Not re-verified**: world production 335 Mt, Europe-43 total ≈ 12.5 bn,
  EU-27 poultry ≈ 6.4 bn, meat per animal (1.6 kg, 323 kg), food-service meat waste ≈ 85.8 kt,
  OECD-FAO ≈ 28.4 kg, FAO 374 Mt, EU outlook 66.6 kg. The "≈ 80 bn" for 2019 is a rounded figure.

## Earlier

- First public structure: Concept, Company, GiGi Food and GiGi Vegan pages; shared design system
  (`base.css`), economics calculator, source footnotes numbered from the data files.
