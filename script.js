/* ========================
   LUMIÈRE SKINCARE — QUIZ
   Supabase + Auswertungslogik
   ======================== */

const SUPABASE_URL = 'https://ogxlglwqncycybdbzwdt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9neGxnbHdxbmN5Y3liZGJ6d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTcyMTAsImV4cCI6MjA5ODEzMzIxMH0.wnFssJfylx630tuLXpmZytZkkzY6hiG6BgzxpE8OtCE';

/* ========================
   ICONS
   ======================== */

const TYPE_ICONS = {
  normal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.5 3-4 5.2-4 9a4 4 0 0 0 8 0c0-3.8-2.5-6-4-9z"/></svg>',
  oily: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s6 7.5 6 12a6 6 0 0 1-12 0c0-4.5 6-12 6-12z"/></svg>',
  dry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
  combination: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/></svg>',
  sensitive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.35-9-8.5C1.5 8 3 5 6 5c2 0 4 1.5 6 4.5C14 6.5 16 5 18 5c3 0 4.5 3 3 6.5-2 4.15-9 8.5-9 8.5z"/></svg>'
};

function dominantType(scores) {
  let best = null, bestVal = -Infinity;
  for (const key in scores) {
    if (scores[key] > bestVal) { bestVal = scores[key]; best = key; }
  }
  return best;
}

const ICON_DAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4"/></svg>';
const ICON_MORNING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18M5 18a7 7 0 0 1 14 0"/><path d="M12 6V3M6.5 9 5 7.5M17.5 9 19 7.5"/></svg>';
const ICON_PRODUCT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.5L14 8V2"/></svg>';
const ICON_MAGNIFY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="6"/><path d="M20 20l-5.5-5.5"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
const ICON_DROP = TYPE_ICONS.oily;

/* ========================
   FRAGEN
   ======================== */

