/* GiGi Vegan — data/vegan.js
   Every number on the GiGi Vegan page lives HERE, next to its source key and caveat.
   Edit this file and the page re-renders; nothing is baked into an image.

   The page, top to bottom:
     A  totals       → one card per level (World · Europe · Germany): all food on top (is waste + consumption all there is?),
                       then A.1 waste | A.2 consumption side by side, the meat directly under each        (`totals`)
     B  waste        → ONE section with ONE switch, weight | animal lives: where along the chain the waste happens, one row per level.
                       Stage bars come from `chain`, the foldable drill-downs from `drills`, `europe` and `paths`      (`waste`)
     C  consumption  → what the eaten meat is made of, and Europe from supply to plate                       (`consumption`)
   Every number names its own region, year and model, because "Europe" is three different scopes here
   (Europe-43 in Klaura, EU-28 in the JRC model, EU-27 at Eurostat).

   kind: "sourced"  → solid box   (a value taken from a source; a value derived inside one model carries a "Derived" tag)
         "scenario" → dashed box  (an assumption or a derivation across a rounded figure — ours, not a measurement)
         "gap"      → dotted box  (not measured / not published — shown, not hidden)
         "invalid"  → red box     (a calculation we refuse to use; Germany paths only)
   src:  one or more keys from `sources`. Footnote numbers follow the ORDER of `sources` below, which
         is also the order of the numbered list in the page's "Sources & method" (id="src-<key>").
   to + dd: a number that drills down. `to` = where (an #id on this page), `dd` = which destination (see `dd`): it wears that colour.
   Plain .js (not .json) so it also works when the page is opened straight from disk.              */

window.GIGI_DATA = window.GIGI_DATA || {};

