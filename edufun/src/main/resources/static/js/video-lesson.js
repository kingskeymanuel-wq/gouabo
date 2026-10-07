/* ===========================================================
   EduFun — Vidéo de cours avec évaluation de rétention
   Lit la vraie vidéo d'une leçon (professeur filmé avec sa propre voix,
   ou vidéo ludique pour le primaire) et l'arrête aux points de
   vérification pour poser les questions « Je vérifie » de la leçon.
   La vidéo ne reprend qu'après la bonne réponse ; chaque réponse est
   transmise à la page (événement edufun:check) comme avec le lecteur animé.
=========================================================== */
(function () {
  const esc = x => String(x ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  const fmt = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const pick = a => a[Math.floor(Math.random() * a.length)];

  const KIDS_RIGHT = ['Bravo, champion !', 'Super, tu as trouvé !', 'Génial, c\'est ça !', 'Waouh, bien joué !'];
  const KIDS_WRONG = ['Oups ! Ce n\'est pas ça. Essaie encore, tu vas y arriver !', 'Presque ! Regarde bien et essaie une autre réponse.'];

  /** Identifiant YouTube (watch, youtu.be, embed, shorts), sinon null. */
  function youtubeId(url) {
    const m = String(url || '').match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  /** Questions « Je vérifie » de la leçon, dans l'ordre (mêmes identifiants que la page). */
  function lessonQuestions(lesson) {
    if (!window.parseChecks) return [];
    const out = [];
    (lesson.content || '').split(/\n\n+/).filter(Boolean).forEach((part, index) => {
      const lines = part.split('\n');
      if (/^je vérifie/i.test(lines[0].trim())) out.push(...window.parseChecks(lines.slice(1).join('\n'), index));
    });
    return out;
  }

  let ytReady = null;
  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytReady) return ytReady;
    ytReady = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
      const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.onerror = reject;
      document.head.appendChild(s);
    });
    return ytReady;
  }

  /** Petit carillon (sans voix) pour féliciter les enfants. */
  function chime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = f;
        const t = ctx.currentTime + i * .11; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .45);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .5);
      });
      setTimeout(() => ctx.close(), 1200);
    } catch (_) { /* audio indisponible */ }
  }

  function mount(root, lesson, video) {
    const kids = video.style === 'KIDS';
    const questions = lessonQuestions(lesson);
    const marks = String(video.checkpoints || '').split(',').map(Number).filter(n => n > 0).sort((a, b) => a - b);
    const state = { next: 0, asking: false, ended: false, stars: 0, firstTry: true };

    root.innerHTML = `
      <div class="vl" data-style="${kids ? 'KIDS' : 'PRESENTER'}">
        <div class="vl-head">
          <span class="vl-badge">${kids ? '🎈 Vidéo des petits' : '🎬 Vidéo du professeur'}</span>
          <b class="vl-title">${esc(video.title || lesson.title)}</b>
          ${video.presenter ? `<span class="vl-presenter">${kids ? 'Avec' : 'Présentée par'} <b>${esc(video.presenter)}</b></span>` : ''}
          ${kids ? '<span class="vl-stars" aria-label="Étoiles gagnées">⭐ <b>0</b></span>' : ''}
        </div>
        <div class="vl-stage">
          <div class="vl-media"></div>
          <div class="vl-overlay" hidden><div class="vl-card" role="dialog" aria-live="polite"></div></div>
          ${kids ? '<div class="vl-confetti" aria-hidden="true"></div>' : ''}
        </div>
        <div class="vl-foot">
          <div class="vl-track" aria-hidden="true"><i class="vl-fill"></i>${marks.slice(0, questions.length).map((_, i) => `<span class="vl-mark" data-m="${i}"></span>`).join('')}</div>
          <span class="vl-info">${questions.length ? `${questions.length} question${questions.length > 1 ? 's' : ''} pendant la vidéo` : ''}</span>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);
    const overlay = $('.vl-overlay'), card = $('.vl-card');

    // ---- Lecteur (YouTube ou fichier vidéo) ----
    const player = { time: () => 0, duration: () => 0, play() {}, pause() {}, seek() {} };
    const ytId = youtubeId(video.url);
    if (ytId) {
      $('.vl-media').innerHTML = '<div class="vl-yt"></div>';
      loadYouTubeApi().then(() => {
        const yt = new YT.Player($('.vl-yt'), {
          videoId: ytId, playerVars: { rel: 0, modestbranding: 1, playsinline: 1, cc_lang_pref: 'fr', hl: 'fr' },
          events: { onStateChange: e => { if (e.data === YT.PlayerState.ENDED) onEnded(); } }
        });
        Object.assign(player, {
          time: () => yt.getCurrentTime ? yt.getCurrentTime() : 0, duration: () => yt.getDuration ? yt.getDuration() : 0,
          play: () => yt.playVideo && yt.playVideo(), pause: () => yt.pauseVideo && yt.pauseVideo(), seek: t => yt.seekTo && yt.seekTo(t, true)
        });
      }).catch(() => { $('.vl-media').innerHTML = `<div class="vl-error">Impossible de charger YouTube. <a href="${esc(video.url)}" target="_blank" rel="noopener">Ouvrir la vidéo</a></div>`; });
    } else {
      $('.vl-media').innerHTML = `<video class="vl-video" controls playsinline preload="metadata" src="${esc(video.url)}"${video.thumbnail ? ` poster="${esc(video.thumbnail)}"` : ''}></video>`;
      const v = $('.vl-video');
      v.addEventListener('ended', onEnded);
      v.addEventListener('error', () => { $('.vl-media').innerHTML = '<div class="vl-error">Cette vidéo ne peut pas être lue. Préviens ton école.</div>'; });
      Object.assign(player, { time: () => v.currentTime, duration: () => v.duration || 0, play: () => v.play().catch(() => {}), pause: () => v.pause(), seek: t => { v.currentTime = t; } });
    }

    // ---- Points de vérification ----
    const timer = setInterval(() => {
      const t = player.time(), d = player.duration();
      if (d) $('.vl-fill').style.width = Math.min(100, t * 100 / d) + '%';
      if (d) root.querySelectorAll('.vl-mark').forEach(m => { m.style.left = Math.min(100, marks[+m.dataset.m] * 100 / d) + '%'; });
      // On ne peut pas sauter une question en avançant dans la vidéo.
      if (!state.asking && state.next < questions.length && state.next < marks.length && t >= marks[state.next]) ask();
    }, 250);
    window.addEventListener('pagehide', () => clearInterval(timer));

    function ask() {
      const q = questions[state.next]; if (!q) return;
      state.asking = true; state.firstTry = true; player.pause();
      // Pour revoir le passage : du point de vérification précédent (à un autre instant) jusqu'à celui-ci.
      const from = marks.filter(m => m < marks[state.next]).pop() || 0;
      card.innerHTML = `
        <span class="vl-step">${kids ? '🦉 À toi de jouer !' : 'Je vérifie'} · ${state.next + 1}/${questions.length}</span>
        <p class="vl-q">${fmt(q.text)}</p>
        <div class="vl-choices">${q.choices.map((c, k) => `<button type="button" class="vl-choice" data-k="${k}"><b>${'ABCD'[k] || k + 1}</b>${fmt(c.t)}</button>`).join('')}</div>
        <div class="vl-feedback"></div>
        <div class="vl-actions">${state.ended ? '' : `<button type="button" class="vl-rewatch" data-from="${from}">${kids ? '🔁 Revoir le passage' : '↺ Revoir le passage'}</button>`}</div>`;
      overlay.hidden = false;
      card.querySelector('.vl-choice').focus({ preventScroll: true });
    }

    function answer(k, btn) {
      const q = questions[state.next]; const fb = card.querySelector('.vl-feedback');
      if (q.choices[k].ok) {
        btn.classList.add('right'); card.querySelectorAll('.vl-choice').forEach(b => { b.disabled = true; });
        document.dispatchEvent(new CustomEvent('edufun:check', { detail: { qid: q.id, correct: true } }));
        if (kids) { if (state.firstTry) { state.stars++; $('.vl-stars b').textContent = state.stars; } celebrate(); }
        fb.className = 'vl-feedback ok';
        fb.innerHTML = `<b>${kids ? pick(KIDS_RIGHT) : '✓ Bonne réponse.'}</b> ${fmt(q.why || '')}`;
        const last = state.next === questions.length - 1;
        card.querySelector('.vl-actions').innerHTML = `<button type="button" class="vl-go">${state.ended ? (last ? 'Terminer' : 'Question suivante') : (kids ? '▶ On continue !' : '▶ Continuer la vidéo')}</button>`;
        card.querySelector('.vl-go').focus({ preventScroll: true });
      } else {
        state.firstTry = false; btn.classList.add('wrong'); btn.disabled = true;
        document.dispatchEvent(new CustomEvent('edufun:check', { detail: { qid: q.id, correct: false } }));
        fb.className = 'vl-feedback ko';
        fb.innerHTML = `<b>${kids ? pick(KIDS_WRONG) : '✗ Ce n\'est pas la bonne réponse.'}</b>${state.ended ? '' : (kids ? '' : ' Revois le passage si besoin, puis réessaie.')}`;
      }
    }

    function resume() {
      overlay.hidden = true; state.asking = false; state.next++;
      if (state.ended) { if (state.next < questions.length) ask(); else finish(); } else player.play();
    }

    function onEnded() {
      state.ended = true;
      if (state.next < questions.length) { ask(); return; }
      finish();
    }

    function finish() {
      state.asking = true;
      const total = questions.length;
      card.innerHTML = kids
        ? `<span class="vl-step">🎉 Fin de la vidéo</span><p class="vl-q">Bravo, tu as tout regardé !</p>${total ? `<p class="vl-big">⭐ ${state.stars} / ${total}</p><p>étoile${total > 1 ? 's' : ''} gagnée${state.stars > 1 ? 's' : ''} du premier coup</p>` : ''}<div class="vl-actions"><button type="button" class="vl-close">Fermer</button></div>`
        : `<span class="vl-step">Fin de la vidéo</span><p class="vl-q">Vidéo terminée.</p><p>${total ? 'Tes réponses sont enregistrées. Relis le résumé « Je retiens » puis clique sur « Terminer » pour gagner tes 20 XP.' : 'Relis le résumé « Je retiens » puis clique sur « Terminer » pour gagner tes 20 XP.'}</p><div class="vl-actions"><button type="button" class="vl-close">Fermer</button></div>`;
      overlay.hidden = false;
      if (kids) celebrate();
    }

    function celebrate() {
      chime();
      const box = $('.vl-confetti'); if (!box) return;
      box.innerHTML = Array.from({ length: 26 }, (_, i) => `<i style="left:${Math.random() * 100}%;animation-delay:${(i % 8) * .05}s;background:${pick(['#ff8a3d', '#ffd23f', '#3ec1d3', '#7bd389', '#ff5d8f', '#8f6cff'])}"></i>`).join('');
      box.classList.remove('go'); void box.offsetWidth; box.classList.add('go');
    }

    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.classList.contains('vl-choice')) answer(+b.dataset.k, b);
      else if (b.classList.contains('vl-go')) resume();
      else if (b.classList.contains('vl-rewatch')) { overlay.hidden = true; player.seek(+b.dataset.from); player.play(); setTimeout(() => { state.asking = false; }, 600); }
      else if (b.classList.contains('vl-close')) { overlay.hidden = true; }
    });
  }

  window.EduVideo = { mount, youtubeId };
})();
