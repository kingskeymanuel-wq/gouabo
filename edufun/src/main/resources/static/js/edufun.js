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
  if (!r.ok) {
    const text = await r.text();
    // 402 : contenu réservé aux abonnés (ui.js affiche l'écran d'abonnement).
    if (r.status === 402) { let msg = ''; try { msg = JSON.parse(text).message; } catch (_) {} window.dispatchEvent(new CustomEvent('edufun:paywall', { detail: msg })); const err = new Error(text); err.paywall = true; throw err; }
    throw new Error(text || `Erreur HTTP ${r.status}`);
  }
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
    if (!me.studentId) hide('.nav a[href="/profil"], .nav a[href="/abonnement"]');
  } else {
    hide('.nav a[href="/administration"], .nav a[href="/profil"], .nav a[href="/abonnement"], .nav .logout-form');
  }
}

// ---- Tableau de bord élève ----
const SUBJECT_ICONS = {
  'Français': '📖', 'Mathématiques': '📐', 'Anglais': '🇬🇧', 'Sciences': '🔬', 'Sciences et Technologie': '🔬', 'AEC': '🎨', 'SVT': '🧬', 'Physique-Chimie': '⚗️',
  'Histoire-Géographie': '🌍', 'EDHC': '🤝', 'EPS': '⚽', 'Arts': '🎨', 'Arts Plastiques': '🎨', 'Éducation Musicale': '🎵',
  'Informatique': '💻', 'Développement Web': '🌐', "Développement d'applications": '📱', 'Philosophie': '💭', 'Espagnol': '🇪🇸', 'Allemand': '🇩🇪', 'Construction mécanique': '⚙️', 'Électrotechnique': '⚡', 'Électronique': '🔌', 'Génie civil': '🏗️', 'Biochimie': '🧪', 'Économie générale': '📈', 'Droit': '⚖️', 'Techniques administratives et bureautique': '🗂️', 'Comptabilité et gestion': '🧾'
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

async function loadTutors() {
  const box = $('#tutorsList'); if (!box) return;
  try {
    const list = await api('/tutors');
    box.innerHTML = list.map(x => `<div class="tutor-card"><span class="tutor-avatar">${esc(initials(x.name))}</span>
      <div><b>${esc(x.name)}</b><small>${esc(x.specialties)}</small>${x.levels ? `<span class="pill">${esc(x.levels)}</span>` : ''}</div></div>`).join('')
      || '<div class="empty">Les premiers répétiteurs validés apparaîtront ici très bientôt.</div>';
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
  // Chaque gestionnaire reçoit son propre formulaire (e.currentTarget) : une variable partagée
  // valait null au moment de l'envoi et cassait l'inscription et la candidature répétiteur.
  const bind = (sel, fn) => { const form = $(sel); if (form) form.onsubmit = e => { e.preventDefault(); fn(e.currentTarget); }; };
  bind('#studentForm', registerStudent);
  bind('#tutorForm', registerTutor);
  bind('#examForm', submitExam);
  bind('#courseForm', async f => {
    try {
      await api('/courses', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(f))) });
      toast('Cours publié 📚');
      f.reset();
      loadAdmin();
    } catch (x) { toast('Erreur de création'); }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  nav();
  setup();
  applySessionNav();
  if ($('#studentDashboard')) loadDashboard();
  if ($('#tutorsList')) loadTutors();
  if ($('#adminStudents')) loadAdmin();
  if ($('#profilePage')) loadProfile();
});

// ---- Mon profil ----
function apiErrorMessage(e, fallback) {
  try { return JSON.parse(e.message).message || fallback; } catch (_) { return fallback; }
}

