---
level: 4e
subject: Développement d'applications
---
# Créer des applications web

## 4E-DA-01 | HTML : la structure d'une page | 55 min
Objectif : Écrire une page web avec titres, paragraphes, images et liens.
### Je retiens
> HTML décrit la structure d'une page avec des **balises** : un élément s'ouvre <p> et se ferme </p>.
= <h1>Collège moderne de Daloa</h1>
= <p>Bienvenue sur le site de notre établissement.</p>
= <img src="ecole.jpg" alt="Façade du collège">
= <a href="contact.html">Nous contacter</a>
- L'attribut alt décrit l'image pour les personnes malvoyantes.
### Je vérifie
? Quelle balise affiche un titre principal ?
+ <h1>
- <p>
- <img>
! h1 est le titre de niveau 1, le plus important de la page.
? À quoi sert l'attribut alt d'une image ?
- À changer sa couleur
+ À décrire l'image quand elle ne peut pas être vue
- À agrandir l'image
! Le texte alternatif rend la page accessible et s'affiche si l'image ne se charge pas.
### Je m'exerce
1. Écris le code d'une page qui présente ton club avec un titre, un paragraphe et un lien.
### Corrigé
1. <h1>Club environnement</h1> <p>Nous plantons des arbres chaque mois.</p> <a href="inscription.html">S'inscrire</a>

## 4E-DA-02 | CSS : mettre en forme | 55 min
Objectif : Appliquer couleurs, polices, marges et mise en page avec CSS.
### Je retiens
> CSS décrit l'apparence : on choisit un **sélecteur** et on lui donne des **propriétés**.
= h1 { color: #e67e22; font-size: 32px; }
= .carte { padding: 16px; border-radius: 12px; background: #f5f5f5; }
- Une classe (.carte) s'applique à tous les éléments qui la portent : <div class="carte">.
### Je vérifie
? Quel langage gère l'apparence d'une page web ?
- HTML
+ CSS
- Python
! HTML structure le contenu ; CSS le met en forme.
? Que fait la règle « h1 { color: green; } » ?
+ Elle met tous les titres h1 en vert
- Elle supprime les titres
- Elle crée un nouveau titre
! Le sélecteur h1 cible tous les titres de niveau 1.
### Je m'exerce
1. Écris une règle CSS qui met les paragraphes en taille 18 px et en gris foncé.
### Corrigé
1. p { font-size: 18px; color: #333; }

## 4E-DA-03 | JavaScript : variables et fonctions | 60 min
Objectif : Écrire un script avec variables, conditions et fonctions.
### Je retiens
> JavaScript rend la page interactive. Une **fonction** regroupe des instructions réutilisables.
= let note = 14;
= function mention(n) { if (n >= 16) return "Très bien"; if (n >= 14) return "Bien"; return "Passable"; }
= console.log(mention(note)); // affiche « Bien »
### Je vérifie
? Que renvoie mention(17) ?
+ « Très bien »
- « Bien »
- « Passable »
! 17 est supérieur ou égal à 16 : la première condition est vraie.
? À quoi sert une fonction ?
- À afficher une image
+ À regrouper des instructions que l'on peut réutiliser
- À colorer un texte
! On écrit la fonction une fois et on l'appelle autant de fois que nécessaire.
### Je m'exerce
1. Écris une fonction qui renvoie le double d'un nombre.
### Corrigé
1. function double(x) { return x * 2; }

## 4E-DA-04 | Le DOM et les événements | 60 min
Objectif : Modifier la page quand l'utilisateur clique.
### Je retiens
> Le DOM est la représentation de la page que JavaScript peut modifier.
= const bouton = document.querySelector("#valider");
= bouton.addEventListener("click", () => { document.querySelector("#message").textContent = "Merci !"; });
### Je vérifie
? Que fait addEventListener("click", …) ?
+ Il exécute une fonction quand on clique sur l'élément
- Il supprime l'élément
- Il recharge la page
! On « écoute » l'événement click pour y réagir.
? Avec quelle instruction sélectionne-t-on l'élément dont l'id est « message » ?
- document.color("message")
+ document.querySelector("#message")
- message.html()
! Le # désigne un identifiant (id) dans un sélecteur.
### Je m'exerce
1. Fais apparaître « Inscription réussie » dans un paragraphe quand on clique sur un bouton.
### Corrigé
1. document.querySelector("#btn").addEventListener("click", () => { document.querySelector("#info").textContent = "Inscription réussie"; });

## 4E-DA-05 | Pages adaptées au téléphone (responsive) | 55 min
Objectif : Rendre une page lisible sur téléphone comme sur ordinateur.
### Je retiens
> La plupart des Ivoiriens naviguent sur téléphone. Une page **responsive** s'adapte à la taille de l'écran : balise viewport, largeurs en %, images flexibles, media queries.
= <meta name="viewport" content="width=device-width, initial-scale=1">
= @media (max-width: 600px) { .colonnes { flex-direction: column; } }
### Je vérifie
? Que signifie une page « responsive » ?
+ Une page qui s'adapte à la taille de l'écran
- Une page qui répond aux messages
- Une page sans images
! Elle reste lisible sur téléphone, tablette et ordinateur.
? À quoi sert une media query ?
- À ajouter une vidéo
+ À appliquer des styles différents selon la taille de l'écran
- À envoyer un e-mail
! @media permet de changer la mise en page sur petit écran.
### Je m'exerce
1. Écris une règle qui met le texte en 16 px quand l'écran fait moins de 600 px.
### Corrigé
1. @media (max-width: 600px) { body { font-size: 16px; } }

## 4E-DA-06 | Projet : le site de la classe | 60 min
Objectif : Réaliser un mini-site de 3 pages en équipe.
### Je retiens
> Un site se compose de plusieurs pages reliées par un menu. On organise les fichiers (index.html, style.css, script.js, dossier images) et on teste sur téléphone et ordinateur.
### Je vérifie
? Quel est le nom habituel de la page d'accueil d'un site ?
+ index.html
- accueil.css
- page1.js
! Les serveurs web ouvrent automatiquement index.html.
? Où écrit-on les styles communes à toutes les pages ?
- Dans chaque image
+ Dans un fichier CSS partagé, par exemple style.css
- Dans le titre de la page
! Un seul fichier CSS lié à toutes les pages garantit une apparence cohérente.
### Je m'exerce
1. Liste les 3 pages et le contenu de chacune pour le site de ta classe.
### Corrigé
1. Exemple : Accueil (présentation, photo), Emploi du temps (tableau), Actualités (sorties, résultats).