const questions = [
  {
    icon: ICON_DAY,
    why: 'So bekommen wir ein Gefühl für deinen natürlichen Hautzustand – unabhängig von Pflege oder Make-up.',
    text: 'Wie fühlt sich deine Haut im Laufe des Tages an – ohne Pflege oder Make-up?',
    options: [
      { label: 'Sie fühlt sich angenehm an – weder fettig noch trocken, kein Nachhelfen nötig.', scores: { normal: 3 } },
      { label: 'Gegen Mittag glänzt die T-Zone deutlich, ich greife regelmäßig zum Blotting Paper.', scores: { oily: 3, combination: 1 } },
      { label: 'Sie spannt schnell, wirkt matt und neigt zu Schuppung.', scores: { dry: 3 } },
      { label: 'Die Wangen bleiben angenehm, die T-Zone glänzt merklich.', scores: { combination: 3 } },
      { label: 'Sie reagiert oft mit Rötungen oder Brennen – auf Temperatur, Produkte oder Stress.', scores: { sensitive: 3 } }
    ]
  },
  {
    icon: ICON_MORNING,
    why: 'Der Zustand direkt nach dem Aufwachen zeigt, wie deine Haut sich über Nacht selbst reguliert – ein starker Hinweis auf deinen Grundtyp.',
    text: 'Was bemerkst du morgens an deiner Haut, bevor du sie reinigst?',
    options: [
      { label: 'Nichts Auffälliges – sie sieht aus wie am Vorabend.', scores: { normal: 3 } },
      { label: 'Sie ist deutlich ölig, die Poren wirken sichtbar vergrößert.', scores: { oily: 3 } },
      { label: 'Sie fühlt sich eng an, manchmal sehe ich feine Schüppchen oder Spannungslinien.', scores: { dry: 3 } },
      { label: 'T-Zone glänzt, Wangen fühlen sich eher normal bis leicht trocken an.', scores: { combination: 3 } },
      { label: 'Ich bemerke Rötungen oder Reizungen, ohne einen offensichtlichen Grund dafür.', scores: { sensitive: 3 } }
    ]
  },
  {
    icon: ICON_PRODUCT,
    why: 'Die Reaktion auf neue Produkte verrät viel über deine Hautbarriere und mögliche Empfindlichkeiten.',
    text: 'Wie reagiert deine Haut auf neue Pflegeprodukte?',
    options: [
      { label: 'Meist problemlos – ich kann vieles bedenkenlos ausprobieren.', scores: { normal: 3 } },
      { label: 'Sie wird schnell ölig oder bekommt Unreinheiten, besonders bei schweren Texturen.', scores: { oily: 3, combination: 1 } },
      { label: 'Sie reagiert oft mit Brennen, Rötung oder Jucken – sogar bei milden Produkten.', scores: { sensitive: 3 } },
      { label: 'Reichhaltige Cremes überfordern die T-Zone, während die Wangen trockene Pflege brauchen.', scores: { combination: 3 } },
      { label: 'Ohne intensive Feuchtigkeitspflege fühlt sie sich nach kurzer Zeit rau und straff an.', scores: { dry: 3 } }
    ]
  },
  {
    icon: ICON_MAGNIFY,
    why: 'Porengröße und -sichtbarkeit hängen eng mit der Talgproduktion zusammen und helfen uns bei der Einordnung.',
    text: 'Wie sehen deine Poren im Spiegel aus?',
    options: [
      { label: 'Kaum sichtbar – die Haut wirkt glatt und ebenmäßig.', scores: { normal: 2, dry: 1 } },
      { label: 'Deutlich erkennbar, vor allem auf Nase und Stirn, häufig verstopft.', scores: { oily: 3 } },
      { label: 'In der T-Zone größer, auf den Wangen kaum sichtbar.', scores: { combination: 3 } },
      { label: 'Sehr fein, fast unsichtbar – aber die Haut wirkt manchmal matt oder rau.', scores: { dry: 3 } },
      { label: 'Unauffällig, aber oft von Rötungen oder gereizten Stellen begleitet.', scores: { sensitive: 3 } }
    ]
  },
  {
    icon: ICON_MOON,
    why: 'Äußere und innere Stressfaktoren wirken sich je nach Hauttyp ganz unterschiedlich aus.',
    text: 'Was passiert mit deiner Haut bei Stress, Schlafmangel oder ungesunder Ernährung?',
    options: [
      { label: 'Sie bleibt relativ stabil – äußere Faktoren beeinflussen sie kaum.', scores: { normal: 3 } },
      { label: 'Pickel und Unreinheiten kommen sofort, wenn ich nicht auf mich achte.', scores: { oily: 3, combination: 1 } },
      { label: 'Sie wird noch trockener und fahler, das Spannungsgefühl nimmt zu.', scores: { dry: 3 } },
      { label: 'Die T-Zone wird schnell ölig, die Wangen bleiben aber trocken oder normal.', scores: { combination: 3 } },
      { label: 'Sie rötet sich leichter und reagiert empfindlicher auf Umwelteinflüsse.', scores: { sensitive: 3 } }
    ]
  },
  {
    icon: ICON_DROP,
    why: 'Dein Feuchtigkeitsbedürfnis zeigt, wie gut deine Hautbarriere von Natur aus Wasser halten kann.',
    text: 'Wie oft brauchst du Feuchtigkeitspflege, damit du dich wohlfühlst?',
    options: [
      { label: 'Einmal täglich reicht – mehr brauche ich nicht.', scores: { normal: 3 } },
      { label: 'Kaum – meine Haut produziert selbst genug, zu viel Creme macht es schlimmer.', scores: { oily: 3 } },
      { label: 'Morgens, abends und zwischendurch – ohne Pflege spannt alles sofort.', scores: { dry: 3 } },
      { label: 'Leichte Creme auf den Wangen, auf der T-Zone lieber wenig bis nichts.', scores: { combination: 3 } },
      { label: 'Regelmäßig, aber nur mit Produkten ohne Duftstoffe oder Alkohol – sonst schlägt sie sofort an.', scores: { sensitive: 3 } }
    ]
  }
];

/* ========================
   ERGEBNISSE
   ======================== */

