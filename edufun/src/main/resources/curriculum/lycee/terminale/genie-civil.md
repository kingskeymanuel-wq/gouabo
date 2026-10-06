---
levels: Terminale F4
subject: Génie civil
---
# Résistance des matériaux

## TN-GC-01 | La flexion simple d'une poutre sur deux appuis | 60 min
Objectif : Calculer les réactions, le moment fléchissant maximal et la contrainte de flexion d'une poutre isostatique.
### Situation d'apprentissage
Dans un atelier de menuiserie de Bingerville, une poutre en bois doit supporter un palan au milieu de sa portée. Le bureau d'études demande aux élèves de Terminale F4 de vérifier qu'elle ne cassera pas.
### Je retiens
> Une poutre fléchie est comprimée d'un côté et tendue de l'autre ; le moment fléchissant M mesure cet effet.
= Charge uniformément répartie p (kN/m) sur une portée L : RA = RB = pL / 2 ; Mmax = pL² / 8 au milieu ; effort tranchant maximal T = pL / 2 aux appuis
= Charge concentrée P au milieu : RA = RB = P / 2 ; Mmax = PL / 4 au milieu
= Contrainte maximale de flexion : σ = M / (I / v)
= Section rectangulaire b × h : I = b h³ / 12 ; v = h / 2 ; I / v = b h² / 6
= Exemple : p = 20 kN/m, L = 5 m : RA = RB = 50 kN ; Mmax = 20 × 25 / 8 = 62,5 kN·m
- Pour une même section, une poutre posée sur chant (h > b) est beaucoup plus résistante, car I / v dépend de h².
- Unités cohérentes : M en N·mm, I / v en mm³, σ en MPa.
### Je vérifie
? Où le moment fléchissant est-il maximal pour une poutre sur deux appuis uniformément chargée ?
+ Au milieu de la portée
- Sur les appuis
- Au quart de la portée
! Mmax = pL² / 8 est atteint au milieu ; il est nul sur les appuis.
? Une poutre de 4 m porte une charge répartie de 10 kN/m. Que vaut Mmax ?
+ 20 kN·m
- 40 kN·m
- 160 kN·m
! Mmax = 10 × 4² / 8 = 160 / 8 = 20 kN·m.
### Je m'exerce
1. Poutre en bois de section 10 cm × 20 cm (h = 20 cm), portée 3 m, charge concentrée de 6 kN au milieu. Calcule Mmax et la contrainte maximale.
2. La contrainte admissible du bois est 10 MPa. La poutre résiste-t-elle ?
### Corrigé
1. Mmax = 6 × 3 / 4 = 4,5 kN·m = 4,5 × 10⁶ N·mm ; I / v = 100 × 200² / 6 ≈ 666 667 mm³ ; σ = 4,5 × 10⁶ / 666 667 = 6,75 MPa.
2. 6,75 MPa ≤ 10 MPa : la poutre résiste.

# Béton armé

