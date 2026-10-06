const API = '/api';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

async function api(path, opts = {}) {
  const method = (opts.method || 'GET').toUpperCase();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (!['GET','HEAD','OPTIONS'].includes(method) && path !== '/auth/register') {
    try { const c = await fetch(API + '/auth/csrf', { credentials: 'same-origin' }); const cj = await c.json(); if (cj.token) headers[cj.headerName || 'X-CSRF-TOKEN'] = cj.token; } catch (_) {}
  }
  const r = await fetch(API + path, { credentials: 'same-origin', headers, ...opts });
  if (!r.ok) { const text = await r.text(); throw new Error(text || `Erreur HTTP ${r.status}`); }
  return r.status === 204 ? null : r.json();
}

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function esc(x) {
  return String(x ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function nav() {
  let p = location.pathname;
  $$('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === p));
  let b = $('.mobile-menu');
  if (b) b.onclick = () => $('.sidebar').classList.toggle('open');
}

const courseCache = {};

function courseCard(x, opts = {}) {
  if (x.id) courseCache[x.id] = x;
  const img = esc(x.coverImage || '/vendor/images/pexels-53621.jpg');
  const desc = x.description ? `<p class="course-desc">${esc(x.description)}</p>` : '';
  const meta = (x.duration || x.difficulty)
    ? `<div class="course-meta">${x.duration ? `<span>⏱ ${esc(x.duration)}</span>` : ''}${x.difficulty ? `<span>🎯 ${esc(x.difficulty)}</span>` : ''}</div>`
    : '';
  const progress = opts.showProgress
    ? `<div class="progress"><i style="width:${Math.min(95, 45 + (x.id || 1) * 7)}%"></i></div>`
    : '';
  const btnClass = opts.primary ? 'btn primary' : 'btn ghost';
  const btnLabel = opts.primary ? 'Voir le parcours →' : 'Continuer →';
  const target = `/programme?level=${encodeURIComponent(x.level || '')}&subject=${encodeURIComponent(x.subject || '')}`;
  return `<article class="card course-card">
    <img src="${img}" alt="${esc(x.title)}">
    <div class="course-body">
      <span class="pill">${esc(x.level || 'Tous')}</span>
      <h3>${esc(x.title)}</h3>
      <p>${esc(x.subject || 'Cours')} · ${esc(x.type || 'Parcours')}</p>
      ${desc}
      ${meta}
      ${progress}
      <a class="${btnClass}" href="${target}">${btnLabel}</a>
    </div>
  </article>`;
}

function ensureLessonModal() {
  let m = $('#lessonModal');
  if (m) return m;
  m = document.createElement('div');
  m.id = 'lessonModal';
  m.className = 'modal-overlay';
  m.innerHTML = `<div class="modal">
    <button class="modal-close" onclick="closeLesson()">✕</button>
    <img id="lessonImg" src="" alt="">
    <div class="modal-body">
      <span class="pill" id="lessonPill"></span>
      <h2 id="lessonTitle"></h2>
      <div class="course-meta" id="lessonMeta"></div>
      <div id="lessonContent" class="lesson-content"></div>
      <div class="modal-actions">
        <button class="btn ghost" onclick="closeLesson()">Fermer</button>
        <button class="btn primary" id="lessonDoneBtn">Marquer comme terminé ✓</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) closeLesson(); });
  return m;
}

async function openLesson(id) {
  let x = courseCache[id];
  if (!x) {
    try { x = await api('/courses/' + id); } catch (e) { toast('Cours introuvable'); return; }
  }
  const m = ensureLessonModal();
  $('#lessonImg').src = x.coverImage || '/vendor/images/pexels-53621.jpg';
  $('#lessonImg').alt = x.title;
  $('#lessonPill').textContent = `${x.level || ''} · ${x.subject || ''}`;
  $('#lessonTitle').textContent = x.title;
  $('#lessonMeta').innerHTML = `${x.duration ? `<span>⏱ ${esc(x.duration)}</span>` : ''}${x.difficulty ? `<span>🎯 ${esc(x.difficulty)}</span>` : ''}${x.type ? `<span>${esc(x.type)}</span>` : ''}`;
  const body = x.content || x.description || 'Contenu à venir pour ce cours.';
  $('#lessonContent').innerHTML = body.split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join('');
  const doneBtn = $('#lessonDoneBtn');
  doneBtn.onclick = () => finishLesson(x);
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLesson() {
  const m = $('#lessonModal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

async function finishLesson(x) {
  const studentId = localStorage.getItem('edufunStudentId');
  if (studentId) {
    try { await api(`/students/${studentId}/progress?xp=10`, { method: 'PATCH' }); } catch (e) {}
    toast(`Bravo, +10 XP pour « ${x.title} » 🏆`);
  } else {
    toast(`« ${x.title} » terminé ! Inscris-toi pour suivre ta progression 🎉`);
  }
  closeLesson();
}

// ---- Session : un seul appel /auth/me partagé par la page ----
let mePromise = null;
function currentUser() {
  if (!mePromise) mePromise = api('/auth/me').catch(() => ({ authenticated: false }));
  return mePromise;
}

// Adapte le menu à la personne connectée (élève, administrateur ou visiteur).
async function applySessionNav() {
  if (!$('.nav')) return;
  const me = await currentUser();
  const hide = sel => $$(sel).forEach(e => e.hidden = true);
  if (me.authenticated) {
    hide('.nav a[href="/inscription"], .nav a[href="/login"]');
    if (me.role !== 'ADMIN') hide('.nav a[href="/administration"]');
  } else {
    hide('.nav a[href="/administration"], .nav .logout-form');
  }
}

// ---- Tableau de bord élève ----
const SUBJECT_ICONS = {
  'Français': '📖', 'Mathématiques': '📐', 'Anglais': '🇬🇧', 'Sciences': '🔬', 'SVT': '🧬', 'Physique-Chimie': '⚗️',
  'Histoire-Géographie': '🌍', 'EDHC': '🤝', 'EPS': '⚽', 'Arts': '🎨', 'Arts Plastiques': '🎨', 'Éducation Musicale': '🎵',
  'Informatique': '💻', 'Développement Web': '🌐', 'Philosophie': '💭', 'Espagnol': '🇪🇸'
};
const ACTIVITY_ICONS = { LESSON: '📘', QUIZ: '🧠', EXAM: '🏆' };
const fmtInt = n => Number(n || 0).toLocaleString('fr-FR');
const plural = (n, one, many) => `${fmtInt(n)} ${Number(n) > 1 ? many : one}`;

function setText(sel, value) { const e = $(sel); if (e) e.textContent = value; }

function relativeDate(iso) {
  if (!iso) return '';
  const d = new Date(iso), today = new Date();
  const days = Math.round((new Date(today.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} j`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function initials(name) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0] || '').join('').toUpperCase() || '?';
}

async function loadDashboard() {
  const root = $('#studentDashboard');
  setText('[data-today]', new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  const me = await currentUser();
  if (!me.authenticated) { location.href = '/login'; return; }
  if (!me.studentId) { location.href = me.role === 'ADMIN' ? '/administration' : '/login'; return; }
  localStorage.setItem('edufunStudentId', me.studentId);
  localStorage.setItem('edufunStudentName', me.name || '');
  setText('[data-user-first]', (me.name || '').trim().split(/\s+/)[0] || 'à toi');
  setText('[data-user-name]', me.name || 'Mon espace');
  setText('[data-user-level]', me.level ? `Élève de ${me.level}` : '');
  setText('[data-user-initials]', initials(me.name));

  let d;
  try { d = await api('/student-dashboard/' + me.studentId); }
  catch (e) { toast('Impossible de charger ton espace. Réessaie dans un instant.'); return; }
  finally { if (root) root.removeAttribute('aria-busy'); }

  const level = d.student.level;
  const programUrl = `/programme?level=${encodeURIComponent(level)}`;
  $$('[data-program-link]').forEach(a => a.href = programUrl);
  setText('[data-subjects-caption]', `Programme de ${level} · ${plural(d.subjects.length, 'matière', 'matières')}`);

  renderContinue(d, programUrl);
  renderLevelRing(d.levelProgress);
  renderKpis(d);
  renderSubjects(d.subjects, level);
  renderNextBadge(d.badges.next, d.student.xp);
  renderWeek(d.week);
  renderActivity(d.recentActivity);
  renderBadges(d.badges.items);
  setText('[data-quiz-sub]', d.quiz.attempts ? `${plural(d.quiz.passed, 'quiz réussi', 'quiz réussis')} sur ${fmtInt(d.quiz.attempts)}` : 'Teste tes connaissances');
  setText('[data-exam-sub]', d.exams.pending ? `${plural(d.exams.pending, 'épreuve', 'épreuves')} en correction` : 'Simulations BEPC et BAC');
}

function renderContinue(d, programUrl) {
  const c = d.continueLesson;
  const link = $('[data-continue-link]');
  if (!c) {
    setText('[data-continue-eyebrow]', 'Programme terminé');
    setText('[data-continue-title]', `Bravo, tu as terminé tout le programme de ${d.student.level} !`);
    setText('[data-continue-meta]', 'Révise avec les quiz et prépare tes examens.');
    if (link) { link.textContent = 'Faire un quiz →'; link.href = '/quiz'; }
    return;
  }
  const first = d.completedLessons === 0;
  setText('[data-continue-eyebrow]', first ? 'Ta première leçon' : (c.resumed ? 'Reprends où tu t’es arrêté' : 'Ton prochain pas'));
  setText('[data-continue-title]', c.title);
  setText('[data-continue-meta]', `${c.subject} · ${c.chapter} · ${c.duration || '30 min'}`);
  setText('[data-continue-objective]', c.objective || '');
  if (link) { link.href = '/lecon/' + c.id; link.textContent = first ? 'Commencer la leçon →' : 'Reprendre la leçon →'; }
}

function renderLevelRing(p) {
  const ring = $('[data-ring]');
  if (ring) {
    const length = 2 * Math.PI * 52;
    ring.style.opacity = p.completed ? 1 : 0;
    requestAnimationFrame(() => ring.style.strokeDashoffset = length * (1 - Math.min(100, p.percent) / 100));
  }
  setText('[data-level-percent]', `${p.percent} %`);
  setText('[data-level-count]', `${fmtInt(p.completed)} / ${fmtInt(p.total)} leçons`);
}

function renderKpis(d) {
  setText('[data-kpi-lessons]', fmtInt(d.completedLessons));
  setText('[data-kpi-lessons-sub]', `${fmtInt(d.levelProgress.completed)} sur ${fmtInt(d.levelProgress.total)} en ${d.student.level}`);
  setText('[data-kpi-xp]', fmtInt(d.student.xp));
  setText('[data-kpi-xp-sub]', `dont ${fmtInt(d.lessonXp)} XP de leçons`);
  setText('[data-kpi-streak]', plural(d.streak, 'jour', 'jours'));
  setText('[data-kpi-streak-sub]', d.streak ? 'Continue sur ta lancée !' : 'Termine une leçon pour démarrer');
  setText('[data-kpi-badges]', `${fmtInt(d.badges.earned)} / ${fmtInt(d.badges.total)}`);
  setText('[data-kpi-badges-sub]', d.badges.next ? `Prochain : ${d.badges.next.name}` : 'Collection complète');
}

function renderSubjects(subjects, level) {
  const box = $('[data-subjects]');
  if (!box) return;
  if (!subjects.length) { box.innerHTML = `<div class="sd-empty"><b>Aucune leçon publiée pour ${esc(level)}</b>Le programme de ton niveau sera bientôt disponible.</div>`; return; }
  box.innerHTML = subjects.map(s => {
    const done = s.completed >= s.total;
    const href = s.nextLessonId ? `/lecon/${s.nextLessonId}` : `/programme?level=${encodeURIComponent(level)}&subject=${encodeURIComponent(s.subject)}`;
    return `<a class="sd-subject" href="${href}">
      <span class="sd-subject-icon" aria-hidden="true">${SUBJECT_ICONS[s.subject] || '📚'}</span>
      <span class="sd-subject-body">
        <span class="sd-subject-row"><span class="sd-subject-name">${esc(s.subject)}</span><span class="sd-subject-count">${s.completed}/${s.total} · ${s.percent} %</span></span>
        <span class="sd-subject-next">${done ? 'Toutes les leçons sont terminées' : 'Suivant : ' + esc(s.nextLessonTitle)}</span>
        <span class="sd-bar" role="progressbar" aria-label="${esc(s.subject)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.percent}"><i data-w="${s.percent}"></i></span>
      </span>
      <span class="sd-subject-go ${done ? 'done' : ''}">${done ? '✓ Terminé' : s.completed ? 'Continuer' : 'Commencer'}</span>
    </a>`;
  }).join('');
  requestAnimationFrame(() => box.querySelectorAll('[data-w]').forEach(i => i.style.width = i.dataset.w + '%'));
}

function renderNextBadge(next, xp) {
  const box = $('[data-next-badge]');
  if (!box) return;
  const head = '<div class="sd-panel-head"><h3>Prochain badge</h3></div>';
  if (!next) { box.innerHTML = head + '<div class="sd-empty"><b>🏆 Collection complète</b>Tu as obtenu tous les badges disponibles.</div>'; return; }
  box.innerHTML = head + `<div class="sd-nextbadge-body"><span class="sd-nextbadge-icon" aria-hidden="true">${esc(next.icon)}</span>
      <div><b>${esc(next.name)}</b><p>${esc(next.description)}</p></div></div>
    <div class="sd-bar" role="progressbar" aria-label="Progression vers ${esc(next.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${next.percent}"><i data-w="${next.percent}"></i></div>
    <div class="sd-nextbadge-foot"><span>${fmtInt(xp)} / ${fmtInt(next.xpRequired)} XP</span><span>encore ${fmtInt(next.remaining)} XP</span></div>`;
  requestAnimationFrame(() => box.querySelectorAll('[data-w]').forEach(i => i.style.width = i.dataset.w + '%'));
}

function renderWeek(week) {
  const box = $('[data-week]');
  if (!box) return;
  const max = Math.max(1, ...week.map(w => w.lessons));
  const total = week.reduce((n, w) => n + w.lessons, 0);
  setText('[data-week-total]', plural(total, 'leçon', 'leçons'));
  const todayIso = new Date().toLocaleDateString('sv-SE');
  box.innerHTML = week.map(w => {
    const day = new Date(w.date + 'T12:00:00');
    const label = day.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
    const full = day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const tip = `${full} · ${plural(w.lessons, 'leçon', 'leçons')}`;
    return `<div class="sd-day ${w.date === todayIso ? 'today' : ''}" role="listitem" tabindex="0" aria-label="${esc(tip)}">
      <div class="sd-day-track"><span class="sd-day-bar ${w.lessons ? '' : 'zero'}" data-h="${w.lessons ? Math.max(6, w.lessons / max * 100) : 2}" style="height:0"></span></div>
      <span class="sd-day-label">${esc(label)}</span><span class="sd-day-tip">${esc(tip)}</span></div>`;
  }).join('');
  requestAnimationFrame(() => box.querySelectorAll('[data-h]').forEach(b => b.style.height = b.dataset.h + '%'));
}

function renderActivity(items) {
  const box = $('[data-activity]');
  if (!box) return;
  if (!items.length) { box.innerHTML = '<li class="sd-empty"><b>Rien pour le moment</b>Tes leçons terminées, quiz et examens apparaîtront ici.</li>'; return; }
  box.innerHTML = items.map(a => `<li><a href="${esc(a.href)}">
      <span class="sd-activity-icon ${esc(a.type)}" aria-hidden="true">${ACTIVITY_ICONS[a.type] || '•'}</span>
      <span><b>${esc(a.title)}</b><small>${esc(a.detail)}</small></span>
      <time datetime="${esc(a.at)}">${esc(relativeDate(a.at))}</time></a></li>`).join('');
}

function renderBadges(items) {
  const box = $('[data-badges]');
  if (!box) return;
  box.innerHTML = items.map(b => `<div class="sd-badge ${b.earned ? '' : 'locked'}">
      <span class="sd-badge-icon" aria-hidden="true">${esc(b.icon)}</span>
      <div><b>${esc(b.name)}</b><small>${b.earned ? 'Obtenu ' + esc(relativeDate(b.awardedAt).toLowerCase()) : fmtInt(b.xpRequired) + ' XP requis'}</small></div>
    </div>`).join('') || '<div class="sd-empty">Aucun badge configuré.</div>';
}

async function registerStudent(f) {
  let d = Object.fromEntries(new FormData(f));
  const confirm = d.passwordConfirm;
  delete d.passwordConfirm;
  if (!d.password || d.password.length < 8) { toast('Le mot de passe doit contenir au moins 8 caractères.'); return; }
  if (d.password !== confirm) { toast('Les deux mots de passe ne correspondent pas.'); return; }
  try {
    const x = await api('/auth/register', { method: 'POST', body: JSON.stringify(d) });
    localStorage.setItem('edufunStudentId', x.studentId);
    localStorage.setItem('edufunStudentName', x.name || d.name);
    toast('Espace créé avec succès 🎉');
    setTimeout(() => location.href = '/dashboard', 500);
  } catch (e) {
    let msg = e.message || '';
    try { const parsed = JSON.parse(msg); msg = parsed.message || msg; } catch (_) {}
    toast(msg.includes('déjà') ? msg : 'Impossible de créer ton espace. Vérifie les informations saisies.');
  }
}

async function registerTutor(f) {
  let d = Object.fromEntries(new FormData(f));
  d.status = 'PENDING';
  try {
    await api('/tutors', { method: 'POST', body: JSON.stringify(d) });
    toast('Candidature envoyée à l’administration 👨‍🏫');
    f.reset();
    loadTutors();
  } catch (e) { toast('Erreur candidature'); }
}

async function loadCourses(level) {
  const params = new URLSearchParams(location.search);
  if (level === undefined) level = params.get('level') || '';
  try {
    let c = await api('/courses' + (level ? '?level=' + encodeURIComponent(level) : ''));
    let box = $('#coursesList');
    if (!box) return;
    box.innerHTML = c.map(x => courseCard(x, { primary: true, showProgress: true })).join('')
      || '<div class="empty">Aucun cours pour ce niveau.</div>';
  } catch (e) { toast('Erreur catalogue'); }
}

function setupTabs() {
  const wrap = $('#levelTabs');
  if (!wrap) return;
  const params = new URLSearchParams(location.search);
  const current = params.get('level') || '';
  const buttons = $$('#levelTabs button');
  buttons.forEach(b => b.classList.toggle('active', (b.dataset.level || '') === current));
  wrap.onclick = e => {
    const btn = e.target.closest('button[data-level]');
    if (!btn) return;
    const level = btn.dataset.level || '';
    buttons.forEach(b => b.classList.toggle('active', b === btn));
    const url = level ? `/programme?level=${encodeURIComponent(level)}` : '/programme';
    history.pushState({ level }, '', url);
    loadCourses(level);
  };
}

async function openLessonByTitle(title) {
  let x = Object.values(courseCache).find(c => c.title === title);
  if (!x) {
    try {
      const all = await api('/courses');
      x = all.find(c => c.title === title);
    } catch (e) {}
  }
  if (x) openLesson(x.id); else toast('Cours introuvable pour le moment.');
}

async function loadTutors() {
  try {
    let t = await api('/tutors'), box = $('#tutorsList');
    if (!box) return;
    box.innerHTML = t.map(x => `<tr>
      <td><b>${esc(x.name)}</b><br><span class="muted">${esc(x.email)}</span></td>
      <td>${esc(x.specialties)}</td>
      <td>${esc(x.levels)}</td>
      <td><span class="pill">${esc(x.status)}</span></td>
      <td>${x.status === 'PENDING'
        ? `<button class="btn success" onclick="approveTutor(${x.id})">Valider</button> <button class="btn danger" onclick="rejectTutor(${x.id})">Refuser</button>`
        : '<span class="muted">Disponible au suivi</span>'}</td>
    </tr>`).join('') || '<tr><td colspan="5" class="empty">Aucune candidature.</td></tr>';
  } catch (e) { toast('Erreur répétiteurs'); }
}

async function approveTutor(id) { await api(`/tutors/${id}/approve`, { method: 'PATCH' }); toast('Répétiteur validé ✅'); loadTutors(); loadDashboard(); }
async function rejectTutor(id) { await api(`/tutors/${id}/reject`, { method: 'PATCH' }); toast('Candidature refusée'); loadTutors(); loadDashboard(); }

async function submitExam(f) {
  let d = Object.fromEntries(new FormData(f));
  d.studentId = Number(localStorage.getItem('edufunStudentId') || 0);
  d.score = Number(d.score || 0);
  d.total = Number(d.total || 20);
  d.minutes = Number(d.minutes || 30);
  d.status = 'PENDING_REVIEW';
  try {
    await api('/exams', { method: 'POST', body: JSON.stringify(d) });
    toast('Épreuve envoyée. Résultat après correction administrative. 📩');
    f.reset();
  } catch (e) { toast('Impossible d’envoyer'); }
}

async function loadAdmin() {
  try {
    let [s, c, t, e, d] = await Promise.all([api('/students'), api('/courses'), api('/tutors'), api('/exams'), api('/dashboard')]);
    $('#adminStudents').innerHTML = s.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${esc(x.level)}</td><td>${x.xp} XP</td><td><button class="btn danger" onclick="deleteStudent(${x.id})">Supprimer</button></td></tr>`).join('') || '<tr><td colspan="5" class="empty">Aucun élève</td></tr>';
    $('#adminCourses').innerHTML = c.map(x => `<tr><td>${esc(x.title)}</td><td>${esc(x.level)}</td><td>${esc(x.subject)}</td><td>${esc(x.status)}</td><td><button class="btn danger" onclick="deleteCourse(${x.id})">Supprimer</button></td></tr>`).join('') || '<tr><td colspan="5" class="empty">Aucun cours</td></tr>';
    $('#adminExams').innerHTML = e.map(x => `<tr><td>#${x.id}</td><td>${esc(x.examType)}</td><td>${esc(x.level)}</td><td>${x.score}/${x.total}</td><td><span class="pill">${esc(x.status)}</span></td><td>${x.status === 'PENDING_REVIEW' ? `<button class="btn success" onclick="reviewExam(${x.id},${x.total})">Corriger</button>` : '—'}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Aucune épreuve</td></tr>';
    if ($('#adminPending')) $('#adminPending').textContent = d.pendingTutors;
  } catch (e) { toast('Erreur administration'); }
}

async function deleteStudent(id) { if (confirm('Supprimer cet élève ?')) { await api('/students/' + id, { method: 'DELETE' }); toast('Élève supprimé'); loadAdmin(); } }
async function deleteCourse(id) { if (confirm('Supprimer ce cours ?')) { await api('/courses/' + id, { method: 'DELETE' }); toast('Cours supprimé'); loadAdmin(); } }

async function reviewExam(id, total) {
  let v = prompt(`Note sur ${total} :`, total);
  if (v === null) return;
  let n = Math.max(0, Math.min(total, Number(v) || 0));
  let st = n / total >= .5 ? 'PASSED' : 'FAILED';
  await api(`/exams/${id}/review?score=${n}`, { method: 'PATCH' });
  toast(st === 'PASSED' ? 'Réussite 🏆' : 'Épreuve corrigée');
  loadAdmin();
}

function setup() {
  let f = $('#studentForm'); if (f) f.onsubmit = e => { e.preventDefault(); registerStudent(f); };
  f = $('#tutorForm'); if (f) f.onsubmit = e => { e.preventDefault(); registerTutor(f); };
  f = $('#examForm'); if (f) f.onsubmit = e => { e.preventDefault(); submitExam(f); };
  f = $('#courseForm'); if (f) f.onsubmit = async e => {
    e.preventDefault();
    try {
      await api('/courses', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(f))) });
      toast('Cours publié 📚');
      f.reset();
      loadAdmin();
    } catch (x) { toast('Erreur de création'); }
  };
}