const results = {
  normal: {
    title: 'Normale Haut',
    desc: 'Du hast das große Los gezogen: Deine Haut ist ausgeglichen, weder zu fettig noch zu trocken. Sie reagiert kaum auf äußere Einflüsse und verträgt die meisten Produkte gut. Deine Routine darf sich auf Pflege, Schutz und Prävention konzentrieren.',
    routineMorning: 'Sanfte Reinigung → Antioxidatives Serum → Leichte Feuchtigkeitspflege → SPF 30',
    routineEvening: 'Doppelreinigung → Aufbauendes Serum → Feuchtigkeitscreme',
    products: [
      { img: 'assets/product-1.jpg', name: 'Mild Balance Cleanser', claim: 'Sanfte tägliche Reinigung ohne Austrocknung', price: '24,90 €' },
      { img: 'assets/product-2.jpg', name: 'Glow Protect Fluid SPF 30', claim: 'Leichter Schutz mit Vitamin C', price: '34,50 €' },
      { img: 'assets/product-3.jpg', name: 'Radiance Moisturizer', claim: 'Ausgewogene Pflege für den ganzen Tag', price: '29,00 €' }
    ]
  },
  oily: {
    title: 'Ölige Haut',
    desc: 'Deine Talgdrüsen arbeiten auf Hochtouren. Das führt zu sichtbarem Glanz, vergrößerten Poren und gelegentlichen Unreinheiten – besonders in der T-Zone. Mit den richtigen leichten, nicht komedogenen Produkten lässt sich das gut ausbalancieren.',
    routineMorning: 'Reinigungsgel → Toner mit Niacinamid → Ölfreies Serum → Mattierender SPF',
    routineEvening: 'Reinigungsgel → BHA-Exfoliant (2–3×/Woche) → Leichtes Gel-Moisturizer',
    products: [
      { img: 'assets/product-1.jpg', name: 'Pore Control Gel Cleanser', claim: 'Reinigt tief ohne Austrocknung', price: '22,90 €' },
      { img: 'assets/product-3.jpg', name: 'Niacinamide 10% Clear Serum', claim: 'Verfeinert Poren, reguliert Sebum', price: '38,00 €' },
      { img: 'assets/product-2.jpg', name: 'Oil-Free SPF 30 Fluid', claim: 'Mattierend, kein Weißeln', price: '31,50 €' }
    ]
  },
  dry: {
    title: 'Trockene Haut',
    desc: 'Deiner Haut fehlt es an Feuchtigkeit und Lipiden. Sie fühlt sich schnell gespannt an, neigt zu Schuppung und feinen Linien. Intensive Pflege mit Hyaluronsäure, Ceramiden und reichhaltigen Texturen ist dein Schlüssel zu einem strahlenden Teint.',
    routineMorning: 'Sanfte Cremige Reinigung → Feuchtigkeitsserum → Intensive Tagescreme → SPF',
    routineEvening: 'Cremige Reinigung → Hyaluron-Serum → Reichhaltige Nachtcreme → gelegentlich Gesichtsöl',
    products: [
      { img: 'assets/product-1.jpg', name: 'Hydra Intense Cream Cleanser', claim: 'Reinigt sanft, stiehlt keine Feuchtigkeit', price: '26,00 €' },
      { img: 'assets/product-3.jpg', name: 'Hyaluron Plump Serum', claim: '3-fach Hyaluronsäure, 72h Feuchtigkeit', price: '42,00 €' },
      { img: 'assets/product-2.jpg', name: 'Barrier Repair Creme', claim: 'Ceramide + Sheabutter für intensive Pflege', price: '36,50 €' }
    ]
  },
  combination: {
    title: 'Mischhaut',
    desc: 'Deine T-Zone (Stirn, Nase, Kinn) glänzt, während die Wangen eher normal bis leicht trocken sind. Das macht die Pflege etwas kniffliger – aber mit der richtigen Balance-Routine findest du deinen Sweet Spot.',
    routineMorning: 'Balancierendes Gel → Leichtes Serum → Zonenpflege: Mattierung T-Zone / Hydration Wangen → SPF',
    routineEvening: 'Sanfte Reinigung → Ausgleichendes Toner → Leichte Pflege überall, reichhaltig nur auf Wangen',
    products: [
      { img: 'assets/product-1.jpg', name: 'Zone Balance Fluid', claim: 'Mattiert und hydratisiert gleichzeitig', price: '32,50 €' },
      { img: 'assets/product-3.jpg', name: 'Niacinamide + Hyaluron Duo Serum', claim: 'Ideal für unterschiedliche Hauthälften', price: '39,00 €' },
      { img: 'assets/product-2.jpg', name: 'Gentle Purifying Clay Mask', claim: 'Einmal pro Woche für die T-Zone', price: '24,00 €' }
    ]
  },
  sensitive: {
    title: 'Sensible Haut',
    desc: 'Deine Haut reagiert schnell auf neue Produkte, Temperaturschwankungen, Stress oder Duftstoffe. Weniger ist hier oft mehr: Eine schlanke Routine mit milden, hypoallergenen Inhaltsstoffen schützt deine Hautbarriere und beruhigt Rötungen nachhaltig.',
    routineMorning: 'Duftstofffreie Mizellenreinigung → Beruhigendes Serum → Rückfettende Creme → Mineralischer SPF',
    routineEvening: 'Sanfte Ölreinigung → Centella-Serum → Barrier-Repair-Creme',
    products: [
      { img: 'assets/product-1.jpg', name: 'Calm & Care Sensitive Cleanser', claim: 'pH-neutral, duftstofffrei, keine Reizung', price: '28,00 €' },
      { img: 'assets/product-3.jpg', name: 'Centella Barrier Serum', claim: 'Panthenol + Ceramide, klinisch getestet', price: '44,00 €' },
      { img: 'assets/product-2.jpg', name: 'Sensitive Shield SPF 30', claim: 'Mineralischer Schutz, kein Weißeln', price: '33,00 €' }
    ]
  }
};

