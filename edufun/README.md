# EduFun — Spring Boot V3

Plateforme éducative ivoirienne CP1 → Terminale, construite sur Spring Boot 3.3.5 / Java 21.

## Ce que contient cette version

- Catalogue des 13 niveaux : CP1, CP2, CE1, CE2, CM1, CM2, 6e, 5e, 4e, 3e, 2nde, Première, Terminale.
- Parcours pédagogique structuré par niveau, matière, chapitre et leçon.
- CP1 Français : alphabet complet A-Z, syllabes, mots, phrases, compréhension, écriture et évaluation.
- Parcours primaire : Français, Mathématiques, Anglais, Sciences, EDHC, EPS, Arts et Histoire-Géographie selon le niveau.
- Parcours secondaire : Français, Mathématiques, Anglais, SVT, Physique-Chimie, Histoire-Géographie, EDHC, EPS, Arts, Éducation Musicale, Informatique, Philosophie, Espagnol et Développement Web selon le niveau.
- Vidéos administrables : ajout/suppression par API et interface Administration.
- Progression élève : leçon terminée → +20 XP → historique de progression.
- Examens : soumission, correction administrative, PASS/FAIL.
- Répétiteurs : candidature, validation/refus.
- Administration : élèves, cours, leçons, vidéos, examens et indicateurs.
- H2 pour développement local ; SQL Server conservé dans le POM pour une évolution production.

## Lancer

Java 21 requis.

Avec Maven IntelliJ :

```powershell
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\plugins\maven\lib\maven3\bin\mvn.cmd" -U clean install
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
```

Ou après package :

```powershell
java -jar target\edufun-portal-1.0.0.jar
```

Ouvrir : http://localhost:8082

## API principales

- GET /api/levels
- GET /api/subjects
- GET /api/dashboard
- GET /api/curriculum?level=CP1&subject=Français
- GET /api/lessons/{id}
- GET /api/lessons/{id}/videos
- POST /api/lessons
- POST /api/videos
- DELETE /api/videos/{id}
- POST /api/lessons/{lessonId}/complete?studentId={id}
- GET /api/students/{id}/progress
- POST /api/students
- POST /api/tutors
- PATCH /api/tutors/{id}/approve
- PATCH /api/tutors/{id}/reject
- POST /api/exams
- PATCH /api/exams/{id}/review?score={score}

## Référentiel ivoirien

La structure de contenu est alignée sur les catégories publiées par la Direction de la Pédagogie et de la Formation Continue (DPFC) : programmes éducatifs et guides d'exécution du primaire et du secondaire, progressions 2025-2026, banques de situations et documents d'évaluation.

Sources institutionnelles à consulter pour la mise à jour des contenus :
- https://dpfc-ci.net/?page_id=289
- https://dpfc-ci.net/?page_id=283
- https://dpfc-ci.net/?page_id=5267
- https://dpfc-ci.net/?page_id=768
- https://dpfc-ci.net/?page_id=4765

Important : l'année scolaire 2025-2026 comprend une expérimentation de nouveaux programmes au pré-primaire, CP1, CP2 et 6e dans des établissements pilotes. EduFun doit donc conserver la notion de version de référentiel avant de déclarer un contenu « officiel » pour toute la Côte d'Ivoire.
