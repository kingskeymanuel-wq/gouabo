---
levels: Première A, Première C, Première D
subject: Développement d'applications
---
# Architecture des applications

## 1N-DA-01 | La programmation orientée objet | 60 min
Objectif : Définir une classe, créer des objets et utiliser des méthodes.
### Je retiens
> Une **classe** est un modèle ; un **objet** est un exemplaire créé à partir de ce modèle, avec ses attributs (données) et ses méthodes (actions).
= class Compte:
=     def __init__(self, titulaire, solde=0): self.titulaire = titulaire; self.solde = solde
=     def deposer(self, montant): self.solde += montant
= c = Compte("Awa") ; c.deposer(5000) ; print(c.solde)  # 5000
### Je vérifie
? Dans l'exemple, qu'est-ce que deposer ?
- Un attribut
+ Une méthode
- Une classe
! Une méthode est une fonction définie dans une classe, qui agit sur l'objet.
? Que représente self ?
+ L'objet sur lequel la méthode est appelée
- La classe parente
- Un mot réservé inutile
! self désigne l'objet courant (ici le compte d'Awa).
### Je m'exerce
1. Ajoute une méthode retirer(montant) qui refuse un retrait supérieur au solde.
### Corrigé
1. def retirer(self, montant): if montant > self.solde: raise ValueError("Solde insuffisant") puis self.solde -= montant

## 1N-DA-02 | Le modèle client-serveur et le protocole HTTP | 55 min
Objectif : Expliquer comment une application web échange avec un serveur.
### Je retiens
> Le **client** (navigateur, application mobile) envoie une **requête** HTTP à un **serveur**, qui renvoie une **réponse** (page, données JSON) avec un code d'état : 200 (succès), 404 (introuvable), 500 (erreur du serveur).
- Méthodes : GET (lire), POST (créer), PUT/PATCH (modifier), DELETE (supprimer).
### Je vérifie
? Que signifie le code 404 ?
- Succès
+ Ressource introuvable
- Erreur du serveur
! 404 indique que la page ou la donnée demandée n'existe pas.
? Quelle méthode HTTP utilise-t-on pour envoyer un nouveau formulaire d'inscription ?
- GET
+ POST
- DELETE
! POST crée une nouvelle ressource sur le serveur.
### Je m'exerce
1. Décris le trajet d'une demande quand tu consultes tes résultats d'examen en ligne.
### Corrigé
1. Le navigateur envoie une requête GET avec ton numéro de table ; le serveur cherche dans sa base de données et renvoie une page avec tes résultats (code 200), ou 404 si le numéro n'existe pas.

## 1N-DA-03 | Les bases de données et SQL | 60 min
Objectif : Interroger une base de données relationnelle avec SQL.
### Je retiens
> Une base de données relationnelle range les données en **tables** (lignes et colonnes). SQL permet de les interroger.
= SELECT nom, moyenne FROM eleves WHERE classe = '1ère D' ORDER BY moyenne DESC;
= INSERT INTO eleves (nom, classe, moyenne) VALUES ('Koffi', '1ère D', 13.5);
### Je vérifie
? Que fait WHERE dans une requête SQL ?
+ Il filtre les lignes selon une condition
- Il trie les résultats
- Il supprime la table
! WHERE garde seulement les lignes qui respectent la condition.
? Quelle commande ajoute un nouvel élève ?
- SELECT
+ INSERT INTO
- DROP
! INSERT INTO ajoute une ligne dans une table.
### Je m'exerce
1. Écris la requête qui affiche les élèves ayant une moyenne d'au moins 10.
### Corrigé
1. SELECT nom, moyenne FROM eleves WHERE moyenne >= 10;

## 1N-DA-04 | Concevoir l'expérience utilisateur (UX/UI) | 55 min
Objectif : Concevoir une application simple, accessible et adaptée aux utilisateurs ivoiriens.
### Je retiens
> L'**UX** (expérience utilisateur) concerne la facilité d'usage ; l'**UI** (interface) concerne l'apparence. Bonnes pratiques : connaître ses utilisateurs (connexion lente, téléphones d'entrée de gamme, langues), textes clairs, gros boutons, peu d'étapes, contraste suffisant.
### Je vérifie
? Que signifie UX ?
+ Expérience utilisateur
- Unité de calcul
- Extension de fichier
! L'UX mesure si l'application est simple et agréable à utiliser.
? Pour des utilisateurs avec une connexion lente, que faut-il privilégier ?
- Des vidéos lourdes en page d'accueil
+ Des pages légères et des images optimisées
- Beaucoup d'animations
! Une application légère se charge vite même avec une faible connexion.
### Je m'exerce
1. Propose 3 améliorations pour une application de paiement utilisée par des commerçants du marché.
### Corrigé
1. Gros boutons et chiffres lisibles ; confirmation vocale ou par SMS ; fonctionnement possible en connexion faible ou hors ligne.

## 1N-DA-05 | La sécurité des applications | 55 min
Objectif : Protéger les comptes et les données des utilisateurs.
### Je retiens
> Ne jamais stocker un mot de passe en clair : on le **hache** (bcrypt). Vérifier toutes les données reçues (injection SQL), utiliser HTTPS, limiter les droits de chaque utilisateur, mettre à jour les bibliothèques.
### Je vérifie
? Comment doit-on stocker un mot de passe ?
- En clair dans la base
+ Haché avec un algorithme adapté comme bcrypt
- Dans un fichier texte public
! Le hachage empêche de retrouver le mot de passe même si la base est volée.
? Qu'est-ce qu'une injection SQL ?
+ Une attaque qui glisse du code SQL malveillant dans un champ de saisie
- Une mise à jour de la base
- Un vaccin informatique
! On s'en protège avec des requêtes paramétrées et la validation des données.
### Je m'exerce
1. Cite trois règles de sécurité pour une application scolaire.
### Corrigé
1. Mots de passe hachés ; chaque élève ne voit que ses propres données ; connexion en HTTPS.