window.addEventListener('popstate', e => {
  if ($('#levelTabs')) { setupTabs(); loadCourses(); }
});

document.addEventListener('DOMContentLoaded', () => {
  nav();
  setup();
  applySessionNav();
  if ($('#studentDashboard')) loadDashboard();
  if ($('#coursesList')) { setupTabs(); loadCourses(); }
  if ($('#tutorsList')) loadTutors();
  if ($('#adminStudents')) loadAdmin();
});

// ---- EduFun Curriculum V3 ----
let selectedLevel = '';
let selectedSubject = '';
const lessonCache = {};

function lessonCard(l, i) {
  lessonCache[l.id] = l;
  const preview = (l.content || '').split(/\n\n+/)[0];
  return `<article class="card lesson-card">
    <span class="lesson-number">${i + 1}</span>
    <span class="pill">${esc(l.level)} · ${esc(l.subject)}</span>
    <h3>${esc(l.title)}</h3>
    <p class="muted"><b>${esc(l.chapter)}</b> · ${esc(l.duration || '20 min')}</p>
    <p class="lesson-content">${esc(preview)}</p>
    <div class="lesson-actions">
      <button class="btn primary" onclick="location.href='/lecon/'+${l.id}">Commencer</button>
      <button class="btn ghost" onclick="openLessonVideos(${l.id})">🎥 Vidéo</button>
    </div>
  </article>`;
}

