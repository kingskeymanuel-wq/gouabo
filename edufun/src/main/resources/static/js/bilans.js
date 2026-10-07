/* EduFun — bilans bimestriels de l'élève */
(function () {
  const $b = s => document.querySelector(s);
  const state = { data: null, index: 0 };
  const tone = v => v >= 80 ? 'good' : v >= 60 ? 'mid' : 'low';

  async function load() {
    const me = await currentUser();
    if (!me.authenticated || !me.studentId) { location.href = me.role === 'ADMIN' ? '/administration' : '/login'; return; }
    try { state.data = await api('/student/reports'); } catch (e) { $b('[data-report]').innerHTML = '<div class="cu-empty"><b>Bilans indisponibles</b>Réessaie dans un instant.</div>'; return; }
    $b('#reportsPage').removeAttribute('aria-busy');
    renderPeriods(); render();
  }

  function renderPeriods() {
    const box = $b('[data-periods]');
    box.innerHTML = state.data.reports.map((r, i) => `<button aria-pressed="${i === state.index}" data-i="${i}">${esc(r.label)}${i === 0 ? '<small>en cours</small>' : ''}</button>`).join('');
    box.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; state.index = Number(b.dataset.i); renderPeriods(); render(); };
  }

  function render() {
    const r = state.data.reports[state.index], s = state.data.student;
    const kpi = (label, value, sub) => `<div class="bl-kpi"><small>${label}</small><b>${value}</b>${sub ? `<span>${sub}</span>` : ''}</div>`;
    const subjects = r.subjects.length ? r.subjects.map(x => `<div class="bl-row"><span class="bl-sub">${esc(x.subject)}<small>${x.lessons} leçon${x.lessons > 1 ? 's' : ''}</small></span>
        <span class="bl-track"><i class="${tone(x.average)}" style="--w:${x.average}%"></i></span><b class="bl-val">${x.average} %</b></div>`).join('')
      : '<p class="bl-empty">Aucune leçon terminée sur cette période pour l\'instant.</p>';
    const chips = (list, cls) => list.length ? list.map(x => `<span class="bl-chip ${cls}">${esc(x)}</span>`).join('') : '<span class="bl-none">—</span>';
    $b('[data-report]').innerHTML = `
      <div class="bl-hero">
        <div><span class="bl-pill">${esc(r.label)}</span><h2>${esc(s.name)} · ${esc(s.level)}</h2><p>${esc(r.appreciation)}</p></div>
        <div class="bl-score ${tone(r.average)}" style="--p:${r.average}"><div><b>${r.average}<small>%</small></b><span>réussite moyenne</span></div></div>
      </div>
      <div class="bl-kpis">${kpi('Leçons terminées', r.lessonsCompleted)}${kpi('Jours d\'activité', r.activeDays)}${kpi('Quiz réussis', `${r.quizzes.passed} / ${r.quizzes.attempts}`)}${kpi('Prépa examens', r.prep.attempts ? r.prep.average + ' %' : '—', r.prep.attempts ? `${r.prep.attempts} QCM` : 'aucun QCM')}</div>
      <div class="bl-grid">
        <article class="bl-panel"><h3>Réussite par matière</h3><p class="bl-hint">Moyenne des évaluations « Je vérifie » réussies du premier coup.</p>${subjects}</article>
        <article class="bl-panel"><h3>Points forts</h3><div class="bl-chips">${chips(r.strengths, 'good')}</div>
          <h3>À renforcer</h3><div class="bl-chips">${chips(r.toImprove, 'low')}</div>
          <div class="bl-send"><p>${s.parentEmail ? `Envoyer ce bilan à <b>${esc(s.parentEmail)}</b>` : 'Ajoute l\'e-mail de ton parent dans <a href="/profil">Mon profil</a> pour lui envoyer ce bilan.'}</p>
          ${s.parentEmail ? '<button class="btn primary" data-send>✉️ Envoyer à mon parent</button>' : ''}</div></article>
      </div>`;
    const btn = $b('[data-send]');
    if (btn) btn.onclick = async () => {
      btn.disabled = true;
      try { const x = await api('/student/reports/send?index=' + state.index, { method: 'POST' }); toast(x.emailStatus === 'SKIPPED' ? 'Bilan enregistré : l\'envoi d\'e-mails sera actif dès sa configuration.' : 'Bilan envoyé à ' + x.sentTo + ' ✅'); }
      catch (e) { toast(apiErrorMessage(e, 'Envoi impossible')); } finally { btn.disabled = false; }
    };
  }

  document.addEventListener('DOMContentLoaded', () => { if ($b('#reportsPage')) load(); });
})();
