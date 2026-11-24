/* GiGi Ventures — data/notes.js
   "When a number changes": the same thing shown with a different number — another year, model, scope or rounding.
   ONE list for both pages (vegan.html, levers.html). A number carries a Roman-numeral mark (≠iii) via `mark: 'iii'` in the data;
   each page lists only the notes whose marks it uses. at[].href is always page-qualified (vegan.html#…, levers.html#…).
   Add a note: give it the next numeral, say what changed, and link every version. */
window.GIGI_DATA = window.GIGI_DATA || {};
window.GIGI_DATA.notes = [
  {
    "id": "i",
    "topic": "Animal lives wasted, World",
    "text": "One Klaura 2019 figure, shown two ways: rounded to ≈ 18 bn in the two levers (and in the headline), exact — 17.97 bn — in the totals.",
    "at": [
      {
        "href": "levers.html#lv-world-lives-wasted",
        "value": "≈ 18 bn",
        "where": "Two levers",
        "scope": "World · 2019 · rounded"
      },
      {
        "href": "vegan.html#tot-wl-world",
        "value": "17.97 bn",
        "where": "A.1, meat lost",
        "scope": "World · 2019 · exact"
      }
    ]
  },
  {
    "id": "ii",
    "topic": "Shares of animal lives: 22% and 26.7%",
    "text": "≈ 22% is the wasted lives divided by the lives slaughtered (≈ 18 bn ÷ ≈ 80 bn — our ratio, see L2). 26.7% is the consumption stage’s part of the wasted lives themselves (Klaura). Different denominators: they do not compare.",
    "at": [
      {
        "href": "levers.html#lv-world-lives-wasted",
        "value": "≈ 22%",
        "where": "Two levers",
        "scope": "wasted ÷ slaughtered"
      },
      {
        "href": "vegan.html#waste-lives-world",
        "value": "26.7%",
        "where": "Waste, animal lives",
        "scope": "consumption stage ÷ wasted"
      }
    ]
  },
  {
    "id": "iii",
    "topic": "Edible meat wasted, World: 16% or 16.7%",
    "text": "The same 52.4 Mt. In the two levers it is divided by the 335 Mt of production (2019, research brief): 15.6%, shown as ≈ 16%. The totals say “about one sixth” (16.7%) — the headline fraction, not recomputed from 335 Mt.",
    "at": [
      {
        "href": "levers.html#lv-world-mass-edible",
        "value": "52.4 Mt · ≈ 16%",
        "where": "Two levers",
        "scope": "World · 2019 · ÷ 335 Mt"
      },
      {
        "href": "vegan.html#tot-wm-world",
        "value": "52.4 Mt · “about one sixth”",
        "where": "A.1, meat lost",
        "scope": "World · 2019 · “about one sixth”"
      }
    ]
  },
  {
    "id": "iv",
    "topic": "World meat: 335, 374 or ≈ 258 Mt",
    "text": "Three numbers for the world’s meat. 335 Mt is the meat produced in 2019, the year of the Klaura model (research brief); 374 Mt is the meat produced in 2024 (FAO) — both still contain what is lost and wasted. ≈ 258 Mt is what is left after it: 335 Mt minus the 77.4 Mt lost (Klaura), our own derivation, as on the levers page. Never put them in one ratio.",
    "at": [
      {
        "href": "levers.html#lv-world-mass-total",
        "value": "335 Mt",
        "where": "Two levers",
        "scope": "World · 2019 · research brief"
      },
      {
        "href": "vegan.html#tot-m-world",
        "value": "335 Mt",
        "where": "A, total meat",
        "scope": "World · 2019 · produced"
      },
      {
        "href": "vegan.html#tot-c-world-ref",
        "value": "374 Mt",
        "where": "A, total meat · other year",
        "scope": "World · 2024 · FAO · produced"
      },
      {
        "href": "vegan.html#tot-c-world",
        "value": "≈ 258 Mt",
        "where": "A.2, meat consumed",
        "scope": "World · 2019 · derived"
      }
    ]
  },
  {
    "id": "v",
    "topic": "Europe is three scopes",
    "text": "Europe-43 · 2019 (Klaura: animal lives, ≈ 12.5 bn in all, 2.76 bn wasted). EU-28 · 2011 (JRC: 14.2 of 61.7 Mt of meat). EU-27 · 2022 (Eurostat: 57.5 Mt of all food wasted). EU-27 · 2022–24 (EU outlook: 66.6 kg of meat per person). 61.7 Mt and 57.5 Mt look alike and measure different things.",
    "at": [
      {
        "href": "levers.html#lv-europe-mass-total",
        "value": "61.7 Mt",
        "where": "Two levers",
        "scope": "EU-28 · 2011 · JRC · meat"
      },
      {
        "href": "levers.html#lv-europe-lives-total",
        "value": "≈ 12.5 bn",
        "where": "Two levers",
        "scope": "Europe-43 · 2019 · Klaura · animals"
      },
      {
        "href": "vegan.html#tot-wl-europe",
        "value": "2.76 bn",
        "where": "A.1, meat lost",
        "scope": "Europe-43 · 2019 · Klaura · animals"
      },
      {
        "href": "vegan.html#tot-wm-europe",
        "value": "14.2 Mt",
        "where": "A.1, meat lost",
        "scope": "EU-28 · 2011 · JRC · meat"
      },
      {
        "href": "vegan.html#tot-w-europe",
        "value": "57.5 Mt",
        "where": "A.1, all food waste",
        "scope": "EU-27 · 2022 · Eurostat · all food"
      },
      {
        "href": "vegan.html#tot-pp-europe",
        "value": "66.6 kg",
        "where": "A.2, meat per person",
        "scope": "EU-27 · 2022–24 · EU outlook"
      }
    ]
  },
  {
    "id": "vi",
    "topic": "Germany, animal lives wasted: 10.5 m or 39–85 m",
    "text": "Households only: 10.5 m (Meat Atlas 2021, an advocacy source). Whole chain, households included: ≥ 39.3 m, ≈ 51.7 m or ≈ 84.5 m (our scenarios A, B, C). The two levers show the rest of the chain without the households: 39.3 − 10.5 ≈ 29 m up to 84.5 − 10.5 ≈ 74 m. The projection page turns the same numbers into slices of Germany’s 746 m animals: 1.4% (households), 5.3% and 11.3% (whole chain).",
    "at": [
      {
        "href": "levers.html#lv-germany-lives-hh",
        "value": "10.5 m",
        "where": "Two levers",
        "scope": "households only · Meat Atlas 2021"
      },
      {
        "href": "levers.html#lv-germany-lives-rest",
        "value": "≈ 29–74 m",
        "where": "Two levers",
        "scope": "rest of the chain · our scenarios"
      },
      {
        "href": "vegan.html#tot-wl-germany",
        "value": "10.5 m",
        "where": "A.1, meat lost",
        "scope": "households only · Meat Atlas 2021"
      },
      {
        "href": "vegan.html#waste-lives-germany",
        "value": "≥ 39.3 m … ≈ 84.5 m",
        "where": "Waste, animal lives",
        "scope": "whole chain · our scenarios"
      },
      {
        "href": "vegan.html#paths",
        "value": "A · B · C",
        "where": "Germany, two paths",
        "scope": "how each scenario is built"
      },
      {
        "href": "levers.html#base-germany",
        "value": "1.4% · 5.3% · 11.3%",
        "where": "Projection",
        "scope": "Germany · three slices of 746 m"
      }
    ]
  },
  {
    "id": "vii",
    "topic": "Germany, household meat waste: 74.6 kt or ≈ 125 kt",
    "text": "The same 4% share on two bases. 74.6 kt is 4% of the 1.87 Mt of avoidable household waste in the GfK 2020 diary study; ≈ 125 kt is 4% of ≈ 3.1 Mt, half of the official 2022 household total (Thünen). We quote the range, 75–125 kt.",
    "at": [
      {
        "href": "levers.html#lv-germany-mass-hh",
        "value": "74.6 kt",
        "where": "Two levers",
        "scope": "Germany · GfK 2020 base"
      },
      {
        "href": "vegan.html#tot-wm-germany",
        "value": "74.6 kt · ≈ 125 kt",
        "where": "A.1, meat lost",
        "scope": "Germany · both bases"
      }
    ]
  },
  {
    "id": "viii",
    "topic": "Animals slaughtered: several counts",
    "text": "Germany: 631 m chickens in 2022 (Eurostat); 697.3 m chickens, turkeys and ducks in 2025 and 746 m land animals of all species in 2025 (Destatis; the sum is ours). EU: 6.16 bn chickens in 2022 (Eurostat, reporting countries) against ≈ 6.4 bn poultry in 2020 (research brief). Different year, species and countries.",
    "at": [
      {
        "href": "levers.html#lv-germany-lives-total",
        "value": "746 m",
        "where": "Two levers",
        "scope": "Germany · 2025 · all land animals"
      },
      {
        "href": "vegan.html#waste-lives-germany",
        "value": "631 m",
        "where": "Waste, animal lives",
        "scope": "Germany · 2022 · chickens"
      },
      {
        "href": "levers.html#lv-europe-lives-total",
        "value": "≈ 6.4 bn",
        "where": "Two levers",
        "scope": "EU-27 · 2020 · poultry"
      },
      {
        "href": "vegan.html#eu-chickens",
        "value": "6.16 bn",
        "where": "Waste, Europe by country",
        "scope": "EU · 2022 · chickens"
      }
    ]
  },
  {
    "id": "ix",
    "topic": "World animals slaughtered: ≈ 80 bn or 86.3 bn",
    "text": "≈ 80 bn is a rounded figure for 2019, the year of the Klaura model; the FAO series reached 86.3 bn in 2024. The projection page starts from 86.3 bn. The 22% waste share is built on the 2019 pair.",
    "at": [
      {
        "href": "levers.html#lv-world-lives-total",
        "value": "≈ 80 bn",
        "where": "Two levers",
        "scope": "World · 2019 · rounded"
      },
      {
        "href": "levers.html#base-world",
        "value": "86.3 bn",
        "where": "Projection",
        "scope": "World · 2024 · FAO"
      }
    ]
  },
  {
    "id": "x",
    "topic": "Europe meat: 37.5, 47.5 or 61.7 Mt",
    "text": "Three Europe meat numbers that look alike. 61.7 Mt is the meat available in the EU-28 in 2011, incl. inedible parts (JRC); 47.5 Mt of it is consumed and 14.2 Mt wasted. 37.5 Mt is the meat consumed in the EU-27 in 2022–24, in carcass weight (EU outlook). Another year, another country group, another model — never put them in one ratio.",
    "at": [
      {
        "href": "vegan.html#tot-m-europe",
        "value": "61.7 Mt",
        "where": "A, total meat",
        "scope": "EU-28 · 2011 · JRC · available"
      },
      {
        "href": "vegan.html#tot-c-europe-ref",
        "value": "37.5 Mt",
        "where": "A, total meat · other year and model",
        "scope": "EU-27 · 2022–24 · EU outlook · consumed"
      },
      {
        "href": "vegan.html#tot-c-europe",
        "value": "47.5 Mt",
        "where": "A.2, meat consumed",
        "scope": "EU-28 · 2011 · JRC · derived"
      }
    ]
  },
  {
    "id": "xi",
    "topic": "Food waste: three scopes in one row",
    "text": "The world figure (UNEP, 2022) counts retail, food service and households only; the EU-27 and Germany figures (Eurostat, 2022) also count farm and processing. They read like one series, but the zoom only shows where to look — it is not a share.",
    "at": [
      {
        "href": "vegan.html#tot-w-world",
        "value": "1.05 bn t",
        "where": "A.1, all food waste",
        "scope": "World · 2022 · UNEP · retail to households"
      },
      {
        "href": "vegan.html#tot-w-europe",
        "value": "57.5 Mt",
        "where": "A.1, all food waste",
        "scope": "EU-27 · 2022 · Eurostat · farm to households"
      },
      {
        "href": "vegan.html#tot-w-germany",
        "value": "10.8 Mt",
        "where": "A.1, all food waste",
        "scope": "Germany · 2022 · Eurostat · farm to households"
      }
    ]
  },
  {
    "id": "xii",
    "topic": "ProVeg’s goal in two wordings",
    "text": "Until about 2021 the aim was to halve global consumption of animals by 2040; the June 2024 press release speaks of replacing half of all animal products with plant-based and cultivated foods by 2040. Same 50% and the same year — the first counts animals eaten, the second products replaced.",
    "at": [
      {
        "href": "levers.html#src-proveg",
        "value": "products, 2024",
        "where": "Sources",
        "scope": "ProVeg press release"
      },
      {
        "href": "levers.html#src-provegold",
        "value": "animals eaten, earlier",
        "where": "Sources",
        "scope": "vegconomist interview"
      }
    ]
  },
  {
    "id": "xiii",
    "topic": "Waste goals are for all food, our lever counts animals",
    "text": "SDG 12.3 and the EU law set percentages for food waste in tonnes, all foods. We read them as meat by assuming the same percentage at every chain stage (P5), weighted with the world shares of wasted animal lives per stage: processing 20.0%, retail 20.6%, households & food service 26.7%. That turns “halve retail and consumer waste” into ≈ 24% of the wasted lives, and the EU law into ≈ 16%.",
    "at": [
      {
        "href": "levers.html#goal-sdg",
        "value": "≈ 24%",
        "where": "Goals",
        "scope": "SDG 12.3 · of the wasted lives"
      },
      {
        "href": "levers.html#goal-eu",
        "value": "≈ 16%",
        "where": "Goals",
        "scope": "EU 2030 law · of the wasted lives"
      }
    ]
  },
  {
    "id": "xiv",
    "topic": "Food available to consumers: ≈ 5.5 bn t, derived",
    "text": "UNEP says the 1.05 bn t of food wasted in 2022 is 19% of the food available to consumers (retail, food service, households). Dividing the two gives ≈ 5.5 bn t — our derived total, not a UNEP figure; the 19% is rounded, so it could be 5.4–5.7 bn t. UNEP’s 2021 report gives the same order: 931 Mt = 17% (2019). The ≈ 4.5 bn t consumed is that total minus the waste, 81% of it. Inside this one model, waste and consumption add up; Eurostat has no such total for Europe or Germany.",
    "at": [
      {
        "href": "vegan.html#tot-food-world",
        "value": "≈ 5.5 bn t",
        "where": "A, total food",
        "scope": "World · 2022 · derived: 1.05 bn t ÷ 19%"
      },
      {
        "href": "vegan.html#tot-c-world-food",
        "value": "≈ 4.5 bn t",
        "where": "A.2, food consumed",
        "scope": "World · 2022 · derived: total − waste"
      }
    ]
  },
  {
    "id": "xv",
    "topic": "Food available in Europe and Germany: estimates",
    "text": "Nobody publishes these totals. We take the world’s 19% (UNEP: waste ÷ food available to consumers) and apply it to the retail-to-households part of the Eurostat waste: Europe 41.6 Mt (4.6 retail + 6.5 food service + 30.5 households) ÷ 0.19 ≈ 219 Mt, of which ≈ 177 Mt consumed; Germany 9.04 Mt (0.77 + 1.98 + 6.29) ÷ 0.19 ≈ 47.6 Mt, of which ≈ 38.6 Mt consumed. It is an assumption, not a measurement — and it breaks our rule of never dividing tonnes by a percentage of another model, so it is drawn in lighter, dashed shades and labelled Estimate.",
    "at": [
      {
        "href": "vegan.html#tot-food-europe",
        "value": "≈ 219 Mt",
        "where": "A, total food",
        "scope": "EU-27 · 2022 · estimate: 41.6 Mt ÷ 0.19"
      },
      {
        "href": "vegan.html#tot-food-germany",
        "value": "≈ 47.6 Mt",
        "where": "A, total food",
        "scope": "Germany · 2022 · estimate: 9.04 Mt ÷ 0.19"
      }
    ]
  },
  {
    "id": "xvi",
    "topic": "Germany’s meat: 4.6 Mt, ≈ 1.06 Mt or ≈ 3.54 Mt",
    "text": "4.6 Mt is the meat Germany consumes per the supply balance (BZL 2025) — calculated, with waste still inside. Only the households’ waste is measured (74.6 kt). For the whole chain we apply the EU-28 share of wasted meat (JRC, 2011: 14.2 of 61.7 Mt, 23%): ≈ 1.06 Mt wasted and ≈ 3.54 Mt consumed. An assumption, not a measurement — drawn in lighter, dashed shades and labelled Estimate.",
    "at": [
      {
        "href": "vegan.html#tot-m-germany",
        "value": "4.6 Mt",
        "where": "A, total meat",
        "scope": "Germany · 2025 · calculated · waste inside"
      },
      {
        "href": "vegan.html#tot-wm-germany-est",
        "value": "≈ 1.06 Mt",
        "where": "A.1, meat wasted",
        "scope": "estimate: 23% of 4.6 Mt"
      },
      {
        "href": "vegan.html#tot-c-germany",
        "value": "≈ 3.54 Mt",
        "where": "A.2, meat consumed",
        "scope": "estimate: 4.6 Mt minus the waste"
      }
    ]
  }
];
