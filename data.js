/* Qualiphy Clinic Signup demo - data (share build, fake data only) */

/* Where an answer can be written today (CONFIG-INVENTORY.md, frontend 08c12add). */
const WHERE = {
  signup:     { label: 'Collected at signup',  cls: 'ok',   status: 'written' },
  portal:     { label: 'Clinic portal',        cls: 'ok',   status: 'written' },
  superadmin: { label: 'Super Admin only',     cls: 'cond', status: 'support' },
  nowhere:    { label: 'No UI exists',         cls: 'no',   status: 'engineering' },
  none:       { label: 'Not a setting',        cls: 'info', status: 'handoff' },
};

/* No hard cap on setup questions. */
const CAP = null;

/* The signup steps, in Figma order. `kind` picks the renderer. */
const STEPS = [
  { id: 'account',   label: 'Account',          figma: 'Initial Clinic Sign Up',        kind: 'account' },
  { id: 'terms',     label: 'Terms of use',     figma: 'Terms of Use Confirmation',     kind: 'terms' },
  { id: 'clinic',    label: 'Clinic',           figma: 'Clinic Information',            kind: 'clinic' },
  { id: 'md',        label: 'Medical director', figma: 'Medical Director + NPI check',  kind: 'md' },
  { id: 'agreement', label: 'Agreement',        figma: 'Contract: levels of service',   kind: 'agreement' },
  { id: 'profile',   label: 'Setup questions',  figma: 'Profile Configuration',         kind: 'profile' },
  { id: 'exams',     label: 'Exams',            figma: 'Activation of Exams',           kind: 'exams' },
  { id: 'payment',   label: 'Payment',          figma: '(existing Payment step)',       kind: 'payment' },
];

const STATE_ABBR = { 'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','District of Columbia':'DC','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY' };
const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

/* Address suggestions for the demo. Production would use a places / address-validation API. */
const ADDRESSES = [
  { line1: '4200 Legacy Dr, Suite 120', city: 'Frisco', state: 'TX', zip: '75034' },
  { line1: '4201 Legacy Dr', city: 'Plano', state: 'TX', zip: '75024' },
  { line1: '420 N Central Expy', city: 'Dallas', state: 'TX', zip: '75204' },
  { line1: '4210 W Lovers Ln', city: 'Dallas', state: 'TX', zip: '75209' },
  { line1: '8600 Beverly Blvd, Suite 210', city: 'Los Angeles', state: 'CA', zip: '90048' },
  { line1: '9201 Wilshire Blvd', city: 'Beverly Hills', state: 'CA', zip: '90210' },
  { line1: '1500 Ocean Ave', city: 'Santa Monica', state: 'CA', zip: '90401' },
  { line1: '2020 Biscayne Blvd', city: 'Miami', state: 'FL', zip: '33137' },
  { line1: '7250 E Camelback Rd', city: 'Scottsdale', state: 'AZ', zip: '85251' },
  { line1: '3100 Peachtree Rd NE', city: 'Atlanta', state: 'GA', zip: '30305' },
  { line1: '1020 Lincoln Rd', city: 'Miami Beach', state: 'FL', zip: '33139' },
  { line1: '55 E 5th Ave', city: 'New York', state: 'NY', zip: '10003' },
];

