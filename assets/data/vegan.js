/* GiGi Vegan — data/vegan.js
   Every number on the GiGi Vegan dashboard lives HERE, next to its source key and caveat.
   Edit this file and the page re-renders; nothing is baked into an image.

   The page opens with the TWO LEVERS view (`levers`): consumed vs wasted per region, and what each lever can reach.
   Below it, the waste matrix is the drill-down — three views of the same numbers:
     tree    → how it breaks down: all food waste → meat (lives + weight) → before / at the plate
     blocks  → two dual grids, one row per region:  A Animal lives | B Meat weight   and   C All food waste | D At the plate (focus: meat eaten)
     chain   → what "at consumption" means: the same split cut over Farm → … → Households
   Every cell names its own region, year and model, because "Europe" is three different scopes here
   (Europe-43 in Klaura, EU-28 in the JRC model, EU-27 at Eurostat).
   An item may carry a `child`: the part of it that is lost at consumption (drawn connected to its parent).
   A cell may carry a `drill` ({ label, ids }): drill-downs from `drills`, drawn under that region's row.

   kind: "sourced"  → solid box   (a value taken from a source)
         "scenario" → dashed box  (an assumption we make, not a measurement)
         "gap"      → dotted box  (not measured / not published — shown, not hidden)
         "invalid"  → red box     (a calculation we refuse to use; Germany paths only)
   src:  one or more keys from `sources`. Footnote numbers follow the ORDER of `sources` below, which
         is also the order of the numbered list in the page's "Sources & method" (id="src-<key>").
   Plain .js (not .json) so it also works when the page is opened straight from disk.              */

window.GIGI_DATA = window.GIGI_DATA || {};