async function loadProfile() {
  const me = await currentUser();
  if (!me.authenticated) { location.href = '/login'; return; }
  if (!me.studentId) { location.href = me.role === 'ADMIN' ? '/administration' : '/login'; return; }
  const show = u => {
    setText('[data-pf-name]', u.name || '');
    setText('[data-pf-meta]', `Élève de ${u.level || '—'} · ${u.email || ''}`);
    setText('[data-pf-initials]', initials(u.name));
    setText('[data-pf-xp]', fmtInt(u.xp));
    setText('[data-pf-streak]', fmtInt(u.streak));
  };
  show(me);
  const f = $('#profileForm'), note = $('[data-pf-level-note]');
  f.name.value = me.name || ''; $('#pfEmail').value = me.email || ''; f.level.value = me.level || '';
  let current = me.level;
  f.level.onchange = () => {
    note.hidden = f.level.value === current;
    note.textContent = `Ton programme passera de ${current} à ${f.level.value}. Ton XP, tes badges et tes leçons terminées sont conservés.`;
  };
  f.onsubmit = async e => {
    e.preventDefault();
    const btn = f.querySelector('button'); btn.disabled = true;
    try {
      const u = await api('/auth/profile', { method: 'PATCH', body: JSON.stringify({ name: f.name.value, level: f.level.value }) });
      const changed = u.level !== current; current = u.level; note.hidden = true;
      localStorage.setItem('edufunStudentName', u.name || '');
      show({ ...me, ...u });
      toast(changed ? `C'est noté : tu es maintenant en ${u.level} 🎒` : 'Profil enregistré ✅');
    } catch (x) { toast(apiErrorMessage(x, "Impossible d'enregistrer ton profil.")); }
    finally { btn.disabled = false; }
  };
  const pf = $('#passwordForm');
  pf.onsubmit = async e => {
    e.preventDefault();
    if (pf.newPassword.value !== pf.confirm.value) { toast('Les deux nouveaux mots de passe ne sont pas identiques.'); return; }
    const btn = pf.querySelector('button'); btn.disabled = true;
    try {
      await api('/auth/password', { method: 'POST', body: JSON.stringify({ currentPassword: pf.currentPassword.value, newPassword: pf.newPassword.value }) });
      pf.reset(); toast('Mot de passe modifié 🔒');
    } catch (x) { toast(apiErrorMessage(x, 'Impossible de changer le mot de passe.')); }
    finally { btn.disabled = false; }
  };
}

window.addEventListener('DOMContentLoaded',()=>{
  const lf=$('#lessonForm'); if(lf) lf.onsubmit=async e=>{e.preventDefault();try{const d=Object.fromEntries(new FormData(lf));d.orderIndex=999;await api('/lessons',{method:'POST',body:JSON.stringify(d)});toast('Leçon publiée 📚');lf.reset();}catch(x){toast('Erreur de création de la leçon');}};
  const vf=$('#videoForm'); if(vf) vf.onsubmit=async e=>{e.preventDefault();try{const d=Object.fromEntries(new FormData(vf));d.lessonId=Number(d.lessonId);d.published=true;await api('/videos',{method:'POST',body:JSON.stringify(d)});toast('Vidéo publiée 🎥');vf.reset();}catch(x){toast('Erreur de publication vidéo');}};
});

