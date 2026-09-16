/* Qualiphy Clinic Signup mockup v2 - app shell
   No framework, no build step, no network. Open index.html and it runs. */

const STORE_KEY = 'qualiphy-setup-wizard-mockup-v2';

/* ---------- state ---------- */
function seedQState() { const s = {}; QUESTIONS.forEach(q => { s[q.id] = q.state; }); return s; }

function freshForm() {
  return {
    account: { email: '' },
    terms: { accepted: false },
    clinic: { practice: '', phone: '', address1: '', address2: '', city: '', state: '', zip: '', adminName: '', adminPhone: '', multi: 'one', addrQuery: '', addrPicked: false, addrManual: false },
    md: { name: '', email: '', phone: '', npi: '', verified: null },
    agreement: { level: 'rx', signed: false },
    exams: { services: [], quidgetReminder: false },
    payment: { done: false },
  };
}

let state = {
  view: 'signup',          // signup | portal | bank | written | settings | decisions | export
  showPlumbing: false,
  qstate: seedQState(),
  order: QUESTIONS.map(q => q.id),
  step: 0,                 // index into STEPS
  sub: 0,                  // sub-step inside 'profile'
  form: {                  // everything the clinic typed
    account: { email: '' },
    terms: { accepted: false },
    clinic: { practice: '', phone: '', address1: '', address2: '', city: '', state: '', zip: '', adminName: '', adminPhone: '', multi: 'one', addrQuery: '', addrPicked: false, addrManual: false },
    md: { name: '', email: '', phone: '', npi: '', verified: null },
    agreement: { level: 'rx', signed: false },
    exams: { services: [], quidgetReminder: false },
    payment: { done: false },
  },
  answers: {},
  settingsFilter: 'all',
  tour: { active: false, step: 0, done: false },
  portalPage: 'dashboard',
  settingsPanel: null,
  showKey: false,
};

function load() {
  try {
    if (/[?&]fresh=1/.test(location.search)) { sessionStorage.removeItem(STORE_KEY); try { localStorage.removeItem(STORE_KEY); } catch (x) {} return; }
    try { localStorage.removeItem(STORE_KEY); } catch (x) {}   /* older builds persisted here */
    const raw = sessionStorage.getItem(STORE_KEY); if (!raw) return;
    const s = JSON.parse(raw);
    if (s.qstate) Object.keys(state.qstate).forEach(k => { if (s.qstate[k]) state.qstate[k] = s.qstate[k]; });
    if (Array.isArray(s.order)) { const known = s.order.filter(id => QUESTIONS.some(q => q.id === id)); QUESTIONS.forEach(q => { if (!known.includes(q.id)) known.push(q.id); }); state.order = known; }
    if (s.form) Object.keys(state.form).forEach(k => { if (s.form[k]) Object.assign(state.form[k], s.form[k]); });
    if (s.answers) state.answers = s.answers;
    if (typeof s.showPlumbing === 'boolean') state.showPlumbing = s.showPlumbing;
    if (typeof s.step === 'number') state.step = s.step;
    if (typeof s.sub === 'number') state.sub = s.sub;
    if (s.view === 'portal') state.view = 'portal';
    if (s.tourDone) state.tour.done = true;
    if (s.portalPage) state.portalPage = s.portalPage;
  } catch (e) { /* private mode / blocked storage - run from seed */ }
}
function save() {
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ qstate: state.qstate, order: state.order, form: state.form, answers: state.answers, showPlumbing: state.showPlumbing, step: state.step, sub: state.sub, view: state.view, tourDone: state.tour.done, portalPage: state.portalPage })); } catch (e) { /* ignore */ }
}


/* ---------- inline icons (react-icons look-alikes, 20px) ---------- */
const ICONS = {
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M14 9h5a1 1 0 0 1 1 1v11"/><path d="M8 8h2M8 12h2M8 16h2M17 13h1M17 17h1"/><path d="M2 21h20"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6a2 2 0 0 1 2 2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2-2zm0 2v2h6V4H9zm-2 8h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm-4 6c-4.4 0-8 2.2-8 5h16c0-2.8-3.6-5-8-5z"/></svg>',
  pill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.9 13.1 13.1 4.9a5 5 0 0 1 7.1 7.1l-8.2 8.2a5 5 0 0 1-7.1-7.1zm1.4 1.4a3 3 0 0 0 4.3 4.3l3.5-3.5-4.3-4.3-3.5 3.5z"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.8 7.8 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 2.7a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.8 7.8 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1L11 21h4l.4-2.7a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5L19.4 13zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21 23 12 2 3v7l15 2-15 2v7z"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 4v2h18V9H3zm0 5v3h18v-3H3z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 1-2z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 17l5-5-5-5M15 12H3M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  dash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10-3h8v11h-8V10z"/></svg>',
};

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const q = id => QUESTIONS.find(x => x.id === id);
const isRx = () => state.form.agreement.level === 'rx';
const activeQs = () => state.order.filter(id => state.qstate[id] === 'v1' && (!q(id).onlyIf || (q(id).onlyIf === 'rx' && isRx())));
const mdDisplay = () => state.form.md.name ? `Dr. ${state.form.md.name}` : 'your medical director';
function seedAnswer(id) {
  const Q = q(id); const rec = Q.answers.find(a => a.rec);
  const A = { choice: rec ? rec.id : null, fu: {}, fields: {}, seeded: true };
  Q.followups.forEach(f => { if (f.type === 'radio') { const o = f.options.find(x => x.rec); if (o) A.fu[f.id] = o.id; } });
  return A;
}
const ans = id => state.answers[id] || (state.answers[id] = seedAnswer(id));
const whereBadge = w => `<span class="badge ${WHERE[w].cls}">${esc(WHERE[w].label)}</span>`;
const whereChip = w => `<span class="chip ${WHERE[w].cls}">${esc(WHERE[w].label)}</span>`;
function plumbChips(effects) {
  if (!state.showPlumbing || !effects || !effects.length) return '';
  return '<div class="chips">' + effects.map(e => `<span class="chip ${WHERE[e.where].cls}" title="${esc(e.via || '')}">${esc(e.label)}${e.value ? ' = ' + esc(e.value) : ''} · ${esc(WHERE[e.where].label)}</span>`).join('') + '</div>';
}

/* NPI: 10 digits, Luhn over "80840" + NPI. Then a (mock) registry lookup. */
function npiLuhnOk(npi) {
  if (!/^\d{10}$/.test(npi)) return false;
  const s = '80840' + npi; let tot = 0;
  for (let i = 0; i < s.length; i++) { let d = +s[s.length - 1 - i]; if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; } tot += d; }
  return tot % 10 === 0;
}
function npiLookup(npi) {
  if (!npiLuhnOk(npi)) return { ok: false, reason: /^\d{10}$/.test(npi) ? 'Not a valid NPI (check digit failed).' : 'An NPI is 10 digits.' };
  const rec = NPPES[npi];
  if (rec) return { ok: true, rec };
  return { ok: true, rec: { name: (state.form.md.name || 'PROVIDER').toUpperCase(), credential: '', taxonomy: 'Verified in NPPES', city: '', state: '', status: 'Active' } };
}

