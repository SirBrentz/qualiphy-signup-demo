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
  { id: 'payment',   label: 'Payment information', figma: '(existing Payment step)',    kind: 'payment' },
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
  admin: { first: 'Dana', last: 'Whitfield', email: 'dana@glowaesthetics.example', phone: '(469) 555-0117' },
  md: { name: 'Priya Raman', email: 'praman@glowaesthetics.example', phone: '(469) 555-0142', npi: '1234567893' },
};

/* Mock MedPro directory for the demo. Real check is NPI Luhn (prefix 80840) then the MedPro lookup. */
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

/* EMRs for the workflow question. Integrated list to confirm with engineering; "other" starts from
   the EMR_LIST the current signup form uses, plus common practice systems, for demand capture. */
const EMRS = {
  integrated: [
    { id: 'zenoti', name: 'Zenoti', mark: 'Z', tint: '#2f5fd0' },
    { id: 'jane', name: 'Jane', mark: 'J', tint: '#0f7a6c' },
    { id: 'ar', name: 'Aesthetic Record', mark: 'AR', tint: '#b8336a' },
    { id: 'meevo', name: 'Meevo', mark: 'M', tint: '#6d4ad6', soon: true },
  ],
  other: ['AdvancedMD', 'Aesthetics Pro', 'Athena', 'Boulevard', 'DrChrono', 'eClinicalWorks', 'Envision', 'Epic', 'GlossGenius', 'Healthie', 'Mangomint', 'Mindbody', 'ModMed', 'Moxie', 'Nextech', 'Nomad', 'Pabau', 'PatientNow', 'SimplePractice', 'Symplast', 'Tebra', 'Vagaro'],
};

/* ------------------------------------------------------------------
   Profile Configuration questions (the "See Questions" box in the Figma).
   `state`: v1 | later | cut. Every effect names where the answer can be written today.
   ------------------------------------------------------------------ */