async function loadQuizzes(){const box=$('#quizGrid');if(!box)return;try{const qs=await api('/quizzes');box.innerHTML=qs.map(q=>`<div class="card"><span class="pill">${esc(q.level||'Tous')} · ${esc(q.subject||'Général')}</span><h3>${esc(q.title)}</h3><p class="muted">Validation à ${q.passingScore}% · défi interactif</p><button class="btn primary" onclick="startQuiz(${q.id})">Commencer →</button></div>`).join('')||'<div class="empty">Aucun quiz publié.</div>';}catch(e){toast('Erreur quiz');}}
async function startQuiz(id){const area=$('#quizArea');if(!area)return;try{const d=await api('/quizzes/'+id), qs=d.questions||[];area.classList.remove('hidden');area.innerHTML=`<div class="section-head" style="margin-top:0"><div><span class="pill">${esc(d.quiz.level)} · ${esc(d.quiz.subject)}</span><h2>${esc(d.quiz.title)}</h2></div><button class="btn ghost" onclick="$('#quizArea').classList.add('hidden')">Fermer</button></div><form id="activeQuiz" class="form">${qs.map((q,i)=>`<div class="card" style="background:#faf9ff"><b>${i+1}. ${esc(q.question)}</b><div class="quiz-options">${(q.options||'').split('|').map(o=>`<label><input type="radio" name="q${q.id}" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</div></div>`).join('')}<button class="btn primary">Valider mes réponses</button></form>`;$('#activeQuiz').onsubmit=e=>submitQuiz(e,d.quiz,qs);}catch(e){toast('Impossible d’ouvrir le quiz');}}
async function submitQuiz(e,quiz,qs){e.preventDefault();const sid=Number(localStorage.getItem('edufunStudentId')||0);if(!sid){toast('Inscris-toi pour enregistrer ton score.');return;}const fd=new FormData(e.target),answers={};qs.forEach(q=>{const v=fd.get('q'+q.id);if(v!=null)answers[q.id]=v;});try{const r=await api(`/quizzes/${quiz.id}/submit`,{method:'POST',body:JSON.stringify({studentId:sid,answers})}),a=r.attempt;(r.review||[]).forEach(x=>{const card=e.target.querySelector(`input[name="q${x.questionId}"]`)?.closest('.card');if(!card)return;card.style.borderColor=x.correct?'#16a34a':'#dc2626';if(!x.correct)card.insertAdjacentHTML('beforeend',`<p class="muted" style="margin:.5rem 0 0">Bonne réponse : <b>${esc(x.correctAnswer)}</b></p>`);});toast(a.passed?(r.xpAwarded?`Excellent ! +${r.xpAwarded} XP 🎉 Score ${a.score}/${a.total}`:`Bravo, quiz réussi ! Score ${a.score}/${a.total}`):`Continue tes efforts 💪 Score ${a.score}/${a.total}`);e.target.querySelectorAll('input,button').forEach(x=>x.disabled=true);}catch(x){toast('Erreur lors de l’enregistrement');}}
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
    const parts=(l.content||'').split(/\n\n+/).filter(Boolean);
    $('#readerContent').innerHTML=parts.map((part,i)=>renderLessonSection(part,i)).join('');
    if(window.EduTeacher) EduTeacher.mount($('#teacherStage'), l);
    $('#readerPrev').disabled=!prev; $('#readerNext').disabled=!next;
    $('#readerPrev').onclick=()=>{if(prev)location.href='/lecon/'+prev.id};
    $('#readerNext').onclick=()=>{if(next)location.href='/lecon/'+next.id};
    updateDoneState();
    $('#readerDone').onclick=async()=>{const sid=localStorage.getItem('edufunStudentId');if(!sid){toast('Inscris-toi pour enregistrer ta progression.');return;}const total=lessonChecks.all.length;const score=total?Math.round(lessonChecks.firstTry.size*100/total):100;try{const r=await api(`/lessons/${l.id}/complete?studentId=${sid}&score=${score}`,{method:'POST'});$('#readerDone').dataset.completed='1';toast(r.alreadyCompleted?'Leçon déjà terminée ✓':`Leçon validée · score ${score} % · +20 XP · ${r.xp} XP`);$('#readerDone').textContent='✓ Leçon terminée';$('#readerDone').disabled=true;}catch(e){toast('Impossible d’enregistrer la progression.')}};
    try{const sid=localStorage.getItem('edufunStudentId');if(sid){const pr=await api(`/students/${sid}/progress`);if((pr.records||[]).some(r=>r.lessonId===l.id&&r.completed)){$('#readerDone').dataset.completed='1';$('#readerDone').textContent='✓ Leçon terminée';$('#readerDone').disabled=true;}}}catch(_){}
    const list=$('#readerLessons'); list.innerHTML=all.map((x,i)=>`<a class="reader-lesson ${x.id===l.id?'active':''}" href="/lecon/${x.id}"><span>${String(i+1).padStart(2,'0')}</span><div><b>${esc(x.title)}</b><small>${esc(x.chapter)}</small></div></a>`).join('');
  }catch(e){if(!e.paywall)root.innerHTML='<div class="card empty">Impossible de charger cette leçon.</div>';}
}
window.addEventListener('DOMContentLoaded',loadLessonReader);


// ---- Rendu d'une section de leçon ----
// Conventions du contenu : « - » puce, « 1. » liste numérotée, « > » encadré à retenir,
// « = » ligne d'exemple ou de calcul, **gras**.
function inlineFormat(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }

function renderRichText(body) {
  const out = []; let list = null;
  const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of body.split('\n')) {
    const line = raw.trim(); if (!line) continue;
    let m;
    if ((m = line.match(/^[-•]\s+(.*)/))) { if (list !== 'ul') { close(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inlineFormat(m[1])}</li>`); continue; }
    if ((m = line.match(/^(\d+)[.)]\s+(.*)/))) { if (list !== 'ol') { close(); out.push('<ol>'); list = 'ol'; } out.push(`<li value="${m[1]}">${inlineFormat(m[2])}</li>`); continue; }
    close();
    if ((m = line.match(/^!\[(.*?)\]\((.+?)\)$/))) { out.push(`<figure class="lr-figure"><img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption>${inlineFormat(m[1])}</figcaption></figure>`); continue; }
    if ((m = line.match(/^>\s?(.*)/))) out.push(`<div class="lr-key">${inlineFormat(m[1])}</div>`);
    else if ((m = line.match(/^=\s?(.*)/))) out.push(`<div class="lr-example">${inlineFormat(m[1])}</div>`);
    else out.push(`<p>${inlineFormat(line)}</p>`);
  }
  close();
  return out.join('');
}