async function loadCurriculum(level = selectedLevel, subject = selectedSubject) {
  selectedLevel = level || '';
  selectedSubject = subject || '';
  const box = $('#curriculumList');
  if (!box) return;
  if (!selectedLevel) {
    box.innerHTML = '<div class="card empty">Choisis une classe pour afficher son parcours complet : CP1 → Terminale.</div>';
    if ($('#programCount')) $('#programCount').textContent = '13 niveaux';
    return;
  }
  try {
    const q = new URLSearchParams({ level: selectedLevel });
    if (selectedSubject) q.set('subject', selectedSubject);
    const data = await api('/curriculum?' + q.toString());
    data.forEach(x => lessonCache[x.id] = x);
    box.innerHTML = data.map((x,i) => lessonCard(x,i)).join('') || '<div class="card empty">Aucune leçon publiée pour ce filtre.</div>';
    if ($('#programCount')) $('#programCount').textContent = `${data.length} leçons`;
  } catch (e) { box.innerHTML = '<div class="card empty">Impossible de charger le programme.</div>'; toast('Erreur programme'); }
}

async function populateSubjects() {
  const s = $('#subjectSelect');
  if (!s) return;
  try {
    const map = await api('/subjects');
    const all = [...new Set(Object.values(map).flat())].sort((a,b)=>a.localeCompare(b,'fr'));
    s.innerHTML = '<option value="">Toutes les matières</option>' + all.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
    s.value = selectedSubject;
  } catch (e) {}
}

