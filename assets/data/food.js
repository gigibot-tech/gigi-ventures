/* GiGi Ventures — data/food.js
   Numbers and rules for the GiGi Food "at a glance" strip. Edit here; the page re-renders.
   All figures come from the Berlin feasibility brief (November 2026); the gates are OUR planning
   rules, not measurements, and are labelled that way on the page.
   src keys → numbered footnotes that link to #src-<key> in the page's "Sources & method" list. */

window.GIGI_DATA = window.GIGI_DATA || {};

window.GIGI_DATA.food = {
  ui: {
    source: 'Source',
    sources: 'Sources',
    gatesTitle: 'The decision: when do we climb a rung?',
    gatesLead: 'These are our own rules, not measurements. Every rung must remove a bottleneck we have actually measured.',
  },

  sources: {
    brief: {
      short: 'Feasibility brief',
      label: 'Feeding Berlin self-sufficiently — feasibility brief, November 2026',
    },
  },

  kpis: [
    {
      value: '€300–800',
      label: 'first kit: grain cooker, hot-hold, hand truck',
      note: 'Rung 1 — best cost per impact. Pays for itself in days, not years.',
      src: 'brief',
    },
    {
      value: '160',
      label: 'vegan bowls a day with one server',
      note: 'Serving, not cooking, is the limit. More volume needs more servers.',
      src: 'brief',
    },
    {
      value: '+€0.11',
      label: 'net margin per lentil bowl, volunteer labour',
      note: '≈ €18 a day at 160 portions. Paid labour (~€0.70 a bowl) would erase it.',
      src: 'brief',
    },
    {
      value: '€1.98',
      label: 'what each paying guest must average when 60% eat free',
      note: '€0.79 real cost ÷ 40% paying. At 70% free it is €2.63. Try the calculator below.',
      src: 'brief',
    },
  ],

  stages: [
    {
      type: 'now',
      tag: 'Now',
      title: 'Rung 1 — basic equipment',
      lead: 'Where we start',
      points: ['Commercial grain cooker with auto hot-hold', 'Insulated container and a hand truck', 'Pay what you can, plus one €5 paying line'],
      result: ['€300–800', '160–1,000 meals a day'],
    },
    {
      type: 'gate',
      tag: 'Our gate',
      title: 'Rung 2 — central kitchen + van',
      lead: 'Climb only if ALL are true',
      points: [
        '≥ 500 meals a day sold out for 4+ weeks',
        'A committed paying channel covers ≥ 50% of free-meal cost',
      ],
      result: ['€3,000–30,000', '1,000–3,000 meals a day'],
    },
    {
      type: 'gate',
      tag: 'Our gate',
      title: 'Rung 3 — cooking robot',
      lead: 'Consider only if ALL are true',
      points: [
        '≥ 1,000 meals a day',
        'Guaranteed paid throughput',
        'Labour — not serving — is the wall',
      ],
      result: ['€100,000–250,000', '800–2,000 meals a day'],
    },
  ],

  stop: {
    title: 'Stop or pivot',
    text: 'If the subsidy per free meal exceeds committed funding for two months in a row, we pause and rethink — we do not climb.',
    src: 'brief',
  },
};
