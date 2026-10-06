---
level: 3e
subject: Développement d'applications
---
# Applications web dynamiques

## 3E-DA-01 | Tableaux, objets et boucles en JavaScript | 60 min
Objectif : Manipuler des données structurées.
### Je retiens
= const eleves = [{ nom: "Awa", note: 15 }, { nom: "Yao", note: 9 }, { nom: "Aya", note: 12 }];
= for (const e of eleves) { console.log(e.nom, e.note >= 10 ? "admis" : "ajourné"); }
= const admis = eleves.filter(e => e.note >= 10); // Awa et Aya
> Un **tableau** contient une liste ; un **objet** regroupe des propriétés (nom, note).
### Je vérifie
? Combien d'élèves contient le tableau admis ?
- 1
+ 2
- 3
! Awa (15) et Aya (12) ont une note ≥ 10.
? Comment accède-t-on à la note de l'objet e ?
+ e.note
- note(e)
- e[note]()
! On utilise le point : objet.propriété.
### Je m'exerce
1. Calcule la moyenne des notes du tableau eleves.
### Corrigé
1. const moyenne = eleves.reduce((s, e) => s + e.note, 0) / eleves.length; // 12

## 3E-DA-02 | Les formulaires et la validation | 60 min
Objectif : Créer un formulaire d'inscription et vérifier les données saisies.
### Je retiens
> Un formulaire collecte des informations. On vérifie les données avant de les envoyer : champ obligatoire (required), format d'e-mail, longueur du mot de passe.
= <input type="email" name="email" required>
= if (motDePasse.length < 8) { afficherErreur("8 caractères minimum"); }
### Je vérifie
? Pourquoi valider les données d'un formulaire ?
+ Pour éviter les erreurs et les données incomplètes
- Pour ralentir l'utilisateur
- Pour changer la couleur du bouton
! La validation garantit des données correctes et guide l'utilisateur.
? Quel attribut rend un champ obligatoire ?
- optional
+ required
- hidden
! required empêche l'envoi du formulaire si le champ est vide.
### Je m'exerce
1. Écris la condition qui refuse un numéro de téléphone qui ne fait pas 10 chiffres.
### Corrigé
1. if (!/^\d{10}$/.test(numero)) { afficherErreur("Le numéro doit contenir 10 chiffres"); }

## 3E-DA-03 | Enregistrer des données : le stockage local | 55 min
Objectif : Conserver des données dans le navigateur.
### Je retiens
> localStorage garde des données dans le navigateur, même après fermeture.
= localStorage.setItem("pseudo", "Koffi");
= const pseudo = localStorage.getItem("pseudo"); // « Koffi »
> Ne jamais y stocker de mots de passe ou de données sensibles.
### Je vérifie
? Que fait localStorage.setItem("pseudo", "Koffi") ?
+ Il enregistre la valeur « Koffi » sous le nom « pseudo »
- Il envoie un SMS à Koffi
- Il supprime le pseudo
! setItem enregistre ; getItem relit la valeur.
? Peut-on stocker un mot de passe dans localStorage ?
- Oui, c'est sécurisé
+ Non, ce n'est pas sûr
- Seulement le dimanche
! localStorage n'est pas chiffré : un autre script ou une autre personne pourrait le lire.
### Je m'exerce
1. Écris le code qui enregistre puis relit la classe de l'élève.
### Corrigé
1. localStorage.setItem("classe", "3e") ; const classe = localStorage.getItem("classe");

## 3E-DA-04 | Les API : récupérer des données | 60 min
Objectif : Comprendre ce qu'est une API et récupérer des données avec fetch.
### Je retiens
> Une **API** permet à une application de demander des données à un autre service (météo, taux de change). Les données arrivent souvent au format **JSON**.
= const reponse = await fetch("https://api.exemple.ci/meteo?ville=Abidjan");
= const meteo = await reponse.json(); // { "temperature": 29, "ciel": "nuageux" }
### Je vérifie
? Qu'est-ce qu'une API ?
- Un type d'écran
+ Un moyen pour une application de demander des données ou des services à une autre
- Un virus
! L'API est une « porte d'entrée » documentée vers un service.
? Dans quel format les API envoient-elles souvent leurs données ?
+ JSON
- MP3
- JPEG
! JSON est un format texte simple, facile à lire pour les programmes.
### Je m'exerce
1. Dans l'objet météo ci-dessus, comment affiche-t-on la température ?
### Corrigé
1. console.log(meteo.temperature); // 29

## 3E-DA-05 | Travailler en équipe : Git et GitHub | 55 min
Objectif : Comprendre la gestion de versions.
### Je retiens
> Git enregistre l'historique des modifications d'un projet. Un **commit** est une sauvegarde avec un message. GitHub héberge les projets en ligne pour travailler à plusieurs.
= git add index.html ; git commit -m "Ajout de la page d'accueil" ; git push
### Je vérifie
? Qu'est-ce qu'un commit ?
+ Une sauvegarde des modifications avec un message explicatif
- Une erreur de programmation
- Un nouveau fichier image
! Chaque commit est une étape de l'historique du projet.
? Pourquoi utiliser Git en équipe ?
- Pour colorer le code
+ Pour partager le code et retrouver chaque version
- Pour imprimer le projet
! Git permet de travailler à plusieurs sans perdre le travail des autres.
### Je m'exerce
1. Écris un bon message de commit pour l'ajout d'un formulaire de contact.
### Corrigé
1. "Ajout du formulaire de contact avec validation de l'e-mail"

## 3E-DA-06 | Projet : application de gestion des tâches | 60 min
Objectif : Réaliser une application web complète (ajouter, cocher, supprimer des tâches).
### Je retiens
> Une application de tâches combine : un formulaire (ajouter), une liste affichée (DOM), des événements (cocher, supprimer) et le stockage local (garder les tâches).
### Je vérifie
? Quel outil permet de conserver les tâches après fermeture du navigateur ?
- console.log
+ localStorage
- alert
! localStorage garde les données sur l'appareil.
? Quelle est la bonne démarche de projet ?
+ Maquette, programmation par étapes, tests, corrections
- Programmer tout d'un coup sans tester
- Tester avant d'avoir écrit le code
! On avance par petites étapes testées.
### Je m'exerce
1. Liste les fonctions à écrire pour cette application.
### Corrigé
1. ajouterTache(texte), afficherTaches(), basculerFaite(id), supprimerTache(id), sauvegarder(), charger().
