/* EduFun — page « Mon abonnement » : statut, formules, paiement Mobile Money, historique. */
(function () {
  const $a = s => document.querySelector(s);
  const F = n => Number(n || 0).toLocaleString('fr-FR');
  const dateFr = d => d ? new Date(d + (String(d).length === 10 ? 'T00:00:00' : '')).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const STATUS = {
    ACTIVE: { label: 'Abonnement actif', icon: '✅', cls: 'ok' },
    TRIAL: { label: 'Essai gratuit', icon: '🎁', cls: 'trial' },
    EXPIRED: { label: 'Accès suspendu', icon: '🔒', cls: 'off' }
  };
  const PAY = { PENDING: ['En vérification', 'wait'], VALIDATED: ['Validé', 'ok'], REJECTED: ['Refusé', 'off'] };
  const DURATION = { 1: '1 mois', 3: '3 mois', 9: 'Année scolaire (9 mois)' };
  const OPERATORS = { ORANGE_MONEY: '#ff7900', MTN_MOMO: '#ffcb05', MOOV_MONEY: '#0066b3', WAVE: '#1dc8f2' };
  const state = { data: null, months: 1, method: '' };

  async function load() {
    const me = await currentUser();
    if (!me.authenticated) { location.href = '/login'; return; }
    if (!me.studentId) { location.href = me.role === 'ADMIN' ? '/administration' : '/login'; return; }
    try { state.data = await api('/billing/me'); }
    catch (e) { $a('[data-status]').innerHTML = '<div class="cu-empty"><b>Abonnement indisponible</b>Réessaie dans un instant.</div>'; return; }
    $a('#subscriptionPage').removeAttribute('aria-busy');
    state.method = state.data.methods[0]?.code || '';
    renderStatus(); renderPlans(); renderDurations(); renderMethods(); renderHistory();
    $a('#payForm').onsubmit = submit;
  }

  function renderStatus() {
    const d = state.data, st = STATUS[d.status] || STATUS.EXPIRED;
    const total = d.status === 'TRIAL' ? 7 : 30, left = Math.max(0, d.daysLeft || 0);
    const pct = d.status === 'EXPIRED' ? 0 : Math.min(100, Math.round(left / Math.max(total, left) * 100));
    const line = d.status === 'ACTIVE' ? `Ton accès est ouvert jusqu'au <b>${dateFr(d.accessUntil)}</b>.`
      : d.status === 'TRIAL' ? `Profite de tout EduFun gratuitement jusqu'au <b>${dateFr(d.accessUntil)}</b>.`
      : `Renouvelle ton abonnement pour retrouver toutes tes leçons et ta progression.`;
    $a('[data-status]').innerHTML = `<div class="ab-hero ${st.cls}">
      <div class="ab-hero-copy">
        <span class="ab-pill">${st.icon} ${st.label}</span>
        <h2>${d.status === 'EXPIRED' ? 'Reprends ton apprentissage' : d.status === 'TRIAL' ? 'Bienvenue sur EduFun' : 'Merci pour ta confiance'}</h2>
        <p>${line}</p>
        <div class="ab-hero-meta"><span>Classe : <b>${esc(d.level)}</b></span><span>Formule ${esc(d.cycle)} : <b>${F(d.monthlyPrice)} F CFA / mois</b></span></div>
        ${d.status !== 'ACTIVE' ? '<a class="btn light" href="#payer">S\'abonner maintenant</a>' : '<a class="btn light" href="#payer">Prolonger mon abonnement</a>'}
      </div>
      <div class="ab-ring" style="--p:${pct}"><div><b>${d.status === 'EXPIRED' ? '0' : left}</b><span>jour${left > 1 ? 's' : ''} restant${left > 1 ? 's' : ''}</span></div></div>
    </div>`;
  }

  function renderPlans() {
    const d = state.data, mineCycle = d.cycle === 'Lycée technique' ? 'Lycée' : d.cycle;
    const icons = { Primaire: '🎒', 'Collège': '📘', 'Lycée': '🎓' };
    $a('[data-plans]').innerHTML = d.plans.map(p => `<article class="ab-plan ${p.cycle === mineCycle ? 'mine' : ''}">
      ${p.cycle === mineCycle ? '<span class="ab-plan-flag">Ta formule</span>' : ''}
      <div class="ab-plan-icon">${icons[p.cycle] || '📚'}</div>
      <h3>${esc(p.cycle)}</h3><p class="ab-plan-classes">${esc(p.classes)}</p>
      <div class="ab-price"><b>${F(p.price)}</b><span>F CFA<br>par mois</span></div>
      <ul><li>Toutes les leçons du programme officiel</li><li>Professeur virtuel pour chaque matière</li><li>Évaluations, quiz et badges</li><li>Prépa examens avec sujets corrigés</li></ul>
    </article>`).join('');
  }

  function renderDurations() {
    const d = state.data;
    $a('[data-durations]').innerHTML = d.durations.map(m => `<button type="button" class="ab-choice" aria-pressed="${m === state.months}" data-months="${m}">
      <b>${DURATION[m] || m + ' mois'}</b><span>${F(m * d.monthlyPrice)} F CFA</span></button>`).join('');
    $a('[data-durations]').onclick = e => { const b = e.target.closest('[data-months]'); if (!b) return; state.months = Number(b.dataset.months); renderDurations(); renderInstructions(); };
  }

  function renderMethods() {
    $a('[data-methods]').innerHTML = state.data.methods.map(m => `<button type="button" class="ab-method" aria-pressed="${m.code === state.method}" data-method="${m.code}" style="--op:${OPERATORS[m.code] || '#5b3df5'}">
      <i></i>${esc(m.label)}</button>`).join('');
    $a('[data-methods]').onclick = e => { const b = e.target.closest('[data-method]'); if (!b) return; state.method = b.dataset.method; renderMethods(); renderInstructions(); };
    renderInstructions();
  }

  function renderInstructions() {
    const d = state.data, total = state.months * d.monthlyPrice, op = d.methods.find(m => m.code === state.method)?.label || '';
    $a('[data-instructions]').innerHTML = d.merchantNumber
      ? `Envoie <b>${F(total)} F CFA</b> par <b>${esc(op)}</b> au <b class="ab-number">${esc(d.merchantNumber)}</b> (${esc(d.merchantName)}), puis recopie ci-dessous la référence reçue par SMS.`
      : `Montant à payer : <b>${F(total)} F CFA</b> par <b>${esc(op)}</b>. Le numéro de paiement EduFun t'est communiqué par ton établissement ou par le service client ; recopie ensuite la référence reçue par SMS.`;
  }

  function renderHistory() {
    const list = state.data.payments || [];
    $a('[data-history]').innerHTML = list.length ? `<div class="ab-rows">${list.map(p => {
      const [label, cls] = PAY[p.status] || [p.status, ''];
      return `<div class="ab-row"><div><b>${DURATION[p.months] || p.months + ' mois'} · ${F(p.amount)} F CFA</b><small>${new Date(p.createdAt).toLocaleDateString('fr-FR')} · réf. ${esc(p.reference)}</small></div>
        <div class="ab-row-end">${p.status === 'VALIDATED' && p.periodEnd ? `<small>jusqu'au ${dateFr(p.periodEnd)}</small>` : ''}${p.status === 'REJECTED' && p.note ? `<small>${esc(p.note)}</small>` : ''}<span class="ab-tag ${cls}">${label}</span></div></div>`;
    }).join('')}</div>` : '<p class="ab-empty">Aucun paiement pour le moment.</p>';
  }

  async function submit(e) {
    e.preventDefault();
    const f = e.target, btn = f.querySelector('.ab-submit');
    if (!state.method) { toast('Choisis ton opérateur Mobile Money.'); return; }
    if (f.phone.value.replace(/\D/g, '').length < 8) { toast('Indique le numéro qui a effectué le paiement.'); f.phone.focus(); return; }
    if (f.reference.value.trim().length < 4) { toast('Recopie la référence de la transaction reçue par SMS.'); f.reference.focus(); return; }
    btn.disabled = true;
    try {
      await api('/billing/payments', { method: 'POST', body: JSON.stringify({ months: state.months, method: state.method, phone: f.phone.value, reference: f.reference.value }) });
      f.reset(); toast('Paiement envoyé ✅ Il sera vérifié très vite.');
      state.data = await api('/billing/me'); renderHistory();
    } catch (x) { toast(apiErrorMessage(x, "Impossible d'envoyer le paiement.")); }
    finally { btn.disabled = false; }
  }

  document.addEventListener('DOMContentLoaded', () => { if ($a('#subscriptionPage')) load(); });
})();