/* Street dictionary + city pool for synthesized suggestions when the typed address is not in ADDRESSES. */
const STREETS = ['Main','Maple','Market','Oak','Elm','Park','Pine','Cedar','Lake','Hill','Washington','Lincoln','Jefferson','Madison','Broadway','Sunset','Ocean','Wilshire','Camelback','Peachtree','Legacy','Preston','Central','Highland','Ridge','River','Spring','Valley','Union','Church','Mill','Walnut','Chestnut','Cherry','Willow','Meadow','Forest','Harbor','Bay','Beach','Lakeshore','Commerce','Industrial','Technology','University','College','Medical','Hospital','Wellness','Village','Plaza','Grand','First','Second','Third','Fourth','Fifth','North','South','East','West'];
const SUFFIXES = ['St', 'Ave', 'Blvd', 'Dr', 'Rd', 'Ln', 'Pkwy', 'Way'];
const CITY_POOL = [
  { city: 'Frisco', state: 'TX', zip: '75034', lat: 33.15, lng: -96.82 }, { city: 'Plano', state: 'TX', zip: '75024', lat: 33.02, lng: -96.70 }, { city: 'Dallas', state: 'TX', zip: '75204', lat: 32.78, lng: -96.80 }, { city: 'Austin', state: 'TX', zip: '78701', lat: 30.27, lng: -97.74 }, { city: 'Houston', state: 'TX', zip: '77002', lat: 29.76, lng: -95.37 },
  { city: 'Los Angeles', state: 'CA', zip: '90048', lat: 34.05, lng: -118.24 }, { city: 'Beverly Hills', state: 'CA', zip: '90210', lat: 34.07, lng: -118.40 }, { city: 'Santa Monica', state: 'CA', zip: '90401', lat: 34.02, lng: -118.49 }, { city: 'San Diego', state: 'CA', zip: '92101', lat: 32.72, lng: -117.16 }, { city: 'Irvine', state: 'CA', zip: '92618', lat: 33.68, lng: -117.83 },
  { city: 'Miami', state: 'FL', zip: '33137', lat: 25.76, lng: -80.19 }, { city: 'Miami Beach', state: 'FL', zip: '33139', lat: 25.79, lng: -80.13 }, { city: 'Tampa', state: 'FL', zip: '33602', lat: 27.95, lng: -82.46 }, { city: 'Orlando', state: 'FL', zip: '32801', lat: 28.54, lng: -81.38 },
  { city: 'Scottsdale', state: 'AZ', zip: '85251', lat: 33.49, lng: -111.93 }, { city: 'Phoenix', state: 'AZ', zip: '85004', lat: 33.45, lng: -112.07 }, { city: 'Atlanta', state: 'GA', zip: '30305', lat: 33.75, lng: -84.39 }, { city: 'New York', state: 'NY', zip: '10003', lat: 40.71, lng: -74.01 }, { city: 'Brooklyn', state: 'NY', zip: '11201', lat: 40.68, lng: -73.94 },
  { city: 'Chicago', state: 'IL', zip: '60611', lat: 41.88, lng: -87.63 }, { city: 'Denver', state: 'CO', zip: '80202', lat: 39.74, lng: -104.99 }, { city: 'Nashville', state: 'TN', zip: '37203', lat: 36.16, lng: -86.78 }, { city: 'Charlotte', state: 'NC', zip: '28202', lat: 35.23, lng: -80.84 }, { city: 'Las Vegas', state: 'NV', zip: '89109', lat: 36.17, lng: -115.14 }, { city: 'Seattle', state: 'WA', zip: '98101', lat: 47.61, lng: -122.33 },
];
/* Coarse region from the browser time zone: no permission prompt, no precise location. */
const TZ_ORIGIN = {
  'America/Chicago': { lat: 32.78, lng: -96.80, label: 'the Central time zone' },
  'America/New_York': { lat: 36.5, lng: -79.0, label: 'the Eastern time zone' },
  'America/Detroit': { lat: 42.33, lng: -83.05, label: 'the Eastern time zone' },
  'America/Los_Angeles': { lat: 34.05, lng: -118.24, label: 'the Pacific time zone' },
  'America/Phoenix': { lat: 33.45, lng: -112.07, label: 'Arizona' },
  'America/Denver': { lat: 39.74, lng: -104.99, label: 'the Mountain time zone' },
};

