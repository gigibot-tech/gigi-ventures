/* GiGi Ventures — concept.js
   Hero rewrite, word stagger, Gigolingo multi-language demo, ecosystem tree.
   No dependencies. All text is inserted with textContent. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const make = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ===================== 1. Hero: strike, then rewrite ===================== */
  (function hero() {
    const strike = $('[data-hero-strike]');
    const rewrite = $('[data-hero-rewrite]');
    const cycle = $('[data-hero-cycle]');
    const live = $('[data-hero-live]');
    if (!strike || !rewrite) return;

    const phrases = [
      'built to keep you.',
      'selling your data.',
      'selling your evenings.',
      'optimised for outrage.',
      'a slot machine with a feed.',
      'paid for with your attention.',
    ];
    let index = 0;

    const setWords = (text) => {
      rewrite.textContent = '';
      rewrite.appendChild(make('span', 'sr-only', 'rewritten as: '));
      const words = text.split(' ');
      words.forEach((word, i) => {
        const w = make('span', 'w', word);
        w.style.setProperty('--i', String(i));
        rewrite.appendChild(w);
        if (i < words.length - 1) rewrite.appendChild(document.createTextNode(' '));
      });
    };

    setWords(phrases[0]);
    if (reduceMotion) {
      strike.classList.add('is-struck');
      rewrite.classList.add('is-ready');
    } else {
      rewrite.classList.add('is-hidden', 'is-ready');
      setTimeout(() => strike.classList.add('is-struck'), 650);
      setTimeout(() => rewrite.classList.remove('is-hidden'), 1200);
    }

    if (cycle) {
      cycle.addEventListener('click', () => {
        index = (index + 1) % phrases.length;
        const next = phrases[index];
        if (live) live.textContent = `Big Tech is ${next}`;
        if (reduceMotion) {
          setWords(next);
          return;
        }
        rewrite.classList.add('is-hidden');
        setTimeout(() => {
          setWords(next);
          void rewrite.offsetWidth; // paint the hidden state before revealing
          rewrite.classList.remove('is-hidden');
        }, 320);
      });
    }
  })();

  /* ===================== 2. Words: stagger per column ===================== */
  $$('.word').forEach((card, i) => card.style.setProperty('--d', `${(i % 4) * 90}ms`));

  /* ===================== 3. Gigolingo: tap a word, in many languages ===================== */
  (function lyric() {
    const box = $('[data-lyric]');
    if (!box) return;
    const lineEl = $('[data-lyric-line]', box);
    const transEl = $('[data-lyric-trans]', box);
    const card = $('[data-wordcard]', box);
    const langBtns = $$('[data-lang]', box);

    // Original example lines (not song lyrics). Strings are plain text; objects are tappable words.
    const LINES = {
      ja: {
        tr: 'In the sunlight through the leaves, I was waiting for you.',
        parts: [
          { t: '木漏れ日', r: 'komorebi', m: 'sunlight filtering through the leaves', k: 'noun' }, 'の',
          { t: '中', r: 'naka', m: 'inside; in the middle of', k: 'noun' }, 'で ',
          { t: '君', r: 'kimi', m: 'you — familiar, and everywhere in songs', k: 'pronoun' }, 'を',
          { t: '待ってた', r: 'matteta', m: 'was waiting — casual past of 待つ (matsu)', k: 'verb' },
        ],
      },
      ko: {
        tr: 'I waited for you under the sunlight.',
        parts: [
          { t: '햇살', r: 'haetsal', m: 'sunlight, sunbeams', k: 'noun' }, ' ',
          { t: '아래서', r: 'araeseo', m: 'under, beneath', k: 'adverb' }, ' ',
          { t: '너를', r: 'neoreul', m: 'you (as the object)', k: 'pronoun + particle' }, ' ',
          { t: '기다렸어', r: 'gidaryeosseo', m: 'waited — casual past of 기다리다', k: 'verb' },
        ],
      },
      zh: {
        tr: 'In the sunlight between the leaves, I’m waiting for you.',
        parts: [
          '在', { t: '树叶', r: 'shùyè', m: 'leaves (of a tree)', k: 'noun' }, '间的',
          { t: '阳光', r: 'yángguāng', m: 'sunlight', k: 'noun' }, '里，我',
          { t: '等着', r: 'děngzhe', m: 'waiting — 等 with the ongoing 着', k: 'verb' },
          { t: '你', r: 'nǐ', m: 'you', k: 'pronoun' },
        ],
      },
      es: {
        tr: 'Under the light between the leaves, I was waiting for you.',
        parts: [
          'Bajo la ', { t: 'luz', m: 'light', k: 'noun, feminine' }, ' entre las ',
          { t: 'hojas', m: 'leaves', k: 'noun, feminine plural' }, ', ',
          { t: 'te', m: 'you (object pronoun)', k: 'pronoun' }, ' ',
          { t: 'esperaba', m: 'I was waiting — imperfect of esperar', k: 'verb' }, '.',
        ],
      },
      fr: {
        tr: 'Under the light of the leaves, I was waiting for you.',
        parts: [
          'Sous la ', { t: 'lumière', m: 'light', k: 'noun, feminine' }, ' des ',
          { t: 'feuilles', m: 'leaves', k: 'noun, feminine plural' }, ', je ',
          { t: 't’', m: 'you — te, shortened before a vowel', k: 'pronoun' },
          { t: 'attendais', m: 'was waiting — imperfect of attendre', k: 'verb' }, '.',
        ],
      },
      de: {
        tr: 'In the light between the leaves, I waited for you.',
        parts: [
          'Im ', { t: 'Licht', m: 'light', k: 'noun, neuter' }, ' zwischen den ',
          { t: 'Blättern', m: 'leaves — dative plural of Blatt', k: 'noun' }, ' hab ich auf ',
          { t: 'dich', m: 'you (accusative)', k: 'pronoun' }, ' ',
          { t: 'gewartet', m: 'waited — past participle of warten', k: 'verb' }, '.',
        ],
      },
      it: {
        tr: 'In the light between the leaves, I was waiting for you.',
        parts: [
          'Nella ', { t: 'luce', m: 'light', k: 'noun, feminine' }, ' tra le ',
          { t: 'foglie', m: 'leaves', k: 'noun, feminine plural' }, ' ',
          { t: 'ti', m: 'you (object pronoun)', k: 'pronoun' }, ' ',
          { t: 'aspettavo', m: 'I was waiting — imperfect of aspettare', k: 'verb' }, '.',
        ],
      },
      tr: {
        tr: 'In the light between the leaves, I waited for you.',
        parts: [
          { t: 'Yaprakların', m: 'of the leaves', k: 'noun + genitive' }, ' arasındaki ',
          { t: 'ışıkta', m: 'in the light', k: 'noun + locative' }, ' ',
          { t: 'seni', m: 'you (accusative)', k: 'pronoun' }, ' ',
          { t: 'bekledim', m: 'I waited — past of beklemek', k: 'verb' }, '.',
        ],
      },
    };

    const showWord = (word, lang, btn) => {
      $$('.tok', lineEl).forEach((t) => t.classList.toggle('is-current', t === btn));
      btn.setAttribute('aria-pressed', 'true');
      card.textContent = '';
      const top = make('div', 'wordcard__top');
      const term = make('span', 'wordcard__term', word.t);
      term.lang = lang;
      top.appendChild(term);
      if (word.r) top.appendChild(make('span', 'wordcard__reading', word.r));
      card.append(
        top,
        make('p', 'wordcard__meaning', word.m),
        make('p', 'wordcard__meta', `${word.k} · saved ✓ · first review tomorrow`),
      );
    };

    const render = (lang) => {
      const data = LINES[lang];
      if (!data) return;
      lineEl.textContent = '';
      lineEl.lang = lang;
      data.parts.forEach((part) => {
        if (typeof part === 'string') {
          lineEl.appendChild(document.createTextNode(part));
          return;
        }
        const btn = make('button', 'tok', part.t);
        btn.type = 'button';
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => showWord(part, lang, btn));
        lineEl.appendChild(btn);
      });
      transEl.textContent = `“${data.tr}”`;
      card.textContent = '';
      card.appendChild(make('p', 'wordcard__hint', 'Tap a highlighted word. Every word you save follows you into GiGi Social.'));
      langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    };

    langBtns.forEach((b) => b.addEventListener('click', () => render(b.dataset.lang)));
    render('ja');
  })();

  /* ===================== 4. Ecosystem tree ===================== */
  (function ecosystem() {
    const tree = $('[data-tree]');
    const panel = $('[data-eco-panel]');
    if (!tree || !panel) return;

    const DATA = {
      social: {
        name: 'GiGi Social', cat: 'Connect · one calm feed · in design', color: 'var(--p-social)',
        text: 'One calm feed for the people you chose. It ends, it explains itself — and the other leaves can share into it.',
        links: ['Gigolingo — the words you learn show up where you read', 'GiGi × 4some — a good conversation can become a plan', 'GiGi Food — the kitchen posts when it’s open'],
        href: '#social', cta: 'More below ↓',
      },
      lingo: {
        name: 'Gigolingo', cat: 'Learn · languages · first leaf', color: 'var(--p-lingo)',
        text: 'Learn languages through the songs, videos and articles you love — Japanese, Korean, Chinese, Spanish, French, German, Italian, Turkish and more.',
        links: ['GiGi Social — the words you’re learning show up where you read', 'GiGi AI — readings and voice practice on your device (concept)'],
        href: 'https://gigolingo.com', cta: 'gigolingo.com ↗', external: true,
      },
      some: {
        name: 'GiGi × 4some', cat: 'Meet · real-life meetups · uses AI', color: 'var(--p-some)',
        text: 'Small meetups, four people at a time. Social meetups happen through an AI: Gigi plans, people meet — and the only number that counts is whether the meetup happened.',
        links: ['GiGi Social — a good conversation can become a plan', 'GiGi AI — the planning is done by an AI, kept on your device (concept)'],
        href: 'https://0some.netlify.app', cta: 'Open the beta ↗', external: true,
      },
      ai: {
        name: 'GiGi AI', cat: 'On-device · multimodal · concept, to be shared', color: 'var(--p-ai)',
        text: 'One AI for the whole ecosystem: text, voice and images, understood on your phone — so your data doesn’t have to leave it to be useful.',
        links: ['Gigolingo — readings and pronunciation', 'GiGi × 4some — planning', 'iDO × GiGi — our AI partner, next door', 'GiGi × YHM — a health partner that could use it'],
        href: '#ai', cta: 'More below ↓',
      },
      ido: {
        name: 'iDO × GiGi', cat: 'AI · partner', color: 'var(--p-ido)',
        text: 'Never lose a startup idea again: capture it by voice, see its potential, follow a lean-startup path and find European funding.',
        links: ['GiGi Social — share progress with the people you chose', 'GiGi AI — side by side on the AI branch'],
        href: 'https://idoapp.eu', cta: 'idoapp.eu ↗', external: true,
      },
      yhm: {
        name: 'GiGi × YHM', cat: 'AI-ready · health matching · partner · live', color: 'var(--p-yhm)',
        text: 'YourHealthMatch helps international patients in Germany find a doctor who speaks their language and fits their insurance — and lets clinics open their own times. The match is the product; video is only a plugin.',
        links: ['GiGi AI — could add language help and ranking later (an idea, not a feature)', 'Gigolingo — both start from the language a person speaks'],
        href: 'https://yourhealthmatch.de/#join', cta: 'Join the live waitlist ↗', external: true,
      },
      food: {
        name: 'GiGi Food', cat: 'Food · real-world project · vegan', color: 'var(--p-food)',
        text: 'An idea that starts with a €500 grain cooker: basic meals as infrastructure — free where needed, self-financing by design, and every bowl is vegan.',
        links: ['GiGi Vegan — the facts behind the menu', 'GiGi Social — the kitchen posts when it’s open'],
        href: 'food.html', cta: 'Open GiGi Food →',
      },
      vegan: {
        name: 'GiGi Vegan', cat: 'Food · facts · our report · project', color: 'var(--p-vegan)',
        text: 'The facts we work from on meat, waste and animal lives — how we count them, and where we’d try to anchor.',
        links: ['GiGi Food — our kitchen is one place we’d act on these facts'],
        href: 'vegan.html', cta: 'Open report →',
      },
      next: {
        name: 'The next leaf', cat: 'Open · yours?', color: 'var(--text-3)',
        text: 'Building something that makes life better offline? Grow it with us. We bring the ecosystem, the principles and the people.',
        links: ['Shared roots: people first, explainable, private, interoperable'],
        href: 'mailto:contact@gigolingo.com?subject=Pitch%20a%20leaf%20to%20GiGi%20Ventures', cta: 'Pitch your leaf ↗',
      },
    };

    const leaves = $$('[data-leaf]', tree);
    const chips = $$('[data-leaf-chip]');
    const catEl = $('[data-eco-cat]', panel);
    const titleEl = $('[data-eco-title]', panel);
    const textEl = $('[data-eco-text]', panel);
    const listEl = $('[data-eco-list]', panel);
    const linkEl = $('[data-eco-link]', panel);
    let current = '';

    const select = (id) => {
      const d = DATA[id];
      if (!d || id === current) return;
      current = id;
      leaves.forEach((l) => l.classList.toggle('is-active', l.dataset.leaf === id));
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.leafChip === id)));
      $$('[data-link]', tree).forEach((p) => p.classList.toggle('is-on', p.dataset.link.split(' ').includes(id)));
      $$('[data-branch]', tree).forEach((b) => b.classList.toggle('is-on', b.dataset.branch.split(' ').includes(id)));
      panel.style.setProperty('--c', d.color);
      catEl.textContent = d.cat;
      titleEl.textContent = d.name;
      textEl.textContent = d.text;
      listEl.textContent = '';
      d.links.forEach((t) => listEl.appendChild(make('li', null, t)));
      linkEl.textContent = d.cta;
      linkEl.href = d.href;
      if (d.external) {
        linkEl.target = '_blank';
        linkEl.rel = 'noopener';
      } else {
        linkEl.removeAttribute('target');
        linkEl.removeAttribute('rel');
      }
    };

    leaves.forEach((leaf) => {
      const id = leaf.dataset.leaf;
      leaf.addEventListener('click', () => select(id));
      leaf.addEventListener('focus', () => select(id));
      leaf.addEventListener('mouseenter', () => select(id));
      leaf.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(id);
        }
      });
    });
    chips.forEach((chip) => chip.addEventListener('click', () => select(chip.dataset.leafChip)));
    select('social');

    // Gigolingo's leaf cycles through scripts: many languages, one leaf.
    const glyph = $('[data-glyph-cycle]', tree);
    if (glyph && !reduceMotion) {
      const scripts = ['あ', '한', '中', 'ñ', 'ü', 'ç', 'ş', 'A'];
      let g = 0;
      setInterval(() => {
        glyph.classList.add('is-swapping');
        setTimeout(() => {
          g = (g + 1) % scripts.length;
          glyph.textContent = scripts[g];
          glyph.classList.remove('is-swapping');
        }, 250);
      }, 1600);
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      tree.classList.add('is-grown');
    } else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tree.classList.add('is-grown');
          io.disconnect();
        }
      }, { threshold: 0.25 });
      io.observe(tree);
    }
  })();
})();