// ---- Évaluations de compréhension (« Je vérifie ») ----
// Syntaxe : « ? question », « + bonne réponse », « - mauvaise réponse », « ! explication ».
function parseChecks(body, sectionIndex) {
  const qs = []; let q = null;
  for (const raw of body.split('\n')) {
    const line = raw.trim(); if (!line) continue;
    if (line.startsWith('?')) { q = { id: `s${sectionIndex}q${qs.length}`, text: line.slice(1).trim(), choices: [], why: '' }; qs.push(q); }
    else if (q && /^[+-]\s/.test(line)) q.choices.push({ t: line.slice(2).trim(), ok: line[0] === '+' });
    else if (q && line.startsWith('!')) q.why = line.slice(1).trim();
  }
  // Les réponses sont mélangées à chaque affichage : la bonne n'est jamais toujours au même endroit.
  qs.forEach(x => x.choices.sort(() => Math.random() - .5));
  return qs.filter(x => x.choices.some(c => c.ok));
}
const lessonChecks = { all: [], passed: new Set(), firstTry: new Set(), tried: new Set() };

function renderChecks(body, i) {
  const qs = parseChecks(body, i);
  qs.forEach(q => lessonChecks.all.push(q.id));
  return qs.map((q, n) => `<div class="lr-check" data-qid="${q.id}">
    <p class="lr-check-q"><span>Question ${n + 1}</span>${inlineFormat(q.text)}</p>
    <div class="lr-check-choices">${q.choices.map((c, k) => `<button type="button" class="lr-choice" data-ok="${c.ok ? 1 : 0}"><b>${'ABCD'[k] || k + 1}</b>${inlineFormat(c.t)}</button>`).join('')}</div>
    <div class="lr-check-feedback" hidden></div><template>${inlineFormat(q.why)}</template></div>`).join('');
}

function markCheck(qid, correct, fromPlayer) {
  const box = document.querySelector(`.lr-check[data-qid="${qid}"]`);
  if (!lessonChecks.tried.has(qid) && correct) lessonChecks.firstTry.add(qid);
  lessonChecks.tried.add(qid);
  if (correct) lessonChecks.passed.add(qid);
  if (box && correct) {
    box.classList.add('passed');
    box.querySelectorAll('.lr-choice').forEach(b => { b.disabled = true; if (b.dataset.ok === '1') b.classList.add('right'); });
    const fb = box.querySelector('.lr-check-feedback'); fb.hidden = false;
    fb.innerHTML = `<b>✓ Bonne réponse${fromPlayer ? ' (donnée avec le professeur)' : ''}.</b> ${box.querySelector('template').innerHTML}`;
  }
  updateDoneState();
}

function updateDoneState() {
  const btn = $('#readerDone'); if (!btn || btn.dataset.completed) return;
  const total = lessonChecks.all.length, ok = lessonChecks.passed.size;
  const bar = $('#checkProgress');
  if (bar) bar.innerHTML = total ? `<b>${ok}/${total}</b> évaluation${total > 1 ? 's' : ''} réussie${ok > 1 ? 's' : ''}` : '';
  if (total && ok < total) { btn.disabled = true; btn.textContent = `Réussis les évaluations (${ok}/${total})`; }
  else { btn.disabled = false; btn.textContent = '✓ Terminer +20 XP'; }
}

