/* ===========================================================
   EduFun — animations et éléments d'interface communs
   (apparitions progressives, barre de lecture, accès admin discret, abonnement)
=========================================================== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REVEAL = '.card, .cu-panel, .cu-chapter, .cu-level, .sd-card, .sd-subject, .px-exam, .px-subject, .px-faq details, .lr-section, .lr-check, .ab-plan, .ad-kpi, .ad-panel, .ui-paywall';

  // ---- Apparitions progressives (y compris le contenu chargé après coup) ----
  let io = null;
  function reveal(root) {
    if (reduce || !('IntersectionObserver' in window)) return;
    if (!io) io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('ui-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: .06 });
    const fresh = [...(root.querySelectorAll ? root.querySelectorAll(REVEAL) : [])].filter(el => !el.classList.contains('ui-reveal'));
    fresh.forEach((el, i) => {
      el.classList.add('ui-reveal');
      el.style.setProperty('--ui-delay', Math.min(i, 8) * 55 + 'ms');
      io.observe(el);
    });
  }

  // ---- Barre de progression de lecture sur les leçons ----
  function readingBar() {
    if (!document.getElementById('lessonReader')) return;
    const bar = document.createElement('div'); bar.className = 'ui-progress'; document.body.appendChild(bar);
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  }

  // ---- Transition de sortie quand le navigateur ne gère pas les View Transitions ----
  function leaveTransition() {
    if (reduce || 'startViewTransition' in document) return;
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="/"]');
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || a.hasAttribute('download')) return;
      e.preventDefault(); document.body.classList.add('ui-leaving');
      setTimeout(() => { location.href = a.href; }, 170);
    });
    addEventListener('pageshow', () => document.body.classList.remove('ui-leaving'));
  }

  // ---- Accès administrateur discret : un petit lien en bas de la barre latérale ----
  function adminDoor(me) {
    const side = document.querySelector('.sidebar'); if (!side || side.querySelector('.admin-door')) return;
    const a = document.createElement('a');
    a.className = 'admin-door'; a.href = '/administration'; a.title = 'Console d’administration';
    a.innerHTML = '<i></i>console'; a.hidden = me.role !== 'ADMIN';
    side.appendChild(a);
  }

  // ---- Bandeau d'abonnement (essai qui se termine, abonnement expiré) ----
  function subscriptionBanner(me) {
    const sub = me.subscription, main = document.querySelector('.main');
    if (!sub || !main || location.pathname === '/abonnement' || document.querySelector('.ui-sub-banner')) return;
    const fmt = n => Number(n).toLocaleString('fr-FR');
    let html = '';
    if (sub.status === 'NEW') html = `<span>🚀</span><span><b>Active ton compte pour accéder à tes cours.</b> Paie ton premier mois (${fmt(sub.monthlyPrice)} F CFA) : le mois suivant est offert.</span>`;
    else if (sub.status === 'PENDING') html = `<span>⏳</span><span><b>Paiement en cours de vérification.</b> Tes cours sont déjà ouverts ; ton abonnement sera confirmé très vite.</span>`;
    else if (sub.status === 'EXPIRED') html = `<span>🔒</span><span><b>Ton accès est suspendu.</b> Renouvelle ton abonnement (${fmt(sub.monthlyPrice)} F CFA / mois) pour retrouver toutes tes leçons.</span>`;
    else if (sub.status === 'TRIAL') html = `<span>🎁</span><span><b>Essai gratuit : ${sub.daysLeft} jour${sub.daysLeft > 1 ? 's' : ''} restant${sub.daysLeft > 1 ? 's' : ''}.</b> Abonne-toi pour continuer sans interruption (${fmt(sub.monthlyPrice)} F CFA / mois).</span>`;
    else if (sub.status === 'ACTIVE' && sub.daysLeft <= 5) html = `<span>⏳</span><span><b>Ton abonnement se termine dans ${sub.daysLeft} jour${sub.daysLeft > 1 ? 's' : ''}.</b> Pense à le renouveler.</span>`;
    if (!html) return;
    const div = document.createElement('div');
    div.className = 'ui-sub-banner' + (sub.status === 'EXPIRED' || sub.status === 'NEW' ? ' expired' : '');
    div.innerHTML = html + '<a class="btn primary" href="/abonnement">Mon abonnement</a>';
    const anchor = main.querySelector('header, .top, .cu-top, .sd-top');
    anchor ? anchor.after(div) : main.prepend(div);
  }

  // ---- Contenu réservé aux abonnés : la réponse 402 de l'API affiche un écran dédié ----
  function paywall(message) {
    const target = document.getElementById('lessonReader') || document.querySelector('[data-view]');
    const html = `<div class="ui-paywall"><div class="ui-lock">🔒</div><h2>Ce contenu est réservé aux abonnés</h2>
      <p>${message || 'Ton abonnement EduFun est arrivé à échéance.'} Toutes les leçons, les vidéos du professeur, les évaluations et la Prépa examens restent disponibles dès le renouvellement.</p>
      <a class="btn primary" href="/abonnement">Voir mon abonnement</a></div>`;
    if (target) target.innerHTML = html; else location.href = '/abonnement';
  }
  window.addEventListener('edufun:paywall', e => paywall(e.detail));

  document.addEventListener('DOMContentLoaded', () => {
    reveal(document); readingBar(); leaveTransition();
    if (!reduce) new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && reveal(n.parentNode || n))))
      .observe(document.body, { childList: true, subtree: true });
    if (typeof currentUser === 'function') currentUser().then(me => {
      if (!me || !me.authenticated) return;
      adminDoor(me); subscriptionBanner(me);
    });
  });
})();
