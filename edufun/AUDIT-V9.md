# Audit EduFun — V9

## 1. Problème constaté sur l'écran d'inscription

### Avant
- Le formulaire créait uniquement une ligne `Student` via `POST /api/students`.
- Aucun mot de passe n'était demandé.
- Aucun compte utilisateur n'était créé.
- Il n'existait pas de vraie page `/login`.
- Après inscription, le navigateur était envoyé vers `/programme` et conservait seulement `edufunStudentId` dans `localStorage`.
- L'accès aux pages n'était donc pas un véritable espace authentifié.

### Après
- `UserAccount` persistant en base.
- Mot de passe BCrypt.
- rôle `STUDENT` / `ADMIN`.
- vraie page `/login` avec Spring Security.
- connexion automatique après inscription.
- session HTTP persistée.
- déconnexion sécurisée.
- migration douce des anciens élèves déjà présents en base.

## 2. Incohérence des cours

### Avant
Les cartes du tableau de bord ouvraient une petite modale avec le contenu d'un objet `Course`, alors que le vrai curriculum utilisait des entités `Lesson` et une page `/lecon/{id}`.

### Après
Les cartes du tableau de bord renvoient vers `/programme?level=...&subject=...`.
Le parcours pédagogique passe par les vraies `Lesson` puis par le lecteur dédié `/lecon/{id}`.

## 3. Progression

La progression est désormais associée au compte étudiant connecté et les endpoints sensibles vérifient que l'étudiant ne peut consulter/modifier que son propre espace.

## 4. API / sécurité

- API d'écriture protégées par Spring Security.
- CSRF conservé pour les sessions web.
- Le frontend récupère le token CSRF pour les POST/PATCH/DELETE.
- Administration réservée au rôle `ADMIN`.
- endpoints de progression contrôlés par identité du compte.
- correction du JavaScript de revue d'examen : le backend attend seulement `score`.

## 5. Dashboard

Le dashboard affiche désormais :
- nom de l'élève connecté ;
- niveau ;
- XP ;
- leçons terminées ;
- XP de leçons ;
- quiz réalisés ;
- badges obtenus.

## 6. Compte administrateur local

`admin@edufun.ci`

`EduFun@2026`

À changer avant toute mise en production.

## 7. Limite de validation locale

Le code a été contrôlé structurellement, mais Maven ne peut pas télécharger sa distribution depuis Maven Central dans l'environnement de construction actuel. La compilation finale doit être exécutée dans IntelliJ avec le Maven local déjà fonctionnel sur la machine de développement.
