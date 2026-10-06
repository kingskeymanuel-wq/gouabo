/* EduFun — console d'administration (paiements, élèves, répétiteurs, corrections, contenus, paramètres). */
(function () {
  const $d = s => document.querySelector(s);
  const F = n => Number(n || 0).toLocaleString('fr-FR');
  const dFr = d => d ? new Date(String(d).length === 10 ? d + 'T00:00:00' : d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const SUB = { ACTIVE: ['Abonné', 'ok'], TRIAL: ['Essai', 'trial'], EXPIRED: ['Impayé', 'off'] };
  const PAY = { PENDING: ['En attente', 'wait'], VALIDATED: ['Validé', 'ok'], REJECTED: ['Refusé', 'off'] };
  const TITLES = { paiements: 'Paiements', eleves: 'Élèves', repetiteurs: 'Répétiteurs', examens: 'Corrections', contenus: 'Contenus', parametres: 'Paramètres' };
  const state = { billing: null, payFilter: '', studentFilter: '', search: '' };

  async function init() {
    const me = await currentUser();
    if (!me.authenticated || me.role !== 'ADMIN') { location.href = '/login'; return; }
    $d('[data-ad-date]').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $d('[data-ad-tabs]').addEventListener('click', e => { const a = e.target.closest('[data-tab]'); if (!a) return; e.preventDefault(); show(a.dataset.tab); });
    $d('[data-ad-refresh]').onclick = () => refresh();
    bindForms();
    show((location.hash || '#paiements').slice(1));
    refresh();
  }

  function show(tab) {
    if (!TITLES[tab]) tab = 'paiements';
    document.querySelectorAll('.ad-view').forEach(v => v.hidden = v.dataset.view !== tab);
    document.querySelectorAll('[data-tab]').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
    $d('[data-ad-title]').textContent = TITLES[tab];
    history.replaceState({}, '', '#' + tab);
    document.querySelector('.sidebar')?.classList.remove('open');
  }

  async function refresh() {
    await Promise.allSettled([loadBilling(), loadTutors(), loadExams(), loadContent()]);
  }

  // ---------------- Paiements ----------------
  async function loadBilling() {
    try { state.billing = await api('/admin/billing'); } catch (e) { toast('Impossible de charger les paiements'); return; }
    const b = state.billing;
    $d('[data-kpis]').innerHTML = [
      ['💰', 'Recettes du mois', F(b.monthRevenue) + ' F', 'F CFA validés ce mois-ci'],
      ['✅', 'Abonnés actifs', F(b.active), `${F(b.expiringSoon)} à renouveler sous 7 jours`],
      ['🎁', 'En essai gratuit', F(b.trial), 'Comptes en découverte'],
      ['⏳', 'Paiements à vérifier', F(b.pending), b.pending ? 'Action requise' : 'Tout est à jour', b.pending ? 'alert' : ''],
      ['🔒', 'Impayés', F(b.expired), 'Accès suspendu']
    ].map(([i, l, v, s, c]) => `<div class="ad-kpi ${c || ''}"><span class="ad-kpi-i">${i}</span><small>${l}</small><b>${v}</b><span>${s}</span></div>`).join('');
    $d('[data-total]').textContent = F(b.totalRevenue) + ' F CFA au total';
    $d('[data-plans]').innerHTML = b.plans.map(p => `<div class="ad-plan"><div><b>${esc(p.cycle)}</b><small>${esc(p.classes)}</small></div><span>${F(p.price)} F</span></div>`).join('');
    renderChart(b.revenueByMonth);
    renderPending(); renderPayments(); renderStudents();
    $d('[data-student-select]').innerHTML = '<option value="">Choisir…</option>' + b.students.map(s => `<option value="${s.id}">${esc(s.name)} — ${esc(s.level)} (${F(s.monthlyPrice)} F/mois)</option>`).join('');
  }

  function renderChart(rows) {
    const box = $d('[data-chart]'), max = Math.max(0, ...rows.map(r => r.amount));
    // Échelle « ronde » ; sans recette, on garde une échelle de référence de 50 000 F.
    const nice = max ? Math.pow(10, Math.floor(Math.log10(max))) : 10000, top = max ? Math.ceil(max / nice) * nice : 50000;
    box.innerHTML = `<div class="ad-chart-grid">${[1, .5, 0].map(f => `<div><span>${F(Math.round(top * f))}</span></div>`).join('')}</div>
      <div class="ad-bars">${rows.map((r, i) => {
        const [y, m] = r.month.split('-').map(Number), last = i === rows.length - 1;
        return `<div class="ad-bar-col" data-tipv="${MONTHS[m - 1]} ${y} : ${F(r.amount)} F CFA">
          ${last ? `<em>${F(r.amount)}</em>` : ''}<div class="ad-bar ${last ? 'now' : ''}" style="--h:${(r.amount / top * 100).toFixed(1)}%"></div><small>${MONTHS[m - 1]}</small></div>`;
      }).join('')}</div>${max ? '' : '<p class="ad-chart-empty">Les recettes apparaîtront ici dès le premier paiement validé.</p>'}`;
    const tip = $d('[data-tip]');
    box.onmousemove = e => { const c = e.target.closest('[data-tipv]'); if (!c) { tip.hidden = true; return; } tip.hidden = false; tip.textContent = c.dataset.tipv; tip.style.left = e.clientX + 14 + 'px'; tip.style.top = e.clientY - 34 + 'px'; };
    box.onmouseleave = () => { tip.hidden = true; };
  }

  function renderPending() {
    const list = state.billing.payments.filter(p => p.status === 'PENDING');
    $d('[data-pending]').innerHTML = list.length ? `<div class="ad-pending">${list.map(p => `<div class="ad-pend">
      <div class="ad-pend-who"><b>${esc(p.student)}</b><small>${esc(p.email)} · ${esc(p.level)}</small></div>
      <div class="ad-pend-what"><b>${F(p.amount)} F CFA</b><small>${p.months} mois · ${esc(p.method)}</small></div>
      <div class="ad-pend-ref"><code>${esc(p.reference)}</code><small>du ${esc(p.phone || '—')} · ${dFr(p.createdAt)}</small></div>
      <div class="ad-pend-act"><button class="btn success" data-validate="${p.id}">Valider</button><button class="btn danger" data-reject="${p.id}">Refuser</button></div></div>`).join('')}</div>`
      : '<p class="ad-empty">✨ Aucun paiement en attente.</p>';
  }

  function renderPayments() {
    const list = state.billing.payments.filter(p => !state.payFilter || p.status === state.payFilter);
    $d('[data-payments]').innerHTML = list.map(p => {
      const [l, c] = PAY[p.status] || [p.status, ''];
      return `<tr><td>${dFr(p.createdAt)}</td><td><b>${esc(p.student)}</b></td><td>${esc(p.level)}</td><td>${p.months} mois</td><td class="num">${F(p.amount)} F</td><td>${esc(p.method)}</td><td><code>${esc(p.reference)}</code></td><td><span class="ad-tag ${c}">${l}</span>${p.status === 'REJECTED' && p.note ? `<small class="ad-note">${esc(p.note)}</small>` : ''}</td></tr>`;
    }).join('') || '<tr><td colspan="8" class="ad-empty">Aucun paiement.</td></tr>';
  }

  // ---------------- Élèves ----------------
  function renderStudents() {
    const q = state.search.toLowerCase();
    const list = state.billing.students.filter(s => (!state.studentFilter || s.status === state.studentFilter)
      && (!q || `${s.name} ${s.email} ${s.level}`.toLowerCase().includes(q)));
    $d('[data-students]').innerHTML = list.map(s => {
      const [l, c] = SUB[s.status] || [s.status, ''];
      return `<tr><td><div class="ad-who"><span class="ad-avatar">${esc(initials(s.name))}</span><div><b>${esc(s.name)}</b><small>${esc(s.email)}</small></div></div></td>
        <td>${esc(s.level)}</td><td class="num">${F(s.monthlyPrice)} F</td><td><span class="ad-tag ${c}">${l}</span></td>
        <td>${s.accessUntil ? dFr(s.accessUntil) : '—'}${s.status !== 'EXPIRED' ? `<small class="ad-note">${s.daysLeft} j restants</small>` : ''}</td>
        <td class="num">${F(s.xp)}</td><td class="ad-row-act"><button class="btn ghost" data-pay-for="${s.id}">Encaisser</button></td></tr>`;
    }).join('') || '<tr><td colspan="7" class="ad-empty">Aucun élève.</td></tr>';
  }

  // ---------------- Répétiteurs, corrections, contenus ----------------
  async function loadTutors() {
    const list = await api('/tutors').catch(() => []);
    $d('[data-tutors]').innerHTML = list.length ? `<div class="ad-cards">${list.map(t => `<div class="ad-card">
      <div class="ad-who"><span class="ad-avatar">${esc(initials(t.name))}</span><div><b>${esc(t.name)}</b><small>${esc(t.email || '')}</small></div></div>
      <p>${esc(t.specialties || '')}${t.levels ? ' · ' + esc(t.levels) : ''}</p>
      <div class="ad-card-foot"><span class="ad-tag ${t.status === 'APPROVED' ? 'ok' : t.status === 'REJECTED' ? 'off' : 'wait'}">${t.status === 'APPROVED' ? 'Validé' : t.status === 'REJECTED' ? 'Refusé' : 'En attente'}</span>
      ${t.status === 'PENDING' ? `<span><button class="btn success" data-tutor-ok="${t.id}">Valider</button> <button class="btn danger" data-tutor-no="${t.id}">Refuser</button></span>` : ''}</div></div>`).join('')}</div>`
      : '<p class="ad-empty">Aucune candidature pour le moment.</p>';
  }

  async function loadExams() {
    const list = (await api('/exams').catch(() => [])).filter(x => x.status === 'PENDING_REVIEW');
    $d('[data-exams]').innerHTML = list.length ? `<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>N°</th><th>Examen</th><th>Classe</th><th>Matière</th><th class="num">Points</th><th></th></tr></thead><tbody>${list.map(x =>
      `<tr><td>#${x.id}</td><td>${esc(x.examType)}</td><td>${esc(x.level)}</td><td>${esc(x.subject || '')}</td><td class="num">sur ${x.total}</td><td class="ad-row-act"><button class="btn primary" data-review="${x.id}" data-total="${x.total}">Noter</button></td></tr>`).join('')}</tbody></table></div>`
      : '<p class="ad-empty">✨ Aucune copie à corriger.</p>';
  }

  async function loadContent() {
    const [cat, d] = await Promise.all([api('/catalog').catch(() => []), api('/dashboard').catch(() => ({}))]);
    $d('[data-content-kpis]').innerHTML = [['📚', 'Leçons publiées', F(cat.reduce((n, c) => n + c.lessons, 0))], ['🏫', 'Classes', F(cat.length)], ['🎬', 'Vidéos ajoutées', F(d.videos)], ['🧠', 'Quiz', F(d.quizzes)]]
      .map(([i, l, v]) => `<div class="ad-kpi"><span class="ad-kpi-i">${i}</span><small>${l}</small><b>${v}</b></div>`).join('');
    const cycles = [...new Set(cat.map(c => c.cycle))];
    $d('[data-catalog]').innerHTML = cycles.map(cy => `<div class="ad-cycle"><h3>${esc(cy)}</h3><div class="ad-levels">${cat.filter(c => c.cycle === cy)
      .map(c => `<a class="ad-level" href="/programme?level=${encodeURIComponent(c.level)}" target="_blank" rel="noopener"><b>${esc(c.level)}</b><small>${F(c.lessons)} leçons · ${c.subjects.length} matières</small></a>`).join('')}</div></div>`).join('');
  }

  // ---------------- Actions ----------------
  function bindForms() {
    document.addEventListener('click', async e => {
      const t = e.target.closest('button'); if (!t) return;
      try {
        if (t.dataset.validate) { if (!confirm('Valider ce paiement ? L\'accès de l\'élève sera prolongé.')) return; await api(`/admin/payments/${t.dataset.validate}/validate`, { method: 'POST' }); toast('Paiement validé ✅'); loadBilling(); }
        else if (t.dataset.reject) { const note = prompt('Motif du refus (visible par l\'élève) :', 'Transaction introuvable'); if (note === null) return; await api(`/admin/payments/${t.dataset.reject}/reject`, { method: 'POST', body: JSON.stringify({ note }) }); toast('Paiement refusé'); loadBilling(); }
        else if (t.dataset.payFor) { show('paiements'); $d('[data-student-select]').value = t.dataset.payFor; $d('[data-record]').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        else if (t.dataset.tutorOk || t.dataset.tutorNo) { await api(`/tutors/${t.dataset.tutorOk || t.dataset.tutorNo}/${t.dataset.tutorOk ? 'approve' : 'reject'}`, { method: 'PATCH' }); toast(t.dataset.tutorOk ? 'Répétiteur validé ✅' : 'Candidature refusée'); loadTutors(); }
        else if (t.dataset.review) { const n = prompt(`Note obtenue (sur ${t.dataset.total}) :`); if (n === null || n === '' || isNaN(n)) return; await api(`/exams/${t.dataset.review}/review?score=${Number(n)}`, { method: 'PATCH' }); toast('Copie notée ✅'); loadExams(); }
        else if (t.closest('[data-pay-filter]') && 'f' in t.dataset) { state.payFilter = t.dataset.f; pressed(t); renderPayments(); }
        else if (t.closest('[data-student-filter]') && 'f' in t.dataset) { state.studentFilter = t.dataset.f; pressed(t); renderStudents(); }
      } catch (x) { toast(apiErrorMessage(x, 'Action impossible')); }
    });
    $d('[data-student-search]').oninput = e => { state.search = e.target.value; renderStudents(); };
    $d('[data-record]').onsubmit = async e => {
      e.preventDefault(); const f = e.target;
      if (!f.studentId.value) { toast('Choisis un élève.'); return; }
      try { await api('/admin/payments', { method: 'POST', body: JSON.stringify({ studentId: Number(f.studentId.value), months: Number(f.months.value), method: f.method.value, reference: f.reference.value }) }); f.reset(); toast('Paiement enregistré, accès prolongé ✅'); loadBilling(); }
      catch (x) { toast(apiErrorMessage(x, 'Enregistrement impossible')); }
    };
    $d('[data-video]').onsubmit = async e => {
      e.preventDefault(); const f = e.target;
      try { await api('/videos', { method: 'POST', body: JSON.stringify({ lessonId: Number(f.lessonId.value), title: f.title.value, url: f.url.value, type: 'VIDEO', published: true }) }); f.reset(); toast('Vidéo ajoutée 🎬'); loadContent(); }
      catch (x) { toast(apiErrorMessage(x, 'Ajout impossible')); }
    };
    $d('[data-password]').onsubmit = async e => {
      e.preventDefault(); const f = e.target;
      if (f.newPassword.value !== f.confirm.value) { toast('Les deux mots de passe ne sont pas identiques.'); return; }
      try { await api('/auth/password', { method: 'POST', body: JSON.stringify({ currentPassword: f.currentPassword.value, newPassword: f.newPassword.value }) }); f.reset(); toast('Mot de passe modifié 🔒'); }
      catch (x) { toast(apiErrorMessage(x, 'Changement impossible')); }
    };
  }
  const pressed = b => b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));

  document.addEventListener('DOMContentLoaded', () => { if (document.querySelector('.ad-main')) init(); });
})();