function setupCurriculum() {
  const tabs = $('#levelTabs');
  if (!tabs) return;
  const params = new URLSearchParams(location.search);
  selectedLevel = params.get('level') || '';
  selectedSubject = params.get('subject') || '';
  [...tabs.querySelectorAll('button[data-level]')].forEach(b => b.classList.toggle('active', b.dataset.level === selectedLevel));
  tabs.onclick = e => {
    const b = e.target.closest('button[data-level]'); if (!b) return;
    selectedLevel = b.dataset.level || '';
    [...tabs.querySelectorAll('button[data-level]')].forEach(x => x.classList.toggle('active', x === b));
    history.pushState({}, '', selectedLevel ? `/programme?level=${encodeURIComponent(selectedLevel)}` : '/programme');
    loadCurriculum(selectedLevel, selectedSubject);
  };
  const s = $('#subjectSelect'); if (s) s.onchange = () => { selectedSubject = s.value; loadCurriculum(selectedLevel, selectedSubject); };
  populateSubjects().then(() => loadCurriculum(selectedLevel, selectedSubject));
}

function ensureLearningModal() {
  let m = $('#learningModal'); if (m) return m;
  m = document.createElement('div'); m.id='learningModal'; m.className='modal-overlay';
  m.innerHTML=`<div class="modal"><button class="modal-close" onclick="closeLearningLesson()">✕</button><div class="modal-body"><span id="learningPill" class="pill"></span><h2 id="learningTitle"></h2><p id="learningObjective" class="muted"></p><div id="learningVideo"></div><div id="learningContent" class="lesson-content"></div><div class="modal-actions"><button class="btn ghost" onclick="closeLearningLesson()">Fermer</button><button class="btn primary" id="learningDone">Terminer la leçon +20 XP</button></div></div></div>`;
  document.body.appendChild(m); m.onclick=e=>{if(e.target===m)closeLearningLesson()}; return m;
}

