/* ===========================================================
   EduFun — Scénario de tournage d'une leçon
   Prépare, à partir du contenu de la leçon, le découpage plan par plan
   de la vidéo : texte que le professeur dit avec sa propre voix,
   incrustations de motion design, et emplacement des questions
   « Je vérifie » (points de vérification à saisir dans l'administration).
=========================================================== */
(function () {
  const PRIMAIRE = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'];
  const esc = x => String(x ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  const clean = t => String(t).replace(/\*\*/g, '').replace(/^[-•>=]\s*/, '').replace(/^\d+[.)]\s+/, '').trim();
  const fold = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const STOP = new Set('avec dans pour sont elle elles nous vous leur leurs cette ces cela comme mais plus tres tout tous toute quel quelle quels quelles quoi dont etait etre avoir fait faire entre apres avant sous chez lequel laquelle lesquels ceux celle celui aussi alors donc parce'.split(' '));
  const words = t => new Set(fold(t).split(/[^a-z0-9]+/).filter(w => w.length > 3 && !STOP.has(w)));
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  /** Mode de tournage selon la classe et la matière. */
  function modeOf(lesson) {
    if (PRIMAIRE.includes(lesson.level)) return 'KIDS';
    if (/histoire|g[ée]ographie/i.test(lesson.subject)) return 'MOTION';
    return 'PRESENTER';
  }

  const GUIDE = {
    MOTION: {
      label: 'Professeur filmé + motion design (Histoire-Géographie)',
      wps: 2.3,
      tips: [
        'Durée visée : 5 à 8 minutes. Format 16:9, 1080p minimum, 25 images/s.',
        'Le professeur est filmé en plan taille (fond vert ou fond neutre), regard caméra, posture ouverte. Alterner plan large et plan serré à chaque nouvelle partie.',
        'Voix : celle du professeur, enregistrée avec un micro-cravate dans une pièce calme. Aucune voix de synthèse.',
        'Motion design : cartes animées (Côte d\'Ivoire, Afrique de l\'Ouest, monde), frises chronologiques, chiffres clés animés, mots-clés en typographie animée, documents d\'archives (droits vérifiés).',
        'Habillage EduFun : même générique, mêmes couleurs et même police pour toutes les vidéos de la matière.',
        'Laisser 2 secondes de plan fixe à chaque point de vérification : la vidéo s\'y arrête pour la question.',
        'Export MP4 (H.264, AAC), puis mise en ligne sur YouTube en « non répertoriée » ou sur l\'hébergement vidéo de l\'école.'
      ]
    },
    PRESENTER: {
      label: 'Professeur filmé',
      wps: 2.3,
      tips: [
        'Durée visée : 5 à 8 minutes. Format 16:9, 1080p minimum.',
        'Le professeur est filmé face caméra ou au tableau ; les schémas, formules et exemples apparaissent en incrustation.',
        'Voix : celle du professeur, enregistrée avec un micro-cravate. Aucune voix de synthèse.',
        'Laisser 2 secondes de plan fixe à chaque point de vérification.',
        'Export MP4 (H.264, AAC), puis mise en ligne en « non répertoriée ».'
      ]
    },
    KIDS: {
      label: 'Vidéo ludique pour le primaire',
      wps: 1.9,
      tips: [
        'Durée visée : 3 à 5 minutes maximum. Couleurs vives, gros caractères, rythme dynamique.',
        'Une vraie personne présente (maîtresse, comédien ou comédienne) avec sa propre voix : parler lentement, sourire, phrases de 10 mots au plus. Aucune voix de synthèse.',
        'Un personnage récurrent (mascotte, marionnette ou personnage animé) dialogue avec la présentatrice et pose les questions.',
        'Répéter 2 à 3 fois chaque mot important ; le montrer à l\'écran en grand, avec une image ou un pictogramme.',
        'Ajouter une comptine ou une petite chanson avec les mots-clés, des gestes à imiter et des bruitages.',
        'Exemples tirés de la vie des enfants en Côte d\'Ivoire : marché, école, famille, village, quartier.',
        'Laisser 2 secondes de plan fixe à chaque point de vérification : la vidéo s\'y arrête et l\'enfant répond.'
      ]
    }
  };

  /** Incrustations proposées selon le texte du segment. */
  function visualsFor(text, mode) {
    const out = [];
    const years = [...new Set((text.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g) || []))];
    if (years.length) out.push(`Frise chronologique animée : ${years.join(' → ')}`);
    const places = [...new Set([...text.matchAll(/\b(?:à|de|du|des|en|au|aux|vers|d['’])\s?((?:[A-ZÀ-Ý][\wÀ-ÿ'’-]+)(?:[-\s](?:[A-ZÀ-Ý][\wÀ-ÿ'’-]+))*)/g)].map(m => m[1]).filter(p => p.length > 2))];
    if (places.length && mode !== 'PRESENTER') out.push(`Carte animée : situer ${places.slice(0, 5).join(', ')}`);
    const figures = text.match(/\b\d[\d\s.,]*\s?(?:%|km²?|habitants|millions?|milliards?|ans|siècles?|°C|m\b|kg|tonnes)/g);
    if (figures) out.push(`Chiffre clé à l'écran : ${[...new Set(figures.map(f => f.trim()))].slice(0, 3).join(' · ')}`);
    const bold = [...text.matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1]);
    if (bold.length) out.push(`Mot-clé en grand : ${bold.join(', ')}`);
    if (mode === 'KIDS') {
      const keys = [...words(text)].slice(0, 3);
      if (keys.length) out.push(`Image ou pictogramme pour : ${keys.join(', ')}`);
    }
    return out;
  }

  /** Découpe la leçon en plans et place chaque question après le passage qui y répond. */
  function build(lesson) {
    const mode = modeOf(lesson), g = GUIDE[mode];
    const teacher = window.EduTeacher && EduTeacher.teacherFor ? EduTeacher.teacherFor(lesson) : { name: 'Le professeur', role: '' };
    const segments = [], questions = [], exercises = [];
    (lesson.content || '').split(/\n\n+/).filter(Boolean).forEach((part, index) => {
      const lines = part.split('\n'); const heading = lines[0].trim(); const body = lines.slice(1).filter(l => l.trim());
      if (/^je vérifie/i.test(heading)) { if (window.parseChecks) questions.push(...window.parseChecks(body.join('\n'), index)); return; }
      if (/^corrig/i.test(heading)) return;
      if (/^je m'exerce|^exercice/i.test(heading)) { exercises.push(...body.map(clean)); return; }
      (body.length ? body : [heading]).forEach(line => {
        if (/^!\[/.test(line.trim())) { const m = line.match(/^!\[(.*?)\]/); segments.push({ heading, say: '', raw: line, image: m ? m[1] : '' }); return; }
        // Les longs paragraphes sont découpés en phrases pour placer les questions au plus près.
        clean(line).split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý«])/).forEach(sentence => { if (sentence.trim()) segments.push({ heading, say: sentence.trim(), raw: line }); });
      });
    });

    // Chaque question va après le segment qui partage le plus de mots avec elle, dans l'ordre des questions.
    let floor = 0;
    const after = questions.map(q => {
      const qw = words([q.text, ...q.choices.filter(c => c.ok).map(c => c.t), q.why].join(' '));
      let best = -1, bestScore = 0;
      segments.forEach((s, i) => { if (i < floor) return; let n = 0; words(s.say).forEach(w => { if (qw.has(w)) n++; }); if (n > bestScore) { bestScore = n; best = i; } });
      const at = best >= 0 ? best : segments.length - 1;
      floor = Math.max(floor, at);
      return floor;
    });

    const plans = []; let t = 0;
    const push = p => { p.start = t; t += p.secs; plans.push(p); };
    const dur = text => Math.max(4, Math.round(String(text).split(/\s+/).length / g.wps) + 2);
    push({ kind: 'open', title: 'Générique', secs: mode === 'KIDS' ? 8 : 5,
      say: '', visuals: [mode === 'KIDS' ? 'Jingle EduFun joyeux + la mascotte fait coucou' : 'Générique EduFun (logo animé)', `Titre : ${lesson.title}`, `${lesson.subject} · ${lesson.level}`] });
    const hello = mode === 'KIDS'
      ? `Coucou les enfants ! C'est ${teacher.name}. Aujourd'hui, on va découvrir ensemble : ${lesson.title}. Vous êtes prêts ? C'est parti !`
      : `Bonjour à tous, je suis ${teacher.name}. Aujourd'hui, en ${lesson.subject}, nous allons étudier : ${lesson.title}.${lesson.objective ? ` À la fin de cette vidéo, vous saurez ${lesson.objective.replace(/^./, c => c.toLowerCase())}` : ''}`;
    push({ kind: 'talk', title: 'Accroche face caméra', secs: dur(hello) + 3, say: hello,
      visuals: mode === 'KIDS' ? ['Plan large, présentatrice souriante avec la mascotte'] : ['Plan taille, regard caméra', mode === 'MOTION' ? 'Question d\'accroche à l\'écran (un fait étonnant tiré de la leçon)' : 'Objectif de la leçon en incrustation'] });

    let qi = 0; let lastHeading = '';
    segments.forEach((s, i) => {
      const title = s.heading !== lastHeading ? s.heading : ''; lastHeading = s.heading;
      if (s.image !== undefined) push({ kind: 'talk', title: title || 'Image', secs: 5, say: '', visuals: [`Afficher l'image : ${s.image || 'illustration de la leçon'}`] });
      else {
        const key = /retiens/i.test(s.heading);
        push({ kind: 'talk', title, secs: dur(s.say), say: s.say,
          visuals: [...(key ? [mode === 'KIDS' ? 'Encadré « Je retiens » en couleur, la présentatrice répète lentement' : 'Encadré « À retenir » à l\'écran pendant que le professeur parle'] : []), ...visualsFor(s.raw, mode)] });
      }
      while (qi < questions.length && after[qi] === i) {
        const q = questions[qi];
        push({ kind: 'check', title: `Point de vérification ${qi + 1}`, secs: 2, q,
          say: mode === 'KIDS' ? `${qi % 2 ? 'Et maintenant, une devinette' : 'À toi de jouer'} ! Regarde bien la question et touche la bonne réponse.` : 'Faisons une petite pause : répondez à la question qui apparaît à l\'écran.',
          visuals: ['Plan fixe 2 secondes : la vidéo s\'arrête ici et EduFun affiche la question'] });
        qi++;
      }
    });
    while (qi < questions.length) { push({ kind: 'check', title: `Point de vérification ${qi + 1}`, secs: 2, q: questions[qi], say: '', visuals: ['Posée automatiquement à la fin de la vidéo'] }); qi++; }

    const keys = segments.filter(s => /retiens/i.test(s.heading) && s.say).map(s => s.say);
    const recap = mode === 'KIDS'
      ? `Bravo les enfants ! Aujourd'hui, on a appris : ${lesson.title}. Retenez bien : ${keys[0] || lesson.objective || ''} À bientôt pour une nouvelle aventure !`
      : `Récapitulons. ${keys.slice(0, 2).join(' ') || lesson.objective || ''} Faites maintenant les exercices sous la vidéo. À bientôt sur EduFun !`;
    push({ kind: 'talk', title: 'Conclusion', secs: dur(recap) + 2, say: recap,
      visuals: [mode === 'KIDS' ? 'Comptine finale avec les mots-clés + la mascotte applaudit' : 'Résumé en 2-3 points à l\'écran', ...(exercises.length ? [`Annoncer les exercices : ${exercises.length} sous la vidéo`] : [])] });
    push({ kind: 'open', title: 'Fin', secs: 4, say: '', visuals: ['Logo EduFun'] });
    return { mode, g, teacher, plans, total: t, checkpoints: plans.filter(p => p.kind === 'check').map(p => p.start) };
  }

  function render(lesson) {
    const r = build(lesson);
    document.title = `Scénario — ${lesson.title} — EduFun`;
    const cps = r.checkpoints.map(mmss).join(', ');
    document.querySelector('[data-scenario]').innerHTML = `
      <header class="sc-head">
        <p class="sc-eyebrow">Scénario de tournage · ${esc(r.g.label)}</p>
        <h1>${esc(lesson.title)}</h1>
        <dl class="sc-meta">
          <div><dt>Leçon</dt><dd>${esc(lesson.code || lesson.id)} · ${esc(lesson.level)} · ${esc(lesson.subject)}</dd></div>
          <div><dt>${r.mode === 'KIDS' ? 'Présentatrice' : 'Professeur'}</dt><dd>${esc(r.teacher.name)} — sa propre voix</dd></div>
          <div><dt>Durée estimée</dt><dd>${mmss(r.total)}</dd></div>
          <div><dt>Questions</dt><dd>${r.checkpoints.length}</dd></div>
        </dl>
        ${lesson.objective ? `<p class="sc-obj"><b>Objectif :</b> ${esc(lesson.objective)}</p>` : ''}
      </header>
      <section class="sc-box">
        <h2>Consignes de tournage</h2>
        <ul>${r.g.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </section>
      ${r.checkpoints.length ? `<section class="sc-box sc-cp">
        <h2>Points de vérification</h2>
        <p>Minutage estimé, à corriger après le montage, puis à saisir dans <b>Administration → Contenus → Ajouter une vidéo</b> :</p>
        <code>${esc(cps)}</code>
      </section>` : ''}
      <section>
        <h2>Découpage</h2>
        <ol class="sc-plans">${r.plans.map((p, i) => `
          <li class="sc-plan sc-${p.kind}">
            <div class="sc-time">${mmss(p.start)}<small>${p.secs} s</small></div>
            <div class="sc-body">
              <h3>Plan ${i + 1}${p.title ? ` · ${esc(p.title)}` : ''}</h3>
              ${p.say ? `<p class="sc-say"><span>Texte à dire</span>« ${esc(p.say)} »</p>` : ''}
              ${p.q ? `<div class="sc-q"><b>${esc(p.q.text)}</b><ul>${p.q.choices.map(c => `<li class="${c.ok ? 'ok' : ''}">${esc(c.t)}${c.ok ? ' ✓' : ''}</li>`).join('')}</ul><small>Affichée par EduFun, ne pas filmer.</small></div>` : ''}
              ${p.visuals.length ? `<ul class="sc-vis">${p.visuals.map(v => `<li>${esc(v)}</li>`).join('')}</ul>` : ''}
            </div>
          </li>`).join('')}
        </ol>
      </section>`;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const id = Number(location.pathname.split('/').pop());
    const box = document.querySelector('[data-scenario]');
    try { render(await api(`/lessons/${id}`)); }
    catch (_) { box.innerHTML = '<p class="sc-error">Leçon introuvable.</p>'; }
    document.querySelector('[data-print]').addEventListener('click', () => window.print());
  });

  window.EduScenario = { build };
})();
