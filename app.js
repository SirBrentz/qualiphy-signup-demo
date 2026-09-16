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
    payment: { done: false, backup: false },
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
    payment: { done: false, backup: false },
  },
  answers: {},
  settingsFilter: 'all',
  tour: { active: false, step: 0, done: false },
  portalPage: 'dashboard',
  settingsPanel: null,
  showKey: false,
  notifModal: false,
  notif: null,
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
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  docPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9 14h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>',
  clinicBig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"/><path d="M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 15.5a5 5 0 0 1 5.5 4.5"/></svg>',
  locations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A16.8 16.8 0 0 0 2 12s3.5 7 10 7c1.6 0 3-.3 4.3-.9"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h13a3 3 0 0 1 3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2 2v11.2A3 3 0 0 1 7 16h11V6a1 1 0 0 0-1-1zm1 13a1 1 0 0 0 0 2h11v-2z"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  wordpress: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM3.4 12a8.6 8.6 0 0 1 .7-3.5l4.1 11.2A8.6 8.6 0 0 1 3.4 12zm8.6 8.6a8.7 8.7 0 0 1-2.4-.4l2.6-7.5 2.6 7.3.1.1a8.6 8.6 0 0 1-2.9.5zm1.2-12.7c.5 0 1-.1 1-.1.5-.1.4-.8-.1-.7 0 0-1.4.1-2.4.1-.9 0-2.3-.1-2.3-.1-.5 0-.5.7-.1.7l.9.1 1.4 3.7-1.9 5.7-3.2-9.4c.5 0 1-.1 1-.1.5-.1.4-.8-.1-.7 0 0-1.4.1-2.4.1H5A8.6 8.6 0 0 1 12 3.4c2.2 0 4.2.8 5.7 2.2h-.1c-.8 0-1.4.7-1.4 1.5 0 .7.4 1.3.8 2 .3.5.7 1.2.7 2.2 0 .7-.3 1.5-.6 2.6l-.8 2.7-2.9-8.7zm3.3 11.8 2.6-7.5c.5-1.2.6-2.2.6-3v-.7a8.6 8.6 0 0 1-3.2 11.2z"/></svg>',
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/></svg>',
  clipEdit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6v3H9zM15 5h2a2 2 0 0 1 2 2v3M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m18 12-5 5v3h3l5-5z"/></svg>',
  dash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10-3h8v11h-8V10z"/></svg>',
};

