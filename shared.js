// ============================================================
//  Quinta da Aldeia — Shared API layer
//  All pages use api(action, sheet, data) to read/write data
//  Falls back to demo data if Apps Script URL not configured
// ============================================================

// ---- DEMO DATA (shown when not yet connected to Google Sheets) ----
var _demo = {
  bookings: [
    { id:'d1', name:'Emma & Thomas', type:'Wedding', date:'2026-05-17', guests:120, contact:'emma@email.com', status:'confirmed', notes:'Garden ceremony' },
    { id:'d2', name:'Johnson Family', type:'Airbnb',  date:'2026-05-24', guests:6,   contact:'+351912000001', status:'confirmed', notes:'Long weekend' },
    { id:'d3', name:'Lisa & Mark',   type:'Wedding', date:'2026-06-14', guests:80,  contact:'lisa@email.com', status:'tentative', notes:'Awaiting deposit' },
    { id:'d4', name:'Chen Family',   type:'Airbnb',  date:'2026-06-28', guests:4,   contact:'chen@email.com', status:'confirmed', notes:'' },
  ],
  payments: [
    { id:'p1', booking_id:'d1', name:'Emma & Thomas', type:'Wedding', event_date:'2026-05-17', total:7500, email:'emma@email.com', mode:'standard', dep_status:'paid', dep_due:'2026-02-01', fin_status:'pending', fin_due:'2026-05-01' },
    { id:'p2', booking_id:'d2', name:'Johnson Family', type:'Airbnb', event_date:'2026-05-24', total:900, email:'', mode:'standard', dep_status:'paid', dep_due:'2026-04-01', fin_status:'paid', fin_due:'2026-05-10' },
    { id:'p3', booking_id:'d3', name:'Lisa & Mark', type:'Wedding', event_date:'2026-06-14', total:6200, email:'lisa@email.com', mode:'instalment', dep_status:'na', dep_due:'', fin_status:'na', fin_due:'' },
    { id:'p4', booking_id:'d4', name:'Chen Family', type:'Airbnb', event_date:'2026-06-28', total:750, email:'', mode:'standard', dep_status:'pending', dep_due:'2026-05-28', fin_status:'na', fin_due:'' },
  ],
  instalments: [
    { id:'i1', booking_id:'p3', customer_name:'Lisa & Mark', email:'lisa@email.com', instalment_num:1, due_date:'2026-03-14', amount:1240, paid:'true' },
    { id:'i2', booking_id:'p3', customer_name:'Lisa & Mark', email:'lisa@email.com', instalment_num:2, due_date:'2026-04-14', amount:1240, paid:'true' },
    { id:'i3', booking_id:'p3', customer_name:'Lisa & Mark', email:'lisa@email.com', instalment_num:3, due_date:'2026-05-14', amount:1240, paid:'false' },
    { id:'i4', booking_id:'p3', customer_name:'Lisa & Mark', email:'lisa@email.com', instalment_num:4, due_date:'2026-06-01', amount:1240, paid:'false' },
    { id:'i5', booking_id:'p3', customer_name:'Lisa & Mark', email:'lisa@email.com', instalment_num:5, due_date:'2026-06-10', amount:1240, paid:'false' },
  ],
  finance: [
    { id:'f1', type:'income',  cat:'Wedding fee',              desc:'Emma & Thomas',         amount:7500, date:'2026-05-17', notes:'' },
    { id:'f2', type:'income',  cat:'Airbnb fee',               desc:'Johnson Family',         amount:900,  date:'2026-05-24', notes:'' },
    { id:'f3', type:'expense', cat:'Cleaning & housekeeping',  desc:'Post-event clean',       amount:350,  date:'2026-05-18', notes:'' },
    { id:'f4', type:'expense', cat:'Utilities',                desc:'Electricity — Maio',     amount:280,  date:'2026-05-05', notes:'' },
    { id:'f5', type:'expense', cat:'Property maintenance',     desc:'Garden maintenance',     amount:420,  date:'2026-05-10', notes:'' },
    { id:'f6', type:'income',  cat:'Wedding fee',              desc:'Lisa & Mark — deposit',  amount:1860, date:'2026-04-14', notes:'30% deposit' },
  ],
  messageHistory: [],
  checklistResponses: [],
  templates: [
    { id:'t1', channel:'whatsapp', label:'WhatsApp — padrão', subject:'', body:'Olá [name]! 👋\n\nObrigado por entrar em contacto com a Quinta da Aldeia.\n\nPara preparar uma proposta personalizada, pedimos que preencham:\n👉 [form_link]\n\nCom os melhores cumprimentos,\nEquipa Quinta da Aldeia', updated_at:'' },
    { id:'t2', channel:'email',    label:'Email — padrão',    subject:'Quinta da Aldeia — o local perfeito para o vosso [type]', body:'Caro(a) [name],\n\nObrigado pelo vosso interesse na Quinta da Aldeia.\n\nPara preparar uma proposta personalizada:\n[form_link]\n\nCom os melhores cumprimentos,\nEquipa Quinta da Aldeia', updated_at:'' },
  ],
};

var _nextIds = { bookings:5, payments:5, instalments:6, finance:7, templates:3, checklistResponses:1 };

function _demoApi(action, sheet, data) {
  var store = _demo[sheet];
  if (!store) return { rows: [], _demo: true };

  if (action === 'getAll')  return { rows: store, _demo: true };

  if (action === 'add') {
    var prefix = sheet[0];
    var newId  = prefix + (_nextIds[sheet] || Date.now());
    _nextIds[sheet] = (_nextIds[sheet] || 1) + 1;
    var row = Object.assign({}, data, { id: data.id || newId });
    store.push(row);
    return { success: true, row: row, _demo: true };
  }

  if (action === 'update') {
    var found = false;
    _demo[sheet] = store.map(function(r) {
      if (String(r.id) === String(data.id)) { found = true; return Object.assign({}, r, data); }
      return r;
    });
    return found ? { success: true, _demo: true } : { error: 'Not found', _demo: true };
  }

  if (action === 'delete') {
    var before = store.length;
    _demo[sheet] = store.filter(function(r) { return String(r.id) !== String(data.id); });
    return _demo[sheet].length < before ? { success: true, _demo: true } : { error: 'Not found', _demo: true };
  }

  return { error: 'Unknown action', _demo: true };
}

// ---- MAIN API FUNCTION ----
// Usage: await api('getAll', 'bookings')
//        await api('add', 'finance', { type:'expense', ... })
//        await api('update', 'payments', { id:'p1', fin_status:'paid', ... })
//        await api('delete', 'instalments', { id:'i3' })

async function api(action, sheet, data) {
  data = data || {};

  if (!window.SCRIPT_URL || window.SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    return _demoApi(action, sheet, data);
  }

  try {
    const params = new URLSearchParams(Object.assign({ action, sheet }, data));
    const res    = await fetch(window.SCRIPT_URL + '?' + params);
    const json   = await res.json();
    return json;
  } catch(e) {
    console.warn('API error, using demo data:', e);
    return _demoApi(action, sheet, data);
  }
}

// ---- HELPERS ----
function isDemo() {
  return !window.SCRIPT_URL || window.SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE';
}

function genId(prefix) {
  return (prefix || 'r') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
}

// Use this when adding a new confirmed booking — triggers confirmation email
async function addBooking(bookingData) {
  if (!bookingData.id) bookingData.id = genId('b');
  const action = (bookingData.status === 'confirmed') ? 'addBooking' : 'add';
  return await api(action, 'bookings', bookingData);
}
