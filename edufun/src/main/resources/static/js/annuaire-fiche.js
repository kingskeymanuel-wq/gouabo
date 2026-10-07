/* ===========================================================
   EduFun — Portail familles : fiche d'un répétiteur (/repetiteurs/fiche/{id})
   Coordonnées réservées aux familles connectées ; aperçu public flouté sinon.
=========================================================== */
(function () {
  'use strict';

  const BACK = `<a class="an-back" href="/repetiteurs" data-back>${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'}Retour à la recherche</a>`;

  function tutorId() {
    const parts = location.pathname.replace(/\/+$/, '').split('/');
    return decodeURIComponent(parts[parts.length - 1] || '');
  }

  /** Numéro WhatsApp : chiffres seulement, préfixe 225 pour un numéro ivoirien à 10 chiffres. */
  function waNumber(raw) {
    let d = String(raw || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.length === 10) d = '225' + d;
    return d;
  }
  const telHref = raw => 'tel:' + String(raw || '').replace(/[^\d+]/g, '');

  function headPanel(t) {
    const AN = window.AN, place = AN.place(t), exp = AN.experience(t.experienceYears);
    const badges = [
      t.boosted ? '<span class="an-boost">★ Mis en avant</span>' : '',
      place ? `<span>📍 ${esc(place)}</span>` : '',
      exp ? `<span>⏳ ${esc(exp)}</span>` : '',
      t.teachingMode ? `<span>🏠 ${esc(t.teachingMode)}</span>` : ''
    ].join('');
    return `<section class="an-panel an-pf-head">
      <div class="an-pf-inner">
        ${AN.avatar(t.name)}
        <div style="min-width:0">
          <span class="an-eyebrow">Répétiteur EduFun</span>
          <h1>${esc(t.name || 'Répétiteur')}</h1>
          <p>${esc(t.educationLevel || 'Répétiteur')}</p>
          <div class="an-pf-badges">${badges}</div>
        </div>
      </div>
    </section>`;
  }

  function detailPanels(t, full) {
    const AN = window.AN, subjects = AN.split(t.specialties), levels = AN.split(t.levels);
    const rate = Number(t.hourlyRate) > 0 ? `À partir de ${AN.money(t.hourlyRate)} / séance` : 'À discuter avec le répétiteur';
    const facts = [
      ['Tarif indicatif', rate],
      ['Mode de cours', t.teachingMode || 'À préciser'],
      ['Expérience', AN.experience(t.experienceYears) || 'Non précisée'],
      ['Lieu', AN.place(t) || 'Non précisé']
    ];
    if (full && t.memberSince) facts.push(['Membre depuis', AN.date(t.memberSince)]);
    if (t.educationLevel) facts.push(['Diplôme', t.educationLevel]);
    return `
      <section class="an-panel" style="--d:60ms">
        <h2>Présentation</h2>
        ${t.bio ? `<p class="an-bio-full">${esc(t.bio)}</p>` : '<p class="an-muted">Ce répétiteur n’a pas encore rédigé sa présentation.</p>'}
        ${!full && t.bio ? '<p class="an-muted" style="margin:12px 0 0;font-size:13.5px">Connectez-vous pour lire la présentation complète.</p>' : ''}
      </section>
      <section class="an-panel" style="--d:120ms">
        <h2>Matières enseignées</h2>
        <div class="an-tags">${subjects.length ? subjects.map(s => `<span class="an-tag">${esc(s)}</span>`).join('') : '<span class="an-muted">Non précisées</span>'}</div>
        <h2 style="margin-top:22px">Classes</h2>
        <div class="an-tags">${levels.length ? levels.map(s => `<span class="an-tag lv">${esc(s)}</span>`).join('') : '<span class="an-muted">Non précisées</span>'}</div>
      </section>
      <section class="an-panel" style="--d:180ms">
        <h2>Modalités</h2>
        <dl class="an-facts">${facts.map(([k, v]) => `<div class="an-fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </section>`;
  }

  function way(kind, href, label, value, external) {
    const AN = window.AN, ic = { tel: AN.icon.phone, wa: AN.icon.chat, mail: AN.icon.mail }[kind];
    return `<a class="an-way" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>
      <span class="an-way-ic ${kind}">${ic}</span>
      <div><small>${esc(label)}</small><b>${esc(value)}</b></div>
    </a>`;
  }

  // ---------------------------------------------------------------- Vues
  function renderFull(root, t, me) {
    const wa = t.whatsapp || t.phone;
    const ways = [
      t.phone ? way('tel', telHref(t.phone), 'Téléphone', t.phone) : '',
      wa ? way('wa', 'https://wa.me/' + waNumber(wa), 'WhatsApp', wa, true) : '',
      t.email ? way('mail', 'mailto:' + t.email, 'E-mail', t.email) : ''
    ].join('');
    const canWrite = t.accountId && (me.role === 'PARENT' || me.role === 'STUDENT');
    const first = (t.name || '').trim().split(/\s+/)[0] || 'ce répétiteur';
    root.innerHTML = `${BACK}
      <div class="an-profile">
        <div>${headPanel(t)}${detailPanels(t, true)}</div>
        <aside class="an-aside">
          <section class="an-panel an-contact" style="--d:90ms" aria-labelledby="anContactTitle">
            <h2 id="anContactTitle">Contacter ${esc(first)}</h2>
            <div class="an-ways">${ways || '<p class="an-muted">Aucune coordonnée renseignée : écrivez-lui un message ci-dessous.</p>'}</div>
            ${canWrite ? `<form class="an-write" id="anWrite">
              <h3>Écrire un message</h3>
              <p>Présentez votre enfant (classe, matières, disponibilités) : le répétiteur vous répondra dans votre messagerie EduFun.</p>
              <label class="an-sr" for="anBody">Votre message</label>
              <textarea class="an-textarea" id="anBody" name="body" maxlength="2000" required placeholder="Bonjour ${esc(first)}, je cherche un répétiteur pour mon enfant en classe de…"></textarea>
              <button class="btn primary" type="submit">Envoyer le message</button>
              <div id="anSent" aria-live="polite"></div>
            </form>` : ''}
          </section>
        </aside>
      </div>`;
    document.title = `${t.name || 'Répétiteur'} — Répétiteur EduFun`;

    const form = $('#anWrite'); if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const body = form.body.value.trim();
      if (!body) { form.body.focus(); toast('Écrivez votre message avant de l’envoyer.'); return; }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Envoi…';
      try {
        await api('/messages', { method: 'POST', body: JSON.stringify({ toAccountId: t.accountId, body }) });
        form.body.value = '';
        $('#anSent').innerHTML = `<div class="an-sent"><span>✅ Votre message a bien été envoyé à ${esc(first)}.</span><a href="/repetiteurs/messages?avec=${encodeURIComponent(t.accountId)}">Suivre la conversation dans mes messages →</a></div>`;
        toast('Message envoyé');
      } catch (err) {
        toast(apiErrorMessage(err, 'Le message n’a pas pu être envoyé. Veuillez réessayer.'));
      } finally {
        btn.disabled = false; btn.textContent = 'Envoyer le message';
      }
    });
  }

  function lockBox() {
    return `<div class="an-lock-over">
      <div class="an-lock-box">
        <div class="an-lock-ic" aria-hidden="true">🔒</div>
        <h3>Coordonnées réservées aux familles</h3>
        <p>Créez un compte parent gratuit ou connectez-vous pour voir les coordonnées et écrire à ce répétiteur.</p>
        <div class="an-lock-actions">
          <a class="btn primary" href="/parent/inscription">Créer un compte parent gratuit</a>
          <a class="btn light" href="/login" style="border:1px solid var(--line)">Se connecter</a>
        </div>
      </div>
    </div>`;
  }

  function renderLocked(root, t) {
    if (!t) {
      root.innerHTML = `${BACK}
        <section class="an-panel an-locked" style="min-height:360px">
          <div class="an-blur" aria-hidden="true">
            <div class="an-sk-row"><div class="an-sk an-sk-av"></div><div style="flex:1"><div class="an-sk an-sk-l" style="width:40%"></div><div class="an-sk an-sk-l" style="width:25%"></div></div></div>
            <div class="an-sk an-sk-l" style="width:90%;margin-top:30px"></div><div class="an-sk an-sk-l" style="width:75%"></div><div class="an-sk an-sk-l" style="width:82%"></div>
          </div>
          ${lockBox()}
        </section>`;
      return;
    }
    document.title = `${t.name || 'Répétiteur'} — Répétiteur EduFun`;
    const fake = (label, value, kind) => `<div class="an-way"><span class="an-way-ic ${kind}">${{ tel: window.AN.icon.phone, wa: window.AN.icon.chat, mail: window.AN.icon.mail }[kind]}</span><div><small>${label}</small><b>${value}</b></div></div>`;
    root.innerHTML = `${BACK}
      <div class="an-profile">
        <div>${headPanel(t)}${detailPanels(t, false)}</div>
        <aside class="an-aside">
          <section class="an-panel an-contact an-locked" style="--d:90ms" aria-labelledby="anContactTitle">
            <h2 id="anContactTitle">Contacter</h2>
            <div class="an-ways an-blur" aria-hidden="true">
              ${fake('Téléphone', '07 •• •• •• ••', 'tel')}
              ${fake('WhatsApp', '+225 07 •• •• ••', 'wa')}
              ${fake('E-mail', '••••••@••••.ci', 'mail')}
              <div class="an-sk" style="height:110px;border-radius:14px;margin-top:8px"></div>
            </div>
            ${lockBox()}
          </section>
        </aside>
      </div>`;
  }

  function renderMissing(root) {
    root.innerHTML = `${BACK}
      <div class="an-empty">
        <div class="an-empty-ic" aria-hidden="true">🧭</div>
        <h3>Ce profil n’est pas disponible</h3>
        <p>Le répétiteur que vous cherchez n’est plus visible dans l’annuaire ou le lien est incorrect. D’autres répétiteurs vous attendent près de chez vous.</p>
        <a class="btn primary" href="/repetiteurs">Retour à la recherche</a>
      </div>`;
  }

  function skeleton(root) {
    root.innerHTML = `${BACK}
      <div class="an-profile" aria-busy="true">
        <div>
          <div class="an-sk" style="height:180px;border-radius:24px"></div>
          <div class="an-skel-card" style="margin-top:18px"><div class="an-sk an-sk-l" style="width:30%"></div><div class="an-sk an-sk-l" style="width:95%;margin-top:18px"></div><div class="an-sk an-sk-l" style="width:88%"></div><div class="an-sk an-sk-l" style="width:70%"></div></div>
        </div>
        <div class="an-skel-card"><div class="an-sk an-sk-l" style="width:50%"></div><div class="an-sk" style="height:64px;border-radius:16px;margin-top:18px"></div><div class="an-sk" style="height:64px;border-radius:16px;margin-top:10px"></div><div class="an-sk" style="height:120px;border-radius:14px;margin-top:18px"></div></div>
      </div>`;
  }

  async function publicCard(id) {
    try {
      const list = await api('/tutors/search');
      return (Array.isArray(list) ? list : []).find(t => String(t.id) === String(id)) || null;
    } catch (_) { return null; }
  }

  async function init() {
    const root = $('#anFiche'); if (!root) return;
    const id = tutorId();
    skeleton(root);

    // Retour à la recherche : conserve les filtres si l'on vient de l'annuaire.
    root.addEventListener('click', e => {
      const a = e.target.closest('[data-back]'); if (!a) return;
      try { const ref = new URL(document.referrer); if (ref.origin === location.origin && ref.pathname === '/repetiteurs') { e.preventDefault(); history.back(); } } catch (_) {}
    });

    if (!/^\d+$/.test(id)) { renderMissing(root); return; }
    const me = await currentUser();
    if (!me || !me.authenticated) { renderLocked(root, await publicCard(id)); return; }

    let r;
    try { r = await fetch(`/api/tutors/${encodeURIComponent(id)}/profile`, { credentials: 'same-origin', headers: { Accept: 'application/json' } }); }
    catch (e) { toast('Connexion impossible. Vérifiez votre accès à Internet.'); renderMissing(root); return; }
    if (r.status === 401 || r.status === 403) { renderLocked(root, await publicCard(id)); return; }
    if (!r.ok) {
      if (r.status !== 404) { const txt = await r.text().catch(() => ''); toast(apiErrorMessage(new Error(txt), 'Ce profil n’a pas pu être chargé.')); }
      renderMissing(root); return;
    }
    let t;
    try { t = await r.json(); } catch (_) { renderLocked(root, await publicCard(id)); return; }
    renderFull(root, t, me);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
