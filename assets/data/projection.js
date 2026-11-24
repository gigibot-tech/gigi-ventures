/* GiGi Vegan — data/projection.js
   Everything on levers.html lives HERE: the reach of the two levers, a year-by-year projection, and the goals
   (ProVeg, Albert Schweitzer Foundation, UN SDG 12.3, EU 2030) read in animal lives. Edit this file; the page redraws.

   The model is deliberately small, so every step can be checked by hand:
     demand lever A   d(t) = cut · ramp(t → target year)            (linear from the start year, then flat)
     waste lever B    w(t) = cut · ramp(t → target year)            (cut = share of the WASTED lives removed)
     lives saved      s(t) = 1 − (1 − d)(1 − w·f)  = d + (1 − d)·w·f   f = wasted share of all animal lives
   The goals are paraphrased, never quoted at length; each one carries its source, its wording date and a caveat.
   sources: numbered by the ORDER below = the numbered "Sources & method" list in levers.html (id="src-<key>").
   notes:   same idea as on vegan.html — a number that differs from the one on vegan.html is marked (≠a) and explained. */

window.GIGI_DATA = window.GIGI_DATA || {};

window.GIGI_DATA.projection = {
  ui: {
    sourced: 'Sourced',
    scenario: 'Scenario',
    source: 'Source',
    sources: 'Sources',
    noteMark: 'Number note',
    notesTitle: 'When a number changes',
    notesLead: 'Some numbers here differ from the same thing on the GiGi Vegan page — another year, another base. Each mark (≠i) points to what changed and links to every version.',
    tableView: 'View as table',
    regionLegend: 'Region',
    wasteLegend: 'How big is the waste slice?',
    presetLegend: 'Start from a goal',
    leverA: 'Lever A — eat less meat',
    leverB: 'Lever B — waste less food',
    cut: 'Reduction',
    byYear: 'reached by',
    modeLegend: 'Show',
    modeYear: 'Per year',
    modeCum: 'Cumulative',
    assumed: 'year assumed',
    showIn: 'Show in the projection',
    none: 'Nothing changes',
  },

  sources: {
    klaura: {
      short: 'Klaura et al. 2023',
      label: 'Klaura et al. 2023, Leiden University — animal lives in meat loss and waste, 2019 data: 17.97 bn, and their share by chain stage (production & rearing 24.9%, storage & transport 7.8%, slaughter & processing 20.0%, distribution & retail 20.6%, households & food service 26.7%)',
    },
    faostat: {
      short: 'FAO slaughter',
      label: 'FAO (FAOSTAT) live animals slaughtered — 86.3 bn in 2024, 91% of them chickens',
    },
    destatis: {
      short: 'Destatis 2025',
      label: 'Destatis press release 049/2026 — 2025 slaughter: 48.5 m mammals + 697.3 m poultry; the sum (≈ 746 m) is ours',
    },
    brief: {
      short: 'Research brief',
      label: 'GiGi research brief — not re-verified: Europe-43 total ≈ 12.5 bn animals; average meat per animal (chicken ≈ 1.6 kg, bovine ≈ 323 kg)',
    },
    proveg: {
      short: 'ProVeg 2024',
      label: 'ProVeg International, press release of 3 June 2024 (its “About ProVeg” boilerplate)',
    },
    provegold: {
      short: 'ProVeg, earlier',
      label: 'vegconomist interview with ProVeg: the mission as “50 by 40” — halve global meat consumption before 2040 (earlier wording)',
    },
    asf: {
      short: 'ASF report 2023',
      label: 'Albert Schweitzer Stiftung für unsere Mitwelt, Transparenz- und Wirkungsbericht 2023 — vision, mission, and the aim to improve conditions for hundreds of millions of animals, mainly broiler chickens',
    },
    asfclimate: {
      short: 'ASF, climate page',
      label: 'Albert Schweitzer Stiftung, “Tierprodukte befeuern die Klimakrise” — states that meat consumption in Europe would have to fall by 70–80% (Planetary Health Diet); no target year',
    },
    sdg: {
      short: 'UN SDG 12.3',
      label: 'United Nations, Sustainable Development Goal 12, target 12.3 — halve per-capita food waste at retail and consumer level by 2030; cut food losses along production and supply chains',
    },
    euwfd: {
      short: 'EU 2025/1892',
      label: 'Directive (EU) 2025/1892 amending the Waste Framework Directive — binding national food-waste targets for 2030: −10% processing and manufacturing, −30% per capita retail and consumption; baseline 2021–2023',
    },
    fleischatlas: {
      short: 'Meat Atlas 2021',
      label: 'Meat Atlas (Fleischatlas) 2021 — an advocacy source: ≈ 10.5 m land animals in household meat waste in Germany; calculation method not fully published',
    },
    jrc: {
      short: 'JRC 2011',
      label: 'European Commission JRC mass-flow model, EU-28, data 2011 — meat by supply-chain stage',
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
    ahv: {
      short: 'Earlier analysis',
      label: 'Food-service meat waste ≈ 85.8 kt (2018/19) — a study estimate we could not re-verify',
    },
    model: {
      short: 'GiGi projection model',
      label: 'Our own calculation — the assumptions P1–P7 on this page, and the lever assumptions L1–L6 on the GiGi Vegan page',
    },
  },

  // The notes (≠i …) live in assets/data/notes.js, one list for both pages.

  // The total system — consumed + wasted per region, meat weight then animal lives. Per region, ONE total-system bar per measure (meat weight first, then
  //     animal lives), split into consumed (green) + wasted (coral).  Lever A (demand) acts on the whole bar; lever B (waste) only on the wasted segment.
  //     seg.kind: "sourced" → solid · "scenario" → dashed · "unknown" → hatched grey (its width carries no value).
  //     seg.v is in ONE unit per bar (bar widths are computed from it); a seg with `fixed` (% of the bar) has no value.
  //     seg.drill → link to that region's row of the drill-down matrix · seg.link → any other link · seg.mark → a number note (a–i).
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
      drill: 'Drill down',
      details: 'Details, sources and links',
      showAll: 'Show all details',
      hideAll: 'Hide all details',
      leverKey: 'The two levers',
    },
    keys: [
      { id: 'A', name: 'Eat less meat', acts: 'acts on the whole bar', short: 'A · eat less → the whole bar' },
      { id: 'B', name: 'Waste less food', acts: 'acts only on the wasted part', short: 'B · waste less → this part only' },
    ],
    blocks: {
      system: { title: 'The total system, region by region', lead: 'Each bar is everything produced in a region, split into what is consumed and what is wasted — meat weight first, then animal lives. They are two measures of the same meat, so they sit in separate bars and are never converted into each other.' },
      assumptions: { title: 'Assumptions behind the bars (L1–L6)' },
    },
    // Meat weight first, then animal lives — in every region.
    regions: [
      {
        id: 'world', name: 'World', basis: 'Global models',
        bars: [
          {
            id: 'world-mass', measure: 'Meat weight', scope: 'World · 2019',
            total: { id: 'lv-world-mass-total', value: '335 Mt', text: 'meat produced', tags: [{ text: 'Brief', tone: 'flag' }], src: 'brief', mark: 'xiii' },
            drill: 'weight-world',
            shares: [{ role: 'consumed', label: 'Consumed', text: '≈ 77%' }, { role: 'wasted', label: 'Wasted', text: '≈ 23%' }],
            segs: [
              { role: 'consumed', kind: 'sourced', v: 257.6, name: 'Consumed', value: '≈ 258 Mt', share: '≈ 77%', tag: 'Derived' },
              { id: 'lv-world-mass-edible', role: 'wasted', kind: 'sourced', v: 52.4, name: 'Wasted — edible meat', value: '52.4 Mt', share: '≈ 16%', sub: 'about one sixth of production', src: 'klaura', mark: 'xii', drill: 'weight-world' },
              { role: 'wasted', tone: 'soft', kind: 'sourced', v: 25.0, name: 'Wasted — inedible parts', value: '≈ 25 Mt', share: '≈ 7%', sub: '77.4 Mt carcass weight in all', tag: 'Derived' },
            ],
          },
          {
            id: 'world-lives', measure: 'Animal lives', scope: 'World · 2019',
            total: { id: 'lv-world-lives-total', value: '≈ 80 bn', text: 'land animals slaughtered', sub: 'FAO series: 86.3 bn in 2024, 91% chickens', tags: [{ text: 'Rounded', tone: 'rule' }], src: 'faostat', mark: 'ix' },
            drill: 'lives-world',
            shares: [{ role: 'consumed', label: 'Consumed', text: '≈ 78%' }, { role: 'wasted', label: 'Wasted', text: '≈ 22%', mark: 'ii' }],
            segs: [
              { role: 'consumed', kind: 'sourced', v: 62, name: 'Consumed', value: '≈ 62 bn', share: '≈ 78%', tag: 'Derived' },
              { id: 'lv-world-lives-wasted', role: 'wasted', kind: 'sourced', v: 18, name: 'Wasted with the meat', value: '≈ 18 bn', share: '≈ 22%', src: 'klaura', mark: ['i', 'ii'], drill: 'lives-world' },
            ],
          },
        ],
      },
      {
        id: 'europe', name: 'Europe', basis: 'Three scopes — named per bar',
        notHarmonized: 'Not harmonized: weight is EU-28 · 2011, lives are Europe-43 · 2019. Compare shares along a bar, never totals across the two.',
        notHarmonizedMark: 'v',
        bars: [
          {
            id: 'europe-mass', measure: 'Meat weight', scope: 'EU-28 · 2011 · JRC model',
            total: { id: 'lv-europe-mass-total', value: '61.7 Mt', text: 'meat available, incl. inedible parts', tags: [{ text: 'Other model', tone: 'rule' }], src: 'jrc', mark: 'v' },
            drill: 'weight-europe',
            shares: [{ role: 'consumed', label: 'Consumed', text: '77.0%' }, { role: 'wasted', label: 'Wasted', text: '23.0%' }],
            segs: [
              { role: 'consumed', kind: 'sourced', v: 47.5, name: 'Consumed', value: '47.5 Mt', share: '77.0%', tag: 'Derived' },
              { id: 'lv-europe-mass-wasted', role: 'wasted', kind: 'sourced', v: 14.2, name: 'Wasted', value: '14.2 Mt', share: '23.0%', src: 'jrc', drill: 'weight-europe' },
            ],
          },
          {
            id: 'europe-lives', measure: 'Animal lives', scope: 'Europe-43 · 2019',
            total: { id: 'lv-europe-lives-total', value: '≈ 12.5 bn', text: 'land animals slaughtered', sub: 'EU-27 poultry alone ≈ 6.4 bn in 2020', tags: [{ text: 'Approximate', tone: 'flag' }], src: 'brief', mark: ['v', 'viii'] },
            drill: 'lives-europe',
            shares: [{ role: 'consumed', label: 'Consumed', text: '≈ 78%' }, { role: 'wasted', label: 'Wasted', text: '≈ 22%', mark: 'ii' }],
            segs: [
              { role: 'consumed', kind: 'sourced', v: 9.738, name: 'Consumed', value: '≈ 9.7 bn', share: '≈ 78%', tag: 'Derived' },
              { id: 'lv-europe-lives-wasted', role: 'wasted', kind: 'sourced', v: 2.762, name: 'Wasted with the meat', value: '2.76 bn', share: '≈ 22%', src: 'klaura', mark: 'ii', drill: 'lives-europe' },
            ],
          },
        ],
      },
      {
        id: 'germany', name: 'Germany', basis: 'National data + one advocacy model',
        bars: [
          {
            id: 'germany-mass', measure: 'Meat weight', scope: 'Germany · 2025 / 2020',
            total: { value: 'Unknown', text: 'whole chain — Germany doesn’t publish it; our estimate is on GiGi Vegan', unknown: true },
            drill: 'weight-germany',
            shares: [{ role: 'consumed', label: 'Calculated', text: '4.6 Mt' }, { role: 'wasted', label: 'Wasted, households', text: '1.6%', mark: 'vii' }, { role: 'unknown', kind: 'unknown', label: 'Rest of the chain', text: 'unknown' }],
            segs: [
              { id: 'lv-germany-mass-eaten', role: 'consumed', kind: 'sourced', v: 4600, name: 'Calculated consumption', value: '4.6 Mt', share: '54.9 kg', sub: 'per person a year · waste still inside', src: 'bzl' },
              { id: 'lv-germany-mass-hh', role: 'wasted', kind: 'sourced', v: 74.6, name: 'Households', value: '74.6 kt', share: '1.6%', sub: 'of the 4.6 Mt calculated · households only', tags: [{ text: 'Partial indicator', tone: 'flag' }], src: ['gfk', 'thuenen'], mark: 'vii', drill: 'weight-germany' },
              { role: 'unknown', kind: 'unknown', fixed: 16, name: 'Rest of the chain', value: 'Unknown', sub: 'food service ≈ 85.8 kt — unconfirmed', src: 'ahv' },
            ],
          },
          {
            id: 'germany-lives', measure: 'Animal lives', scope: 'Germany · 2025',
            total: { id: 'lv-germany-lives-total', value: '746 m', text: 'land animals slaughtered', sub: 'Destatis: 48.5 m mammals + 697.3 m poultry — the sum is ours', src: 'destatis', mark: 'viii' },
            drill: 'lives-germany',
            shares: [{ role: 'consumed', kind: 'scenario', label: 'Consumed', text: '≈ 89–99%' }, { role: 'wasted', kind: 'scenario', label: 'Wasted', text: '≈ 1.4–11%', mark: 'vi' }],
            segs: [
              { role: 'consumed', kind: 'scenario', v: 661.5, name: 'Consumed', value: '≈ 662–736 m', share: '≈ 89–99%', sub: 'depends on how much is wasted in the chain', tag: 'Derived' },
              { id: 'lv-germany-lives-rest', role: 'wasted', kind: 'scenario', v: 74.0, name: 'Rest of the chain', value: '≈ 29–74 m', share: '≈ 4–10%', sub: 'whole chain 39–85 m, households included', src: 'model', mark: 'vi', link: { href: 'vegan.html#paths', label: 'Germany: two paths' } },
              { id: 'lv-germany-lives-hh', role: 'wasted', kind: 'sourced', v: 10.5, name: 'Households', value: '10.5 m', share: '1.4%', tags: [{ text: 'Advocacy source', tone: 'flag' }], src: 'fleischatlas', mark: 'vi', drill: 'lives-germany' },
            ],
          },
        ],
      },
    ],

    assumptions: [
      { id: 'L1', text: 'The wasted share f = 22% is global (≈ 18 bn ÷ ≈ 80 bn). It is used for the curves and for Europe; Germany’s sourced household share is far lower (1.4%).' },
      { id: 'L2', text: 'The ≈ 18 bn include animals lost on the farm before slaughter (production & rearing, 24.9%), while the ≈ 80 bn count slaughtered animals. So 22% is an approximation of lives wasted per lives slaughtered, not an exact ratio.' },
      { id: 'L3', text: 'A demand cut d removes d of all animals, wasted or not (proportional). The waste lever removes w of the wasted share only — it never touches the green part.' },
      { id: 'L4', text: 'The levers act in sequence: lives saved = 1 − (1 − d)(1 − w·f), not d + w·f. At d = w = 50% that is 55.5%, not 61%.' },
      { id: 'L5', text: 'Fish and other aquatic animals are not counted. Including them would make the demand lever larger, not the waste lever.' },
      { id: 'L6', text: 'Tonnes are never converted with the 26.7% consumption share — it counts animals, not kilos — and a bar’s weight is never divided by another bar’s lives.' },
    ],
  },

  // The reach of each lever: grouped bars and the curve for both together (moved here from GiGi Vegan).
  // What each lever can save. f = the wasted share of all animal lives (≈ 18 bn ÷ ≈ 80 bn).
  // waste only = f·x · demand only = x · together, in sequence: 1 − (1 − d)(1 − w·f).
  impact: {
    f: 0.22,
    steps: [0.25, 0.5, 1],
    series: { waste: 'Waste less (B)', demand: 'Eat less (A)' },
    capMax: 'limit of B',
    groupTitle: 'One lever at a time: animals spared, of every 100',
    groupSub: 'Pulled a quarter, half or all the way · world average',
    xLabel: 'How far the lever is pulled',
    curve: {
      title: 'Both levers at the same time',
      sub: 'Animals spared, of every 100, when people eat less meat and less is wasted',
      wasteCuts: [0, 0.5, 1],
      labels: { 0: 'Eat less only', 0.5: '… and half the waste gone', 1: '… and no waste at all' },
      mark: { d: 0.5, w: 0.5 },
      callLabel: 'Eat half, waste half',
      xLabel: 'How much less meat is eaten',
      yLabel: 'Animals spared',
    },
    why: {
      title: 'Why 55.5 and not 61? Count it with 100 animals.',
      steps: [
        'Start with 100 animals raised for meat: the meat of 78 is eaten, the meat of 22 is lost or wasted.',
        'Eat half as much meat: only 50 animals are raised — 39 for meat that is eaten, 11 for meat that is wasted. 50 spared.',
        'Now halve the waste: of those 11, 5.5 are no longer needed. 5.5 more spared.',
        'Together: 50 + 5.5 = 55.5 of 100. Adding 50 + 11 = 61 would count 5.5 animals twice — eating less had already spared them.',
      ],
      note: 'And even no waste at all (22 of 100) spares fewer animals than eating a quarter less meat (25 of 100).',
    },
  },

  // What the reach means in Germany: halving meat consumption vs ending all household meat waste, and the species behind it.
  blocks: { germany: { title: 'What that means in Germany' }, species: { title: 'Why chickens dominate both levers' } },
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

  model: { start: 2025, end: 2050, defaultRegion: 'germany', defaultPreset: 'both' },

  // Where each region starts. baseline = land animals slaughtered a year. f = the wasted share of those lives.
  regions: [
    {
      id: 'world', name: 'World', baseline: 86.3e9, year: 2024, src: 'faostat', mark: 'ix', tag: null,
      basis: '86.3 bn a year · FAO, 2024',
      waste: [{ id: 'est', label: 'World estimate', sub: '≈ 22% · Klaura ÷ FAO', f: 0.22, kind: 'sourced' }],
    },
    {
      id: 'europe', name: 'Europe', baseline: 12.5e9, year: 2019, src: 'brief', tag: 'Approximate',
      basis: '≈ 12.5 bn a year · Europe-43, 2019',
      waste: [{ id: 'est', label: 'Same as the world', sub: '≈ 22% · Klaura', f: 0.22, kind: 'sourced' }],
    },
    {
      id: 'germany', name: 'Germany', baseline: 746e6, year: 2025, src: 'destatis', mark: 'vi', tag: null,
      basis: '746 m a year · Destatis, 2025',
      waste: [
        { id: 'hh', label: 'Households only', sub: '10.5 m · 1.4% · sourced', f: 10.5 / 746, kind: 'sourced' },
        { id: 'low', label: 'Whole chain, lower bound', sub: '39.3 m · 5.3% · scenario', f: 39.3 / 746, kind: 'scenario' },
        { id: 'high', label: 'Whole chain, upper bound', sub: '84.5 m · 11.3% · scenario', f: 84.5 / 746, kind: 'scenario' },
      ],
      defaultWaste: 'low',
    },
  ],

  // Klaura et al., world: the share of all wasted animal lives lost at each chain stage. Used to read food-waste goals.
  stages: {
    src: 'klaura',
    shares: { processing: 0.200, retail: 0.206, consumers: 0.267 },
    labels: { processing: 'slaughter & processing', retail: 'distribution & retail', consumers: 'households & food service' },
  },

  goals: [
    {
      id: 'proveg', org: 'ProVeg International', lever: 'A', src: ['proveg', 'provegold'], mark: 'xii',
      said: 'Replace half of all animal products worldwide with plant-based and cultivated foods by 2040.',
      aside: 'Wording of June 2024. Until about 2021: halve global consumption of animals by 2040.',
      model: { demand: 0.5, year: 2040 },
      reading: 'In our model: lever A, a 50% cut by 2040.',
      caveat: 'The goal counts animal products, not animal lives. We assume every species falls by the same share. Replacing beef first would spare far fewer animals than replacing chicken first — one bovine is about 200 chickens’ worth of meat.',
    },
    {
      id: 'asf', org: 'Albert Schweitzer Foundation', lever: 'A', src: ['asf', 'asfclimate'],
      said: 'Vision: no animal suffers for food production. Mission: raise animal-welfare standards, reduce the consumption of animal products and spread the vegan idea. It sets no number or year of its own, and cites a 70–80% cut in meat in Europe as what the Planetary Health Diet implies.',
      aside: 'Its planning horizon is three years.',
      model: { demand: 0.7, year: 2050, yearAssumed: true },
      reading: 'In our model: lever A, a 70% cut — the low end of the range it cites — reached by 2050. The year is our assumption.',
      caveat: 'Most of its current work, for broiler chickens above all, changes how animals live, not how many there are. That third lever, welfare standards, is not in this model.',
    },
    {
      id: 'sdg', org: 'United Nations · SDG 12.3', lever: 'B', src: 'sdg', mark: 'xiii',
      said: 'By 2030, halve per-capita food waste at retail and consumer level, and reduce food losses along production and supply chains.',
      stageCuts: { retail: 0.5, consumers: 0.5 }, year: 2030,
      reading: 'In our model: lever B. Only retail and consumer waste is halved — together 47.3% of the wasted lives in the world data — so the goal removes ≈ 24% of the wasted lives by 2030.',
      caveat: 'The target is for food in tonnes, not for meat or animals (P5). The other chain stages get no number.',
    },
    {
      id: 'eu', org: 'European Union · Waste Framework Directive', lever: 'B', src: 'euwfd', mark: 'xiii',
      said: 'Binding for member states by 31 December 2030: 10% less food waste in processing and manufacturing, and 30% less per capita in retail and consumption together, against the 2021–2023 average.',
      aside: 'In force since October 2025. The Commission is to review stronger targets, including 2035.',
      stageCuts: { processing: 0.10, retail: 0.30, consumers: 0.30 }, year: 2030,
      reading: 'In our model: lever B, ≈ 16% of the wasted lives by 2030.',
      caveat: 'Same reading as SDG 12.3: food in tonnes, applied to meat (P5). It binds states, not companies or households.',
    },
  ],

  presets: [
    { id: 'both', label: 'ProVeg + SDG 12.3', goals: ['proveg', 'sdg'] },
    { id: 'proveg', label: 'ProVeg 2040', goals: ['proveg'] },
    { id: 'asf', label: 'Albert Schweitzer', goals: ['asf'] },
    { id: 'sdg', label: 'SDG 12.3', goals: ['sdg'] },
    { id: 'eu', label: 'EU 2030 law', goals: ['eu'] },
    { id: 'none', label: 'Nothing changes', goals: [] },
  ],

  assumptions: [
    { id: 'P1', text: 'The baseline is held flat at the latest count (no growth, no existing decline). “Lives saved” is measured against that flat line; it is a what-if, not a forecast. The Albert Schweitzer Foundation notes that meat consumption and slaughter numbers in Germany are falling slowly — that trend is not in here.' },
    { id: 'P2', text: 'Each lever ramps up in a straight line from 2025 to its target year, then stays there. Real change is lumpier.' },
    { id: 'P3', text: 'A demand cut removes the same share of every species. A goal counted in kilos or in products is not a goal counted in lives: replacing beef first would spare far fewer animals than replacing chicken first (≈ 200 chickens per bovine).' },
    { id: 'P4', text: 'The waste lever only touches the wasted share f (the coral part of each bar), and the levers combine in sequence: lives saved = 1 − (1 − d)(1 − w·f), not d + w·f (L3, L4 on the GiGi Vegan page).' },
    { id: 'P5', text: 'SDG 12.3 and the EU law are targets for food waste in tonnes, all foods. We assume meat follows the same percentage at each chain stage, and weight the stages with the world shares of wasted animal lives (Klaura): processing 20.0%, retail 20.6%, households & food service 26.7%. The same shares are used for every region.' },
    { id: 'P6', text: 'f is the wasted share of all animal lives: ≈ 22% for the world and Europe (≈ 18 bn ÷ ≈ 80 bn, a 2019 pair, applied to the 2024 count), and 1.4% / 5.3% / 11.3% for Germany (households only; whole chain, lower and upper bound). Only the household figure is sourced.' },
    { id: 'P7', text: 'Fish and other aquatic animals are not counted, and neither is the third lever — welfare standards for the animals that are still raised.' },
  ],
};