window.GIGI_DATA.vegan = {
  ui: {
    sourced: 'Sourced',
    scenario: 'Scenario',
    gap: 'Not measured',
    invalid: 'Not valid',
    focus: 'Focus',
    keyLabel: 'How to read the grid',
    keySourced: 'Solid — sourced value',
    keyScenario: 'Dashed — scenario, an assumption we make',
    keyGap: 'Dotted — not measured or not published',
    keyScope: 'Each cell names its region, year and model. Compare along a row — never divide across models.',
    unit: 'Unit',
    source: 'Source',
    sources: 'Sources',
    treeLabel: 'How the numbers break down',
    atConsumption: 'At consumption',
    chainLabel: 'What “at consumption” means',
    gridLabel: 'World, Europe and Germany in four dimensions',
    drill: 'Drill down',
    drillOn: 'Drill down',
    others: 'Other',
    othersNote: 'derived: the total minus the top ten, not a Eurostat figure',
    assumptions: 'Assumptions — named',
    tableView: 'View as table',
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
  },

  // 0 · Two levers — the primary view. Per region, ONE total-system bar per measure, split into
  //     consumed (green) + wasted (coral).  Lever A (demand) acts on the whole bar; lever B (waste) only on the wasted segment.
  //     seg.kind: "sourced" → solid · "scenario" → dashed · "unknown" → hatched grey (its width carries no value).
  //     seg.v is in ONE unit per bar (bar widths are computed from it); a seg with `fixed` (% of the bar) has no value.
  //     Never divide tonnes by the 26.7% share — that share counts animals, not kilos.
  levers: {
    ui: {
      keyLabel: 'How to read the bars',
      keyConsumed: 'Green — consumed',
      keyWasted: 'Coral — wasted',
      keySolid: 'Solid — sourced',
      keyDash: 'Dashed — scenario, an assumption',
      keyHatch: 'Hatched grey — unknown, or not harmonized',
      regionsLabel: 'The total system in World, Europe and Germany',
      swipe: 'Swipe sideways for Europe and Germany →',
      sourced: 'Sourced',
      scenario: 'Scenario',
      unknown: 'Unknown',
      source: 'Source',
      impactLabel: 'What each lever can save',
      leverKey: 'The two levers',
    },
    keys: [
      { id: 'A', name: 'Reduce demand / plant-based', acts: 'acts on the whole bar', short: 'A · demand → the whole bar' },
      { id: 'B', name: 'Reduce food waste', acts: 'acts only on the wasted segment', short: 'B · waste → this segment only' },
    ],
    blocks: {
      system: { title: 'The total system, region by region', lead: 'Each bar is everything that is produced in a region, split into what is consumed and what is wasted. Lives and weight are two measures of the same meat — they sit in separate bars and are never converted into each other.' },
      impact: { title: 'How much each lever can reach', lead: 'Waste reduction can only ever touch the coral slice. Demand reduction touches the whole bar. Because the slice is about a fifth of the whole, the two levers are not the same size.' },
      germany: { title: 'What that means in Germany' },
      species: { title: 'Why chickens dominate both levers' },
      assumptions: { title: 'Assumptions behind the levers' },
    },
    regions: [
      {
        id: 'world', name: 'World', basis: 'Global models',
        bars: [
          {
            id: 'world-lives', measure: 'Animal lives', scope: 'World · 2019',
            total: { value: '≈ 80 bn', text: 'land animals slaughtered', sub: 'FAO series: 86.3 bn in 2024, 91% chickens', tags: [{ text: 'Rounded', tone: 'rule' }], src: 'faostat' },
            segs: [
              { role: 'consumed', kind: 'sourced', v: 62, name: 'Consumed', value: '≈ 62 bn', share: '≈ 78%', tag: 'Derived' },
              { role: 'wasted', kind: 'sourced', v: 18, name: 'Wasted with the meat', value: '≈ 18 bn', share: '≈ 22%', src: 'klaura' },
            ],
          },
          {
            id: 'world-mass', measure: 'Meat weight', scope: 'World · 2019',
            total: { value: '335 Mt', text: 'meat produced', tags: [{ text: 'Brief', tone: 'flag' }], src: 'brief' },
            segs: [
              { role: 'consumed', kind: 'sourced', v: 257.6, name: 'Consumed', value: '≈ 258 Mt', share: '≈ 77%', tag: 'Derived' },
              { role: 'wasted', kind: 'sourced', v: 52.4, name: 'Wasted — edible meat', value: '52.4 Mt', share: '≈ 16%', sub: 'about one sixth of production', src: 'klaura' },
              { role: 'wasted', tone: 'soft', kind: 'sourced', v: 25.0, name: 'Wasted — inedible parts', value: '≈ 25 Mt', share: '≈ 7%', sub: '77.4 Mt carcass weight in all', tag: 'Derived' },
            ],
          },
        ],
      },
      {
        id: 'europe', name: 'Europe', basis: 'Three scopes — named per bar',
        notHarmonized: 'Not harmonized: lives are Europe-43 · 2019, weight is EU-28 · 2011. Compare shares along a bar, never totals across the two.',
        bars: [
          {
            id: 'europe-lives', measure: 'Animal lives', scope: 'Europe-43 · 2019',
            total: { value: '≈ 12.5 bn', text: 'land animals slaughtered', sub: 'EU-27 poultry alone ≈ 6.4 bn in 2020', tags: [{ text: 'Approximate', tone: 'flag' }], src: 'brief' },
            segs: [
              { role: 'consumed', kind: 'sourced', v: 9.738, name: 'Consumed', value: '≈ 9.7 bn', share: '≈ 78%', tag: 'Derived' },
              { role: 'wasted', kind: 'sourced', v: 2.762, name: 'Wasted with the meat', value: '2.76 bn', share: '≈ 22%', src: 'klaura' },
            ],
          },
          {
            id: 'europe-mass', measure: 'Meat weight', scope: 'EU-28 · 2011 · JRC model',
            total: { value: '61.7 Mt', text: 'meat available, incl. inedible parts', tags: [{ text: 'Other model', tone: 'rule' }], src: 'jrc' },
            segs: [
              { role: 'consumed', kind: 'sourced', v: 47.5, name: 'Consumed', value: '47.5 Mt', share: '77.0%', tag: 'Derived' },
              { role: 'wasted', kind: 'sourced', v: 14.2, name: 'Wasted', value: '14.2 Mt', share: '23.0%', src: 'jrc' },
            ],
          },
        ],
      },
      {
        id: 'germany', name: 'Germany', basis: 'National data + one advocacy model',
        bars: [
          {
            id: 'germany-lives', measure: 'Animal lives', scope: 'Germany · 2025',
            total: { value: '746 m', text: 'land animals slaughtered', sub: 'Destatis: 48.5 m mammals + 697.3 m poultry — the sum is ours', src: 'destatis' },
            segs: [
              { role: 'consumed', kind: 'scenario', v: 661.5, name: 'Consumed', value: '≈ 662–736 m', share: '≈ 89–99%', sub: 'depends on how much is wasted in the chain', tag: 'Derived' },
              { role: 'wasted', kind: 'scenario', v: 74.0, name: 'Rest of the chain', value: '≈ 29–74 m', share: '≈ 4–10%', sub: 'whole chain 39–85 m, households included', src: 'model' },
              { role: 'wasted', kind: 'sourced', v: 10.5, name: 'Households', value: '10.5 m', share: '1.4%', tags: [{ text: 'Advocacy source', tone: 'flag' }], src: 'fleischatlas' },
            ],
          },
          {
            id: 'germany-mass', measure: 'Meat weight', scope: 'Germany · 2025 / 2020',
            total: { value: 'Unknown', text: 'whole chain — Germany doesn’t publish it', unknown: true },
            segs: [
              { role: 'consumed', kind: 'sourced', v: 4600, name: 'Eaten', value: '4.6 Mt', share: '54.9 kg per person', src: 'bzl' },
              { role: 'wasted', kind: 'sourced', v: 74.6, name: 'Households', value: '74.6 kt', share: '1.6% of the 4.6 Mt', tags: [{ text: 'Partial indicator', tone: 'flag' }], src: ['gfk', 'thuenen'] },
              { role: 'unknown', kind: 'unknown', fixed: 16, name: 'Rest of the chain', value: 'Unknown', sub: 'food service ≈ 85.8 kt — unconfirmed', src: 'ahv' },
            ],
          },
        ],
      },
    ],

    // What each lever can save. f = the wasted share of all animal lives (≈ 18 bn ÷ ≈ 80 bn).
    // waste only = f·x · demand only = x · together, in sequence: 1 − (1 − d)(1 − w·f).
    impact: {
      f: 0.22,
      steps: [0.25, 0.5, 1],
      series: { waste: 'Waste only', demand: 'Demand only' },
      capMax: 'max via waste',
      groupTitle: 'Share of all animal lives saved',
      groupSub: 'When a lever is applied at 25%, 50% or 100% of its reach · world average',
      xLabel: 'How far the lever goes',
      curve: {
        title: 'Both levers together',
        sub: 'Animal lives saved when demand is cut by d and waste by w',
        wasteCuts: [0, 0.5, 1],
        labels: { 0: 'Demand only', 0.5: '+ half the waste removed', 1: '+ all waste removed' },
        mark: { d: 0.5, w: 0.5 },
        xLabel: 'Demand cut (share of meat eaten)',
        yLabel: 'Lives saved',
      },
      caption: 'Levers combine in sequence, not by adding up. Even removing ALL waste (22%) saves less than a 25% demand cut.',
    },

    germany: {
      total: 746, household: 10.5, share: 0.5, unit: 'm',
      title: 'Halve meat consumption, or end all household meat waste?',
      halveLabel: 'fewer animals a year if meat consumption is halved',
      householdLabel: 'fewer animals a year if ALL household meat waste ends',
      ratioLabel: 'the difference (rounded down)',
      src: ['destatis', 'fleischatlas'],
    },

    species: {
      chicken: { kg: 1.6, name: 'one chicken' },
      bovine: { kg: 323, name: 'one bovine' },
      text: 'Chickens dominate both levers by animal count. Fish are excluded — including them would enlarge the demand lever.',
      src: 'brief',
    },

    assumptions: [
      { id: 'L1', text: 'The wasted share f = 22% is global (≈ 18 bn ÷ ≈ 80 bn). It is used for the curves and for Europe; Germany’s sourced household share is far lower (1.4%).' },
      { id: 'L2', text: 'The ≈ 18 bn include animals lost on the farm before slaughter (production & rearing, 24.9%), while the ≈ 80 bn count slaughtered animals. So 22% is an approximation of lives wasted per lives slaughtered, not an exact ratio.' },
      { id: 'L3', text: 'A demand cut d removes d of all animals, wasted or not (proportional). The waste lever removes w of the wasted share only — it never touches the green part.' },
      { id: 'L4', text: 'The levers act in sequence: lives saved = 1 − (1 − d)(1 − w·f), not d + w·f. At d = w = 50% that is 55.5%, not 61%.' },
      { id: 'L5', text: 'Fish and other aquatic animals are not counted. Including them would make the demand lever larger, not the waste lever.' },
      { id: 'L6', text: 'Tonnes are never converted with the 26.7% consumption share — it counts animals, not kilos — and a bar’s weight is never divided by another bar’s lives.' },
    ],
  },

  // 1 · The tree. One path from all food waste down to the plate; lives and weight share one node.
  //     Each node is a mini-table over the same three regions as the grids below.
  //     cell: { v, kind? }  ·  null = nothing to show here (rendered as "—").
  tree: {
    title: 'How it breaks down',
    lead: 'One path, top to bottom: from all food waste to meat, to the plate. Animal lives and weight sit in one node — two measures of the same meat. Read across for World, Europe and Germany.',
    cols: ['World', 'Europe', 'Germany'],
    edgeGap: 'meat’s share of food waste: not reported',
    foot: 'Europe is three scopes here: Europe-43 (animal lives), EU-28 · 2011 (meat weight), EU-27 · 2022 (all food). “Before the plate” is the total minus “at the plate”, inside the same model. Each grid below names its scope.',
    root: {
      id: 'C', badge: 'C', title: 'All food waste', note: 'all foods, not only meat',
      rows: [
        { label: 'Total', cells: [{ v: '1.05 bn t' }, { v: '57.5 Mt' }, { v: '10.8 Mt' }] },
        { label: 'At consumption', cells: [{ v: '921 Mt' }, { v: '37.0 Mt' }, { v: '8.3 Mt' }] },
      ],
      children: [
        {
          id: 'AB', badge: 'A + B', title: 'Meat lost or wasted', note: 'animal lives and weight in one node',
          rows: [
            { label: 'Animal lives', cells: [{ v: '18 bn' }, { v: '2.76 bn' }, { v: '≈ 10.5 m' }] },
            { label: 'Weight', cells: [{ v: '52.4 Mt' }, { v: '14.2 Mt' }, { v: '74.6 kt' }] },
          ],
          children: [
            {
              id: 'before', title: 'Before the plate', note: 'farm · processing · retail',
              rows: [
                { label: 'Animal lives', cells: [{ v: '13.2 bn' }, null, null] },
                { label: 'Weight', cells: [null, { v: '5.2 Mt' }, null] },
              ],
            },
            {
              id: 'plate', badge: 'D', focus: true, title: 'At the plate', note: 'food service + households',
              rows: [
                { label: 'Lost · animal lives', cells: [{ v: '4.80 bn' }, null, null] },
                { label: 'Lost · weight', cells: [null, { v: '9.0 Mt' }, null] },
                { label: 'Eaten per person', focus: true, cells: [{ v: '≈ 28.4 kg' }, { v: '66.6 kg' }, { v: '54.9 kg' }] },
              ],
            },
          ],
        },
      ],
    },
  },

  // 2 · Two dual grids. Each pairs two dimensions side by side, one row per region.
  blocks: [
    {
      id: 'meat',
      title: 'Meat lost or wasted — lives and weight, side by side',
      lead: 'Same meat, two measures. A counts animals, B weighs the meat. Under each total, the part that is lost at consumption.',
      dims: ['A', 'B'],
    },
    {
      id: 'plate',
      title: 'All food waste → the plate',
      lead: 'C puts meat in the context of all food wasted. D is where we act: how much meat is eaten per person.',
      dims: ['C', 'D'],
      link: true,
    },
  ],

  geos: [
    { id: 'world', name: 'World', basis: 'Global models' },
    { id: 'europe', name: 'Europe', basis: 'Three scopes — named per cell' },
    { id: 'germany', name: 'Germany', basis: 'National data + one advocacy model' },
  ],

  dims: [
    {
      id: 'A',
      name: 'Animal lives',
      unit: 'number of animals',
      question: 'How many animals?',
      soWhat: 'Chickens drive the count.',
      cells: {
        world: {
          scope: 'World · 2019',
          drill: { label: 'Animal lives — 17.97 bn', ids: ['species', 'stages'] },
          items: [
            {
              kind: 'sourced',
              value: '17.97 bn',
              label: 'animal lives lost with wasted meat',
              meter: { value: 93.6, caption: 'chickens' },
              sub: '2.4 per person · six land species',
              src: 'klaura',
              child: {
                kind: 'sourced',
                value: '4.80 bn',
                label: 'lost at consumption — households + food service',
                meter: { value: 26.7, caption: 'of all animal lives lost' },
                src: 'klaura',
              },
            },
          ],
        },
        europe: {
          scope: 'Europe-43 · 2019 · same model',
          items: [
            {
              kind: 'sourced',
              value: '2.76 bn',
              label: 'animal lives lost',
              meter: { value: 15.4, caption: 'of the world total' },
              sub: '3.61 per person',
              src: 'klaura',
              child: {
                kind: 'gap',
                tag: 'Not in our data',
                value: 'Unknown',
                label: 'lost at consumption — Europe’s stage split is not in our data yet',
              },
            },
          ],
          note: 'Europe’s share of the world total — not “15% of European animals”. 43 countries, not the EU-27.',
        },
        germany: {
          scope: 'Germany · households · other sources',
          items: [
            {
              kind: 'sourced',
              value: '≈ 10.5 m',
              label: 'land animals in household meat waste',
              tags: [{ text: 'Advocacy source', tone: 'flag' }],
              sub: '85% chickens · fish not counted',
              src: 'fleischatlas',
            },
            {
              kind: 'scenario',
              value: '≥ 39.3 m',
              label: 'whole chain — lower bound',
              tags: [{ text: 'Lower bound', tone: 'rule' }],
              sub: 'B ≈ 51.7 m · C ≈ 84.5 m',
              src: 'model',
            },
          ],
          note: { text: 'For scale: 631 m chickens were slaughtered in Germany in 2022.', src: 'slaughter' },
        },
      },
    },
    {
      id: 'B',
      name: 'Meat weight',
      unit: 'tonnes of meat',
      question: 'How much meat is lost?',
      soWhat: 'Tonnes tell another story — and never convert into animals.',
      drill: { href: '#paths', label: 'Germany: two paths' }, // a link to a section; the in-grid drill-downs are `cell.drill`
      cells: {
        world: {
          scope: 'World · 2019 · same model as A',
          items: [
            {
              kind: 'sourced',
              value: '52.4 Mt',
              label: 'edible meat lost · 77.4 Mt carcass weight',
              meter: { value: 16.7, caption: 'of production — “about one sixth”' },
              src: 'klaura',
              child: {
                kind: 'gap',
                tag: 'Not published',
                value: 'Unknown',
                label: 'lost at consumption — the stage split is published for animals, not for mass',
              },
            },
          ],
        },
        europe: {
          scope: 'EU-28 · 2011 · other model',
          items: [
            {
              kind: 'sourced',
              value: '14.2 Mt',
              label: 'meat wasted along the whole chain',
              tags: [{ text: 'Other model', tone: 'rule' }],
              meter: { value: 23.0, caption: 'of 61.7 Mt available, incl. inedible parts' },
              src: 'jrc',
              child: {
                kind: 'sourced',
                value: '9.0 Mt',
                label: 'wasted at consumption',
                tags: [{ text: 'EU-28 · 2011', tone: 'rule' }],
                meter: { value: 63.4, caption: 'of 14.2 Mt · households 7.3 · food service 1.7' },
                src: 'jrc',
              },
            },
          ],
          note: 'A mass model of another year — never mixed with the animal count beside it.',
        },
        germany: {
          scope: 'Germany · households · 2020',
          drill: { label: 'Meat weight — 74.6 kt, and what it means in animals', ids: ['flow'] },
          items: [
            {
              kind: 'sourced',
              value: '74.6 kt',
              label: 'avoidable household waste of meat, sausage & fish',
              tags: [{ text: 'Partial indicator', tone: 'flag' }],
              sub: 'other basis: ≈ 125 kt',
              src: ['gfk', 'thuenen'],
            },
            {
              kind: 'gap',
              value: 'Unknown',
              label: 'meat waste in food service, retail, processing and farming',
              sub: 'food service ≈ 85.8 kt — unconfirmed',
              src: 'ahv',
            },
          ],
        },
      },
    },
    {
      id: 'C',
      name: 'All food waste',
      unit: 'tonnes, all foods',
      question: 'Where does meat sit in all food waste?',
      soWhat: 'By mass, meat is a thin slice of food waste. By lives, it is all of it.',
      cells: {
        world: {
          scope: 'World · 2022 · retail to plate',
          items: [
            {
              kind: 'sourced',
              value: '1.05 bn t',
              label: 'food wasted, all foods',
              sub: '132 kg per person · retail 131 Mt',
              src: 'unep',
              child: {
                kind: 'sourced',
                value: '921 Mt',
                label: 'at consumption — households 631 Mt + food service 290 Mt',
                tags: [{ text: 'Derived', tone: 'rule' }],
                meter: { value: 87.5, caption: 'of the total' },
                src: 'unep',
              },
            },
          ],
          note: 'Meat’s share: not reported. Farm and processing losses are not in this figure.',
        },
        europe: {
          scope: 'EU-27 · 2022',
          items: [
            {
              kind: 'sourced',
              value: '57.5 Mt',
              label: 'food wasted, all foods, farm to plate',
              sub: 'latest year: 57.9 Mt (2024)',
              src: 'eurostat',
              child: {
                kind: 'sourced',
                value: '37.0 Mt',
                label: 'at consumption — households 30.5 Mt + food service 6.5 Mt',
                tags: [{ text: 'Derived', tone: 'rule' }],
                meter: { value: 64.3, caption: 'of the total' },
                src: 'eurostat',
              },
            },
          ],
          note: 'Meat’s share: not reported — Eurostat doesn’t split food waste by product.',
        },
        germany: {
          scope: 'Germany · 2022',
          drill: { label: 'Food waste — 10.8 Mt', ids: ['sectors', 'products'] },
          items: [
            {
              kind: 'sourced',
              value: '10.8 Mt',
              label: 'food wasted — 18.8% of the EU total, the largest',
              src: 'eurostat',
              child: {
                kind: 'sourced',
                value: '8.3 Mt',
                label: 'at consumption — households 6.29 Mt + food service 1.98 Mt',
                tags: [{ text: 'Derived', tone: 'rule' }],
                meter: { value: 76.7, caption: 'of the total' },
                src: 'eurostat',
              },
            },
            {
              kind: 'sourced',
              value: '4.0%',
              label: 'of avoidable household food waste is meat, sausage & fish',
              sub: 'the only meat share we have',
              src: 'gfk',
            },
          ],
        },
      },
    },
    {
      id: 'D',
      name: 'At the plate',
      focus: true,
      unit: 'meat eaten per person',
      question: 'How much meat is eaten?',
      soWhat: 'This is where we act: the plate. Germany eats 54.9 kg of meat per person a year.',
      cells: {
        world: {
          scope: 'World · 2024',
          items: [
            {
              kind: 'sourced',
              value: '≈ 28.4 kg',
              label: 'meat per person a year, retail weight',
              tags: [{ text: 'Derived', tone: 'rule' }],
              sub: '374 Mt produced in 2024 (carcass weight)',
              src: ['oecd', 'fao'],
            },
          ],
        },
        europe: {
          scope: 'EU-27 · avg. 2022–24',
          items: [
            {
              kind: 'sourced',
              value: '66.6 kg',
              label: 'meat per person a year, retail weight',
              sub: '37.5 Mt in total — carcass weight; don’t multiply the two',
              src: 'euoutlook',
            },
          ],
        },
        germany: {
          scope: 'Germany · 2025 / 2020',
          items: [
            {
              kind: 'sourced',
              value: '54.9 kg',
              label: 'meat eaten per person a year — 4.6 Mt in total',
              sub: 'pork 28.3 · poultry 14.7 · beef & veal 9.7 · other 2.2 kg',
              src: 'bzl',
            },
            {
              kind: 'sourced',
              value: '1.62%',
              label: 'known household meat waste (74.6 kt) against meat eaten',
              tags: [{ text: 'Partial indicator', tone: 'flag' }],
              meter: { value: 1.62, caption: 'households only · fish in the 74.6 kt, not in the 4.6 Mt' },
              src: ['gfk', 'bzl'],
            },
          ],
        },
      },
    },
  ],

  // 3 · The chain: what "at consumption" means. Same split, different measures, each with its own total.
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
        dim: 'A', title: 'Animal lives', scope: 'World · 2019', total: '17.97 bn', src: 'klaura',
        segs: [{ name: 'Before the plate', v: 13.17, text: '13.17 bn' }, { name: 'At consumption', v: 4.8, text: '4.80 bn', at: 'both' }],
        note: 'One consumption stage: households and food service are not split.',
      },
      {
        dim: 'B', title: 'Meat weight', scope: 'EU-28 · 2011 · JRC', total: '14.2 Mt', src: 'jrc',
        segs: [{ name: 'Before the plate', v: 5.2, text: '5.2 Mt' }, { name: 'Food service', v: 1.7, text: '1.7 Mt', at: 'service' }, { name: 'Households', v: 7.3, text: '7.3 Mt', at: 'home' }],
      },
      {
        dim: 'C', title: 'All food', scope: 'EU-27 · 2022', total: '57.5 Mt', src: 'eurostat',
        segs: [
          { name: 'Farm', v: 5.5, text: '5.5 Mt' }, { name: 'Processing', v: 10.4, text: '10.4 Mt' }, { name: 'Retail', v: 4.6, text: '4.6 Mt' },
          { name: 'Food service', v: 6.5, text: '6.5 Mt', at: 'service' }, { name: 'Households', v: 30.5, text: '30.5 Mt', at: 'home' },
        ],
      },
      {
        dim: 'C', title: 'All food', scope: 'Germany · 2022', total: '10.8 Mt', src: 'eurostat',
        segs: [
          { name: 'Farm', v: 0.178, text: '0.18 Mt' }, { name: 'Processing', v: 1.564, text: '1.56 Mt' }, { name: 'Retail', v: 0.774, text: '0.77 Mt' },
          { name: 'Food service', v: 1.978, text: '1.98 Mt', at: 'service' }, { name: 'Households', v: 6.289, text: '6.29 Mt', at: 'home' },
        ],
      },
      {
        dim: 'C', title: 'All food', scope: 'World · 2022 · UNEP', total: '1.05 bn t', src: 'unep',
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
        tag: { text: 'Proxy', tone: 'flag' },
        note: 'A proxy for where the count is: 93.6% of the animals lost are chickens. Slaughter is production, not consumption, and not a Klaura value. Austria, Estonia, Luxembourg and Slovakia don’t publish it.',
        src: 'slaughter',
      },
    ],
  },
};