/* ========================
   STATE
   ======================== */

const state = {
  current: 0,
  answers: [],       // Antwort-Index je Frage
  answerLabels: [],  // Lesbare Antwort-Texte
  result: null,
  email: ''
};

/* ========================
   QUIZ STARTEN
   ======================== */

function startQuiz() {
  document.getElementById('hero').classList.add('hidden');
  document.getElementById('quiz-section').classList.remove('hidden');
  renderQuestion();
}

/* ========================
   FRAGE RENDERN
   ======================== */

function renderQuestion() {
  const q = questions[state.current];
  const total = questions.length;
  const pct = Math.round((state.current / total) * 100);

  document.getElementById('progress-label').textContent = `Frage ${state.current + 1} von ${total}`;
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-fill').style.width = pct + '%';

  document.getElementById('q-icon').innerHTML = q.icon;
  document.getElementById('q-number').textContent = String(state.current + 1).padStart(2, '0');
  document.getElementById('q-text').textContent = q.text;

  document.getElementById('q-why-text').textContent = q.why;
  document.getElementById('q-why-text').classList.add('hidden');
  document.getElementById('q-why-toggle').textContent = 'Warum fragen wir das?';
  document.getElementById('q-why-toggle').setAttribute('aria-expanded', 'false');

  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (state.answers[state.current] === i ? ' selected' : '');
    const iconSvg = TYPE_ICONS[dominantType(opt.scores)] || '';
    btn.innerHTML = `<span class="option-icon">${iconSvg}</span><span class="option-label">${opt.label}</span>`;
    btn.onclick = () => selectOption(i, opt.label, btn);
    optionsEl.appendChild(btn);
  });

  document.getElementById('btn-next').disabled = state.answers[state.current] == null;
  document.getElementById('btn-back').style.visibility = state.current === 0 ? 'hidden' : 'visible';

  const card = document.getElementById('question-card');
  card.classList.remove('fade');
  void card.offsetWidth;
  card.classList.add('fade');
}

function toggleWhy() {
  const textEl = document.getElementById('q-why-text');
  const btnEl = document.getElementById('q-why-toggle');
  const isHidden = textEl.classList.toggle('hidden');
  btnEl.textContent = isHidden ? 'Warum fragen wir das?' : 'Ausblenden';
  btnEl.setAttribute('aria-expanded', String(!isHidden));
}

function selectOption(index, label, btnEl) {
  state.answers[state.current] = index;
  state.answerLabels[state.current] = label;
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });
  document.getElementById('btn-next').disabled = false;

  if (btnEl) {
    btnEl.classList.remove('pulse');
    void btnEl.offsetWidth;
    btnEl.classList.add('pulse');
  }
}

function goNext() {
  if (state.answers[state.current] == null) return;
  if (state.current < questions.length - 1) {
    state.current++;
    renderQuestion();
  } else {
    showResult();
  }
}

function goBack() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
}

/* ========================
   EMAIL OPT-IN (im Result)
   ======================== */

