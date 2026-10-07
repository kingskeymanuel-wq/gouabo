# EduFun V8 — Lecteur de cours complet

Cette version corrige le principal problème UX des versions précédentes : les leçons ne sont plus ouvertes dans une petite modale comme écran principal.

## Nouveau lecteur pédagogique

- Route `/lecon/{id}`
- Page de cours plein écran
- Sommaire de toutes les leçons de la matière et du niveau
- Navigation précédent / suivant
- Objectif pédagogique
- Durée
- Contenu découpé en sections
- Validation de la leçon et +20 XP
- Responsive mobile/desktop

## Référentiel

Le seed pédagogique est structuré par niveaux CP1, CP2, CE1, CE2, CM1, CM2, 6e, 5e, 4e, 3e, 2nde, Première et Terminale. Les familles de matières sont organisées à partir des ressources DPFC. Les contenus générés dans EduFun sont des contenus pédagogiques EduFun et ne doivent pas être présentés comme une reproduction intégrale des documents officiels.

Sources de référence : https://dpfc-ci.net/?page_id=289 ; https://dpfc-ci.net/?page_id=283 ; https://dpfc-ci.net/?page_id=75

## Lancement

Dans IntelliJ IDEA avec le Maven intégré :

```powershell
mvnw.cmd -Didea.version=2026.1.4 -Dmaven.ext.class.path="C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\plugins\maven\lib\intellij.maven.rt\maven-event-listener.jar" -Djansi.passthrough=true -Dstyle.color=always -Dmaven.repo.local="C:\Users\user\.m2\repository" compile -f pom.xml
```

Puis :

```powershell
mvnw.cmd spring-boot:run
```

URL : http://localhost:8082
