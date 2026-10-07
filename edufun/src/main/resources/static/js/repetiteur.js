/* EduFun Répétiteurs — connexion, inscription en étapes et espace répétiteur (onglets). */
(function () {
  'use strict';
  const q = (s, root = document) => root.querySelector(s);
  const qa = (s, root = document) => [...root.querySelectorAll(s)];
  const F = n => Number(n || 0).toLocaleString('fr-FR');
  const money = n => F(n) + ' F CFA';
  const json = body => JSON.stringify(body);

  const SUBJECTS = ['Français', 'Mathématiques', 'Anglais', 'Espagnol', 'Allemand', 'Physique-Chimie', 'SVT', 'Histoire-Géographie', 'Philosophie', 'Informatique', 'Comptabilité', 'Économie'];
  const LEVELS = ['Primaire', 'Collège', 'Lycée', 'Prépa CEPE', 'Prépa BEPC', 'Prépa BAC'];
  const DIPLOMAS = ['BEPC', 'BAC', 'BTS / DUT', 'Licence', 'Master', 'Doctorat', 'Enseignant certifié', 'Autre'];
  const MODES = ['À domicile', 'En ligne', 'À domicile et en ligne'];
  const OPERATORS = { ORANGE_MONEY: '#ff7900', MTN_MOMO: '#ffcb05', MOOV_MONEY: '#0066b3', WAVE: '#1dc8f2' };
  const PAY = { PENDING: ['En vérification', 'wait'], VALIDATED: ['Validé', 'ok'], REJECTED: ['Refusé', 'off'] };
  const KIND_ICON = { VISIT: '👀', MESSAGE: '💬', PAYMENT: '💳', ACCOUNT: '👋', REPORT: '📊', PROGRESS: '📈' };

  // ---------- Dates ----------
  function toDate(v) {
    if (!v) return null;
    if (Array.isArray(v)) { const [y, m, d, h = 0, mi = 0, s = 0] = v; return new Date(y, m - 1, d, h, mi, s); }
    const str = String(v);
    const d = new Date(str.length === 10 ? str + 'T00:00:00' : str);
    return isNaN(d) ? null : d;
  }
  const dateLong = v => { const d = toDate(v); return d ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'; };
  const dateShort = v => { const d = toDate(v); return d ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''; };
  const timeHM = v => { const d = toDate(v); return d ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''; };
  function relative(v) {
    const d = toDate(v); if (!d) return '';
    const s = Math.round((Date.now() - d.getTime()) / 1000);
    if (s < 60) return "À l'instant";
    if (s < 3600) return `Il y a ${Math.floor(s / 60)} min`;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    const days = Math.round((today - day) / 86400000);
    if (days === 0) return `Il y a ${Math.floor(s / 3600)} h`;
    if (days === 1) return `Hier à ${timeHM(d)}`;
    if (days < 7) return `Il y a ${days} jours`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' });
  }
  function dayLabel(d) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    const n = Math.round((today - day) / 86400000);
    if (n === 0) return "Aujourd'hui";
    if (n === 1) return 'Hier';
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  const avatarClass = name => 'rp-av-' + ((String(name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4) + 1);
  const splitList = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);

  // ---------- Afficher / masquer le mot de passe ----------
  function bindPasswordToggles() {
    qa('[data-toggle-pass]').forEach(btn => btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.togglePass); if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Masquer' : 'Afficher';
      btn.setAttribute('aria-pressed', String(show));
      input.focus();
    }));
  }

  // ===================================================================
  // Champs du profil (partagés entre l'inscription et « Mon profil »)
  // ===================================================================
  function profileForm(form, places, opts = {}) {
    const you = opts.vous ? { commune: 'Choisissez votre commune', city: 'Choisissez votre ville' } : { commune: 'Choisis ta commune', city: 'Choisis ta ville' };
    const citySel = q('[data-city]', form), distField = q('[data-district-field]', form);
    const distSel = q('[data-district-select]', form), distTxt = q('[data-district-text]', form), distLabel = q('[data-district-label]', form);
    const abidjan = places.abidjan || 'Abidjan';

    citySel.innerHTML = `<option value="">${you.city}</option>` + (places.cities || []).map(c => `<option>${esc(c)}</option>`).join('');
    distSel.innerHTML = `<option value="">${you.commune}</option>` + (places.abidjanCommunes || []).map(c => `<option>${esc(c)}</option>`).join('');
    qa('[data-options]', form).forEach(sel => {
      const list = sel.dataset.options === 'diplomas' ? DIPLOMAS : MODES;
      sel.innerHTML = (sel.dataset.options === 'diplomas' ? '<option value="">Sélectionner…</option>' : '') + list.map(v => `<option>${esc(v)}</option>`).join('');
    });
    const chipsBox = name => q(`[data-chips="${name}"]`, form);
    chipsBox('specialties').innerHTML = SUBJECTS.map(s => `<button type="button" class="rp-chip" aria-pressed="false" data-value="${esc(s)}">${esc(s)}</button>`).join('');
    chipsBox('levels').innerHTML = LEVELS.map(s => `<button type="button" class="rp-chip" aria-pressed="false" data-value="${esc(s)}">${esc(s)}</button>`).join('');
    qa('[data-chips]', form).forEach(box => box.addEventListener('click', e => {
      const b = e.target.closest('.rp-chip'); if (!b) return;
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      box.classList.remove('invalid');
      form.dispatchEvent(new Event('input', { bubbles: true }));
    }));

    function syncDistrict() {
      const isAbj = citySel.value === abidjan;
      distSel.hidden = !isAbj; distSel.required = isAbj;
      distTxt.hidden = isAbj;
      distLabel.innerHTML = isAbj ? 'Commune' : 'Quartier <small>(facultatif)</small>';
      distLabel.htmlFor = isAbj ? distSel.id : distTxt.id;
      distField.hidden = !citySel.value;
    }
    citySel.addEventListener('change', syncDistrict);

    const bio = form.elements.bio, counter = q('[data-counter]', form);
    const count = () => { const n = bio.value.length; counter.textContent = `${F(n)} / 1 500`; counter.classList.toggle('warn', n > 1400); };
    bio.addEventListener('input', count);

    function chips(name) { return qa('.rp-chip[aria-pressed=true]', chipsBox(name)).map(b => b.dataset.value); }
    function specialties() {
      return [...new Set([...chips('specialties'), ...splitList(form.elements.otherSubjects.value)])];
    }

    function fill(p) {
      const el = form.elements;
      ['name', 'phone', 'whatsapp', 'bio'].forEach(k => { if (el[k]) el[k].value = p[k] || ''; });
      el.experienceYears.value = p.experienceYears || p.experienceYears === 0 ? p.experienceYears : '';
      el.hourlyRate.value = p.hourlyRate ? p.hourlyRate : '';
      if (p.city && ![...citySel.options].some(o => o.value === p.city)) citySel.insertAdjacentHTML('beforeend', `<option>${esc(p.city)}</option>`);
      citySel.value = p.city || '';
      syncDistrict();
      if (citySel.value === abidjan) {
        if (p.district && ![...distSel.options].some(o => o.value === p.district)) distSel.insertAdjacentHTML('beforeend', `<option>${esc(p.district)}</option>`);
        distSel.value = p.district || '';
      } else distTxt.value = p.district || '';
      const subs = splitList(p.specialties);
      qa('.rp-chip', chipsBox('specialties')).forEach(b => b.setAttribute('aria-pressed', String(subs.includes(b.dataset.value))));
      el.otherSubjects.value = subs.filter(s => !SUBJECTS.includes(s)).join(', ');
      const lv = splitList(p.levels);
      qa('.rp-chip', chipsBox('levels')).forEach(b => b.setAttribute('aria-pressed', String(lv.includes(b.dataset.value))));
      const ensure = (sel, v) => { if (v && ![...sel.options].some(o => o.value === v)) sel.insertAdjacentHTML('beforeend', `<option>${esc(v)}</option>`); sel.value = v || sel.options[0]?.value || ''; };
      ensure(el.educationLevel, p.educationLevel);
      ensure(el.teachingMode, p.teachingMode || MODES[0]);
      count();
    }

    function values() {
      const el = form.elements;
      const exp = el.experienceYears.value.trim(), rate = el.hourlyRate.value.trim();
      return {
        name: el.name.value.trim(), phone: el.phone.value.trim(), whatsapp: el.whatsapp.value.trim(),
        city: citySel.value, district: (citySel.value === abidjan ? distSel.value : distTxt.value).trim(),
        specialties: specialties().join(', '), levels: chips('levels').join(', '),
        educationLevel: el.educationLevel.value, experienceYears: exp === '' ? 0 : Math.max(0, Math.min(50, parseInt(exp, 10) || 0)),
        hourlyRate: rate === '' ? 0 : Math.max(0, parseInt(rate, 10) || 0), teachingMode: el.teachingMode.value, bio: el.bio.value.trim()
      };
    }

    // Validation : renvoie le premier message d'erreur et marque le champ.
    function invalid(field, msg) {
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus({ preventScroll: false }); field.addEventListener('input', () => field.removeAttribute('aria-invalid'), { once: true }); field.addEventListener('change', () => field.removeAttribute('aria-invalid'), { once: true }); }
      return msg;
    }
    function checkContacts() {
      const el = form.elements, v = values();
      if (el.name && v.name.length < 3) return invalid(el.name, opts.vous ? 'Indiquez votre nom complet.' : 'Indique ton nom complet.');
      if (v.phone.replace(/\D/g, '').length < 8) return invalid(el.phone, opts.vous ? 'Indiquez un numéro de téléphone valide.' : 'Indique un numéro de téléphone valide.');
      if (v.whatsapp && v.whatsapp.replace(/\D/g, '').length < 8) return invalid(el.whatsapp, 'Le numéro WhatsApp semble incomplet.');
      if (!v.city) return invalid(citySel, opts.vous ? 'Choisissez votre ville.' : 'Choisis ta ville.');
      if (v.city === abidjan && !v.district) return invalid(distSel, opts.vous ? 'À Abidjan, choisissez votre commune.' : 'À Abidjan, choisis ta commune.');
      return '';
    }
    function checkPedagogy() {
      const el = form.elements, v = values();
      if (!v.specialties) { chipsBox('specialties').classList.add('invalid'); q('.rp-chip', chipsBox('specialties')).focus(); return opts.vous ? 'Sélectionnez au moins une matière.' : 'Sélectionne au moins une matière.'; }
      if (!v.levels) { chipsBox('levels').classList.add('invalid'); q('.rp-chip', chipsBox('levels')).focus(); return opts.vous ? 'Sélectionnez au moins un niveau de classe.' : 'Sélectionne au moins un niveau de classe.'; }
      if (!v.educationLevel) return invalid(el.educationLevel, opts.vous ? 'Indiquez votre niveau d\'études ou votre diplôme.' : 'Indique ton niveau d\'études ou ton diplôme.');
      return '';
    }

    syncDistrict(); count();
    return { fill, values, checkContacts, checkPedagogy, syncDistrict };
  }

  async function loadPlaces() {
    try { return await api('/places'); }
    catch (e) { toast(apiErrorMessage(e, 'Impossible de charger la liste des villes.')); return { cities: [], abidjanCommunes: [], abidjan: 'Abidjan' }; }
  }

  // ===================================================================
  // Inscription en 3 étapes
  // ===================================================================
  async function initRegister() {
    const form = q('#rpRegisterForm');
    const places = await loadPlaces();
    const pf = profileForm(form, places, { vous: true });
    pf.fill({ teachingMode: MODES[0] });
    const NAMES = ['Identité et accès', 'Localisation et contacts', 'Profil pédagogique'];
    let step = 1;
    const prev = q('.rp-prev', form), next = q('.rp-next', form), finish = q('.rp-finish', form);

    function show(n, initial) {
      step = n;
      qa('[data-step]', form).forEach(fs => { fs.hidden = Number(fs.dataset.step) !== n; });
      qa('[data-step-dot]').forEach(li => {
        const k = Number(li.dataset.stepDot);
        li.classList.toggle('done', k < n); li.classList.toggle('current', k === n);
        if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      prev.hidden = n === 1; next.hidden = n === 3; finish.hidden = n !== 3;
      q('[data-step-live]').textContent = `Étape ${n} sur 3 : ${NAMES[n - 1]}`;
      if (initial) return;
      const first = q(`[data-step="${n}"] input:not([hidden]), [data-step="${n}"] select`, form);
      if (first) first.focus({ preventScroll: true });
      q('.rp-auth-card').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }

    function checkIdentity() {
      const el = form.elements;
      const mark = (f, m) => { f.setAttribute('aria-invalid', 'true'); f.focus(); f.addEventListener('input', () => f.removeAttribute('aria-invalid'), { once: true }); return m; };
      if (el.name.value.trim().length < 3) return mark(el.name, 'Indiquez votre nom complet.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.email.value.trim())) return mark(el.email, 'Indiquez une adresse e-mail valide.');
      if (el.password.value.length < 8) return mark(el.password, 'Choisissez un mot de passe d\'au moins 8 caractères.');
      if (el.password.value !== el.confirm.value) return mark(el.confirm, 'Les deux mots de passe ne sont pas identiques.');
      return '';
    }
    const checks = { 1: checkIdentity, 2: pf.checkContacts, 3: pf.checkPedagogy };

    next.addEventListener('click', () => { const err = checks[step](); if (err) { toast(err); return; } show(step + 1); });
    prev.addEventListener('click', () => show(step - 1));
    form.addEventListener('keydown', e => {
      if (e.key === 'Enter' && step < 3 && e.target.tagName === 'INPUT') { e.preventDefault(); next.click(); }
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      for (const n of [1, 2, 3]) { const err = checks[n](); if (err) { if (n !== step) show(n); toast(err); return; } }
      finish.disabled = true; finish.textContent = 'Création en cours…';
      try {
        const body = { ...pf.values(), email: form.elements.email.value.trim(), password: form.elements.password.value };
        const res = await api('/tutor/register', { method: 'POST', body: json(body) });
        toast('Bienvenue sur EduFun Répétiteurs ! 🎉');
        setTimeout(() => { location.href = (res && res.redirect) || '/repetiteur/espace'; }, 600);
      } catch (x) {
        toast(apiErrorMessage(x, "Impossible de créer votre espace. Réessayez dans un instant."));
        finish.disabled = false; finish.textContent = 'Créer mon espace';
      }
    });
    show(1, true);
    if (matchMedia('(min-width: 1001px)').matches) form.elements.name.focus();
  }

  // ===================================================================
  // Espace répétiteur
  // ===================================================================
  const TABS = {
    tableau: 'Tableau de bord', profil: 'Mon profil', visibilite: 'Visibilité',
    visiteurs: 'Visiteurs', messages: 'Messages', notifications: 'Notifications'
  };
  const S = { me: null, data: null, places: null, pf: null, visitors: null, threads: [], convo: null, pendingThread: null, notifs: null, method: '', tab: '' };

  async function initSpace() {
    const me = await currentUser();
    if (!me || !me.authenticated || me.role !== 'TUTOR') { location.replace('/repetiteur/connexion'); return; }
    S.me = me;
    q('[data-user-name]').textContent = me.fullName || me.name || 'Répétiteur';
    q('[data-user-email]').textContent = me.email || '';
    q('[data-user-initials]').textContent = initials(me.fullName || me.name);
    bindShell();

    const [places] = await Promise.all([loadPlaces(), loadMe()]);
    S.places = places;
    S.pf = profileForm(q('#rpProfileForm'), places);
    if (S.data) S.pf.fill(S.data.profile);
    bindProfile(); bindPayment(); bindMessages(); bindNotifications();
    q('#rpContent').removeAttribute('aria-busy');
    route();
    loadVisitors();
    refreshCounters();
    setInterval(() => { if (!document.hidden) refreshCounters(true); }, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshCounters(true); });
  }

  async function loadMe() {
    try { S.data = await api('/tutor/me'); }
    catch (e) {
      toast(apiErrorMessage(e, 'Impossible de charger ton espace. Réessaie dans un instant.'));
      q('[data-status]').innerHTML = emptyState('⚠️', 'Espace indisponible', 'Tes informations n\'ont pas pu être chargées. Recharge la page dans un instant.');
      return;
    }
    renderDashboard(); renderVisibility();
  }

  // ---------- Navigation par onglets ----------
  function bindShell() {
    const app = q('#rpSpace'), menu = q('[data-menu]');
    const setNav = open => { app.classList.toggle('nav-open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu'); };
    menu.addEventListener('click', () => setNav(!app.classList.contains('nav-open')));
    q('[data-scrim]').addEventListener('click', () => setNav(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && app.classList.contains('nav-open')) { setNav(false); menu.focus(); } });
    qa('.rp-side a').forEach(a => a.addEventListener('click', () => setNav(false)));
    addEventListener('hashchange', route);
  }

  function route() {
    let tab = (location.hash || '').replace('#', '');
    if (!TABS[tab]) tab = 'tableau';
    const changed = tab !== S.tab;
    S.tab = tab;
    qa('[data-tab]').forEach(s => { s.hidden = s.dataset.tab !== tab; });
    qa('[data-nav]').forEach(a => { if (a.dataset.nav === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    q('[data-title]').textContent = TABS[tab];
    document.title = `${TABS[tab]} — EduFun Répétiteurs`;
    if (changed) { scrollTo({ top: 0 }); }
    if (tab === 'visiteurs') loadVisitors();
    if (tab === 'messages') loadThreads(true);
    else if (changed) q('[data-inbox]').classList.remove('show-thread');
    if (tab === 'notifications') loadNotifications();
    if (tab === 'profil') renderPreview();
    // Données fraîches (statut de visibilité, vues, paiements) à chaque retour sur ces onglets.
    if (changed && (tab === 'tableau' || tab === 'visibilite'))
      api('/tutor/me').then(d => { S.data = d; renderDashboard(); if (typeof renderVisibility === 'function') renderVisibility(); }).catch(() => {});
  }

  function emptyState(icon, title, text, action = '') {
    return `<div class="rp-empty"><i aria-hidden="true">${icon}</i><b>${esc(title)}</b><p>${esc(text)}</p>${action}</div>`;
  }

  // ---------- Tableau de bord ----------
  function renderDashboard() {
    const d = S.data; if (!d) return;
    renderStatus(); renderKpis(); renderChart(); renderCompleteness();
  }

  function pendingPayment() { return (S.data.payments || []).find(p => p.status === 'PENDING'); }

  function renderStatus() {
    const l = S.data.listing || {}, st = l.listingStatus;
    const price = money(l.price || 5000), months = l.months || 3;
    const pending = pendingPayment();
    const pendingNote = pending ? `<span class="rp-status-note">⏳ Paiement du ${dateShort(pending.createdAt)} en vérification</span>` : '';
    let html;
    if (st === 'LISTED') {
      const left = Math.max(0, l.daysLeft || 0), pct = Math.min(100, Math.round(left / (months * 30) * 100));
      html = `<div class="rp-status">
        <div class="rp-status-copy">
          <span class="rp-status-pill"><i></i>Profil visible</span>
          <h2>Visible jusqu'au ${dateLong(l.listedUntil)}</h2>
          <p>Les parents de ta ville et de ta commune peuvent trouver ta fiche dans l'annuaire EduFun et t'écrire.${left <= 10 ? ' Pense à prolonger ta visibilité pour ne pas disparaître de l\'annuaire.' : ''}</p>
          <div class="rp-status-actions"><a class="btn light" href="#visibilite">Prolonger ma visibilité</a>${pendingNote}</div>
        </div>
        <div class="rp-dayring" style="--p:${pct}" role="img" aria-label="${left} jours restants"><div><b>${left}</b><span>jour${left > 1 ? 's' : ''} restant${left > 1 ? 's' : ''}</span></div></div>
        <span class="rp-flag" aria-hidden="true"></span></div>`;
    } else if (st === 'EXPIRED') {
      html = statusCard('expired', 'Visibilité expirée', 'Ta visibilité a pris fin', `Ta fiche n'apparaît plus dans l'annuaire depuis le ${dateLong(l.listedUntil)}. Renouvelle-la (${price} pour ${months} mois) et ton profil repasse en tête de l'annuaire.`, '⌛', `<a class="btn light" href="#visibilite">Renouveler ma visibilité</a>${pendingNote}`);
    } else if (st === 'SUSPENDED') {
      html = statusCard('blocked', 'Profil suspendu', 'Ton profil est suspendu', 'Ta fiche a été retirée temporairement de l\'annuaire par l\'équipe EduFun. Contacte le service client pour en connaître la raison et la réactiver.', '⏸️', '<a class="btn light" href="#notifications">Voir mes notifications</a>');
    } else if (st === 'REJECTED') {
      html = statusCard('blocked', 'Profil refusé', 'Ton profil n\'a pas été validé', 'L\'équipe EduFun n\'a pas pu valider ta fiche. Vérifie que tes informations sont exactes et complètes, puis contacte le service client.', '🚫', '<a class="btn light" href="#profil">Revoir mon profil</a>');
    } else {
      html = statusCard('unpaid', 'Profil non visible', 'Ton profil n\'est pas encore visible', `Active ta visibilité pour apparaître dans l'annuaire des parents : ${price} pour ${months} mois, avec mise en avant en tête de liste.`, '🚀', `<a class="btn light" href="#visibilite">Activer ma visibilité</a>${pendingNote}`);
    }
    q('[data-status]').innerHTML = html;
  }
  function statusCard(cls, pill, title, text, icon, actions) {
    return `<div class="rp-status ${cls}"><div class="rp-status-copy"><span class="rp-status-pill"><i></i>${esc(pill)}</span><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="rp-status-actions">${actions}</div></div><div class="rp-status-icon" aria-hidden="true">${icon}</div><span class="rp-flag" aria-hidden="true"></span></div>`;
  }

  function renderKpis() {
    const s = S.data.stats || {};
    const k = [
      ['👁️', s.views, 'Vues au total'], ['📅', s.views7, 'Vues sur 7 jours'], ['🗓️', s.views30, 'Vues sur 30 jours'],
      ['👥', s.visitors, 'Visiteurs uniques'], ['💬', s.unreadMessages, 'Messages non lus', s.unreadMessages > 0]
    ];
    q('[data-kpis]').innerHTML = k.map(([i, v, l, hot]) => `<div class="rp-kpi${hot ? ' hot' : ''}"><i aria-hidden="true">${i}</i><b>${F(v)}</b><span>${l}</span></div>`).join('');
  }

  function renderChart() {
    const days = S.data.viewsByDay || [];
    const max = Math.max(1, ...days.map(d => d.views || 0));
    const total = days.reduce((a, d) => a + (d.views || 0), 0);
    q('[data-chart-sum]').innerHTML = `<b>${F(total)}</b><span>vue${total > 1 ? 's' : ''}</span>`;
    if (!days.length) { q('[data-chart]').innerHTML = emptyState('📈', 'Pas encore de données', 'Les vues de ta fiche apparaîtront ici.'); return; }
    const last = days.length - 1;
    q('[data-chart]').innerHTML = `<div class="rp-chart" role="list" aria-label="Vues par jour sur 14 jours">${days.map((d, i) => {
      const v = d.views || 0, dt = toDate(d.day), label = dt ? dt.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : d.day;
      const h = v ? Math.max(4, Math.round(v / max * 100)) : 2;
      return `<div class="rp-bar${v ? '' : ' zero'}${i === last ? ' today' : ''}" role="listitem" tabindex="0" style="--h:${h}%;--i:${i}" aria-label="${esc(label)} : ${v} vue${v > 1 ? 's' : ''}"><i></i><em>${esc(label)} · <b>${v}</b></em></div>`;
    }).join('')}</div><div class="rp-chart-axis" aria-hidden="true"><span>${esc(dateShort(days[0].day))}</span><span>${esc(dateShort(days[Math.floor(last / 2)].day))}</span><span>Aujourd'hui</span></div>`;
  }

  function profileTips(p) {
    return [
      [!!(p.bio && p.bio.length >= 120), 'Rédige une présentation d\'au moins quelques lignes', 'pfBio'],
      [(p.experienceYears || 0) > 0, 'Indique tes années d\'expérience', 'pfExp'],
      [!!p.teachingMode, 'Précise ton mode de cours', 'pfMode'],
      [!!p.district, 'Ajoute ta commune ou ton quartier', 'pfCity'],
      [!!p.whatsapp, 'Ajoute ton numéro WhatsApp', 'pfWhatsapp'],
      [(p.hourlyRate || 0) > 0, 'Affiche un tarif indicatif par séance', 'pfRate']
    ];
  }

  function renderCompleteness() {
    const pct = Math.max(0, Math.min(100, (S.data.stats || {}).completeness || 0));
    const tips = profileTips(S.data.profile || {});
    const todo = tips.filter(t => !t[0]).slice(0, 4);
    const C = 2 * Math.PI * 46;
    q('[data-complete]').innerHTML = `<div class="rp-complete">
      <div class="rp-ring" role="img" aria-label="Profil complété à ${pct} %"><svg viewBox="0 0 112 112"><circle class="track" cx="56" cy="56" r="46"/><circle class="bar" cx="56" cy="56" r="46" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}"/></svg><b>${pct} %</b></div>
      <ul class="rp-tips">${todo.length ? todo.map(t => `<li><button type="button" data-goto-field="${t[2]}">${esc(t[1])}</button></li>`).join('') : '<li class="ok">Ton profil est complet, bravo !</li><li class="ok">Les parents disposent de toutes les informations utiles.</li>'}</ul></div>`;
    const bar = q('[data-complete] .bar');
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.strokeDashoffset = (C * (1 - pct / 100)).toFixed(1); }));
    qa('[data-goto-field]').forEach(b => b.addEventListener('click', () => {
      location.hash = '#profil';
      setTimeout(() => { const f = document.getElementById(b.dataset.gotoField); if (f) { f.scrollIntoView({ block: 'center' }); f.focus({ preventScroll: true }); } }, 80);
    }));
  }

  // ---------- Visiteurs ----------
  async function loadVisitors() {
    try { S.visitors = await api('/tutor/visitors'); }
    catch (e) { if (S.tab === 'visiteurs') toast(apiErrorMessage(e, 'Impossible de charger tes visiteurs.')); S.visitors = S.visitors || []; }
    renderVisitors();
  }

  function visitorRow(v) {
    const meta = [v.place ? `<span class="rp-tag">📍 ${esc(v.place)}</span>` : '', `<span class="rp-tag">🕒 ${esc(relative(v.lastVisit))}</span>`,
      `<span class="rp-tag brand">${F(v.visits)} visite${v.visits > 1 ? 's' : ''}</span>`, v.conversation ? '<span class="rp-tag ok">En conversation</span>' : ''].join('');
    return `<div class="rp-person"><span class="rp-avatar ${avatarClass(v.name)}" aria-hidden="true">${esc(initials(v.name))}</span>
      <div class="rp-person-copy"><b>${esc(v.name)}</b><small>${esc(v.label || '')}</small><div class="rp-person-meta">${meta}</div></div>
      <button type="button" class="btn ${v.conversation ? 'ghost' : 'primary'}" data-write="${esc(v.accountId)}">${v.conversation ? 'Voir la conversation' : 'Envoyer un message'}</button></div>`;
  }

  function renderVisitors() {
    const list = S.visitors || [];
    const none = emptyState('👀', 'Aucune visite pour le moment', S.data && S.data.listing && S.data.listing.listingStatus === 'LISTED'
      ? 'Les familles qui consultent ta fiche apparaîtront ici. Complète ton profil pour attirer davantage de visites.'
      : 'Active ta visibilité pour que les parents puissent découvrir ta fiche.', S.data && S.data.listing && S.data.listing.listingStatus !== 'LISTED' ? '<a class="btn primary" href="#visibilite">Activer ma visibilité</a>' : '');
    q('[data-recent-visitors]').innerHTML = list.length ? `<div class="rp-list">${list.slice(0, 3).map(visitorRow).join('')}</div>` : none;
    q('[data-visitors]').innerHTML = list.length ? `<div class="rp-list">${list.map(visitorRow).join('')}</div>` : none;
    q('[data-visitors-total]').textContent = list.length ? `${F(list.length)} famille${list.length > 1 ? 's' : ''}` : '';
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-write]'); if (!b) return;
    openConversation(Number(b.dataset.write));
  });

  // ---------- Mon profil ----------
  function bindProfile() {
    const form = q('#rpProfileForm');
    form.addEventListener('input', renderPreview);
    form.addEventListener('change', renderPreview);
    q('[data-profile-reset]').addEventListener('click', () => { if (S.data) { S.pf.fill(S.data.profile); renderPreview(); toast('Modifications annulées.'); } });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const err = S.pf.checkContacts() || S.pf.checkPedagogy();
      if (err) { toast(err); return; }
      const btn = q('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Enregistrement…';
      try {
        const p = await api('/tutor/me', { method: 'PUT', body: json(S.pf.values()) });
        toast('Profil enregistré ✅');
        if (S.data) {
          S.data = await api('/tutor/me').catch(() => ({ ...S.data, profile: p || S.data.profile }));
          renderDashboard(); renderVisibility();
        }
        const name = (S.data && S.data.profile && S.data.profile.name) || '';
        if (name) { q('[data-user-name]').textContent = name; q('[data-user-initials]').textContent = initials(name); }
      } catch (x) { toast(apiErrorMessage(x, "Impossible d'enregistrer ton profil.")); }
      finally { btn.disabled = false; btn.textContent = 'Enregistrer mon profil'; }
    });
  }

  function renderPreview() {
    if (!S.pf) return;
    const v = S.pf.values();
    const boosted = S.data && S.data.listing && S.data.listing.listingStatus === 'LISTED';
    const tags = [...splitList(v.specialties).slice(0, 4).map(s => `<span class="rp-tag brand">${esc(s)}</span>`), ...splitList(v.levels).slice(0, 3).map(s => `<span class="rp-tag">${esc(s)}</span>`)].join('');
    const place = [v.district, v.city].filter(Boolean).join(', ');
    q('[data-preview]').innerHTML = `<article class="rp-preview">
      ${boosted ? '<span class="rp-preview-boost">⭐ Mis en avant</span>' : ''}
      <div class="rp-preview-head"><span class="rp-avatar" aria-hidden="true">${esc(initials(v.name))}</span></div>
      <h3>${esc(v.name || 'Ton nom')}</h3>
      <div class="rp-preview-place">📍 ${esc(place || 'Ta ville')}${v.educationLevel ? ' · 🎓 ' + esc(v.educationLevel) : ''}</div>
      <div class="rp-person-meta">${tags || '<span class="rp-tag">Choisis tes matières</span>'}</div>
      <p>${esc(v.bio || 'Ta présentation apparaîtra ici : parcours, méthode, résultats obtenus avec tes élèves…')}</p>
      <div class="rp-preview-foot"><span>${v.experienceYears ? `${v.experienceYears} an${v.experienceYears > 1 ? 's' : ''} d'expérience` : 'Expérience non précisée'}<br>${esc(v.teachingMode || '')}</span>
        <span style="text-align:right">${v.hourlyRate ? `<b>${F(v.hourlyRate)} F</b><br>par séance` : 'Tarif sur demande'}</span></div>
    </article>`;
  }

  // ---------- Visibilité et paiement ----------
  function renderVisibility() {
    const d = S.data; if (!d) return;
    const l = d.listing || {};
    q('[data-price]').innerHTML = `${F(l.price || 5000)} <small>F CFA</small>`;
    q('[data-price-sub]').textContent = `par trimestre · ${l.months || 3} mois de visibilité`;
    const pending = pendingPayment();
    q('[data-vis-state]').innerHTML = l.listingStatus === 'LISTED'
      ? `<span class="rp-status-note">✅ Visible jusqu'au ${dateLong(l.listedUntil)}</span>`
      : pending ? '<span class="rp-status-note">⏳ Paiement en cours de vérification</span>'
      : '<span class="rp-status-note">Profil pas encore visible</span>';
    if (!S.method || !(d.methods || []).some(m => m.code === S.method)) S.method = (d.methods || [])[0]?.code || '';
    renderMethods(); renderHistory();
  }

  function renderMethods() {
    const d = S.data;
    q('[data-methods]').innerHTML = (d.methods || []).map(m => `<button type="button" class="rp-method" aria-pressed="${m.code === S.method}" data-method="${esc(m.code)}" style="--op:${OPERATORS[m.code] || '#5b3df5'}"><i aria-hidden="true"></i>${esc(m.label)}</button>`).join('')
      || '<p class="rp-hint">Aucun moyen de paiement disponible pour le moment.</p>';
    const l = d.listing || {}, op = (d.methods || []).find(m => m.code === S.method)?.label || 'Mobile Money', total = money(l.price || 5000);
    q('[data-instructions]').innerHTML = d.merchantNumber
      ? `Envoie <b>${total}</b> par <b>${esc(op)}</b> au <b class="rp-number">${esc(d.merchantNumber)}</b>${d.merchantName ? ` (${esc(d.merchantName)})` : ''}, puis recopie ci-dessous la référence reçue par SMS.`
      : `Montant à payer : <b>${total}</b> par <b>${esc(op)}</b>. Le numéro de paiement EduFun t'est communiqué par le service client ; recopie ensuite la référence reçue par SMS.`;
  }

  function renderHistory() {
    const list = S.data.payments || [];
    q('[data-history]').innerHTML = list.length ? `<div class="rp-history">${list.map(p => {
      const [label, cls] = PAY[p.status] || [p.status, ''];
      const method = (S.data.methods || []).find(m => m.code === p.method)?.label || p.method || '';
      return `<div class="rp-pay-row"><div><b>${p.months || 3} mois de visibilité · ${money(p.amount)}</b><small>${dateLong(p.createdAt)} · ${esc(method)}${p.reference ? ' · réf. ' + esc(p.reference) : ''}</small></div>
        <div class="rp-pay-row-end">${p.status === 'VALIDATED' && p.periodEnd ? `<small>visible jusqu'au ${dateLong(p.periodEnd)}</small>` : ''}${p.status === 'REJECTED' && p.note ? `<small>${esc(p.note)}</small>` : ''}<span class="rp-tag ${cls}">${esc(label)}</span></div></div>`;
    }).join('')}</div>` : emptyState('🧾', 'Aucun paiement pour le moment', 'Tes paiements de visibilité et leur statut apparaîtront ici.');
  }

  function bindPayment() {
    q('[data-methods]').addEventListener('click', e => {
      const b = e.target.closest('[data-method]'); if (!b) return;
      S.method = b.dataset.method; renderMethods();
      const again = q(`[data-method="${CSS.escape(S.method)}"]`); if (again) again.focus();
    });
    const form = q('#rpPayForm');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = q('[data-pay-submit]', form);
      if (!S.method) { toast('Choisis ton opérateur Mobile Money.'); return; }
      if (form.phone.value.replace(/\D/g, '').length < 8) { toast('Indique le numéro qui a effectué le paiement.'); form.phone.focus(); return; }
      if (form.reference.value.trim().length < 4) { toast('Recopie la référence de la transaction reçue par SMS.'); form.reference.focus(); return; }
      btn.disabled = true; btn.textContent = 'Envoi…';
      try {
        await api('/tutor/payments', { method: 'POST', body: json({ method: S.method, phone: form.phone.value.trim(), reference: form.reference.value.trim() }) });
        form.reset();
        toast('Paiement envoyé ✅ Il sera vérifié très vite.');
        S.data = await api('/tutor/me'); renderDashboard(); renderVisibility();
      } catch (x) { toast(apiErrorMessage(x, "Impossible d'envoyer le paiement.")); }
      finally { btn.disabled = false; btn.textContent = 'Envoyer pour vérification'; }
    });
  }

  // ---------- Messagerie ----------
  async function loadThreads(openPending) {
    try { S.threads = await api('/messages/threads') || []; }
    catch (e) { toast(apiErrorMessage(e, 'Impossible de charger tes conversations.')); S.threads = S.threads || []; }
    renderThreads();
    if (openPending && S.pendingThread) { const id = S.pendingThread; S.pendingThread = null; loadConversation(id); }
  }

  function renderThreads() {
    const box = q('[data-threads]'), cur = S.convo && S.convo.with && S.convo.with.accountId;
    if (!S.threads.length) {
      box.innerHTML = emptyState('📭', 'Aucune conversation', 'Écris aux familles qui ont consulté ta fiche depuis l\'onglet Visiteurs.', '<a class="btn ghost" href="#visiteurs">Voir mes visiteurs</a>');
      return;
    }
    box.innerHTML = S.threads.map(t => `<button type="button" class="rp-thread${t.unread ? ' unread' : ''}" data-thread="${esc(t.accountId)}" aria-current="${String(t.accountId) === String(cur)}">
      <span class="rp-avatar ${avatarClass(t.name)}" aria-hidden="true">${esc(initials(t.name))}</span>
      <span class="rp-thread-copy"><span class="rp-thread-top"><b>${esc(t.name)}</b><time>${esc(relative(t.lastAt))}</time></span>
      <span class="rp-thread-last"><span>${t.lastFromMe ? 'Toi : ' : ''}${esc(t.lastMessage || '')}</span>${t.unread ? `<span class="rp-count" aria-label="${t.unread} non lu${t.unread > 1 ? 's' : ''}">${t.unread}</span>` : ''}</span></span></button>`).join('');
  }

  function openConversation(accountId) {
    if (!accountId) return;
    if (S.tab === 'messages') { loadConversation(accountId); return; }
    S.pendingThread = accountId;
    location.hash = '#messages';
  }

  async function loadConversation(accountId, silent) {
    const box = q('[data-convo]');
    if (!silent) box.innerHTML = '<div class="rp-convo-empty"><div class="rp-skel" style="width:60%;height:60px"></div></div>';
    q('[data-inbox]').classList.add('show-thread');
    let c;
    try { c = await api('/messages/with/' + encodeURIComponent(accountId)); }
    catch (e) {
      if (!silent) { toast(apiErrorMessage(e, 'Impossible d\'ouvrir la conversation.')); box.innerHTML = '<div class="rp-convo-empty">' + emptyState('⚠️', 'Conversation indisponible', 'Réessaie dans un instant.') + '</div>'; }
      return;
    }
    const sameCount = silent && S.convo && S.convo.with && String(S.convo.with.accountId) === String(accountId) && S.convo.messages.length === c.messages.length;
    S.convo = c;
    if (sameCount) return;
    renderConversation(silent);
    renderThreads();
    // Les messages sont désormais lus : mise à jour des pastilles.
    const t = S.threads.find(x => String(x.accountId) === String(accountId));
    if (t && t.unread) { t.unread = 0; renderThreads(); refreshCounters(); }
  }

  function renderConversation(keepDraft) {
    const c = S.convo, w = c.with || {}, box = q('[data-convo]');
    const draft = keepDraft ? (q('[data-composer] textarea')?.value || '') : '';
    let lastDay = '';
    const msgs = (c.messages || []).map(m => {
      const d = toDate(m.at), key = d ? d.toDateString() : '';
      const sep = key && key !== lastDay ? `<div class="rp-day">${esc(dayLabel(d))}</div>` : '';
      lastDay = key;
      return `${sep}<div class="rp-bubble${m.mine ? ' mine' : ''}">${esc(m.body)}<time datetime="${esc(d ? d.toISOString() : '')}">${esc(timeHM(m.at))}</time></div>`;
    }).join('');
    box.innerHTML = `<div class="rp-convo-head">
        <button type="button" class="rp-convo-back" data-convo-back aria-label="Retour aux conversations">←</button>
        <span class="rp-avatar ${avatarClass(w.name)}" aria-hidden="true">${esc(initials(w.name))}</span>
        <div><b>${esc(w.name || 'Famille')}</b><small>${esc(w.label || '')}</small></div></div>
      <div class="rp-msgs" data-msgs role="log" aria-live="polite" aria-label="Messages avec ${esc(w.name || 'cette famille')}">${msgs || emptyState('👋', 'Lance la conversation', `Présente-toi à ${w.name || 'cette famille'} et propose une première séance.`)}</div>
      ${c.canWrite ? `<form class="rp-composer" data-composer><label class="rp-sr" for="rpMsgInput">Ton message</label>
        <textarea id="rpMsgInput" rows="1" maxlength="2000" placeholder="Écris ton message… (Entrée pour envoyer, Maj+Entrée pour aller à la ligne)"></textarea>
        <button class="btn primary" type="submit">Envoyer</button></form>`
        : `<div class="rp-locked" role="note">🔒 <span>Tu ne peux pas écrire à ce compte pour le moment. Un répétiteur peut écrire uniquement aux familles qui ont consulté sa fiche ou qui lui ont déjà écrit.</span></div>`}`;
    const list = q('[data-msgs]', box); list.scrollTop = list.scrollHeight;
    const ta = q('[data-composer] textarea', box);
    if (ta) { ta.value = draft; autoGrow(ta); if (!keepDraft && matchMedia('(min-width: 901px)').matches) ta.focus(); }
  }

  function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(140, ta.scrollHeight) + 'px'; }

  function bindMessages() {
    const inbox = q('[data-inbox]');
    inbox.addEventListener('click', e => {
      const t = e.target.closest('[data-thread]');
      if (t) { loadConversation(Number(t.dataset.thread)); return; }
      if (e.target.closest('[data-convo-back]')) { inbox.classList.remove('show-thread'); S.convo = null; renderThreads(); }
    });
    inbox.addEventListener('input', e => { if (e.target.matches('[data-composer] textarea')) autoGrow(e.target); });
    inbox.addEventListener('keydown', e => {
      if (e.target.matches('[data-composer] textarea') && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); e.target.form.requestSubmit(); }
    });
    inbox.addEventListener('submit', async e => {
      if (!e.target.matches('[data-composer]')) return;
      e.preventDefault();
      const form = e.target, ta = q('textarea', form), btn = q('button', form), body = ta.value.trim();
      if (!body || !S.convo) return;
      const to = S.convo.with.accountId;
      btn.disabled = true; ta.disabled = true;
      try {
        await api('/messages', { method: 'POST', body: json({ toAccountId: to, body }) });
        ta.value = '';
        await loadConversation(to, true);
        loadThreads(false);
        if (S.visitors) { const v = S.visitors.find(x => String(x.accountId) === String(to)); if (v && !v.conversation) { v.conversation = true; renderVisitors(); } }
      } catch (x) { toast(apiErrorMessage(x, "Impossible d'envoyer ton message.")); }
      finally { btn.disabled = false; ta.disabled = false; const t2 = q('[data-composer] textarea'); if (t2) t2.focus(); }
    });
  }

  // ---------- Notifications et compteurs ----------
  function setCount(name, n) {
    qa(`[data-count="${name}"]`).forEach(el => {
      el.hidden = !n; el.textContent = n > 99 ? '99+' : String(n || '');
      el.setAttribute('aria-label', `${n} non lu${n > 1 ? 's' : ''}`);
    });
  }

  async function refreshCounters(background) {
    let n;
    try { n = await api('/notifications'); }
    catch (e) { if (!background) toast(apiErrorMessage(e, 'Impossible de mettre à jour les notifications.')); return; }
    const before = S.notifs;
    S.notifs = n;
    setCount('messages', n.unreadMessages || 0);
    setCount('notifications', n.unread || 0);
    if (S.data && S.data.stats && S.data.stats.unreadMessages !== n.unreadMessages) { S.data.stats.unreadMessages = n.unreadMessages || 0; renderKpis(); }
    if (!background) return;
    if (S.tab === 'notifications') renderNotifications();
    if (S.tab === 'messages') {
      loadThreads(false);
      if (S.convo && S.convo.with && q('[data-inbox]').classList.contains('show-thread')) loadConversation(S.convo.with.accountId, true);
    }
    // Nouvelle visite : rafraîchit la liste des visiteurs et les statistiques.
    const visits = items => (items || []).filter(i => i.kind === 'VISIT').length;
    if (before && visits(n.items) > visits(before.items)) { loadVisitors(); api('/tutor/me').then(d => { S.data = d; renderDashboard(); }).catch(() => {}); }
  }

  async function loadNotifications() {
    if (!S.notifs) q('[data-notifs]').innerHTML = '<div class="rp-skel" style="height:72px"></div><div class="rp-skel" style="height:72px"></div>';
    try { S.notifs = await api('/notifications'); }
    catch (e) { toast(apiErrorMessage(e, 'Impossible de charger tes notifications.')); return; }
    setCount('messages', S.notifs.unreadMessages || 0); setCount('notifications', S.notifs.unread || 0);
    renderNotifications();
  }

  function renderNotifications() {
    const items = (S.notifs && S.notifs.items) || [];
    const unread = (S.notifs && S.notifs.unread) || 0;
    q('[data-notifs-sub]').textContent = unread ? `${F(unread)} notification${unread > 1 ? 's' : ''} non lue${unread > 1 ? 's' : ''}` : 'Tout est à jour';
    q('[data-read-all]').disabled = !unread;
    q('[data-notifs]').innerHTML = items.length ? items.map(i => {
      const link = i.link || '';
      const inner = `<span class="rp-notif-ico k-${esc(i.kind)}" aria-hidden="true">${KIND_ICON[i.kind] || '🔔'}</span>
        <span class="rp-notif-copy"><b>${esc(i.title)}</b>${i.body ? `<p>${esc(i.body)}</p>` : ''}</span>
        <time datetime="${esc(i.at || '')}">${esc(relative(i.at))}</time>${i.read ? '' : '<span class="rp-dot" aria-label="Non lue"></span>'}`;
      return link ? `<a class="rp-notif${i.read ? '' : ' unread'}" href="${esc(localLink(link))}">${inner}</a>` : `<div class="rp-notif${i.read ? '' : ' unread'}">${inner}</div>`;
    }).join('') : emptyState('🔔', 'Aucune notification', 'Tu seras prévenu ici à chaque visite de ta fiche, à chaque message et à chaque étape de ton paiement.');
  }

  // Un lien vers l'espace répétiteur devient un simple changement d'onglet.
  function localLink(link) {
    const m = String(link).match(/^\/repetiteur\/espace(#[a-z]+)?$/);
    if (m) return m[1] || '#tableau';
    return /^\/(?!\/)/.test(link) || link.startsWith('#') ? link : '#notifications';
  }

  function bindNotifications() {
    q('[data-read-all]').addEventListener('click', async e => {
      const btn = e.currentTarget; btn.disabled = true;
      try {
        await api('/notifications/read', { method: 'POST' });
        if (S.notifs) { S.notifs.items = (S.notifs.items || []).map(i => ({ ...i, read: true })); S.notifs.unread = 0; }
        setCount('notifications', 0); renderNotifications();
        toast('Toutes les notifications sont marquées comme lues.');
      } catch (x) { toast(apiErrorMessage(x, 'Impossible de mettre à jour tes notifications.')); btn.disabled = false; }
    });
  }

  // ===================================================================
  document.addEventListener('DOMContentLoaded', () => {
    bindPasswordToggles();
    if (q('#rpRegister')) initRegister();
    if (q('#rpSpace')) initSpace();
  });
})();
