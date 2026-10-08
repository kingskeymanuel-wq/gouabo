/* GOUABO sur téléphone : propose d'installer l'application sur l'écran d'accueil (Android, iPhone, ordinateur).
   Le bandeau n'apparaît ni dans l'application déjà installée, ni après un refus (pendant 7 jours). */
(function () {
  var CLE = "gouabo_installation_refusee";
  var lire = function () { try { return Number(localStorage.getItem(CLE)) || 0; } catch (e) { return 0; } };
  var noter = function () { try { localStorage.setItem(CLE, String(Date.now())); } catch (e) { /* stockage indisponible */ } };
  var installee = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (installee || Date.now() - lire() < 7 * 864e5) return;

  var iphone = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
  var invite = null, bandeau = null;

  function style(el, regles) { for (var k in regles) el.style[k] = regles[k]; return el; }
  function fermer() { if (bandeau) { bandeau.remove(); bandeau = null; } }

  function afficher() {
    if (bandeau || !document.body) return;
    bandeau = style(document.createElement("div"), {
      position: "fixed", left: "12px", right: "12px", bottom: "calc(12px + env(safe-area-inset-bottom, 0px))", zIndex: "2147483000",
      maxWidth: "460px", margin: "0 auto", padding: "12px 14px", borderRadius: "16px", background: "#17110b", color: "#fff",
      boxShadow: "0 12px 40px rgba(0,0,0,.35)", display: "flex", alignItems: "center", gap: "12px",
      font: '500 14px/1.35 system-ui, "Segoe UI", Arial, sans-serif',
    });
    bandeau.setAttribute("role", "dialog");
    bandeau.setAttribute("aria-label", "Installer l'application GOUABO");
    var logo = style(document.createElement("img"), { width: "44px", height: "44px", borderRadius: "12px", flex: "none" });
    logo.src = "/icones/icone-192.png"; logo.alt = "";
    var texte = style(document.createElement("div"), { flex: "1", minWidth: "0" });
    var titre = style(document.createElement("b"), { display: "block", fontSize: "15px" });
    titre.textContent = "GOUABO sur votre téléphone";
    var sous = style(document.createElement("span"), { color: "#cfc6ba" });
    sous.textContent = iphone ? "Touchez Partager, puis « Sur l'écran d'accueil »." : "Installez l'application : elle s'ouvre comme une vraie appli.";
    texte.appendChild(titre); texte.appendChild(sous);
    bandeau.appendChild(logo); bandeau.appendChild(texte);
    if (!iphone) {
      var oui = style(document.createElement("button"), { flex: "none", border: "0", borderRadius: "11px", padding: "10px 14px", background: "linear-gradient(135deg,#f2a516,#ee6a1f)", color: "#1b1206", font: "700 14px system-ui, sans-serif", cursor: "pointer" });
      oui.textContent = "Installer";
      oui.onclick = function () {
        if (!invite) return fermer();
        invite.prompt();
        invite.userChoice.then(function (choix) { if (choix.outcome !== "accepted") noter(); invite = null; fermer(); });
      };
      bandeau.appendChild(oui);
    }
    var non = style(document.createElement("button"), { flex: "none", border: "0", background: "transparent", color: "#cfc6ba", font: "400 22px system-ui, sans-serif", padding: "4px 6px", cursor: "pointer" });
    non.textContent = "×"; non.setAttribute("aria-label", "Plus tard");
    non.onclick = function () { noter(); fermer(); };
    bandeau.appendChild(non);
    document.body.appendChild(bandeau);
  }

  // Android et ordinateur : le navigateur signale que l'installation est possible
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); invite = e; afficher(); });
  window.addEventListener("appinstalled", fermer);
  // iPhone : pas de signal, on explique le geste après quelques secondes
  if (iphone) window.addEventListener("load", function () { setTimeout(afficher, 4000); });
})();