async function openLearningLesson(id) {
  const l = lessonCache[id] || await api('/lessons/'+id); lessonCache[id]=l;
  const m=ensureLearningModal(); $('#learningPill').textContent=`${l.level} · ${l.subject} · ${l.chapter}`; $('#learningTitle').textContent=l.title; $('#learningObjective').textContent=l.objective||'';
  $('#learningContent').innerHTML=(l.content||'').split(/\n\n+/).map(p=>`<p>${esc(p)}</p>`).join('');
  $('#learningVideo').innerHTML='<div class="card" style="margin:14px 0;background:#faf9ff"><b>🎥 Vidéo didactique</b><p class="muted">Aucune vidéo publiée pour cette leçon. L’administrateur peut en ajouter une depuis l’espace Administration.</p></div>';
  try { const vs=await api('/lessons/'+id+'/videos'); if(vs.length){const v=vs[0]; $('#learningVideo').innerHTML=`<div class="card" style="margin:14px 0"><b>🎥 ${esc(v.title)}</b><p class="muted">${esc(v.type)}</p><a class="btn ghost" target="_blank" rel="noopener" href="${esc(v.url)}">Ouvrir la vidéo →</a></div>`;} } catch(e){}
  $('#learningDone').onclick=()=>completeLearningLesson(l); m.classList.add('open'); document.body.style.overflow='hidden';
}
function closeLearningLesson(){const m=$('#learningModal');if(m)m.classList.remove('open');document.body.style.overflow='';}
async function completeLearningLesson(l){const sid=localStorage.getItem('edufunStudentId');if(!sid){toast('Inscris-toi pour enregistrer ta progression.');return;}try{const r=await api(`/lessons/${l.id}/complete?studentId=${sid}`,{method:'POST'});toast(r.alreadyCompleted?'Leçon déjà terminée ✓':`Bravo ! +20 XP · ${r.xp} XP au total 🏆`);closeLearningLesson();}catch(e){toast('Impossible d’enregistrer la progression.');}}
async function openLessonVideos(id){try{const v=await api('/lessons/'+id+'/videos'); if(!v.length){toast('Aucune vidéo publiée pour le moment.');return;} window.open(v[0].url,'_blank','noopener');}catch(e){toast('Vidéo indisponible');}}