/* Everything the answers would write. */
function computeEffects() {
  const out = [];
  const f = state.form;
  out.push({ q: 'Clinic', label: 'Practice name, address, phone', value: f.clinic.practice || 'missing', where: 'signup', status: f.clinic.practice ? 'written' : 'blocked', via: '/clinic_sign_up' });
  out.push({ q: 'Clinic', label: 'Locations', value: f.clinic.multi === 'many' ? 'more than one (added after setup, each needs its own agreement)' : 'one', where: 'portal', status: 'written', via: 'Add Location' });
  out.push({ q: 'Medical director', label: 'Medical Director (name, email, phone)', value: f.md.name || 'missing', where: 'signup', status: f.md.name ? 'written' : 'blocked', via: '/clinic_sign_up' });
  out.push({ q: 'Medical director', label: 'NPI verified against the registry', value: f.md.verified ? f.md.npi : 'not verified', where: 'nowhere', status: f.md.verified ? 'engineering' : 'blocked', via: 'NPI registry lookup' });
  out.push({ q: 'Agreement', label: 'Level of service (clinic_service GFE / RX / BOTH)', value: isRx() ? 'BOTH' : 'GFE', where: 'nowhere', status: 'engineering', via: 'set only by super-admin backoffice today' });
  out.push({ q: 'Agreement', label: 'Merged GFE/Rx service agreement (QualiSign)', value: f.agreement.signed ? 'signed' : 'unsigned', where: 'signup', status: f.agreement.signed ? 'written' : 'blocked', via: 'service agreement' });
  activeQs().forEach(id => {
    const Q = q(id); const A = ans(id);
    if (!A.choice) { out.push({ q: Q.short, label: Q.short, value: 'not answered', where: 'none', status: 'skipped', via: '' }); return; }
    const opt = Q.answers.find(a => a.id === A.choice);
    if (opt) opt.effects.forEach(e => out.push(Object.assign({ q: Q.short, status: WHERE[e.where].status }, e, { value: e.value === 'medical director' ? mdDisplay() : e.value })));
    if (opt && opt.fields) opt.fields.forEach(fl => out.push({ q: Q.short, label: fl, value: A.fields[fl] || 'not provided', where: 'none', status: A.fields[fl] ? 'handoff' : 'skipped', via: 'captured for Med Ops' }));
    Q.followups.forEach(fu => {
      if (!fu.showIf.includes(A.choice)) return;
      if (fu.type === 'toggle') { const on = A.fu[fu.id] === undefined ? fu.default : A.fu[fu.id]; (fu.effects[on ? 'on' : 'off'] || []).forEach(e => out.push(Object.assign({ q: Q.short, status: WHERE[e.where].status }, e))); }
      else if (fu.type === 'radio') { const o = fu.options.find(x => x.id === A.fu[fu.id]); if (o) o.effects.forEach(e => out.push(Object.assign({ q: Q.short, status: WHERE[e.where].status }, e))); else out.push({ q: Q.short, label: fu.label, value: 'not answered', where: 'none', status: 'skipped', via: '' }); }
      else if (fu.type === 'text') { const v = A.fields[fu.id]; fu.effects.forEach(e => out.push(Object.assign({ q: Q.short, status: v ? WHERE[e.where].status : 'skipped', value: v || 'not provided' }, e))); }
      else if (fu.type === 'contacts') { const sel = fu.roles.filter(r => (A.fu[fu.id] || {})[r.id] === undefined ? r.default : A.fu[fu.id][r.id]); fu.effects.forEach((e, i) => out.push(Object.assign({ q: Q.short, status: sel.length ? WHERE[e.where].status : 'blocked', value: i === 0 ? (sel.map(r => r.label).join(', ') || 'none') : sel.length + ' roles' }, e))); }
    });
  });
  const svcs = SERVICES.filter(s => f.exams.services.includes(s.id));
  out.push({ q: 'Exams', label: 'Activated exams (favorites by service)', value: svcs.length ? svcs.flatMap(s => s.exams).length + ' exams across ' + svcs.length + ' services' : 'none', where: 'portal', status: svcs.length ? 'written' : 'skipped', via: 'POST /admin_clinic_exam_hide (per exam)' });
  out.push({ q: 'Payment', label: 'Payment method on file', value: f.payment.done ? 'card ending 4242' : 'missing', where: 'signup', status: f.payment.done ? 'written' : 'blocked', via: '/clinic_save_card' });
  return out;
}
function statusBadge(s) {
  const m = { written: ['ok', 'Written'], support: ['cond', 'Needs Support'], engineering: ['no', 'Engineering needed'], handoff: ['info', 'Handoff'], skipped: ['muted', 'Skipped'], blocked: ['warn', 'Blocks completion'] };
  const [cls, lbl] = m[s] || ['muted', s]; return `<span class="badge ${cls}">${lbl}</span>`;
}
function allEffects(Q) {
  const out = []; Q.answers.forEach(a => out.push(...a.effects));
  Q.followups.forEach(f => { if (f.type === 'toggle') out.push(...f.effects.on, ...f.effects.off); else if (f.type === 'radio') f.options.forEach(o => out.push(...o.effects)); else out.push(...f.effects); });
  return out;
}