document.addEventListener('click', e => {
  const b = e.target.closest('.lr-choice'); if (!b || b.disabled) return;
  const box = b.closest('.lr-check'); const qid = box.dataset.qid; const ok = b.dataset.ok === '1';
  if (ok) markCheck(qid, true);
  else {
    lessonChecks.tried.add(qid); b.classList.add('wrong'); b.disabled = true;
    const fb = box.querySelector('.lr-check-feedback'); fb.hidden = false;
    fb.innerHTML = '<b>✗ Ce n\'est pas la bonne réponse.</b> Relis la partie « Je retiens » et essaie encore.';
  }
});
document.addEventListener('edufun:check', e => markCheck(e.detail.qid, e.detail.correct, true));

function renderLessonSection(part, i) {
  const lines = part.split('\n'); const heading = lines[0]; const body = lines.slice(1).join('\n');
  if (/^je vérifie/i.test(heading)) {
    return `<section class="lesson-section lr-checks"><span class="lesson-index">${String(i + 1).padStart(2, '0')}</span><div><h3>✅ ${esc(heading)}</h3><p class="muted">Réponds pour valider ta compréhension avant de continuer.</p><div class="lesson-richtext">${renderChecks(body, i)}</div></div></section>`;
  }
  const isCorrection = /^corrig/i.test(heading);
  const html = renderRichText(body || heading);
  const content = isCorrection ? `<details class="lr-correction"><summary>👀 Voir le corrigé</summary>${html}</details>` : html;
  return `<section class="lesson-section${/retiens/i.test(heading) ? ' lr-retiens' : ''}"><span class="lesson-index">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(heading)}</h3><div class="lesson-richtext">${content}</div></div></section>`;
}

// ---- Page « Mon programme » ----
const CYCLE_ORDER = ['Primaire', 'Collège', 'Lycée', 'Lycée technique'];
const programState = { catalog: [], level: '', subject: '', cycle: '', myLevel: '', done: new Set() };

async function setupProgramme() {
  const page = $('#curriculumPage'); if (!page) return;
  const params = new URLSearchParams(location.search);
  try {
    const [catalog, me] = await Promise.all([api('/catalog'), currentUser()]);
    programState.catalog = catalog;
    programState.myLevel = me.level || '';
    if (me.studentId) {
      try { const pr = await api(`/students/${me.studentId}/progress`); (pr.records || []).filter(r => r.completed).forEach(r => programState.done.add(r.lessonId)); } catch (_) {}
    }
    const wanted = params.get('level');
    const level = catalog.find(c => c.level === wanted) ? wanted : (catalog.find(c => c.level === me.level) ? me.level : catalog[0].level);
    selectLevel(level, params.get('subject') || '', false);
  } catch (e) { $('[data-chapters]').innerHTML = '<div class="cu-empty"><b>Programme indisponible</b>Réessaie dans un instant.</div>'; }
}

function selectLevel(level, subject, push = true) {
  const entry = programState.catalog.find(c => c.level === level); if (!entry) return;
  programState.level = level; programState.cycle = entry.cycle;
  const firstWithLessons = entry.subjects.find(s => s.lessons > 0);
  programState.subject = entry.subjects.some(s => s.subject === subject) ? subject : (firstWithLessons || entry.subjects[0]).subject;
  if (push) history.replaceState({}, '', `/programme?level=${encodeURIComponent(level)}&subject=${encodeURIComponent(programState.subject)}`);
  renderCycles(); renderLevels(); renderLevelHead(entry); renderSubjectChips(entry); loadChapters();
}

function renderCycles() {
  const box = $('[data-cycles]');
  box.innerHTML = CYCLE_ORDER.map(c => `<button role="tab" aria-selected="${c === programState.cycle}" data-cycle="${c}">${c}</button>`).join('');
  box.onclick = e => { const b = e.target.closest('[data-cycle]'); if (!b) return; programState.cycle = b.dataset.cycle; renderCycles(); renderLevels(); };
}