/* Sample data the demo can drop in with one click. */
const SAMPLE = {
  practice: 'Glow Aesthetics', phone: '(469) 555-0100', address1: '4200 Legacy Dr, Suite 120', city: 'Frisco', state: 'TX', zip: '75034',
  admin: { first: 'Dana', last: 'Whitfield', email: 'dana@glowaesthetics.example' },
  md: { name: 'Priya Raman', email: 'praman@glowaesthetics.example', phone: '(469) 555-0142', npi: '1234567893' },
};

/* Mock NPPES directory for the demo. Real check is NPI Luhn (prefix 80840) then a registry lookup. */
const NPPES = {
  '1234567893': { name: 'PRIYA RAMAN', credential: 'MD', taxonomy: 'Family Medicine', city: 'FRISCO', state: 'TX', status: 'Active' },
};

/* Services for the Activation of Exams step. Exams are illustrative names. */
const SERVICES = [
  { id: 'aesthetics', label: 'Aesthetics & injectables', exams: ['Neurotoxin GFE', 'Dermal Filler GFE', 'Microneedling GFE', 'Laser / IPL GFE'] },
  { id: 'iv',         label: 'IV therapy & vitamins',    exams: ['IV Hydration GFE', 'NAD+ GFE', 'Vitamin Injection GFE'] },
  { id: 'weight',     label: 'Weight management (GLP-1)', exams: ['GLP-1 Initial Consult', 'GLP-1 Refill'], rx: true },
  { id: 'peptides',   label: 'Peptides',                 exams: ['Peptide Therapy Consult'], rx: true },
  { id: 'hair',       label: 'Hair restoration',         exams: ['Hair Loss Rx Consult', 'PRP Hair GFE'], rx: true },
  { id: 'sexual',     label: 'Sexual wellness',          exams: ['ED Consult', 'Hormone Screening'], rx: true },
  { id: 'wellness',   label: 'Wellness & hormones',      exams: ['Hormone Optimization Consult', 'Labs Review'], rx: true },
];

/* ------------------------------------------------------------------
   Profile Configuration questions (the "See Questions" box in the Figma).
   `state`: v1 | later | cut. Every effect names where the answer can be written today.
   ------------------------------------------------------------------ */