/* ---------- helpers ---------- */
function toast(msg) { let el = document.getElementById('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); } el.textContent = msg; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2200); }
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
  return { ok: true, rec: { name: (state.form.md.name || 'PROVIDER').toUpperCase(), credential: '', taxonomy: 'Verified with MedPro', city: '', state: '', status: 'Active' } };
}

/* Everything the answers would write. */
function computeEffects() {
  const out = [];
  const f = state.form;
  out.push({ q: 'Clinic', label: 'Practice name, address, phone', value: f.clinic.practice || 'missing', where: 'signup', status: f.clinic.practice ? 'written' : 'blocked', via: '/clinic_sign_up' });
  out.push({ q: 'Clinic', label: 'Locations', value: f.clinic.multi === 'many' ? 'more than one (added after setup, each needs its own agreement)' : 'one', where: 'portal', status: 'written', via: 'Add Location' });
  out.push({ q: 'Medical director', label: 'Medical Director (name, email, phone)', value: f.md.name || 'missing', where: 'signup', status: f.md.name ? 'written' : 'blocked', via: '/clinic_sign_up' });
  out.push({ q: 'Medical director', label: 'NPI verified through MedPro', value: f.md.verified ? f.md.npi : 'not verified', where: 'nowhere', status: f.md.verified ? 'engineering' : 'blocked', via: 'NPI registry lookup' });
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
  out.push({ q: 'Payment', label: 'Backup payment method on file', value: f.payment.backup ? 'card ending 5555' : 'missing', where: 'nowhere', status: f.payment.backup ? 'engineering' : 'blocked', via: 'no second-card field today' });
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
const CLINIC_SUBS = 3;
function clinicSubValid(sub) {
  const c = state.form.clinic;
  if (sub === 0) return !!(c.practice && c.address1 && c.city && c.state && c.zip);
  if (sub === 1) return !!c.adminName;
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
function itemHtml(m, i, q) { return `<div class="sg ${i === 0 ? 'hi' : ''}" data-sg="${i}"><span class="sg-pin">${ICONS.pin}</span><div class="sg-txt"><div class="main">${hi(m.line1, q)}</div><div class="sub">${m.city ? esc(m.city) + ', ' : ''}${esc(m.state)} ${esc(m.zip)}</div></div></div>`; }
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
    case 'payment': return f.payment.done && f.payment.backup;
  }
  return true;
}

/* ---------- renderers ---------- */
function wizSide() {
  const items = STEPS.map((s, i) => { const st = i < state.step ? 'done' : i === state.step ? 'cur' : 'todo'; return `<div class="ws ${st}"><span class="dot">${st === 'done' ? ICONS.check : i + 1}</span><span class="lbl">${esc(s.label)}</span></div>`; }).join('');
  return `<aside class="wiz-side"><div class="wiz-logo"><img src="assets/logo_black.png" alt="Qualiphy" /></div><div class="wiz-eyebrow">Clinic setup</div><nav class="wiz-steps">${items}</nav><div class="wiz-help"><span class="ico">${ICONS.help}</span><div><div class="q">Need a hand?</div><a href="#" onclick="return false">Contact support</a></div></div></aside>`;
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
let wizFoot = '';
function footer(nextLabel, canNext, extraLeft = '', blocked = '') {
  wizFoot = `<div class="left">${state.step > 0 ? '<button class="btn" id="btn-back">Back</button>' : ''}${extraLeft}</div><div class="right"><span class="wiz-status">${canNext ? 'Changes saved' : esc(blocked)}</span><button class="btn primary" id="btn-next" ${canNext ? '' : 'disabled'}>${nextLabel} ${ICONS.arrow}</button></div>`;
  return '';
}
function card(kicker, title, sub, body, foot, opts = {}) {
  const n = String(state.step + 1).padStart(2, '0'); const N = String(STEPS.length).padStart(2, '0');
  return `<div class="wiz-count">${n} / ${N}</div><h1 class="wiz-h1">${title}</h1>${sub ? `<div class="wiz-sub">${sub}</div>` : ''}${opts.bare ? body : `<div class="wiz-card">${body}</div>`}`;
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

R.terms = () => card('', 'Review the terms of use', 'Please read and accept to continue.',
  `<div class="terms-box"><h4>Qualiphy Terms of Use (summary for the demo)</h4>Qualiphy PC provides asynchronous and synchronous good faith exams and prescription consultations to licensed clinics. The clinic is responsible for the accuracy of the information it provides, for maintaining a supervising medical director where required by state law, and for its own patient communications when it elects to send them. Fees are billed per completed exam. Qualiphy is a consulting entity and does not serve as the patient’s primary care provider. Full terms are provided in the signed service agreement.<br/><br/>By continuing you confirm you are authorised to bind the clinic to these terms.</div>
   <label class="check ${state.form.terms.accepted ? 'on' : ''}" style="margin-top:16px"><input type="checkbox" data-path="terms.accepted" ${state.form.terms.accepted ? 'checked' : ''} /><div><div class="t">I have read and accept the Terms of Use</div><div class="n">A copy is emailed to you once setup is complete.</div></div></label>`,
  footer('Continue', stepValid('terms'), '', 'Accept the terms to continue'));

R.clinic = () => {
  const c = state.form.clinic; const sub = state.sub;
  let title = '', help = '', body = '';
  if (sub === 0) {
    title = 'Tell us about your clinic'; help = 'A few details to get your practice set up.';
    const picked = c.addrPicked || c.addrManual;
    const addr = !picked
      ? `<div class="field addr-wrap"><label>Address</label><span class="pin">${ICONS.search}</span><input id="addr-search" data-addr="1" value="${esc(c.addrQuery)}" placeholder="Start with the house number, e.g. 4200 Legacy Dr" autocomplete="off" /><div class="suggest" id="addr-suggest"></div></div>
         <div class="small geo-line" style="margin-top:12px"><button class="link purple" id="addr-manual">Enter address manually</button></div>`
      : `${c.addrPicked ? `<div class="addr-picked"><div class="picked"><div><div class="t">${esc(c.address1)}</div><div class="d">${esc(c.city)}, ${esc(c.state)} ${esc(c.zip)}</div></div><button class="link purple" id="addr-change">Change</button></div></div>` : ''}
         <div class="grid two" style="margin-top:16px">${field('Address line 1', 'clinic.address1', { ph: 'Street address' })}${field('Address line 2 (optional)', 'clinic.address2', { ph: 'Suite, floor, unit' })}</div>
         <div class="grid three" style="margin-top:16px">${field('City', 'clinic.city', { ph: 'City' })}${selectField('State', 'clinic.state', STATES, 'Select state')}${field('ZIP code', 'clinic.zip', { max: 10, ph: 'ZIP' })}</div>`;
    body = `<div class="wiz-cols"><div>
        <h3 class="wiz-h3">Practice details</h3>
        <div class="stack">${field('Practice name', 'clinic.practice', { ph: 'Name of practice' })}${field('Practice phone (optional)', 'clinic.phone', { ph: '(___) ___-____' })}</div>
        <hr class="wiz-hr" />
        <h3 class="wiz-h3">Practice location</h3><div class="wiz-h3sub">Start typing your address, then select a match.</div>
        ${addr}
      </div>
      <aside class="wiz-aside"><div class="ico">${ICONS.clinicBig}</div><div class="t">Your clinic profile</div><div>This is the practice information patients and providers will see.</div></aside></div>`;
  } else if (sub === 1) {
    title = 'Who manages this account?'; help = 'The person we contact about the account. Signed in as ' + esc(state.form.account.email || 'you') + '.';
    body = `<div class="wiz-cols"><div><h3 class="wiz-h3">Account manager</h3><div class="grid two">${field('Full name', 'clinic.adminName', { ph: 'Full name' })}${field('Phone number', 'clinic.adminPhone', { ph: '(___) ___-____' })}</div></div>
      <aside class="wiz-aside"><div class="ico">${ICONS.people}</div><div class="t">Your account manager</div><div>Signs the service agreement and hears from us about billing, results and anything that needs a decision.</div></aside></div>`;
  } else {
    title = 'Do you have more than one location?'; help = 'You can add more locations any time from Clinics.';
    body = `<div class="wiz-cols"><div><div class="opts">
        <label class="opt ${c.multi === 'one' ? 'sel' : ''}" data-radio="clinic.multi" data-val="one"><div class="t">Just this one <span class="rec-pill">Most clinics</span></div><div class="d">Everything you set up here applies to ${esc(c.practice || 'your clinic')}.</div></label>
        <label class="opt ${c.multi === 'many' ? 'sel' : ''}" data-radio="clinic.multi" data-val="many"><div class="t">More than one</div><div class="d">Add the others from Clinics after setup. Each location signs its own agreement and can have its own medical director.</div></label>
      </div></div>
      <aside class="wiz-aside"><div class="ico">${ICONS.locations}</div><div class="t">Locations</div><div>Results, exams and billing are tracked per location, so each one gets its own profile.</div></aside></div>`;
  }
  return card('', title, help, body, footer('Continue', clinicSubValid(sub), sub === 0 ? '<button class="link" id="btn-fill-clinic">Use sample</button>' : '', sub === 0 ? 'Add your practice name and address to continue' : sub === 1 ? 'Add the account manager to continue' : ''));
};

R.md = () => {
  const m = state.form.md;
  let msg = '';
  if (m.npi && m.verified === true) { const r = npiLookup(m.npi).rec; msg = `<div class="msg ok">&#10003; Verified with MedPro: ${esc(r.name)}${r.credential ? ', ' + esc(r.credential) : ''}${r.taxonomy ? ' · ' + esc(r.taxonomy) : ''}${r.city ? ' · ' + esc(r.city) + ', ' + esc(r.state) : ''} · ${esc(r.status)}</div>`; }
  else if (m.npi && m.verified === false) { msg = `<div class="msg err">${esc(npiLookup(m.npi).reason || 'We could not verify this NPI.')} Check the number on <a href="https://npiregistry.cms.hhs.gov/" target="_blank" rel="noopener">npiregistry.cms.hhs.gov</a>.</div>`; }
  else if (m.npi) { msg = '<div class="msg wait">Enter all 10 digits and we will verify it.</div>'; }
  return card('', 'Who is your medical director?', 'The physician who supervises care at your clinic. We verify the NPI with MedPro before you continue.',
    `<div class="wiz-cols"><div>
       <h3 class="wiz-h3">Medical director</h3>
       <div class="grid two">${field('Full name', 'md.name', { ph: 'First Last' })}${field('Email', 'md.email', { type: 'email', ph: 'name@clinic.com' })}</div>
       <div class="grid two" style="margin-top:16px">${field('Phone', 'md.phone', { ph: '(___) ___-____' })}${field('NPI number', 'md.npi', { max: 10, ph: '10 digits', err: m.verified === false, msg })}</div>
       ${m.verified === false ? '<div class="callout warn" style="margin-top:16px"><strong>We could not verify this medical director.</strong> Setup cannot continue until the NPI matches an active record. If you are not sure who your medical director is, <button type="button" class="link purple nou" id="wiz-save-later">save and finish later</button>.</div>' : ''}
       
     </div>
     <aside class="wiz-aside"><div class="ico">${ICONS.shield}</div><div class="t">Why we verify</div><div>Every exam is supervised by a licensed physician. We check the NPI with MedPro, the same verification our providers go through, so the medical director on file is real, licensed and active.</div></aside></div>`,
    footer('Verify and continue', stepValid('md'), '<button class="link" id="btn-fill-md">Use sample</button>', m.verified === false ? 'Fix the NPI to continue' : 'Enter your medical director and NPI to continue'));
};

R.agreement = () => {
  const a = state.form.agreement; const admin = state.form.clinic.adminName || 'Account admin'; const practice = state.form.clinic.practice || 'your clinic';
  const lvl = (id, ico, title, desc, bullets, rec) => `<div class="level ${a.level === id ? 'sel' : ''}" data-level="${id}"><div class="lv-top"><span class="lv-ico">${ico}</span>${rec ? '<span class="rec-pill">Recommended</span>' : ''}<span class="lv-radio"></span></div><div class="t">${title}</div><div class="d">${desc}</div><ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`;
  return card('', 'Choose your level of service', 'One agreement covers your selected services.',
    `<div class="levels">${lvl('gfe', ICONS.doc, 'Good faith exams', 'Medical clearance for your clinic', ['Async review or video visit', 'Results in your portal'])}${lvl('rx', ICONS.docPlus, 'Good faith exams + prescriptions', 'Adds the prescribing addendum to your agreement', ['Everything in Good faith exams', 'Partner pharmacy fulfillment'], true)}</div>
     <div class="wiz-card sign-card"><h3 class="wiz-h3">Review and sign</h3>
       <div class="doc"><span class="doc-ico">${ICONS.doc}</span><div><div class="t">Service agreement</div><div class="d">${esc(admin)} &middot; ${esc(practice)}</div></div><span class="status-pill ok">${a.signed ? 'Signed' : 'Ready to sign'}</span>${a.signed ? `<div class="sigline">${esc(admin)}</div>` : '<button class="btn primary sm" id="btn-sign">Review &amp; sign</button>'}</div>
       ${a.level === 'rx' ? `<div class="doc"><span class="doc-ico">${ICONS.docPlus}</span><div><div class="t">Prescribing addendum</div><div class="d">${esc(mdDisplay())} &middot; Medical director${a.signed ? ` &middot; emailed to ${esc(state.form.md.email || 'your medical director')}` : ''}</div></div><span class="status-pill muted">${a.signed ? 'Awaiting signature' : 'Sent after you sign'}</span><span class="doc-acts">${a.signed ? '<button type="button" class="link purple nou" id="md-link">Copy signing link</button>' : ''}<button type="button" class="link nou">View details</button></span></div><div class="wiz-info">${ICONS.info}<span>You can continue setup while your medical director signs. Prescribing becomes available once the addendum is signed. Agreement emails often land in spam, so you can also copy the signing link and send it by text or WhatsApp.</span></div>` : ''}
       
     </div>`,
    footer('Continue', stepValid('agreement'), '', 'Sign the service agreement to continue'), { bare: true });
};

R.profile = () => {
  const ids = activeQs();
  if (!ids.length) return card('', 'Setup questions', '', '<div class="empty">No questions are in v1. Add some in Questions.</div>', footer('Continue', true));
  if (state.sub >= ids.length) state.sub = ids.length - 1;
  const id = ids[state.sub]; const Q = q(id); const A = ans(id);
  const opts = Q.answers.map(a => {
    const desc = a.dynamicDesc === 'md' ? `${esc(mdDisplay())}${state.form.md.email ? ', ' + esc(state.form.md.email) : ''}, entered a moment ago. You can change it per location later.` : esc(a.desc || '');
    return `<label class="opt ${A.choice === a.id ? 'sel' : ''}" data-q="${id}" data-a="${a.id}"><div class="t">${esc(a.label)} ${a.rec ? '<span class="rec-pill">Recommended</span>' : ''}</div>${desc ? `<div class="d">${desc}</div>` : ''}${plumbChips(a.effects)}</label>`;
  }).join('');
  let extra = '';
  const chosen = Q.answers.find(a => a.id === A.choice);
  if (chosen && chosen.upsell) {
    const on = !!state.form.exams.quidgetReminder;
    extra += `<div class="quidget"><div class="wp">W</div><div><div class="t">Have a WordPress website? Add telehealth to it with our Quidget plugin.</div><div class="d">Qualiphy's free WordPress plugin lets patients start a Good Faith Exam from any page of your site. You can set it up any time after this; the plugin key will be under Settings &rsaquo; WordPress Quidget.</div></div><div class="act">${on ? '<span class="added">&#10003; Added to your setup checklist</span>' : '<button class="btn lav sm" id="quidget-remind">Remind me after setup</button>'}</div></div>`;
  }
  if (chosen && chosen.fields) extra += `<div class="wiz-sec"><div class="grid ${chosen.fields.length > 2 ? 'three' : 'two'}">${chosen.fields.map(fl => `<div class="field"><label>${esc(fl)}</label><input data-q="${id}" data-field="${esc(fl)}" value="${esc(A.fields[fl] || '')}" /></div>`).join('')}</div>${Q.id === 'pharmacy' && A.choice === 'own' ? '<div class="note muted small" style="margin-top:10px">Our Med Ops team will review this pharmacy before your first prescription. You will not get shipment tracking or delivery confirmation from Qualiphy for orders sent here.</div>' : ''}</div>`;
  const visible = A.choice ? Q.followups.filter(f => f.showIf.includes(A.choice)) : [];
  const toggles = visible.filter(f => f.type === 'toggle');
  const others = visible.filter(f => f.type !== 'toggle');
  if (toggles.length) {
    const title = (Q.groupTitle && Q.groupTitle[A.choice]) || `Because you chose "${chosen ? chosen.label : ''}"`;
    const sub = (Q.groupSub && Q.groupSub[A.choice]) || '';
    extra += `<div class="wiz-sec"><h3 class="wiz-h3">${esc(title)}</h3>${sub ? `<div class="wiz-h3sub">${esc(sub)}</div>` : ''}<div class="switch-list">${toggles.map(f => { const on = A.fu[f.id] === undefined ? f.default : A.fu[f.id]; return `<label class="switch-row ${on ? 'on' : ''}"><div class="txt">${esc(f.label)}${plumbChips(f.effects[on ? 'on' : 'off'])}</div><div class="ctl"><span class="switch ${on ? 'on' : ''}"><input type="checkbox" data-q="${id}" data-fu="${f.id}" ${on ? 'checked' : ''} /><span class="knob"></span></span><span class="sw-lbl">${on ? 'On' : 'Off'}</span></div></label>`; }).join('')}</div></div>`;
  }
  others.forEach(f => {
    if (f.type === 'radio') { extra += `<div class="wiz-sec"><h3 class="wiz-h3">${esc(f.label)}</h3><div class="opts">${f.options.map(o => `<label class="opt ${A.fu[f.id] === o.id ? 'sel' : ''}" data-q="${id}" data-fu="${f.id}" data-o="${o.id}"><div class="t">${esc(o.label)} ${o.rec ? '<span class="rec-pill">Recommended</span>' : ''}</div>${o.desc ? `<div class="d">${esc(o.desc)}</div>` : ''}${plumbChips(o.effects)}</label>`).join('')}</div></div>`; }
    else if (f.type === 'text') { extra += `<div class="wiz-sec"><div class="field"><label>${esc(f.label)}</label><input data-q="${id}" data-fu-text="${f.id}" value="${esc(A.fields[f.id] || '')}" placeholder="${esc(f.placeholder || '')}" /></div>${plumbChips(f.effects)}</div>`; }
    else if (f.type === 'contactlist') {
      const list = A.fu[f.id] || (A.fu[f.id] = seedContacts());
      extra += `<div class="wiz-sec"><h3 class="wiz-h3">${esc(f.label)}</h3>${f.tip ? `<div class="wiz-tip">${ICONS.info}<span>${esc(f.tip)}</span></div>` : ''}<div class="cl-list">${list.map((c, i) => `<div class="cl-row"><div class="field"><label>Name</label><input data-cl="${id}:${f.id}:${i}:name" value="${esc(c.name)}" placeholder="Full name" /></div><div class="field"><label>Email</label><input data-cl="${id}:${f.id}:${i}:email" value="${esc(c.email)}" placeholder="name@clinic.com" /></div><div class="field"><label>Phone</label><input data-cl="${id}:${f.id}:${i}:phone" value="${esc(c.phone)}" placeholder="(___) ___-____" /></div>${i > 0 ? `<button type="button" class="link cl-del" data-cl-del="${id}:${f.id}:${i}" title="Remove contact">&times;</button>` : '<span></span>'}</div>`).join('')}</div>${list.length < (f.max || 5) ? `<button type="button" class="btn lav sm" data-cl-add="${id}:${f.id}">Add another contact</button>` : ''}${plumbChips(f.effects)}</div>`;
    }
    else if (f.type === 'contacts') { const sel = A.fu[f.id] || {}; extra += `<div class="wiz-sec"><h3 class="wiz-h3">${esc(f.label)}</h3><div class="wiz-h3sub">Select everyone who should receive results and deferral notices.</div><div class="checks-row">${f.roles.map(r => { const on = sel[r.id] === undefined ? r.default : sel[r.id]; return `<label><input type="checkbox" data-q="${id}" data-role="${r.id}" data-fu="${f.id}" ${on ? 'checked' : ''} />${esc(r.label)}</label>`; }).join('')}</div>${plumbChips(f.effects)}</div>`; }
  });
  const pageTitle = Q.pageTitle || Q.title; const pageSub = Q.pageSub || Q.help;
  const body = `${Q.pageTitle ? `<h3 class="wiz-h3">${esc(Q.title)}</h3>` : ''}<div class="opts">${opts}</div>${Q.tip ? `<div class="wiz-tip" style="margin-top:14px">${ICONS.info}<span>${esc(Q.tip)}</span></div>` : ''}${extra}`;
  const last = state.sub === ids.length - 1;
  return card('', esc(pageTitle), esc(pageSub), body, footer(last ? 'Continue' : 'Next', !!A.choice, '<button class="link" id="btn-skip">Skip for now</button>', 'Pick an option to continue'));
};

R.exams = () => {
  const sel = state.form.exams.services; const count = SERVICES.filter(s => sel.includes(s.id)).flatMap(s => s.exams).length;
  return card('', 'Which services do you offer?', 'We activate the matching exams as favorites so they are ready on day one. Change this any time in Exams.',
    `<div class="services">${SERVICES.map(s => { const locked = s.rx && !isRx(); const on = sel.includes(s.id); return `<label class="svc ${on ? 'sel' : ''} ${locked ? 'locked' : ''}"><input type="checkbox" data-svc="${s.id}" ${on ? 'checked' : ''} ${locked ? 'disabled' : ''} /><div><div class="t">${esc(s.label)}${locked ? ' <span class="badge muted">needs prescriptions</span>' : ''}</div><div class="d">${esc(s.exams.join(', '))}</div></div></label>`; }).join('')}</div>
     <div class="muted small" style="margin-top:16px">${sel.length ? count + ' exams will be activated.' : 'Nothing selected yet. You can also skip and pick exams later.'}</div>
     `,
    footer('Continue', true, '<button class="link" id="btn-skip-exams">Skip for now</button>'));
};

function payForm(prefix, btnId, btnLabel) {
  return `<div class="grid two"><div class="field"><label>Card number</label><input placeholder="4242 4242 4242 4242" id="${prefix}-num" /></div><div class="field"><label>Name on card</label><input placeholder="Dana Whitfield" /></div></div><div class="grid three" style="margin-top:16px"><div class="field"><label>Expiry</label><input placeholder="MM/YY" /></div><div class="field"><label>CVC</label><input placeholder="123" /></div><div class="field"><label>ZIP</label><input placeholder="75034" /></div></div><div class="row" style="margin-top:18px"><button type="button" class="btn primary sm" id="${btnId}">${btnLabel}</button><span class="muted small">Demo: nothing is sent anywhere.</span></div>`;
}
function paySaved(brand, last4, exp) { return `<div class="saved"><div><div style="font-weight:600">${brand} ending ${last4}</div><div class="muted small">Expires ${exp}</div></div><span class="status-pill ok">On file</span></div>`; }
R.payment = () => {
  const p = state.form.payment;
  return card('', 'Add your payment methods', 'You are billed per completed exam. Nothing is charged today. A backup card keeps exams running if the primary card fails.',
    `<div class="pay-grid">
       <div class="paycard"><h3 class="wiz-h3">Primary payment method</h3>${p.done ? paySaved('Visa', '4242', '12/28') : payForm('pm', 'btn-pay', 'Save card')}</div>
       <div class="paycard"><h3 class="wiz-h3">Backup payment method <span class="rec-pill">Required</span></h3><div class="wiz-h3sub">Charged only if the primary card is declined, so patient exams never stop.</div>${p.backup ? paySaved('Mastercard', '5555', '08/29') : payForm('bk', 'btn-pay-backup', 'Save backup card')}</div>
     </div>
     
     `,
    footer('Finish setup', stepValid('payment'), '', p.done ? 'Add a backup card to finish setup' : 'Save a primary and a backup card to finish setup'));
};

function renderSignup() {
  const s = STEPS[state.step];
  if (s.kind === 'account') return `<div class="wrap">${R.account()}</div>`;
  wizFoot = '';
  const body = R[s.kind]();
  const name = state.form.clinic.practice || 'Clinic setup';
  return `<div class="wiz">${wizSide()}<div class="wiz-main"><header class="wiz-top"><div class="wiz-name">${esc(name)}</div><button class="link purple nou" id="wiz-save" title="Progress is saved automatically in this demo">Save &amp; exit</button></header><div class="wiz-body"><div class="wiz-inner">${body}</div></div><footer class="wiz-foot">${wizFoot}</footer></div></div>`;
}

/* ---------- portal (after the wizard) ---------- */
const PORTAL_PAGES = {
  dashboard: { title: 'Dashboard', icon: 'dash' }, results: { title: 'Patient Exams', icon: 'clipboard' }, clinics: { title: 'Clinics', icon: 'home' },
  managers: { title: 'Managers', icon: 'users' }, medication: { title: 'Medication Management', icon: 'pill' }, exams: { title: 'Exams', icon: 'clipboard' },
  intake: { title: 'Intake Forms (Beta)', icon: 'file' }, knowledge: { title: 'Knowledge Base', icon: 'question' }, weightloss: { title: 'Weight Loss Exam', icon: 'clipEdit' }, rewards: { title: 'Rewards', icon: 'users' }, white: { title: 'White Label', icon: 'gear' }, settings: { title: 'Settings', icon: 'gear' },
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
    { t: 'Prescribing addendum countersigned', d: `Waiting on ${f.md.email || 'your medical director'} (QualiSign). Emails often land in spam.`, act: '<button type="button" class="link purple nou" id="md-link">Copy signing link</button>', done: false, warn: true, hide: !isRx() },
    { t: 'Patient care provider on file', d: (ans('pcp').choice === 'md') ? mdDisplay() : (ans('pcp').fields['Full name'] || 'Not set'), done: ans('pcp').choice === 'md' || !!ans('pcp').fields['Full name'] },
    { t: 'Exams activated', d: f.exams.services.length ? `${activeExams().length} favorites ready` : 'Pick the services you offer', done: f.exams.services.length > 0 },
    { t: 'Payment methods', d: f.payment.done && f.payment.backup ? 'Visa 4242 primary, Mastercard 5555 backup' : f.payment.done ? 'Backup card missing' : 'Add a card', done: f.payment.done && f.payment.backup },
    { t: 'Install the Quidget WordPress plugin', d: 'Settings > WordPress Quidget opens the plugin site with the install steps.', done: false, hide: !wantsQuidget(), page: 'settings', panel: 'quidget' },
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
      ${wantsQuidget() ? `<div class="quidget"><div class="wp">W</div><div><div class="t">Set up the Qualiphy Quidget on your WordPress site</div><div class="d">Your plugin key is ready. Install the plugin, paste the key, and patients can start an exam from any page of your site.</div></div><div class="act"><button class="btn lav sm" id="quidget-open">Open WordPress Quidget</button></div></div>` : ''}
      <div class="sec" id="tour-checklist"><div class="sec-h"><div><div class="t">Finish setting up your practice</div><div class="d">${doneCount} of ${items.length} steps complete. Everything stays visible in Settings; this just points you at what is next.</div></div>${next ? `<button class="btn primary sm ${next.cta ? 'pulse' : ''}" ${next.page ? `data-page="${next.page}" data-panel="${next.panel || ''}"` : ''}>${next.cta ? 'Send your first exam' : 'Continue setup'}</button>` : ''}</div>
        <div class="sec-b"><div class="progress"><div class="bar" style="width:${pct}%"></div></div>
          <div class="cl">${items.map(i => `<div class="ci ${i.done ? 'done' : ''} ${i.page ? 'go' : ''}" ${i.page ? `data-page="${i.page}" data-panel="${i.panel || ''}"` : ''}><div class="ic ${i.done ? 'done' : i.warn ? 'warn' : 'todo'}">${i.done ? '&#10003;' : i.warn ? '!' : ''}</div><div><div class="t">${esc(i.t)}${!i.done && next && next.t === i.t ? '<span class="next-pill">Next</span>' : ''}${i.warn ? '<span class="badge warn" style="margin-left:8px">Waiting on signature</span>' : ''}</div><div class="d">${esc(i.d)}${i.act ? ' ' + i.act : ''}</div></div></div>`).join('')}</div>
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

const WORDPRESS_QUIDGET_URL = 'https://quidget.qualiphy.me';
const API_DOCS_URL = 'https://api-docs.qualiphy.me';
function pageSettings() {
  const key = pluginKey(); const shown = state.showKey;
  return `
      <div class="set-col">
        <div class="pcard"><div class="apikey">
          <div class="lbl">API Key (Default Clinic)</div>
          <div class="keyrow">${shown ? `<code>${esc(key)}</code>` : `<span class="mask">${'&bull;'.repeat(24)}</span>`}<button type="button" class="ikb key-toggle" title="${shown ? 'Hide' : 'Show'}" aria-label="${shown ? 'Hide' : 'Show'} API Key">${shown ? ICONS.eyeOff : ICONS.eye}</button><button type="button" class="ikb key-copy" title="Copy" aria-label="Copy API Key">${ICONS.copy}</button></div>
          <div class="apifoot"><a href="${API_DOCS_URL}" target="_blank" rel="noopener noreferrer">${ICONS.book} API Documentation ${ICONS.ext}</a><p>Endpoints, request formats and webhook events for this key.</p></div>
        </div></div>
        <button type="button" class="set-btn" id="set-notif">Notification Settings</button>
        <a class="set-btn ${state.settingsPanel === 'quidget' ? 'hilite' : ''}" id="set-wpq" href="${WORDPRESS_QUIDGET_URL}" target="_blank" rel="noopener noreferrer">${ICONS.wordpress} WordPress Quidget ${ICONS.ext}</a>
        <button type="button" class="set-btn">Change Password</button>
        <button type="button" class="set-btn">Change Email</button>
        <button type="button" class="set-btn danger" id="set-logout">Logout</button>
        
      </div>
      ${state.notifModal ? notifModalHtml() : ''}`;
}

/* Legacy ClinicNotificationSettingsModal, seeded from the wizard answers: the contacts the
   clinic picked become Approved / Deferred contacts; the outreach toggle is the
   "Qualiphy Providers Contact Patients for Pending Consultations" switch. */
function seedContacts() {
  const f = state.form; const c = f.clinic;
  return [{ name: c.adminName || '', email: f.account.email || '', phone: c.adminPhone || '' }];
}
function seedNotif() {
  const A = ans('comms'); const f = state.form;
  const list = (Array.isArray(A.fu.contacts) ? A.fu.contacts : seedContacts()).filter(c => (c.name || c.email));
  const contacts = list.map(c => { const [first, ...rest] = (c.name || '').trim().split(/\s+/); return { first: first || '', last: rest.join(' '), email: c.email || '', mobile: c.phone || '' }; });
  const any = contacts.length > 0 && A.choice !== 'clinic';
  const outreach = A.fu.outreach === undefined ? true : !!A.fu.outreach;
  const blank = () => [{ first: '', last: '', email: '', mobile: '' }];
  return { approve: { value: any, contacts: any ? contacts.map(c => ({ ...c })) : blank() }, reject: { value: any, contacts: any ? contacts.map(c => ({ ...c })) : blank() }, na: { value: false, contacts: blank() }, pending: outreach };
}
function notifModalHtml() {
  const n = state.notif || (state.notif = seedNotif());
  const sw = (id, on, label) => `<div class="nrow"><label class="pswitch ${on ? 'on' : ''}"><input type="checkbox" data-notif="${id}" ${on ? 'checked' : ''} /><span class="slider"></span></label><span class="nlbl">${label}</span></div>`;
  const cards = (type, list) => `<div class="ncontacts">${list.map((c, i) => `<div class="ncard">${i > 0 ? `<div class="ncard-x"><button type="button" class="nx" data-notif-del="${type}:${i}" title="Remove">&#128465;</button></div>` : ''}
      <div class="nf"><label>First Name</label><input placeholder="First Name" value="${esc(c.first)}" data-notif-field="${type}:${i}:first" /></div>
      <div class="nf"><label>Last Name</label><input placeholder="Last Name" value="${esc(c.last)}" data-notif-field="${type}:${i}:last" /></div>
      <div class="nf"><label>Email</label><input placeholder="abc@gmail.com" value="${esc(c.email)}" data-notif-field="${type}:${i}:email" /></div>
      ${type !== 'approve' && i < 2 ? `<div class="nf"><label>Phone Number <span class="ninfo" title="Only first two contacts may have phone numbers included for SMS notifications.">${ICONS.info}</span></label><input placeholder="(999) 999-9999" value="${esc(c.mobile)}" data-notif-field="${type}:${i}:mobile" /></div>` : ''}
    </div>`).join('')}${list.length < 5 ? `<button type="button" class="btn lav sm nadd" data-notif-add="${type}">Add Another Contact</button>` : ''}</div>`;
  return `<div class="lmodal-wrap"><div class="lmodal">
    <div class="lmodal-h"><div class="t">Notification Settings</div><button type="button" class="lmodal-x" id="notif-close" aria-label="Close">${ICONS.cross}</button></div>
    <div class="lmodal-b">
      <div class="pdrop"><span>${esc(state.form.clinic.practice || 'Select a Clinic')}</span><span class="chev">&#9662;</span></div>
      <div class="nlist">
        ${sw('approve', n.approve.value, 'Approved Notification')}${n.approve.value ? cards('approve', n.approve.contacts) : ''}
        ${sw('reject', n.reject.value, 'Deferred Notification')}${n.reject.value ? cards('reject', n.reject.contacts) : ''}
        ${sw('na', n.na.value, 'Not Applicable Notification')}${n.na.value ? cards('na', n.na.contacts) : ''}
        ${sw('pending', n.pending, 'Qualiphy Providers Contact Patients for Pending Consultations')}
      </div>
      <button type="button" class="set-btn" id="notif-save" style="margin-top:16px">Save</button>
    </div>
  </div></div>`;
}

function pagePlaceholder(page) {
  const p = PORTAL_PAGES[page];
  return `<div class="ph"><div><h1>${esc(p.title)}</h1><div class="d">Not part of this demo. It looks and works as it does in the portal today.</div></div></div><div class="sec"><div class="sec-b"><div class="empty-state"><div class="t">${esc(p.title)}</div><div class="d">Unchanged by the setup wizard.</div></div></div></div>`;
}

function renderPortal() {
  const page = PORTAL_PAGES[state.portalPage] ? state.portalPage : 'dashboard';
  const menu = [['Results', 'clipboard', 'results'], ['Clinics', 'home', 'clinics'], ['Managers', 'users', 'managers'], ['Medication Management', 'pill', 'medication'], ['Exams', 'clipboard', 'exams'], ['Intake Forms (Beta)', 'file', 'intake'], ['Knowledge Base', 'question', 'knowledge'], ['Weight Loss Exam', 'clipEdit', 'weightloss'], ['Rewards', 'users', 'rewards'], ['White Label', 'gear', 'white'], ['Settings', 'gear', 'settings']];
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
  const tb = $('#topbar'); tb.classList.toggle('portal-bar', state.view === 'portal'); tb.hidden = state.view === 'signup';
  document.body.classList.toggle('wiz-mode', state.view === 'signup' && STEPS[state.step].kind !== 'account');
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
  if (e.target.id === 'quidget-open') { state.portalPage = 'settings'; state.settingsPanel = 'quidget'; render(); window.scrollTo(0, 0); setTimeout(() => { state.settingsPanel = null; const b = $('#set-wpq'); if (b) b.classList.remove('hilite'); }, 2400); return; }
  const cla = e.target.closest('[data-cl-add]'); if (cla) { const [qid, fid] = cla.dataset.clAdd.split(':'); const A = ans(qid); (A.fu[fid] || (A.fu[fid] = seedContacts())).push({ name: '', email: '', phone: '' }); render(); return; }
  const cld = e.target.closest('[data-cl-del]'); if (cld) { const [qid, fid, i] = cld.dataset.clDel.split(':'); ans(qid).fu[fid].splice(+i, 1); render(); return; }
  if (e.target.id === 'md-link') { try { navigator.clipboard.writeText('https://sign.qualiphy.me/demo/addendum'); } catch (x) {} toast('Signing link copied. Send it to your medical director by text or WhatsApp.'); return; }
  if (e.target.id === 'wiz-save' || e.target.id === 'wiz-save-later') { save(); toast('Progress saved. We emailed you a link to finish later.'); return; }
  if (e.target.id === 'set-notif') { state.notif = seedNotif(); state.notifModal = true; render(); return; }
  if (e.target.id === 'notif-close' || e.target.closest('#notif-close') || (e.target.classList.contains('lmodal-wrap'))) { if (state.notifModal) { state.notifModal = false; render(); return; } }
  if (e.target.id === 'notif-save') { state.notifModal = false; render(); toast('Notification settings updated successfully'); return; }
  const nadd = e.target.closest('[data-notif-add]'); if (nadd) { state.notif[nadd.dataset.notifAdd].contacts.push({ first: '', last: '', email: '', mobile: '' }); render(); return; }
  const ndel = e.target.closest('[data-notif-del]'); if (ndel) { const [t, i] = ndel.dataset.notifDel.split(':'); state.notif[t].contacts.splice(+i, 1); render(); return; }
  const sb = e.target.closest('.set-btn[data-panel]'); if (sb) { state.settingsPanel = state.settingsPanel === sb.dataset.panel ? null : sb.dataset.panel; render(); return; }
  const kc = e.target.closest('.key-copy'); if (kc) { try { navigator.clipboard.writeText(pluginKey()); } catch (x) {} toast('API Key (Default Clinic) copied to clipboard'); return; }
  const kt = e.target.closest('.key-toggle'); if (kt) { state.showKey = !state.showKey; render(); return; }
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
  if (e.target.id === 'btn-pay-backup') { state.form.payment.backup = true; render(); return; }
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
  if (t.dataset.notif) { const n = state.notif; if (t.dataset.notif === 'pending') n.pending = t.checked; else n[t.dataset.notif].value = t.checked; render(); return; }
  if (t.dataset.notifField) { const [ty, i, k] = t.dataset.notifField.split(':'); state.notif[ty].contacts[+i][k] = t.value; return; }
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
  if (t.dataset.cl) { const [qid, fid, i, k] = t.dataset.cl.split(':'); const A = ans(qid); if (A.fu[fid] && A.fu[fid][+i]) { A.fu[fid][+i][k] = t.value; save(); } return; }
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