window.addEventListener('DOMContentLoaded',()=>{if($('#curriculumList'))setupCurriculum();});
window.addEventListener('DOMContentLoaded',()=>{
  const lf=$('#lessonForm'); if(lf) lf.onsubmit=async e=>{e.preventDefault();try{const d=Object.fromEntries(new FormData(lf));d.orderIndex=999;await api('/lessons',{method:'POST',body:JSON.stringify(d)});toast('Leçon publiée 📚');lf.reset();}catch(x){toast('Erreur de création de la leçon');}};
  const vf=$('#videoForm'); if(vf) vf.onsubmit=async e=>{e.preventDefault();try{const d=Object.fromEntries(new FormData(vf));d.lessonId=Number(d.lessonId);d.published=true;await api('/videos',{method:'POST',body:JSON.stringify(d)});toast('Vidéo publiée 🎥');vf.reset();}catch(x){toast('Erreur de publication vidéo');}};
});

async function loadQuizzes(){const box=$('#quizGrid');if(!box)return;try{const qs=await api('/quizzes');box.innerHTML=qs.map(q=>`<div class="card"><span class="pill">${esc(q.level||'Tous')} · ${esc(q.subject||'Général')}</span><h3>${esc(q.title)}</h3><p class="muted">Validation à ${q.passingScore}% · défi interactif</p><button class="btn primary" onclick="startQuiz(${q.id})">Commencer →</button></div>`).join('')||'<div class="empty">Aucun quiz publié.</div>';}catch(e){toast('Erreur quiz');}}
async function startQuiz(id){const area=$('#quizArea');if(!area)return;try{const d=await api('/quizzes/'+id), qs=d.questions||[];area.classList.remove('hidden');area.innerHTML=`<div class="section-head" style="margin-top:0"><div><span class="pill">${esc(d.quiz.level)} · ${esc(d.quiz.subject)}</span><h2>${esc(d.quiz.title)}</h2></div><button class="btn ghost" onclick="$('#quizArea').classList.add('hidden')">Fermer</button></div><form id="activeQuiz" class="form">${qs.map((q,i)=>`<div class="card" style="background:#faf9ff"><b>${i+1}. ${esc(q.question)}</b><div class="quiz-options">${(q.options||'').split('|').map(o=>`<label><input type="radio" name="q${q.id}" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</div></div>`).join('')}<button class="btn primary">Valider mes réponses</button></form>`;$('#activeQuiz').onsubmit=e=>submitQuiz(e,d.quiz,qs);}catch(e){toast('Impossible d’ouvrir le quiz');}}
async function submitQuiz(e,quiz,qs){e.preventDefault();const sid=Number(localStorage.getItem('edufunStudentId')||0);if(!sid){toast('Inscris-toi pour enregistrer ton score.');return;}const fd=new FormData(e.target);let score=0;qs.forEach(q=>{if(fd.get('q'+q.id)===q.correctAnswer)score+=q.points||1;});try{const r=await api('/quiz-attempts',{method:'POST',body:JSON.stringify({quizId:quiz.id,studentId:sid,score,total:qs.reduce((n,q)=>n+(q.points||1),0)})});toast(r.passed?`Excellent ! +50 XP 🎉 Score ${r.score}/${r.total}`:`Continue tes efforts 💪 Score ${r.score}/${r.total}`);e.target.querySelectorAll('input').forEach(x=>x.disabled=true);}catch(x){toast('Erreur lors de l’enregistrement');}}
async function loadCertificates(){const box=$('#certList');if(!box)return;const sid=localStorage.getItem('edufunStudentId');if(!sid){box.innerHTML='<div class="empty">Inscris-toi pour accéder à tes certificats.</div>';return;}try{const cs=await api('/certificates?studentId='+sid);box.innerHTML=cs.map(c=>`<div class="card"><span class="pill">🎓 Certifié</span><h3>${esc(c.title||'Parcours EduFun')}</h3><p class="muted">${esc(c.level||'')} · Score ${c.score??'-'}</p><b>${esc(c.certificateNumber)}</b><p class="muted">Délivré le ${new Date(c.issuedAt).toLocaleDateString('fr-FR')}</p></div>`).join('')||'<div class="empty">Aucun certificat pour le moment.</div>';}catch(e){toast('Erreur certificats');}}
window.addEventListener('DOMContentLoaded',()=>{if($('#quizGrid'))loadQuizzes();if($('#certList'))loadCertificates();});


async function loadLessonReader(){
  const root=$('#lessonReader'); if(!root)return;
  const id=Number(root.dataset.lessonId || location.pathname.split('/').pop()); if(!id)return;
  try{
    const l=await api('/lessons/'+id);
    const all=await api('/curriculum?level='+encodeURIComponent(l.level)+'&subject='+encodeURIComponent(l.subject));
    const index=all.findIndex(x=>x.id===l.id), prev=all[index-1], next=all[index+1];
    $('#readerCrumb').textContent=`${l.level} · ${l.subject} · ${l.chapter}`;
    $('#readerTitle').textContent=l.title;
    $('#readerObjective').textContent=l.objective||'';
    $('#readerDuration').textContent=l.duration||'30 min';
    const parts=(l.content||'').split(/\n\n+/);
    $('#readerContent').innerHTML=parts.map((part,i)=>{
      const lines=part.split('\n'); const heading=lines[0]; const body=lines.slice(1).join('\n');
      return `<section class="lesson-section"><span class="lesson-index">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(heading)}</h3><div class="lesson-richtext">${esc(body||heading).replace(/\n/g,'<br>')}</div></div></section>`;
    }).join('');
    $('#readerPrev').disabled=!prev; $('#readerNext').disabled=!next;
    $('#readerPrev').onclick=()=>{if(prev)location.href='/lecon/'+prev.id};
    $('#readerNext').onclick=()=>{if(next)location.href='/lecon/'+next.id};
    $('#readerDone').onclick=async()=>{const sid=localStorage.getItem('edufunStudentId');if(!sid){toast('Inscris-toi pour enregistrer ta progression.');return;}try{const r=await api(`/lessons/${l.id}/complete?studentId=${sid}`,{method:'POST'});toast(r.alreadyCompleted?'Leçon déjà terminée ✓':`Leçon validée · +20 XP · ${r.xp} XP`);$('#readerDone').textContent='✓ Leçon terminée';$('#readerDone').disabled=true;}catch(e){toast('Impossible d’enregistrer la progression.')}};
    try{const sid=localStorage.getItem('edufunStudentId');if(sid){const pr=await api(`/students/${sid}/progress`);if((pr.records||[]).some(r=>r.lessonId===l.id&&r.completed)){$('#readerDone').textContent='✓ Leçon terminée';$('#readerDone').disabled=true;}}}catch(_){}
    const list=$('#readerLessons'); list.innerHTML=all.map((x,i)=>`<a class="reader-lesson ${x.id===l.id?'active':''}" href="/lecon/${x.id}"><span>${String(i+1).padStart(2,'0')}</span><div><b>${esc(x.title)}</b><small>${esc(x.chapter)}</small></div></a>`).join('');
  }catch(e){root.innerHTML='<div class="card empty">Impossible de charger cette leçon.</div>';}
}
window.addEventListener('DOMContentLoaded',loadLessonReader);