const QUESTIONS = [
  {
    id: 'comms',
    pageTitle: 'Set your communication preferences',
    pageSub: 'Choose what Qualiphy sends and does for your patients. Anything you turn off becomes your clinic\'s responsibility.',
    mode: 'toggles',
    state: 'v1',
    short: 'Patient communications',
    title: 'Patient communication',
    help: 'Everything starts on. Turn off anything your clinic will handle itself.',
    sections: [
      { id: 'messages', title: 'Patient message communication', sub: 'Messages Qualiphy sends to your patients by email and text.' },
      { id: 'live', title: 'Patient live communication', sub: 'What our providers and care team do around a visit.' },
    ],
    why: '',
    covers: [],
    by: [],
    evidence: '',
    answers: [{ id: 'custom', label: 'Custom', rec: true, effects: [] }],
    followups: [
      { id: 'invite', type: 'toggle', section: 'messages', default: true, showIf: ['custom'],
        label: 'Qualiphy sends the exam invite',
        desc: 'Patients get their exam link by email and text as soon as you send it.',
        offDesc: 'We do not email or text the exam link. Your clinic sends each patient their link, for example from your own system through our API.',
        offTerms: 'Your clinic will deliver every exam link to the patient itself, using the Qualiphy API documentation to retrieve the links. Exams that are delayed or never started because a patient did not receive the link are your clinic\'s responsibility.',
        note: '',
        effects: { on: [{ label: 'Exam invite email + SMS', value: 'on', where: 'portal', inv: 'Approved-exam notification', via: 'POST /update_clinic_notification' }],
                   off: [{ label: 'Exam invite email + SMS', value: 'off, clinic delivers links', where: 'nowhere', inv: null, via: 'no invite-only switch today' }] } },
      { id: 'reminders', type: 'toggle', section: 'messages', default: true, showIf: ['custom'],
        label: 'Qualiphy sends reminders for unfinished exams',
        desc: 'A reminder goes out if a patient has not finished their exam.',
        offDesc: 'We do not chase patients who have not finished. Your clinic reminds them and resends the exam link if needed.',
        offTerms: 'Your clinic will remind patients who have not finished their exam.',
        note: '',
        effects: { on: [{ label: 'Exam reminder notifications', value: 'on', where: 'superadmin', inv: null, via: 'exam-level sms_notification / email_notification' }],
                   off: [{ label: 'Exam reminder notifications', value: 'off on every exam', where: 'superadmin', inv: null, via: 'exam-level sms_notification / email_notification' }] } },
      { id: 'carelinks', type: 'toggle', section: 'messages', default: true, showIf: ['custom'],
        label: 'Qualiphy sends follow-up care links',
        desc: 'Aftercare instructions and care links after the visit.',
        offDesc: 'We do not send aftercare instructions or care links. Your clinic gives every patient their aftercare information after the visit.',
        offTerms: 'Your clinic will give every patient their aftercare instructions and follow-up care information after the visit, using the Qualiphy API documentation to retrieve the care links.',
        note: '',
        effects: { on: [{ label: 'Follow-up care links', value: 'on', where: 'superadmin', inv: null, via: 'follow-up templates' }],
                   off: [{ label: 'Follow-up care links', value: 'off', where: 'superadmin', inv: null, via: 'follow-up templates' }] } },
      { id: 'deferral', type: 'toggle', section: 'live', yesNo: true, default: false, showIf: ['custom'],
        label: 'Notify patients of a deferral during the video visit',
        offDesc: 'The provider does not tell the patient on the call. Your clinic delivers the deferral decision and the next steps.',
        pros: 'The patient hears the decision and the reason directly from the provider.',
        cons: 'The patient may hear it before your staff has a chance to reach out.',
        note: '',
        effects: { on: [{ label: 'Deferred-exam notification', value: 'on', where: 'portal', inv: 'Deferred-exam notification', via: 'POST /update_clinic_notification' }],
                   off: [{ label: 'Deferred-exam notification', value: 'off', where: 'portal', inv: 'Deferred-exam notification', via: 'POST /update_clinic_notification' }] } },
      { id: 'outreach', type: 'toggle', section: 'live', yesNo: true, default: true, showIf: ['custom'],
        label: 'Call patients who have not completed their exam yet',
        offDesc: 'Our care team does not call. Your clinic follows up with patients who have not completed their exam.',
        pros: 'More patients finish their exam, with no extra work for your staff.',
        cons: 'Patients get a call from our care team rather than from your clinic.',
        note: '',
        effects: { on: [{ label: 'Providers contact patients for pending consults', value: 'on', where: 'portal', inv: 'Qualiphy providers contact patients', via: 'POST /update_clinic_notification' }],
                   off: [{ label: 'Providers contact patients for pending consults', value: 'off', where: 'portal', inv: 'Qualiphy providers contact patients', via: 'POST /update_clinic_notification' }] } },
      { id: 'followup', type: 'toggle', section: 'live', yesNo: true, rxOnly: true, default: true, showIf: ['custom'],
        label: 'Send a follow-up email after a prescription visit',
        offDesc: 'We do not email patients after a prescription visit. Your clinic handles dosing questions and follow-up itself.',
        pros: 'Patients get dosing reminders and know who to contact with questions.',
        cons: 'Some clinics prefer to send their own branded follow-up.',
        offTerms: 'Your clinic will follow up with every patient after a prescription visit, including dosing questions and side effects.',
        note: '',
        effects: { on: [{ label: 'Follow-up emails after RxPad visits', value: 'on', where: 'superadmin', inv: null, via: 'follow-up templates' }],
                   off: [{ label: 'Follow-up emails after RxPad visits', value: 'off', where: 'superadmin', inv: null, via: 'follow-up templates' }] } },
    ],
  },

  {
    id: 'team',
    pageTitle: 'Tell us who does what',
    pageSub: 'For each topic, choose who we should contact. Add a person once and reuse them anywhere. You can change this any time in Settings.',
    mode: 'team',
    state: 'v1',
    short: 'Your team',
    title: 'Your team',
    help: 'Named contacts for exam updates, patient questions, prescription questions, billing and technical setup.',
    why: '',
    covers: [],
    by: [],
    reqs: [],
    evidence: '',
    answers: [{ id: 'team', label: 'Team contacts', rec: true, effects: [] }],
    roles: [
      { id: 'updates', label: 'Exam updates',
        desc: 'Who would you like notified when an exam is updated? Choose which updates each person gets.',
        statuses: [
          { id: 'approved', label: 'Approved', desc: 'The provider cleared the patient for treatment.' },
          { id: 'deferred', label: 'Deferred', desc: 'The provider did not clear the patient, so treatment should not go ahead.' },
          { id: 'na', label: 'Not applicable', desc: 'The exam did not apply to this patient and may need to be re-sent.' },
        ],
        note: '',
        effects: [{ label: 'Notification contacts (approved / deferred / N/A)', where: 'portal', inv: 'Approved-exam notification', via: 'POST /update_clinic_notification' }] },
      { id: 'patient', label: 'Patient questions', rxOnly: true, required: true,
        desc: 'Who should patients reach out to for medical and fulfilment questions? We email this to the patient after prescription consultations only.',
        tip: 'Must be reachable by phone. Medical directors often prefer not to take these calls.',
        note: '',
        effects: [{ label: 'Patient Care Provider', where: 'portal', inv: 'Patient Care Provider (per location)', via: 'POST /patient_care_provider_edit' }] },
      { id: 'rx', label: 'Prescription questions', rxOnly: true, required: true,
        desc: 'Who should we reach out to at your clinic for dose clarifications, fulfilment changes and other questions about a patient\'s treatment?',
        note: '',
        effects: [{ label: 'Rx clarification contact', where: 'nowhere', inv: null, via: 'clarification contacts are configured in the secure messaging work' }] },
      { id: 'billing', label: 'Billing', required: true,
        desc: 'Who handles invoices, receipts and payment issues?',
        note: '',
        effects: [{ label: 'Billing contact', where: 'nowhere', inv: null, via: 'no billing contact field today' }] },
      { id: 'tech', label: 'Technical',
        desc: 'Who handles integrations, API keys and website setup? We email them exactly what they need.',
        note: '',
        effects: [{ label: 'Technical contact / delegate invite', where: 'nowhere', inv: null, via: 'no delegate model today' }] },
    ],
    followups: [],
  },

  {
    id: 'pcp',
    pageTitle: 'Name your patient care provider',
    pageSub: 'The clinician named on prescriptions and results, and who takes patient follow-up calls.',
    tip: 'This person takes patient follow-up calls. Medical directors often prefer not to, so name whoever will actually answer.',
    state: 'cut',
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
    state: 'cut',
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
    pageSub: 'Choose every way your clinic will send exam invites and manage patients. Most clinics use more than one.',
    multi: true,
    state: 'v1',
    short: 'How you will work with Qualiphy',
    title: 'How will you send exam invites and manage patients? Select all that apply.',
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
      { id: 'api', label: 'Our developers will connect with the Qualiphy API',
        desc: 'For a custom app, or a website built on Shopify, Squarespace, Wix or another builder. We send your developer the API documentation.',
        effects: [{ label: 'Account API key issued', value: 'after setup completes', where: 'portal', inv: 'API key (per location)', via: 'Settings > API access' }] },
    ],
    followups: [
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
