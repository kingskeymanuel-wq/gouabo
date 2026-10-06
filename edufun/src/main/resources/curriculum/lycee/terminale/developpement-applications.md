---
levels: Terminale A, Terminale C, Terminale D
subject: Développement d'applications
---
# Du projet au produit

## TN-DA-01 | Concevoir une API REST | 60 min
Objectif : Concevoir les points d'accès d'une API pour une application mobile.
### Je retiens
> Une API REST expose des ressources par des adresses (URL) et des méthodes HTTP.
= GET /api/eleves → liste des élèves
= GET /api/eleves/12 → l'élève n° 12
= POST /api/eleves → créer un élève
= DELETE /api/eleves/12 → supprimer l'élève n° 12
- Les réponses sont en JSON ; l'accès est protégé par authentification.
### Je vérifie
? Quelle requête récupère l'élève n° 12 ?
+ GET /api/eleves/12
- POST /api/eleves/12
- DELETE /api/eleves
! GET lit une ressource ; l'identifiant est dans l'URL.
? Pourquoi protéger une API par authentification ?
- Pour la rendre plus lente
+ Pour que seules les personnes autorisées accèdent aux données
- Parce que JSON l'exige
! Sans authentification, n'importe qui pourrait lire ou modifier les données.
### Je m'exerce
1. Conçois les routes d'une API de gestion des livres d'une bibliothèque scolaire.
### Corrigé
1. GET /api/livres ; GET /api/livres/{id} ; POST /api/livres ; PATCH /api/livres/{id} ; POST /api/emprunts ; GET /api/eleves/{id}/emprunts.

## TN-DA-02 | Le développement mobile | 60 min
Objectif : Connaître les approches de développement d'applications mobiles.
### Je retiens
> Applications **natives** (Kotlin pour Android, Swift pour iOS) ; applications **multiplateformes** (Flutter, React Native) : un seul code pour Android et iOS ; **PWA** (application web installable). En Côte d'Ivoire, Android domine : penser aux téléphones d'entrée de gamme et au mode hors ligne.
### Je vérifie
? Quel est l'avantage d'un outil multiplateforme comme Flutter ?
+ Un seul code pour Android et iOS
- Il ne fonctionne qu'hors ligne
- Il n'a pas besoin de test
! On développe une fois et on publie sur les deux systèmes.
? Qu'est-ce qu'une PWA ?
- Un virus
+ Une application web que l'on peut installer comme une application
- Un langage de programmation
! La PWA s'installe depuis le navigateur et peut fonctionner partiellement hors ligne.
### Je m'exerce
1. Quelle approche choisirais-tu pour une application destinée surtout aux élèves de ton lycée ? Justifie.
### Corrigé
1. Une PWA ou une application Android multiplateforme : la plupart des élèves ont un téléphone Android, et une PWA évite le passage par le magasin d'applications.

## TN-DA-03 | Déploiement et hébergement | 55 min
Objectif : Mettre une application en ligne et la maintenir.
### Je retiens
> Déployer, c'est installer l'application sur un serveur accessible par Internet (hébergeur, cloud). Il faut un nom de domaine, un certificat HTTPS, des sauvegardes de la base de données et une surveillance des erreurs.
### Je vérifie
? Que signifie « déployer » une application ?
+ La mettre en ligne sur un serveur accessible aux utilisateurs
- La supprimer
- La dessiner sur papier
! Le déploiement rend l'application disponible au public.
? Pourquoi faire des sauvegardes de la base de données ?
- Pour aller plus vite
+ Pour pouvoir restaurer les données en cas de panne ou d'erreur
- Pour changer le design
! Sans sauvegarde, une panne peut faire perdre toutes les données.
### Je m'exerce
1. Fais la liste de contrôle avant de mettre en ligne une application.
### Corrigé
1. Tests passés ; HTTPS actif ; mots de passe et clés hors du code ; sauvegardes automatiques ; page d'erreur ; surveillance.

## TN-DA-04 | L'intelligence artificielle dans les applications | 55 min
Objectif : Comprendre les usages et les limites de l'IA dans une application.
### Je retiens
> L'IA permet de reconnaître des images, traduire, résumer, répondre à des questions. Un modèle apprend à partir de données. Limites : erreurs possibles, biais, protection des données personnelles. Il faut toujours vérifier ses réponses et informer les utilisateurs.
### Je vérifie
? Comment un modèle d'IA apprend-il ?
+ À partir de grandes quantités de données d'exemples
- En lisant les pensées de l'utilisateur
- Il ne peut pas apprendre
! Le modèle repère des régularités dans les données d'entraînement.
? Quelle attitude adopter face à une réponse d'une IA ?
- La croire sans vérifier
+ La vérifier avec des sources fiables
- La recopier dans sa copie d'examen
! Une IA peut se tromper : l'esprit critique reste indispensable.
### Je m'exerce
1. Propose une fonctionnalité d'IA utile pour une application agricole ivoirienne.
### Corrigé
1. Reconnaître une maladie du cacaoyer à partir d'une photo de feuille et proposer des conseils, à confirmer par un agent agricole.

## TN-DA-05 | Gestion de projet agile et entrepreneuriat numérique | 60 min
Objectif : Organiser un projet d'application et imaginer son modèle économique.
### Je retiens
> Méthode **agile** : on livre par petites étapes (sprints de 1 à 2 semaines), on recueille l'avis des utilisateurs et on améliore. **Modèle économique** : gratuit avec publicité, abonnement, commission sur transactions (paiement Mobile Money), vente aux entreprises.
### Je vérifie
? Qu'est-ce qu'un sprint en méthode agile ?
+ Une courte période de travail qui aboutit à une version utilisable
- Une course à pied
- Un bug grave
! Chaque sprint livre une amélioration que l'on peut montrer aux utilisateurs.
? Quel modèle économique repose sur un paiement mensuel ?
- La publicité
+ L'abonnement
- Le don unique
! L'abonnement fait payer l'accès au service chaque mois.
### Je m'exerce
1. Présente en 4 lignes un projet d'application utile pour ta ville (problème, solution, utilisateurs, revenus).
### Corrigé
1. Exemple : Problème : les patients attendent longtemps au centre de santé. Solution : prise de rendez-vous par téléphone. Utilisateurs : patients et centres de santé. Revenus : abonnement payé par les centres de santé.
