/* ===========================================================
   EduFun — Portail familles
   1) Outils partagés (window.AN) et en-tête du portail, utilisés par
      toutes les pages familles (annuaire, fiche, messagerie, inscription).
   2) Page /repetiteurs : recherche des répétiteurs.
=========================================================== */
(function () {
  'use strict';

  const AN = window.AN = {};

  // ---------------------------------------------------------------- Référentiels
  AN.SUBJECTS = ['Français', 'Mathématiques', 'Anglais', 'Espagnol', 'Allemand', 'Physique-Chimie', 'SVT',
    'Histoire-Géographie', 'Philosophie', 'Informatique', 'Comptabilité', 'Économie'];
  AN.LEVELS = ['Primaire', 'Collège', 'Lycée', 'Prépa CEPE', 'Prépa BEPC', 'Prépa BAC'];
  const FALLBACK_PLACES = {
    abidjan: 'Abidjan',
    cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Daloa', 'Korhogo', 'Man', 'Gagnoa', 'Abengourou', 'Divo'],
    abidjanCommunes: ['Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi', 'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon', 'Anyama', 'Bingerville', 'Songon']
  };
  let placesPromise = null;
  AN.places = () => placesPromise || (placesPromise = api('/places')
    .then(p => ({
      abidjan: p.abidjan || 'Abidjan',
      cities: Array.isArray(p.cities) && p.cities.length ? p.cities : FALLBACK_PLACES.cities,
      abidjanCommunes: Array.isArray(p.abidjanCommunes) && p.abidjanCommunes.length ? p.abidjanCommunes : FALLBACK_PLACES.abidjanCommunes
    }))
    .catch(() => FALLBACK_PLACES));

  // ---------------------------------------------------------------- Formatage
  AN.split = v => Array.isArray(v) ? v.filter(Boolean).map(String)
    : String(v || '').split(/[,;|\n·•\/]+/).map(s => s.trim()).filter(Boolean);
  AN.money = n => Number(n).toLocaleString('fr-FR') + ' F';
  AN.place = t => {
    const d = (t.district || '').trim(), c = (t.city || '').trim();
    if (d && c && d.toLowerCase() !== c.toLowerCase()) return `${d}, ${c}`;
    return d || c;
  };
  AN.experience = n => {
    if (n === null || n === undefined || n === '') return '';
    const v = Number(n);
    if (!v) return "Moins d'un an d'expérience";
    return `${v} an${v > 1 ? 's' : ''} d'expérience`;
  };
  const GRADS = [
    'linear-gradient(135deg,#5b3df5,#9b7bff)', 'linear-gradient(135deg,#f77f00,#fbbf24)',
    'linear-gradient(135deg,#009e60,#34d399)', 'linear-gradient(135deg,#0ea5e9,#6366f1)',
    'linear-gradient(135deg,#db2777,#f472b6)', 'linear-gradient(135deg,#1b1f4b,#5b3df5)',
    'linear-gradient(135deg,#0f766e,#22d3ee)', 'linear-gradient(135deg,#b45309,#f59e0b)'
  ];
  AN.avatarBg = name => {
    let h = 0; for (const ch of String(name || '')) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return GRADS[h % GRADS.length];
  };
  AN.avatar = (name, extra = '') =>
    `<span class="an-av ${extra}" style="--av:${AN.avatarBg(name)}" aria-hidden="true">${esc(initials(name))}</span>`;

  AN.date = iso => iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  AN.time = iso => iso ? new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
  AN.relative = iso => {
    if (!iso) return '';
    const d = new Date(iso); if (isNaN(d)) return '';
    const s = Math.round((Date.now() - d.getTime()) / 1000);
    if (s < 45) return "à l'instant";
    if (s < 3600) return `il y a ${Math.max(1, Math.round(s / 60))} min`;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    const days = Math.round((today - day) / 86400000);
    if (days === 0) return `il y a ${Math.round(s / 3600)} h`;
    if (days === 1) return `hier à ${AN.time(iso)}`;
    if (days < 7) return `il y a ${days} jours`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' });
  };

  // Icônes en ligne (traits fins, couleur héritée)
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  AN.icon = {
    pin: svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    cap: svg('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    home: svg('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
    book: svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
    back: svg('<path d="M15 18l-6-6 6-6"/>'),
    phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    chat: svg('<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>')
  };

  /** Carte d'un répétiteur dans la grille de résultats. */
  AN.card = (t, i = 0) => {
    const subjects = AN.split(t.specialties), levels = AN.split(t.levels);
    const shown = subjects.slice(0, 4), more = subjects.length - shown.length;
    const place = AN.place(t), exp = AN.experience(t.experienceYears);
    const url = `/repetiteurs/fiche/${encodeURIComponent(t.id)}`;
    const rate = Number(t.hourlyRate) > 0
      ? `<div class="an-price">À partir de<b>${esc(AN.money(t.hourlyRate))} / séance</b></div>`
      : `<div class="an-price">Tarif<b>À discuter</b></div>`;
    return `<article class="an-card${t.boosted ? ' boosted' : ''}" style="--d:${Math.min(i, 10) * 45}ms">
      ${t.boosted ? '<span class="an-boost">★ Mis en avant</span>' : ''}
      <div class="an-card-head">
        ${AN.avatar(t.name)}
        <div class="an-card-id">
          <h3><a href="${url}">${esc(t.name || 'Répétiteur')}</a></h3>
          <p class="an-diploma">${esc(t.educationLevel || 'Répétiteur')}</p>
        </div>
      </div>
      <div class="an-card-body">
        <ul class="an-meta">
          ${place ? `<li>${AN.icon.pin}<span>${esc(place)}</span></li>` : ''}
          ${exp ? `<li>${AN.icon.clock}<span>${esc(exp)}</span></li>` : ''}
          ${levels.length ? `<li>${AN.icon.cap}<span>${esc(levels.join(' · '))}</span></li>` : ''}
          ${t.teachingMode ? `<li>${AN.icon.home}<span>${esc(t.teachingMode)}</span></li>` : ''}
        </ul>
        ${shown.length ? `<div class="an-tags" aria-label="Matières">${shown.map(s => `<span class="an-tag">${esc(s)}</span>`).join('')}${more > 0 ? `<span class="an-tag more">+${more}</span>` : ''}</div>` : ''}
        ${t.bio ? `<p class="an-bio">${esc(t.bio)}</p>` : ''}
        <div class="an-card-foot">
          ${rate}
          <a class="btn primary" href="${url}" tabindex="-1" aria-hidden="true">Voir le profil</a>
        </div>
      </div>
    </article>`;
  };

  AN.skeletons = (n = 6) => Array.from({ length: n }, () => `<div class="an-skel-card" aria-hidden="true">
      <div class="an-sk-row"><div class="an-sk an-sk-av"></div><div style="flex:1"><div class="an-sk an-sk-l" style="width:70%"></div><div class="an-sk an-sk-l" style="width:45%"></div></div></div>
      <div class="an-sk an-sk-l" style="width:60%;margin-top:22px"></div><div class="an-sk an-sk-l" style="width:52%"></div>
      <div style="display:flex;gap:6px;margin:16px 0"><div class="an-sk" style="width:80px;height:24px;border-radius:999px"></div><div class="an-sk" style="width:96px;height:24px;border-radius:999px"></div></div>
      <div class="an-sk an-sk-l" style="width:95%"></div><div class="an-sk an-sk-l" style="width:80%"></div>
    </div>`).join('');

  // ---------------------------------------------------------------- En-tête
  AN.refreshBadge = async () => {
    const badge = $('[data-unread]'); if (!badge) return null;
    try {
      const n = await api('/notifications');
      const c = Number(n.unreadMessages || 0);
      badge.textContent = c > 99 ? '99+' : String(c);
      badge.hidden = c <= 0;
      badge.setAttribute('aria-label', `${c} message${c > 1 ? 's' : ''} non lu${c > 1 ? 's' : ''}`);
      return n;
    } catch (_) { return null; }
  };

  AN.me = () => currentUser();

  function setupHeader() {
    const top = $('#anTop'); if (!top) return;
    const btn = top.querySelector('.an-menu-btn');
    const close = () => { top.classList.remove('open'); btn && btn.setAttribute('aria-expanded', 'false'); };
    if (btn) btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = !top.classList.contains('open');
      top.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!top.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    const path = location.pathname.replace(/\/$/, '');
    top.querySelectorAll('.an-nav a').forEach(a => {
      const key = a.dataset.nav;
      const on = key === 'messages' ? path === '/repetiteurs/messages' : (path === '/repetiteurs' || path.startsWith('/repetiteurs/fiche'));
      if (on) a.setAttribute('aria-current', 'page');
    });

    currentUser().then(me => {
      const role = me && me.authenticated ? me.role : 'GUEST';
      const show = sel => top.querySelectorAll(sel).forEach(el => { el.hidden = false; });
      if (role === 'GUEST') { show('[data-when~="guest"]'); return; }
      show('[data-when~="auth"]');
      if (role === 'PARENT') show('[data-when~="parent"]');
      else if (role === 'STUDENT') show('[data-when~="student"]');
      else if (role === 'TUTOR') show('[data-when~="tutor"]');
      else if (role === 'ADMIN') show('[data-when~="admin"]');
      const name = me.fullName || me.name || me.email || '';
      top.querySelectorAll('[data-user-name]').forEach(e => { e.textContent = name; });
      top.querySelectorAll('[data-user-initials]').forEach(e => { e.textContent = initials(name); });
      if (role === 'PARENT' || role === 'STUDENT') AN.refreshBadge();
    });
  }

  // ---------------------------------------------------------------- Page /repetiteurs
  async function setupSearch() {
    const form = $('#anFilters'); if (!form) return;
    const grid = $('#anGrid'), count = $('#anCount'), chips = $('#anChips');
    const citySel = form.elements.city, communeSel = $('#anCommune'), quarter = $('#anQuarter');
    const subjectSel = form.elements.subject, levelSel = form.elements.level, q = form.elements.q;
    const params = new URLSearchParams(location.search);

    grid.innerHTML = AN.skeletons(6); grid.setAttribute('aria-busy', 'true');

    subjectSel.insertAdjacentHTML('beforeend', AN.SUBJECTS.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join(''));
    levelSel.insertAdjacentHTML('beforeend', AN.LEVELS.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join(''));

    const places = await AN.places();
    const ABJ = places.abidjan;
    citySel.insertAdjacentHTML('beforeend', places.cities.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(''));
    communeSel.insertAdjacentHTML('beforeend', places.abidjanCommunes.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(''));
    const chipList = ['Cocody', 'Yopougon', 'Abobo', 'Marcory', 'Koumassi', 'Plateau', 'Treichville', 'Adjamé', 'Port-Bouët', 'Attécoubé', 'Bingerville', 'Anyama', 'Songon'];
    chips.innerHTML = chipList.map(c => `<button type="button" class="an-chip" data-commune="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');

    const setSelect = (sel, v) => { if (v && [...sel.options].some(o => o.value === v)) sel.value = v; else if (v && sel === citySel) { sel.insertAdjacentHTML('beforeend', `<option value="${esc(v)}">${esc(v)}</option>`); sel.value = v; } };
    setSelect(citySel, params.get('city') || '');
    setSelect(subjectSel, params.get('subject') || '');
    setSelect(levelSel, params.get('level') || '');
    q.value = params.get('q') || '';
    const district0 = params.get('district') || '';
    if (district0 && !citySel.value && places.abidjanCommunes.includes(district0)) citySel.value = ABJ;

    const isAbj = () => citySel.value === ABJ;
    function syncDistrictField(value) {
      const abj = isAbj();
      $('#anFCommune').hidden = !abj; communeSel.disabled = !abj;
      $('#anFQuarter').hidden = abj; quarter.disabled = abj;
      if (value !== undefined) { if (abj) setSelect(communeSel, value); else quarter.value = value; }
    }
    syncDistrictField(district0);
    const district = () => (isAbj() ? communeSel.value : quarter.value).trim();

    function syncChips() {
      const d = isAbj() ? communeSel.value : '';
      chips.querySelectorAll('.an-chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.commune === d)));
    }

    function filters() {
      return { city: citySel.value, district: district(), subject: subjectSel.value, level: levelSel.value, q: q.value.trim() };
    }

    function summary(f) {
      const parts = [];
      if (f.district || f.city) parts.push('à ' + [f.district, f.city].filter(Boolean).join(', '));
      if (f.subject) parts.push(f.subject);
      if (f.level) parts.push(f.level);
      if (f.q) parts.push(`« ${f.q} »`);
      return parts.length ? parts.join(' · ') : 'Partout en Côte d’Ivoire';
    }

    let seq = 0;
    async function run() {
      const f = filters();
      const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
      syncChips();
      const mine = ++seq;
      grid.setAttribute('aria-busy', 'true');
      if (!grid.querySelector('.an-skel-card')) grid.innerHTML = AN.skeletons(grid.children.length > 3 ? 6 : 3);
      try {
        const list = await api('/tutors/search' + (qs ? '?' + qs : ''));
        if (mine !== seq) return;
        render(Array.isArray(list) ? list : [], f);
      } catch (e) {
        if (mine !== seq) return;
        grid.innerHTML = '';
        count.innerHTML = 'Recherche indisponible<small>Veuillez réessayer dans un instant.</small>';
        toast(apiErrorMessage(e, 'La recherche est momentanément indisponible.'));
      } finally {
        if (mine === seq) grid.setAttribute('aria-busy', 'false');
      }
    }

    function render(list, f) {
      const n = list.length;
      count.innerHTML = `${n ? `${n.toLocaleString('fr-FR')} répétiteur${n > 1 ? 's' : ''} disponible${n > 1 ? 's' : ''}` : 'Aucun résultat'}<small>${esc(summary(f))}</small>`;
      $('#anSortNote').hidden = !list.some(t => t.boosted);
      if (!n) {
        const narrow = f.district || f.q || f.subject || f.level;
        grid.innerHTML = `<div class="an-empty">
          <div class="an-empty-ic" aria-hidden="true">🔎</div>
          <h3>Aucun répétiteur ne correspond à votre recherche</h3>
          <p>${narrow ? 'Élargissez la recherche : essayez une commune voisine, retirez la classe ou la matière, ou cherchez dans toute la ville.' : 'Aucun répétiteur n’est encore visible dans cette ville. Élargissez la recherche à une autre ville ou revenez bientôt : de nouveaux profils sont ajoutés chaque semaine.'}</p>
          ${f.district ? '<button type="button" class="btn ghost" data-act="city">Chercher dans toute la ville</button>' : ''}
          <button type="button" class="btn primary" data-act="reset">Réinitialiser les filtres</button>
        </div>`;
        return;
      }
      grid.innerHTML = list.map(AN.card).join('');
    }

    let timer = null;
    const debounced = (ms = 280) => { clearTimeout(timer); timer = setTimeout(run, ms); };

    citySel.addEventListener('change', () => { syncDistrictField(''); communeSel.value = ''; debounced(0); });
    communeSel.addEventListener('change', () => debounced(0));
    subjectSel.addEventListener('change', () => debounced(0));
    levelSel.addEventListener('change', () => debounced(0));
    quarter.addEventListener('input', () => debounced());
    q.addEventListener('input', () => debounced());
    form.addEventListener('submit', e => { e.preventDefault(); debounced(0); });

    function reset() {
      form.reset(); citySel.value = ''; syncDistrictField(''); quarter.value = ''; debounced(0);
    }
    $('#anReset').addEventListener('click', reset);
    chips.addEventListener('click', e => {
      const b = e.target.closest('.an-chip'); if (!b) return;
      const on = b.getAttribute('aria-pressed') === 'true';
      citySel.value = ABJ; syncDistrictField(on ? '' : b.dataset.commune);
      if (on) communeSel.value = '';
      debounced(0);
    });
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      if (b.dataset.act === 'reset') reset();
      if (b.dataset.act === 'city') { syncDistrictField(''); communeSel.value = ''; quarter.value = ''; debounced(0); }
    });

    currentUser().then(me => { const inv = $('#anInvite'); if (inv) inv.hidden = !!(me && me.authenticated); });
    run();
  }

  document.addEventListener('DOMContentLoaded', () => { setupHeader(); setupSearch(); });
})();
