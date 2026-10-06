---
level: 5e
subject: Développement d'applications
---
# Créer une application mobile par blocs

## 5E-DA-01 | Découvrir MIT App Inventor | 55 min
Objectif : Créer un projet d'application mobile et placer des composants sur un écran.
### Je retiens
> MIT App Inventor est un outil gratuit en ligne pour créer des applications Android avec des blocs. Il a deux parties : le **Designer** (on place les composants : boutons, textes, images) et l'éditeur de **Blocs** (on programme leur comportement).
- On teste l'application sur son téléphone avec l'application « MIT AI2 Companion ».
### Je vérifie
? Dans App Inventor, à quoi sert le Designer ?
+ À placer les composants de l'écran (boutons, textes, images)
- À écrire du code en anglais
- À publier sur le Play Store
! Le Designer sert à construire l'apparence de l'écran ; les Blocs servent au comportement.
? Comment teste-t-on l'application sur son téléphone ?
- En l'imprimant
+ Avec l'application compagnon MIT AI2 Companion
- En envoyant un SMS
! L'application compagnon affiche en direct l'application en cours de création.
### Je m'exerce
1. Crée un écran avec un titre « Mon école », une image et un bouton « Entrer ».
### Corrigé
1. Composants : un Label (texte « Mon école »), un composant Image, un Button (texte « Entrer »), disposés verticalement.

## 5E-DA-02 | Les événements : réagir à un bouton | 55 min
Objectif : Programmer une action quand l'utilisateur touche un bouton.
### Je retiens
> Une application réagit à des **événements** : toucher un bouton, secouer le téléphone, écrire un texte.
= quand Bouton1.Clic faire : mettre Label1.Texte à « Bienvenue au collège ! »
### Je vérifie
? Qu'est-ce qu'un événement dans une application ?
+ Une action de l'utilisateur ou du téléphone à laquelle l'application réagit
- Une fête organisée par l'école
- Un composant de l'écran
! Toucher un bouton est un événement ; le programme y répond par une action.
? Que fait le bloc « quand Bouton1.Clic faire : mettre Label1.Texte à … » ?
- Il supprime le bouton
+ Il change le texte affiché quand on touche le bouton
- Il éteint le téléphone
! L'événement Clic déclenche le changement du texte du Label.
### Je m'exerce
1. Programme un bouton « Bonjour » qui affiche « Akwaba ! » dans un Label.
### Corrigé
1. quand BoutonBonjour.Clic faire : mettre Label1.Texte à « Akwaba ! ».

## 5E-DA-03 | Variables et calculs : une calculatrice | 60 min
Objectif : Lire des nombres saisis et afficher un résultat calculé.
### Situation d'apprentissage
Le trésorier de la coopérative veut une petite application qui calcule automatiquement le prix total : quantité × prix unitaire.
### Je retiens
> Une zone de texte (TextBox) permet à l'utilisateur d'écrire. On récupère sa valeur, on calcule, puis on affiche le résultat.
= quand BoutonCalculer.Clic : mettre LabelTotal.Texte à (TextQuantite.Texte × TextPrix.Texte)
- Il faut vérifier que l'utilisateur a bien écrit des nombres.
### Je vérifie
? Quel composant permet à l'utilisateur d'écrire une quantité ?
- Un Label
+ Une zone de texte (TextBox)
- Une image
! Le Label affiche du texte ; la TextBox permet d'en saisir.
? Quantité 4, prix 250 F : quel total l'application doit-elle afficher ?
- 254 F
+ 1 000 F
- 2 500 F
! 4 × 250 = 1 000 F.
### Je m'exerce
1. Ajoute un bouton qui calcule une réduction de 10 % sur le total.
### Corrigé
1. quand BoutonRemise.Clic : mettre LabelTotal.Texte à (total × 0,9).

## 5E-DA-04 | Les listes : mémoriser plusieurs valeurs | 55 min
Objectif : Utiliser une liste pour stocker et afficher plusieurs éléments.
### Je retiens
> Une **liste** regroupe plusieurs valeurs dans une seule variable : liste des élèves, des mots de vocabulaire. On peut ajouter un élément, en sélectionner un par son numéro (index) ou les parcourir tous.
= créer liste (« garba », « alloco », « placali ») ; élément n° 2 → « alloco »
### Je vérifie
? Dans la liste (« garba », « alloco », « placali »), quel est l'élément n° 3 ?
- garba
- alloco
+ placali
! Dans App Inventor, la numérotation commence à 1 : l'élément 3 est « placali ».
? Pourquoi utiliser une liste plutôt que plusieurs variables ?
+ Pour regrouper et manipuler facilement de nombreuses valeurs
- Parce que les listes sont plus colorées
- Parce que les variables sont interdites
! Une liste permet de stocker et de parcourir beaucoup de valeurs avec un seul nom.
### Je m'exerce
1. Crée une liste de 5 mots d'anglais et un bouton qui affiche un mot au hasard.
### Corrigé
1. quand BoutonMot.Clic : mettre Label1.Texte à (choisir un élément au hasard de listeMots).

## 5E-DA-05 | Projet : application de révision du vocabulaire | 60 min
Objectif : Réaliser une petite application complète en équipe.
### Je retiens
> Étapes d'un projet : 1) définir le besoin ; 2) dessiner la maquette ; 3) programmer écran par écran ; 4) tester avec des camarades ; 5) corriger les erreurs (bugs).
- Un **bug** est une erreur dans le programme ; le **débogage** consiste à la trouver et la corriger.
### Je vérifie
? Qu'est-ce qu'un bug ?
- Un insecte dans l'ordinateur
+ Une erreur dans le programme
- Un nouveau bouton
! Le mot vient de l'anglais, mais en informatique il désigne une erreur de programme.
? Quelle étape vient juste après la programmation ?
- Dessiner la maquette
+ Tester l'application avec des utilisateurs
- Définir le besoin
! On teste après avoir programmé, puis on corrige les erreurs trouvées.
### Je m'exerce
1. Rédige le cahier des charges (3 phrases) de ton application de vocabulaire.
### Corrigé
1. Exemple : L'application affiche un mot en français. L'élève écrit la traduction en anglais. L'application dit si c'est juste et compte les points.