function checkEmail() {
  const val = document.getElementById('email-input').value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  state.email = valid ? val : '';
  document.getElementById('btn-email-submit').disabled = !valid;
  document.getElementById('email-hint').textContent = val && !valid ? 'Bitte eine gültige E-Mail-Adresse eingeben.' : '';
}

async function submitEmail() {
  if (!state.email) return;
  const btn = document.getElementById('btn-email-submit');
  btn.disabled = true;
  btn.textContent = 'Wird gesendet …';
  await saveToSupabase();
  document.getElementById('email-input').disabled = true;
  btn.textContent = 'Senden';
}

/* ========================
   ERGEBNIS BERECHNEN
   ======================== */

function calcResult() {
  const totals = { normal: 0, oily: 0, dry: 0, combination: 0, sensitive: 0 };
  state.answers.forEach((ansIdx, qIdx) => {
    const scores = questions[qIdx].options[ansIdx].scores;
    Object.keys(scores).forEach(k => { totals[k] += scores[k]; });
  });
  const max = Math.max(...Object.values(totals));
  // Bei einem Gleichstand nicht immer denselben Typ bevorzugen,
  // sondern fair unter den führenden Typen auslosen.
  const topTypes = Object.keys(totals).filter(k => totals[k] === max);
  return topTypes[Math.floor(Math.random() * topTypes.length)];
}

/* ========================
   ERGEBNIS ANZEIGEN
   ======================== */

function showResult() {
  const winner = calcResult();
  state.result = winner;
  const r = results[winner];

  document.getElementById('quiz-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');

  const resultTop = document.getElementById('result-top');
  resultTop.className = 'result-top type-' + winner;

  document.getElementById('result-type').textContent = r.title;
  document.getElementById('result-desc').textContent = r.desc;
  document.getElementById('routine-morning').textContent = r.routineMorning;
  document.getElementById('routine-evening').textContent = r.routineEvening;

  const grid = document.getElementById('products-grid');
  grid.innerHTML = r.products.map(p => `
    <div class="product-card">
      <div class="product-visual"><img src="${p.img}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-claim">${p.claim}</div>
        <div class="product-price">${p.price}</div>
        <a href="https://lumiere-skincare.de/shop" target="_blank" class="btn-product-shop">Im Shop ansehen →</a>
      </div>
    </div>
  `).join('');
}

/* ========================
   SUPABASE SPEICHERN
   ======================== */

async function saveToSupabase() {
  const payload = {
    email: state.email,
    antwort_1: state.answerLabels[0] || '',
    antwort_2: state.answerLabels[1] || '',
    antwort_3: state.answerLabels[2] || '',
    antwort_4: state.answerLabels[3] || '',
    antwort_5: state.answerLabels[4] || '',
    antwort_6: state.answerLabels[5] || '',
    hauttyp: results[state.result].title
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/quiz_results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      document.getElementById('save-status').classList.remove('hidden');
      document.getElementById('email-hint').textContent = '';
    } else {
      console.error('Supabase Fehler:', res.status, await res.text());
      showEmailError();
    }
  } catch (err) {
    console.error('Netzwerkfehler:', err);
    showEmailError();
  }
}

function showEmailError() {
  const hint = document.getElementById('email-hint');
  hint.textContent = 'Leider ist etwas schiefgelaufen. Bitte versuch es gleich noch einmal.';
  hint.classList.add('email-hint-error');
  document.getElementById('btn-email-submit').disabled = false;
  document.getElementById('email-input').disabled = false;
}

/* ========================
   NEUSTART
   ======================== */

function restartQuiz() {
  state.current = 0;
  state.answers = [];
  state.answerLabels = [];
  state.result = null;
  state.email = '';

  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('email-input').value = '';
  document.getElementById('email-input').disabled = false;
  document.getElementById('btn-email-submit').disabled = true;
  document.getElementById('email-hint').textContent = '';
  document.getElementById('save-status').classList.add('hidden');

  document.getElementById('hero').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================
   ANKÜNDIGUNGSLEISTE
   ======================== */

(function initAnnouncementBar() {
  const items = document.querySelectorAll('.announcement-item');
  if (!items.length) return;
  let current = 0;
  items[current].classList.add('active');

  setInterval(() => {
    items[current].classList.remove('active');
    current = (current + 1) % items.length;
    items[current].classList.add('active');
  }, 4000);
})();
