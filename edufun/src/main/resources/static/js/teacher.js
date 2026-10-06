/* ===========================================================
   EduFun — Professeur virtuel
   Transforme une leçon en « vidéo » animée : un professeur présente
   chaque section au tableau, avec voix française (synthèse vocale du
   navigateur), sous-titres et apparition progressive des points.
=========================================================== */
(function () {
  const PRIMAIRE = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'];
  const COLLEGE = ['6e', '5e', '4e', '3e'];

  const TEACHERS = {
    primaire: { name: 'Maîtresse Aya', role: 'Ton institutrice', skin: '#8d5524', hair: '#1b1b1b', top: '#ff8a3d', accent: '#ffd29a', female: true, glasses: false, pitch: 1.12 },
    college: { name: 'M. Kouadio', role: 'Ton professeur', skin: '#6b4226', hair: '#141414', top: '#2f7de1', accent: '#bcd8ff', female: false, glasses: false, pitch: 0.95 },
    lycee: { name: 'Dr Koné', role: 'Ta professeure', skin: '#7a4a2a', hair: '#101010', top: '#18a66a', accent: '#bdf0d6', female: true, glasses: true, pitch: 1.02 }
  };

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

  function avatarSvg(t) {
    const hair = t.female
      ? `<path d="M52 70c0-30 20-46 48-46s48 16 48 46v18c-6-16-20-26-48-26S58 72 52 88z" fill="${t.hair}"/><circle cx="100" cy="26" r="16" fill="${t.hair}"/>`
      : `<path d="M58 66c2-26 20-38 42-38s40 12 42 38c-10-12-24-16-42-16s-32 4-42 16z" fill="${t.hair}"/>`;
    const glasses = t.glasses
      ? `<g fill="none" stroke="#1a1a1a" stroke-width="3"><circle cx="84" cy="84" r="11"/><circle cx="116" cy="84" r="11"/><path d="M95 84h10"/></g>` : '';
    return `<svg viewBox="0 0 200 260" class="tv-avatar-svg" aria-hidden="true">
      <ellipse cx="100" cy="252" rx="62" ry="6" fill="rgba(0,0,0,.18)"/>
      <g class="tv-body">
        <path d="M40 250c0-50 26-78 60-78s60 28 60 78z" fill="${t.top}"/>
        <path d="M86 172l14 22 14-22z" fill="${t.accent}"/>
        <g class="tv-arm"><path d="M150 196c18 6 30-10 34-30" stroke="${t.top}" stroke-width="16" stroke-linecap="round" fill="none"/>
          <circle cx="186" cy="162" r="9" fill="${t.skin}"/><path d="M188 156l10-34" stroke="#c9a46b" stroke-width="4" stroke-linecap="round"/></g>
        <rect x="88" y="138" width="24" height="26" rx="8" fill="${t.skin}"/>
        <g class="tv-head">
          ${t.female ? '' : ''}
          <ellipse cx="100" cy="90" rx="44" ry="50" fill="${t.skin}"/>
          ${hair}
          <ellipse cx="57" cy="94" rx="7" ry="10" fill="${t.skin}"/><ellipse cx="143" cy="94" rx="7" ry="10" fill="${t.skin}"/>
          ${t.female ? `<circle cx="57" cy="108" r="4" fill="#f2c94c"/><circle cx="143" cy="108" r="4" fill="#f2c94c"/>` : ''}
          <g class="tv-eyes"><ellipse cx="84" cy="85" rx="5" ry="6" fill="#1a1a1a"/><ellipse cx="116" cy="85" rx="5" ry="6" fill="#1a1a1a"/>
            <circle cx="86" cy="83" r="1.6" fill="#fff"/><circle cx="118" cy="83" r="1.6" fill="#fff"/></g>
          <path d="M74 72q10-6 20 0M106 72q10-6 20 0" stroke="${t.hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
          ${glasses}
          <path d="M100 92q-4 12 2 14" stroke="rgba(0,0,0,.25)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
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
    (lesson.content || '').split(/\n\n+/).filter(Boolean).forEach(part => {
      const lines = part.split('\n'); const heading = lines[0].trim(); const body = lines.slice(1).filter(l => l.trim());
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
    const teacher = TEACHERS[cycleOf(lesson.level)];
    const scenes = buildScenes(lesson);
    const hasVoice = 'speechSynthesis' in window;
    const state = { scene: 0, item: -1, playing: false, rate: 1, subtitles: true, muted: !hasVoice, token: 0, timer: null };

    root.innerHTML = `
      <div class="tv" data-cycle="${cycleOf(lesson.level)}">
        <div class="tv-stage">
          <div class="tv-bg"><span></span><span></span><span></span></div>
          <div class="tv-avatar">${avatarSvg(teacher)}<div class="tv-name"><b>${esc(teacher.name)}</b><small>${esc(teacher.role)} EduFun</small></div></div>
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
      board.innerHTML = s.items.map((it, i) => {
        const raw = it.trim(); const cls = /^=/.test(raw) ? 'tv-ex' : /^>/.test(raw) ? 'tv-key' : /^[-•]/.test(raw) ? 'tv-li' : /^\d+[.)]/.test(raw) ? 'tv-num' : 'tv-p';
        return `<div class="tv-item ${cls}" data-i="${i}">${fmt(plain(raw))}</div>`;
      }).join('');
      board.classList.toggle('tv-hidden', s.kind === 'correction');
      root.querySelectorAll('.tv-seg').forEach((b, i) => { b.classList.toggle('done', i < state.scene); b.classList.toggle('current', i === state.scene); });
      state.item = -1;
      tv.classList.remove('tv-enter'); void tv.offsetWidth; tv.classList.add('tv-enter');
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
    renderScene();
    board.querySelectorAll('.tv-item').forEach(x => x.classList.add('shown'));
  }

  window.EduTeacher = { mount };
})();