/* ---------- step validity ---------- */
const CLINIC_SUBS = 4;
function clinicSubValid(sub) {
  const c = state.form.clinic;
  if (sub === 0) return !!c.practice;
  if (sub === 1) return !!(c.address1 && c.city && c.state && c.zip);
  if (sub === 2) return !!c.adminName;
  return true;
}
let lastSuggest = [];
let geo = { origin: null, mode: 'none', label: '' };   /* mode: none | tz | exact | denied */
function initGeo() {
  try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; const o = TZ_ORIGIN[tz]; if (o) geo = { origin: { lat: o.lat, lng: o.lng }, mode: 'tz', label: o.label }; } catch (x) { /* keep none */ }
}
function distKm(a1, b1) { const R = 6371, dLat = (b1.lat - a1.lat) * Math.PI / 180, dLng = (b1.lng - a1.lng) * Math.PI / 180; const s = Math.sin(dLat / 2) ** 2 + Math.cos(a1.lat * Math.PI / 180) * Math.cos(b1.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s)); }
function cityCoords(city, st) { return CITY_POOL.find(c => c.city === city && c.state === st); }
function rankedCities(list) { if (!geo.origin) return list; return list.slice().sort((x, y) => distKm(geo.origin, x) - distKm(geo.origin, y)); }
function nearestCityLabel() { if (!geo.origin) return ''; const c = rankedCities(CITY_POOL)[0]; return geo.mode === 'exact' ? `${c.city}, ${c.state}` : geo.label; }
function requestExactLocation() {
  if (!navigator.geolocation) { geo.mode = 'denied'; render(); return; }
  navigator.geolocation.getCurrentPosition(pos => { geo = { origin: { lat: pos.coords.latitude, lng: pos.coords.longitude }, mode: 'exact', label: '' }; render(); const el = $('#addr-search'); if (el) el.focus(); },
    () => { geo.mode = geo.origin ? 'tz' : 'denied'; geo.denied = true; render(); }, { maximumAge: 600000, timeout: 8000 });
}
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h >>> 0); }
function addressMatches(qs) {
  const raw = (qs || '').trim(); const q = raw.toLowerCase();
  if (q.length < 2) { lastSuggest = []; return lastSuggest; }
  const out = []; const seen = new Set();
  const push = (m) => { const k = (m.line1 + '|' + m.city).toLowerCase(); if (!seen.has(k) && out.length < 6) { seen.add(k); out.push(m); } };
  // "street part, city part"
  const comma = raw.indexOf(',');
  const streetPart = comma >= 0 ? raw.slice(0, comma) : raw;
  const cityPart = comma >= 0 ? raw.slice(comma + 1).trim().toLowerCase() : '';
  // 1. curated addresses
  const curated = ADDRESSES.filter(x => { const full = (x.line1 + ' ' + x.city + ' ' + x.state + ' ' + x.zip).toLowerCase(); return full.includes(streetPart.toLowerCase()) && (!cityPart || (x.city + ' ' + x.state).toLowerCase().startsWith(cityPart)); });
  (geo.origin ? curated.slice().sort((x, y) => distKm(geo.origin, cityCoords(x.city, x.state) || x) - distKm(geo.origin, cityCoords(y.city, y.state) || y)) : curated).forEach(push);
  // 2. parse "<number> <street words> [suffix]"
  const m = streetPart.trim().match(/^(\d+[a-z]?)?\s*(.*)$/i);
  const num = (m && m[1]) ? m[1] : '';
  const parts = ((m && m[2]) ? m[2] : '').trim().split(/\s+/).filter(Boolean);
  const SUFFIX_WORDS = { st: 'St', street: 'St', ave: 'Ave', avenue: 'Ave', blvd: 'Blvd', boulevard: 'Blvd', dr: 'Dr', drive: 'Dr', rd: 'Rd', road: 'Rd', ln: 'Ln', lane: 'Ln', pkwy: 'Pkwy', parkway: 'Pkwy', way: 'Way', ct: 'Ct', court: 'Ct', pl: 'Pl', place: 'Pl', cir: 'Cir', circle: 'Cir', trl: 'Trl', trail: 'Trl', hwy: 'Hwy', highway: 'Hwy', ter: 'Ter', terrace: 'Ter', loop: 'Loop' };
  let typedSuffix = '';
  if (parts.length > 1) { const last = parts[parts.length - 1].toLowerCase().replace('.', ''); if (SUFFIX_WORDS[last]) { parts.pop(); typedSuffix = SUFFIX_WORDS[last]; } }
  const streetQ = parts.join(' ').toLowerCase();
  let names = streetQ ? STREETS.filter(n => n.toLowerCase().startsWith(streetQ)) : [];
  if (!names.length && streetQ) names = STREETS.filter(n => n.toLowerCase().includes(streetQ));
  if (!names.length && streetQ) names = [streetQ.replace(/\b\w/g, ch => ch.toUpperCase())];
  if (!streetQ && num) names = STREETS.slice(0, 6);
  const number = num || String(100 + (hashStr(q) % 9800));
  const cities = rankedCities(cityPart ? CITY_POOL.filter(c => (c.city + ' ' + c.state).toLowerCase().startsWith(cityPart)) : CITY_POOL);
  if (!cities.length) { lastSuggest = out; return lastSuggest; }
  // few street candidates -> vary suffix and city so the list is always useful
  const perName = Math.max(1, Math.ceil(6 / Math.max(1, Math.min(names.length, 6))));
  names.slice(0, 6).forEach((name, nameIdx) => {
    const h = hashStr(name + number);
    for (let v = 0; v < perName; v++) {
      const suffix = typedSuffix || SUFFIXES[(h + v * 3) % SUFFIXES.length];
      const c = geo.origin ? cities[(nameIdx * perName + v) % Math.min(cities.length, 6)] : cities[((h >>> 3) + v * 7) % cities.length];
      push({ line1: `${number} ${name} ${suffix}`, city: c.city, state: c.state, zip: c.zip });
    }
  });
  lastSuggest = out.slice(0, 6);
  return lastSuggest;
}
/* ---------- live address lookup (OpenStreetMap Nominatim; demo only, debounced, <= 1 req/s) ---------- */
const ADDR_LIVE = { timer: null, ctrl: null, lastQ: '', ok: null, status: '' };
function addrQueryReady(q) { return /\d+\s+[a-z]{3,}/i.test(q.trim()); }
function itemHtml(m, i, q) { return `<div class="sg ${i === 0 ? 'hi' : ''}" data-sg="${i}"><div class="main">${hi(m.line1, q)}</div><div class="sub">${m.city ? esc(m.city) + ', ' : ''}${esc(m.state)} ${esc(m.zip)}</div></div>`; }
function renderSuggest(list, status, q) {
  const box = $('#addr-suggest'); if (!box) return;
  lastSuggest = list;
  box.innerHTML = list.map((m, i) => itemHtml(m, i, q)).join('') + (status ? `<div class="sg-status">${status}</div>` : '');
}
function nominatimUrl(q) {
  const p = new URLSearchParams({ q, format: 'jsonv2', addressdetails: '1', countrycodes: 'us', limit: '6', dedupe: '1' });
  if (geo.origin) { const { lat, lng } = geo.origin; p.set('viewbox', `${(lng - 2).toFixed(3)},${(lat + 2).toFixed(3)},${(lng + 2).toFixed(3)},${(lat - 2).toFixed(3)}`); p.set('bounded', '0'); }
  return 'https://nominatim.openstreetmap.org/search?' + p.toString();
}
function mapNominatim(rows) {
  const out = []; const seen = new Set();
  rows.forEach(r => {
    const ad = r.address || {}; const house = ad.house_number; const road = ad.road || ad.pedestrian || ad.residential; if (!road) return;
    const city = ad.city || ad.town || ad.village || ad.hamlet || ad.municipality || ad.locality || '';   /* never the county */
    const st = STATE_ABBR[ad.state] || ad.state || ''; const zip = ad.postcode || '';
    const line1 = (house ? house + ' ' : '') + road;
    const k = (line1 + '|' + city + '|' + zip).toLowerCase(); if (seen.has(k)) return; seen.add(k);
    out.push({ line1, city, state: st, zip, lat: +r.lat, lng: +r.lon, house: !!house });
  });
  out.sort((x, y) => (y.house - x.house) || (geo.origin ? distKm(geo.origin, x) - distKm(geo.origin, y) : 0));
  return out.slice(0, 6);
}
const ZIP_CITY = {};
async function cityFromZip(zip) {
  const z = String(zip || '').slice(0, 5); if (!/^\d{5}$/.test(z)) return '';
  if (ZIP_CITY[z] !== undefined) return ZIP_CITY[z];
  try { const r = await fetch('https://api.zippopotam.us/us/' + z); if (!r.ok) throw new Error('http ' + r.status); const j = await r.json(); ZIP_CITY[z] = (j.places && j.places[0] && j.places[0]['place name']) || ''; }
  catch (x) { ZIP_CITY[z] = ''; }
  return ZIP_CITY[z];
}
function suggestFor(q) {
  const box = $('#addr-suggest'); if (!box) return;
  if (ADDR_LIVE.timer) clearTimeout(ADDR_LIVE.timer);
  if (ADDR_LIVE.ctrl) { ADDR_LIVE.ctrl.abort(); ADDR_LIVE.ctrl = null; }
  if (!addrQueryReady(q)) { renderSuggest([], q.trim().length >= 2 ? 'Keep typing: house number and street, e.g. 4200 Legacy' : '', q); return; }
  if (window.__ADDR_OFFLINE || ADDR_LIVE.ok === false) { renderSuggest(addressMatches(q), 'Live address lookup is unavailable here, so these are sample suggestions.', q); return; }
  renderSuggest(lastSuggest.filter(m => m.live), 'Searching addresses\u2026', q);
  ADDR_LIVE.timer = setTimeout(async () => {
    const ctrl = new AbortController(); ADDR_LIVE.ctrl = ctrl; ADDR_LIVE.lastQ = q;
    try {
      const res = await fetch(nominatimUrl(q), { signal: ctrl.signal, headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('http ' + res.status);
      const rows = await res.json(); if (ADDR_LIVE.lastQ !== q) return;
      ADDR_LIVE.ok = true;
      const list = mapNominatim(rows).map(m => Object.assign(m, { live: true }));
      await Promise.all(list.filter(m => !m.city && m.zip).map(async m => { m.city = await cityFromZip(m.zip); }));
      if (ADDR_LIVE.lastQ !== q) return;
      renderSuggest(list, list.length ? '' : 'No matching address yet. Keep typing, or enter it manually below.', q);
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      ADDR_LIVE.ok = false;
      renderSuggest(addressMatches(q), 'Live address lookup is unavailable here, so these are sample suggestions.', q);
    }
  }, 650);
}

function hi(text, qs) {
  const q = (qs || '').trim(); if (!q) return esc(text);
  const i = text.toLowerCase().indexOf(q.toLowerCase()); if (i < 0) return esc(text);
  return esc(text.slice(0, i)) + '<b>' + esc(text.slice(i, i + q.length)) + '</b>' + esc(text.slice(i + q.length));
}
function stepValid(id) {
  const f = state.form;
  switch (id) {
    case 'account': return /.+@.+\..+/.test(f.account.email);
    case 'terms': return f.terms.accepted;
    case 'clinic': return clinicSubValid(state.sub);
    case 'md': return !!(f.md.name && /.+@.+\..+/.test(f.md.email) && f.md.verified === true);
    case 'agreement': return f.agreement.signed;
    case 'profile': return true;
    case 'exams': return true;
    case 'payment': return f.payment.done;
  }
  return true;
}

/* ---------- renderers ---------- */
function stepper() {
  return `<div class="stepper">${STEPS.map((s, i) => `<div class="st ${i < state.step ? 'done' : i === state.step ? 'cur' : ''}"><div class="dot">${i < state.step ? '&#10003;' : i + 1}</div><div class="lbl">${esc(s.label)}</div></div>`).join('')}</div>`;
}
function field(label, path, opts = {}) {
  const [g, k] = path.split('.'); const v = state.form[g][k];
  return `<div class="field ${opts.err ? 'err' : ''}"><label>${label ? esc(label) : '&nbsp;'}</label><input type="${opts.type || 'text'}" data-path="${path}" value="${esc(v)}" placeholder="${esc(opts.ph || '')}" ${opts.ro ? 'readonly' : ''} ${opts.max ? `maxlength="${opts.max}"` : ''} />${opts.hint ? `<div class="hint">${opts.hint}</div>` : ''}${opts.msg || ''}</div>`;
}
function selectField(label, path, options, ph) {
  const [g, k] = path.split('.'); const v = state.form[g][k];
  return `<div class="field"><label>${esc(label)}</label><select data-path="${path}"><option value="">${esc(ph || 'Select')}</option>${options.map(o => `<option value="${esc(o)}" ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
}
const firstName = () => (state.form.clinic.adminName || '').trim().split(/\s+/)[0] || '';
function footer(nextLabel, canNext, extraLeft = '') {
  return `<div class="card-f"><div class="left">${state.step > 0 ? '<button class="btn" id="btn-back">Back</button>' : ''}${extraLeft}</div><button class="btn primary" id="btn-next" ${canNext ? '' : 'disabled'}>${nextLabel}</button></div>`;
}
function card(kicker, title, sub, body, foot) {
  return `<div class="card"><div class="card-h">${kicker ? `<div class="step-kicker">${esc(kicker)}</div>` : ''}<h2>${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div><div class="card-b">${body}</div>${foot || ''}</div>`;
}

const R = {};

R.account = () => `<div class="auth"><div class="auth-card">
  <img class="logo" src="assets/logo_black.png" alt="Qualiphy" />
  <h2>Create Free Account</h2>
  <div class="sub">Please Enter Your Details to Try Us Out!</div>
  <input class="plain" type="email" id="acct-email" data-path="account.email" value="${esc(state.form.account.email)}" placeholder="example@qualiphy.me" />
  <button class="btn primary" id="btn-next" ${stepValid('account') ? '' : 'disabled'}>Sign Up</button>
  <div class="foot">Already have an account? <b>Login</b></div>
  <div class="foot">Connect to a provider in seconds!</div>
  <div class="demo"><button class="link" id="btn-fill-account">Use sample</button></div>
</div></div>`;

R.terms = () => card('Step 2 of 8', 'Terms of use', 'Please review and accept to continue.',
  `<div class="terms-box"><h4>Qualiphy Terms of Use (summary for the demo)</h4>Qualiphy PC provides asynchronous and synchronous good faith exams and prescription consultations to licensed clinics. The clinic is responsible for the accuracy of the information it provides, for maintaining a supervising medical director where required by state law, and for its own patient communications when it elects to send them. Fees are billed per completed exam. Qualiphy is a consulting entity and does not serve as the patient’s primary care provider. Full terms are provided in the signed service agreement.<br/><br/>By continuing you confirm you are authorised to bind the clinic to these terms.</div>
   <label class="check ${state.form.terms.accepted ? 'on' : ''}" style="margin-top:14px"><input type="checkbox" data-path="terms.accepted" ${state.form.terms.accepted ? 'checked' : ''} /><div><div class="t">I have read and accept the Terms of Use</div><div class="n">Figma: Terms of Use Confirmation.</div></div></label>`,
  footer('Continue', stepValid('terms')));

R.clinic = () => {
  const c = state.form.clinic; const sub = state.sub;
  const bar = '';
  let title = '', help = '', body = '';
  if (sub === 0) {
    title = 'What is your practice called?'; help = 'This is the name patients and providers will see.';
    body = `<div class="grid two">${field('Name of Practice', 'clinic.practice', { ph: 'Name of Practice' })}${field('Practice phone (optional)', 'clinic.phone', { ph: '(___) ___-____' })}</div>`;
  } else if (sub === 1) {
    title = 'Where is your practice located?'; help = 'Start typing and pick your address. You can edit anything after.';
    const picked = c.addrPicked || c.addrManual;
    if (!picked) {
      body = `<div class="field addr-wrap"><label>Address</label><span class="pin">${ICONS.pin}</span><input id="addr-search" data-addr="1" value="${esc(c.addrQuery)}" placeholder="Start with the house number, e.g. 4200 Legacy Dr" autocomplete="off" /><div class="suggest" id="addr-suggest"></div></div>
        <div class="muted small geo-line" style="margin-top:10px">Can't find it? <button class="link purple" id="addr-manual">Enter the address manually</button></div>`;
    } else {
      body = `${c.addrPicked ? `<div class="addr-picked"><div class="picked"><div><div class="t">${esc(c.address1)}</div><div class="d">${esc(c.city)}, ${esc(c.state)} ${esc(c.zip)}</div></div><button class="link purple" id="addr-change">Change</button></div></div>` : ''}
        <div class="grid two" style="margin-top:16px">${field('Address Line 1', 'clinic.address1', { ph: 'Address Line 1' })}${field('Address Line 2 (optional)', 'clinic.address2', { ph: 'Suite, floor, unit' })}</div>
        <div class="grid three" style="margin-top:16px">${field('City', 'clinic.city', { ph: 'City' })}${selectField('State', 'clinic.state', STATES, 'Select State')}${field('Zip Code', 'clinic.zip', { max: 10, ph: 'Zip Code' })}</div>`;
    }
  } else if (sub === 2) {
    title = 'Who manages this account?'; help = 'The person we contact about the account. Signed in as ' + (state.form.account.email || 'you') + '.';
    body = `<div class="grid two">${field('Full Name', 'clinic.adminName', { ph: 'Full Name' })}${field('Phone Number', 'clinic.adminPhone', { ph: '(___) ___-____' })}</div>`;
  } else {
    title = 'Do you have more than one location?'; help = 'You can add more locations any time from Locations.';
    body = `<div class="opts">
       <label class="opt ${c.multi === 'one' ? 'sel' : ''}" data-radio="clinic.multi" data-val="one"><div class="t">Just this one <span class="rec-txt">Most clinics</span></div></label>
       <label class="opt ${c.multi === 'many' ? 'sel' : ''}" data-radio="clinic.multi" data-val="many"><div class="t">More than one</div><div class="d">Add the others from Locations after setup. Each location signs its own agreement and can have its own medical director.</div></label>
     </div>`;
  }
  const foot = `<div class="card-f"><div class="left"><button class="btn" id="btn-back">Back</button>${sub === 0 ? '<button class="link" id="btn-fill-clinic">Use sample</button>' : ''}</div><button class="btn primary" id="btn-next" ${clinicSubValid(sub) ? '' : 'disabled'}>Continue</button></div>`;
  return `<div class="focus-q">${bar}${card('', title, help, body, foot)}</div>`;
};

R.md = () => {
  const m = state.form.md;
  let msg = '';
  if (m.npi && m.verified === true) { const r = npiLookup(m.npi).rec; msg = `<div class="msg ok">&#10003; Verified in the NPI registry: ${esc(r.name)}${r.credential ? ', ' + esc(r.credential) : ''}${r.taxonomy ? ' · ' + esc(r.taxonomy) : ''}${r.city ? ' · ' + esc(r.city) + ', ' + esc(r.state) : ''} · ${esc(r.status)}</div>`; }
  else if (m.npi && m.verified === false) { msg = `<div class="msg err">${esc(npiLookup(m.npi).reason || 'We could not verify this NPI.')} Check the number on <a href="https://npiregistry.cms.hhs.gov/" target="_blank" rel="noopener">npiregistry.cms.hhs.gov</a>.</div>`; }
  else if (m.npi) { msg = '<div class="msg wait">Enter all 10 digits and we will verify it.</div>'; }
  return card('Step 4 of 8', 'Your medical director', 'The physician who supervises care at your clinic. We verify the NPI before you can continue.',
    `<div class="grid two">${field('Full name', 'md.name', { ph: 'First Last' })}${field('Email', 'md.email', { type: 'email' })}</div>
     <div class="grid two" style="margin-top:14px">${field('Phone', 'md.phone')}${field('NPI number', 'md.npi', { max: 10, ph: '10 digits', err: m.verified === false, msg })}</div>
     ${m.verified === false ? '<div class="callout warn" style="margin-top:14px"><strong>We could not verify this medical director.</strong> Setup cannot continue until the NPI matches an active record. If you are not sure who your medical director is, save your progress and come back.</div>' : ''}
     `,
    footer('Verify and continue', stepValid('md'), '<button class="link" id="btn-fill-md">Use sample</button>'));
};

R.agreement = () => {
  const a = state.form.agreement;
  return card('Step 5 of 8', 'Choose your level of service and sign', 'One agreement covers both good faith exams and prescriptions, so you never have to come back for a second signature.',
    `<div class="levels">
       <div class="level ${a.level === 'gfe' ? 'sel' : ''}" data-level="gfe"><div class="t">Good faith exams</div><div class="d">Medical clearance for aesthetics, IV therapy and wellness services.</div><ul><li>Async or live video exams</li><li>Results back to your portal</li></ul></div>
       <div class="level ${a.level === 'rx' ? 'sel' : ''}" data-level="rx"><div class="t">Good faith exams + prescriptions <span class="rec-txt">Recommended</span></div><div class="d">Everything in GFE, plus prescription consultations with pharmacy fulfilment.</div><ul><li>GLP-1, peptides, hair, ED, hormones</li><li>Partner pharmacy shipping and tracking</li></ul></div>
     </div>
     <div class="sign">
       <div class="doc"><div><div class="t">Qualiphy Service Agreement (GFE and Rx)</div><div class="d">Signed by ${esc(state.form.clinic.adminName || 'you')} on behalf of ${esc(state.form.clinic.practice || 'the clinic')}${a.level === 'rx' ? `, with medical director ${esc(mdDisplay())} countersigning the prescribing addendum` : ''}.</div></div>
         ${a.signed ? `<div class="sigline">${esc(state.form.clinic.adminName || 'Dana Whitfield')}</div>` : '<button class="btn primary sm" id="btn-sign">Review and sign</button>'}</div>
       ${a.level === 'rx' ? `<div class="doc"><div><div class="t">Prescribing addendum</div><div class="d">Sent to ${esc(state.form.md.email || 'your medical director')} for QualiSign. You can keep going; prescribing unlocks when it is countersigned.</div></div><span class="badge ${a.signed ? 'cond' : 'muted'}">${a.signed ? 'Sent to MD' : 'Waiting'}</span></div>` : ''}
     </div>
     `,
    footer('Continue', stepValid('agreement')));
};

R.profile = () => {
  const ids = activeQs();
  if (!ids.length) return card('Step 6 of 8', 'Setup questions', '', '<div class="empty">No questions are in v1. Add some in Questions.</div>', footer('Continue', true));
  if (state.sub >= ids.length) state.sub = ids.length - 1;
  const id = ids[state.sub]; const Q = q(id); const A = ans(id);
  const substeps = '';
  const opts = Q.answers.map(a => {
    const desc = a.dynamicDesc === 'md' ? `${esc(mdDisplay())}${state.form.md.email ? ', ' + esc(state.form.md.email) : ''}, entered a moment ago. You can change it per location later.` : esc(a.desc || '');
    return `<label class="opt ${A.choice === a.id ? 'sel' : ''}" data-q="${id}" data-a="${a.id}"><div class="t">${esc(a.label)} ${a.rec ? '<span class="rec-txt">Recommended</span>' : ''}</div>${desc ? `<div class="d">${desc}</div>` : ''}${plumbChips(a.effects)}</label>`;
  }).join('');
  let extra = '';
  const chosen = Q.answers.find(a => a.id === A.choice);
  if (chosen && chosen.upsell) {
    const on = !!state.form.exams.quidgetReminder;
    extra += `<div class="quidget"><div class="wp">W</div><div><div class="t">Have a WordPress website? Add telehealth to it with our Quidget plugin.</div><div class="d">Qualiphy's free WordPress plugin lets patients start a Good Faith Exam from any page of your site. You can set it up any time after this; the plugin key will be under Settings &rsaquo; API access.</div></div><div class="act">${on ? '<span class="added">&#10003; Added to your setup checklist</span>' : '<button class="btn lav sm" id="quidget-remind">Remind me after setup</button>'}</div></div>`;
  }
  if (chosen && chosen.fields) extra += `<div class="sub-block"><div class="grid ${chosen.fields.length > 2 ? 'three' : 'two'}">${chosen.fields.map(fl => `<div class="field"><label>${esc(fl)}</label><input data-q="${id}" data-field="${esc(fl)}" value="${esc(A.fields[fl] || '')}" /></div>`).join('')}</div>${Q.id === 'pharmacy' && A.choice === 'own' ? '<div class="note" style="margin-top:8px">Our Med Ops team will review this pharmacy before your first prescription. You will not get shipment tracking or delivery confirmation from Qualiphy for orders sent here.</div>' : ''}</div>`;
  const visible = A.choice ? Q.followups.filter(f => f.showIf.includes(A.choice)) : [];
  const toggles = visible.filter(f => f.type === 'toggle');
  const others = visible.filter(f => f.type !== 'toggle');
  if (toggles.length) {
    const title = (Q.groupTitle && Q.groupTitle[A.choice]) || `Because you chose "${chosen ? chosen.label : ''}":`;
    extra += `<div class="fu-group"><div class="fu-title">${esc(title)}</div>${toggles.map(f => { const on = A.fu[f.id] === undefined ? f.default : A.fu[f.id]; return `<label class="switch-row ${on ? 'on' : ''}"><div class="txt">${esc(f.label)}${plumbChips(f.effects[on ? 'on' : 'off'])}</div><div class="ctl"><span class="sw-lbl">${on ? 'Yes' : 'No'}</span><span class="switch ${on ? 'on' : ''}"><input type="checkbox" data-q="${id}" data-fu="${f.id}" ${on ? 'checked' : ''} /><span class="knob"></span></span></div></label>`; }).join('')}</div>`;
  }
  others.forEach(f => {
    if (f.type === 'radio') { extra += `<div class="sub-block"><div class="lbl">${esc(f.label)}</div><div class="opts">${f.options.map(o => `<label class="opt ${A.fu[f.id] === o.id ? 'sel' : ''}" data-q="${id}" data-fu="${f.id}" data-o="${o.id}"><div class="t">${esc(o.label)} ${o.rec ? '<span class="rec-txt">Recommended</span>' : ''}</div>${o.desc ? `<div class="d">${esc(o.desc)}</div>` : ''}${plumbChips(o.effects)}</label>`).join('')}</div></div>`; }
    else if (f.type === 'text') { extra += `<div class="sub-block"><div class="field"><label>${esc(f.label)}</label><input data-q="${id}" data-fu-text="${f.id}" value="${esc(A.fields[f.id] || '')}" placeholder="${esc(f.placeholder || '')}" /></div>${plumbChips(f.effects)}</div>`; }
    else if (f.type === 'contacts') { const sel = A.fu[f.id] || {}; extra += `<div class="sub-block"><div class="lbl">${esc(f.label)}</div><div class="chips-pick">${f.roles.map(r => { const on = sel[r.id] === undefined ? r.default : sel[r.id]; return `<label class="chip-pick ${on ? 'on' : ''}"><input type="checkbox" data-q="${id}" data-role="${r.id}" data-fu="${f.id}" ${on ? 'checked' : ''} />${esc(r.label)}</label>`; }).join('')}</div>${plumbChips(f.effects)}</div>`; }
  });
  const body = `${substeps}<h3 style="margin:0 0 4px;font-size:18px;font-weight:600">${esc(Q.title)}</h3><div class="muted" style="margin-bottom:14px">${esc(Q.help)}</div><div class="opts">${opts}</div>${extra}`;
  const last = state.sub === ids.length - 1;
  return card('Step 6 of 8', 'A few questions to set up your account', 'We pre-filled the usual choice. Change anything you like; everything is editable later in Settings.', body,
    `<div class="card-f"><div class="left"><button class="btn" id="btn-back">Back</button><button class="link" id="btn-skip">Skip for now</button></div><button class="btn primary" id="btn-next" ${A.choice ? '' : 'disabled'}>${last ? 'Continue' : 'Next'}</button></div>`);
};

R.exams = () => {
  const sel = state.form.exams.services;
  return card('Step 7 of 8', 'Which services do you offer?', 'We will activate the matching exams as your favorites so they are ready on day one. You can change this any time in Exams.',
    `<div class="services">${SERVICES.map(s => { const locked = s.rx && !isRx(); const on = sel.includes(s.id); return `<label class="svc ${on ? 'sel' : ''} ${locked ? 'locked' : ''}"><input type="checkbox" data-svc="${s.id}" ${on ? 'checked' : ''} ${locked ? 'disabled' : ''} /><div><div class="t">${esc(s.label)}${locked ? ' <span class="badge muted">needs prescriptions</span>' : ''}</div><div class="d">${esc(s.exams.join(', '))}</div></div></label>`; }).join('')}</div>
     <div class="muted small" style="margin-top:12px">${sel.length ? SERVICES.filter(s => sel.includes(s.id)).flatMap(s => s.exams).length + ' exams will be activated.' : 'Nothing selected yet. You can also skip and pick exams later.'}</div>
     `,
    footer('Continue', true, '<button class="link" id="btn-skip-exams">Skip for now</button>'));
};

R.payment = () => card('Step 8 of 8', 'Add a payment method', 'You are billed per completed exam. Nothing is charged today.',
  `<div class="cardmock">${state.form.payment.done ? '<div class="row spread"><div><div style="font-weight:600">Visa ending 4242</div><div class="muted small">Expires 12/28</div></div><span class="badge ok">On file</span></div>' : '<div class="grid two"><div class="field"><label>Card number</label><input placeholder="4242 4242 4242 4242" id="pm-num" /></div><div class="field"><label>Name on card</label><input placeholder="Dana Whitfield" /></div></div><div class="grid three" style="margin-top:14px"><div class="field"><label>Expiry</label><input placeholder="MM/YY" /></div><div class="field"><label>CVC</label><input placeholder="123" /></div><div class="field"><label>ZIP</label><input placeholder="75034" /></div></div><div style="margin-top:14px"><button class="btn primary sm" id="btn-pay">Save card</button> <span class="muted small">Demo: nothing is sent anywhere.</span></div>'}</div>
   `,
  footer('Finish setup', stepValid('payment')));

function renderSignup() {
  const s = STEPS[state.step];
  if (s.kind === 'account') return `<div class="wrap">${R.account()}</div>`;
  return `<div class="wrap">${stepper()}${R[s.kind]()}</div>`;
}

/* ---------- portal (after the wizard) ---------- */
const PORTAL_PAGES = {
  dashboard: { title: 'Dashboard', icon: 'dash' }, results: { title: 'Patient Exams', icon: 'clipboard' }, clinics: { title: 'Clinics', icon: 'home' },
  managers: { title: 'Managers', icon: 'users' }, medication: { title: 'Medication Management', icon: 'pill' }, exams: { title: 'Exams', icon: 'clipboard' },
  intake: { title: 'Intake Forms (Beta)', icon: 'file' }, rewards: { title: 'Rewards', icon: 'users' }, white: { title: 'White Label', icon: 'gear' }, settings: { title: 'Settings', icon: 'gear' },
};
function pluginKey() { const hx = s => hashStr(s).toString(16).padStart(8, '0'); const h1 = hx('key:' + (state.form.clinic.practice || 'clinic')), h2 = hx('key2:' + (state.form.account.email || 'x')), h3 = hx('key3:' + (state.form.clinic.zip || '0')); return (h1 + h2 + h3 + h1 + h2).slice(0, 40); }
function activeExams() { return SERVICES.filter(s => state.form.exams.services.includes(s.id)).flatMap(s => s.exams.map(e => ({ name: e, service: s.label, rx: !!s.rx }))); }
function wantsQuidget() { return !!state.form.exams.quidgetReminder || ans('workflow').choice === 'wordpress'; }

function checklistItems() {
  const f = state.form;
  return [
    { t: 'Account and clinic details', d: f.clinic.practice || 'Practice details', done: true },
    { t: 'Terms of use accepted', d: 'Accepted during signup', done: true },
    { t: 'Medical director verified', d: f.md.verified ? `${mdDisplay()} · NPI ${f.md.npi}` : 'NPI not verified', done: !!f.md.verified },
    { t: 'Service agreement signed', d: isRx() ? 'GFE + prescriptions' : 'Good faith exams', done: f.agreement.signed },
    { t: 'Prescribing addendum countersigned', d: `Waiting on ${f.md.email || 'your medical director'} (QualiSign)`, done: false, warn: true, hide: !isRx() },
    { t: 'Patient care provider on file', d: (ans('pcp').choice === 'md') ? mdDisplay() : (ans('pcp').fields['Full name'] || 'Not set'), done: ans('pcp').choice === 'md' || !!ans('pcp').fields['Full name'] },
    { t: 'Exams activated', d: f.exams.services.length ? `${activeExams().length} favorites ready` : 'Pick the services you offer', done: f.exams.services.length > 0 },
    { t: 'Payment method', d: f.payment.done ? 'Visa ending 4242' : 'Add a card', done: f.payment.done },
    { t: 'Install the Quidget WordPress plugin', d: 'Settings > WordPress Quidget has your plugin key and the three install steps.', done: false, hide: !wantsQuidget(), page: 'settings', panel: 'quidget' },
    { t: 'Send your first exam', d: 'Invite a patient from Send exam, or use Connect Instantly in the room.', done: false, cta: true },
  ].filter(i => !i.hide);
}

function pageDashboard() {
  const f = state.form; const eff = computeEffects();
  const blocked = eff.filter(e => e.status === 'blocked');
  const pending = eff.filter(e => e.status === 'support' || e.status === 'handoff');
  const items = checklistItems();
  const doneCount = items.filter(i => i.done).length; const pct = Math.round(100 * doneCount / items.length);
  const next = items.find(i => !i.done && !i.warn);
  const written = eff.filter(e => e.status === 'written' && e.q !== 'Clinic' && e.q !== 'Payment'); const byLabel = {}; written.forEach(e => { byLabel[e.label] = e; });
  const setlist = Object.values(byLabel).slice(0, 12).map(e => `<div class="si"><span class="k">${esc(e.label)}</span><span class="v">${esc(e.value || '')}</span></div>`).join('');
  return `
      <div class="ph"><div><h1>Welcome, ${esc(firstName() || 'there')}</h1><div class="d">${esc(f.clinic.practice || 'Your clinic')} is set up. ${blocked.length ? `${blocked.length} item${blocked.length > 1 ? 's' : ''} still need${blocked.length > 1 ? '' : 's'} you.` : 'Here is what to do next.'}</div></div>
        <button class="btn primary ${next && next.cta ? 'pulse' : ''}">${ICONS.send} Send your first exam</button></div>
      <div class="tiles"><div class="tile"><div class="k">Exams sent</div><div class="v">0</div></div><div class="tile"><div class="k">Setup</div><div class="v">${pct}%</div></div><div class="tile"><div class="k">Active exams</div><div class="v">${activeExams().length}</div></div><div class="tile"><div class="k">With our team</div><div class="v">${pending.length}</div></div></div>
      ${wantsQuidget() ? `<div class="quidget"><div class="wp">W</div><div><div class="t">Set up the Qualiphy Quidget on your WordPress site</div><div class="d">Your plugin key is ready. Install the plugin, paste the key, and patients can start an exam from any page of your site.</div></div><div class="act"><button class="btn lav sm" id="quidget-open">Open WordPress Quidget settings</button></div></div>` : ''}
      <div class="sec" id="tour-checklist"><div class="sec-h"><div><div class="t">Finish setting up your practice</div><div class="d">${doneCount} of ${items.length} steps complete. Everything stays visible in Settings; this just points you at what is next.</div></div>${next ? `<button class="btn primary sm ${next.cta ? 'pulse' : ''}" ${next.page ? `data-page="${next.page}" data-panel="${next.panel || ''}"` : ''}>${next.cta ? 'Send your first exam' : 'Continue setup'}</button>` : ''}</div>
        <div class="sec-b"><div class="progress"><div class="bar" style="width:${pct}%"></div></div>
          <div class="cl">${items.map(i => `<div class="ci ${i.done ? 'done' : ''} ${i.page ? 'go' : ''}" ${i.page ? `data-page="${i.page}" data-panel="${i.panel || ''}"` : ''}><div class="ic ${i.done ? 'done' : i.warn ? 'warn' : 'todo'}">${i.done ? '&#10003;' : i.warn ? '!' : ''}</div><div><div class="t">${esc(i.t)}${!i.done && next && next.t === i.t ? '<span class="next-pill">Next</span>' : ''}${i.warn ? '<span class="badge warn" style="margin-left:8px">Waiting on signature</span>' : ''}</div><div class="d">${esc(i.d)}</div></div></div>`).join('')}</div>
        </div></div>
      <div class="sec"><div class="sec-h"><div><div class="t">What we set up for you</div><div class="d">From your answers. Change any of these in Settings.</div></div><button class="btn sm" data-page="settings">Open Settings</button></div><div class="sec-b"><div class="setlist">${setlist || '<div class="muted">Nothing yet.</div>'}</div>${pending.length ? `<div class="callout info small" style="margin-top:14px"><strong>With our team:</strong> ${[...new Set(pending.map(p => p.label))].map(esc).join('; ')}. We will email you when these are done.</div>` : ''}</div></div>
      
      <div class="row"><button class="btn" id="btn-restart">Run the signup again</button><button class="link tip-link" id="tour-start">Show the quick tips again</button></div>`;
}

function pageResults() {
  const f = state.form;
  return `
      <div class="ph"><div><h1>Patient Exams List</h1><div class="d">Note: if your patient is having issues connecting to a provider, please call (424) 257-3977 EXT: 2 for immediate assistance.</div></div><div class="field" style="width:260px"><label>Select Clinic:</label><select><option>${esc(f.clinic.practice || 'Your clinic')}</option></select></div></div>
      <div class="sec"><div class="sec-b">
        <div class="grid three"><div class="field"><label>Search:</label><input placeholder="Search" /></div><div class="field"><label>Sort By:</label><select><option>Select Sort By</option></select></div><div class="field"><label>Date Range:</label><input value="Sep 16, 2025 - Sep 16, 2026" readonly /></div></div>
        <div style="overflow:auto;margin-top:16px"><table><thead><tr><th>ID</th><th>Patient Name</th><th>Exam Title</th><th>Status</th><th>Medication Information &amp; Tracking</th><th>Sent Date</th><th>Completed Date</th><th>Action</th></tr></thead><tbody><tr><td colspan="8"><div class="empty-state"><div class="ico">${ICONS.clipboard}</div><div class="t">No patient exams recorded</div><div class="d">Exams you send will appear here with their status and outcome.</div><button class="btn primary sm" style="margin-top:12px">${ICONS.send} Send Exam Invite</button></div></td></tr></tbody></table></div>
      </div></div>`;
}

function pageExams() {
  const list = activeExams();
  return `
      <div class="ph"><div><h1>Exams</h1><div class="d">Qualiphy templates activated for ${esc(state.form.clinic.practice || 'your clinic')} from the services you picked at signup.</div></div><button class="btn lav">Add Exam</button></div>
      <div class="sec"><div class="sec-h"><div class="t">Qualiphy Templates</div><span class="muted small">${list.length} active</span></div>
        <div style="overflow:auto"><table><thead><tr><th>Exam</th><th>Service</th><th>Type</th><th>Status</th><th>Action</th></tr></thead><tbody>${list.length ? list.map(e => `<tr><td>${esc(e.name)}</td><td>${esc(e.service)}</td><td>${e.rx ? 'Prescription' : 'Good faith exam'}</td><td><span class="badge ok">Active</span></td><td><button class="link">Deactivate</button></td></tr>`).join('') : '<tr><td colspan="5"><div class="empty-state"><div class="t">No exams activated yet</div><div class="d">Pick the services you offer to activate the matching exams.</div></div></td></tr>'}</tbody></table></div></div>`;
}

function pageClinics() {
  const f = state.form; const pcp = ans('pcp').choice === 'md' ? mdDisplay() : (ans('pcp').fields['Full name'] || 'Not set');
  return `
      <div class="ph"><div><h1>Clinics</h1><div class="d">Practices and locations under this account.</div></div><button class="btn lav">${ICONS.home} Add Location</button></div>
      <div class="sec"><div style="overflow:auto"><table><thead><tr><th>Name</th><th>Admin Email</th><th>Medical Director</th><th>Patient Care Provider</th><th>Actions</th></tr></thead><tbody>
        <tr><td>${esc(f.clinic.practice || 'Your clinic')} <span class="badge purple" style="margin-left:6px">Default</span><div class="muted small">${esc([f.clinic.address1, f.clinic.city, f.clinic.state, f.clinic.zip].filter(Boolean).join(', '))}</div></td><td>${esc(f.account.email)}</td><td>${esc(mdDisplay())}${f.md.verified ? ' <span class="badge ok">NPI verified</span>' : ''}</td><td>${esc(pcp)}</td><td><button class="link">Edit</button></td></tr>
      </tbody></table></div></div>
      ${f.clinic.multi === 'many' ? '<div class="callout info small">You told us you have more than one location. Add each one here; every location signs its own agreement.</div>' : ''}`;
}

function pageSettings() {
  const f = state.form; const key = pluginKey(); const shown = state.showKey; const panel = state.settingsPanel;
  const A = ans('comms');
  const toggles = q('comms').followups.filter(x => x.type === 'toggle');
  const notif = `<div class="sec panel"><div class="sec-h"><div><div class="t">Notification Settings</div><div class="d">These are the choices you made at signup. Change them here any time.</div></div></div><div class="sec-b">
      <div class="fu-group" style="margin-top:0"><div class="fu-title">Who sends patient messages</div>${q('comms').answers.map(o => `<label class="switch-row ${A.choice === o.id ? 'on' : ''}"><div class="txt">${esc(o.label)}</div><div class="ctl"><input type="radio" name="comms-choice" data-q="comms" data-a="${o.id}" ${A.choice === o.id ? 'checked' : ''} /></div></label>`).join('')}</div>
      <div class="fu-group"><div class="fu-title">Patient communication</div>${toggles.map(t => { const on = A.fu[t.id] === undefined ? t.default : A.fu[t.id]; const applies = A.choice && t.showIf.includes(A.choice); return `<label class="switch-row ${on && applies ? 'on' : ''}" style="${applies ? '' : 'opacity:.5'}"><div class="txt">${esc(t.label)}</div><div class="ctl"><span class="sw-lbl">${on && applies ? 'Yes' : 'No'}</span><span class="switch ${on && applies ? 'on' : ''}"><input type="checkbox" data-q="comms" data-fu="${t.id}" ${on ? 'checked' : ''} ${applies ? '' : 'disabled'} /><span class="knob"></span></span></div></label>`; }).join('')}</div>
    </div></div>`;
  const wpq = `<div class="sec panel"><div class="sec-h"><div><div class="t">Qualiphy Quidget for WordPress</div><div class="d">Let patients start a Good Faith Exam from any page of your WordPress or WooCommerce site.</div></div><span class="wp" style="width:36px;height:36px;font-size:16px">W</span></div><div class="sec-b">
      <ol class="steps-list">
        <li><strong>Install the plugin.</strong> In your WordPress admin go to Plugins &rsaquo; Add New, search for <em>Qualiphy Quidget</em>, then Install and Activate.</li>
        <li><strong>Paste your plugin key.</strong> Qualiphy &rsaquo; Settings inside WordPress asks for it once.
          <div class="keybox" style="margin-top:8px"><code>${shown ? esc(key) : '&bull;'.repeat(28)}</code><button class="link purple key-toggle">${shown ? 'Hide' : 'Show'}</button><button class="link purple key-copy">Copy</button></div></li>
        <li><strong>Choose the exams to offer.</strong> Your activated exams appear in the plugin; pick which ones patients can start from your site.
          <div class="chips" style="margin-top:8px">${activeExams().slice(0, 8).map(e => `<span class="chip ok">${esc(e.name)}</span>`).join('') || '<span class="muted small">No exams activated yet.</span>'}</div></li>
      </ol>
      <div class="row" style="margin-top:8px"><a class="btn lav sm" href="https://wordpress.org/plugins/" target="_blank" rel="noopener">${ICONS.logout} Plugin guide</a><span class="muted small">Need a developer? Forward this page; the key is all they need.</span></div>
    </div></div>`;
  return `
      <div class="set-col">
        <div class="sec"><div class="sec-b">
          <div style="font-weight:600;margin-bottom:10px">API Key (Default Clinic)</div>
          <div class="keybox"><code>${shown ? esc(key) : '&bull;'.repeat(28)}</code><button class="link purple key-toggle">${shown ? 'Hide' : 'Show'}</button><button class="link purple key-copy">Copy</button></div>
          <div style="margin-top:12px"><a class="link purple" href="#" onclick="return false">${ICONS.file} API Documentation</a><div class="muted small">Endpoints, request formats and webhook events for this key.</div></div>
        </div></div>
        <button class="set-btn ${panel === 'notif' ? 'open' : ''}" data-panel="notif">Notification Settings</button>
        ${panel === 'notif' ? notif : ''}
        <button class="set-btn ${panel === 'quidget' ? 'open' : ''}" data-panel="quidget"><span class="wp mini">W</span> WordPress Quidget</button>
        ${panel === 'quidget' ? wpq : ''}
        <button class="set-btn">Change Password</button>
        <button class="set-btn filled">Change Email</button>
        <button class="set-btn danger" id="set-logout">Logout</button>
        
      </div>`;
}

function pagePlaceholder(page) {
  const p = PORTAL_PAGES[page];
  return `<div class="ph"><div><h1>${esc(p.title)}</h1><div class="d">Not part of this demo. It looks and works as it does in the portal today.</div></div></div><div class="sec"><div class="sec-b"><div class="empty-state"><div class="t">${esc(p.title)}</div><div class="d">Unchanged by the setup wizard.</div></div></div></div>`;
}

function renderPortal() {
  const page = PORTAL_PAGES[state.portalPage] ? state.portalPage : 'dashboard';
  const menu = [['Results', 'clipboard', 'results'], ['Clinics', 'home', 'clinics'], ['Managers', 'users', 'managers'], ['Medication Management', 'pill', 'medication'], ['Exams', 'clipboard', 'exams'], ['Intake Forms (Beta)', 'file', 'intake'], ['Rewards', 'users', 'rewards'], ['White Label', 'gear', 'white'], ['Settings', 'gear', 'settings']];
  const body = page === 'dashboard' ? pageDashboard() : page === 'results' ? pageResults() : page === 'exams' ? pageExams() : page === 'clinics' ? pageClinics() : page === 'settings' ? pageSettings() : pagePlaceholder(page);
  return `<div class="portal">
    <aside class="sidemenu"><div class="logo-wrap"><img src="assets/logo_white.png" alt="Qualiphy" /></div><a class="dash ${page === 'dashboard' ? 'active' : ''}" data-page="dashboard"><span>Dashboard</span><span class="x">&times;</span></a>${menu.map(([l, i, key]) => `<a class="mi ${page === key ? 'active' : ''}" id="tour-${key}" data-page="${key}"><span class="ico">${ICONS[i]}</span>${esc(l)}</a>`).join('')}<a class="mi logout" id="set-logout"><span class="ico">${ICONS.logout}</span>Logout</a></aside>
    <div class="portal-body"><div class="portal-inner">
      ${body}
    ${tourHtml()}
    </div></div>
  </div>`;
}

/* ---------- first-run tour (dashboard) ---------- */
const TOUR = [
  { target: '#tour-send', place: 'below-right', k: 'Start here', t: 'Send your first exam invite', d: 'This button emails or texts a patient a link to their exam. They join from any device, and results land in Results.' },
  { target: '#tour-checklist', place: 'below', k: 'Your setup', t: 'Anything still open is listed here', d: 'We configured most settings from your answers. Items with a Next tag are the ones to finish; nothing is hidden.' },
  { target: '#tour-settings', place: 'right', k: 'Change anything', t: 'Everything we set up lives in Settings', d: 'Patient notifications, your patient care provider, pharmacy, integrations and your API key. Edit them any time.' },
  { target: '#tour-results', place: 'right', k: 'Results', t: 'Exams show up here as providers complete them', d: 'Approved, deferred or not applicable, with the provider note and any prescription details.' },
];
function tourHtml() {
  if (!state.tour.active) return '';
  const s = TOUR[state.tour.step];
  return `<div class="tour-dim"></div><div class="tour-card ${s.place}" id="tour-card"><div class="k">${esc(s.k)} &middot; ${state.tour.step + 1} of ${TOUR.length}</div><div class="t">${esc(s.t)}</div><div class="d">${esc(s.d)}</div><div class="acts"><div class="dots">${TOUR.map((_, i) => `<i class="${i === state.tour.step ? 'on' : ''}"></i>`).join('')}</div><div class="row"><button class="link" id="tour-skip">Skip tips</button><button class="btn primary sm" id="tour-next">${state.tour.step === TOUR.length - 1 ? 'Done' : 'Next'}</button></div></div></div>`;
}
function positionTour() {
  document.querySelectorAll('.tour-hi').forEach(el => el.classList.remove('tour-hi'));
  const card = $('#tour-card'); if (!card) return;
  const s = TOUR[state.tour.step]; const el = document.querySelector(s.target); if (!el) return;
  el.classList.add('tour-hi'); el.scrollIntoView({ block: 'nearest' });
  const r = el.getBoundingClientRect(); const cw = card.offsetWidth; const ch = card.offsetHeight;
  let top, left;
  if (s.place === 'right') { top = r.top - 14; left = r.right + 16; }
  else if (s.place === 'below-right') { top = r.bottom + 14; left = r.right - cw; }
  else { top = r.bottom + 14; left = r.left; }
  left = Math.max(12, Math.min(left, window.innerWidth - cw - 12)); top = Math.max(12, Math.min(top, window.innerHeight - ch - 12));
  card.style.top = top + 'px'; card.style.left = left + 'px';
}

/* product views removed in the share build */
const P = {};
function buildExport() { return ''; }

/* ---------- render + events ---------- */
function render() {
  document.querySelectorAll('.pb[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === state.view || (b.dataset.view === 'signup' && state.view === 'portal')));
  $('#toggle-plumbing').checked = state.showPlumbing;
  const tb = $('#topbar'); tb.classList.toggle('portal-bar', state.view === 'portal'); tb.hidden = state.view === 'signup' && STEPS[state.step].kind === 'account';
  document.body.classList.toggle('lav', state.view === 'signup' && STEPS[state.step].kind === 'account');
  const pp = PORTAL_PAGES[state.portalPage] || PORTAL_PAGES.dashboard;
  $('#brand-page').textContent = state.view === 'portal' ? pp.title : state.view === 'signup' ? 'Clinic Signup' : 'Product';
  $('#tb-icon').innerHTML = state.view === 'portal' ? ICONS[pp.icon] : ICONS.building;
  $('#topbar-right').innerHTML = state.view === 'portal' ? `<button class="btn lav" id="tour-send">${ICONS.send} Send Exam Invite</button>` : state.view === 'signup' ? `<button class="btn lav">${ICONS.logout} Logout</button>` : `<span class="muted small">Product views</span>`;
  const el = $('#page');
  if (state.view === 'signup') el.innerHTML = renderSignup();
  else if (state.view === 'portal') { el.innerHTML = renderPortal(); requestAnimationFrame(positionTour); }
  else el.innerHTML = P[state.view]();
  save();
}
function next() {
  const s = STEPS[state.step];
  if (s.kind === 'profile') { const ids = activeQs(); if (state.sub < ids.length - 1) { state.sub++; render(); window.scrollTo(0, 0); return; } }
  if (s.kind === 'clinic' && state.sub < CLINIC_SUBS - 1) { state.sub++; render(); window.scrollTo(0, 0); return; }
  if (state.step < STEPS.length - 1) { state.step++; state.sub = 0; render(); window.scrollTo(0, 0); }
  else { state.view = 'portal'; if (!state.tour.done) state.tour = { active: true, step: 0, done: false }; render(); window.scrollTo(0, 0); }
}
function back() {
  const s = STEPS[state.step];
  if ((s.kind === 'profile' || s.kind === 'clinic') && state.sub > 0) { state.sub--; render(); return; }
  if (state.step > 0) { state.step--; const p = STEPS[state.step]; state.sub = p.kind === 'profile' ? Math.max(0, activeQs().length - 1) : p.kind === 'clinic' ? CLINIC_SUBS - 1 : 0; render(); window.scrollTo(0, 0); }
}
function setPath(path, val) { const [g, k] = path.split('.'); state.form[g][k] = val; }

document.addEventListener('click', e => {
  const pb = e.target.closest('.pb[data-view]'); if (pb) { state.view = pb.dataset.view === 'signup' && state.step === STEPS.length - 1 && state.form.payment.done && sessionStorage.getItem(STORE_KEY) && state.view === 'portal' ? 'portal' : pb.dataset.view; render(); window.scrollTo(0, 0); return; }
  if (e.target.id === 'btn-reset') { if (confirm('Reset the demo to a blank signup?')) { try { sessionStorage.removeItem(STORE_KEY); } catch (x) {} location.reload(); } return; }
  if (e.target.id === 'btn-sample') { fillSample(); state.view = 'signup'; state.step = STEPS.findIndex(s => s.kind === 'profile'); state.sub = 0; render(); window.scrollTo(0, 0); return; }
  if (e.target.id === 'btn-next') { next(); return; }
  if (e.target.id === 'btn-back') { back(); return; }
  const nav = e.target.closest('[data-page]');
  if (nav && state.view === 'portal' && !e.target.closest('.tour-card')) { state.portalPage = nav.dataset.page; state.settingsPanel = nav.dataset.panel || null; state.showKey = false; render(); window.scrollTo(0, 0); return; }
  if (e.target.id === 'quidget-open') { state.portalPage = 'settings'; state.settingsPanel = 'quidget'; render(); window.scrollTo(0, 0); return; }
  const sb = e.target.closest('.set-btn[data-panel]'); if (sb) { state.settingsPanel = state.settingsPanel === sb.dataset.panel ? null : sb.dataset.panel; render(); return; }
  if (e.target.classList.contains('key-toggle')) { state.showKey = !state.showKey; render(); return; }
  if (e.target.classList.contains('key-copy')) { try { navigator.clipboard.writeText(pluginKey()); } catch (x) {} e.target.textContent = 'Copied'; setTimeout(() => { e.target.textContent = 'Copy'; }, 1200); return; }
  if (e.target.closest('#set-logout')) { state.form = freshForm(); state.answers = {}; state.tour = { active: false, step: 0, done: false }; state.view = 'signup'; state.step = 0; state.sub = 0; state.portalPage = 'dashboard'; render(); window.scrollTo(0, 0); return; }
  if (e.target.id === 'tour-next') { if (state.tour.step < TOUR.length - 1) { state.tour.step++; } else { state.tour = { active: false, step: 0, done: true }; } render(); return; }
  if (e.target.id === 'tour-skip') { state.tour = { active: false, step: 0, done: true }; render(); return; }
  if (e.target.id === 'tour-start') { state.tour = { active: true, step: 0, done: false }; render(); return; }
  if (e.target.id === 'btn-restart') { state.form = freshForm(); state.answers = {}; state.tour = { active: false, step: 0, done: false }; state.view = 'signup'; state.step = 0; state.sub = 0; state.portalPage = 'dashboard'; render(); window.scrollTo(0, 0); return; }
  if (e.target.id === 'btn-skip') { const ids = activeQs(); const id = ids[state.sub]; if (id) { const A = ans(id); A.choice = null; A.seeded = false; } next(); return; }
  if (e.target.id === 'btn-skip-exams') { state.form.exams.services = []; next(); return; }
  if (e.target.id === 'btn-fill-account') { state.form.account.email = SAMPLE.admin.email; render(); return; }
  if (e.target.id === 'btn-fill-clinic') { Object.assign(state.form.clinic, { practice: SAMPLE.practice, phone: SAMPLE.phone, address1: SAMPLE.address1, city: SAMPLE.city, state: SAMPLE.state, zip: SAMPLE.zip, adminName: SAMPLE.admin.first + ' ' + SAMPLE.admin.last, adminPhone: SAMPLE.phone, addrPicked: true, addrQuery: SAMPLE.address1 }); render(); return; }
  if (e.target.id === 'btn-fill-md') { Object.assign(state.form.md, SAMPLE.md); state.form.md.verified = npiLookup(state.form.md.npi).ok; render(); return; }
  if (e.target.id === 'btn-sign') { state.form.agreement.signed = true; render(); return; }
  if (e.target.id === 'btn-pay') { state.form.payment.done = true; render(); return; }
  if (e.target.id === 'btn-copy') { const t = $('#export-text'); t.select(); try { navigator.clipboard.writeText(t.value); } catch (x) { document.execCommand('copy'); } e.target.textContent = 'Copied'; setTimeout(() => { e.target.textContent = 'Copy'; }, 1200); return; }
  const sg = e.target.closest('.sg'); if (sg && sg.dataset.sg !== undefined) { const m = lastSuggest[+sg.dataset.sg]; if (!m) return; Object.assign(state.form.clinic, { address1: m.line1, city: m.city, state: m.state, zip: m.zip, addrPicked: true, addrManual: false, addrQuery: m.line1 }); render(); return; }
  if (e.target.id === 'geo-use') { requestExactLocation(); return; }
  if (e.target.id === 'quidget-remind') { state.form.exams.quidgetReminder = true; render(); return; }
  if (e.target.id === 'addr-manual') { state.form.clinic.addrManual = true; render(); return; }
  if (e.target.id === 'addr-change') { Object.assign(state.form.clinic, { addrPicked: false, addrManual: false, addrQuery: '' }); render(); const el = $('#addr-search'); if (el) el.focus(); return; }
  const lv = e.target.closest('.level'); if (lv) { state.form.agreement.level = lv.dataset.level; render(); return; }
  const rd = e.target.closest('[data-radio]'); if (rd) { setPath(rd.dataset.radio, rd.dataset.val); render(); return; }
  const mv = e.target.closest('[data-move]'); if (mv) { const id = mv.dataset.move, d = +mv.dataset.dir; const i = state.order.indexOf(id); const j = i + d; if (j >= 0 && j < state.order.length) { state.order.splice(i, 1); state.order.splice(j, 0, id); } render(); return; }
  const fl = e.target.closest('[data-filter]'); if (fl) { state.settingsFilter = fl.dataset.filter; render(); return; }
  const opt = e.target.closest('.opt[data-q]'); if (opt && !e.target.matches('input')) { const A = ans(opt.dataset.q); if (opt.dataset.o) A.fu[opt.dataset.fu] = opt.dataset.o; else if (opt.dataset.a) { A.choice = opt.dataset.a; A.seeded = false; } render(); return; }
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'toggle-plumbing') { state.showPlumbing = t.checked; render(); return; }
  if (t.dataset.path && t.type === 'checkbox') { setPath(t.dataset.path, t.checked); render(); return; }
  if (t.type === 'radio' && t.dataset.q && t.dataset.a) { const A = ans(t.dataset.q); A.choice = t.dataset.a; A.seeded = false; render(); return; }
  if (t.dataset.path && t.tagName === 'SELECT') { setPath(t.dataset.path, t.value); render(); return; }
  if (t.classList.contains('state') && t.dataset.qid) { state.qstate[t.dataset.qid] = t.value; state.sub = 0; render(); return; }
  if (t.dataset.svc) { const s = state.form.exams.services; const i = s.indexOf(t.dataset.svc); if (t.checked && i < 0) s.push(t.dataset.svc); if (!t.checked && i >= 0) s.splice(i, 1); render(); return; }
  if (t.dataset.role) { const A = ans(t.dataset.q); A.fu[t.dataset.fu] = A.fu[t.dataset.fu] || {}; A.fu[t.dataset.fu][t.dataset.role] = t.checked; render(); return; }
  if (t.dataset.fu && t.type === 'checkbox') { ans(t.dataset.q).fu[t.dataset.fu] = t.checked; render(); return; }
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.addr) { state.form.clinic.addrQuery = t.value; save(); suggestFor(t.value); return; }
  if (t.dataset.path) {
    let v = t.value; if (t.dataset.path === 'clinic.state') v = v.toUpperCase().slice(0, 2); if (t.dataset.path === 'md.npi') v = v.replace(/\D/g, '').slice(0, 10);
    setPath(t.dataset.path, v);
    if (t.dataset.path === 'md.npi') { state.form.md.verified = v.length === 10 ? npiLookup(v).ok : null; }
    const s = STEPS[state.step]; const btn = $('#btn-next'); if (btn) btn.disabled = !stepValid(s.id);
    if (t.dataset.path === 'md.npi' || t.dataset.path === 'md.name') { const pos = t.selectionStart; render(); const el = document.querySelector(`[data-path="${t.dataset.path}"]`); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (x) {} } return; }
    save(); return;
  }
  if (t.dataset.field) { ans(t.dataset.q).fields[t.dataset.field] = t.value; save(); return; }
  if (t.dataset.fuText) { ans(t.dataset.q).fields[t.dataset.fuText] = t.value; save(); return; }
});

function fillSample() {
  state.form.account.email = SAMPLE.admin.email;
  state.form.terms.accepted = false;   /* the clinic must tick this themselves */
  Object.assign(state.form.clinic, { practice: SAMPLE.practice, phone: SAMPLE.phone, address1: SAMPLE.address1, city: SAMPLE.city, state: SAMPLE.state, zip: SAMPLE.zip, adminName: SAMPLE.admin.first + ' ' + SAMPLE.admin.last, adminPhone: SAMPLE.phone, multi: 'one', addrPicked: true, addrQuery: SAMPLE.address1 });
  Object.assign(state.form.md, SAMPLE.md, { verified: true });
  state.form.agreement = { level: 'rx', signed: true };
}

window.addEventListener('resize', () => { if (state.tour.active) positionTour(); });
document.addEventListener('focusin', e => {
  const t = e.target; if (t && t.id === 'addr-search' && t.value) suggestFor(t.value);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target && e.target.id === 'addr-search') { const first = document.querySelector('#addr-suggest .sg'); if (first) { e.preventDefault(); first.click(); } }
});

load();
initGeo();
render();