function renderLevels() {
  const box = $('[data-levels]');
  const chip = (c, label = c.level) => `<button class="cu-level" aria-pressed="${c.level === programState.level}" data-level="${esc(c.level)}" title="${esc(c.level)}">${esc(label)}${c.level === programState.myLevel ? '<span class="cu-mine">Ma classe</span>' : ''}</button>`;
  const entries = programState.catalog.filter(c => c.cycle === programState.cycle);
  if (programState.cycle === 'Lycée technique') {
    // Une ligne par année (Seconde, Première, Terminale), une puce par série.
    const years = [...new Set(entries.map(c => c.level.split(' ')[0]))];
    box.innerHTML = years.map(y => `<div class="cu-level-row"><span class="cu-level-year">${esc(y)}</span>${entries.filter(c => c.level.startsWith(y + ' ')).map(c => chip(c, 'Série ' + c.level.slice(y.length + 1))).join('')}</div>`).join('');
  } else box.innerHTML = entries.map(c => chip(c)).join('');
  box.onclick = e => { const b = e.target.closest('[data-level]'); if (b) selectLevel(b.dataset.level, programState.subject); };
}

function renderLevelHead(entry) {
  const withLessons = entry.subjects.filter(s => s.lessons > 0).length;
  $('[data-level-head]').innerHTML = `<div><h2>${esc(entry.level)}</h2><p>${esc(entry.cycle)} · ${plural(entry.subjects.length, 'discipline', 'disciplines')} au programme</p></div>
    <div class="cu-stats"><div class="cu-stat"><b>${fmtInt(entry.lessons)}</b>leçons</div><div class="cu-stat"><b>${withLessons}/${entry.subjects.length}</b>disciplines disponibles</div></div>`;
}

function renderSubjectChips(entry) {
  const box = $('[data-subjects]');
  box.innerHTML = entry.subjects.map(s => `<button class="cu-subject ${s.lessons ? '' : 'empty'}" aria-pressed="${s.subject === programState.subject}" data-subject="${esc(s.subject)}">
    <span aria-hidden="true">${SUBJECT_ICONS[s.subject] || '📚'}</span>${esc(s.subject)} <small>${s.lessons}</small></button>`).join('');
  box.onclick = e => { const b = e.target.closest('[data-subject]'); if (!b) return; selectLevel(programState.level, b.dataset.subject); };
}

async function loadChapters() {
  const box = $('[data-chapters]');
  box.innerHTML = '<div class="cu-skel"></div><div class="cu-skel"></div>';
  const { level, subject } = programState;
  try {
    const lessons = await api(`/curriculum?level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subject)}`);
    if (level !== programState.level || subject !== programState.subject) return;
    if (!lessons.length) { box.innerHTML = `<div class="cu-empty"><b>${esc(subject)} · ${esc(level)}</b>Les leçons de cette discipline sont en cours de rédaction.</div>`; return; }
    const chapters = [];
    lessons.forEach(l => { let c = chapters[chapters.length - 1]; if (!c || c.title !== l.chapter) chapters.push(c = { title: l.chapter, lessons: [] }); c.lessons.push(l); });
    let n = 0;
    box.innerHTML = chapters.map(c => {
      const done = c.lessons.filter(l => programState.done.has(l.id)).length;
      return `<article class="cu-chapter"><header class="cu-chapter-head"><h3>${esc(c.title)}</h3><span>${done}/${c.lessons.length} terminée${done > 1 ? 's' : ''}</span></header>
        <ol class="cu-lessons">${c.lessons.map(l => { n++; const ok = programState.done.has(l.id);
          return `<li class="cu-lesson ${ok ? 'done' : ''}"><a href="/lecon/${l.id}"><span class="cu-num">${ok ? '✓' : String(n).padStart(2, '0')}</span>
            <span><b>${esc(l.title)}</b><small>${esc(l.objective || '')}</small></span><span class="cu-tag">${ok ? 'Terminée' : esc(l.duration || '30 min')}</span></a></li>`; }).join('')}</ol></article>`;
    }).join('');
  } catch (e) { box.innerHTML = '<div class="cu-empty"><b>Impossible de charger les leçons</b>Réessaie dans un instant.</div>'; }
}

window.addEventListener('DOMContentLoaded', setupProgramme);
