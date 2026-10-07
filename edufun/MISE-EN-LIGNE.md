# EduFun — mise en ligne de test et accès

> Le dépôt contient aussi le projet GOUABO (racine, `render.yaml`) : les fichiers EduFun sont isolés dans `edufun/` et `.devcontainer/edufun/`.

## Option 1 — GitHub Codespaces (le plus rapide, ≈ 5 minutes)
1. Sur GitHub, dépôt `kingskeymanuel-wq/gouabo`, branche `claude/gracious-thompson-6i1pt8`.
2. **Code** → onglet **Codespaces** → **…** → **New with options** → configuration **« EduFun (plateforme éducative) »** → **Create codespace**.
3. L'application se construit puis démarre seule dans le terminal « edufun ». Onglet **Ports** : le port 8082 a une adresse publique `https://…-8082.app.github.dev` à ouvrir (ou partager).

## Option 2 — Render (adresse publique permanente, gratuite)
1. Créer un compte sur https://render.com (connexion avec GitHub, autoriser le dépôt).
2. **New +** → **Blueprint** → dépôt `kingskeymanuel-wq/gouabo`, branche `claude/gracious-thompson-6i1pt8`, **Blueprint Path : `edufun/render.yaml`**.
3. Render construit l'image Docker (5 à 10 minutes) et donne une adresse `https://edufun-xxxx.onrender.com`. Mettre ensuite cette adresse dans `EDUFUN_SITE_URL` (Environment).

Plan gratuit : mise en veille après 15 minutes sans visite (premier chargement ≈ 1 minute) et base de test réinitialisée à chaque redéploiement.

## Comptes de test (créés automatiquement avec EDUFUN_DEMO_DATA=true)

| Portail | Page de connexion | Identifiant | Mot de passe | Situation |
|---|---|---|---|---|
| Administration (CRM) | `/console` | admin@edufun.ci | EduFun@Test2026 | Accès complet |
| Élève collège | `/login` | eleve.college@demo.edufun.ci | Demo@2026 | 6e, abonné |
| Élève primaire | `/login` | eleve.primaire@demo.edufun.ci | Demo@2026 | CM2, abonné |
| Élève lycée | `/login` | eleve.lycee@demo.edufun.ci | Demo@2026 | Terminale D, abonné |
| Élève lycée technique | `/login` | eleve.technique@demo.edufun.ci | Demo@2026 | Terminale F3, abonné |
| Élève à activer | `/login` | eleve.nouveau@demo.edufun.ci | Demo@2026 | 5e, aucun paiement : cours bloqués |
| Élève en vérification | `/login` | eleve.verification@demo.edufun.ci | Demo@2026 | 3e, paiement Wave à valider dans le CRM |
| Parent | `/login` | parent.demo@demo.edufun.ci | Demo@2026 | Annuaire des répétiteurs et messagerie |
| Répétiteur visible | `/repetiteur/connexion` | repetiteur.demo@demo.edufun.ci | Demo@2026 | Cocody, visible 3 mois |
| Répétiteur non payé | `/repetiteur/connexion` | repetiteur.nonpaye@demo.edufun.ci | Demo@2026 | Marcory, pas encore visible |

Autres répétiteurs visibles : Fatou Diabaté (Yopougon), Ibrahim Ouattara (Abobo), Aya Yao (Bouaké).
Les paiements Mobile Money sont déclarés avec une référence (n'importe quel texte de 4 caractères ou plus en test), puis validés dans le CRM.

## Parcours conseillés
1. **Élève à activer** : constater le blocage des cours, payer dans « Mon abonnement » → accès provisoire immédiat.
2. **Administration** → Paiements : valider → l'élève devient « Abonné » avec le mois offert.
3. **Parent** : chercher Abidjan / Cocody / Mathématiques, ouvrir la fiche de Serge Kouadio, envoyer un message.
4. **Répétiteur visible** : voir la visite et la notification, répondre dans Messages.
5. **Répétiteur non payé** : déclarer les 5 000 F, valider dans le CRM, vérifier qu'il apparaît dans l'annuaire.

## Avant la vraie mise en production
- `EDUFUN_DEMO_DATA=false` et un mot de passe administrateur fort (`EDUFUN_ADMIN_PASSWORD`), à changer ensuite dans Console → Paramètres.
- Numéro Mobile Money (`edufun.billing.merchant-number`), serveur e-mail (`SPRING_MAIL_HOST`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`).
- Base de données persistante (disque Render ou SQL Server / PostgreSQL).
