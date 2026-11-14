// Scheda Strumenti: vicino a me, spese condivise, documenti, navigatore, sicurezza.
(function () {
  'use strict';

  // Indirizzo del Firebase Realtime Database delle spese (es. https://nome-default-rtdb.firebaseio.com). Vuoto = spese solo su questo telefono.
  const SYNC_URL = 'https://viaggi-es-default-rtdb.europe-west1.firebasedatabase.app';

  const DEFAULT_PEOPLE = 'Etienne, Fabiana';
  const DEFAULT_TRIP = 'mad26-7485153a66';
  const ADMIN = 'Etienne';   // solo chi sceglie questo nome vede il pulsante per eliminare le spese

  const HOTEL = { name: 'Alloggio', lat: 40.4172, lon: -3.7102, q: 'Calle de las Fuentes 10 Madrid' };

  const FAMOUS = [
    {"n": "Plaza Mayor", "ic": "🏛️", "lat": 40.4155, "lon": -3.7074, "t": "Piazza storica", "d": "La piazza porticata del Seicento nel cuore della città, con il mercatino di Natale a dicembre.", "c": "Ingresso libero"},
    {"n": "Puerta del Sol", "ic": "🕰️", "lat": 40.4169, "lon": -3.7035, "t": "Piazza, chilometro zero", "d": "La piazza centrale di Madrid, con il punto del chilometro zero e l'orologio dove a Capodanno si mangiano le uve.", "c": "Ingresso libero, il 31 con accesso controllato"},
    {"n": "Mercado de San Miguel", "ic": "🍤", "lat": 40.4154, "lon": -3.7089, "t": "Mercato gastronomico", "d": "Mercato coperto in ferro e vetro accanto a Plaza Mayor, con bancarelle di tapas. Molto affollato e con prezzi da zona turistica.", "c": "Ingresso libero, si paga quello che si mangia"},
    {"n": "Palacio Real", "ic": "👑", "lat": 40.418, "lon": -3.7143, "t": "Palazzo reale", "d": "Il palazzo reale di Madrid. Da Plaza de Oriente si vede da fuori; dentro è una visita da prenotare.", "c": "Da fuori gratis; dentro a pagamento, controlla il sito"},
    {"n": "Catedral de la Almudena", "ic": "⛪", "lat": 40.4157, "lon": -3.7143, "t": "Cattedrale", "d": "La cattedrale di Madrid, accanto al Palacio Real.", "c": "Controlla il sito per orari e costi"},
    {"n": "Plaza de Oriente", "ic": "🌳", "lat": 40.4181, "lon": -3.7107, "t": "Piazza e giardini", "d": "Piazza con giardini e statue di sovrani, tra il Palacio Real e il Teatro Real.", "c": "Ingresso libero"},
    {"n": "Plaza de España", "ic": "🗽", "lat": 40.4233, "lon": -3.7122, "t": "Piazza", "d": "Piazza con il monumento a Cervantes, all'inizio di Gran Vía.", "c": "Ingresso libero"},
    {"n": "Templo de Debod", "ic": "🌇", "lat": 40.424, "lon": -3.7178, "t": "Tempio egizio, tramonto", "d": "Antico tempio egizio donato dall'Egitto alla Spagna e ricostruito qui. Dalla terrazza si vede bene il tramonto.", "c": "L'esterno è gratuito; per l'interno controlla il sito"},
    {"n": "Parque del Retiro", "ic": "🌳", "lat": 40.4153, "lon": -3.6844, "t": "Parco", "d": "Il grande parco del centro, con il laghetto e le barche.", "c": "Ingresso libero"},
    {"n": "Palacio de Cristal", "ic": "🪟", "lat": 40.4146, "lon": -3.6819, "t": "Padiglione di vetro", "d": "Padiglione di vetro e ferro nel Retiro, sul laghetto.", "c": "Ingresso libero"},
    {"n": "Puerta de Alcalá", "ic": "🚪", "lat": 40.42, "lon": -3.6888, "t": "Porta monumentale", "d": "Arco monumentale del Settecento all'ingresso del Retiro, in Plaza de la Independencia.", "c": "Ingresso libero"},
    {"n": "Plaza de Cibeles", "ic": "⛲", "lat": 40.4193, "lon": -3.6932, "t": "Piazza e fontana", "d": "La fontana della dea Cibele sul carro tirato dai leoni, davanti al Palacio de Cibeles.", "c": "Ingresso libero"},
    {"n": "Gran Vía", "ic": "🎭", "lat": 40.4202, "lon": -3.7058, "t": "Viale dei teatri", "d": "Il grande viale con teatri, cinema e palazzi del primo Novecento, da Cibeles a Plaza de España.", "c": "Ingresso libero"},
    {"n": "Mercado de San Antón", "ic": "🍽️", "lat": 40.4224, "lon": -3.6976, "t": "Mercato su più piani", "d": "Mercato di quartiere a Chueca con bancarelle e tavoli per mangiare.", "c": "Ingresso libero, si paga quello che si mangia"},
    {"n": "Chueca", "ic": "🏘️", "lat": 40.4226, "lon": -3.6978, "t": "Quartiere", "d": "Quartiere vivace con locali, negozi e caffè, attorno a Plaza de Chueca.", "c": ""},
    {"n": "Malasaña", "ic": "🍻", "lat": 40.4263, "lon": -3.7035, "t": "Quartiere dei locali", "d": "Quartiere dei locali alternativi, attorno a Plaza del Dos de Mayo.", "c": ""},
    {"n": "La Latina", "ic": "🍷", "lat": 40.412, "lon": -3.709, "t": "Quartiere delle tapas", "d": "Quartiere con taverne e bar di tapas, lungo Cava Baja.", "c": ""},
    {"n": "Lavapiés", "ic": "🏘️", "lat": 40.4088, "lon": -3.701, "t": "Quartiere multiculturale", "d": "Quartiere a sud del centro, con locali e botteghe di tante culture.", "c": ""},
    {"n": "Plaza de Santa Ana", "ic": "🥂", "lat": 40.4148, "lon": -3.701, "t": "Piazza dei locali", "d": "Piazza del Barrio de las Letras con terrazze e locali. Qui si affaccia l'Hotel ME con il rooftop.", "c": "Ingresso libero"},
    {"n": "Chocolatería San Ginés", "ic": "🍫", "lat": 40.4168, "lon": -3.7065, "t": "Cioccolata con churros", "d": "Storica chocolatería vicino a Sol, nota per la cioccolata con i churros. Orari da verificare.", "c": "A pagamento"},
    {"n": "Faro de Moncloa", "ic": "🗼", "lat": 40.4351, "lon": -3.7195, "t": "Torre panoramica", "d": "Torre con una terrazza panoramica sopra Moncloa.", "c": "A pagamento, controlla il sito"},
    {"n": "Parque del Oeste", "ic": "🌹", "lat": 40.43, "lon": -3.7225, "t": "Parco", "d": "Parco sul lato ovest della città, vicino al Templo de Debod.", "c": "Ingresso libero"},
  ];

  // Luoghi con miniatura (stesse chiavi di AMS_IMG)
  // curiosità e luoghi insoliti scelti a mano: le descrizioni vengono da fonti citate sul sito e da verifiche del 22/10/2026
  const CURIOSITA = [];
  const FAMOUS_IMG = {};
  const DAY_SHORT = ['Lun 28 dic', 'Mar 29 dic', 'Mer 30 dic', 'Gio 31 dic', 'Ven 1 gen', 'Sab 2 gen'];
  const DAY_MINI = ['Lun 28', 'Mar 29', 'Mer 30', 'Gio 31', 'Ven 1', 'Sab 2'];
  const WHEN = {
    'Plaza Mayor': [0, 3], 'Mercado de San Miguel': [0], 'Palacio Real': [1], 'Catedral de la Almudena': [1], 'Plaza de Oriente': [1], 'La Latina': [1],
    'Plaza de España': [1], 'Templo de Debod': [1], 'Malasaña': [1], 'Parque del Retiro': [2, 4], 'Palacio de Cristal': [2], 'Puerta de Alcalá': [2],
    'Plaza de Cibeles': [2], 'Gran Vía': [2, 5], 'Mercado de San Antón': [3], 'Chueca': [3], 'Puerta del Sol': [3, 5], 'Plaza de Santa Ana': [3],
    'Chocolatería San Ginés': [4], 'Faro de Moncloa': [5], 'Parque del Oeste': [5],
  };

  const CATS = {
    cibo:   { l: '🍽️ Mangiare',   r: 600,  f: ['[amenity~"^(restaurant|fast_food|cafe)$"]'], ic: '🍽️' },
    bar:    { l: '🍺 Bar',        r: 600,  f: ['[amenity~"^(bar|pub)$"]'], ic: '🍺' },
    farm:   { l: '💊 Farmacie',   r: 600,  f: ['[amenity=pharmacy]'], ic: '💊' },
    atm:    { l: '🏧 Bancomat',   r: 600,  f: ['[amenity=atm]'], ic: '🏧' },
    stop:   { l: '🚋 Fermate',    r: 600,  f: ['[railway=tram_stop]', '[highway=bus_stop]', '[railway=station]'], ic: '🚋' },
    wc:     { l: '🚻 Bagni',      r: 600,  f: ['[amenity=toilets]'], ic: '🚻' },
    spesa:  { l: '🛒 Supermercati', r: 600, f: ['[shop=supermarket]'], ic: '🛒' },
    visita: { l: '📸 Altri luoghi', r: 1000, f: ['[tourism~"^(attraction|museum|viewpoint|gallery)$"]'], ic: '📸' },
  };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const eur = (c) => (c / 100).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
  const mapsPlace = (lat, lon, name) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name ? name + ' ' : '') + lat + ',' + lon;

  function distM(a, b) {
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtDist(m) {
    const walk = Math.max(1, Math.round((m * 1.25) / 80));
    const d = m < 1000 ? Math.round(m / 10) * 10 + ' m' : m < 20000 ? (m / 1000).toFixed(1).replace('.', ',') + ' km' : Math.round(m / 1000) + ' km';
    return d + (walk <= 60 ? '<br>' + walk + ' min a piedi' : '');
  }

  // ── Schede ──
  $$('.tool-tab').forEach((b) => b.addEventListener('click', () => {
    $$('.tool-tab').forEach((x) => x.classList.toggle('active', x === b));
    $$('.tool').forEach((t) => t.classList.toggle('active', t.id === 'tool-' + b.dataset.tool));
    if (b.dataset.tool === 'spese') { renderSpese(); syncSpese(); }
  }));

  // ── Vicino a me ──
  let pos = null;
  let nearCat = 'famosi';
  let nearToken = 0;

  function renderChips() {
    const box = $('#near-chips');
    box.innerHTML = '<button class="chip' + (nearCat === 'famosi' ? ' active' : '') + '" data-c="famosi">⭐ Più famosi</button>' +
      (CURIOSITA.length ? '<button class="chip' + (nearCat === 'curio' ? ' active' : '') + '" data-c="curio">🎭 Curiosità</button>' : '') +
      Object.keys(CATS).map((k) => '<button class="chip' + (nearCat === k ? ' active' : '') + '" data-c="' + k + '">' + CATS[k].l + '</button>').join('');
    $$('.chip', box).forEach((c) => c.addEventListener('click', () => { nearCat = c.dataset.c; renderChips(); loadNear(); }));
  }

  // Copertura dei dati salvati (centro di Madrid); fuori da qui si cerca in diretta
  const COVER = { S: 40.400, N: 40.440, W: -3.735, E: -3.670 };
  const inCover = (p) => p.lat >= COVER.S && p.lat <= COVER.N && p.lon >= COVER.W && p.lon <= COVER.E;
  const OVERPASS = ['https://overpass.openstreetmap.fr/api/interpreter', 'https://z.overpass-api.de/api/interpreter', 'https://overpass-api.de/api/interpreter'];
  const NAMED = ['cibo', 'bar', 'stop', 'visita'];
  const CUISINE = { italian: 'italiana', pizza: 'pizza', burger: 'hamburger', sandwich: 'panini', indian: 'indiana', japanese: 'giapponese', chinese: 'cinese', asian: 'asiatica', french: 'francese', indonesian: 'indonesiana', thai: 'thailandese', sushi: 'sushi', kebab: 'kebab', mexican: 'messicana', turkish: 'turca', friture: 'patatine e fritti', breakfast: 'colazioni', regional: 'locale', international: 'internazionale', ramen: 'ramen', steak_house: 'carne alla griglia', bubble_tea: 'bubble tea', mediterranean: 'mediterranea', argentinian: 'argentina', spanish: 'spagnola', korean: 'coreana', seafood: 'pesce', fish: 'pesce', surinamese: 'surinamese', dutch: 'olandese', greek: 'greca', american: 'americana', vietnamese: 'vietnamita', lebanese: 'libanese', ethiopian: 'etiope', vegetarian: 'vegetariana', vegan: 'vegana', tapas: 'tapas', irish: 'irlandese', belgian: 'belga', barbecue: 'barbecue', chicken: 'pollo', coffee_shop: 'caffetteria', cake: 'dolci', ice_cream: 'gelato', pancake: 'pancake', pasta: 'pasta', dessert: 'dolci', bakery: 'forno', portuguese: 'portoghese', moroccan: 'marocchina', persian: 'persiana', georgian: 'georgiana', german: 'tedesca', peruvian: 'peruviana', brazilian: 'brasiliana', caribbean: 'caraibica', middle_eastern: 'mediorientale', falafel: 'falafel', poke: 'poke', salad: 'insalate', juice: 'succhi', tea: 'tè', coffee: 'caffè' };
  const TYPE = { attraction: 'attrazione', museum: 'museo', gallery: "galleria d'arte", viewpoint: 'punto panoramico' };
  const cleanWeb = (w) => (w || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  const hrefWeb = (w) => (/^https?:/.test(w) ? w : 'https://' + w);

  // Riga con la stessa forma dei dati salvati: [nome, lat, lon, orari, cucina o tipo, costo, sito, indirizzo]
  function rowFromTags(k, t, lat, lon) {
    const name = t.name || t['name:en'] || '';
    let x = '', fee = '';
    if (k === 'cibo' || k === 'bar') x = (t.cuisine || '').split(/[;,]/).map((c) => CUISINE[c.trim()]).filter(Boolean).slice(0, 2).join(', ');
    if (k === 'visita') {
      x = t.amenity === 'marketplace' ? 'mercato' : (TYPE[t.tourism] || '');
      if (t.fee === 'no') fee = 'ingresso gratuito'; else if (t.fee === 'yes') fee = 'a pagamento' + (t.charge ? ' (' + t.charge + ')' : '');
    }
    return [name, lat, lon, t.opening_hours || '', x, fee, cleanWeb(t.website || t['contact:website']), ((t['addr:street'] || '') + ' ' + (t['addr:housenumber'] || '')).trim()];
  }

  // Interroga insieme i server di OpenStreetMap e prende la prima risposta valida (massimo 15 secondi)
  function liveRows(k, p) {
    const cat = CATS[k], around = '(around:' + cat.r + ',' + p.lat + ',' + p.lon + ')', nm = NAMED.includes(k) ? '["name"]' : '';
    const q = '[out:json][timeout:25];(' + cat.f.map((f) => 'nwr' + around + f + nm + ';').join('') + ');out center 150;';
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
    return Promise.any(OVERPASS.map((u) => fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), signal: ctl.signal })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })))
      .then((d) => {
        clearTimeout(timer); ctl.abort();
        return d.elements.map((e) => {
          const lat = e.lat != null ? e.lat : e.center && e.center.lat, lon = e.lon != null ? e.lon : e.center && e.center.lon;
          return lat == null ? null : rowFromTags(k, e.tags || {}, lat, lon);
        }).filter(Boolean);
      })
      .catch((e) => { clearTimeout(timer); throw e; });
  }

  // descrizioni scritte a mano dei luoghi da visitare più noti; per gli altri una riga generica in base al tipo
  const VISITA_DESC = {};
  const VISITA_GEN = {"museo": "Museo. Per orari e biglietti guarda il sito o cerca su Google.", "galleria d'arte": "Galleria d'arte: di solito l'ingresso è libero, ma gli orari variano.", "mercato": "Mercato di strada.", "punto panoramico": "Punto da cui si ha una bella vista.", "attrazione": ""};
  const ARTIS = { lat: 0, lon: 0 };
  function buildList(k, rows) {
    const cat = CATS[k], food = k === 'cibo' || k === 'bar', visit = k === 'visita', label = cat.l.replace(/^\S+\s/, '');
    return rows.map((r) => ({
      n: r[0] || label, lat: r[1], lon: r[2], ic: cat.ic, t: (visit && r[4]) ? r[4] : (r[0] ? '' : 'senza nome'),
      hours: r[3] || '', cuisine: food ? (r[4] || '') : '', kind: visit ? (r[4] || '') : '',
      d: visit ? (VISITA_DESC[r[0]] || (r[4] === 'attrazione' && distM(ARTIS, { lat: r[1], lon: r[2] }) < 350 ? 'Animale o recinto dello zoo Artis.' : (/cruise|boat|canal tours|stromma|rederij/i.test(r[0]) ? 'Giro turistico in barca sui canali.' : (VISITA_GEN[r[4]] || '')))) : '',
      c: visit ? (r[5] || 'non indicato nei dati, controlla il sito') : '',
      addr: r[7] || '', web: r[6] ? hrefWeb(r[6]) : '', menu: food && !!r[0], info: visit && !!r[0],
      d0: distM(pos, { lat: r[1], lon: r[2] }),
    })).filter((p) => p.d0 <= cat.r).sort((a, b) => a.d0 - b.d0).slice(0, 30);
  }

  const gsearch = (q) => 'https://www.google.com/search?q=' + encodeURIComponent(q);

  // Riga di un luogo; se ha dettagli (descrizione, costo, menù) si apre con un tocco
  function placeRow(p) {
    const more = [];
    const days = p.g || [];
    if (p.d) more.push('<p>' + esc(p.d) + '</p>');
    if (days.length) more.push('<p class="pm-line"><b>Nel programma:</b> ' + days.map((i) => DAY_SHORT[i]).join(' e ') + '</p>');
    if (p.kind) more.push('<p class="pm-line"><b>Tipo:</b> ' + esc(p.kind) + '</p>');
    if (p.cuisine) more.push('<p class="pm-line"><b>Cucina:</b> ' + esc(p.cuisine) + '</p>');
    if (p.c) more.push('<p class="pm-line"><b>Costo:</b> ' + esc(p.c) + '</p>');
    if (p.addr) more.push('<p class="pm-line"><b>Indirizzo:</b> ' + esc(p.addr) + '</p>');
    if (p.hours) more.push('<p class="pm-line"><b>Orari:</b> ' + esc(p.hours) + '</p>');
    const btns = [];
    if (p.menu) btns.push('<a class="btn-m btn-yellow" href="' + gsearch(p.n + ' Madrid menu') + '" target="_blank">Menù su Google</a>');
    if (p.web) btns.push('<a class="btn-m btn-yellow" href="' + esc(p.web) + '" target="_blank">Sito</a>');
    days.forEach((i) => btns.push('<a class="btn-m btn-yellow" href="#" data-day="' + i + '">Apri ' + DAY_SHORT[i] + '</a>'));
    if (p.info) btns.push('<a class="btn-m btn-outline" href="' + gsearch(p.n + ' Madrid') + '" target="_blank">Cos\'è? Cerca su Google</a>');
    if (btns.length) more.push('<div class="maps-row">' + btns.join('') + '</div>');
    const has = more.length > 0;
    return '<div class="place-wrap"><div class="place"><div class="place-ic">' + (p.img && window.AMS_IMG && window.AMS_IMG[p.img] ? '<img src="' + window.AMS_IMG[p.img].src + '" alt="" loading="lazy">' : p.ic) + '</div>' +
      (has ? '<button class="place-body" aria-expanded="false">' : '<div class="place-body">') +
      '<div class="place-name">' + esc(p.n) + (has ? ' <span class="chev" aria-hidden="true">▾</span>' : '') + '</div><div class="place-sub">' + esc(p.t || '') + '</div>' +
      (days.length ? '<div class="when">Ci andiamo: ' + days.map((i) => DAY_MINI[i]).join(' e ') + '</div>' : '') +
      (has ? '</button>' : '</div>') +
      '<div class="place-dist">' + fmtDist(p.d0) + '</div><a class="btn-m btn-outline" href="' + mapsPlace(p.lat, p.lon, p.q) + '" target="_blank">Maps</a></div>' +
      (has ? '<div class="place-more" hidden>' + more.join('') + '</div>' : '') + '</div>';
  }
  function bindRows(box) {
    $$('a[data-day]', box).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); if (typeof go === 'function') go(+a.dataset.day); }));
    $$('button.place-body', box).forEach((b) => b.addEventListener('click', () => {
      const wrap = b.closest('.place-wrap'), more = wrap.querySelector('.place-more');
      const open = more.hidden;
      more.hidden = !open;
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      wrap.classList.toggle('open', open);
    }));
  }

  async function loadNear() {
    const out = $('#near-out');
    if (!pos) { out.innerHTML = '<div class="t-note">Premi "Usa la mia posizione" oppure "Parti dall\'alloggio".</div>'; return; }
    if (nearCat === 'famosi') {
      const list = FAMOUS.map((p) => Object.assign({}, p, { d0: distM(pos, p), q: p.n + ' Madrid', g: WHEN[p.n] || [], img: FAMOUS_IMG[p.n] || '' })).sort((a, b) => a.d0 - b.d0);
      out.innerHTML = '<div class="t-note small" style="margin-bottom:6px">Tocca un luogo per leggere cos\'è e quanto costa. I prezzi sono indicativi: controlla sempre il sito prima di andare.</div>' + list.map(placeRow).join('');
      bindRows(out);
      return;
    }
    if (nearCat === 'curio') {
      const list = CURIOSITA.map((p) => Object.assign({}, p, { d0: distM(pos, p), q: p.n + ' ' + (p.addr || '') + ' Madrid', info: true })).sort((a, b) => a.d0 - b.d0);
      out.innerHTML = '<div class="t-note small" style="margin-bottom:6px">Luoghi insoliti scelti a mano. Tocca un luogo per i dettagli: alcuni sono piccoli e si vedono solo dall\'esterno, e gli orari possono cambiare.</div>' + list.map(placeRow).join('');
      bindRows(out);
      return;
    }
    const k = nearCat, cat = CATS[k], visit = k === 'visita', token = ++nearToken;
    const saved = (window.AMS_OSM && window.AMS_OSM[k]) || [];
    const hint = visit ? '<div class="t-note small" style="margin-bottom:6px">Tocca un luogo per i dettagli. Il costo è quello indicato su OpenStreetMap, quando c\'è.</div>' : '';
    const draw = (rows, source, warn) => {
      if (token !== nearToken) return;
      const list = buildList(k, rows);
      out.innerHTML = '<div class="src-line"><span>' + source + '</span><button class="t-btn small ghost" id="near-live">Aggiorna in diretta</button></div>' +
        (warn ? '<div class="t-note small" style="margin-bottom:6px">' + warn + '</div>' : '') + hint +
        (list.length ? list.map(placeRow).join('') : '<div class="t-note">Niente di segnato nel raggio di ' + cat.r + ' m. Prova con "Più famosi" o con "Aggiorna in diretta".</div>');
      bindRows(out);
      $('#near-live').addEventListener('click', () => runLive(false));
    };
    const runLive = async (auto) => {
      out.innerHTML = '<div class="t-note">' + (auto ? 'Sei fuori dall\'area salvata: ' : '') + 'cerco in diretta nel raggio di ' + cat.r + ' m…</div>';
      try {
        const rows = await liveRows(k, pos);
        draw(rows, 'Dati in diretta, letti adesso');
      } catch (e) {
        if (token !== nearToken) return;
        if (auto) out.innerHTML = '<div class="t-note">Sei fuori dall\'area salvata e il servizio in diretta non risponde. Controlla la rete e riprova tra poco; "Più famosi" funziona sempre.</div><div class="t-gap"><button class="t-btn small ghost" id="near-live">Riprova</button></div>';
        else draw(saved, 'Dati salvati', 'Il servizio in diretta non risponde: restano i dati salvati.');
        const b = $('#near-live'); if (auto && b) b.addEventListener('click', () => runLive(true));
      }
    };
    if (inCover(pos)) draw(saved, 'Dati salvati il 14 nov, funzionano anche senza rete'); else runLive(true);
  }

  function setPos(p, label) {
    pos = p;
    $('#near-pos').textContent = label;
    loadNear();
  }
  $('#near-gps').addEventListener('click', () => {
    if (!navigator.geolocation) { $('#near-pos').textContent = 'Posizione non disponibile su questo dispositivo.'; return; }
    $('#near-pos').textContent = 'Cerco la posizione…';
    const ok = (g) => {
      const p = { lat: g.coords.latitude, lon: g.coords.longitude };
      const far = distM(p, HOTEL);
      setPos(p, far > 25000
        ? '📍 Posizione attuale, ma sei a ' + Math.round(far / 1000) + ' km da Madrid: i risultati qui valgono solo in città. Per provare l\'app usa "Parti dall\'alloggio".'
        : '📍 Posizione attuale');
    };
    const ko = (e) => {
      const why = e && e.code === 1
        ? 'Il telefono non ha dato il permesso. Su iPhone: Impostazioni > Privacy e sicurezza > Localizzazione > attiva, poi Siti web di Safari (o l\'app installata) > "Mentre usi l\'app". Su Android: tocca il lucchetto accanto all\'indirizzo in Chrome > Autorizzazioni > Posizione.'
        : e && e.code === 3 ? 'Il telefono ci mette troppo a trovarti (succede al chiuso). Riprova all\'aperto, oppure usa "Parti dall\'alloggio".'
        : 'Il telefono non riesce a darmi la posizione. Controlla che la localizzazione sia accesa, oppure usa "Parti dall\'alloggio".';
      $('#near-pos').textContent = why;
    };
    // prima con precisione normale e rete (veloce anche al chiuso), poi non serve altro
    navigator.geolocation.getCurrentPosition(ok, (e) => {
      if (e && e.code === 1) return ko(e);
      navigator.geolocation.getCurrentPosition(ok, ko, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
  });
  // indirizzo scritto a mano (serve la rete): la ricerca usa il servizio di OpenStreetMap
  async function findAddr() {
    const q = ($('#near-addr').value || '').trim(), box = $('#near-addr-res');
    if (q.length < 3) { box.innerHTML = '<div class="t-note small t-gap">Scrivi almeno tre lettere.</div>'; return; }
    box.innerHTML = '<div class="t-note small t-gap">Cerco…</div>';
    try {
      const full = /madrid/i.test(q) ? q : q + ', Madrid';
      const u = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=es&accept-language=it&viewbox=-3.78,40.48,-3.62,40.36&q=' + encodeURIComponent(full);
      const res = await fetch(u);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const raw = await res.json(), seen = new Set();
      const nice = (r) => { const p = r.display_name.split(',').map((x) => x.trim()); return (/^\d/.test(p[0]) && p[1] ? p[1] + ' ' + p[0] : p[0]) + (p[2] ? ', ' + p[2] : ''); };
      const list = raw.filter((r) => { const k = nice(r); if (seen.has(k)) return false; seen.add(k); return true; });
      if (!list.length) { box.innerHTML = '<div class="t-note small t-gap">Non trovo niente. Prova con via e numero civico, per esempio "Calle Mayor 1".</div>'; return; }
      box.innerHTML = '<div class="t-gap">' + list.map((r, i) => '<button class="t-btn ghost addr-res" data-i="' + i + '">' + esc(nice(r)) + '</button>').join('') + '</div>';
      $$('.addr-res', box).forEach((b) => b.addEventListener('click', () => {
        const r = list[Number(b.dataset.i)];
        setPos({ lat: Number(r.lat), lon: Number(r.lon) }, '📍 Parti da: ' + nice(r));
        box.innerHTML = '';
      }));
    } catch (e) {
      box.innerHTML = '<div class="t-note small t-gap">Per cercare un indirizzo serve la connessione a internet. Riprova quando sei online.</div>';
    }
  }
  $('#near-find').addEventListener('click', findAddr);
  $('#near-addr').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); findAddr(); } });
  $('#near-hotel').addEventListener('click', () => setPos({ lat: HOTEL.lat, lon: HOTEL.lon }, '🏨 Partenza: ' + HOTEL.name));
  renderChips();
  loadNear();

  // ── Spese ──
  const SK = 'mad-spese';
  let S = store.get(SK, { code: '', me: '', people: [], records: [] });
  const saveS = () => store.set(SK, S);
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const CAT_IC = { Cibo: '🍽️', Trasporti: '🚋', Ingressi: '🎟️', Alloggio: '🏨', Altro: '🧾' };
  let syncState = 'off';

  function liveExpenses() {
    const dead = new Set(S.records.filter((r) => r.t === 'd').map((r) => r.target));
    const closed = new Set(); closures().forEach((c) => (c.ids || []).forEach((i) => closed.add(i)));
    return S.records.filter((r) => r.t === 'e' && !dead.has(r.id) && !closed.has(r.id)).sort((a, b) => b.ts - a.ts);
  }
  // chiusure dei conti: ogni record 'c' elenca le spese chiuse e il risultato di quel momento
  function closures() {
    return S.records.filter((r) => r.t === 'c').sort((a, b) => b.ts - a.ts);
  }
  function closedExpenses(c) {
    const ids = new Set(c.ids || []), dead = new Set(S.records.filter((r) => r.t === 'd').map((r) => r.target));
    return S.records.filter((r) => r.t === 'e' && ids.has(r.id) && !dead.has(r.id)).sort((a, b) => b.ts - a.ts);
  }
  function peopleRecord() {
    return S.records.filter((r) => r.t === 'p').sort((a, b) => b.ts - a.ts)[0];
  }
  function applyPeople() {
    const p = peopleRecord();
    if (p) S.people = p.names;
  }

  function splitShares(amount, who) {
    const base = Math.floor(amount / who.length); let rest = amount - base * who.length;
    const o = {}; who.forEach((w) => { o[w] = base + (rest-- > 0 ? 1 : 0); });
    return o;
  }

  function calcConti(ex) {
    const paid = {}, share = {};
    S.people.forEach((p) => { paid[p] = 0; share[p] = 0; });
    let total = 0;
    ex.forEach((e) => {
      total += e.amount;
      if (paid[e.payer] != null) paid[e.payer] += e.amount;
      const sh = splitShares(e.amount, e.who.length ? e.who : S.people);
      Object.keys(sh).forEach((p) => { if (share[p] != null) share[p] += sh[p]; });
    });
    const net = S.people.map((p) => ({ p, v: paid[p] - share[p] }));
    const cred = net.filter((x) => x.v > 0).map((x) => ({ ...x })).sort((a, b) => b.v - a.v);
    const deb = net.filter((x) => x.v < 0).map((x) => ({ p: x.p, v: -x.v })).sort((a, b) => b.v - a.v);
    const settle = [];
    let i = 0, j = 0;
    while (i < deb.length && j < cred.length) {
      const m = Math.min(deb[i].v, cred[j].v);
      if (m > 0) settle.push(deb[i].p + ' deve ' + eur(m) + ' a ' + cred[j].p);
      deb[i].v -= m; cred[j].v -= m;
      if (deb[i].v <= 0) i++;
      if (cred[j].v <= 0) j++;
    }
    return { total, net, settle };
  }

  function renderSpese() {
    applyPeople();
    const box = $('#spese-body');
    if (!S.people.length) {
      box.innerHTML = '<div class="t-card"><div class="t-title">Prepariamo le spese</div>' +
        '<div class="t-note">Scrivi i nomi di chi viaggia, separati da virgola. Poi scegli chi sei tu su questo telefono.</div>' +
        '<label class="t-label">NOMI</label><input class="t-input" id="sp-names" value="' + esc(DEFAULT_PEOPLE) + '">' +
        '<label class="t-label">TU CHI SEI?</label><select class="t-select" id="sp-me0"></select>' +
        '<label class="t-label">CODICE VIAGGIO (uguale su tutti i telefoni)</label><input class="t-input" id="sp-code" value="' + esc(S.code || DEFAULT_TRIP) + '">' +
        '<div class="t-gap"><button class="t-btn yellow" id="sp-start">Inizia</button></div></div>';
      const fillMe = () => {
        const list = $('#sp-names').value.split(',').map((x) => x.trim()).filter(Boolean);
        const cur = $('#sp-me0').value;
        $('#sp-me0').innerHTML = list.map((p) => '<option' + (p === cur ? ' selected' : '') + '>' + esc(p) + '</option>').join('');
      };
      fillMe();
      $('#sp-names').addEventListener('input', fillMe);
      $('#sp-start').addEventListener('click', () => {
        const names = $('#sp-names').value.split(',').map((x) => x.trim()).filter(Boolean);
        if (names.length < 1) return;
        S.code = $('#sp-code').value.trim().replace(/[.$#\[\]\/]/g, '-') || DEFAULT_TRIP;
        S.records.push({ id: 'people', t: 'p', names, ts: Date.now(), synced: false });
        S.people = names; S.me = names.includes($('#sp-me0').value) ? $('#sp-me0').value : names[0];
        saveS(); renderSpese(); syncSpese();
      });
      return;
    }
    if (!S.me || !S.people.includes(S.me)) S.me = S.people[0];
    const ex = liveExpenses();
    const { total, net, settle } = calcConti(ex);
    const closed = closures();
    const closedTotal = closed.reduce((t, c) => t + (c.total || 0), 0);
    const statusTxt = { off: 'Solo su questo telefono', ok: 'Sincronizzato con gli altri', err: 'Non riesco a sincronizzare, riprovo' }[syncState];
    box.innerHTML =
      '<div class="t-card"><div class="t-row" style="justify-content:space-between"><div><div class="t-note small">' + (closed.length ? 'DA SALDARE' : 'TOTALE SPESO') + '</div><div class="t-title" style="font-size:24px">' + eur(total) + '</div>' + (closed.length ? '<div class="t-note small">Totale del viaggio ' + eur(total + closedTotal) + '</div>' : '') + '</div>' +
      '<div class="t-note small"><span class="sync-dot ' + (syncState === 'ok' ? 'ok' : syncState === 'err' ? 'err' : '') + '"></span>' + statusTxt + '</div></div></div>' +

      '<div class="t-card"><div class="t-title">Aggiungi una spesa</div>' +
      '<label class="t-label">IMPORTO (€)</label><input class="t-input" id="sp-amt" inputmode="decimal" placeholder="0,00">' +
      '<label class="t-label">COSA</label><input class="t-input" id="sp-desc" placeholder="Es. cena Foodhallen">' +
      '<label class="t-label">CATEGORIA</label><select class="t-select" id="sp-cat">' + Object.keys(CAT_IC).map((c) => '<option>' + c + '</option>').join('') + '</select>' +
      '<label class="t-label">PAGATO DA</label><select class="t-select" id="sp-payer">' + S.people.map((p) => '<option' + (p === S.me ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select>' +
      '<label class="t-label">DIVISO TRA</label><div class="t-checks">' + S.people.map((p) => '<label class="t-check"><input type="checkbox" class="sp-who" value="' + esc(p) + '" checked> ' + esc(p) + '</label>').join('') + '</div>' +
      '<div class="t-gap"><button class="t-btn yellow" id="sp-add">Aggiungi</button></div></div>' +

      '<div class="t-card"><div class="t-title">Chi deve a chi</div>' +
      (settle.length ? settle.map((s) => '<div class="settle">' + esc(s) + '</div>').join('') : '<div class="t-note">Per ora siete pari.</div>') +
      '<div class="t-gap">' + net.map((x) => '<div class="balance"><span>' + esc(x.p) + '</span><span class="' + (x.v >= 0 ? 'pos' : 'neg') + '">' + (x.v >= 0 ? '+' : '') + eur(x.v) + '</span></div>').join('') + '</div>' +
      (S.me === ADMIN && ex.length ? '<div class="t-gap"><button class="t-btn ghost small" id="sp-close">Chiudi i conti</button><div class="t-note small t-gap">Le spese qui sopra vanno nello storico e i saldi ripartono da zero.</div></div>' : '') + '</div>' +

      '<div class="t-card"><div class="t-title">Spese registrate (' + ex.length + ')</div>' +
      (ex.length ? ex.map((e) => '<div class="exp"><div class="place-ic">' + (CAT_IC[e.cat] || '🧾') + '</div><div class="exp-body"><div class="exp-desc">' + esc(e.desc || e.cat) + '</div><div class="exp-sub">' +
        esc(e.payer) + ' ha pagato · ' + new Date(e.ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' · tra ' + e.who.length +
        '</div></div><div class="exp-amt">' + eur(e.amount) + '</div>' + (S.me === ADMIN ? '<button class="x-btn" data-del="' + e.id + '" aria-label="Elimina">✕</button>' : '') + '</div>').join('') : '<div class="t-note">Nessuna spesa ancora.</div>') + '</div>' +

      (closed.length ? '<div class="t-card"><div class="t-title">Storico (' + closed.length + (closed.length === 1 ? ' chiusura' : ' chiusure') + ')</div>' +
        closed.map((c) => '<details class="t-gap"><summary><b>' + new Date(c.ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</b> · ' + eur(c.total || 0) + '</summary>' +
          (c.settle && c.settle.length ? c.settle.map((x) => '<div class="settle">' + esc(x) + '</div>').join('') : '<div class="t-note">Erano pari.</div>') +
          closedExpenses(c).map((e) => '<div class="exp"><div class="place-ic">' + (CAT_IC[e.cat] || '🧾') + '</div><div class="exp-body"><div class="exp-desc">' + esc(e.desc || e.cat) + '</div><div class="exp-sub">' + esc(e.payer) + ' ha pagato · tra ' + e.who.length + '</div></div><div class="exp-amt">' + eur(e.amount) + '</div></div>').join('') + '</details>').join('') + '</div>' : '') +

      '<details class="t-card"><summary class="t-title">Impostazioni</summary>' +
      '<label class="t-label">SONO</label><select class="t-select" id="sp-me">' + S.people.map((p) => '<option' + (p === S.me ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select>' +
      '<label class="t-label">CODICE VIAGGIO</label><input class="t-input" id="sp-code2" value="' + esc(S.code) + '">' +
      '<label class="t-label">PARTECIPANTI</label><input class="t-input" id="sp-names2" value="' + esc(S.people.join(', ')) + '">' +
      '<div class="t-row t-gap"><button class="t-btn ghost small" id="sp-save">Salva</button><button class="t-btn ghost small" id="sp-reset">Cancella i dati di questo telefono</button></div>' +
      (SYNC_URL ? '' : '<div class="t-note small t-gap">Il database condiviso non è ancora collegato: le spese restano su questo telefono.</div>') + '</details>';

    $('#sp-add').addEventListener('click', () => {
      const amount = Math.round(parseFloat(($('#sp-amt').value || '').replace(',', '.')) * 100);
      if (!(amount > 0)) { $('#sp-amt').focus(); return; }
      const who = $$('.sp-who').filter((c) => c.checked).map((c) => c.value);
      if (!who.length) return;
      S.records.push({ id: newId(), t: 'e', amount, desc: $('#sp-desc').value.trim(), cat: $('#sp-cat').value, payer: $('#sp-payer').value, who, ts: Date.now(), synced: false });
      S.me = $('#sp-payer').value;
      saveS(); renderSpese(); syncSpese();
    });
    const cb = $('#sp-close');
    if (cb) cb.addEventListener('click', () => {
      if (!confirm('Chiudere i conti? Le ' + ex.length + ' spese vanno nello storico e i saldi ripartono da zero.')) return;
      S.records.push({ id: newId(), t: 'c', ts: Date.now(), ids: ex.map((e) => e.id), total, settle, synced: false });
      saveS(); renderSpese(); syncSpese();
    });
    $$('[data-del]').forEach((b) => b.addEventListener('click', () => {
      if (!confirm('Eliminare questa spesa?')) return;
      S.records.push({ id: newId(), t: 'd', target: b.dataset.del, ts: Date.now(), synced: false });
      saveS(); renderSpese(); syncSpese();
    }));
    $('#sp-me').addEventListener('change', (e) => { S.me = e.target.value; saveS(); });
    $('#sp-save').addEventListener('click', () => {
      const names = $('#sp-names2').value.split(',').map((x) => x.trim()).filter(Boolean);
      S.code = $('#sp-code2').value.trim() || S.code;
      if (names.length && names.join('|') !== S.people.join('|')) S.records.push({ id: 'people', t: 'p', names, ts: Date.now(), synced: false });
      saveS(); renderSpese(); syncSpese();
    });
    $('#sp-reset').addEventListener('click', () => {
      if (!confirm('Cancello tutte le spese salvate su questo telefono?')) return;
      S = { code: '', me: '', people: [], records: [] }; saveS(); renderSpese();
    });
  }

  // Ogni record è una riga a sé in Firebase: /trips/<codice>/<tipo>-<id>.json, quindi nessuna sovrascrittura tra telefoni
  async function syncSpese() {
    if (!SYNC_URL || !S.code) return;
    const base = SYNC_URL.replace(/\/$/, '') + '/trips/' + encodeURIComponent(S.code);
    const pending = S.records.filter((r) => !r.synced);
    try {
      await Promise.all(pending.map(({ synced, ...r }) =>
        fetch(base + '/' + r.t + '-' + encodeURIComponent(r.id) + '.json', { method: 'PUT', body: JSON.stringify(r) })
          .then((res) => { if (!res.ok) throw new Error('HTTP ' + res.status); })));
      pending.forEach((r) => { r.synced = true; });
      const res = await fetch(base + '.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const remote = (await res.json()) || {};
      const byId = new Map(S.records.map((r) => [r.id + r.t, r]));
      Object.values(remote).forEach((r) => {
        if (!r || !r.id || !r.t) return;
        const cur = byId.get(r.id + r.t);
        if (!cur) { const n = Object.assign({}, r, { synced: true }); S.records.push(n); byId.set(r.id + r.t, n); }
        else if (r.t === 'p' && r.ts > cur.ts) Object.assign(cur, r, { synced: true });
      });
      syncState = 'ok';
    } catch (e) {
      syncState = 'err';
    }
    saveS();
    if ($('#tool-spese').classList.contains('active') && !document.activeElement.matches('input,select')) renderSpese();
  }
  if (SYNC_URL) {
    syncState = 'ok';
    setInterval(() => { if (!document.hidden && $('#tool-spese').classList.contains('active')) syncSpese(); }, 20000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncSpese(); });
  }

  // ── Documenti (IndexedDB) ──
  let db = null;
  function openDb() {
    return new Promise((ok, ko) => {
      const rq = indexedDB.open('madrid-docs', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('docs', { keyPath: 'id' });
      rq.onsuccess = () => ok(rq.result); rq.onerror = () => ko(rq.error);
    });
  }
  // attività a cui si può collegare un biglietto: il nome è lo stesso della tappa
  const DOC_STOPS = ['Volo di andata', 'Volo di ritorno', 'Alloggio', 'Puerta del Sol', 'Festa dopo la mezzanotte', 'Cena del 31'];
  let docFilter = '', docsCache = [];
  (function () { const sel = $('#doc-stop'); if (sel) sel.innerHTML = '<option value="">Altro (passaporto, assicurazione...)</option>' + DOC_STOPS.map((x) => '<option>' + esc(x) + '</option>').join(''); })();
  const blobOf = (d) => d.blob || new Blob([d.data], { type: d.type });
  const tx = (mode) => db.transaction('docs', mode).objectStore('docs');
  const dbAll = () => new Promise((ok, ko) => { const r = tx('readonly').getAll(); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });

  async function renderDocs() {
    const box = $('#doc-list');
    if (!db) { box.innerHTML = '<div class="t-note">Il salvataggio dei documenti non è disponibile in questo browser.</div>'; return; }
    docsCache = (await dbAll()).sort((a, b) => b.added - a.added);
    const docs = docFilter ? docsCache.filter((d) => d.stop === docFilter) : docsCache;
    const bar = docFilter ? '<div class="doc-filter"><span>Biglietti: ' + esc(docFilter) + '</span><button id="doc-all">Mostra tutti</button></div>' : '';
    if (!docs.length && docFilter) { box.innerHTML = bar + '<div class="t-note">Nessun biglietto caricato per questa attività. Scegli "' + esc(docFilter) + '" nel menù qui sopra e aggiungi la foto o il PDF.</div>'; $('#doc-all').onclick = () => { docFilter = ''; renderDocs(); }; const sel = $('#doc-stop'); if (sel) sel.value = docFilter; return; }
    if (!docs.length) { box.innerHTML = '<div class="t-note">Nessun documento. Aggiungi biglietti, QR delle prenotazioni, passaporto o assicurazione.</div>'; return; }
    box.innerHTML = bar + '<div class="doc-grid">' + docs.map((d) =>
      '<div class="doc" data-id="' + d.id + '"><div class="doc-thumb">' + (d.type.startsWith('image/') ? '<img alt="" data-thumb="' + d.id + '">' : '📄') +
      '</div><div class="doc-name">' + esc(d.title) + '</div>' + (d.stop ? '<div class="doc-stop">' + esc(d.stop) + '</div>' : '') + '<button class="x-btn" data-rm="' + d.id + '" aria-label="Elimina">✕</button></div>').join('') + '</div>';
    if (docFilter) { $('#doc-all').onclick = () => { docFilter = ''; renderDocs(); }; const sel = $('#doc-stop'); if (sel) sel.value = docFilter; }
    docs.forEach((d) => { const im = $('[data-thumb="' + d.id + '"]'); if (im) im.src = URL.createObjectURL(blobOf(d)); });
    $$('.doc', box).forEach((el) => el.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-rm]')) return;
      const d = docs.find((x) => x.id === el.dataset.id);
      openDoc(d);
    }));
    $$('[data-rm]', box).forEach((b) => b.addEventListener('click', () => {
      if (!confirm('Eliminare questo documento dal telefono?')) return;
      const r = tx('readwrite').delete(b.dataset.rm); r.onsuccess = renderDocs;
    }));
  }
  function openDoc(d) {
    const url = URL.createObjectURL(blobOf(d));
    if (d.type.startsWith('image/')) {
      $('#viewer-title').textContent = d.title; $('#viewer-img').src = url; $('#viewer').classList.add('open');
    } else {
      window.open(url, '_blank');
    }
  }
  $('#viewer-close').addEventListener('click', () => { $('#viewer').classList.remove('open'); $('#viewer-img').removeAttribute('src'); });
  // dal pulsante "Biglietto" di una tappa: un solo biglietto si apre subito, più biglietti si vedono in elenco
  window.AMS_openTickets = (nome, goDoc) => {
    const key = DOC_STOPS.find((k) => (nome || '').indexOf(k) === 0) || '';
    const mine = key ? docsCache.filter((d) => d.stop === key) : [];
    if (mine.length === 1) { openDoc(mine[0]); return; }
    docFilter = key; goDoc(); renderDocs();
  };
  $('#doc-add').addEventListener('click', () => $('#doc-file').click());
  $('#doc-file').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []), msg = $('#doc-msg');
    if (msg) msg.textContent = '';
    let fatti = 0;
    for (const f of files) {
      const title = $('#doc-title').value.trim() || f.name.replace(/\.[^.]+$/, '') || 'Documento';
      try {
        if (!db) db = await openDb();
        // si salva il contenuto, non il File: su iPhone il File preso dal selettore non si lascia memorizzare
        const data = await f.arrayBuffer();
        await new Promise((ok, ko) => { const r = tx('readwrite').put({ id: newId(), title, type: f.type || 'application/octet-stream', data, stop: ($('#doc-stop') || {}).value || '', added: Date.now() }); r.onsuccess = ok; r.onerror = () => ko(r.error); });
        fatti++;
      } catch (err) {
        if (msg) msg.textContent = 'Non sono riuscito a salvare "' + f.name + '": ' + ((err && (err.message || err.name)) || 'errore sconosciuto') + '. Se il file è molto grande, prova con una foto o uno screenshot del biglietto.';
      }
    }
    if (fatti && msg) msg.textContent = fatti === 1 ? 'Documento salvato su questo telefono.' : fatti + ' documenti salvati su questo telefono.';
    $('#doc-title').value = ''; e.target.value = '';
    renderDocs();
  });
  openDb().then((d) => { db = d; renderDocs(); if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); }).catch(() => renderDocs());

  // ── Navigatore ──
  function buildDestinations() {
    const groups = [{ label: 'Alloggio', items: [{ n: HOTEL.name, q: HOTEL.q }] }];
    $$('.screen').slice(0, 5).forEach((s) => {
      const day = ($('.day-hero-date', s) || {}).textContent || '';
      const items = [];
      $$('.tappa', s).forEach((t) => {
        const a = $('a[href*="maps.google.com/?q="]', t), nm = $('.tappa-name', t);
        if (!a || !nm) return;
        const q = decodeURIComponent(a.getAttribute('href').split('?q=')[1].replace(/\+/g, ' '));
        items.push({ n: nm.textContent.trim(), q });
      });
      if (items.length) groups.push({ label: day.trim(), items });
    });
    groups.push({ label: 'Luoghi famosi', items: FAMOUS.map((p) => ({ n: p.n, q: p.n + ' Madrid' })) });
    return groups;
  }
  (function initNav() {
    const sel = $('#nav-dest');
    const groups = buildDestinations();
    sel.innerHTML = groups.map((g, gi) => '<optgroup label="' + esc(g.label) + '">' + g.items.map((it, ii) => '<option value="' + gi + '.' + ii + '">' + esc(it.n) + '</option>').join('') + '</optgroup>').join('');
    $$('[data-mode]').forEach((b) => b.addEventListener('click', () => {
      const [gi, ii] = sel.value.split('.').map(Number);
      const dest = groups[gi].items[ii];
      window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(dest.q) + '&travelmode=' + b.dataset.mode, '_blank');
    }));
  })();

  // ── Punti da ricordare: foto scattata sul momento e posizione presa dal telefono ──
  let pdb = null, pinImg = null, pinShown = [];
  function openPinDb() {
    return new Promise((ok, ko) => {
      const rq = indexedDB.open('madrid-pins', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('pins', { keyPath: 'id' });
      rq.onsuccess = () => ok(rq.result); rq.onerror = () => ko(rq.error);
    });
  }
  const ptx = (m) => pdb.transaction('pins', m).objectStore('pins');
  const pAll = () => new Promise((ok, ko) => { const r = ptx('readonly').getAll(); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
  const pPut = (v) => new Promise((ok, ko) => { const r = ptx('readwrite').put(v); r.onsuccess = ok; r.onerror = () => ko(r.error); });
  const pDel = (id) => new Promise((ok) => { const r = ptx('readwrite').delete(id); r.onsuccess = ok; r.onerror = ok; });

  // foto rimpicciolita: tiene il telefono leggero e non perde nulla di utile
  async function shrinkPhoto(file) {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const k = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.82));
      if (blob) return { data: await blob.arrayBuffer(), type: 'image/jpeg' };
    } catch (e) { /* si salva l'originale */ }
    return { data: await file.arrayBuffer(), type: file.type || 'image/jpeg' };
  }
  // posizione: prima un tentativo veloce, poi uno preciso
  function locate() {
    return new Promise((ok) => {
      if (!navigator.geolocation) return ok(null);
      const fine = () => navigator.geolocation.getCurrentPosition((g) => ok(g), () => ok(null), { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
      navigator.geolocation.getCurrentPosition((g) => ok(g), (e) => { if (e && e.code === 1) ok(null); else fine(); }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
    });
  }
  const pinBlob = (p) => new Blob([p.photo], { type: p.ptype || 'image/jpeg' });
  const when = (ts) => new Date(ts).toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  async function renderPins() {
    const box = $('#pin-list');
    if (!pdb) { box.innerHTML = '<div class="t-note">Il salvataggio dei punti non è disponibile in questo browser.</div>'; return; }
    pinShown = (await pAll()).sort((a, b) => b.ts - a.ts);
    if (!pinShown.length) { box.innerHTML = '<div class="t-title">I tuoi punti</div><div class="t-note">Nessun punto ancora. Quando vedi qualcosa da ricordare, scatta una foto e salvalo qui.</div>'; return; }
    box.innerHTML = '<div class="t-title">I tuoi punti (' + pinShown.length + ')</div>' + pinShown.map((p) => {
      const where = p.lat != null ? 'https://maps.google.com/?q=' + p.lat + ',' + p.lon : '';
      const route = p.lat != null ? 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lon + '&travelmode=walking' : '';
      return '<div class="pin" data-id="' + p.id + '"><button class="pin-th" data-view="' + p.id + '" aria-label="Apri la foto">' + (p.photo ? '<img alt="" data-pth="' + p.id + '">' : '📌') + '</button>' +
        '<div class="pin-body"><div class="pin-name">' + esc(p.title || 'Punto senza nome') + '</div>' +
        '<div class="pin-sub">' + esc(when(p.ts)) + (p.lat == null ? ' · posizione non trovata' : '') + '</div>' + (p.note ? '<div class="pin-sub">' + esc(p.note) + '</div>' : '') +
        '<div class="pin-btns">' + (where ? '<a class="btn-m btn-dark" href="' + where + '" target="_blank">📍 Maps</a><a class="btn-m btn-yellow" href="' + route + '" target="_blank">🚶 Come arrivare</a>' : '') +
        '<button class="t-btn ghost small" data-pdel="' + p.id + '">Elimina</button></div></div></div>';
    }).join('');
    pinShown.forEach((p) => { const im = $('[data-pth="' + p.id + '"]', box); if (im) im.src = URL.createObjectURL(pinBlob(p)); });
    $$('[data-view]', box).forEach((b) => b.addEventListener('click', () => {
      const p = pinShown.find((x) => x.id === b.dataset.view);
      if (!p || !p.photo) return;
      $('#viewer-title').textContent = p.title || 'Punto'; $('#viewer-img').src = URL.createObjectURL(pinBlob(p)); $('#viewer').classList.add('open');
    }));
    $$('[data-pdel]', box).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Eliminare questo punto dal telefono?')) return;
      await pDel(b.dataset.pdel); renderPins();
    }));
  }
  function setPinPhoto(file) {
    if (!file) return;
    pinImg = file;
    $('#pin-prev').innerHTML = '<img alt="Anteprima della foto">';
    $('#pin-prev img').src = URL.createObjectURL(file);
  }
  $('#pin-cam').addEventListener('click', () => $('#pin-file-cam').click());
  $('#pin-gal').addEventListener('click', () => $('#pin-file-gal').click());
  ['#pin-file-cam', '#pin-file-gal'].forEach((id) => $(id).addEventListener('change', (e) => { setPinPhoto((e.target.files || [])[0]); e.target.value = ''; }));
  function resetPin() { pinImg = null; $('#pin-prev').innerHTML = ''; $('#pin-title').value = ''; $('#pin-note').value = ''; $('#pin-pos').textContent = 'Posizione: la prendo da sola quando salvi.'; }
  $('#pin-clear').addEventListener('click', () => { resetPin(); $('#pin-msg').textContent = ''; });
  $('#pin-save').addEventListener('click', async () => {
    const msg = $('#pin-msg'), btn = $('#pin-save');
    if (!pdb) { msg.textContent = 'Il salvataggio non è disponibile in questo browser.'; return; }
    const title = $('#pin-title').value.trim();
    if (!title && !pinImg) { msg.textContent = 'Scrivi un nome o scatta una foto.'; return; }
    btn.disabled = true; msg.textContent = 'Cerco la posizione…'; $('#pin-pos').textContent = 'Cerco la posizione…';
    const g = await locate();
    let photo = null, ptype = '';
    try { if (pinImg) { const s = await shrinkPhoto(pinImg); photo = s.data; ptype = s.type; } } catch (e) { msg.textContent = 'Non riesco a leggere la foto: salvo il punto senza.'; }
    try {
      await pPut({ id: newId(), title, note: $('#pin-note').value.trim(), lat: g ? g.coords.latitude : null, lon: g ? g.coords.longitude : null, acc: g ? Math.round(g.coords.accuracy) : null, photo, ptype, ts: Date.now() });
      msg.textContent = g ? 'Punto salvato con la posizione (precisione circa ' + Math.round(g.coords.accuracy) + ' m).' : 'Punto salvato, ma senza posizione: controlla che la localizzazione sia attiva e permessa.';
      resetPin();
    } catch (e) { msg.textContent = 'Non sono riuscito a salvare: ' + ((e && (e.message || e.name)) || 'errore sconosciuto') + '.'; }
    btn.disabled = false;
    renderPins();
  });
  openPinDb().then((d) => { pdb = d; renderPins(); }).catch(() => renderPins());

  // ── Torna al primo schermo quando si apre da un link con #strumenti ──
  if (location.hash === '#strumenti' && typeof showScreen === 'function') showScreen(7, false);
})();