## TN-GC-02 | Le béton armé : principes du BAEL | 60 min
Objectif : Calculer les résistances de calcul des matériaux et les sollicitations à l'ELU selon le BAEL.
### Situation d'apprentissage
Le bureau d'études d'une entreprise d'Abidjan prépare les calculs d'un immeuble de bureaux au Plateau selon les règles BAEL 91 modifiées 99. Le stagiaire de Terminale F4 doit calculer les résistances de calcul et dimensionner un tirant.
### Je retiens
> Béton armé : le béton reprend la compression, les armatures en acier reprennent la traction ; l'adhérence les fait travailler ensemble.
> État limite ultime (ELU) : vérification de la résistance ; état limite de service (ELS) : vérification des déformations et de la fissuration.
= Résistance à la traction du béton : ft28 = 0,6 + 0,06 fc28 (fc28 = 25 MPa donne ft28 = 2,1 MPa)
= Résistance de calcul du béton : fbu = 0,85 fc28 / (θ γb), γb = 1,5 et θ = 1 en situation durable (fc28 = 25 MPa donne fbu ≈ 14,17 MPa)
= Résistance de calcul de l'acier : fsu = fe / γs, γs = 1,15 (FeE400 : fsu ≈ 347,8 MPa ; FeE500 : fsu ≈ 434,8 MPa)
= Combinaison ELU : Pu = 1,35 G + 1,5 Q ; combinaison ELS : Pser = G + Q (G : charges permanentes, Q : charges d'exploitation)
= Tirant à l'ELU : As ≥ Nu / fsu
= Section d'une barre HA : HA 8 = 0,50 cm² ; HA 10 = 0,79 cm² ; HA 12 = 1,13 cm² ; HA 14 = 1,54 cm² ; HA 16 = 2,01 cm² ; HA 20 = 3,14 cm²
- Enrobage minimal (BAEL) : 1 cm en local couvert et clos, 3 cm pour les parois exposées aux intempéries, 5 cm en atmosphère marine (cas fréquent sur le littoral ivoirien).
### Je vérifie
? Que vaut fbu pour un béton de fc28 = 25 MPa en situation durable ?
+ Environ 14,17 MPa
- 25 MPa
- 21,25 MPa
! fbu = 0,85 × 25 / (1 × 1,5) ≈ 14,17 MPa.
? G = 40 kN et Q = 20 kN. Que vaut l'effort ultime Nu ?
+ 84 kN
- 60 kN
- 90 kN
! Nu = 1,35 × 40 + 1,5 × 20 = 54 + 30 = 84 kN.
### Je m'exerce
1. Dimensionne les armatures du tirant précédent (Nu = 84 kN) en acier FeE400 et choisis les barres.
2. Calcule ft28 et fbu pour un béton de fc28 = 30 MPa.
### Corrigé
1. As ≥ 84 000 / 347,8 ≈ 241,5 mm² = 2,42 cm² ; on choisit 4 HA 10 (4 × 0,785 ≈ 3,14 cm² ≥ 2,42 cm²).
2. ft28 = 0,6 + 0,06 × 30 = 2,4 MPa ; fbu = 0,85 × 30 / 1,5 = 17 MPa.

## TN-GC-03 | Poutre en béton armé en flexion simple à l'ELU | 60 min
Objectif : Calculer la section d'armatures tendues d'une poutre rectangulaire en flexion simple.
### Situation d'apprentissage
Pour un bâtiment scolaire à Korhogo, une poutre de 20 cm × 40 cm franchit 5 m entre deux poteaux. Le chef du bureau d'études confie aux élèves de Terminale F4 le calcul de ses aciers longitudinaux.
### Je retiens
> Démarche ELU (sans aciers comprimés), béton fc28 = 25 MPa, acier FeE400 :
= 1) Charge ultime : pu = 1,35 g + 1,5 q ; moment : Mu = pu L² / 8
= 2) Hauteur utile : d ≈ 0,9 h
= 3) Moment réduit : μbu = Mu / (b d² fbu) ; si μbu ≤ μl ≈ 0,392 (FeE400), pas d'aciers comprimés
= 4) αu = 1,25 × (1 − √(1 − 2 μbu)) ; bras de levier z = d × (1 − 0,4 αu)
= 5) Section d'acier : Au = Mu / (z × fsu)
= Exemple : b = 20 cm, h = 40 cm, d = 36 cm, g = 10 kN/m, q = 5 kN/m, L = 5 m
= pu = 1,35 × 10 + 1,5 × 5 = 21 kN/m ; Mu = 21 × 25 / 8 ≈ 65,6 kN·m
= μbu = 65,6 × 10⁶ / (200 × 360² × 14,17) ≈ 0,179 ≤ 0,392
= αu = 1,25 × (1 − √0,642) ≈ 0,248 ; z = 360 × (1 − 0,4 × 0,248) ≈ 324 mm
= Au = 65,6 × 10⁶ / (324 × 347,8) ≈ 582 mm² = 5,82 cm², on choisit 3 HA 16 (6,03 cm²)
- On vérifie aussi la section minimale (condition de non-fragilité) : Amin = 0,23 b d ft28 / fe, ici 0,23 × 200 × 360 × 2,1 / 400 ≈ 87 mm².
### Je vérifie
? Pourquoi place-t-on les armatures principales en bas d'une poutre sur deux appuis ?
+ Parce que la partie inférieure est tendue
- Parce que la partie inférieure est comprimée
- Pour faciliter le coffrage
! Sous charge, la fibre inférieure s'allonge : l'acier reprend cette traction.
? Pour une poutre de hauteur h = 50 cm, la hauteur utile d vaut environ :
+ 45 cm
- 50 cm
- 25 cm
! d ≈ 0,9 h = 0,9 × 50 = 45 cm.
### Je m'exerce
1. Poutre b = 15 cm, h = 30 cm, d = 27 cm, Mu = 40 kN·m, fc28 = 25 MPa, FeE400. Calcule μbu, αu, z et Au.
2. Choisis les barres.
### Corrigé
1. μbu = 40 × 10⁶ / (150 × 270² × 14,17) = 40 × 10⁶ / 154,9 × 10⁶ ≈ 0,258 ≤ 0,392 ; αu = 1,25 × (1 − √(1 − 0,516)) = 1,25 × (1 − 0,696) ≈ 0,381 ; z = 270 × (1 − 0,4 × 0,381) ≈ 229 mm ; Au = 40 × 10⁶ / (229 × 347,8) ≈ 502 mm² = 5,02 cm².
2. 2 HA 16 + 1 HA 12 = 4,02 + 1,13 = 5,15 cm² ≥ 5,02 cm² (ou 3 HA 16 = 6,03 cm²).