const QUESTIONS = [
  {
    id: 'comms',
    pageTitle: 'Set your communication preferences',
    pageSub: 'Choose who contacts patients and who receives exam updates.',
    state: 'v1',
    short: 'Patient communications',
    title: 'Who sends patient messages?',
    help: 'Pick one. Then set a few details for the option you picked.',
    groupTitle: { qualiphy: 'Qualiphy message settings', split: 'Qualiphy message settings', clinic: 'Your message settings' },
    groupSub: { qualiphy: 'Applies because Qualiphy sends your patient messages.', split: 'Applies to the invite Qualiphy sends.', clinic: 'Applies because your clinic sends its own messages.' },
    why: '',
    covers: [],
    by: [],
    evidence: '',
    answers: [
      { id: 'qualiphy', label: 'Qualiphy sends everything', rec: true,
        desc: 'Invite, reminders, deferral notices and follow-ups come from Qualiphy.',
        effects: [
          { label: 'Clinic-level SMS + email notifications', value: 'on', where: 'portal', inv: 'Approved-exam notification', via: 'POST /update_clinic_notification' },
          { label: 'Per-exam notification toggles', value: 'on (default)', where: 'superadmin', inv: null, via: 'exam-level sms_notification / email_notification' },
          { label: 'Per-follow-up sms_enabled / email_enabled', value: 'on (default)', where: 'superadmin', inv: null, via: 'follow-up templates' },
        ] },
      { id: 'clinic', label: 'We send our own, turn Qualiphy messages off',
        desc: 'Your system sends everything. Qualiphy stays silent to the patient.',
        effects: [
          { label: 'Clinic-level SMS + email notifications', value: 'off', where: 'portal', inv: 'Approved-exam notification', via: 'POST /update_clinic_notification' },
          { label: 'Per-exam notification toggles', value: 'off on every exam', where: 'superadmin', inv: null, via: 'exam-level sms_notification / email_notification' },
          { label: 'Per-follow-up sms_enabled / email_enabled', value: 'off', where: 'superadmin', inv: null, via: 'follow-up templates' },
        ] },
      { id: 'split', label: 'Qualiphy sends the invite, we handle everything after approval',
        desc: 'Common for clinics with their own aftercare sequence.',
        effects: [
          { label: 'Clinic-level SMS + email notifications', value: 'invite only', where: 'portal', inv: 'Approved-exam notification', via: 'POST /update_clinic_notification' },
          { label: 'Per-follow-up sms_enabled / email_enabled', value: 'off', where: 'superadmin', inv: null, via: 'follow-up templates' },
        ] },
    ],
    followups: [
      { id: 'deferral', type: 'toggle', default: true, showIf: ['qualiphy', 'split'],
        label: 'Notify the patient if the provider defers their treatment',
        note: '',
        effects: { on: [{ label: 'Deferred-exam notification', value: 'on', where: 'portal', inv: 'Deferred-exam notification', via: 'POST /update_clinic_notification' }],
                   off: [{ label: 'Deferred-exam notification', value: 'off', where: 'portal', inv: 'Deferred-exam notification', via: 'POST /update_clinic_notification' }] } },
      { id: 'outreach', type: 'toggle', default: true, showIf: ['qualiphy', 'split', 'clinic'],
        label: 'Call patients who have not finished a pending exam',
        note: '',
        effects: { on: [{ label: 'Providers contact patients for pending consults', value: 'on', where: 'portal', inv: 'Qualiphy providers contact patients', via: 'POST /update_clinic_notification' }],
                   off: [{ label: 'Providers contact patients for pending consults', value: 'off', where: 'portal', inv: 'Qualiphy providers contact patients', via: 'POST /update_clinic_notification' }] } },
      { id: 'followup', type: 'toggle', default: true, showIf: ['qualiphy'],
        label: 'Send follow-up emails after a prescription visit',
        note: '',
        effects: { on: [{ label: 'Follow-up emails after RxPad visits', value: 'on', where: 'superadmin', inv: null, via: 'follow-up templates' }],
                   off: [{ label: 'Follow-up emails after RxPad visits', value: 'off', where: 'superadmin', inv: null, via: 'follow-up templates' }] } },
      { id: 'contacts', type: 'contacts', showIf: ['qualiphy', 'split', 'clinic'],
        label: 'Who at your clinic should receive exam results and deferral notices? Select all that apply.',
        note: '',
        roles: [
          { id: 'md', label: 'Medical director', default: true },
          { id: 'nurse', label: 'Injecting nurse / clinical lead', default: true },
          { id: 'owner', label: 'Owner / front desk', default: false },
        ],
        effects: [{ label: 'Notification contacts (approved / deferred / N/A)', where: 'portal', inv: 'Approved-exam notification', via: 'POST /update_clinic_notification' },
                  { label: 'Role-based routing (per contact, per notice type)', where: 'nowhere', inv: null, via: 'no role model beyond one fixed manager role' }] },
    ],
  },

  {
    id: 'pcp',
    pageTitle: 'Name your patient care provider',
    pageSub: 'The clinician patients contact about their care. Named on prescriptions and results.',
    state: 'v1',
    short: 'Patient care provider',
    title: 'Who should patients contact about their care?',
    help: 'Named on prescriptions and results as the patient\'s point of contact. Prescriptions cannot be sent without one, and today that failure is silent.',
    why: '',
    covers: [],
    by: [],
    evidence: '',
    answers: [
      { id: 'md', label: 'Our medical director', rec: true, dynamicDesc: 'md',
        effects: [{ label: 'Patient Care Provider', value: 'medical director', where: 'portal', inv: 'Patient Care Provider (per location)', via: 'POST /patient_care_provider_edit' }] },
      { id: 'other', label: 'Someone else at the clinic',
        desc: 'A nurse, coordinator or front-desk lead.',
        fields: ['Full name', 'Email', 'Phone'],
        effects: [{ label: 'Patient Care Provider', value: 'entered contact', where: 'portal', inv: 'Patient Care Provider (per location)', via: 'POST /patient_care_provider_edit' }] },
    ],
    gate: 'Setup is not complete until a Patient Care Provider is on file for every location.',
    prereq: '',
    followups: [],
  },

  {
    id: 'pharmacy',
    pageTitle: 'Choose how prescriptions are filled',
    pageSub: 'Shown because you chose good faith exams + prescriptions.',
    state: 'v1',
    short: 'Prescription fulfilment',
    title: 'How should prescriptions be filled?',
    help: 'Shown because you chose GFE + prescriptions in the agreement step.',
    onlyIf: 'rx',
    why: '',
    covers: [],
    by: [],
    evidence: '',
    answers: [
      { id: 'partner', label: 'Qualiphy partner pharmacy', rec: true,
        desc: 'Shipment tracking, delivery confirmation and Event 3 webhooks included.',
        effects: [{ label: 'Pharmacy routing mode', value: 'partner', where: 'superadmin', inv: 'Dispensing pharmacy (EazyScript)', via: 'MedOps configures per clinic' }] },
      { id: 'own', label: 'Our own pharmacy',
        desc: 'Qualiphy is not integrated with it. No tracking or delivery confirmation from our side.',
        fields: ['Pharmacy name', 'NCPDP ID', 'Pharmacy contact email'],
        effects: [{ label: 'Pharmacy routing mode', value: 'custom (no tracking)', where: 'superadmin', inv: 'Dispensing pharmacy (EazyScript)', via: 'MedOps configures per clinic' },
                  { label: 'Route to a human', value: 'Med Ops review before go-live', where: 'none', inv: null, via: 'handoff' }] },
      { id: 'pad', label: 'Prescription pad only',
        desc: 'Our provider signs; you fulfil.',
        effects: [{ label: 'Pharmacy routing mode', value: 'prescription pad', where: 'superadmin', inv: 'Dispensing pharmacy (EazyScript)', via: 'MedOps configures per clinic' }] },
    ],
    followups: [],
  },

  {
    id: 'workflow',
    pageTitle: 'Tell us how you will work with Qualiphy',
    pageSub: 'Most clinics do everything from the Qualiphy portal. Pick the one that matches how your patients reach you.',
    state: 'v1',
    short: 'How you will work with Qualiphy',
    title: 'How will you send exam invites and manage patients?',
    help: 'Most clinics do everything from the Qualiphy portal. Pick the one that matches how your patients will reach you.',
    why: '',
    covers: [],
    by: [],
    evidence: '',
    answers: [
      { id: 'portal', label: 'From the Qualiphy portal', rec: true,
        desc: 'Staff send invites and see results here. Nothing else to set up.',
        upsell: true,
        effects: [{ label: 'Integration path', value: 'portal', where: 'none', inv: null, via: 'no setting; Quidget offer shown' }] },
      { id: 'wordpress', label: 'From our WordPress website, with the Qualiphy Quidget plugin',
        desc: 'Patients start an exam from your WordPress or WooCommerce site. We give you the plugin key at the end of setup.',
        effects: [{ label: 'Quidget plugin key issued', value: 'after setup completes', where: 'portal', inv: 'API key (per location)', via: 'Settings > API access' },
                  { label: 'Quidget embed configuration', value: 'clinic, exams, hours', where: 'nowhere', inv: 'Quidget embed configuration', via: 'not persisted server-side' }] },
      { id: 'emr', label: 'From our EMR or practice software',
        desc: 'Zenoti, Aesthetic Record, Meevo and others. Patients and results stay in your system.',
        effects: [{ label: 'EMR selection', value: 'chosen EMR', where: 'signup', inv: 'EMR selection', via: 'signup only; not editable afterwards' }] },
      { id: 'api', label: 'Our developers will connect with the Qualiphy API',
        desc: 'For a custom app, or a website built on Shopify, Squarespace, Wix or another builder. We send your developer the API documentation.',
        effects: [{ label: 'Account API key issued', value: 'after setup completes', where: 'portal', inv: 'API key (per location)', via: 'Settings > API access' }] },
    ],
    followups: [
      { id: 'emrname', type: 'radio', showIf: ['emr'],
        label: 'Which system?',
        options: [
          { id: 'zenoti', label: 'Zenoti', effects: [{ label: 'EMR selection', value: 'Zenoti', where: 'signup', inv: 'EMR selection', via: 'integration hub' }] },
          { id: 'ar', label: 'Aesthetic Record', effects: [{ label: 'EMR selection', value: 'Aesthetic Record', where: 'signup', inv: 'EMR selection', via: 'partner integration' }] },
          { id: 'meevo', label: 'Meevo', effects: [{ label: 'EMR selection', value: 'Meevo', where: 'signup', inv: 'EMR selection', via: 'partner integration' }] },
          { id: 'otheremr', label: 'Other', effects: [{ label: 'EMR selection', value: 'other', where: 'signup', inv: 'EMR selection', via: 'API' }] },
        ] },
      { id: 'techcontact', type: 'text', showIf: ['wordpress', 'emr', 'api'], placeholder: 'developer@youragency.example',
        label: 'Who is doing the technical setup? We will email them exactly what they need.',
        note: '',
        effects: [{ label: 'Technical contact / delegate invite', where: 'nowhere', inv: null, via: 'no delegate model today; agency contact exists nowhere' }] },
      { id: 'webhook', type: 'text', showIf: ['api'], placeholder: 'https://yourclinic.example/qualiphy/webhook',
        label: 'Where should Qualiphy post exam results? (optional, your developer can add it later)',
        note: '',
        effects: [{ label: 'Webhook URL (per location)', where: 'portal', inv: 'Webhook URL - per location', via: 'Edit Practice > Webhook' }] },
    ],
  },

  {
    id: 'payments',
    state: 'later',
    short: 'Payment processor',
    title: 'Which payment processor will your website use, and will you sell peptides or compounded medications through it?',
    help: 'Card networks flag peptides as non-FDA-approved. Knowing this up front avoids a frozen account after you are live.',
    why: '',
    covers: [], by: [], evidence: '',
    answers: [
      { id: 'stripe', label: 'Stripe or Square', effects: [{ label: 'Warn: peptides will be flagged', value: 'send processor guidance', where: 'none', inv: null, via: 'handoff' }] },
      { id: 'other', label: 'Authorize.net, PayPal, CorePay or other', effects: [] },
      { id: 'none', label: 'We do not sell online', rec: true, effects: [] },
    ],
    followups: [],
  },
  {
    id: 'testing',
    state: 'later',
    short: 'Testing before go-live',
    title: 'Will a developer test the integration before you go live?',
    help: 'There is no sandbox. Test exams take 2 to 24 hours and bill at your normal rate unless the no-charge test exam is enabled.',
    why: '',
    covers: [], by: [], evidence: '',
    answers: [
      { id: 'yes', label: 'Yes', effects: [{ label: 'Enable no-charge test exam 5359 and TE routing', value: 'requested', where: 'superadmin', inv: null, via: 'MedOps enables per clinic' }] },
      { id: 'no', label: 'No', rec: true, effects: [] },
    ],
    followups: [],
  },
];

/* Source-document rows (stripped in the share build). */
const DOC_ROWS = [];

/* Open decisions after the 09-15 call. */
const DECISIONS = [];

const INVENTORY = [];
