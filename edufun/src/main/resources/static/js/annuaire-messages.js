/* ===========================================================
   EduFun — Portail familles : messagerie (/repetiteurs/messages)
   Conversations avec les répétiteurs + notifications. Actualisation toutes les 20 s.
=========================================================== */
(function () {
  'use strict';

  const REFRESH_MS = 20000;
  const KIND_ICONS = { VISIT: '👀', MESSAGE: '💬', PAYMENT: '💳', ACCOUNT: '👋', REPORT: '📊', PROGRESS: '📈' };
  const state = { threads: [], current: null, sig: '', with: null, canWrite: false };

  const AN = () => window.AN;
  const qsAvec = () => new URLSearchParams(location.search).get('avec');

  // ---------------------------------------------------------------- Conversations
  async function loadThreads() {
    const list = $('#anThreads');
    try {
      const threads = await api('/messages/threads');
      state.threads = Array.isArray(threads) ? threads : [];
      renderThreads();
    } catch (e) {
      if (!state.threads.length) list.innerHTML = '<li class="an-list-empty"><b>Conversations indisponibles</b>Veuillez actualiser la page dans un instant.</li>';
      toast(apiErrorMessage(e, 'Impossible de charger vos conversations.'));
    }
  }

  let threadsSig = '';
  function renderThreads() {
    const list = $('#anThreads');
    // Évite de reconstruire la liste (et de perdre le focus clavier) si rien n'a changé.
    const sig = JSON.stringify([state.current, state.threads, Math.floor(Date.now() / 60000)]);
    if (sig === threadsSig) return;
    threadsSig = sig;
    $('#anThreadCount').textContent = state.threads.length ? String(state.threads.length) : '';
    if (!state.threads.length) {
      list.innerHTML = `<li class="an-list-empty"><b>Aucune conversation pour l’instant</b>Trouvez un répétiteur dans l’annuaire et écrivez-lui depuis sa fiche.<br><a class="btn primary" href="/repetiteurs" style="margin-top:14px">Trouver un répétiteur</a></li>`;
      return;
    }
    list.innerHTML = state.threads.map(t => {
      const unread = Number(t.unread || 0);
      const cur = String(t.accountId) === String(state.current);
      const last = (t.lastFromMe ? 'Vous : ' : '') + (t.lastMessage || '');
      return `<li><button type="button" class="an-thread${unread ? ' unread' : ''}" data-id="${esc(t.accountId)}" aria-current="${cur}">
        ${AN().avatar(t.name)}
        <span class="an-thread-txt">
          <span class="an-thread-top"><b>${esc(t.name || 'Répétiteur')}</b><time datetime="${esc(t.lastAt || '')}">${esc(AN().relative(t.lastAt))}</time></span>
          ${t.label ? `<small>${esc(t.label)}</small>` : ''}
          <span class="an-thread-last"><span>${esc(last)}</span>${unread ? `<span class="an-badge" aria-label="${unread} non lu${unread > 1 ? 's' : ''}">${unread}</span>` : ''}</span>
        </span>
      </button></li>`;
    }).join('');
  }

  function convShell(w) {
    const conv = $('#anConv');
    const tutorLink = w.tutorId ? `<a class="btn ghost" href="/repetiteurs/fiche/${encodeURIComponent(w.tutorId)}">Voir la fiche</a>` : '';
    conv.innerHTML = `<div class="an-conv-head">
        <button type="button" class="an-conv-back" id="anConvBack" aria-label="Retour aux conversations">${AN().icon.back}</button>
        ${AN().avatar(w.name)}
        <div><b>${esc(w.name || 'Conversation')}</b><small>${esc(w.label || (w.role === 'TUTOR' ? 'Répétiteur' : ''))}</small></div>
        ${tutorLink}
      </div>
      <div class="an-stream" id="anStream" role="log" aria-live="polite" aria-label="Messages avec ${esc(w.name || '')}"></div>
      <div id="anComposeZone"></div>`;
    $('#anConvBack').addEventListener('click', () => {
      $('#anMsg').classList.remove('has-thread');
      state.current = null; state.sig = '';
      history.replaceState(null, '', location.pathname);
      renderThreads();
    });
  }

  function renderCompose(canWrite, w) {
    const zone = $('#anComposeZone');
    if (!canWrite) {
      zone.innerHTML = '<div class="an-compose-note">Vous ne pouvez pas écrire dans cette conversation pour le moment.</div>';
      return;
    }
    zone.innerHTML = `<form class="an-compose" id="anCompose">
        <label class="an-sr" for="anComposeBody">Votre message à ${esc(w.name || '')}</label>
        <textarea id="anComposeBody" name="body" rows="1" maxlength="2000" placeholder="Écrivez votre message…" required></textarea>
        <button class="btn primary" type="submit">Envoyer</button>
      </form>`;
    const form = $('#anCompose'), ta = form.body;
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; };
    ta.addEventListener('input', grow);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const body = ta.value.trim(); if (!body) return;
      const btn = form.querySelector('button'); btn.disabled = true;
      try {
        await api('/messages', { method: 'POST', body: JSON.stringify({ toAccountId: Number(state.current) || state.current, body }) });
        ta.value = ''; grow();
        await loadConversation(state.current, { scroll: true });
        loadThreads();
      } catch (err) {
        toast(apiErrorMessage(err, 'Le message n’a pas pu être envoyé.'));
      } finally { btn.disabled = false; ta.focus(); }
    });
  }

  function dayLabel(iso) {
    const d = new Date(iso), t = new Date(); t.setHours(0, 0, 0, 0);
    const x = new Date(d); x.setHours(0, 0, 0, 0);
    const days = Math.round((t - x) / 86400000);
    if (days === 0) return 'Aujourd’hui';
    if (days === 1) return 'Hier';
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function renderMessages(messages) {
    const stream = $('#anStream'); if (!stream) return;
    if (!messages.length) {
      stream.innerHTML = '<div class="an-conv-empty"><div><div class="an-empty-ic" aria-hidden="true">✉️</div><h3>Démarrez la conversation</h3><p>Présentez votre enfant, sa classe et les matières à travailler : le répétiteur vous répondra ici.</p></div></div>';
      return;
    }
    let lastDay = '';
    stream.innerHTML = messages.map(m => {
      const day = m.at ? new Date(m.at).toDateString() : '';
      const sep = day && day !== lastDay ? `<div class="an-day">${esc(dayLabel(m.at))}</div>` : '';
      lastDay = day || lastDay;
      return `${sep}<div class="an-bubble ${m.mine ? 'me' : 'them'}">${esc(m.body)}<time datetime="${esc(m.at || '')}" title="${esc(m.at ? new Date(m.at).toLocaleString('fr-FR') : '')}">${esc(AN().relative(m.at))}</time></div>`;
    }).join('');
  }

  async function loadConversation(id, { scroll = false, force = false } = {}) {
    if (id === null || id === undefined) return;
    try {
      const data = await api(`/messages/with/${encodeURIComponent(id)}`);
      if (String(id) !== String(state.current)) return;
      const w = data.with || {};
      const msgs = Array.isArray(data.messages) ? data.messages : [];
      const sig = msgs.length + ':' + (msgs.length ? msgs[msgs.length - 1].id : '');
      if (force || !$('#anStream')) { convShell(w); state.sig = ''; state.canWrite = null; }
      if (state.canWrite !== !!data.canWrite) { state.canWrite = !!data.canWrite; renderCompose(state.canWrite, w); }
      const stream = $('#anStream');
      const nearBottom = stream.scrollHeight - stream.scrollTop - stream.clientHeight < 80;
      if (sig !== state.sig) {
        state.sig = sig;
        renderMessages(msgs);
        if (scroll || nearBottom) stream.scrollTop = stream.scrollHeight;
      } else {
        // Rafraîchit seulement les horodatages relatifs.
        stream.querySelectorAll('.an-bubble time').forEach(t => { t.textContent = AN().relative(t.getAttribute('datetime')); });
      }
    } catch (e) {
      if (force) {
        $('#anConv').innerHTML = `<div class="an-conv-empty"><div><div class="an-empty-ic" aria-hidden="true">⚠️</div><h3>Conversation indisponible</h3><p>${esc(apiErrorMessage(e, 'Cette conversation n’a pas pu être ouverte.'))}</p><a class="btn primary" href="/repetiteurs">Retour à l’annuaire</a></div></div>`;
      }
    }
  }

  async function openThread(id) {
    state.current = String(id); state.sig = '';
    $('#anMsg').classList.add('has-thread');
    history.replaceState(null, '', `${location.pathname}?avec=${encodeURIComponent(id)}`);
    $$('.an-thread').forEach(b => b.setAttribute('aria-current', String(b.dataset.id === state.current)));
    $('#anConv').innerHTML = `<div class="an-stream" aria-busy="true">${[60, 45, 70, 38].map((w, i) => `<div class="an-sk" style="height:42px;width:${w}%;border-radius:18px;align-self:${i % 2 ? 'flex-end' : 'flex-start'}"></div>`).join('')}</div>`;
    await loadConversation(state.current, { scroll: true, force: true });
    // L'ouverture marque les messages comme lus : met à jour la liste et la pastille.
    loadThreads(); AN().refreshBadge();
    const ta = $('#anComposeBody'); if (ta && matchMedia('(min-width: 901px)').matches) ta.focus();
  }

  // ---------------------------------------------------------------- Notifications
  async function loadNotifications() {
    const list = $('#anNotifList');
    try {
      const n = await api('/notifications');
      const items = Array.isArray(n.items) ? n.items : [];
      const unread = Number(n.unread || 0);
      $('#anNotifUnread').textContent = unread ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est lu';
      $('#anReadAll').hidden = !unread;
      const badge = $('[data-unread]');
      if (badge) { const c = Number(n.unreadMessages || 0); badge.textContent = c > 99 ? '99+' : String(c); badge.hidden = c <= 0; }
      if (!items.length) {
        list.innerHTML = '<li class="an-list-empty"><b>Aucune notification</b>Vous serez prévenu ici des nouveaux messages et des informations importantes.</li>';
        return;
      }
      list.innerHTML = items.slice(0, 20).map((it, i) => `<li class="an-notif${it.read ? '' : ' unread'}" style="--d:${Math.min(i, 8) * 40}ms">
          <span class="an-notif-ic" aria-hidden="true">${KIND_ICONS[it.kind] || '🔔'}</span>
          <div>
            <b>${esc(it.title || 'Notification')}</b>
            ${it.body ? `<p>${esc(it.body)}</p>` : ''}
            <time datetime="${esc(it.at || '')}">${esc(AN().relative(it.at))}</time>
            ${it.link && /^\/(?!\/)/.test(it.link) ? ` · <a href="${esc(it.link)}">Ouvrir</a>` : ''}
          </div>
          ${it.read ? '' : '<span class="an-sr">Non lue</span>'}
        </li>`).join('');
    } catch (e) {
      list.innerHTML = '<li class="an-list-empty"><b>Notifications indisponibles</b>Veuillez réessayer dans un instant.</li>';
    }
  }

  async function readAll() {
    const btn = $('#anReadAll'); btn.disabled = true;
    try {
      await api('/notifications/read', { method: 'POST' });
      await loadNotifications();
      toast('Toutes les notifications sont marquées comme lues');
    } catch (e) {
      toast(apiErrorMessage(e, 'Impossible de marquer les notifications comme lues.'));
    } finally { btn.disabled = false; }
  }

  // ---------------------------------------------------------------- Démarrage
  async function init() {
    if (!$('#anMsg')) return;
    const me = await currentUser();
    if (!me || !me.authenticated) { location.href = '/login'; return; }

    $('#anThreads').addEventListener('click', e => {
      const b = e.target.closest('.an-thread'); if (b) openThread(b.dataset.id);
    });
    $('#anReadAll').addEventListener('click', readAll);

    await loadThreads();
    const avec = qsAvec();
    if (avec) openThread(avec);
    loadNotifications();

    setInterval(() => {
      if (document.hidden) return;
      loadThreads();
      if (state.current) loadConversation(state.current);
      loadNotifications();
    }, REFRESH_MS);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) { loadThreads(); if (state.current) loadConversation(state.current); loadNotifications(); }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
