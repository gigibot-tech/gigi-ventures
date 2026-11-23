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
