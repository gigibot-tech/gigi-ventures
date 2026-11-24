# Changelog

All notable changes to the GiGi Ventures site. Dates are when the change was made.
The site is plain HTML/CSS/JS with no build step, so there are no version numbers.

## 2026-11-23

### Changed (three groups, AI as a layer, YHM live)
- **Removed** the four-number strip on the company page (7 products and concepts · 3 groups · 160 vegan meals · 0 infinite feeds).
- **The same three groups on both pages:** *Connect · learn · meet* (GiGi Social, Gigolingo, GiGi × 4some) · *AI* (GiGi AI, iDO × GiGi, GiGi × YHM) · *Food* (GiGi Food, GiGi Vegan).
  The company page already had them; the concept page now groups its chips and the panel text the same way, and the company hero panel lists them. “Non-AI core” is gone as a label.
- **AI is a layer, not a group of its own products:** GiGi × 4some is marked *Uses AI* (social meetups happen through an AI) and GiGi × YHM *AI-ready* (it could use GiGi AI for language help and ranking — stated as an idea, not a feature; today it matches on rules). YHM moved to the AI side of the tree
  and joined the orbit graphic as a second partner next to iDO.
- **YHM live:** buttons *Join the live waitlist* (yourhealthmatch.de/#join) and *Try the match questionnaire* (yourhealthmatch.de/patient/requirements, a demo profile that stays in the visitor’s browser). Both open in a new tab; nothing is sent to GiGi Ventures. The same links are on the company page.
- **Naming:** GiGi Food and GiGi Vegan are *projects* (real-world projects, as opposed to apps); “Concept” stays only as a stage word on their status pills. Footer columns and labels say “Projects”.

### Added (GiGi × YHM)
- **GiGi × YHM — YourHealthMatch** joined the site as a partner, in the style of “iDO × GiGi”: a **leaf on the ecosystem tree** (AI side — see the next entry — with its own chip and panel), a new
  **“06 — Health · matching” section** on the concept page (what it does in four steps, status *Partner · live*, link to **yourhealthmatch.de**, and how it is deployed: a static SvelteKit app with Netlify functions),
  the **company page** (portfolio list, “Food and health” group, hero note, partner text, footer) and the footers of both pages. Sections below it renumber: Food → 07, Join → 08.
- **New project hue `--p-yhm`** (cobalt `#1f4fa8`, `#5b84e0` on dark), validated with the palette script against its neighbours on the tree (Gigolingo · Food · Vegan) and on the chips.
- Source of the copy: the YourHealthMatch repository (README, `docs/services.md`, positioning). It says what the service does and what it does not claim (not a medical practice, not emergency care); the live URLs `yourhealthmatch.de` and `yourhealthmatch.netlify.app` answered with HTTP 200 on 2026-11-23.

### Changed (meat totals back, wasted left, funnels, sources in the drill-downs)
- **The meat has its own total, like the food.** Each level now has two blocks built the same way — a total on top, its split on one bar, a check, dashed lines down to the two columns: **all food** (≈ 5.5 bn t = 1.05 bn t wasted + ≈ 4.5 bn t consumed) and **the meat inside it**
  (World 335 Mt produced in 2019 = 77.4 Mt lost + ≈ 258 Mt consumed; Europe 61.7 Mt available = 14.2 Mt wasted + 47.5 Mt consumed; Germany: no total). The 335 Mt and 61.7 Mt are back at the top with their labels; 374 Mt (2024) and 37.5 Mt (EU outlook) are the other-year line inside them.
- **A.2 shows meat consumed, not produced.** 374 Mt, 37.5 Mt and 4.6 Mt are production or calculated consumption — waste is still inside them (the OECD-FAO Outlook says so for its consumption figures; Germany’s 4.6 Mt are calculated from the supply balance). The consumed numbers are ≈ 258 Mt (derived, as on the levers page), 47.5 Mt (JRC, derived) and — for Germany — the calculated 4.6 Mt, labelled as such.
- **One order everywhere:** wasted (A.1) on the left, consumed (A.2) on the right — in the bar on top and in the columns below. Dashed funnels join each part of the bar to its column. Stage bars are coral (before the plate: the soft shade) so red no longer means two things.
- **Meat inside the food bar:** a hatched marker in the wasted and in the consumed part, with its numbers in words (not to scale: meat’s share of all food is not reported).
- **Weight before animal lives** in A.1 again; “Not published” boxes are small; the zoom row says what it does (“zoom into Europe — the same measures, one level closer”); in A the source lines of the meat boxes are plain footnote numbers, the full lines stay in B and C.
- **B:** the switch stays in view while you scroll; the Europe rows open with their country charts (food waste by country · chickens by country).
- **C:** opens with a sentence and the per-person comparison (moved out of A.2), then the known household waste. The Germany species mix moved up under the 4.6 Mt it explains; “Europe, from supply to plate” is deleted — it is the Europe meat block in A.

### Changed (total food, one waste section, drill-down colours)
- **A — Total food.** One card per level (World · Europe · Germany). On top the **total food** with a split bar (consumed | wasted) and a **check**: do waste and consumption add up to all the food there is?
  World: yes, inside UNEP’s scope (retail to households) — 1.05 bn t is 19% of the food available, so ≈ 5.5 bn t in all, ≈ 4.5 bn t consumed (derived by us, dashed, note ≠xiv; UNEP’s 2021 report gives the same order: 931 Mt = 17%).
  Not in either: about 13% of food lost before the shop (FAO, another model; new source 18). Europe and Germany: no — Eurostat counts waste from farm to home and nobody publishes the matching total, so those cells are dotted “not published”.
  For meat in Europe it does add up (JRC: 47.5 + 14.2 = 61.7 Mt).
- **A.1 | A.2 with the meat directly under each:** A.1 = all food wasted, with the meat lost (animal lives and weight) under it; A.2 = all food consumed, with the meat eaten and its per-person bar under it. The other-year / other-model number is one slim line inside its box (↳ ≠ other year: 335 Mt).
- **B — Waste is one section.** The tree, the matrix (dual grids), Europe by country and Germany’s two paths are gone as sections. The matrix repeated the tree and the totals; what it added — scope, gaps, the stage split, the drill-downs — now sits in one place, under **one switch: weight | animal lives**.
  Per level: the chain bars, what is known and what is a gap, and one foldable drill-down per row (by country, sector, product, species, stage, the Germany lane that belongs to the view). The assumptions A1–A6 and the “tonnes ≠ animal count” warning sit under both views.
- **Drill-downs by colour:** a number that drills down is underlined in the colour of where it goes — coral = waste by weight, blue = waste in animal lives, green = consumption — and each row has a “Drill down” line with the same destinations as named chips. The coral highlight on every wasted row is gone. Links into B open the right view (`#waste-lives-germany`, `#paths`, `#eu-chickens`).
- Wasted bars are coral and “before the plate” grey, consumed is green (the stage bars used to be green). The levers page’s “Drill down” links now lead to the matching row of B.
- Numbers: the data file was checked against the old one — nothing was dropped (the at-consumption sums are computed from the chain bars); new: ≈ 5.5 bn t, ≈ 4.5 bn t, the FAO 13%.

### Changed (A.1 | A.2 as a duo grid)
- **A · The totals is now a duo grid:** A.1 *Total food waste* and A.2 *Total meat consumption* stand **side by side**, one row per level — World, Europe, Germany — and the two panels share their rows, so World sits next to World and the
  bars line up. The zoom arrows now point **down** from level to level inside each panel (they pointed right before); the elbow connectors are unchanged. The space on the A.1 side above World and Europe is the room the A.2 “other year / model” tile needs, so the main numbers line up. The duo holds at **every** width, phones included: below 800 px the tiles, labels and bars switch to a compact size (checked at 430 and 360 px) instead of stacking. No number changed.

### Changed (restructure of GiGi Vegan)
- **`vegan.html` now starts with two totals, then two drill-downs on meat.**
  - **A The totals**: a 2 × 3 grid — **A.1** *Total food waste* first, **A.2** *Total meat consumption* second — for World · Europe · Germany. Under each number a bar:
    meat per person on one common scale (≈ 28.4 / 66.6 / 54.9 kg), and for waste *before the plate | at consumption* (87.5% / 64.3% / 76.7%).
  - **Relations you can see.** A **zoom →** between neighbouring numbers (1.05 bn t → 57.5 Mt → 10.8 Mt; ↓ on phones) and a 90° **elbow ↳** for a
    number that differs by year or model (Europe 61.7 Mt, EU-28 2011 ↳ 37.5 Mt, EU-27 2022–24; World 335 Mt 2019 ↳ 374 Mt 2024). The
    connectors are plain CSS (no overlay), hidden from screen readers; every one carries a text label and, where numbers differ, a mark.
  - **B Waste (meat)** = the tree, Europe, the waste matrix, the “at consumption” chain, Germany’s two paths. **C Consumption (meat)** =
    meat at the plate per person, what Germany’s 54.9 kg are made of (pork 28.3 · poultry 14.7 · beef & veal 9.7 · other 2.2 kg) and Europe from
    supply to plate (61.7 Mt available → 47.5 Mt consumed + 14.2 Mt wasted). The “all food waste” cells became the children of the totals. The page parts are lettered A–D (A totals · B waste · C consumption · D anchors).
  - The cell letters A–D (animal lives, weight, all food, plate) no longer show on the page — the tree, cards and chain name things in words, so the only letters left are A.1 / A.2 and the part letters. (The ids `cell-A-world` … stay, so links keep working.)
  - No number was changed or added — only re-arranged. New notes: **≠x** (Europe meat 37.5 / 47.5 / 61.7 Mt), **≠xi** (what the world food-waste
    figures cover), **≠xii** (ProVeg’s two wordings), **≠xiii** (waste goals read for meat).
- **The “Two levers” total-system bars moved to `levers.html`**, where they open the page (“01 — The total system”), ahead of the reach
  charts, the projection and the goals. Their “Drill down” links lead back into the waste matrix on GiGi Vegan.
- **One list of number notes** (`assets/data/notes.js`) for both pages; each page shows only the notes whose marks it uses, and the
  links inside notes are page-qualified. Five sources the bars cite (JRC, BZL, GfK, Thünen, food-service estimate) joined the levers page’s source list.
- Navigation: GiGi Vegan reads *Totals · Waste · Consumption · Levers*; the old `vegan.html#levers` and `#dashboard` anchors are now `levers.html#system`
  and `vegan.html#totals`.

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
