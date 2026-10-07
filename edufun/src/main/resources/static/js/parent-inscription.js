/* ===========================================================
   EduFun — Portail familles : création d'un compte parent (/parent/inscription)
=========================================================== */
(function () {
  'use strict';

  const EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

  function setError(field, msg) {
    const wrap = field.closest('.an-f'); if (!wrap) return;
    const err = wrap.querySelector('.an-err');
    wrap.classList.toggle('invalid', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
  }

  function strength(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(4, s);
  }

  async function init() {
    const form = $('#anParentForm'); if (!form) return;
    const el = form.elements;
    const city = el.city, commune = $('#piCommune'), quarter = $('#piQuarter');

    // Déjà connecté : inutile de créer un compte.
    currentUser().then(me => {
      if (me && me.authenticated) {
        const box = $('#piAlready');
        box.hidden = false;
        box.querySelector('span').textContent = me.role === 'PARENT'
          ? 'Vous êtes déjà connecté avec votre compte parent.'
          : 'Vous êtes déjà connecté à EduFun.';
      }
    });

    const places = await window.AN.places();
    const ABJ = places.abidjan;
    city.insertAdjacentHTML('beforeend', places.cities.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(''));
    commune.insertAdjacentHTML('beforeend', places.abidjanCommunes.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(''));
    if (places.cities.includes(ABJ)) city.value = ABJ;

    function syncDistrict() {
      const abj = city.value === ABJ;
      $('#piFCommune').hidden = !abj; commune.disabled = !abj; commune.required = abj;
      $('#piFQuarter').hidden = abj; quarter.disabled = abj;
      setError(commune, ''); setError(quarter, '');
    }
    city.addEventListener('change', syncDistrict);
    syncDistrict();

    // Afficher / masquer le mot de passe
    form.querySelectorAll('.an-pw button').forEach(b => {
      b.innerHTML = EYE;
      b.addEventListener('click', () => {
        const input = b.parentElement.querySelector('input');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        b.innerHTML = show ? EYE_OFF : EYE;
        b.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
        b.setAttribute('aria-pressed', String(show));
      });
    });

    // Jauge de robustesse
    const meter = $('#piMeter i'), meterTxt = $('#piMeterTxt');
    const LABELS = ['Trop court', 'Faible', 'Correct', 'Bon', 'Excellent'];
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#009e60'];
    el.password.addEventListener('input', () => {
      const pw = el.password.value, s = pw.length < 8 ? 0 : strength(pw);
      meter.style.width = pw ? `${Math.max(12, s * 25)}%` : '0';
      meter.style.background = COLORS[s];
      meterTxt.textContent = pw ? `Robustesse : ${LABELS[s]}` : 'Au moins 8 caractères.';
      if (el.password.getAttribute('aria-invalid') === 'true') validate(el.password);
    });

    function validate(f) {
      const v = (f.value || '').trim();
      let msg = '';
      switch (f.name) {
        case 'fullName': if (v.length < 2) msg = 'Indiquez votre nom complet.'; break;
        case 'email': if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Indiquez une adresse e-mail valide.'; break;
        case 'phone': if (v.replace(/\D/g, '').length < 8) msg = 'Indiquez un numéro de téléphone valide.'; break;
        case 'city': if (!v) msg = 'Choisissez votre ville.'; break;
        case 'district': if (f === commune && !f.disabled && !v) msg = 'Choisissez votre commune.'; break;
        case 'password': if (f.value.length < 8) msg = 'Le mot de passe doit contenir au moins 8 caractères.'; break;
        case 'confirm': if (!f.value || f.value !== el.password.value) msg = 'Les deux mots de passe ne correspondent pas.'; break;
      }
      setError(f, msg);
      return !msg;
    }

    [...form.querySelectorAll('input, select')].forEach(f => {
      f.addEventListener('blur', () => { if (f.value) validate(f); });
      f.addEventListener('change', () => { if (f.getAttribute('aria-invalid') === 'true') validate(f); });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fields = [el.fullName, el.email, el.phone, city, commune, quarter, el.password, el.confirm].filter(f => !f.disabled);
      const bad = fields.filter(f => !validate(f));
      if (bad.length) { bad[0].focus(); toast('Vérifiez les champs signalés.'); return; }

      const district = (city.value === ABJ ? commune.value : quarter.value).trim();
      const body = {
        fullName: el.fullName.value.trim(), email: el.email.value.trim(), password: el.password.value,
        phone: el.phone.value.trim(), city: city.value, district: district || null
      };
      const btn = $('#piSubmit'), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Création de votre compte…';
      try {
        const res = await api('/parent/register', { method: 'POST', body: JSON.stringify(body) });
        toast('Bienvenue sur EduFun 👋');
        const target = res && typeof res.redirect === 'string' && /^\/(?!\/)/.test(res.redirect) ? res.redirect : '/repetiteurs';
        setTimeout(() => { location.href = target; }, 400);
      } catch (err) {
        toast(apiErrorMessage(err, 'Votre compte n’a pas pu être créé. Veuillez réessayer.'));
        btn.disabled = false; btn.textContent = label;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
