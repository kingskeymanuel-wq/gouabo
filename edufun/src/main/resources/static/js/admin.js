/* EduFun — console d'administration (CRM) :
   vue d'ensemble, paiements, élèves, parents, répétiteurs, activations, engagement,
   notifications, contenus, corrections et paramètres. */
(function () {
  'use strict';

  // ---------------------------------------------------------------- Outils
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const F = n => Number(n || 0).toLocaleString('fr-FR');
  const money = n => F(n) + ' F';
  const toDate = d => { if (!d) return null; const x = new Date(String(d).length === 10 ? d + 'T00:00:00' : d); return isNaN(x) ? null : x; };
  const dFr = (d, opt) => { const x = toDate(d); return x ? x.toLocaleDateString('fr-FR', opt || { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; };
  const dtFr = d => { const x = toDate(d); return x ? x.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ' · ' + x.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'; };
  const today0 = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const daysUntil = d => { const x = toDate(d); if (!x) return null; x.setHours(0, 0, 0, 0); return Math.round((x - today0()) / 864e5); };
  const plural = (n, s, p) => `${F(n)} ${Math.abs(n) > 1 ? (p || s + 's') : s}`;
  const ago = d => {
    const x = toDate(d); if (!x) return '';
    const m = Math.round((Date.now() - x) / 6e4);
    if (m < 1) return 'à l\'instant'; if (m < 60) return `il y a ${m} min`;
    const h = Math.round(m / 60); if (h < 24) return `il y a ${h} h`;
    const j = Math.round(h / 24); if (j < 30) return `il y a ${plural(j, 'jour')}`;
    return dFr(d);
  };
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const ic = (n, cls) => `<svg class="i${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const tel = p => p ? `<a class="ad-link" href="tel:${esc(String(p).replace(/[^\d+]/g, ''))}">${ic('phone')}${esc(p)}</a>` : '<span class="ad-mute">—</span>';
  const mail = m => m ? `<a class="ad-link" href="mailto:${esc(m)}">${ic('mail')}${esc(m)}</a>` : '<span class="ad-mute">—</span>';
  const avatar = name => `<span class="ad-avatar">${esc(initials(name || '?'))}</span>`;
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const MONTHS_L = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const monthLabel = (ym, long) => { const [y, m] = String(ym).split('-').map(Number); return m ? (long ? `${MONTHS_L[m - 1]} ${y}` : MONTHS[m - 1]) : esc(ym); };
  const compact = v => v >= 1e6 ? (v / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' M' : v >= 1e3 ? (v / 1e3).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' k' : F(v);
  const niceTop = max => { if (!max) return 0; const p = Math.pow(10, Math.floor(Math.log10(max))), n = max / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
  const pct = v => { let c = Number(v || 0); if (c > 0 && c < 1 && !Number.isInteger(c)) c *= 100; return c.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' %'; };
  const list = v => Array.isArray(v) ? v : v ? String(v).split(/[,;|]/).map(s => s.trim()).filter(Boolean) : [];

  // ---------------------------------------------------------------- Libellés
  const ST = { ACTIVE: ['Abonné', 'ok'], PENDING: ['En vérification', 'wait'], TRIAL: ['Essai', 'trial'], NEW: ['Non activé', 'new'], EXPIRED: ['Expiré', 'off'] };
  const LISTING = { LISTED: ['Visible', 'ok'], FREE: ['Visible (accès libre)', 'ok'], UNPAID: ['Non payé', 'new'], EXPIRED: ['Expiré', 'off'], REJECTED: ['Refusé', 'off'], SUSPENDED: ['Suspendu', 'warn'] };
  const PROFILE = { PENDING: 'Profil à valider', APPROVED: 'Profil validé', REJECTED: 'Profil refusé', SUSPENDED: 'Profil suspendu' };
  const PAY = { PENDING: ['À vérifier', 'wait'], VALIDATED: ['Validé', 'ok'], REJECTED: ['Refusé', 'off'] };
  const MAIL = { SENT: ['Envoyé', 'ok'], FAILED: ['Échec', 'off'], SKIPPED: ['Non configuré', 'new'], PENDING: ['En cours', 'wait'], NONE: ['—', 'none'] };
  const KIND = { STUDENT: 'Élève', TUTOR: 'Répétiteur' };
  const NKIND = { VISIT: 'Visite', MESSAGE: 'Message', PAYMENT: 'Paiement', ACCOUNT: 'Compte', REPORT: 'Bilan', PROGRESS: 'Progression' };
  const ACT_IC = { PAYMENT: 'card', SIGNUP: 'user', TUTOR: 'brief', PARENT: 'users' };
  const METHODS = { ESPECES: 'Espèces', ORANGE_MONEY: 'Orange Money', MTN_MOMO: 'MTN MoMo', MOOV_MONEY: 'Moov Money', WAVE: 'Wave' };
  const method = m => METHODS[m] || m || '—';
  const tag = (pair, extra) => { const [l, c] = pair; return `<span class="ad-tag ${c}"><i></i>${esc(l)}</span>${extra || ''}`; };
  const stTag = s => tag(ST[s] || [s || '—', 'none']);
  const kindTag = k => `<span class="ad-kind ${k === 'TUTOR' ? 'tu' : 'st'}">${esc(KIND[k] || k || '—')}</span>`;

  // ---------------------------------------------------------------- État et données
  const S = {
    data: {},
    f: { payKind: '', payStatus: '', payQ: '', stStatus: '', stCycle: '', stQ: '', paKind: '', paQ: '', tuStatus: '', tuPlace: '', tuQ: '', noKind: '', noMail: '', noQ: '' },
    cash: { kind: 'STUDENT', id: null, hi: -1 },
    view: 'apercu', drawer: null, lastFocus: null
  };
  const SOURCES = {
    ov: '/admin/crm/overview', students: '/admin/crm/students', parents: '/admin/crm/parents', tutors: '/admin/crm/tutors',
    payments: '/admin/crm/payments', activations: '/admin/crm/activations', engagement: '/admin/crm/engagement',
    notifs: '/admin/crm/notifications', exams: '/exams', catalog: '/catalog', dash: '/dashboard'
  };
  const inflight = {};
  function load(key, force) {
    if (!force && S.data[key] !== undefined) return Promise.resolve(S.data[key]);
    if (!force && inflight[key]) return inflight[key];
    return (inflight[key] = api(SOURCES[key]).then(d => { S.data[key] = d; return d; }).finally(() => { delete inflight[key]; }));
  }
  const drop = (...keys) => keys.forEach(k => { delete S.data[k]; });

  const VIEWS = {
    apercu: { t: 'Vue d\'ensemble', s: 'Recettes, abonnés et activité de la plateforme', need: ['ov'], render: renderOverview },
    paiements: { t: 'Paiements', s: 'Vérification, encaissement et historique', need: ['payments', 'students', 'tutors', 'ov'], render: renderPaymentsView },
    eleves: { t: 'Élèves', s: 'Abonnements, progression et contacts des familles', need: ['students'], render: renderStudents },
    parents: { t: 'Parents', s: 'Comptes parents et contacts renseignés par les élèves', need: ['parents'], render: renderParents },
    repetiteurs: { t: 'Répétiteurs', s: 'Profils, visibilité dans l\'annuaire et audience', need: ['tutors'], render: renderTutors },
    activations: { t: 'Activations', s: 'Échéances, relances et accès récemment ouverts', need: ['activations'], render: renderActivations },
    engagement: { t: 'Engagement', s: 'Consultations de fiches et messages sur 30 jours', need: ['engagement'], render: renderEngagement },
    notifications: { t: 'Notifications', s: 'Journal des notifications et des e-mails envoyés', need: ['notifs'], render: renderNotifs },
    contenus: { t: 'Contenus', s: 'Programme officiel et vidéos des leçons', need: ['catalog'], render: renderContent },
    corrections: { t: 'Corrections d\'examens', s: 'Copies en attente de note', need: ['exams'], render: renderExams },
    parametres: { t: 'Paramètres', s: 'Sécurité du compte et tarifs', need: ['ov'], render: renderSettings }
  };

  // ---------------------------------------------------------------- Démarrage
  async function init() {
    const me = await currentUser();
    if (!me || !me.authenticated || me.role !== 'ADMIN') { location.href = '/console'; return; }
    const name = me.fullName || me.name || 'Administrateur';
    q('[data-me-name]').textContent = name;
    q('[data-me-mail]').textContent = me.email || '';
    q('[data-me-av]').textContent = initials(name);
    q('[data-ad-date]').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    bindChrome(); bindFilters(); bindActions(); bindForms(); bindCash();
    window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (v !== S.view && VIEWS[v]) show(v); });
    show(VIEWS[location.hash.slice(1)] ? location.hash.slice(1) : 'apercu');
    refreshCounts();
  }

  function bindChrome() {
    q('[data-ad-tabs]').addEventListener('click', e => {
      const a = e.target.closest('[data-tab]'); if (!a) return;
      e.preventDefault(); show(a.dataset.tab);
    });
    q('[data-ad-refresh]').addEventListener('click', refreshAll);
    // Barre latérale : repliable sur grand écran, tiroir sur mobile.
    const side = q('#ad-side'), scrim = q('[data-side-scrim]'), menu = q('.mobile-menu');
    const setOpen = open => { side.classList.toggle('open', open); scrim.hidden = !open; menu.setAttribute('aria-expanded', open); };
    menu.onclick = () => setOpen(!side.classList.contains('open'));
    scrim.onclick = () => setOpen(false);
    S.closeSide = () => setOpen(false);
    try { if (localStorage.getItem('edufun.admin.collapsed') === '1') document.body.classList.add('ad-collapsed'); } catch (_) { /* stockage indisponible */ }
    q('[data-collapse]').onclick = () => {
      const c = document.body.classList.toggle('ad-collapsed');
      try { localStorage.setItem('edufun.admin.collapsed', c ? '1' : '0'); } catch (_) { /* rien */ }
    };
    // Tiroir
    q('[data-scrim]').onclick = closeDrawer;
    q('[data-drawer-close]').onclick = closeDrawer;
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.drawer && !q('[data-dialog]').open) closeDrawer(); });
    // Info-bulles des graphiques
    const tip = q('[data-tip]');
    document.addEventListener('mousemove', e => {
      const c = e.target.closest('[data-tipv]');
      if (!c) { tip.hidden = true; return; }
      tip.innerHTML = c.dataset.tipv; tip.hidden = false;
      const w = tip.offsetWidth, x = Math.min(e.clientX + 16, innerWidth - w - 8);
      tip.style.left = x + 'px'; tip.style.top = Math.max(8, e.clientY - tip.offsetHeight - 12) + 'px';
    });
  }

  async function show(view) {
    if (!VIEWS[view]) view = 'apercu';
    const conf = VIEWS[view], el = q(`[data-view="${view}"]`);
    S.view = view;
    qa('.ad-view').forEach(v => { v.hidden = v !== el; });
    qa('[data-tab]').forEach(a => { const on = a.dataset.tab === view; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    q('[data-ad-title]').textContent = conf.t;
    q('[data-ad-sub]').textContent = conf.s;
    document.title = conf.t + ' — Console EduFun';
    if (location.hash.slice(1) !== view) history.replaceState(null, '', '#' + view);
    S.closeSide && S.closeSide();
    const missing = conf.need.some(k => S.data[k] === undefined);
    if (missing) skeletons(el);
    try {
      await Promise.all(conf.need.map(k => load(k)));
      if (S.view === view) conf.render();
    } catch (e) {
      if (S.view !== view) return;
      qa('[data-fill]', el).forEach(c => { c.innerHTML = errorState(c); });
      toast(apiErrorMessage(e, 'Impossible de charger cette section'));
    }
  }

  function skeletons(root) {
    qa('[data-fill]', root).forEach(c => {
      const t = c.dataset.fill;
      if (t === 'rows') {
        const cols = c.closest('table').querySelectorAll('thead th').length;
        c.innerHTML = Array.from({ length: 6 }, () => `<tr class="ad-skel-row">${Array.from({ length: cols }, (_, i) => `<td><span class="ad-skel" style="width:${i ? 40 + (i * 23) % 45 : 70}%"></span></td>`).join('')}</tr>`).join('');
      } else if (t === 'kpis') c.innerHTML = Array.from({ length: 4 }, () => '<div class="ad-kpi ad-kpi-skel"><span class="ad-skel" style="width:50%"></span><span class="ad-skel lg" style="width:70%"></span><span class="ad-skel" style="width:40%"></span></div>').join('');
      else if (t === 'chart') c.innerHTML = '<div class="ad-skel ad-skel-chart"></div>';
      else c.innerHTML = Array.from({ length: 4 }, () => '<div class="ad-skel-line"><span class="ad-skel round"></span><span class="ad-skel" style="width:60%"></span></div>').join('');
    });
  }
  function errorState(c) {
    const msg = `<div class="ad-empty">${ic('alert')}<b>Chargement impossible</b><span>Vérifiez la connexion puis réessayez.</span><button class="btn ghost" type="button" data-retry>Réessayer</button></div>`;
    if (c.dataset.fill === 'rows') return `<tr><td colspan="${c.closest('table').querySelectorAll('thead th').length}">${msg}</td></tr>`;
    return msg;
  }
  const empty = (title, text, icon) => `<div class="ad-empty">${ic(icon || 'check')}<b>${esc(title)}</b>${text ? `<span>${esc(text)}</span>` : ''}</div>`;
  const emptyRow = (tbody, title, text) => `<tr><td colspan="${tbody.closest('table').querySelectorAll('thead th').length}">${empty(title, text, 'search')}</td></tr>`;

  async function refreshAll() {
    const btn = q('[data-ad-refresh]'); btn.classList.add('spin');
    Object.keys(S.data).forEach(k => delete S.data[k]);
    await Promise.allSettled([show(S.view), refreshCounts()]);
    if (S.drawer) openDrawer(S.drawer.type, S.drawer.id, S.drawer.preset);
    setTimeout(() => btn.classList.remove('spin'), 400);
  }

  async function refreshCounts() {
    const set = (k, v, tone) => { const b = q(`[data-count="${k}"]`); if (!b) return; b.hidden = !v; b.textContent = v > 999 ? '999+' : v; b.className = 'ad-count' + (tone ? ' ' + tone : ''); };
    try {
      const ov = await load('ov');
      set('paiements', ov.pendingPayments || 0, 'alert');
      set('eleves', ov.students?.total || 0);
      set('parents', parentsCount(ov));
      const tp = ov.tutors?.pending || 0;
      set('repetiteurs', tp || ov.tutors?.total || 0, tp ? 'alert' : '');
      set('activations', ov.expiringSoon || 0, 'warn');
    } catch (_) { /* pastilles facultatives */ }
    try { const ex = await load('exams'); set('corrections', (ex || []).filter(x => x.status === 'PENDING_REVIEW').length, 'warn'); } catch (_) { /* rien */ }
    try { if (S.data.notifs) set('notifications', (S.data.notifs.items || []).filter(n => n.emailStatus === 'FAILED').length, 'alert'); } catch (_) { /* rien */ }
  }
  const parentsCount = ov => typeof ov.parents === 'object' && ov.parents ? (ov.parents.total || 0) : (ov.parents || 0);

  // ---------------------------------------------------------------- Vue d'ensemble
  function mailAlert(configured) {
    return configured === false ? `<div class="ad-alert">${ic('alert')}<div><b>Les e-mails ne partent pas : définissez le serveur SMTP (variables SPRING_MAIL_HOST, SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD) puis redémarrez</b><span>Les notifications restent visibles dans la console et dans les espaces des utilisateurs.</span></div></div>` : '';
  }

  function kpi(label, value, sub, opt = {}) {
    return `<${opt.go ? `button type="button" data-go="${opt.go}"` : 'div'} class="ad-kpi${opt.tone ? ' ' + opt.tone : ''}">
      <small>${esc(label)}</small><b>${value}</b>${sub ? `<span>${sub}</span>` : ''}</${opt.go ? 'button' : 'div'}>`;
  }

  function renderOverview() {
    const ov = S.data.ov, r = ov.revenue || {}, st = ov.students || {}, tu = ov.tutors || {};
    q('[data-mail-alert]').innerHTML = mailAlert(ov.mailConfigured);
    q('[data-ov-kpis]').innerHTML = [
      kpi('Recettes du mois', money(r.month), 'Paiements validés ce mois-ci', { tone: 'brand' }),
      kpi('Recettes totales', money(r.total), `Élèves ${money(r.students)} · Répétiteurs ${money(r.tutors)}`),
      kpi('MRR estimé', money(r.mrr), 'Revenu mensuel récurrent'),
      kpi('Élèves abonnés', F(st.active), `sur ${F(st.total)} élèves · ${F(st.new30)} nouveaux en 30 j`, { go: 'eleves' }),
      kpi('Conversion', pct(st.conversion), 'Inscrits devenus abonnés'),
      kpi('Répétiteurs visibles', F(tu.listed), `${plural(tu.pending || 0, 'profil')} à valider · ${F(tu.unpaid)} non payés`, { go: 'repetiteurs' }),
      kpi('Parents', F(parentsCount(ov)), 'Comptes et contacts', { go: 'parents' }),
      kpi('Paiements à vérifier', F(ov.pendingPayments), ov.pendingPayments ? 'Action requise' : 'Tout est à jour', { go: 'paiements', tone: ov.pendingPayments ? 'alert' : '' }),
      kpi('Échéances ≤ 7 jours', F(ov.expiringSoon), ov.expiringSoon ? 'À relancer' : 'Aucune échéance proche', { go: 'activations', tone: ov.expiringSoon ? 'warn' : '' })
    ].join('');
    renderRevenueChart(ov.byMonth || []);
    renderSignupChart(ov.byMonth || []);
    renderActivity(ov.activity || []);
    renderPipeline(st);
  }

  function axis(top) {
    return `<div class="ad-axis">${[1, .5, 0].map(f => `<div><span>${top ? compact(top * f) : (f ? '' : '0')}</span></div>`).join('')}</div>`;
  }

  function renderRevenueChart(rows) {
    const box = q('[data-rev-chart]');
    const data = rows.map(r => ({ m: r.month, a: Number(r.students || 0), b: Number(r.tutors || 0) }));
    const max = Math.max(0, ...data.map(d => d.a + d.b)), top = niceTop(max);
    const sa = data.reduce((n, d) => n + d.a, 0), sb = data.reduce((n, d) => n + d.b, 0);
    q('[data-rev-legend]').innerHTML = `<span><i class="sw s1"></i>Élèves <b>${money(sa)}</b></span><span><i class="sw s2"></i>Répétiteurs <b>${money(sb)}</b></span>`;
    if (!data.length) { box.innerHTML = empty('Aucune donnée', 'Les recettes apparaîtront ici dès le premier paiement validé.', 'card'); return; }
    box.innerHTML = axis(top) + `<div class="ad-cols" style="--n:${data.length}">${data.map((d, i) => {
      const tot = d.a + d.b, last = i === data.length - 1;
      const tipv = esc(`<b>${monthLabel(d.m, true)}</b><span><i class="sw s1"></i>Élèves<em>${money(d.a)}</em></span><span><i class="sw s2"></i>Répétiteurs<em>${money(d.b)}</em></span><span class="tot">Total<em>${money(tot)}</em></span>`);
      return `<div class="ad-col" data-tipv="${tipv}" tabindex="0" aria-label="${esc(monthLabel(d.m, true))} : élèves ${money(d.a)}, répétiteurs ${money(d.b)}, total ${money(tot)}">
        <div class="ad-plot">${last && tot ? `<em class="ad-val" style="bottom:${(tot / top * 100).toFixed(2)}%">${compact(tot)}</em>` : ''}
          <div class="ad-stack" style="height:${top ? (tot / top * 100).toFixed(2) : 0}%">${d.a ? `<i class="s1" style="flex:${d.a} 1 0"></i>` : ''}${d.b ? `<i class="s2" style="flex:${d.b} 1 0"></i>` : ''}</div></div>
        <small>${monthLabel(d.m)}</small></div>`;
    }).join('')}</div>${max ? '' : '<p class="ad-chart-empty">Les recettes apparaîtront ici dès le premier paiement validé.</p>'}`;
  }

  function renderSignupChart(rows) {
    const box = q('[data-signup-chart]');
    const data = rows.map(r => ({ m: r.month, v: Number(r.signups || 0) }));
    const max = Math.max(0, ...data.map(d => d.v)), top = niceTop(max) || 0;
    q('[data-signup-total]').textContent = plural(data.reduce((n, d) => n + d.v, 0), 'inscription') + ' sur 6 mois';
    if (!data.length) { box.innerHTML = empty('Aucune donnée', '', 'user'); return; }
    box.innerHTML = axis(top) + `<div class="ad-cols" style="--n:${data.length}">${data.map((d, i) => {
      const last = i === data.length - 1;
      return `<div class="ad-col" data-tipv="${esc(`<b>${monthLabel(d.m, true)}</b><span>Inscriptions<em>${F(d.v)}</em></span>`)}" tabindex="0" aria-label="${esc(monthLabel(d.m, true))} : ${plural(d.v, 'inscription')}">
        <div class="ad-plot">${last && d.v ? `<em class="ad-val" style="bottom:${(d.v / top * 100).toFixed(2)}%">${F(d.v)}</em>` : ''}
          <div class="ad-stack thin${last ? ' now' : ''}" style="height:${top ? (d.v / top * 100).toFixed(2) : 0}%">${d.v ? '<i></i>' : ''}</div></div>
        <small>${monthLabel(d.m)}</small></div>`;
    }).join('')}</div>`;
  }

  function renderActivity(items) {
    const box = q('[data-activity]');
    if (!items.length) { box.innerHTML = empty('Pas encore d\'activité', 'Les paiements et inscriptions apparaîtront ici.', 'pulse'); return; }
    box.innerHTML = `<ol class="ad-feed">${items.slice(0, 12).map(a => `<li>
      <span class="ad-feed-i t-${esc(String(a.type || '').toLowerCase())}">${ic(ACT_IC[a.type] || 'pulse')}</span>
      <div><p>${esc(a.text)}</p><small>${esc(ago(a.at))}${a.tag ? ` · <span class="ad-chip">${esc(a.tag)}</span>` : ''}</small></div></li>`).join('')}</ol>`;
  }

  function renderPipeline(st) {
    const parts = ['ACTIVE', 'PENDING', 'TRIAL', 'NEW', 'EXPIRED'].map(k => ({ k, v: Number(st[k.toLowerCase()] || 0) }));
    const tot = parts.reduce((n, p) => n + p.v, 0);
    q('[data-pipeline]').innerHTML = tot ? `<div class="ad-pipe">${parts.filter(p => p.v).map(p => `<i class="p-${p.k.toLowerCase()}" style="flex:${p.v} 1 0" data-tipv="${esc(`<b>${ST[p.k][0]}</b><span>Élèves<em>${F(p.v)}</em></span><span>Part<em>${Math.round(p.v / tot * 100)} %</em></span>`)}"></i>`).join('')}</div>
      <ul class="ad-pipe-l">${parts.map(p => `<li><button type="button" data-go="eleves" data-st="${p.k}">${stTag(p.k)}<b>${F(p.v)}</b><small>${tot ? Math.round(p.v / tot * 100) : 0} %</small></button></li>`).join('')}</ul>`
      : empty('Aucun élève inscrit', '', 'user');
  }

  // ---------------------------------------------------------------- Paiements
  function renderPaymentsView() { renderQueue(); renderHistory(); renderCashSum(); }

  function renderQueue() {
    const pend = (S.data.payments || []).filter(p => p.status === 'PENDING');
    q('[data-queue-total]').textContent = pend.length ? `${plural(pend.length, 'paiement')} · ${money(pend.reduce((n, p) => n + Number(p.amount || 0), 0))}` : '';
    q('[data-pay-queue]').innerHTML = pend.length ? `<div class="ad-queue">${pend.map(p => `<div class="ad-q">
      <div class="ad-q-who">${kindTag(p.kind)}<button type="button" class="ad-name" data-open="${p.kind === 'TUTOR' ? 'tutor' : 'student'}" data-id="${esc(p.payerId)}">${esc(p.payer)}</button><small>${esc(p.detail || '')}</small></div>
      <div class="ad-q-amt"><b class="num">${money(p.amount)}</b><small>${esc(method(p.method))}</small></div>
      <div class="ad-q-ref"><code>${esc(p.reference || 'sans référence')}</code><small>${p.phone ? 'depuis le ' + esc(p.phone) + ' · ' : ''}${esc(dtFr(p.createdAt))}</small></div>
      <div class="ad-q-act"><button class="btn success" type="button" data-validate="${esc(p.id)}">Valider</button><button class="btn danger" type="button" data-reject="${esc(p.id)}">Refuser</button></div>
    </div>`).join('')}</div>` : empty('Aucun paiement en attente', 'Tout est vérifié.');
  }

  function filteredPayments() {
    const f = S.f, qq = norm(f.payQ);
    return (S.data.payments || []).filter(p => (!f.payKind || p.kind === f.payKind) && (!f.payStatus || p.status === f.payStatus)
      && (!qq || norm(`${p.payer} ${p.detail} ${p.reference} ${p.phone} ${method(p.method)} ${p.processedBy}`).includes(qq)));
  }

  function renderHistory() {
    const rows = filteredPayments(), tb = q('[data-pay-rows]');
    const sum = st => rows.filter(p => p.status === st).reduce((n, p) => n + Number(p.amount || 0), 0);
    q('[data-pay-totals]').innerHTML = `${plural(rows.length, 'paiement')} · validés <b class="num">${money(sum('VALIDATED'))}</b> · à vérifier <b class="num">${money(sum('PENDING'))}</b> · refusés <b class="num">${money(sum('REJECTED'))}</b>`;
    tb.innerHTML = rows.length ? rows.map(p => `<tr>
      <td class="nowrap">${esc(dFr(p.createdAt))}</td><td>${kindTag(p.kind)}</td>
      <td><button type="button" class="ad-name" data-open="${p.kind === 'TUTOR' ? 'tutor' : 'student'}" data-id="${esc(p.payerId)}">${esc(p.payer)}</button>${p.phone ? `<small class="ad-note">${esc(p.phone)}</small>` : ''}</td>
      <td>${esc(p.detail || '—')}</td><td class="num"><b>${money(p.amount)}</b></td><td>${esc(method(p.method))}</td>
      <td>${p.reference ? `<code>${esc(p.reference)}</code>` : '<span class="ad-mute">—</span>'}</td>
      <td>${tag(PAY[p.status] || [p.status, 'none'])}${p.status === 'REJECTED' && p.note ? `<small class="ad-note">${esc(p.note)}</small>` : ''}</td>
      <td>${p.processedAt ? `${esc(dFr(p.processedAt))}<small class="ad-note">${esc(p.processedBy || '')}</small>` : '<span class="ad-mute">—</span>'}</td></tr>`).join('')
      : emptyRow(tb, 'Aucun paiement', 'Aucun paiement ne correspond à ces filtres.');
  }

  function exportCsv() {
    const rows = filteredPayments();
    if (!rows.length) { toast('Rien à exporter avec ces filtres.'); return; }
    const cell = v => {
      let s = String(v ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = '\'' + s; // neutralise les formules dans un tableur
      return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const head = ['Date', 'Type', 'Client', 'Détail', 'Montant (F CFA)', 'Moyen', 'Téléphone', 'Référence', 'Statut', 'Traité le', 'Traité par', 'Fin de période', 'Note'];
    const lines = rows.map(p => [p.createdAt ? String(p.createdAt).slice(0, 16).replace('T', ' ') : '', KIND[p.kind] || p.kind, p.payer, p.detail, Number(p.amount || 0), method(p.method), p.phone,
      p.reference, (PAY[p.status] || [p.status])[0], p.processedAt ? String(p.processedAt).slice(0, 16).replace('T', ' ') : '', p.processedBy, p.periodEnd || '', p.note].map(cell).join(';'));
    const blob = new Blob(['﻿' + [head.join(';'), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `edufun-paiements-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`${plural(rows.length, 'ligne')} exportée${rows.length > 1 ? 's' : ''}`);
  }

  // Encaissement direct --------------------------------------------------
  function cashPool() { return (S.cash.kind === 'TUTOR' ? S.data.tutors : S.data.students) || []; }
  function cashSelected() { return cashPool().find(c => String(c.id) === String(S.cash.id)); }

  function bindCash() {
    const form = q('[data-cash]'), input = q('[data-cash-q]'), ul = q('[data-cash-list]');
    q('[data-cash-kind]').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) setCashKind(b.dataset.k); });
    const close = () => { ul.hidden = true; input.setAttribute('aria-expanded', 'false'); };
    const open = () => {
      const qq = norm(input.value);
      const res = cashPool().filter(c => !qq || norm(`${c.name} ${c.email} ${c.phone} ${c.level || ''} ${c.city || ''} ${c.district || ''} ${c.parentName || ''}`).includes(qq)).slice(0, 8);
      S.cash.hi = res.length ? 0 : -1;
      ul.innerHTML = res.length ? res.map((c, i) => `<li role="option" id="ad-opt-${i}" data-id="${esc(c.id)}" aria-selected="${i === 0}">${avatar(c.name)}<span><b>${esc(c.name)}</b><small>${esc(S.cash.kind === 'TUTOR' ? [c.district, c.city].filter(Boolean).join(', ') : [c.level, (ST[c.status] || [''])[0]].filter(Boolean).join(' · '))}${c.phone ? ' · ' + esc(c.phone) : ''}</small></span></li>`).join('')
        : '<li class="ad-combo-none">Aucun résultat</li>';
      ul.hidden = false; input.setAttribute('aria-expanded', 'true');
    };
    const pick = id => { S.cash.id = id; const c = cashSelected(); input.value = c ? c.name : ''; close(); renderCashSum(); };
    input.addEventListener('input', () => { S.cash.id = null; renderCashSum(); open(); });
    input.addEventListener('focus', open);
    input.addEventListener('blur', () => setTimeout(close, 150));
    input.addEventListener('keydown', e => {
      const opts = qa('[role=option]', ul); if (ul.hidden || !opts.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); S.cash.hi = (S.cash.hi + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((o, i) => o.setAttribute('aria-selected', i === S.cash.hi));
        input.setAttribute('aria-activedescendant', opts[S.cash.hi].id);
      } else if (e.key === 'Enter' && S.cash.hi >= 0) { e.preventDefault(); pick(opts[S.cash.hi].dataset.id); } else if (e.key === 'Escape') close();
    });
    ul.addEventListener('mousedown', e => { const li = e.target.closest('[data-id]'); if (li) { e.preventDefault(); pick(li.dataset.id); } });
    form.months.addEventListener('change', renderCashSum);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const c = cashSelected();
      if (!c) { toast('Choisissez un client dans la liste.'); input.focus(); return; }
      const tutor = S.cash.kind === 'TUTOR';
      const ok = await ask({ title: 'Confirmer l\'encaissement', text: `${c.name} · ${cashAmountLabel()} · ${method(form.method.value)}. L'accès est activé immédiatement.`, ok: 'Encaisser' });
      if (!ok) return;
      const body = { method: form.method.value, reference: form.reference.value.trim() };
      if (tutor) body.tutorId = Number(c.id); else { body.studentId = Number(c.id); body.months = Number(form.months.value); }
      try {
        await api('/admin/payments', { method: 'POST', body: JSON.stringify(body) });
        toast(tutor ? 'Paiement enregistré : le répétiteur est visible.' : 'Paiement enregistré : accès prolongé.');
        form.reference.value = ''; input.value = ''; S.cash.id = null;
        afterPaymentChange();
      } catch (x) { toast(apiErrorMessage(x, 'Encaissement impossible')); }
    });
  }

  function setCashKind(k) {
    S.cash.kind = k; S.cash.id = null;
    qa('[data-cash-kind] [data-k]').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
    q('[data-cash-months]').hidden = k === 'TUTOR';
    q('[data-cash-q]').value = '';
    q('[data-cash-q]').placeholder = k === 'TUTOR' ? 'Nom, e-mail, téléphone ou commune…' : 'Nom, e-mail, téléphone ou classe…';
    renderCashSum();
  }
  function tutorPrice() { return Number(S.data.ov?.tutorPrice || 5000); }
  function cashAmountLabel() {
    const c = cashSelected(); if (!c) return '';
    if (S.cash.kind === 'TUTOR') return `${money(tutorPrice())} pour 3 mois de visibilité`;
    const m = Number(q('[data-cash]').months.value);
    return c.monthlyPrice ? `${money(c.monthlyPrice * m)} environ pour ${plural(m, 'mois', 'mois')}` : plural(m, 'mois', 'mois');
  }
  function renderCashSum() {
    const c = cashSelected(), box = q('[data-cash-sum]'); if (!box) return;
    if (!c) { box.innerHTML = '<span class="ad-mute">Choisissez un client dans la liste.</span>'; return; }
    box.innerHTML = S.cash.kind === 'TUTOR'
      ? `${avatar(c.name)}<span><b>${esc(c.name)}</b><small>${tag(LISTING[c.listingStatus] || [c.listingStatus || '—', 'none'])} · ${esc(cashAmountLabel())}</small></span>`
      : `${avatar(c.name)}<span><b>${esc(c.name)}</b><small>${stTag(c.status)} · ${esc(c.level || '')} · ${esc(cashAmountLabel())}</small></span>`;
  }
  async function prefillCash(kind, id) {
    closeDrawer();
    await show('paiements');
    setCashKind(kind);
    S.cash.id = id;
    const c = cashSelected();
    q('[data-cash-q]').value = c ? c.name : '';
    renderCashSum();
    q('[data-cash]').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function afterPaymentChange() {
    drop('payments', 'ov', 'students', 'tutors', 'activations', 'parents');
    refreshCounts();
    show(S.view);
    if (S.drawer) openDrawer(S.drawer.type, S.drawer.id, S.drawer.preset);
  }

  // ---------------------------------------------------------------- Élèves
  function renderStudents() {
    const all = S.data.students || [], f = S.f;
    const counts = all.reduce((m, s) => (m[s.status] = (m[s.status] || 0) + 1, m), {});
    q('[data-st-seg]').innerHTML = [['', 'Tous', all.length], ...Object.keys(ST).map(k => [k, ST[k][0], counts[k] || 0])]
      .map(([v, l, n]) => `<button type="button" data-v="${v}" aria-pressed="${f.stStatus === v}">${v ? `<i class="dot ${ST[v][1]}"></i>` : ''}${esc(l)} <em>${F(n)}</em></button>`).join('');
    const cyc = q('[data-st-cycles]'), cycles = [...new Set(all.map(s => s.cycle).filter(Boolean))];
    cyc.innerHTML = '<option value="">Tous les cycles</option>' + cycles.map(c => `<option value="${esc(c)}"${c === f.stCycle ? ' selected' : ''}>${esc(c)}</option>`).join('');
    renderStudentRows();
  }
  function renderStudentRows() {
    const f = S.f, qq = norm(f.stQ), tb = q('[data-st-rows]');
    const rows = (S.data.students || []).filter(s => (!f.stStatus || s.status === f.stStatus) && (!f.stCycle || s.cycle === f.stCycle)
      && (!qq || norm(`${s.name} ${s.email} ${s.phone} ${s.level} ${s.parentName} ${s.parentPhone} ${s.parentEmail}`).includes(qq)));
    q('[data-st-count]').textContent = plural(rows.length, 'élève');
    tb.innerHTML = rows.length ? rows.map(s => {
      const dl = s.daysLeft;
      const until = s.accessUntil ? `${esc(dFr(s.accessUntil))}<small class="ad-note ${dl != null && dl <= 7 ? (dl < 0 ? 'neg' : 'warn') : ''}">${dl == null ? '' : dl < 0 ? `expiré depuis ${plural(-dl, 'jour')}` : dl === 0 ? 'se termine aujourd\'hui' : `${plural(dl, 'jour')} restant${dl > 1 ? 's' : ''}`}</small>` : '<span class="ad-mute">—</span>';
      return `<tr data-open="student" data-id="${esc(s.id)}" tabindex="0">
        <td><div class="ad-who">${avatar(s.name)}<div><b>${esc(s.name)}</b><small>${esc(s.email || '')}</small></div></div></td>
        <td>${esc(s.level || '—')}<small class="ad-note">${esc(s.cycle || '')}</small></td>
        <td>${stTag(s.status)}</td><td class="nowrap">${until}</td>
        <td class="num">${F(s.lessons)}</td><td class="num">${s.lessons ? Number(s.average).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' %' : '<span class="ad-mute">—</span>'}</td>
        <td class="num">${money(s.paidTotal)}</td>
        <td>${s.parentName || s.parentPhone ? `<b class="ad-sm">${esc(s.parentName || 'Parent')}</b>${s.parentPhone ? `<div>${tel(s.parentPhone)}</div>` : ''}` : '<span class="ad-mute">Non renseigné</span>'}</td></tr>`;
    }).join('') : emptyRow(tb, 'Aucun élève', 'Aucun élève ne correspond à ces filtres.');
  }

  // ---------------------------------------------------------------- Parents
  function renderParents() {
    const f = S.f, qq = norm(f.paQ), tb = q('[data-pa-rows]');
    const rows = (S.data.parents || []).filter(p => (!f.paKind || p.type === f.paKind)
      && (!qq || norm(`${p.name} ${p.email} ${p.phone} ${p.city} ${p.district} ${(p.children || []).map(c => c.name).join(' ')}`).includes(qq)));
    q('[data-pa-count]').textContent = plural(rows.length, 'parent');
    tb.innerHTML = rows.length ? rows.map((p, i) => `<tr data-open="parent" data-idx="${S.data.parents.indexOf(p)}" tabindex="0">
      <td><div class="ad-who">${avatar(p.name)}<div><b>${esc(p.name || 'Sans nom')}</b><small>${esc(p.email || '')}</small></div></div></td>
      <td>${tel(p.phone)}</td>
      <td>${esc([p.district, p.city].filter(Boolean).join(', ') || '—')}</td>
      <td>${p.type === 'ACCOUNT' ? '<span class="ad-kind st">Compte</span>' : '<span class="ad-kind ct">Contact élève</span>'}</td>
      <td><div class="ad-kids">${(p.children || []).map(c => `<span class="ad-kid"><i class="dot ${(ST[c.status] || ['', 'none'])[1]}" title="${esc((ST[c.status] || [c.status])[0])}"></i>${esc(c.name)}<small>${esc(c.level || '')}</small></span>`).join('') || '<span class="ad-mute">—</span>'}</div></td>
      <td class="num">${F(p.visits)}</td><td class="num">${F(p.messages)}</td></tr>`).join('')
      : emptyRow(tb, 'Aucun parent', 'Aucun parent ne correspond à ces filtres.');
  }

  // ---------------------------------------------------------------- Répétiteurs
  function renderTutors() {
    const all = S.data.tutors || [], sel = q('[data-tu-places]');
    const places = [...new Set(all.map(t => t.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
    sel.innerHTML = '<option value="">Toutes les villes</option>' + places.map(p => `<option value="${esc(p)}"${p === S.f.tuPlace ? ' selected' : ''}>${esc(p)}</option>`).join('');
    renderTutorRows();
  }
  function renderTutorRows() {
    const f = S.f, qq = norm(f.tuQ), tb = q('[data-tu-rows]');
    const rows = (S.data.tutors || []).filter(t => (!f.tuStatus || (f.tuStatus === 'TOVALIDATE' ? t.profileStatus === 'PENDING' : t.listingStatus === f.tuStatus))
      && (!f.tuPlace || t.city === f.tuPlace)
      && (!qq || norm(`${t.name} ${t.email} ${t.phone} ${list(t.specialties).join(' ')} ${list(t.levels).join(' ')} ${t.educationLevel} ${t.district}`).includes(qq)));
    q('[data-tu-count]').textContent = plural(rows.length, 'répétiteur');
    tb.innerHTML = rows.length ? rows.map(t => `<tr data-open="tutor" data-id="${esc(t.id)}" tabindex="0">
      <td><div class="ad-who">${avatar(t.name)}<div><b>${esc(t.name)}</b><small>${esc(t.email || t.phone || '')}</small></div></div></td>
      <td>${esc(t.district || t.city || '—')}${t.district && t.city ? `<small class="ad-note">${esc(t.city)}</small>` : ''}</td>
      <td class="ad-wrap">${esc(list(t.specialties).join(', ') || '—')}${list(t.levels).length ? `<small class="ad-note">${esc(list(t.levels).join(', '))}</small>` : ''}</td>
      <td>${esc(t.educationLevel || '—')}</td>
      <td class="num">${t.experienceYears != null ? esc(t.experienceYears) + ' an' + (t.experienceYears > 1 ? 's' : '') : '—'}</td>
      <td>${tag(LISTING[t.listingStatus] || [t.listingStatus || '—', 'none'])}${t.profileStatus === 'PENDING' ? '<small class="ad-note warn">Profil à valider</small>' : ''}</td>
      <td class="nowrap">${t.listedUntil ? esc(dFr(t.listedUntil)) + (t.daysLeft != null && t.daysLeft >= 0 ? `<small class="ad-note${t.daysLeft <= 7 ? ' warn' : ''}">${plural(t.daysLeft, 'jour')}</small>` : '') : '<span class="ad-mute">—</span>'}</td>
      <td class="num">${F(t.views30)}</td><td class="num">${F(t.messages)}</td><td class="num">${money(t.paidTotal)}</td></tr>`).join('')
      : emptyRow(tb, 'Aucun répétiteur', 'Aucun répétiteur ne correspond à ces filtres.');
  }

  // ---------------------------------------------------------------- Activations
  function renderActivations() {
    const a = S.data.activations || {}, up = a.upcoming || [], ex = a.expired || [], rec = a.recent || [];
    q('[data-up-total]').textContent = up.length ? plural(up.length, 'échéance') : '';
    q('[data-exp-total]').textContent = ex.length ? plural(ex.length, 'compte') : '';
    const item = (x, past) => {
      const d = daysUntil(x.date);
      const when = d == null ? '' : past ? `expiré depuis ${plural(Math.abs(d), 'jour')}` : d === 0 ? 'aujourd\'hui' : `dans ${plural(d, 'jour')}`;
      return `<li class="ad-act${!past && d != null && d <= 3 ? ' hot' : ''}">
        <div class="ad-act-d"><b>${esc(dFr(x.date, { day: '2-digit', month: 'short' }))}</b><small>${esc(when)}</small></div>
        <div class="ad-act-w">${kindTag(x.kind)}<button type="button" class="ad-name" data-open="${x.kind === 'TUTOR' ? 'tutor' : 'student'}" data-id="${esc(x.id)}">${esc(x.name)}</button><small>${esc(x.detail || '')}${x.status ? ' · ' + esc((ST[x.status] || LISTING[x.status] || [x.status])[0]) : ''}</small></div>
        <div class="ad-act-c">${x.phone ? `<a class="btn ghost ad-call" href="tel:${esc(String(x.phone).replace(/[^\d+]/g, ''))}">${ic('phone')}${esc(x.phone)}</a>` : '<span class="ad-mute">Pas de téléphone</span>'}</div></li>`;
    };
    q('[data-act-up]').innerHTML = up.length ? `<ul class="ad-acts">${up.map(x => item(x, false)).join('')}</ul>` : empty('Aucune échéance proche', 'Aucun accès ne se termine dans les 14 prochains jours.', 'clock');
    q('[data-act-exp]').innerHTML = ex.length ? `<ul class="ad-acts">${ex.map(x => item(x, true)).join('')}</ul>` : empty('Aucun accès expiré', 'Rien à relancer sur les 60 derniers jours.', 'check');
    const tb = q('[data-act-recent]');
    tb.innerHTML = rec.length ? rec.map(p => `<tr><td class="nowrap">${esc(dFr(p.processedAt || p.createdAt))}</td><td>${kindTag(p.kind)}</td>
      <td><button type="button" class="ad-name" data-open="${p.kind === 'TUTOR' ? 'tutor' : 'student'}" data-id="${esc(p.payerId)}">${esc(p.payer)}</button></td>
      <td>${esc(p.detail || '—')}</td><td class="num"><b>${money(p.amount)}</b></td><td>${esc(method(p.method))}</td><td class="nowrap">${esc(dFr(p.periodEnd))}</td></tr>`).join('')
      : emptyRow(tb, 'Aucune activation récente', '');
  }

  // ---------------------------------------------------------------- Engagement
  function hbars(items, opt) {
    const max = Math.max(1, ...items.map(i => i.v));
    return `<ol class="ad-hbars">${items.map((it, i) => `<li>
      <span class="ad-hb-rank">${i + 1}</span>
      <div class="ad-hb-main"><div class="ad-hb-top">${opt.link ? `<button type="button" class="ad-name" data-open="tutor" data-id="${esc(it.id)}">${esc(it.label)}</button>` : `<b>${esc(it.label)}</b>`}<em class="num">${F(it.v)} ${esc(opt.unit(it.v))}</em></div>
      <div class="ad-hb-track"><i style="width:${(it.v / max * 100).toFixed(1)}%"></i></div></div></li>`).join('')}</ol>`;
  }
  function renderEngagement() {
    const e = S.data.engagement || {}, places = Object.entries(e.listedByPlace || {}).map(([label, v]) => ({ label, v: Number(v) })).sort((a, b) => b.v - a.v);
    const listed = places.reduce((n, p) => n + p.v, 0);
    q('[data-eng-kpis]').innerHTML = [
      kpi('Fiches consultées (30 j)', F(e.visits30), 'Visites de familles sur les profils'),
      kpi('Messages échangés (30 j)', F(e.messages30), 'Familles ↔ répétiteurs'),
      kpi('Répétiteurs visibles', F(listed), 'Dans l\'annuaire public', { go: 'repetiteurs' }),
      kpi('Lieux couverts', F(places.length), 'Communes et villes')
    ].join('');
    const top = (e.topTutors || []).map(t => ({ id: t.tutorId, label: t.name, v: Number(t.views || 0) }));
    q('[data-eng-top]').innerHTML = top.length ? hbars(top, { link: true, unit: v => v > 1 ? 'vues' : 'vue' }) : empty('Aucune consultation', 'Aucune fiche n\'a été ouverte ces 30 derniers jours.', 'eye');
    q('[data-eng-places]').innerHTML = places.length ? hbars(places, { unit: v => v > 1 ? 'répétiteurs' : 'répétiteur' }) : empty('Aucun répétiteur visible', '', 'brief');
  }

  // ---------------------------------------------------------------- Notifications
  function renderNotifs() {
    const n = S.data.notifs || {}, f = S.f, qq = norm(f.noQ), tb = q('[data-no-rows]');
    q('[data-notif-alert]').innerHTML = mailAlert(n.mailConfigured);
    const rows = (n.items || []).filter(x => (!f.noKind || x.kind === f.noKind) && (!f.noMail || (x.emailStatus || 'NONE') === f.noMail)
      && (!qq || norm(`${x.title} ${x.to} ${x.emailTo}`).includes(qq)));
    q('[data-no-count]').textContent = plural(rows.length, 'notification');
    tb.innerHTML = rows.length ? rows.map(x => `<tr><td class="nowrap">${esc(dtFr(x.at))}</td><td><span class="ad-chip">${esc(NKIND[x.kind] || x.kind || '—')}</span></td>
      <td class="ad-wrap">${esc(x.title || '')}</td><td>${esc(x.to || '—')}${x.emailTo ? `<small class="ad-note">${esc(x.emailTo)}</small>` : ''}</td>
      <td>${tag(MAIL[x.emailStatus || 'NONE'] || [x.emailStatus, 'none'])}</td></tr>`).join('')
      : emptyRow(tb, 'Aucune notification', '');
    refreshCounts();
  }

  // ---------------------------------------------------------------- Contenus et corrections
  async function renderContent() {
    const cat = S.data.catalog || [];
    const d = await load('dash').catch(() => ({}));
    if (S.view !== 'contenus') return;
    q('[data-content-kpis]').innerHTML = [
      kpi('Leçons publiées', F(cat.reduce((n, c) => n + Number(c.lessons || 0), 0)), 'Programme officiel'),
      kpi('Classes', F(cat.length), 'Du CP1 à la Terminale'),
      kpi('Vidéos ajoutées', F(d.videos), 'Liées aux leçons'),
      kpi('Quiz', F(d.quizzes), 'Défis interactifs')
    ].join('');
    const cycles = [...new Set(cat.map(c => c.cycle))];
    q('[data-catalog]').innerHTML = cycles.length ? cycles.map(cy => `<div class="ad-cycle"><h3>${esc(cy)}</h3><div class="ad-levels">${cat.filter(c => c.cycle === cy)
      .map(c => `<a class="ad-level" href="/programme?level=${encodeURIComponent(c.level)}" target="_blank" rel="noopener"><b>${esc(c.level)}</b><small>${F(c.lessons)} leçons · ${F((c.subjects || []).length)} matières</small></a>`).join('')}</div></div>`).join('')
      : empty('Catalogue vide', 'Aucune leçon chargée.', 'book');
  }

  function renderExams() {
    const rows = (S.data.exams || []).filter(x => x.status === 'PENDING_REVIEW');
    q('[data-exams]').innerHTML = rows.length ? `<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>N°</th><th>Examen</th><th>Classe</th><th>Matière</th><th class="num">Barème</th><th></th></tr></thead><tbody>${rows.map(x =>
      `<tr><td><code>#${esc(x.id)}</code></td><td><b>${esc(x.examType || '—')}</b></td><td>${esc(x.level || '—')}</td><td>${esc(x.subject || '—')}</td><td class="num">sur ${esc(x.total)}</td>
       <td class="ad-row-act"><button class="btn primary" type="button" data-review="${esc(x.id)}" data-total="${esc(x.total)}">Noter</button></td></tr>`).join('')}</tbody></table></div>`
      : empty('Aucune copie à corriger', 'Les nouvelles copies apparaîtront ici.');
  }

  function renderSettings() {
    const ov = S.data.ov || {};
    q('[data-plans]').innerHTML = `<div class="ad-plans">${(ov.plans || []).map(p => `<div class="ad-plan"><div><b>${esc(p.cycle)}</b><small>${esc(p.classes)}</small></div><span class="num">${money(p.price)}<small>/ mois</small></span></div>`).join('')}
      <div class="ad-plan tu"><div><b>Répétiteur</b><small>Visibilité dans l'annuaire, 3 mois</small></div><span class="num">${money(tutorPrice())}<small>/ 3 mois</small></span></div></div>`;
    q('[data-mailstate]').innerHTML = ov.mailConfigured === false
      ? `<div class="ad-alert sm">${ic('alert')}<div><b>Envoi d'e-mails désactivé</b><span>Définissez SPRING_MAIL_HOST, SPRING_MAIL_USERNAME et SPRING_MAIL_PASSWORD sur le serveur.</span></div></div>`
      : `<p class="ad-ok">${ic('mail')}Envoi d'e-mails configuré.</p>`;
  }

  // ---------------------------------------------------------------- Tiroir (fiche client)
  function openDrawerShell(kindLabel) {
    const dr = q('[data-drawer]');
    if (!S.drawer || dr.getAttribute('aria-hidden') === 'true') S.lastFocus = document.activeElement;
    q('[data-drawer-kind]').textContent = kindLabel;
    q('[data-scrim]').hidden = false;
    dr.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ad-drawer-open');
    requestAnimationFrame(() => { dr.classList.add('open'); q('[data-scrim]').classList.add('open'); });
    setTimeout(() => q('[data-drawer-close]').focus(), 60);
  }
  function closeDrawer() {
    if (!S.drawer) return;
    S.drawer = null;
    const dr = q('[data-drawer]'), sc = q('[data-scrim]');
    dr.classList.remove('open'); sc.classList.remove('open');
    dr.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ad-drawer-open');
    setTimeout(() => { if (!S.drawer) sc.hidden = true; }, 300);
    if (S.lastFocus && S.lastFocus.focus) S.lastFocus.focus();
  }
  const drawerSkel = () => `<div class="ad-dh"><span class="ad-skel round xl"></span><div style="flex:1"><span class="ad-skel lg" style="width:60%"></span><span class="ad-skel" style="width:40%"></span></div></div>${Array.from({ length: 5 }, () => '<div class="ad-skel-line"><span class="ad-skel" style="width:90%"></span></div>').join('')}`;

  async function openDrawer(type, id, preset) {
    const labels = { student: 'Fiche élève', tutor: 'Fiche répétiteur', parent: 'Fiche parent' };
    const body = q('[data-drawer-body]');
    const same = S.drawer && S.drawer.type === type && String(S.drawer.id) === String(id);
    S.drawer = { type, id, preset };
    openDrawerShell(labels[type]);
    if (!same) body.innerHTML = drawerSkel();
    try {
      if (type === 'student') body.innerHTML = studentSheet(await api(`/admin/crm/students/${encodeURIComponent(id)}`));
      else if (type === 'tutor') body.innerHTML = tutorSheet(await api(`/admin/crm/tutors/${encodeURIComponent(id)}`));
      else if (type === 'parent') {
        const p = preset;
        let notes = [];
        if (p.accountId != null) notes = await api(`/admin/crm/notes?type=PARENT&id=${encodeURIComponent(p.accountId)}`).then(asNotes).catch(() => []);
        if (!S.drawer || S.drawer.type !== 'parent') return;
        body.innerHTML = parentSheet(p, notes);
      }
      body.scrollTop = same ? body.scrollTop : 0;
    } catch (e) {
      body.innerHTML = empty('Fiche indisponible', apiErrorMessage(e, 'Chargement impossible'), 'alert');
    }
  }
  const asNotes = r => Array.isArray(r) ? r : (r && (r.notes || r.items)) || [];

  const sec = (title, html, extra) => `<section class="ad-ds"><h4>${esc(title)}${extra || ''}</h4>${html}</section>`;
  const dl = pairs => `<dl class="ad-dl">${pairs.filter(Boolean).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const val = v => v == null || v === '' ? '<span class="ad-mute">—</span>' : esc(v);
  const textList = v => { const a = list(v); return a.length ? `<ul class="ad-bul">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<span class="ad-mute">—</span>'; };

  function payList(pays) {
    if (!pays || !pays.length) return '<p class="ad-mute ad-pad">Aucun paiement.</p>';
    return `<ul class="ad-mini">${pays.map(p => `<li><div><b class="num">${money(p.amount)}</b><small>${esc(dFr(p.createdAt))} · ${p.months ? esc(plural(p.months, 'mois', 'mois')) + ' · ' : ''}${esc(method(p.method))}${p.reference ? ' · ' + esc(p.reference) : ''}</small>${p.status === 'REJECTED' && p.note ? `<small class="ad-note neg">${esc(p.note)}</small>` : ''}</div>
      <div class="ad-mini-r">${tag(PAY[p.status] || [p.status, 'none'])}${p.status === 'PENDING' ? `<span class="ad-mini-act"><button class="btn success sm" type="button" data-validate="${esc(p.id)}">Valider</button><button class="btn danger sm" type="button" data-reject="${esc(p.id)}">Refuser</button></span>` : ''}</div></li>`).join('')}</ul>`;
  }

  function notesBlock(type, id, notes) {
    return sec('Notes internes', `<form class="ad-note-form" data-note-form data-type="${type}" data-id="${esc(id)}">
        <textarea name="body" rows="2" maxlength="2000" required placeholder="Ajouter une note (appel, promesse de paiement, remarque…)"></textarea>
        <button class="btn primary sm" type="submit">Ajouter</button></form>
      <ul class="ad-notes" data-notes>${notesItems(notes)}</ul>`);
  }
  const notesItems = notes => (notes && notes.length) ? notes.map(n => `<li><p>${esc(n.body)}</p><small>${esc(n.author || 'Administrateur')} · ${esc(dtFr(n.createdAt))}</small></li>`).join('') : '<li class="ad-notes-none">Aucune note pour le moment.</li>';

  function head(name, sub, tags) {
    return `<div class="ad-dh">${avatar(name)}<div><h3 id="ad-drawer-title">${esc(name || 'Sans nom')}</h3><p>${sub}</p><div class="ad-dh-tags">${tags || ''}</div></div></div>`;
  }

  function studentSheet(d) {
    const s = d.student || {}, sub = d.subscription || {}, acc = d.account || {}, rep = d.report || null;
    const status = sub.status || s.status;
    let report = '<p class="ad-mute ad-pad">Pas encore de bilan pour ce bimestre.</p>';
    if (rep) {
      const subj = rep.subjects || [], scale = 100; // moyennes en pourcentage (réussite aux évaluations)
      report = `<div class="ad-rep-k"><div><b>${F(rep.lessonsCompleted)}</b><small>leçons</small></div><div><b>${rep.average != null ? Number(rep.average).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' %' : '—'}</b><small>réussite moyenne</small></div><div><b>${F(rep.activeDays)}</b><small>jours actifs</small></div></div>
        ${subj.length ? `<ul class="ad-subj">${subj.map(x => { const a = Number(x.average || 0); return `<li><span>${esc(x.subject)}</span><div class="ad-hb-track"><i class="${a / scale >= .5 ? '' : 'low'}" style="width:${Math.min(100, a / scale * 100).toFixed(1)}%"></i></div><em class="num">${x.average != null ? a.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' %' : '—'}</em><small>${plural(x.lessons || 0, 'leçon')}</small></li>`; }).join('')}</ul>` : ''}
        ${dl([['Points forts', textList(rep.strengths)], ['À améliorer', textList(rep.toImprove)], rep.appreciation ? ['Appréciation', esc(rep.appreciation)] : null])}`;
    }
    return head(s.name, `${esc(s.level || '')}${s.cycle ? ' · ' + esc(s.cycle) : ''}`, stTag(status) + (s.paidTotal ? `<span class="ad-chip">${money(s.paidTotal)} payés</span>` : '')) +
      `<div class="ad-dact">
        <button class="btn primary" type="button" data-cash-for="STUDENT" data-id="${esc(s.id)}">${ic('cash')}Encaisser</button>
        <button class="btn ghost" type="button" data-send-report="${esc(s.id)}" ${s.parentEmail ? '' : 'title="Aucun e-mail parent renseigné"'}>${ic('send')}Envoyer le bilan au parent</button>
      </div>` +
      sec('Contacts', `<div class="ad-contacts"><div><small>Élève</small><b>${esc(s.name)}</b>${mail(s.email || acc.email)}${s.phone ? tel(s.phone) : ''}</div>
        <div><small>Parent</small><b>${esc(s.parentName || 'Non renseigné')}</b>${s.parentEmail ? mail(s.parentEmail) : ''}${s.parentPhone ? tel(s.parentPhone) : ''}</div></div>`) +
      sec('Abonnement', dl([
        ['Statut', stTag(status)],
        ['Accès jusqu\'au', esc(dFr(sub.accessUntil || s.accessUntil)) + (sub.daysLeft != null ? ` <small class="ad-mute">(${sub.daysLeft < 0 ? 'expiré' : plural(sub.daysLeft, 'jour')})</small>` : '')],
        ['Tarif mensuel', money(sub.monthlyPrice || s.monthlyPrice)],
        sub.welcomeOffer != null ? ['Offre de bienvenue', typeof sub.welcomeOffer === 'boolean' ? (sub.welcomeOffer ? 'Oui' : 'Non') : val(sub.welcomeOffer)] : null,
        ['Inscrit le', esc(dFr(acc.createdAt || s.createdAt))],
        ['Dernière connexion', acc.lastLoginAt ? esc(dtFr(acc.lastLoginAt)) : '<span class="ad-mute">Jamais</span>'],
        ['Dernière activité', s.lastActivity ? esc(ago(s.lastActivity)) : '<span class="ad-mute">—</span>'],
        ['XP', F(s.xp)]
      ])) +
      sec(rep && rep.label ? `Bilan · ${rep.label}` : 'Bilan du bimestre', report) +
      sec('Paiements', payList(d.payments)) +
      notesBlock('STUDENT', s.id, d.notes);
  }

  function tutorSheet(d) {
    const t = d.tutor || {}, l = d.listing || {};
    const ls = l.listingStatus || t.listingStatus, ps = l.profileStatus || t.profileStatus || t.status;
    const btn = (st, label, cls) => `<button class="btn ${cls} sm" type="button" data-tutor-status="${st}" data-id="${esc(t.id)}" ${ps === st ? 'disabled' : ''}>${label}</button>`;
    return head(t.name, esc([t.district, t.city].filter(Boolean).join(', ')), tag(LISTING[ls] || [ls || '—', 'none']) + (ps ? `<span class="ad-chip">${esc(PROFILE[ps] || ps)}</span>` : '')) +
      `<div class="ad-dact"><button class="btn primary" type="button" data-cash-for="TUTOR" data-id="${esc(t.id)}">${ic('cash')}Encaisser ${money(l.price || tutorPrice())}</button></div>` +
      sec('Statut du profil', `<div class="ad-status-row"><span>${esc(PROFILE[ps] || ps || '—')}</span><div>${btn('APPROVED', 'Valider', 'success')}${btn('SUSPENDED', 'Suspendre', 'ghost')}${btn('REJECTED', 'Refuser', 'danger')}</div></div>
        ${dl([['Visibilité', tag(LISTING[ls] || [ls || '—', 'none'])], ['Visible jusqu\'au', esc(dFr(l.listedUntil || t.listedUntil)) + (l.daysLeft != null && l.daysLeft >= 0 ? ` <small class="ad-mute">(${plural(l.daysLeft, 'jour')})</small>` : '')]])}`) +
      sec('Contacts', `<div class="ad-contacts one"><div>${mail(t.email)}${t.phone ? tel(t.phone) : ''}${t.whatsapp && t.whatsapp !== t.phone ? `<a class="ad-link" href="https://wa.me/${esc(String(t.whatsapp).replace(/\D/g, ''))}" target="_blank" rel="noopener">${ic('msg')}WhatsApp ${esc(t.whatsapp)}</a>` : ''}</div></div>`) +
      sec('Profil', dl([
        ['Matières', val(list(t.specialties).join(', '))], ['Niveaux', val(list(t.levels).join(', '))],
        ['Diplôme', val(t.educationLevel)], ['Expérience', t.experienceYears != null ? esc(t.experienceYears) + ' an' + (t.experienceYears > 1 ? 's' : '') : val(null)],
        ['Tarif horaire', t.hourlyRate ? money(t.hourlyRate) + ' / h' : val(null)], ['Mode', val(t.teachingMode)],
        ['Inscrit le', esc(dFr(t.createdAt || t.memberSince))],
        ['Audience', `${F(t.views30)} vues sur 30 j · ${F(t.views)} au total · ${plural(t.messages || 0, 'message')}`]
      ]) + (t.bio ? `<blockquote class="ad-bio">${esc(t.bio)}</blockquote>` : '')) +
      sec('Paiements', payList(d.payments)) +
      sec('Dernières visites', (d.visits || []).length ? `<ul class="ad-mini">${d.visits.slice(0, 12).map(v => `<li><div><b>${esc(v.name || 'Visiteur')}</b><small>${esc(v.role === 'PARENT' ? 'Parent' : v.role === 'STUDENT' ? 'Élève' : v.role || '')}</small></div><small class="ad-mute">${esc(dtFr(v.at))}</small></li>`).join('')}</ul>` : '<p class="ad-mute ad-pad">Aucune visite enregistrée.</p>') +
      notesBlock('TUTOR', t.id, d.notes);
  }

  function parentSheet(p, notes) {
    return head(p.name, esc([p.district, p.city].filter(Boolean).join(', ') || 'Lieu non renseigné'), p.type === 'ACCOUNT' ? '<span class="ad-kind st">Compte parent</span>' : '<span class="ad-kind ct">Contact renseigné par un élève</span>') +
      sec('Contacts', `<div class="ad-contacts one"><div>${mail(p.email)}${tel(p.phone)}</div></div>`) +
      sec('Activité', dl([
        p.createdAt ? ['Compte créé le', esc(dFr(p.createdAt))] : null,
        p.type === 'ACCOUNT' ? ['Dernière connexion', p.lastLoginAt ? esc(dtFr(p.lastLoginAt)) : '<span class="ad-mute">Jamais</span>'] : null,
        ['Fiches de répétiteurs consultées', F(p.visits)], ['Messages envoyés', F(p.messages)]
      ])) +
      sec('Enfants', (p.children || []).length ? `<ul class="ad-mini">${p.children.map(c => `<li><div><button type="button" class="ad-name" data-open="student" data-id="${esc(c.id)}">${esc(c.name)}</button><small>${esc(c.level || '')}</small></div>${stTag(c.status)}</li>`).join('')}</ul>` : '<p class="ad-mute ad-pad">Aucun enfant rattaché.</p>') +
      (p.accountId != null ? notesBlock('PARENT', p.accountId, notes) : '');
  }

  // ---------------------------------------------------------------- Boîte de dialogue maison
  function ask({ title, text, input, ok, danger }) {
    const dlg = q('[data-dialog]');
    q('[data-dlg-title]').textContent = title;
    q('[data-dlg-text]').textContent = text || '';
    const field = q('[data-dlg-field]'), area = q('[data-dlg-input]'), line = q('[data-dlg-line]'), lab = q('[data-dlg-label]');
    field.hidden = !input;
    const okBtn = q('[data-dlg-ok]');
    okBtn.textContent = ok || 'Confirmer';
    okBtn.className = 'btn ' + (danger ? 'danger' : 'primary');
    let el = null;
    if (input) {
      const multi = input.multiline !== false;
      area.hidden = !multi; line.hidden = multi;
      el = multi ? area : line;
      lab.textContent = input.label; lab.htmlFor = el.id;
      el.value = input.value || ''; el.required = !!input.required;
      if (!multi) { line.type = input.type || 'text'; line.min = input.min ?? ''; line.max = input.max ?? ''; line.step = input.step ?? 'any'; }
    } else { area.required = false; line.required = false; }
    return new Promise(resolve => {
      const form = q('[data-dialog-form]');
      const done = v => { form.onsubmit = null; q('[data-dlg-cancel]').onclick = null; dlg.onclose = null; if (dlg.open) dlg.close(); resolve(v); };
      form.onsubmit = e => { e.preventDefault(); if (el && !el.reportValidity()) return; done(input ? el.value.trim() : true); };
      q('[data-dlg-cancel]').onclick = () => done(null);
      dlg.onclose = () => done(null);
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      setTimeout(() => (el || okBtn).focus(), 30);
    });
  }

  // ---------------------------------------------------------------- Actions
  function bindActions() {
    document.addEventListener('click', async e => {
      if (e.target.closest('a[href^="tel:"], a[href^="mailto:"], a[target]')) return;
      const go = e.target.closest('[data-go]');
      if (go) { if (go.dataset.st) { S.f.stStatus = go.dataset.st; } show(go.dataset.go); return; }
      const retry = e.target.closest('[data-retry]');
      if (retry) { show(S.view); return; }
      const op = e.target.closest('[data-open]');
      if (op) {
        if (op.dataset.open === 'parent') openDrawer('parent', op.dataset.idx, S.data.parents[Number(op.dataset.idx)]);
        else if (op.dataset.id && op.dataset.id !== 'undefined' && op.dataset.id !== 'null') openDrawer(op.dataset.open, op.dataset.id);
        return;
      }
      const b = e.target.closest('button'); if (!b) return;
      try {
        if (b.dataset.validate) {
          if (!await ask({ title: 'Valider ce paiement ?', text: 'L\'accès du client sera activé ou prolongé immédiatement.', ok: 'Valider' })) return;
          b.disabled = true;
          await api(`/admin/payments/${encodeURIComponent(b.dataset.validate)}/validate`, { method: 'POST' });
          toast('Paiement validé'); afterPaymentChange();
        } else if (b.dataset.reject) {
          const note = await ask({ title: 'Refuser ce paiement', text: 'Le motif sera visible par le client.', input: { label: 'Motif du refus', value: 'Transaction introuvable', required: true }, ok: 'Refuser', danger: true });
          if (note == null) return;
          b.disabled = true;
          await api(`/admin/payments/${encodeURIComponent(b.dataset.reject)}/reject`, { method: 'POST', body: JSON.stringify({ note }) });
          toast('Paiement refusé'); afterPaymentChange();
        } else if (b.dataset.cashFor) {
          prefillCash(b.dataset.cashFor, b.dataset.id);
        } else if (b.dataset.sendReport) {
          if (!await ask({ title: 'Envoyer le bilan au parent ?', text: 'Le bilan du bimestre sera envoyé par e-mail et ajouté aux notifications du parent.', ok: 'Envoyer' })) return;
          b.disabled = true;
          try {
            const r = await api(`/admin/crm/students/${encodeURIComponent(b.dataset.sendReport)}/report`, { method: 'POST' }) || {};
            const to = r.sentTo ? ` à ${r.sentTo}` : '';
            toast({ SENT: `Bilan envoyé${to}`, PENDING: `Bilan en cours d'envoi${to}`, FAILED: `Échec de l'envoi${to} : bilan enregistré dans les notifications`, SKIPPED: 'E-mail non configuré : bilan enregistré dans les notifications', NONE: 'Bilan enregistré (aucun e-mail parent)' }[r.emailStatus] || 'Bilan transmis');
            drop('notifs');
          } finally { b.disabled = false; }
        } else if (b.dataset.tutorStatus) {
          const st = b.dataset.tutorStatus, L = { APPROVED: ['Valider ce profil ?', 'Le répétiteur pourra apparaître dans l\'annuaire dès que sa visibilité est payée.', 'Valider'], SUSPENDED: ['Suspendre ce profil ?', 'Le répétiteur disparaît de l\'annuaire jusqu\'à nouvel ordre.', 'Suspendre'], REJECTED: ['Refuser ce profil ?', 'Le profil ne sera pas publié.', 'Refuser'] }[st];
          if (!await ask({ title: L[0], text: L[1], ok: L[2], danger: st !== 'APPROVED' })) return;
          await api(`/admin/crm/tutors/${encodeURIComponent(b.dataset.id)}/status`, { method: 'POST', body: JSON.stringify({ status: st }) });
          toast({ APPROVED: 'Profil validé', SUSPENDED: 'Profil suspendu', REJECTED: 'Profil refusé' }[st]);
          drop('tutors', 'ov', 'engagement'); refreshCounts();
          if (S.view === 'repetiteurs' || S.view === 'apercu') show(S.view);
          openDrawer('tutor', b.dataset.id);
        } else if (b.dataset.review) {
          const n = await ask({ title: `Noter la copie #${b.dataset.review}`, input: { label: `Note obtenue (sur ${b.dataset.total})`, type: 'number', min: 0, max: b.dataset.total, step: '0.25', multiline: false, required: true }, ok: 'Enregistrer la note' });
          if (n == null || n === '' || isNaN(n)) return;
          await api(`/exams/${encodeURIComponent(b.dataset.review)}/review?score=${encodeURIComponent(Number(n))}`, { method: 'PATCH' });
          toast('Copie notée'); drop('exams'); show('corrections'); refreshCounts();
        }
      } catch (x) { b.disabled = false; toast(apiErrorMessage(x, 'Action impossible')); }
    });
    // Ouverture au clavier des lignes de tableau
    document.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('tr[data-open]')) { e.preventDefault(); e.target.click(); }
    });
    // Notes internes
    q('[data-drawer]').addEventListener('submit', async e => {
      const f = e.target.closest('[data-note-form]'); if (!f) return;
      e.preventDefault();
      const body = f.body.value.trim(); if (!body) return;
      const btn = f.querySelector('button'); btn.disabled = true;
      try {
        await api('/admin/crm/notes', { method: 'POST', body: JSON.stringify({ type: f.dataset.type, id: Number(f.dataset.id), body }) });
        const notes = await api(`/admin/crm/notes?type=${f.dataset.type}&id=${encodeURIComponent(f.dataset.id)}`).then(asNotes);
        f.parentElement.querySelector('[data-notes]').innerHTML = notesItems(notes);
        f.reset(); toast('Note ajoutée');
      } catch (x) { toast(apiErrorMessage(x, 'Note non enregistrée')); }
      finally { btn.disabled = false; }
    });
    q('[data-export]').addEventListener('click', exportCsv);
  }

  function bindFilters() {
    const rerender = { payKind: renderHistory, payStatus: renderHistory, payQ: renderHistory, stStatus: renderStudentRows, stCycle: renderStudentRows, stQ: renderStudentRows,
      paKind: renderParents, paQ: renderParents, tuStatus: renderTutorRows, tuPlace: renderTutorRows, tuQ: renderTutorRows, noKind: renderNotifs, noMail: renderNotifs, noQ: renderNotifs };
    let timer;
    document.addEventListener('input', e => {
      const k = e.target.dataset && e.target.dataset.filter; if (!k) return;
      S.f[k] = e.target.value; clearTimeout(timer);
      timer = setTimeout(() => { try { rerender[k](); } catch (_) { /* données absentes */ } }, e.target.type === 'search' ? 120 : 0);
    });
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-seg] [data-v]'); if (!b) return;
      const seg = b.closest('[data-seg]'), k = seg.dataset.seg;
      S.f[k] = b.dataset.v;
      qa('[data-v]', seg).forEach(x => x.setAttribute('aria-pressed', x === b));
      try { rerender[k](); } catch (_) { /* données absentes */ }
    });
  }

  function bindForms() {
    q('[data-video]').addEventListener('submit', async e => {
      e.preventDefault(); const f = e.target;
      try {
        await api('/videos', { method: 'POST', body: JSON.stringify({ lessonId: Number(f.lessonId.value), title: f.title.value.trim(), url: f.url.value.trim(), type: 'VIDEO', published: true }) });
        f.reset(); toast('Vidéo ajoutée'); drop('dash'); renderContent();
      } catch (x) { toast(apiErrorMessage(x, 'Ajout impossible')); }
    });
    q('[data-password]').addEventListener('submit', async e => {
      e.preventDefault(); const f = e.target;
      if (f.newPassword.value !== f.confirm.value) { toast('Les deux mots de passe ne sont pas identiques.'); return; }
      try {
        await api('/auth/password', { method: 'POST', body: JSON.stringify({ currentPassword: f.currentPassword.value, newPassword: f.newPassword.value }) });
        f.reset(); toast('Mot de passe modifié');
      } catch (x) { toast(apiErrorMessage(x, 'Changement impossible')); }
    });
  }

  document.addEventListener('DOMContentLoaded', () => { if (document.querySelector('.ad-main')) init(); });
})();