# Routes et ouvrages

## TN-GC-04 | Routes et ouvrages d'art | 55 min
Objectif : Décrire la structure d'une chaussée et calculer des quantités et des pentes routières.
### Situation d'apprentissage
L'État ivoirien fait bitumer une route de desserte de 1 km près de San-Pédro, avec un dalot pour franchir un marigot. Les élèves de Terminale F4 visitent le chantier et doivent expliquer le rôle de chaque couche et calculer des quantités.
### Je retiens
> Structure d'une chaussée souple, de bas en haut : sol support (plateforme), couche de forme, couche de fondation, couche de base, couche de roulement.
> En Côte d'Ivoire, la fondation est souvent en graveleux latéritique compacté ; la base en graveleux amélioré au ciment ou en grave concassée ; le roulement en enduit superficiel ou en béton bitumineux.
> Profil en long : pentes et rampes le long de l'axe ; profil en travers : chaussée, accotements, fossés.
> Le dévers (pente transversale, souvent de l'ordre de 2,5 %) évacue l'eau de pluie vers les fossés.
> Ouvrages d'art : ponts, viaducs, murs de soutènement ; ouvrages hydrauliques sous chaussée : buses (tuyaux) et dalots (cadres en béton armé).
= Volume d'une couche : V = longueur × largeur × épaisseur
= Pente en long : p = dénivelée / longueur horizontale
= Exemple : couche de base de 1 000 m × 7 m × 0,20 m = 1 400 m³ compactés
= Exemple : chaussée de 7 m avec un dévers de 2,5 % de part et d'autre de l'axe : 3,5 × 0,025 = 0,0875 m, soit environ 8,8 cm de différence entre l'axe et le bord
- L'eau est le premier ennemi de la route : un bon drainage (fossés, dévers, ouvrages hydrauliques) prolonge sa durée de vie.
### Je vérifie
? Quelle couche reçoit directement le trafic et protège la chaussée de l'eau ?
+ La couche de roulement
- La couche de fondation
- La couche de forme
! La couche de roulement assure l'étanchéité et l'adhérence des pneus.
? Une route monte de 6 m sur 400 m. Sa pente en long vaut :
+ 1,5 %
- 6 %
- 0,15 %
! p = 6 / 400 = 0,015 soit 1,5 %.
### Je m'exerce
1. Calcule le volume de couche de fondation de 0,25 m d'épaisseur pour la route de 1 km et 7 m de large.
2. Le liant d'un enduit superficiel est prévu à 1,5 kg/m². Quelle masse de liant faut-il pour cette route ?
### Corrigé
1. V = 1 000 × 7 × 0,25 = 1 750 m³.
2. Surface = 1 000 × 7 = 7 000 m² ; masse = 7 000 × 1,5 = 10 500 kg = 10,5 t.

## TN-GC-05 | Méthode pour l'épreuve du BAC : dimensionner et chiffrer une semelle | 60 min
Objectif : Appliquer une méthode complète de résolution d'un sujet de génie civil, du calcul au devis.
### Situation d'apprentissage
Le sujet de BAC blanc du lycée technique de Yamoussoukro porte sur la semelle d'un poteau d'un centre de santé : il faut calculer les charges, dimensionner la semelle, puis estimer le coût du béton en F CFA.
### Je retiens
> Méthode : 1) lire tout le sujet et relever les données avec leurs unités ; 2) faire un schéma ; 3) convertir dans des unités cohérentes (N, mm, MPa) ; 4) écrire la formule, l'application numérique, le résultat avec unité ; 5) arrondir du côté de la sécurité ; 6) vérifier l'ordre de grandeur et conclure.
= Charges : Nser = G + Q (pour la surface au sol) ; Nu = 1,35 G + 1,5 Q (pour les aciers)
= Surface de la semelle : S ≥ Nser / σ sol
= Volume de béton : V = a × b × h ; ciment = V × dosage
= Exemple : G = 200 kN, Q = 100 kN, σ sol = 0,25 MPa : Nser = 300 kN ; S ≥ 300 000 / 0,25 = 1 200 000 mm² = 1,2 m² ; semelle carrée de 1,10 m (1,21 m²)
= Nu = 1,35 × 200 + 1,5 × 100 = 420 kN
= Hauteur 0,40 m : V = 1,10 × 1,10 × 0,40 = 0,484 m³ ; ciment à 350 kg/m³ : 169,4 kg, soit 4 sacs ; coût du béton à 90 000 F CFA/m³ : 0,484 × 90 000 = 43 560 F CFA
- Les dimensions s'arrondissent toujours vers le haut (au multiple de 5 cm supérieur).
- Une réponse sans unité ou sans conclusion perd des points.
### Je vérifie
? Pour calculer la surface d'une semelle à partir de la contrainte admissible du sol, on utilise ici :
+ Nser = G + Q
- Nu = 1,35 G + 1,5 Q
- G seulement
! La contrainte admissible du sol se compare à la charge de service.
? Une semelle doit avoir une surface d'au moins 1,3 m². Quel côté de semelle carrée choisir ?
+ 1,15 m
- 1,10 m
- 1,30 m
! √1,3 ≈ 1,14 m ; on arrondit au multiple de 5 cm supérieur : 1,15 m (1,32 m²).
### Je m'exerce
1. Poteau : G = 150 kN, Q = 60 kN, σ sol = 0,15 MPa. Calcule Nser, Nu et le côté de la semelle carrée.
2. Hauteur de semelle 0,35 m : calcule le volume de béton et son coût à 90 000 F CFA/m³.
### Corrigé
1. Nser = 210 kN ; Nu = 1,35 × 150 + 1,5 × 60 = 202,5 + 90 = 292,5 kN ; S ≥ 210 000 / 0,15 = 1 400 000 mm² = 1,4 m² ; √1,4 ≈ 1,18 m, on prend 1,20 m (1,44 m²).
2. V = 1,20 × 1,20 × 0,35 = 0,504 m³ ; coût = 0,504 × 90 000 = 45 360 F CFA.
