/* ===========================================================
   EduFun — Professeur virtuel
   Transforme une leçon en « vidéo » animée : un professeur présente
   chaque section au tableau, avec voix française (synthèse vocale du
   navigateur), sous-titres et apparition progressive des points.
=========================================================== */
(function () {
  const PRIMAIRE = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'];
  const COLLEGE = ['6e', '5e', '4e', '3e'];

  // Primaire : une institutrice pour toutes les matières (comme en classe).
  const PRIMARY_TEACHER = { name: 'Maîtresse Aya', role: 'Ton institutrice', skin: '#8d5524', hair: '#1b1b1b', hairStyle: 'bun', top: '#ff8a3d', accent: '#ffd29a', female: true, pitch: 1.12, color: '#ff8a3d' };

  // À partir de la 6e : un professeur différent pour chaque matière.
  // Pour utiliser une vraie photo, déposer /vendor/teachers/<id>.jpg (portrait détouré ou sur fond neutre).
  const SUBJECT_TEACHERS = {
    'Français':                 { id: 'francais', name: 'Mme Adjoua Konan', female: true, skin: '#7b4a2b', hair: '#161616', hairStyle: 'headwrap', wrap: '#c2410c', top: '#9a3412', accent: '#fed7aa', pitch: 1.08 },
    'Mathématiques':            { id: 'mathematiques', name: 'M. Ibrahim Traoré', female: false, skin: '#5c3a21', hair: '#111', hairStyle: 'short', beard: true, glasses: true, top: '#1e40af', accent: '#dbeafe', tie: '#0f172a', pitch: 0.92 },
    'Anglais':                  { id: 'anglais', name: 'Mrs Grace Yao', female: true, skin: '#8a5a3b', hair: '#1a1a1a', hairStyle: 'braids', top: '#be123c', accent: '#ffe4e6', pitch: 1.1 },
    'Espagnol':                 { id: 'espagnol', name: 'Sra Mariam Diabaté', female: true, skin: '#6e4327', hair: '#1a1a1a', hairStyle: 'bun', top: '#b45309', accent: '#fef3c7', pitch: 1.06 },
    'Allemand':                 { id: 'allemand', name: 'Frau Christelle Gnagne', female: true, skin: '#7a4a2c', hair: '#141414', hairStyle: 'braids', top: '#1f2937', accent: '#fde68a', glasses: true, pitch: 1.04 },
    'Physique-Chimie':          { id: 'physique-chimie', name: 'M. Serge Dago', female: false, skin: '#4b2e1c', hair: '#141414', hairStyle: 'afro', glasses: true, top: '#f8fafc', accent: '#0e7490', coat: true, pitch: 0.95 },
    'SVT':                      { id: 'svt', name: 'Dr Aminata Coulibaly', female: true, skin: '#5e3a22', hair: '#101010', hairStyle: 'headwrap', wrap: '#15803d', top: '#f8fafc', accent: '#15803d', coat: true, glasses: true, pitch: 1.04 },
    'Histoire-Géographie':      { id: 'histoire-geographie', name: 'M. Kouakou N\'Guessan', female: false, skin: '#6b4226', hair: '#9ca3af', hairStyle: 'short', beard: true, beardColor: '#9ca3af', glasses: true, top: '#78350f', accent: '#fde68a', tie: '#7c2d12', pitch: 0.9 },
    'EDHC':                     { id: 'edhc', name: 'Mme Henriette Aka', female: true, skin: '#7a4a2a', hair: '#151515', hairStyle: 'short', top: '#ea580c', accent: '#ffffff', pitch: 1.05 },
    'Philosophie':              { id: 'philosophie', name: 'Pr Jean-Baptiste Zadi', female: false, skin: '#8a5a3b', hair: '#d1d5db', hairStyle: 'short', beard: true, beardColor: '#d1d5db', glasses: true, top: '#dbeafe', accent: '#93c5fd', book: true, pitch: 0.88 },
    'Arts Plastiques':          { id: 'arts-plastiques', name: 'M. Yacouba Ouattara', female: false, skin: '#4a2c1a', hair: '#111', hairStyle: 'locks', top: '#7c3aed', accent: '#ede9fe', pitch: 0.96 },
    'Éducation Musicale':       { id: 'education-musicale', name: 'Mme Nathalie Bléhoué', female: true, skin: '#6e4327', hair: '#141414', hairStyle: 'afro', top: '#db2777', accent: '#fce7f3', pitch: 1.12 },
    'EPS':                      { id: 'eps', name: 'Coach Moussa Bamba', female: false, skin: '#3f2616', hair: '#111', hairStyle: 'bald', top: '#16a34a', accent: '#ffffff', whistle: true, pitch: 0.94 },
    'Informatique':             { id: 'informatique', name: 'M. Hervé Kacou', female: false, skin: '#6b4226', hair: '#111', hairStyle: 'short', glasses: true, top: '#0f172a', accent: '#38bdf8', pitch: 0.98 },
    "Développement d'applications": { id: 'developpement', name: 'Mlle Fatou Soro', female: true, skin: '#5c3a21', hair: '#121212', hairStyle: 'braids', glasses: true, top: '#4f46e5', accent: '#c7d2fe', pitch: 1.08 }
  };
  const DEFAULT_TEACHER = { id: 'professeur', name: 'Dr Koné', female: true, skin: '#7a4a2a', hair: '#101010', hairStyle: 'bun', glasses: true, top: '#18a66a', accent: '#bdf0d6', pitch: 1.02 };

  function teacherFor(lesson) {
    if (PRIMAIRE.includes(lesson.level)) return PRIMARY_TEACHER;
    const t = SUBJECT_TEACHERS[lesson.subject] || DEFAULT_TEACHER;
    return { ...t, role: `${t.female ? 'Professeure' : 'Professeur'} de ${lesson.subject}`, color: t.coat ? t.accent : t.top };
  }

  const esc = x => String(x ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  const fmt = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const plain = t => String(t).replace(/\*\*/g, '').replace(/^[-•>=]\s*/, '').replace(/^\d+[.)]\s+/, '').trim();

  /** Texte prononcé : on lit les symboles mathématiques en toutes lettres. */
  function spoken(t) {
    return plain(t)
      .replace(/\s—\s/g, ', ').replace(/→/g, ' donne ').replace(/×/g, ' fois ').replace(/÷/g, ' divisé par ').replace(/≠/g, ' différent de ').replace(/≈/g, ' environ ').replace(/≤/g, ' inférieur ou égal à ').replace(/≥/g, ' supérieur ou égal à ').replace(/²/g, ' au carré').replace(/³/g, ' au cube').replace(/√/g, ' racine de ').replace(/π/g, ' pi ').replace(/(\d)\s?%/g, '$1 pour cent')
      .replace(/\s−\s/g, ' moins ').replace(/\s\+\s/g, ' plus ').replace(/\s=\s/g, ' égale ')
      .replace(/\s<\s/g, ' est plus petit que ').replace(/\s>\s/g, ' est plus grand que ')
      .replace(/\[(\w+)\]/g, ' le son $1 ').replace(/…/g, ' ... ').replace(/\s+/g, ' ');
  }

  function cycleOf(level) { return PRIMAIRE.includes(level) ? 'primaire' : COLLEGE.includes(level) ? 'college' : 'lycee'; }

  function hairSvg(t) {
    const h = t.hair;
    switch (t.hairStyle) {
      case 'bun': return `<path d="M52 72c0-30 20-46 48-46s48 16 48 46v14c-6-16-20-24-48-24S58 70 52 86z" fill="${h}"/><circle cx="100" cy="24" r="16" fill="${h}"/>`;
      case 'braids': return `<path d="M50 74c0-32 22-48 50-48s50 16 50 48v10c-6-16-22-24-50-24S56 68 50 84z" fill="${h}"/>${[56, 64, 136, 144].map(x => `<path d="M${x} 84v70" stroke="${h}" stroke-width="7" stroke-linecap="round" stroke-dasharray="7 3"/>`).join('')}`;
      case 'afro': return `<circle cx="100" cy="66" r="56" fill="${h}"/>`;
      case 'locks': return `<path d="M54 70c2-28 22-42 46-42s44 14 46 42c-10-12-24-16-46-16s-36 4-46 16z" fill="${h}"/>${[60, 70, 130, 140].map(x => `<path d="M${x} 66v40" stroke="${h}" stroke-width="8" stroke-linecap="round"/>`).join('')}`;
      case 'headwrap': return `<path d="M50 78c-4-40 22-60 50-60s56 18 50 60c-14-12-30-18-50-18s-36 6-50 18z" fill="${t.wrap || '#c2410c'}"/><path d="M72 30c18-14 44-12 60 4" stroke="rgba(255,255,255,.35)" stroke-width="5" fill="none"/><circle cx="138" cy="34" r="12" fill="${t.wrap || '#c2410c'}"/>`;
      case 'bald': return `<path d="M58 64c4-22 22-34 42-34s38 12 42 34" fill="rgba(255,255,255,.08)"/>`;
      default: return `<path d="M58 66c2-26 20-38 42-38s40 12 42 38c-10-12-24-16-42-16s-32 4-42 16z" fill="${h}"/>`;
    }
  }

  function avatarSvg(t) {
    const glasses = t.glasses ? `<g fill="rgba(255,255,255,.12)" stroke="#1a1a1a" stroke-width="3"><rect x="72" y="76" width="22" height="17" rx="6"/><rect x="106" y="76" width="22" height="17" rx="6"/><path d="M94 84h12" fill="none"/></g>` : '';
    const beard = t.beard ? `<path d="M64 104c4 26 18 38 36 38s32-12 36-38c-8 10-20 14-36 14s-28-4-36-14z" fill="${t.beardColor || t.hair}"/>` : '';
    const coat = t.coat ? `<path d="M40 250c0-50 26-78 60-78s60 28 60 78z" fill="#f8fafc"/><path d="M100 176v74" stroke="#cbd5e1" stroke-width="3"/><path d="M84 174l16 30 16-30" fill="${t.accent}"/>` : `<path d="M40 250c0-50 26-78 60-78s60 28 60 78z" fill="${t.top}"/><path d="M84 172l16 22 16-22z" fill="${t.accent}"/>`;
    const tie = t.tie ? `<path d="M96 192h8l4 40-8 10-8-10z" fill="${t.tie}"/>` : '';
    const whistle = t.whistle ? `<path d="M88 172q12 30 26 0" stroke="#e11d48" stroke-width="3" fill="none"/><rect x="106" y="198" width="16" height="9" rx="4" fill="#d4d4d8"/>` : '';
    const book = t.book ? `<g transform="rotate(-8 64 214)"><rect x="44" y="196" width="40" height="50" rx="4" fill="#1d4ed8"/><rect x="48" y="200" width="4" height="42" fill="#93c5fd"/></g><circle cx="74" cy="222" r="9" fill="${t.skin}"/>` : '';
    return `<svg viewBox="0 0 200 260" class="tv-avatar-svg" aria-hidden="true">
      <ellipse cx="100" cy="252" rx="62" ry="6" fill="rgba(0,0,0,.18)"/>
      <g class="tv-body">
        ${coat}${tie}${whistle}
        <g class="tv-arm"><path d="M150 196c18 6 30-10 34-30" stroke="${t.coat ? '#f8fafc' : t.top}" stroke-width="16" stroke-linecap="round" fill="none"/>
          <circle cx="186" cy="162" r="9" fill="${t.skin}"/>${t.book ? '' : '<path d="M188 156l10-34" stroke="#c9a46b" stroke-width="4" stroke-linecap="round"/>'}</g>
        ${book}
        <rect x="88" y="138" width="24" height="26" rx="8" fill="${t.skin}"/>
        <g class="tv-head">
          ${t.hairStyle === 'afro' ? hairSvg(t) : ''}
          <ellipse cx="100" cy="90" rx="44" ry="50" fill="${t.skin}"/>
          ${t.hairStyle === 'afro' ? '' : hairSvg(t)}
          <ellipse cx="57" cy="94" rx="7" ry="10" fill="${t.skin}"/><ellipse cx="143" cy="94" rx="7" ry="10" fill="${t.skin}"/>
          ${t.female ? `<circle cx="57" cy="108" r="4" fill="#f2c94c"/><circle cx="143" cy="108" r="4" fill="#f2c94c"/>` : ''}
          <g class="tv-eyes"><ellipse cx="84" cy="85" rx="5" ry="6" fill="#1a1a1a"/><ellipse cx="116" cy="85" rx="5" ry="6" fill="#1a1a1a"/>
            <circle cx="86" cy="83" r="1.6" fill="#fff"/><circle cx="118" cy="83" r="1.6" fill="#fff"/></g>
          <path d="M74 70q10-6 20 0M106 70q10-6 20 0" stroke="${t.beardColor || (t.hairStyle === 'bald' ? '#1a1a1a' : t.hair)}" stroke-width="3" fill="none" stroke-linecap="round"/>
          ${glasses}
          <path d="M100 92q-4 12 2 14" stroke="rgba(0,0,0,.25)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          ${beard}
          <ellipse class="tv-mouth" cx="100" cy="116" rx="11" ry="3.5" fill="#5a1d1d"/>
          <ellipse cx="74" cy="104" rx="7" ry="4" fill="rgba(255,120,120,.18)"/><ellipse cx="126" cy="104" rx="7" ry="4" fill="rgba(255,120,120,.18)"/>
        </g>
      </g>
    </svg>`;
  }

  /** Découpe le contenu de la leçon en scènes. */
  function buildScenes(lesson) {
    const scenes = [{
      kind: 'intro', title: lesson.title,
      items: [`${lesson.subject} · ${lesson.level}`, lesson.objective ? `Objectif : ${lesson.objective}` : ''].filter(Boolean),
      say: [`Bonjour ! Aujourd'hui, en ${lesson.subject}, nous allons étudier : ${lesson.title}.`, lesson.objective ? `À la fin de cette leçon, tu sauras : ${lesson.objective}` : ''].filter(Boolean)
    }];
    (lesson.content || '').split(/\n\n+/).filter(Boolean).forEach((part, index) => {
      const lines = part.split('\n'); const heading = lines[0].trim(); const body = lines.slice(1).filter(l => l.trim());
      if (/^je vérifie/i.test(heading) && window.parseChecks) {
        const questions = window.parseChecks(body.join('\n'), index);
        if (questions.length) scenes.push({ kind: 'check', title: 'Je vérifie', questions, items: [], say: [], intro: 'Vérifions maintenant que tu as bien compris. Clique sur la bonne réponse.' });
        return;
      }
      const correction = /^corrig/i.test(heading);
      const items = body.length ? body : [heading];
      scenes.push({
        kind: correction ? 'correction' : /retiens/i.test(heading) ? 'key' : 'section', title: heading, items,
        say: items.map(spoken), intro: correction ? 'Voici le corrigé. Compare avec tes réponses.' : spoken(heading) + '.'
      });
    });
    scenes.push({ kind: 'outro', title: 'Bravo !', items: ['Tu as terminé la leçon.', 'Clique sur « Terminer » pour gagner tes 20 XP.'],
      say: ['Bravo, tu as terminé la leçon !', 'Relis le résumé, refais les exercices, puis clique sur Terminer pour gagner tes points.'] });
    return scenes;
  }

  function pickVoice(lang = 'fr-FR') {
    if (!('speechSynthesis' in window)) return null;
    const base = lang.slice(0, 2);
    const voices = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith(base));
    return voices.find(v => v.lang === lang && /google|natural|neural|amelie|thomas|audrey|denise|henri|sonia|ryan|elvira|alvaro/i.test(v.name))
      || voices.find(v => v.lang === lang) || voices[0] || null;
  }
  const FOREIGN = { 'Anglais': 'en-GB', 'Espagnol': 'es-ES', 'Allemand': 'de-DE' };

  function mount(root, lesson) {
    if (!root) return;
    const teacher = teacherFor(lesson);
    const scenes = buildScenes(lesson);
    const hasVoice = 'speechSynthesis' in window;
    const state = { scene: 0, item: -1, q: 0, waiting: false, playing: false, rate: 1, subtitles: true, muted: !hasVoice, token: 0, timer: null };

    root.innerHTML = `
      <div class="tv" data-cycle="${cycleOf(lesson.level)}" style="--tv-accent:${teacher.color || teacher.top}">
        <div class="tv-stage">
          <div class="tv-bg"><span></span><span></span><span></span></div>
          <div class="tv-avatar">${avatarSvg(teacher)}<div class="tv-name"><b>${esc(teacher.name)}</b><small>${esc(teacher.role)}</small></div></div>
          <div class="tv-board"><div class="tv-board-head"><span class="tv-step"></span><h3 class="tv-board-title"></h3></div><div class="tv-board-body"></div></div>
          <div class="tv-subtitle" aria-live="polite"></div>
          <button class="tv-bigplay" aria-label="Lancer la leçon">▶<span>Regarder la leçon</span></button>
        </div>
        <div class="tv-controls">
          <button class="tv-btn" data-act="prev" aria-label="Scène précédente">⏮</button>
          <button class="tv-btn tv-play" data-act="play" aria-label="Lecture">▶</button>
          <button class="tv-btn" data-act="next" aria-label="Scène suivante">⏭</button>
          <div class="tv-progress" role="tablist">${scenes.map((s, i) => `<button class="tv-seg" data-scene="${i}" title="${esc(s.title)}" aria-label="${esc(s.title)}"><i></i></button>`).join('')}</div>
          <button class="tv-btn tv-rate" data-act="rate" title="Vitesse">1×</button>
          <button class="tv-btn" data-act="cc" title="Sous-titres" aria-pressed="true">CC</button>
          <button class="tv-btn" data-act="mute" title="Son">${hasVoice ? '🔊' : '🔇'}</button>
          <button class="tv-btn" data-act="full" title="Plein écran">⛶</button>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);
    const tv = $('.tv'), board = $('.tv-board-body'), sub = $('.tv-subtitle');

    function renderScene() {
      const s = scenes[state.scene];
      tv.dataset.kind = s.kind;
      $('.tv-step').textContent = s.kind === 'intro' ? 'Leçon' : s.kind === 'outro' ? 'Fin' : `Étape ${state.scene}/${scenes.length - 2}`;
      $('.tv-board-title').textContent = s.title;
      state.q = 0; state.waiting = false;
      if (s.kind === 'check') { renderQuestion(); root.querySelectorAll('.tv-seg').forEach((b, i) => { b.classList.toggle('done', i < state.scene); b.classList.toggle('current', i === state.scene); }); state.item = -1; return; }
      board.innerHTML = s.items.map((it, i) => {
        const raw = it.trim();
        const img = raw.match(/^!\[(.*?)\]\((.+?)\)$/);
        if (img) return `<figure class="tv-item tv-fig" data-i="${i}"><img src="${esc(img[2])}" alt="${esc(img[1])}" onerror="this.closest('figure').remove()"><figcaption>${esc(img[1])}</figcaption></figure>`;
        const cls = /^=/.test(raw) ? 'tv-ex' : /^>/.test(raw) ? 'tv-key' : /^[-•]/.test(raw) ? 'tv-li' : /^\d+[.)]/.test(raw) ? 'tv-num' : 'tv-p';
        return `<div class="tv-item ${cls}" data-i="${i}">${fmt(plain(raw))}</div>`;
      }).join('');
      board.classList.toggle('tv-hidden', s.kind === 'correction');
      root.querySelectorAll('.tv-seg').forEach((b, i) => { b.classList.toggle('done', i < state.scene); b.classList.toggle('current', i === state.scene); });
      state.item = -1;
      tv.classList.remove('tv-enter'); void tv.offsetWidth; tv.classList.add('tv-enter');
    }

    function renderQuestion() {
      const s = scenes[state.scene]; const q = s.questions[state.q]; if (!q) return;
      $('.tv-step').textContent = `Évaluation ${state.q + 1}/${s.questions.length}`;
      board.classList.remove('tv-hidden');
      board.innerHTML = `<div class="tv-item tv-q shown">${fmt(q.text)}</div>` + q.choices.map((c, k) =>
        `<button class="tv-item tv-choice shown" data-k="${k}"><b>${'ABCD'[k] || k + 1}</b>${fmt(c.t)}</button>`).join('') + '<div class="tv-item tv-why"></div>';
    }

    function askQuestion() {
      const q = scenes[state.scene].questions[state.q];
      const letters = q.choices.map((c, k) => `${'ABCD'[k] || k + 1} : ${spoken(c.t)}`).join('. ');
      state.waiting = true;
      say(`${spoken(q.text)} ${letters}.`, () => { if (state.waiting) { sub.textContent = 'À toi de répondre : clique sur la bonne réponse.'; } });
    }

    function answer(k, btn) {
      const s = scenes[state.scene]; const q = s.questions[state.q]; if (!q || btn.disabled) return;
      if (q.choices[k].ok) {
        btn.classList.add('right'); board.querySelectorAll('.tv-choice').forEach(b => b.disabled = true);
        const why = board.querySelector('.tv-why'); why.innerHTML = fmt(q.why || ''); why.classList.add('on');
        document.dispatchEvent(new CustomEvent('edufun:check', { detail: { qid: q.id, correct: true } }));
        state.waiting = false;
        const next = () => { if (state.q < s.questions.length - 1) { state.q++; renderQuestion(); if (state.playing) askQuestion(); } else if (state.playing) { state.item = 1; step(); } };
        if (state.playing) { stopSpeech(); state.playing = true; say(`Bravo ! ${spoken(q.why || '')}`, next); } else setTimeout(next, 1200);
      } else {
        btn.classList.add('wrong'); btn.disabled = true;
        document.dispatchEvent(new CustomEvent('edufun:check', { detail: { qid: q.id, correct: false } }));
        if (state.playing) { stopSpeech(); state.playing = true; say('Ce n\'est pas la bonne réponse. Réfléchis et essaie encore.', () => {}); }
      }
    }

    function reveal(i) {
      const el = board.querySelector(`[data-i="${i}"]`); if (!el) return;
      el.classList.add('shown');
      board.querySelectorAll('.tv-item').forEach(x => x.classList.toggle('active', x === el));
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      tv.classList.remove('tv-point'); void tv.offsetWidth; tv.classList.add('tv-point');
    }

    function say(text, done, lang = 'fr-FR') {
      const token = state.token;
      if (state.subtitles) sub.textContent = text; sub.classList.toggle('on', state.subtitles && !!text);
      const finish = () => { tv.classList.remove('tv-talking'); if (token === state.token) done(); };
      tv.classList.add('tv-talking');
      if (state.muted || !hasVoice) { clearTimeout(state.timer); state.timer = setTimeout(finish, Math.max(1600, text.length * 62) / state.rate); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = 0.95 * state.rate; u.pitch = teacher.pitch;
      const v = pickVoice(lang); if (v) u.voice = v;
      // Si la voix échoue ou s'arrête anormalement vite (aucune voix installée),
      // on laisse le temps de lire le sous-titre avant de continuer.
      const started = Date.now(), minTime = Math.max(1200, text.length * 45) / state.rate;
      const end = () => { const left = minTime - (Date.now() - started); if (left > 0 && Date.now() - started < 400) { clearTimeout(state.timer); state.timer = setTimeout(finish, left); } else finish(); };
      u.onend = end; u.onerror = end;
      speechSynthesis.speak(u);
    }

    function step() {
      if (!state.playing) return;
      const s = scenes[state.scene];
      if (s.kind === 'check') {
        if (state.item === -1) { state.item = 0; tv.classList.add('tv-started'); say(s.intro, askQuestion); return; }
        if (state.item === 0) { askQuestion(); return; }
        if (state.scene < scenes.length - 1) { state.scene++; renderScene(); setTimeout(step, 450); } else stop(true);
        return;
      }
      if (state.item === -1) {
        state.item = 0;
        if (s.kind === 'correction') {
          say('Avant de regarder le corrigé, essaie de faire les exercices tout seul. Le corrigé apparaît dans un instant.', () => {
            board.classList.remove('tv-hidden'); say(s.intro, step);
          });
          return;
        }
        if (s.intro) { say(s.intro, step); return; }
      }
      if (state.item < s.items.length) {
        const i = state.item++; reveal(i);
        const imgLine = s.items[i].trim().match(/^!\[(.*?)\]/);
        if (imgLine) { say(imgLine[1] ? `Observe l'image : ${imgLine[1]}.` : 'Observe bien l\'image.', step); return; }
        const foreign = FOREIGN[lesson.subject] && /^=/.test(s.items[i].trim()) ? FOREIGN[lesson.subject] : 'fr-FR';
        say(foreign === 'fr-FR' ? (s.say[i] || plain(s.items[i])) : plain(s.items[i]), step, foreign);
        return;
      }
      if (state.scene < scenes.length - 1) { state.scene++; renderScene(); setTimeout(step, 450); }
      else stop(true);
    }

    function stopSpeech() { state.token++; clearTimeout(state.timer); if (hasVoice) speechSynthesis.cancel(); tv.classList.remove('tv-talking'); }
    function play() {
      if (state.playing) return;
      state.playing = true; tv.classList.add('tv-playing'); $('.tv-play').textContent = '⏸';
      // reprend au début du point en cours
      if (state.item > 0) state.item--; step();
    }
    function stop(ended) {
      state.playing = false; stopSpeech(); tv.classList.remove('tv-playing'); $('.tv-play').textContent = ended ? '↺' : '▶';
      if (ended) { state.scene = 0; state.ended = true; }
    }
    function go(i) {
      const wasPlaying = state.playing; stop(false);
      state.scene = Math.max(0, Math.min(scenes.length - 1, i)); renderScene();
      if (scenes[state.scene].kind !== 'correction') board.querySelectorAll('.tv-item').forEach(x => x.classList.add('shown'));
      sub.classList.remove('on');
      if (wasPlaying) { state.item = -1; board.querySelectorAll('.tv-item').forEach(x => x.classList.remove('shown')); play(); }
    }

    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('tv-choice')) { answer(+b.dataset.k, b); return; }
      if (b.classList.contains('tv-bigplay')) { tv.classList.add('tv-started'); play(); return; }
      if (b.dataset.scene) { tv.classList.add('tv-started'); go(+b.dataset.scene); return; }
      switch (b.dataset.act) {
        case 'play': tv.classList.add('tv-started'); if (state.playing) stop(false); else { if (state.ended) { state.ended = false; renderScene(); } play(); } break;
        case 'prev': tv.classList.add('tv-started'); go(state.scene - 1); break;
        case 'next': tv.classList.add('tv-started'); go(state.scene + 1); break;
        case 'rate': { const r = [1, 1.25, 0.8]; state.rate = r[(r.indexOf(state.rate) + 1) % r.length]; b.textContent = state.rate + '×'; break; }
        case 'cc': state.subtitles = !state.subtitles; b.setAttribute('aria-pressed', state.subtitles); if (!state.subtitles) sub.classList.remove('on'); break;
        case 'mute': if (!hasVoice) return; state.muted = !state.muted; b.textContent = state.muted ? '🔇' : '🔊'; if (state.playing) { stop(false); play(); } break;
        case 'full': if (document.fullscreenElement) document.exitFullscreen(); else tv.requestFullscreen?.(); break;
      }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state.playing) stop(false); });
    window.addEventListener('pagehide', stopSpeech);
    if (hasVoice) speechSynthesis.getVoices();
    // Photo réelle du professeur si elle a été déposée dans /vendor/teachers (liste dans manifest.json).
    if (teacher.id) fetch('/vendor/teachers/manifest.json').then(r => r.ok ? r.json() : []).then(list => {
      if (!Array.isArray(list) || !list.includes(teacher.id)) return;
      const img = new Image(); img.className = 'tv-photo'; img.alt = teacher.name;
      img.onload = () => { const svg = root.querySelector('.tv-avatar-svg'); if (svg) svg.replaceWith(img); tv.classList.add('tv-has-photo'); };
      img.src = `/vendor/teachers/${teacher.id}.jpg`;
    }).catch(() => {});
    renderScene();
    board.querySelectorAll('.tv-item').forEach(x => x.classList.add('shown'));
  }

  window.EduTeacher = { mount };
})();
