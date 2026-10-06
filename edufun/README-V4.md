# EduFun V4 — plateforme éducative ivoirienne

EduFun V4 étend le socle Spring Boot/Thymeleaf/JPA de la V3 avec un vrai moteur de progression, de quiz, de badges, de tutorat, de sessions d'examens, de certificats et de versionnement du référentiel.

## Fonctionnalités V4
- CP1 → Terminale : catalogue par niveau et matière.
- Leçons + vidéos + suivi de progression.
- Quiz QCM / vrai-faux avec score et XP.
- Badges automatiques selon l'XP.
- Répétiteurs : candidature, validation et affectation élève/répétiteur.
- Sessions d'examen avec dates de début/fin, échéance de correction et publication des résultats.
- Publication automatique des résultats deux jours après la soumission lorsque la copie a été corrigée.
- Certificats et endpoint de vérification par numéro.
- Versions du référentiel avec source officielle et indicateur expérimental.
- Dashboard enrichi.

## Référentiel
Le site DPFC officiel recense les programmes, progressions, manuels/supports, évaluations et autres documents pédagogiques. La plateforme distingue les contenus EduFun de travail des références officielles.

Sources :
- https://dpfc-ci.net/?page_id=4855
- https://dpfc-ci.net/?page_id=289
- https://dpfc-ci.net/?page_id=283
- https://dpfc-ci.net/?page_id=5267
- https://dpfc-ci.net/?page_id=75

Attention : le contenu pédagogique généré dans le seed est une base de progression et ne doit pas être présenté comme une reproduction intégrale des programmes officiels. Les documents officiels doivent être validés et enrichis avant une mise en production scolaire.

## Lancer dans IntelliJ IDEA
Utiliser Java 21 et le Maven intégré à IntelliJ.

```powershell
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\plugins\maven\lib\maven3\bin\mvn.cmd" -U clean install
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
```

Puis ouvrir `http://localhost:8082`.

## Base locale
H2 est configurée pour le développement. SQL Server est déclaré dans Maven pour une transition vers un environnement de production.

## API principales
- `/api/dashboard`
- `/api/levels`
- `/api/subjects`
- `/api/curriculum`
- `/api/lessons`
- `/api/quizzes`
- `/api/quiz-attempts`
- `/api/badges`
- `/api/tutor-assignments`
- `/api/exam-sessions`
- `/api/exams`
- `/api/certificates`
- `/api/certificates/verify/{number}`
- `/api/curriculum-versions`

## Important avant production
Le squelette actuel reste un environnement de développement : l'autorisation Spring Security est permissive pour faciliter les tests. Avant ouverture publique, ajouter une authentification réelle, des rôles ADMIN/TUTEUR/ELEVE, BCrypt, contrôle d'accès serveur, audit, rate limiting, stockage objet des fichiers et configuration SQL Server sécurisée.