window.GIGI_DATA.vegan = {
  ui: {
    sourced: 'Sourced',
    scenario: 'Scenario',
    gap: 'Not measured',
    invalid: 'Not valid',
    keyLabel: 'How to read the numbers',
    keySourced: 'Solid — sourced value',
    keyScenario: 'Dashed — derived or assumed by us',
    keyGap: 'Dotted — not measured or not published',
    keyScope: 'Each number names its region, year and model. Compare along a row — never divide across models.',
    keyDrill: 'Underlined numbers drill down — the colour says where to:',
    source: 'Source',
    sources: 'Sources',
    drill: 'Drill down',
    drillTo: 'Drill down to',
    atConsumption: 'At consumption',
    chainLabel: 'What “at consumption” means',
    perPerson: 'Per person a year',
    beforePlate: 'before the plate',
    switchLabel: 'Show the waste as',
    checkOk: 'Adds up',
    checkNo: 'Does not add up',
    checkEst: 'Estimate',
    notesTitle: 'When a number changes',
    notesLead: 'The same thing shows up with different numbers in different places — another year, model, scope or rounding. Each mark (≠i) on the page points here: what changed, and where to find every version.',
    noteMark: 'Number note',
    others: 'Other',
    othersNote: 'derived: the total minus the top ten, not a Eurostat figure',
    assumptions: 'Assumptions — named',
    tableView: 'View as table',
  },

  // Drill-down destinations. A number that drills down wears the colour of where it goes — and says it in words.
  dd: {
    weight: { word: 'weight', title: 'Waste, by weight', to: '#waste-weight' },
    lives: { word: 'animal lives', title: 'Waste, in animal lives', to: '#waste-lives' },
    consumption: { word: 'consumption', title: 'Consumption', to: '#consumption' },
  },

  // Order = footnote numbers = order of the numbered "Sources & method" list in vegan.html.
  sources: {
    klaura: {
      short: 'Klaura et al. 2023',
      label: 'Klaura et al. 2023, Leiden University — animal lives in meat loss and waste; data 2019; six land species',
    },
    jrc: {
      short: 'JRC 2011',
      label: 'European Commission JRC mass-flow model, EU-28, data 2011 — meat by supply-chain stage',
    },
    unep: {
      short: 'UNEP 2024',
      label: 'UNEP Food Waste Index Report 2024 — data 2022; retail, food service and households',
    },
    eurostat: {
      short: 'Eurostat',
      label: 'Eurostat food waste statistics (env_wasfw), data 2022 as revised; latest year 2024',
    },
    slaughter: {
      short: 'Eurostat 2022',
      label: 'Eurostat, slaughtering in slaughterhouses (apro_mt_pann), 2022 — chickens, number of animals',
    },
    oecd: {
      short: 'OECD-FAO',
      label: 'OECD-FAO Agricultural Outlook 2025–2034 — 29.3 kg per person in 2034, +0.9 kg on the base period',
    },
    fao: {
      short: 'FAO 2024',
      label: 'FAO meat market estimates 2024 — 374 Mt produced (carcass weight)',
    },
    euoutlook: {
      short: 'EU outlook',
      label: 'European Commission, EU agricultural outlook — meat consumption, average 2022–24',
    },
    bzl: {
      short: 'BZL 2025',
      label: 'BZL supply balance 2025 (provisional) — calculated meat consumption',
    },
    gfk: {
      short: 'GfK 2020',
      label: 'GfK household panel 2020, via the German Environment Agency (UBA)',
    },
    thuenen: {
      short: 'Thünen',
      label: 'Thünen Report 71 — about half of household food waste is avoidable',
    },
    fleischatlas: {
      short: 'Meat Atlas 2021',
      label: 'Meat Atlas (Fleischatlas) 2021 — an advocacy source; calculation method not fully published',
    },
    ahv: {
      short: 'Earlier analysis',
      label: 'Food-service meat waste ≈ 85.8 kt (2018/19) — a study estimate we could not re-verify',
    },
    model: {
      short: 'GiGi Vegan model',
      label: 'Our own calculation — the lever assumptions L1–L6 and “Germany: two paths” on this page',
    },
    faostat: {
      short: 'FAO slaughter',
      label: 'FAO (FAOSTAT) live animals slaughtered — 86.3 bn in 2024, 91% of them chickens (78.5 bn); “≈ 80 bn” for 2019 is a rounded figure (Our World in Data: 83 bn in 2022)',
    },
    destatis: {
      short: 'Destatis 2025',
      label: 'Destatis press release 049/2026 — 2025 slaughter: 48.5 m pigs, cattle, sheep, goats and horses + 697.3 m chickens, turkeys and ducks; the sum (≈ 746 m) is ours',
    },
    brief: {
      short: 'Research brief',
      label: 'GiGi research brief — figures we have not re-verified: 335 Mt world production (2019), Europe-43 total ≈ 12.5 bn animals, EU-27 poultry ≈ 6.4 bn (2020), meat per animal (chicken ≈ 1.6 kg, bovine ≈ 323 kg)',
    },
    faoloss: {
      short: 'FAO food loss',
      label: 'FAO food loss and waste page — 13.2% of food is lost after harvest and before the retail stage (UNEP’s waste figures start at retail); a different model',
    },
  },


  // A · Total food — wasted or consumed, one card per level (World · Europe · Germany).
  //   Each card has two blocks built the same way: a TOTAL on top (the number, its split on one bar — wasted A.1 on the LEFT,
  //   consumed A.2 on the RIGHT — and a check: do the two parts add up to it?), dashed lines down to the two parts below.
  //     block 1 · all food (`food` → `waste.tile` | `consumption.tile`)      block 2 · the meat inside it (`meat` → `waste.meat` | `consumption.meat`)
  //   A zoom row joins one level to the next. Connectors never carry a ratio: between models they only say "zoom" or "other year".
  //   The other-year / other-model version of a total is one slim line inside its box (↳ ≠ other year …).
  //   bar.kind "stage": before the plate | at consumption, taken from `chain.bars[bar.chain]`.  Meat per person a year lives in C.
  totals: {
    heads: {
      food: { tag: 'A', title: 'Total food', sub: 'All food is wasted or consumed — is there anything else?' },
      waste: { tag: 'A.1', title: 'Total food waste', sub: 'All foods, thrown away.' },
      consumption: { tag: 'A.2', title: 'Total food consumption', sub: 'All foods, eaten.' },
      meat: { title: 'Total meat — inside the food', sub: 'Produced or available, then lost or wasted, or consumed.' },
      meatWaste: 'Meat lost or wasted',
      meatConsumption: 'Meat consumed',
    },
    unknownSplit: 'Unknown — there is no total to split.',
    foot: 'Europe is three scopes here: Europe-43 (animal lives), EU-28 · 2011 (meat weight), EU-27 · 2022 (all food waste). Every number names its own scope; compare along a level, never divide across models.',
    levels: [
      {
        geo: 'world',
        zoom: { text: 'zoom into Europe — the same measures, one level closer', label: 'Zoom from World into Europe', mark: 'xi' },
        food: {
          inset: { note: 'Meat is drawn inside as a marker, not to scale: meat’s share of all food is not reported, and the meat numbers are other models and years.', wasted: { text: '77.4 Mt meat lost or wasted · 17.97 bn animal lives' }, consumed: { text: '≈ 258 Mt meat consumed' } },
          tile: {
            id: 'tot-food-world', kind: 'scenario', value: '≈ 5.5 bn t',
            label: 'food available to consumers',
            sub: 'World · 2022 · retail to households — the 1.05 bn t wasted is 19% of it',
            tags: [{ text: 'Derived', tone: 'rule' }], src: 'unep', mark: 'xiv',
          },
          split: {
            caption: 'of the food available to consumers',
            parts: [
              { role: 'wasted', v: 19, name: 'wasted — A.1', text: '1.05 bn t · 19%' },
              { role: 'consumed', v: 81, name: 'consumed — A.2', text: '≈ 4.5 bn t · 81%' },
            ],
          },
          check: {
            ok: true,
            text: 'Inside UNEP’s scope — retail to households — waste and consumption are all the food there is (the 19% is rounded).',
            outside: 'Not in either: about 13% of food is lost on the way to the shop (FAO — another model).',
            src: 'faoloss',
          },
        },
        meat: {
          tile: {
            id: 'tot-m-world', value: '335 Mt', label: 'meat produced', sub: 'World · 2019',
            tags: [{ text: 'Brief', tone: 'flag' }], src: 'brief', mark: 'iv',
            other: { id: 'tot-c-world-ref', value: '374 Mt', label: 'other year', sub: 'World · 2024 · FAO — produced too: losses and waste are still inside', src: 'fao', mark: 'iv' },
          },
          split: {
            caption: 'of the meat produced',
            parts: [
              { role: 'wasted', v: 23.1, name: 'lost or wasted — A.1', text: '77.4 Mt · 23%' },
              { role: 'consumed', v: 76.9, name: 'consumed — A.2', text: '≈ 258 Mt · 77%' },
            ],
          },
          check: {
            ok: true,
            text: '≈ 258 Mt consumed + 77.4 Mt lost or wasted (52.4 Mt edible, 25.0 Mt inedible parts) = 335 Mt produced — one model, 2019.',
            outside: 'The 374 Mt of 2024 are another year, and produced too: they never mean the meat that is eaten.',
          },
        },
        waste: {
          tile: { id: 'tot-w-world', value: '1.05 bn t', label: 'food wasted, all foods', sub: 'World · 2022 · retail to households · 132 kg per person', src: 'unep', to: '#waste-weight-world', dd: 'weight' },
          bar: { kind: 'stage', chain: 'food-world' },
          meat: [
            { id: 'tot-wm-world', value: '52.4 Mt', label: 'edible meat lost', sub: 'World · 2019 · about one sixth of production · + 25.0 Mt inedible parts = 77.4 Mt', src: 'klaura', mark: 'iii', to: '#waste-weight-world', dd: 'weight', at: { gap: true, text: 'at consumption: not published for tonnes — only for animals' } },
            { id: 'tot-wl-world', value: '17.97 bn', label: 'animal lives lost with the meat', sub: 'World · 2019 · 93.6% chickens', src: 'klaura', mark: 'i', to: '#waste-lives-world', dd: 'lives', at: { text: '26.7% at consumption · 4.80 bn', mark: 'ii' } },
          ],
          drill: [{ dd: 'weight', to: '#waste-weight-world' }, { dd: 'lives', to: '#waste-lives-world' }],
        },
        consumption: {
          tile: {
            id: 'tot-c-world-food', kind: 'scenario', value: '≈ 4.5 bn t', label: 'food consumed — available, not wasted',
            sub: 'World · 2022 · retail to households', tags: [{ text: 'Derived', tone: 'rule' }], src: 'unep', mark: 'xiv',
          },
          meat: [
            { id: 'tot-c-world', value: '≈ 258 Mt', label: 'meat consumed', sub: 'World · 2019 · derived: 335 Mt produced − 77.4 Mt lost', tags: [{ text: 'Derived', tone: 'rule' }], src: ['brief', 'klaura'], mark: 'iv', to: '#consumption', dd: 'consumption' },
          ],
          drill: [{ dd: 'consumption', to: '#consumption' }],
        },
      },
      {
        geo: 'europe',
        zoom: { text: 'zoom into Germany — the same measures, one level closer', label: 'Zoom from Europe into Germany' },
        food: {
          inset: { note: 'Meat is drawn inside as a marker, not to scale: meat’s share of all food is not reported, and the meat numbers are other models and years.', wasted: { text: '14.2 Mt meat wasted · 2.76 bn animal lives' }, consumed: { text: '47.5 Mt meat consumed' } },
          tile: {
            id: 'tot-food-europe', kind: 'scenario', value: '≈ 219 Mt',
            label: 'food available to consumers — estimate',
            sub: 'EU-27 · 2022 · retail to households — if Europe wasted the world’s 19% share: 41.6 Mt ÷ 0.19',
            tags: [{ text: 'Estimate', tone: 'flag' }], src: 'eurostat', mark: 'xv',
          },
          split: {
            est: true,
            caption: 'of the food available to consumers — an estimate, not a measurement',
            parts: [
              { role: 'wasted', v: 19, name: 'wasted — A.1 (retail to households)', text: '41.6 Mt · 19%' },
              { role: 'consumed', v: 81, name: 'consumed — A.2', text: '≈ 177 Mt · 81%' },
            ],
          },
          check: {
            est: true,
            text: 'Nobody publishes the total, so this is a scenario: the world’s 19% (UNEP) applied to Europe’s waste from retail to households — 41.6 Mt of the 57.5 Mt, farm and processing left out, as UNEP leaves them out.',
            outside: 'Europe may waste more or less than the world average; the lighter shades say so.',
          },
        },
        meat: {
          tile: {
            id: 'tot-m-europe', value: '61.7 Mt', label: 'meat available, incl. inedible parts', sub: 'EU-28 · 2011',
            tags: [{ text: 'Other model', tone: 'rule' }], src: 'jrc', mark: 'x',
            other: { id: 'tot-c-europe-ref', value: '37.5 Mt', label: 'other year and model', sub: 'EU-27 · 2022–24 · EU outlook, carcass weight — consumption calculated from a balance sheet', src: 'euoutlook', mark: 'x' },
          },
          split: {
            caption: 'of the meat available',
            parts: [
              { role: 'wasted', v: 23.0, name: 'wasted — A.1', text: '14.2 Mt · 23%' },
              { role: 'consumed', v: 77.0, name: 'consumed — A.2', text: '47.5 Mt · 77%' },
            ],
          },
          check: {
            ok: true,
            text: '47.5 Mt consumed + 14.2 Mt wasted = 61.7 Mt available — one model, EU-28, 2011.',
            outside: 'The EU outlook’s 37.5 Mt are another year and model: not comparable with these.',
          },
        },
        waste: {
          tile: { id: 'tot-w-europe', value: '57.5 Mt', label: 'food wasted, all foods', sub: 'EU-27 · 2022 · farm to households · latest year: 57.9 Mt (2024)', src: 'eurostat', to: '#waste-weight-europe', dd: 'weight' },
          bar: { kind: 'stage', chain: 'food-europe' },
          meat: [
            { id: 'tot-wm-europe', value: '14.2 Mt', label: 'meat wasted along the whole chain', sub: 'EU-28 · 2011 · a mass model of another year', tags: [{ text: 'Other model', tone: 'rule' }], src: 'jrc', mark: 'v', to: '#waste-weight-europe', dd: 'weight', at: { text: '63.4% at consumption · 9.0 Mt' } },
            { id: 'tot-wl-europe', value: '2.76 bn', label: 'animal lives lost', sub: 'Europe-43 · 2019 · 15.4% of the world total', src: 'klaura', mark: 'v', to: '#waste-lives-europe', dd: 'lives', at: { gap: true, text: 'at consumption: not in our data yet' } },
          ],
          drill: [{ dd: 'weight', to: '#waste-weight-europe' }, { dd: 'lives', to: '#waste-lives-europe' }],
        },
        consumption: {
          tile: { id: 'tot-c-europe-food', kind: 'scenario', value: '≈ 177 Mt', label: 'food consumed — estimate', sub: 'EU-27 · 2022 · retail to households · the estimated total minus the waste', tags: [{ text: 'Estimate', tone: 'flag' }], mark: 'xv' },
          meat: [
            { id: 'tot-c-europe', value: '47.5 Mt', label: 'meat consumed', sub: 'EU-28 · 2011 · derived: 61.7 − 14.2 Mt · incl. inedible parts', tags: [{ text: 'Derived', tone: 'rule' }, { text: 'Other model', tone: 'rule' }], src: 'jrc', mark: 'x', to: '#consumption', dd: 'consumption' },
          ],
          drill: [{ dd: 'consumption', to: '#consumption' }],
        },
      },
      {
        geo: 'germany',
        food: {
          inset: { note: 'Meat is drawn inside as a marker, not to scale: meat’s share of all food is not reported, and the meat numbers are other models and years.', wasted: { text: '≈ 1.06 Mt meat wasted (estimate; 74.6 kt measured in households) · ≈ 10.5 m animal lives' }, consumed: { text: '≈ 3.54 Mt meat consumed (estimate)' } },
          tile: {
            id: 'tot-food-germany', kind: 'scenario', value: '≈ 47.6 Mt',
            label: 'food available to consumers — estimate',
            sub: 'Germany · 2022 · retail to households — if Germany wasted the world’s 19% share: 9.04 Mt ÷ 0.19',
            tags: [{ text: 'Estimate', tone: 'flag' }], src: 'eurostat', mark: 'xv',
          },
          split: {
            est: true,
            caption: 'of the food available to consumers — an estimate, not a measurement',
            parts: [
              { role: 'wasted', v: 19, name: 'wasted — A.1 (retail to households)', text: '9.04 Mt · 19%' },
              { role: 'consumed', v: 81, name: 'consumed — A.2', text: '≈ 38.6 Mt · 81%' },
            ],
          },
          check: {
            est: true,
            text: 'Nobody publishes the total, so this is a scenario: the world’s 19% (UNEP) applied to Germany’s waste from retail to households — 9.04 Mt of the 10.8 Mt, farm and processing left out.',
            outside: 'Germany may waste more or less than the world average; the lighter shades say so.',
          },
        },
        meat: {
          tile: {
            id: 'tot-m-germany', value: '4.6 Mt', label: 'meat available — calculated consumption',
            sub: 'Germany · 2025 · provisional · from the supply balance: waste is still inside',
            tags: [{ text: 'Calculated', tone: 'rule' }], src: 'bzl', mark: 'xvi',
          },
          split: {
            est: true,
            caption: 'of the meat available — an estimate, not a measurement',
            parts: [
              { role: 'wasted', v: 23, name: 'wasted — A.1', text: '≈ 1.06 Mt · 23%' },
              { role: 'consumed', v: 77, name: 'consumed — A.2', text: '≈ 3.54 Mt · 77%' },
            ],
          },
          check: {
            est: true,
            text: 'Only the households’ waste is measured (74.6 kt). For the whole chain this applies the EU-28 share (JRC, 2011: 14.2 of 61.7 Mt, 23%) to the 4.6 Mt calculated from the supply balance.',
            outside: 'Germany may waste more or less than the EU average; the lighter shades say so.',
          },
        },
        waste: {
          tile: { id: 'tot-w-germany', value: '10.8 Mt', label: 'food wasted — 18.8% of the EU total, the largest', sub: 'Germany · 2022 · farm to households', src: 'eurostat', to: '#waste-weight-germany', dd: 'weight' },
          bar: { kind: 'stage', chain: 'food-germany' },
          meat: [
            { id: 'tot-wm-germany-est', kind: 'scenario', value: '≈ 1.06 Mt', label: 'meat wasted along the whole chain — estimate', sub: 'Germany · 2025 · the EU-28 share (23%) applied to the 4.6 Mt', tags: [{ text: 'Estimate', tone: 'flag' }], mark: 'xvi', to: '#waste-weight-germany', dd: 'weight' },
            { id: 'tot-wm-germany', value: '74.6 kt', label: 'measured: avoidable household waste of meat, sausage & fish', sub: 'households only · other basis: ≈ 125 kt', tags: [{ text: 'Partial indicator', tone: 'flag' }], src: ['gfk', 'thuenen'], mark: 'vii', to: '#waste-weight-germany', dd: 'weight', at: { gap: true, text: 'the rest of the chain: unknown' } },
            { id: 'tot-wl-germany', value: '≈ 10.5 m', label: 'land animals in household meat waste', sub: 'households only · 85% chickens · fish not counted', tags: [{ text: 'Advocacy source', tone: 'flag' }], src: 'fleischatlas', mark: 'vi', to: '#waste-lives-germany', dd: 'lives' },
          ],
          drill: [{ dd: 'weight', to: '#waste-weight-germany' }, { dd: 'lives', to: '#waste-lives-germany' }],
        },
        consumption: {
          tile: { id: 'tot-c-germany-food', kind: 'scenario', value: '≈ 38.6 Mt', label: 'food consumed — estimate', sub: 'Germany · 2022 · retail to households · the estimated total minus the waste', tags: [{ text: 'Estimate', tone: 'flag' }], mark: 'xv' },
          species: true,
          meat: [
            { id: 'tot-c-germany', kind: 'scenario', value: '≈ 3.54 Mt', label: 'meat consumed — estimate', sub: 'Germany · 2025 · the 4.6 Mt minus the estimated waste', tags: [{ text: 'Estimate', tone: 'flag' }], mark: 'xvi', to: '#consumption', dd: 'consumption' },
          ],
          drill: [{ dd: 'consumption', to: '#consumption' }],
        },
      },
    ],
  },

  // B · Waste — ONE section, ONE switch (weight | animal lives): where along the chain the waste happens, one row per level.
  //   The meat totals already stand in A.1; here is what A cannot show: the stages, the gaps, and the foldable drill-downs.
  //   rows[].items: { bar: id } = a stage bar from `chain.bars` · { box: {…} } = a value box (kind "gap" = not published).
  //   rows[].drills: foldable panels under the row — ids in `drills`, or a chart id in `europe.charts`.
  //   rows[].paths: which of the two Germany paths belongs under this row (`paths.lanes[].id`).
  waste: {
    views: [
      {
        id: 'weight', label: 'Weight', dd: 'weight',
        lead: 'Tonnes lost, and where along the chain. All food comes first — the only series that exists for every level — then the meat inside it, where it is known, and a gap where it is not.',
        rows: [
          {
            geo: 'world',
            note: 'Meat’s share of the food waste: not reported.',
            items: [
              { bar: 'food-world' },
              { box: { kind: 'gap', tag: 'Not published', value: 'Unknown', label: 'meat weight lost at consumption — the stage split is published for animals, not for mass', sub: 'World · 2019 · Klaura' } },
            ],
            drills: [],
          },
          {
            geo: 'europe',
            note: 'Meat’s share of the food waste: not reported — Eurostat doesn’t split it by product. The two bars are two models (EU-27 · 2022 all food, EU-28 · 2011 meat): never divide one by the other.',
            items: [{ bar: 'food-europe' }, { bar: 'mass-europe' }],
            drills: ['eu-waste'],
            open: true,
          },
          {
            geo: 'germany',
            items: [
              { bar: 'food-germany' },
              { box: { kind: 'gap', value: 'Unknown', label: 'meat waste in food service, retail, processing and farming — only the households’ 74.6 kt are measured', sub: 'food service ≈ 85.8 kt — unconfirmed', src: 'ahv' } },
            ],
            drills: ['sectors', 'products', 'flow'],
            paths: 'weight',
          },
        ],
      },
      {
        id: 'lives', label: 'Animal lives', dd: 'lives',
        lead: 'Animals lost with the wasted meat. One global model (Klaura, 2019) counts them along the chain; for Europe we only have the total, and for Germany only the households — the rest is a scenario of ours.',
        rows: [
          {
            geo: 'world',
            items: [{ bar: 'lives-world' }],
            drills: ['species', 'stages'],
          },
          {
            geo: 'europe',
            note: 'Europe’s share of the world total — not “15% of European animals”. 43 countries, not the EU-27.',
            items: [
              { box: { kind: 'gap', tag: 'Not in our data', value: 'Unknown', label: 'lost at consumption — Europe’s stage split is not in our data yet', sub: 'Europe-43 · 2019 · Klaura' } },
            ],
            drills: ['eu-chickens'],
            open: true,
          },
          {
            geo: 'germany',
            note: { text: 'For scale: 631 m chickens were slaughtered in Germany in 2022.', src: 'slaughter', mark: 'viii' },
            items: [
              { box: { kind: 'scenario', value: '≥ 39.3 m', label: 'whole chain — lower bound, built from the households’ 10.5 m', tags: [{ text: 'Lower bound', tone: 'rule' }], sub: 'B ≈ 51.7 m · C ≈ 84.5 m', src: 'model', mark: 'vi' } },
            ],
            drills: [],
            paths: 'lives',
          },
        ],
      },
    ],
  },

  // C · Consumption — what the eaten meat is made of, and Europe from supply to plate.
  consumption: {
    perPerson: {
      title: 'How much each person has',
      sub: 'Meat per person a year, on one scale — the one unit that compares across levels',
      note: 'These are calculated from supply, not measured at the plate: the OECD-FAO Outlook counts consumption as food availability, which does not account for waste. Germany’s 54.9 kg is the BZL’s calculated Verzehr — carcass weight without losses and industrial use.',
      max: 70,
      items: [
        { geo: 'world', id: 'tot-pp-world', value: 28.4, text: '≈ 28.4 kg', sub: 'per person a year · World · base period · retail weight · derived', src: ['oecd', 'fao'] },
        { geo: 'europe', id: 'tot-pp-europe', value: 66.6, text: '66.6 kg', sub: 'per person a year · EU-27 · 2022–24 · retail weight', src: 'euoutlook', mark: 'v' },
        { geo: 'germany', id: 'tot-pp-germany', value: 54.9, text: '54.9 kg', sub: 'per person a year · Germany · 2025 · provisional', src: 'bzl' },
      ],
    },
    species: {
      title: 'What the 54.9 kg per person are made of',
      sub: 'Germany · 2025 · calculated consumption',
      unit: 'kg', src: 'bzl',
      segs: [{ name: 'Pork', v: 28.3 }, { name: 'Poultry', v: 14.7 }, { name: 'Beef & veal', v: 9.7 }, { name: 'Other', v: 2.2 }],
    },
    known: {
      title: 'What we know about waste next to the calculated consumption',
      sub: 'Germany · households only',
      box: {
        id: 'cons-known', value: '1.62%', label: 'known household meat waste (74.6 kt) against the calculated meat consumption (4.6 Mt, waste still inside)',
        tags: [{ text: 'Partial indicator', tone: 'flag' }],
        meter: { value: 1.62, caption: 'households only · fish in the 74.6 kt, not in the 4.6 Mt' },
        src: ['gfk', 'bzl'],
      },
    },
  },

  geos: [
    { id: 'world', name: 'World', basis: 'Global models' },
    { id: 'europe', name: 'Europe', basis: 'Three scopes — named per cell' },
    { id: 'germany', name: 'Germany', basis: 'National data + one advocacy model' },
  ],


  // The chain: what "at consumption" means. Same split, different measures, each with its own total. Drawn under the rows of B (`waste`) by id.
  //     seg.at: 'service' | 'home' | 'both'  → at consumption.  No `at` → before the plate.
  chain: {
    title: 'What “at consumption” means',
    lead: 'Every loss on this page happens somewhere on one chain. “At consumption” is its last two links — food service and households. The bars cut the chain the same way for each measure; each keeps its own total and its own model.',
    stages: ['Farm', 'Processing', 'Retail', 'Food service', 'Households'],
    atFrom: 3,
    atLabel: 'At consumption',
    shareWord: 'at consumption',
    foot: 'The shares differ because animals, meat tonnes and all food weigh the chain differently — never carry one over to another.',
    bars: [
      {
        id: 'lives-world', title: 'Animal lives', scope: 'World · 2019', total: '17.97 bn', src: 'klaura', atText: '4.80 bn', shareMark: 'ii',
        segs: [{ name: 'Before the plate', v: 13.17, text: '13.17 bn' }, { name: 'At consumption', v: 4.8, text: '4.80 bn', at: 'both' }],
        note: '2.4 animals per person · six land species. One consumption stage: households and food service are not split.',
      },
      {
        id: 'mass-europe', title: 'Meat weight', scope: 'EU-28 · 2011 · JRC', total: '14.2 Mt', src: 'jrc', atText: '9.0 Mt', mark: 'v',
        segs: [{ name: 'Before the plate', v: 5.2, text: '5.2 Mt' }, { name: 'Food service', v: 1.7, text: '1.7 Mt', at: 'service' }, { name: 'Households', v: 7.3, text: '7.3 Mt', at: 'home' }],
      },
      {
        id: 'food-europe', title: 'All food', scope: 'EU-27 · 2022', total: '57.5 Mt', src: 'eurostat', atText: '37.0 Mt', mark: 'v',
        segs: [
          { name: 'Farm', v: 5.5, text: '5.5 Mt' }, { name: 'Processing', v: 10.4, text: '10.4 Mt' }, { name: 'Retail', v: 4.6, text: '4.6 Mt' },
          { name: 'Food service', v: 6.5, text: '6.5 Mt', at: 'service' }, { name: 'Households', v: 30.5, text: '30.5 Mt', at: 'home' },
        ],
      },
      {
        id: 'food-germany', title: 'All food', scope: 'Germany · 2022', total: '10.8 Mt', src: 'eurostat', atText: '8.3 Mt',
        segs: [
          { name: 'Farm', v: 0.178, text: '0.18 Mt' }, { name: 'Processing', v: 1.564, text: '1.56 Mt' }, { name: 'Retail', v: 0.774, text: '0.77 Mt' },
          { name: 'Food service', v: 1.978, text: '1.98 Mt', at: 'service' }, { name: 'Households', v: 6.289, text: '6.29 Mt', at: 'home' },
        ],
      },
      {
        id: 'food-world', title: 'All food', scope: 'World · 2022 · UNEP', total: '1.05 bn t', src: 'unep', atText: '921 Mt',
        segs: [{ name: 'Retail', v: 131, text: '131 Mt' }, { name: 'Food service', v: 290, text: '290 Mt', at: 'service' }, { name: 'Households', v: 631, text: '631 Mt', at: 'home' }],
        note: 'Farm and processing losses are not in the UNEP figure.',
      },
    ],
  },

  // Drill-downs. Each is attached to the card it explains (cell.drill) and drawn directly under that region's row.
  //   type "bars": rows = { name, v (bar length), text (value), share?, table? (cells after the name), emph? }
  //   type "flow": a four-step chain ending in the animal estimate.
  drills: {
    species: {
      type: 'bars', dim: 'A',
      title: 'Animal lives lost, by species',
      sub: 'World · 2019 model · number of animals',
      cols: ['Species', 'Animal lives lost (2019)', 'Share'],
      rows: [
        { name: 'Chickens', v: 16800, text: '16.8 bn', share: '93.6%', emph: true },
        { name: 'Turkeys', v: 402.3, text: '402 m', share: '2.2%', table: ['402.3 m', '2.2%'] },
        { name: 'Pigs', v: 298.8, text: '299 m', share: '1.7%', table: ['298.8 m', '1.7%'] },
        { name: 'Sheep', v: 195.7, text: '196 m', share: '1.1%', table: ['195.7 m', '1.1%'] },
        { name: 'Goats', v: 188.0, text: '188 m', share: '1.1%', table: ['188.0 m', '1.1%'] },
        { name: 'Cattle', v: 74.1, text: '74 m', share: '0.4%', table: ['74.1 m', '0.4%'] },
      ],
      note: 'A cow yields orders of magnitude more meat than a chicken — so beef and pork dominate the tonnes, and chickens dominate the count of animals.',
      src: 'klaura',
    },
    stages: {
      type: 'bars', dim: 'A',
      title: 'Animal lives lost, by stage',
      sub: 'World · 2019 model · share of all animals, in chain order',
      cols: ['Stage', 'Share of animal lives lost (2019)'],
      rows: [
        { name: 'Production & rearing', v: 24.9, text: '24.9%' },
        { name: 'Storage & transport', v: 7.8, text: '7.8%', tableName: 'Storage, handling & transport' },
        { name: 'Slaughter & processing', v: 20.0, text: '20.0%', tableName: 'Slaughter, processing & packaging' },
        { name: 'Distribution & retail', v: 20.6, text: '20.6%' },
        { name: 'Households & food service', v: 26.7, text: '26.7%', emph: true, tableName: 'Households & food service (avoidable waste only)' },
      ],
      note: 'The last step is the biggest: upstream (farm to processing) adds up to 52.7%, downstream (retail to plate) to 47.3%. In the EU-28 model, households alone account for 7.3 of 14.2 Mt of wasted meat.',
      src: ['klaura', 'jrc'],
    },
    flow: {
      type: 'flow', dim: 'B',
      title: 'From all food to animals',
      sub: 'Germany · meat, sausage and fish in household waste',
      steps: [
        { big: '6.3 Mt', text: 'household food waste in 2022, all foods' },
        { big: '≈ 3.1 Mt', text: 'of that is avoidable — about half (Thünen estimate)' },
        { big: '≈ 125,000 t', text: 'meat, sausage and fish: 4% ≈ 1.5 kg per person a year ≈ 4 g a day' },
        { big: '≈ 10.5 m', text: 'land animals — Meat Atlas 2021, an advocacy model; 85% chickens; fish not counted', end: true },
      ],
      gap: {
        title: 'Where our numbers stop.',
        text: 'Catering, retail and processing have no official breakdown by meat. A split of meat waste between households and catering can’t be documented for Germany.',
      },
      note: 'Why 125,000 t here and 74.6 kt above? Same 4% share, different base: 74.6 kt is 4% of the 1.87 Mt of avoidable household waste in the GfK 2020 diary study; 125,000 t is 4% of the ≈ 3.1 Mt you get by halving the official 2022 household total. We quote the range:',
      noteStrong: '75–125 kt',
      src: ['gfk', 'thuenen', 'fleischatlas'],
    },
    sectors: {
      type: 'bars', dim: 'C',
      title: 'Food waste by sector',
      sub: 'Germany · 2022 · 10.8 Mt, all foods incl. peels and bones',
      cols: ['Sector', 'Food waste 2022', 'Share'],
      rows: [
        { name: 'Households', v: 6.289, text: '6.3 Mt', share: '58%', emph: true },
        { name: 'Out-of-home & catering', v: 1.978, text: '2.0 Mt', share: '18%' },
        { name: 'Processing', v: 1.564, text: '1.6 Mt', share: '15%' },
        { name: 'Retail', v: 0.774, text: '0.8 Mt', share: '7%' },
        { name: 'Primary production', v: 0.178, text: '0.2 Mt', share: '2%' },
      ],
      note: 'At the consumption stage alone, households are 76% and catering 24% — a split of the total waste, not of meat.',
      src: 'eurostat',
    },
    products: {
      type: 'bars', dim: 'C',
      title: 'What households waste',
      sub: 'Germany · GfK 2020 · share of avoidable household food waste',
      cols: ['Product group', 'Share of avoidable household waste'],
      rows: [
        { name: 'Fruit & vegetables', v: 34.7, text: '34.7%' },
        { name: 'Prepared food*', v: 14.9, text: '14.9%', tableName: 'Prepared food' },
        { name: 'Bread & bakery', v: 12.9, text: '12.9%' },
        { name: 'Beverages', v: 11.9, text: '11.9%' },
        { name: 'Dairy', v: 8.9, text: '8.9%', emph: true },
        { name: 'Other', v: 6.9, text: '6.9%' },
        { name: 'Ready-made products', v: 5.9, text: '5.9%' },
        { name: 'Meat, sausage & fish', v: 4.0, text: '4.0%', emph: true },
      ],
      note: 'Animal products you can see: 4.0% + 8.9% ≈ 13%. Eggs aren’t listed separately; *some animal products hide inside “prepared food”.',
      src: 'gfk',
    },
  },

  // Always visible under the grid. Not collapsible.
  warning: {
    title: 'Tonnes ≠ animal count',
    text: 'Chickens drive the number of animals; cattle and pigs drive the tonnes. The 26.7% consumption share counts animals, not kilos — so never divide tonnes by 0.267 (74.6 kt ÷ 0.267 means nothing). And never divide across models: 14.2 Mt (JRC, 2011) ÷ 57.5 Mt (Eurostat, 2022) is not a meat share.',
    link: { href: '#paths', label: 'See both paths for Germany' },
  },

  // Germany: the animal-lives path scales (with named assumptions); the weight path doesn't.
  paths: {
    lanes: [
      {
        id: 'lives',
        title: 'Animal lives',
        verdict: 'Scales — with named assumptions',
        tone: 'ok',
        steps: [
          { kind: 'sourced', value: '10.5 m', label: 'land animals in household meat waste', tags: [{ text: 'Advocacy source', tone: 'flag' }], sub: 'not converted from kt [A6]', src: 'fleischatlas' },
          { op: '÷ 0.76', ref: 'A2', text: 'households are 76% of the consumption stage' },
          { kind: 'scenario', value: '≈ 13.8 m', label: 'at consumption — households + food service', sub: 'of which food service ≈ 3.3 m', src: 'model' },
          { op: '÷ 0.267', ref: 'A1', text: 'the world’s consumption share of animal lives' },
          { kind: 'scenario', value: '≥ 39.3 m', label: 'whole chain — scenario A, lower bound', sub: 'B ≈ 51.7 m · C ≈ 84.5 m', src: 'model' },
        ],
        note: 'A = 10.5 ÷ 0.267 — it treats households as the whole consumption stage, so it can only be a floor. B = 10.5 ÷ 0.76 ÷ 0.267. C scales with meat mass (74.6 + 85.8 kt) [A3].',
      },
      {
        id: 'weight',
        title: 'Weight',
        verdict: 'Doesn’t scale with an animal-count share',
        tone: 'stop',
        steps: [
          { kind: 'sourced', value: '74.6 kt', label: 'avoidable household meat, sausage & fish', tags: [{ text: 'Partial indicator', tone: 'flag' }], sub: 'other basis: ≈ 125 kt', src: ['gfk', 'thuenen'] },
          { op: '+ food service', text: 'a different year and definition' },
          { kind: 'scenario', value: '≈ 160 kt', label: 'meat wasted at consumption', tags: [{ text: 'Unconfirmed', tone: 'flag' }], sub: '74.6 + ≈ 85.8 kt (2018/19)', src: ['gfk', 'ahv'] },
          { op: '÷ 0.267 ?', ref: 'A5', text: 'a share of animals, not of kilos', invalid: true },
          { kind: 'invalid', value: '279 kt · 468 kt', label: '74.6 ÷ 0.267 and 125 ÷ 0.267 — we don’t use these', sub: 'Germany’s whole-chain meat mass: unknown' },
        ],
        note: 'For a mass estimate you need stage- and product-specific mass shares. Germany doesn’t publish them for meat, so we don’t publish a guess.',
      },
    ],
    assumptions: [
      { id: 'A1', text: 'The world’s 26.7% consumption share (by animal count) is carried over to Germany only as a scaling assumption — it isn’t a German measurement.' },
      { id: 'A2', text: 'The 76/24 household/food-service split is Germany’s 2022 split for all foods (Eurostat), not for meat. For meat alone it would be closer to 47/53.' },
      { id: 'A3', text: 'Scenario C assumes the same species mix and the same animals per tonne in households and food service.' },
      { id: 'A4', text: 'Europe’s 3.61 animals per person × Germany’s 84 m people ≈ 303 m is a diagnosis, not an estimate: 6–8× more than A or B, so the models don’t fit together.' },
      { id: 'A5', text: 'Tonnes are never scaled with an animal-count share — 279 kt and 468 kt are not valid.' },
      { id: 'A6', text: 'The 10.5 m are an advocacy estimate, not a conversion from 74.6 kt or 125 kt.' },
    ],
  },

  // Europe, country by country — one chart per dimension. Germany is highlighted.
  europe: {
    charts: [
      {
        id: 'eu-waste',
        dim: 'C',
        title: 'Food waste by country',
        sub: 'EU-27 · 2022 · million tonnes, all foods incl. inedible parts',
        unit: 'Mt',
        total: 57.5,
        totalLabel: 'EU-27',
        highlight: 'Germany',
        rows: [
          ['Germany', 10.782], ['France', 9.38], ['Italy', 8.2], ['Poland', 4.55], ['Romania', 3.45],
          ['Spain', 3.1], ['Netherlands', 2.29], ['Greece', 2.04], ['Portugal', 1.72], ['Belgium', 1.7],
        ],
        digits: 1,
        others: { count: 17, word: 'countries' },
        mark: 'v',
        note: 'All foods, not meat — Eurostat has no meat share. Top 10 of 27 countries.',
        src: 'eurostat',
      },
      {
        id: 'eu-chickens',
        dim: 'A',
        title: 'Chickens slaughtered, by country',
        sub: 'EU · 2022 · million animals',
        unit: 'm',
        total: 6159,
        totalLabel: 'reporting EU countries',
        highlight: 'Germany',
        rows: [
          ['Poland', 1200.1], ['France', 734.3], ['Spain', 696.5], ['Germany', 631.1], ['Italy', 534.1],
          ['Netherlands', 517.7], ['Belgium', 297.8], ['Romania', 285.7], ['Portugal', 217.3], ['Hungary', 177.9],
        ],
        digits: 0,
        others: { count: 13, word: 'reporting countries' },
        mark: 'viii',
        tag: { text: 'Proxy', tone: 'flag' },
        note: 'A proxy for where the count is: 93.6% of the animals lost are chickens. Slaughter is production, not consumption, and not a Klaura value. Austria, Estonia, Luxembourg and Slovakia don’t publish it.',
        src: 'slaughter',
      },
    ],
  },
};
