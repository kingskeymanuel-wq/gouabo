# EduFun V9 — Espace élève corrigé

## Corrections majeures
- vraie création de compte élève avec mot de passe BCrypt
- connexion Spring Security avec session
- connexion automatique après inscription
- page `/login`
- déconnexion sécurisée avec CSRF
- récupération du profil connecté via `/api/auth/me`
- migration douce des anciens élèves déjà présents en base : leur compte peut être créé avec leur e-mail existant
- contrôle d'accès sur les données de progression d'un élève
- dashboard personnalisé avec nom, niveau, XP et progression
- les cartes de cours du dashboard ne lancent plus une petite modale : elles renvoient vers le parcours complet `/programme`
- correction de la revue d'examen côté JavaScript : suppression du paramètre `status` inutile
- gestion des erreurs API lisible côté frontend
- protection des API d'écriture avec CSRF
- compte administrateur local créé automatiquement : `admin@edufun.ci` / `EduFun@2026`

## Lancement
```powershell
mvnw.cmd -U clean install
mvnw.cmd spring-boot:run
```

Puis ouvrir `http://localhost:8082`.

## Parcours élève
1. `/inscription`
2. créer le compte
3. connexion automatique
4. `/dashboard`
5. choisir le niveau et la matière dans `/programme`
6. ouvrir une leçon dédiée `/lecon/{id}`
7. terminer la leçon pour enregistrer les +20 XP

## Attention
Les contenus pédagogiques EduFun sont des contenus explicatifs structurés pour la plateforme. Ils ne constituent pas une reproduction mot pour mot des documents officiels de la DPFC.
