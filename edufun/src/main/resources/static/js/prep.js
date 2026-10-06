/* ===========================================================
   EduFun — Prépa Examens (CEPE, BEPC, BAC)
   S'appuie sur edufun.js : api, esc, renderRichText, parseChecks, currentUser, toast.
=========================================================== */
(function () {
  const ICONS = { 'Français': '📖', 'Mathématiques': '📐', 'Philosophie': '💭', 'Physique-Chimie': '⚗️', 'SVT': '🧬',
    'Histoire-Géographie': '🌍', 'Anglais': '🇬🇧', 'Espagnol': '🇪🇸', 'Allemand': '🇩🇪', 'Construction mécanique': '⚙️', 'Électrotechnique': '⚡', 'Électronique': '🔌', 'Génie civil': '🏗️', 'Biochimie': '🧪', 'Économie générale': '📈', 'Droit': '⚖️', 'Techniques administratives et bureautique': '🗂️', 'Comptabilité et gestion': '🧾', 'EDHC': '🤝' };
  const iconFor = name => ICONS[Object.keys(ICONS).find(k => name.startsWith(k))] || '📝';
  const state = { exams: [], exam: null, tab: 'matieres', timers: [] };
  const $p = s => document.querySelector(s);

  function defaultExam(level) {
    if (['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'].includes(level)) return 'cepe';
    if (['6e', '5e', '4e', '3e'].includes(level)) return 'bepc';
    return /^(Seconde|Première|Terminale) (E|F\d|G\d)$/.test(level || '') ? 'bact' : 'bac';
  }

  // Série de l'élève (« Terminale F3 » → « F3 ») et épreuves qui la concernent.
  const serieOf = level => (/^(?:Seconde|Première|Terminale) (\S+)$/.exec(level || '') || [])[1] || '';
  function concerns(subject, serie) {
    const text = subject.series || '';
    if (!serie || !text || /toutes/i.test(text)) return true;
    return (text.match(/\b(A|C|D|E|F\d|G\d)\b/g) || []).includes(serie);
  }
  function subjectCard(s) {
    return `<button class="px-subject" data-subject="${esc(s.slug)}">
        <span class="px-subject-icon">${iconFor(s.name)}</span><b>${esc(s.name)}</b>
        <small>${s.series ? esc(s.series) + ' · ' : ''}${esc(s.duration || '')}</small>
        <span class="px-subject-meta"><span class="px-chip">${s.sujets} sujet${s.sujets > 1 ? 's' : ''} corrigé${s.sujets > 1 ? 's' : ''}</span><span class="px-chip">${s.qcm} QCM</span></span></button>`;
  }

  async function init() {
    if (!$p('#prepPage')) return;
    try {
      const [exams, me] = await Promise.all([api('/prep'), currentUser()]);
      state.exams = exams;
      const wanted = new URLSearchParams(location.search).get('exam');
      selectExam(exams.find(e => e.code === wanted) ? wanted : defaultExam(me.level), me.level);
    } catch (e) { $p('[data-exams]').innerHTML = '<div class="cu-empty"><b>Prépa indisponible</b>Réessaie dans un instant.</div>'; }
    $p('[data-tabs]').onclick = e => { const b = e.target.closest('[data-tab]'); if (b) { state.tab = b.dataset.tab; renderTab(); } };
  }

  function selectExam(code, myLevel) {
    state.exam = state.exams.find(e => e.code === code) || state.exams[0];
    state.myLevel = myLevel || '';
    const mine = defaultExam(myLevel || '');
    $p('[data-exams]').innerHTML = state.exams.map(e => {
      const qcm = e.subjects.reduce((n, s) => n + s.qcm, 0), sujets = e.subjects.reduce((n, s) => n + s.sujets, 0);
      return `<button class="px-exam" aria-pressed="${e.code === state.exam.code}" data-exam="${e.code}">
        ${e.code === mine ? '<span class="px-exam-badge">Mon examen</span>' : ''}
        <span class="px-exam-name">${esc(e.name)}</span><span class="px-exam-full">${esc(e.fullName)} · fin de ${esc(e.level)}</span>
        <span class="px-exam-stats"><span>${e.subjects.length} matières</span><span>${sujets} sujets corrigés</span><span>${qcm} questions</span></span></button>`;
    }).join('');
    $p('[data-exams]').onclick = e => { const b = e.target.closest('[data-exam]'); if (b) { state.tab = 'matieres'; selectExam(b.dataset.exam, myLevel); } };
    $p('[data-panel]').hidden = false;
    history.replaceState({}, '', `/examens?exam=${state.exam.code}`);
    renderTab();
  }

  function renderTab() {
    stopTimers();
    document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === state.tab));
    const view = $p('[data-view]'), e = state.exam;
    if (state.tab === 'faq') {
      view.innerHTML = `<div class="px-faq">${e.faq.map((f, i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(f.question)}</summary><div class="lesson-richtext">${renderRichText(f.answer)}</div></details>`).join('')}</div>`;
      return;
    }
    if (state.tab === 'resultats') { renderHistory(view); return; }
    view.innerHTML = `<div class="px-intro lesson-richtext">${renderRichText(e.intro)}</div>
      ${subjectGroups(e)}`;
    view.querySelectorAll('.px-subjects').forEach(g => g.onclick = ev => { const b = ev.target.closest('[data-subject]'); if (b) openSubject(b.dataset.subject); });
  }

  // Au BAC, les épreuves de la série de l'élève passent en premier.
  function subjectGroups(e) {
    const serie = ['bac', 'bact'].includes(e.code) && defaultExam(state.myLevel) === e.code ? serieOf(state.myLevel) : '';
    const mine = e.subjects.filter(s => concerns(s, serie)), others = e.subjects.filter(s => !concerns(s, serie));
    if (!serie || !others.length) return `<div class="px-subjects">${e.subjects.map(subjectCard).join('')}</div>`;
    return `<h3 class="px-group">Pour ta série ${esc(serie)}</h3><div class="px-subjects">${mine.map(subjectCard).join('')}</div>
      <h3 class="px-group px-group-other">Autres séries</h3><div class="px-subjects">${others.map(subjectCard).join('')}</div>`;
  }

  async function openSubject(slug, sub = 'methode') {
    const view = $p('[data-view]');
    view.innerHTML = '<div class="cu-skel"></div>';
    let s;
    try { s = await api(`/prep/${state.exam.code}/${encodeURIComponent(slug)}`); }
    catch (e) { view.innerHTML = '<div class="cu-empty"><b>Matière indisponible</b></div>'; return; }
    view.innerHTML = `<div class="px-detail">
      <div class="px-detail-head"><button class="btn ghost" data-back>← ${esc(state.exam.name)}</button><h2>${iconFor(s.name)} ${esc(s.name)}</h2>${s.series ? `<span class="px-chip">${esc(s.series)}</span>` : ''}</div>
      <div class="px-tabs" role="tablist" data-subtabs>
        <button data-sub="methode">🧭 Méthode</button><button data-sub="sujets">📝 Sujets types</button><button data-sub="qcm">✅ QCM</button>
      </div><div data-subview></div></div>`;
    view.querySelector('[data-back]').onclick = () => { stopTimers(); renderTab(); };
    const show = name => {
      stopTimers();
      view.querySelectorAll('[data-sub]').forEach(b => b.setAttribute('aria-selected', b.dataset.sub === name));
      const box = view.querySelector('[data-subview]');
      if (name === 'methode') box.innerHTML = `<div class="px-card"><h3>Méthode pour réussir l'épreuve</h3><div class="lesson-richtext">${renderRichText(s.method)}</div></div>`;
      if (name === 'sujets') renderSujets(box, s);
      if (name === 'qcm') runQuiz(box, s);
    };
    view.querySelector('[data-subtabs]').onclick = ev => { const b = ev.target.closest('[data-sub]'); if (b) show(b.dataset.sub); };
    show(sub);
  }

  // ---- Sujets types ----
  function renderSujets(box, s) {
    if (!s.sujets.length) { box.innerHTML = '<div class="cu-empty"><b>Sujets en préparation</b></div>'; return; }
    box.innerHTML = s.sujets.map((sj, i) => `<article class="px-sujet" data-i="${i}">
      <header class="px-sujet-head"><h3>${esc(sj.title)}</h3><span class="px-timer" hidden></span></header>
      <div class="px-sujet-body"><div class="lesson-richtext">${renderRichText(sj.statement)}</div>
        <div class="px-sujet-actions">
          <button class="btn ghost" data-act="timer">⏱ Composer en temps limité</button>
          <button class="btn primary" data-act="correction">👀 Afficher le corrigé</button>
        </div>
        <div class="px-correction" hidden><h4>Corrigé détaillé</h4><div class="lesson-richtext">${renderRichText(sj.correction)}</div></div>
      </div></article>`).join('');
    box.onclick = ev => {
      const b = ev.target.closest('[data-act]'); if (!b) return;
      const art = b.closest('.px-sujet');
      if (b.dataset.act === 'correction') {
        const c = art.querySelector('.px-correction');
        if (c.hidden && !confirm('As-tu terminé ta copie ? Regarder le corrigé avant d\'avoir cherché réduit beaucoup l\'efficacité de l\'entraînement.')) return;
        c.hidden = !c.hidden; b.textContent = c.hidden ? '👀 Afficher le corrigé' : 'Masquer le corrigé';
      }
      if (b.dataset.act === 'timer') {
        const min = Number(prompt('Durée de l\'épreuve en minutes :', '60')); if (!min) return;
        const t = art.querySelector('.px-timer'); t.hidden = false; let left = min * 60;
        const tick = () => { const m = Math.floor(Math.abs(left) / 60), sec = Math.abs(left) % 60;
          t.textContent = `${left < 0 ? '+' : ''}${m}:${String(sec).padStart(2, '0')}`; t.classList.toggle('late', left < 0);
          if (left === 0) toast('⏰ Temps écoulé ! Pose ton stylo et relis-toi.'); left--; };
        tick(); state.timers.push(setInterval(tick, 1000)); b.disabled = true;
      }
    };
  }
  function stopTimers() { state.timers.forEach(clearInterval); state.timers = []; }

  // ---- QCM ----
  function runQuiz(box, s) {
    const questions = parseChecks(s.qcm, 0).sort(() => Math.random() - .5);
    if (!questions.length) { box.innerHTML = '<div class="cu-empty"><b>QCM en préparation</b></div>'; return; }
    let i = 0, score = 0; const missed = [];
    const draw = () => {
      const q = questions[i];
      box.innerHTML = `<div class="px-card px-quiz">
        <div class="px-quiz-top"><span>Question ${i + 1} / ${questions.length}</span><span>Score : ${score}</span></div>
        <div class="px-quiz-bar"><i style="width:${i * 100 / questions.length}%"></i></div>
        <p class="px-q">${inlineFormat(q.text)}</p>
        <div class="lr-check-choices">${q.choices.map((c, k) => `<button type="button" class="lr-choice px-choice" data-k="${k}"><b>${'ABCD'[k]}</b>${inlineFormat(c.t)}</button>`).join('')}</div>
        <div class="lr-check-feedback" hidden></div>
        <div class="px-quiz-foot"><button class="btn primary" data-next hidden>${i < questions.length - 1 ? 'Question suivante →' : 'Voir mon résultat'}</button></div></div>`;
      box.querySelectorAll('.px-choice').forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ok = q.choices[k].ok;
        box.querySelectorAll('.px-choice').forEach((x, n) => { x.disabled = true; if (q.choices[n].ok) x.classList.add('right'); });
        if (ok) score++; else { b.classList.add('wrong'); missed.push(q); }
        const fb = box.querySelector('.lr-check-feedback'); fb.hidden = false;
        fb.innerHTML = `<b>${ok ? '✓ Bonne réponse.' : '✗ Mauvaise réponse.'}</b> ${inlineFormat(q.why)}`;
        box.querySelector('[data-next]').hidden = false;
      });
      box.querySelector('[data-next]').onclick = () => { i++; i < questions.length ? draw() : finish(); };
    };
    const finish = async () => {
      const pct = Math.round(score * 100 / questions.length);
      const [cls, label] = pct >= 75 ? ['ok', 'Très bonne maîtrise'] : pct >= 50 ? ['mid', 'Maîtrise correcte, à consolider'] : ['ko', 'À retravailler : revois la méthode et les leçons'];
      box.innerHTML = `<div class="px-card px-result">
        <div class="px-score">${score}<small> / ${questions.length}</small></div>
        <span class="px-mention ${cls}">${pct} % · ${label}</span>
        <div><button class="btn primary" data-again>Recommencer le QCM</button></div>
        ${missed.length ? `<div class="px-review"><h3>À revoir</h3>${missed.map(q => `<div><b>${inlineFormat(q.text)}</b><br>Réponse : ${inlineFormat(q.choices.find(c => c.ok).t)}<br><span class="muted">${inlineFormat(q.why)}</span></div>`).join('')}</div>` : ''}</div>`;
      box.querySelector('[data-again]').onclick = () => runQuiz(box, s);
      try { await api('/prep/attempts', { method: 'POST', body: JSON.stringify({ exam: state.exam.code, subject: s.slug, score, total: questions.length }) }); toast('Résultat enregistré dans « Mes résultats »'); } catch (_) {}
    };
    draw();
  }

  // ---- Historique ----
  async function renderHistory(view) {
    view.innerHTML = '<div class="cu-skel"></div>';
    try {
      const rows = await api(`/prep/${state.exam.code}/history`);
      if (!rows.length) { view.innerHTML = '<div class="cu-empty"><b>Aucun résultat pour le moment</b>Fais ton premier QCM dans l\'onglet « Matières ».</div>'; return; }
      const avg = Math.round(rows.reduce((n, r) => n + r.score * 100 / r.total, 0) / rows.length);
      view.innerHTML = `<div class="px-card"><h3>Moyenne de tes ${rows.length} derniers QCM : ${avg} %</h3>
        <table class="px-history"><thead><tr><th>Matière</th><th>Score</th><th>Date</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td>${esc(r.subject)}</td><td><b>${r.score}/${r.total}</b> (${Math.round(r.score * 100 / r.total)} %)</td><td>${new Date(r.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td></tr>`).join('')}
        </tbody></table></div>`;
    } catch (e) { view.innerHTML = '<div class="cu-empty"><b>Résultats indisponibles</b></div>'; }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
