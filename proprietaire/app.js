/* GOUABO — portail du propriétaire : paiements à valider, autorisations des packs, tarifs */
(function () {
  const CLE = "gouabo-proprietaire";
  const app = document.getElementById("app");
  let jeton = sessionStorage.getItem(CLE) || "";
  let t = null; // tableau de bord
  let filtre = "tous";

  const e = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const fcfa = (n) => nf.format(Math.round(n || 0)) + " FCFA";
  const date = (s) => (s ? new Date(s).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—");
  const dateHeure = (s) => (s ? new Date(s).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");

  function toast(texte, rouge) {
    const d = document.createElement("div");
    d.className = "toast" + (rouge ? " rouge" : "");
    d.textContent = texte;
    document.getElementById("toasts").appendChild(d);
    setTimeout(() => d.remove(), 3500);
  }

  async function api(methode, chemin, corps) {
    const r = await fetch("/api/proprietaire" + chemin, {
      method: methode,
      headers: { "Content-Type": "application/json", ...(jeton ? { Authorization: "Bearer " + jeton } : {}) },
      body: corps ? JSON.stringify(corps) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 && chemin !== "/connexion") { deconnecter(); throw new Error("Session terminée, reconnectez-vous"); }
    if (!r.ok) throw new Error(j.erreur || "Erreur " + r.status);
    return j;
  }

  function deconnecter() { jeton = ""; t = null; sessionStorage.removeItem(CLE); afficherConnexion(); }

  /* ---------- Connexion ---------- */
  function afficherConnexion(erreur) {
    app.innerHTML = `
      <div class="entree"><form id="f">
        <div class="marque"><i>G</i>GOUABO</div>
        <div><h1>Portail propriétaire</h1><p>Validation des paiements et autorisations des packs vendeurs.</p></div>
        <label>Code d'accès ou mot de passe<input id="code" type="password" autocomplete="current-password" autofocus /></label>
        ${erreur ? `<div class="erreur">${e(erreur)}</div>` : ""}
        <button class="btn btn-or">Entrer</button>
      </form></div>`;
    document.getElementById("f").onsubmit = async (ev) => {
      ev.preventDefault();
      try {
        jeton = (await api("POST", "/connexion", { code: document.getElementById("code").value })).jeton;
        sessionStorage.setItem(CLE, jeton);
        charger();
      } catch (x) { afficherConnexion(x.message); }
    };
  }

  /* ---------- Tableau de bord ---------- */
  const LIBELLES = { essai: "Essai gratuit", actif: "Actif", expire: "Expiré", suspendu: "Suspendu" };
  const pastille = (classe, texte) => `<span class="pastille p-${classe}">${e(texte)}</span>`;

  function ligneEspace(x) {
    const a = x.abonnement;
    const fin = a.statut === "essai" ? a.essai_fin : a.echeance;
    const pack = a.statut === "actif" ? a.formule : null;
    return `<tr>
      <td><b>${e(x.nom)}</b><small>${e(x.administrateur ? x.administrateur.nom + " · " + x.administrateur.telephone : "Sans administrateur")}</small></td>
      <td>${pack ? pastille(pack, pack === "premium" ? "Premium · agents IA" : "Essentiel") : `<small>souhaite : ${e(a.formule_demandee === "premium" ? "Premium" : "Essentiel")}</small>`}</td>
      <td>${pastille(a.paye ? "valide" : "refuse", a.paye ? "Payé" : "Non payé")}<small>${a.pack_prevu ? `${e(a.pack_prevu === "premium" ? "Premium" : "Essentiel")} démarre le ${e(date(a.pack_debut))}` : a.paye ? "abonnement en cours" : a.statut === "essai" ? "profite de l'essai gratuit" : "rien de réglé"}</small></td>
      <td>${pastille(a.statut, LIBELLES[a.statut] || a.statut)}<small>${a.statut === "expire" || a.statut === "suspendu" ? "accès verrouillé" : `jusqu'au ${e(date(fin))} · ${a.jours_restants} j`}</small></td>
      <td class="d num">${x.produits} produit(s)<small>${x.vendeurs} vendeur(s) · ${x.commandes} vente(s)</small></td>
      <td class="d num">${e(fcfa(x.chiffre_affaires))}</td>
      <td><div class="actions">
        ${pack !== "essentiel" ? `<button class="btn" data-espace="${e(x.id)}" data-action="essentiel">Activer Essentiel</button>` : ""}
        ${pack !== "premium" ? `<button class="btn btn-or" data-espace="${e(x.id)}" data-action="premium">${pack === "essentiel" ? "Mettre à niveau Premium" : "Activer Premium"}</button>` : ""}
        <button class="btn" data-espace="${e(x.id)}" data-action="prolonger">+ 30 jours</button>
        ${a.statut === "suspendu" ? `<button class="btn btn-vert" data-espace="${e(x.id)}" data-action="reactiver">Réactiver</button>` : `<button class="btn btn-rouge" data-espace="${e(x.id)}" data-action="suspendre">Suspendre</button>`}
      </div></td>
    </tr>`;
  }

  function afficher() {
    const s = t.stats, r = t.reglages;
    const aValider = t.paiements.filter((p) => p.statut === "valide").slice(0, 12);
    const traites = t.paiements.slice(0, 40);
    const espaces = t.espaces.filter((x) => filtre === "tous" || (filtre === "paye" ? x.abonnement.paye : filtre === "non_paye" ? !x.abonnement.paye : filtre === "premium" ? x.abonnement.statut === "actif" && x.abonnement.formule === "premium" : x.abonnement.statut === filtre));
    const filtres = [["tous", "Tous", s.espaces], ["paye", "Ont payé", s.payes], ["non_paye", "N'ont pas payé", s.non_payes], ["essai", "En essai", s.essai], ["actif", "Actifs", s.actifs], ["premium", "Premium", s.premium], ["expire", "Expirés", s.expires], ["suspendu", "Suspendus", s.suspendus]];
    app.innerHTML = `
      <header class="tete">
        <div class="marque"><i>G</i>GOUABO <small>Portail propriétaire</small></div>
        <div style="display:flex;gap:8px"><a class="btn btn-clair" href="/" target="_blank" rel="noopener">Voir le site</a><button class="btn btn-clair" id="sortir">Se déconnecter</button></div>
      </header>
      <main class="page">
        <section class="chiffres">
          <div class="chiffre or"><span>Encaissé</span><b class="num">${e(fcfa(s.encaisse))}</b></div>
          <div class="chiffre"><span>Ont payé</span><b class="num">${s.payes} / ${s.espaces}</b></div>
          <div class="chiffre ${s.non_payes ? "alerte" : ""}"><span>N'ont pas payé</span><b class="num">${s.non_payes}</b></div>
          <div class="chiffre"><span>En essai gratuit</span><b class="num">${s.essai}</b></div>
          <div class="chiffre"><span>Abonnés actifs</span><b class="num">${s.actifs}</b></div>
          <div class="chiffre"><span>Dont Premium (IA)</span><b class="num">${s.premium}</b></div>
        </section>

        <section class="carte">
          <div class="carte-tete"><div><h2>Alertes</h2><p>Fins de souscription et état du service. Ces alertes ne sont visibles que dans ce portail.</p></div></div>
          ${t.alertes.length === 0 ? `<div class="vide">Aucune alerte : tout est en ordre.</div>` : t.alertes.map((a) => `
            <div class="alerte ${a.niveau === "important" ? "important" : ""}">
              <span class="alerte-type t-${a.type}">${a.type === "agents" ? "Agents IA" : a.type === "abonnement" ? "Souscription" : "Service"}</span>
              <div class="qui"><b>${e(a.titre)}</b><small>${e(a.detail)}</small></div>
              ${a.espace ? `<div class="actions"><button class="btn" data-espace="${e(a.espace)}" data-action="prolonger">+ 30 jours</button></div>` : ""}
            </div>`).join("")}
        </section>

        <section class="carte">
          <div class="carte-tete"><div><h2>Derniers paiements reçus</h2><p>Chaque paiement est pris en compte automatiquement : le pack démarre à la fin de l'essai gratuit, ou à la suite de l'abonnement en cours. Si un paiement n'est pas arrivé sur votre compte, annulez-le.</p></div></div>
          ${aValider.length === 0 ? `<div class="vide">Aucun paiement pour l'instant.</div>` : aValider.map((p) => `
            <div class="paiement">
              <div class="montant num">${e(fcfa(p.montant))}</div>
              <div class="qui"><b>${e(p.boutique)}</b> ${pastille(p.formule, "Pack " + (t.formules[p.formule]?.nom || p.formule))}
                <small>${e(p.operateur || "Mobile Money")} · depuis le ${e(p.telephone)} · ID de transaction : <b>${e(p.reference)}</b></small>
                <small>Payé par ${e(p.auteur || "l'administrateur")} le ${e(dateHeure(p.cree_le))}</small></div>
              <div class="actions">
                ${pastille("valide", "Payé")}
                <button class="btn btn-rouge" data-paiement="${e(p.id)}" data-action="annuler">Paiement non reçu : annuler</button>
              </div>
            </div>`).join("")}
        </section>

        <section class="carte">
          <div class="carte-tete"><div><h2>Espaces vendeurs et autorisations</h2><p>Donnez l'accès à un pack, mettez à niveau, prolongez ou suspendez un espace.</p></div>
            <div class="filtres">${filtres.map(([k, l, n]) => `<button data-filtre="${k}" class="${filtre === k ? "on" : ""}">${l} · ${n}</button>`).join("")}</div></div>
          ${espaces.length === 0 ? `<div class="vide">Aucun espace dans cette catégorie.</div>` : `<div class="defile"><table>
            <thead><tr><th>Espace</th><th>Pack</th><th>Paiement</th><th>Statut</th><th class="d">Activité</th><th class="d">Chiffre d'affaires</th><th class="d">Autorisations</th></tr></thead>
            <tbody>${espaces.map(ligneEspace).join("")}</tbody></table></div>`}
        </section>

        <section class="carte">
          <div class="carte-tete"><div><h2>Tarifs et numéros de paiement</h2><p>Affichés aux vendeurs sur la page d'accueil et dans leur page Abonnement.</p></div></div>
          <form class="carte-corps" id="reglages">
            <div class="grille">
              <label>Pack Essentiel (FCFA / mois)<input name="tarif_essentiel" inputmode="numeric" value="${e(r.tarif_essentiel)}" /></label>
              <label>Pack Premium (FCFA / mois)<input name="tarif_premium" inputmode="numeric" value="${e(r.tarif_premium)}" /></label>
              <label>Durée de l'essai gratuit (jours)<input name="essai_jours" inputmode="numeric" value="${e(r.essai_jours)}" /></label>
              <label>Numéro Orange Money<input name="momo_orange" inputmode="tel" value="${e(r.momo_orange)}" placeholder="07 …" /></label>
              <label>Numéro MTN MoMo<input name="momo_mtn" inputmode="tel" value="${e(r.momo_mtn)}" placeholder="05 …" /></label>
              <label>Numéro Moov Money<input name="momo_moov" inputmode="tel" value="${e(r.momo_moov)}" placeholder="01 …" /></label>
              <label>Numéro Wave<input name="momo_wave" inputmode="tel" value="${e(r.momo_wave)}" /></label>
              <label>Nom du titulaire des comptes<input name="momo_titulaire" value="${e(r.momo_titulaire)}" /></label>
              <label>WhatsApp d'assistance<input name="contact_whatsapp" inputmode="tel" value="${e(r.contact_whatsapp)}" /></label>
            </div>
            <div class="pied-form"><button class="btn btn-or">Enregistrer</button></div>
          </form>
        </section>

        <section class="carte">
          <div class="carte-tete"><div><h2>Mon mot de passe</h2><p>${t.mot_de_passe_cree ? "Vous entrez avec votre mot de passe. Vous pouvez le changer ici." : "Créez votre mot de passe pour ne plus utiliser le code de l'hébergement."}</p></div>
            ${pastille(t.mot_de_passe_cree ? "actif" : "declare", t.mot_de_passe_cree ? "Mot de passe créé" : "À créer")}</div>
          <form class="carte-corps" id="mdp">
            <div class="grille">
              <label>Nouveau mot de passe (10 caractères minimum)<input name="nouveau" type="password" autocomplete="new-password" minlength="10" required /></label>
              <label>Confirmez le mot de passe<input name="confirmation" type="password" autocomplete="new-password" minlength="10" required /></label>
              <label>&nbsp;<button class="btn btn-or">${t.mot_de_passe_cree ? "Changer mon mot de passe" : "Créer mon mot de passe"}</button></label>
            </div>
          </form>
        </section>

        <section class="carte">
          <div class="carte-tete"><div><h2>Service des agents IA</h2><p>La clé de l'API Claude (console.anthropic.com) fait rédiger les messages des packs Premium. Elle est payante à l'usage et n'est jamais affichée ici.</p></div>
            ${pastille(t.service.ia.configuree ? "actif" : "declare", t.service.ia.configuree ? `Clé active · …${t.service.ia.fin}${t.service.ia.source === "serveur" ? " (variable du serveur)" : ""}` : "Aucune clé")}</div>
          <form class="carte-corps" id="ia">
            <div class="grille"><label style="grid-column: span 2">Clé Anthropic<input name="cle" type="password" autocomplete="off" placeholder="sk-ant-…" ${t.service.ia.source === "serveur" ? "disabled" : ""} /></label>
              <label>&nbsp;<span style="display:flex;gap:8px"><button class="btn btn-or" ${t.service.ia.source === "serveur" ? "disabled" : ""}>Enregistrer la clé</button>${t.service.ia.source === "portail" ? `<button type="button" class="btn btn-rouge" id="retirer-cle">Retirer</button>` : ""}</span></label></div>
          </form>
        </section>

        <section class="carte">
          <div class="carte-tete"><h2>Historique des paiements</h2></div>
          ${traites.length === 0 ? `<div class="vide">Aucun paiement pour l'instant.</div>` : `<div class="defile"><table>
            <thead><tr><th>Date</th><th>Espace</th><th>Pack</th><th class="d">Montant</th><th>Référence</th><th>Décision</th></tr></thead>
            <tbody>${traites.map((p) => `<tr><td>${e(dateHeure(p.traite_le || p.cree_le))}</td><td><b>${e(p.boutique)}</b></td><td>${e(t.formules[p.formule]?.nom || p.formule)}</td><td class="d num">${e(fcfa(p.montant))}</td><td>${e(p.operateur || "")} · ${e(p.reference || "")}</td><td>${pastille(p.statut, p.statut === "valide" ? "Payé" : "Annulé")}${p.note ? `<small>${e(p.note)}</small>` : ""}</td></tr>`).join("")}</tbody></table></div>`}
        </section>
      </main>`;
  }

  async function charger() {
    try { t = await api("GET", "/tableau"); afficher(); }
    catch (x) { if (jeton) toast(x.message, true); }
  }

  /* ---------- Actions ---------- */
  app.addEventListener("click", async (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.id === "sortir") return deconnecter();
    if (b.id === "retirer-cle") {
      if (!confirm("Retirer la clé IA ? Les agents reviendront aux messages types.")) return;
      try { await api("PUT", "/ia", { cle: "" }); toast("Clé retirée"); await charger(); } catch (x) { toast(x.message, true); }
      return;
    }
    if (b.dataset.filtre) { filtre = b.dataset.filtre; return afficher(); }
    try {
      if (b.dataset.paiement) {
        const valider = b.dataset.action === "valider";
        const note = valider ? "" : prompt("Motif de l'annulation (visible par le vendeur) :", "Paiement non reçu");
        if (!valider && note === null) return;
        b.disabled = true;
        await api("POST", `/paiements/${b.dataset.paiement}/${b.dataset.action}`, { note });
        toast(valider ? "Paiement validé : pack activé pour un mois" : "Paiement annulé : la durée a été retirée");
      } else if (b.dataset.espace) {
        const id = b.dataset.espace, a = b.dataset.action;
        const nom = t.espaces.find((x) => x.id === id)?.nom || "cet espace";
        const corps = a === "essentiel" || a === "premium" ? { activer: a } : a === "prolonger" ? { prolonger_jours: 30 } : a === "suspendre" ? { statut: "suspendu" } : { statut: "reactiver" };
        const question = { essentiel: `Activer le pack Essentiel pour ${nom} pendant un mois ?`, premium: `Activer le pack Premium (agents IA) pour ${nom} pendant un mois ?`, suspendre: `Suspendre ${nom} ? Son portail sera verrouillé et ses produits masqués.` }[a];
        if (question && !confirm(question)) return;
        b.disabled = true;
        await api("PATCH", "/espaces/" + id, corps);
        toast({ essentiel: "Pack Essentiel activé", premium: "Pack Premium activé", prolonger: "30 jours ajoutés", suspendre: "Espace suspendu", reactiver: "Espace réactivé" }[a]);
      } else return;
      await charger();
    } catch (x) { toast(x.message, true); b.disabled = false; }
  });

  app.addEventListener("submit", async (ev) => {
    if (ev.target.id === "mdp") {
      ev.preventDefault();
      try { await api("PUT", "/mot-de-passe", Object.fromEntries(new FormData(ev.target))); toast("Mot de passe enregistré : utilisez-le à la prochaine connexion"); await charger(); } catch (x) { toast(x.message, true); }
      return;
    }
    if (ev.target.id === "ia") {
      ev.preventDefault();
      const cle = new FormData(ev.target).get("cle");
      if (!cle) return toast("Collez d'abord votre clé", true);
      try { await api("PUT", "/ia", { cle }); toast("Clé IA enregistrée : agents branchés"); await charger(); } catch (x) { toast(x.message, true); }
      return;
    }
    if (ev.target.id !== "reglages") return;
    ev.preventDefault();
    try {
      await api("PUT", "/reglages", Object.fromEntries(new FormData(ev.target)));
      toast("Tarifs et numéros enregistrés");
      await charger();
    } catch (x) { toast(x.message, true); }
  });

  if (jeton) charger(); else afficherConnexion();
})();
