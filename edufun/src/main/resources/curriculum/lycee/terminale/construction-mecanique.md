---
levels: Terminale E, Terminale F1
subject: Construction mécanique
---
# Résistance des matériaux

## TN-CM-01 | Traction et compression | 60 min
Objectif : Vérifier la résistance d'une pièce sollicitée en traction et calculer son allongement.
### Situation d'apprentissage
Une entreprise de charpente métallique de la zone industrielle de Vridi doit suspendre un palan à un tirant en acier S235. Le bureau d'études demande aux stagiaires de vérifier que le tirant ne se déformera pas de façon permanente.
### Je retiens
> Une poutre est sollicitée en traction quand deux forces opposées tendent à l'allonger, en compression quand elles tendent à la raccourcir.
= Contrainte normale : σ = N / S, avec N en N, S en mm², σ en MPa (1 MPa = 1 N/mm²)
= Condition de résistance : σ ≤ Rpe, avec Rpe = Re / s (s : coefficient de sécurité)
= Loi de Hooke (domaine élastique) : σ = E × ε, avec ε = ΔL / L (sans unité)
= Allongement : ΔL = N × L / (E × S)
= Acier : E ≈ 210 000 MPa ; aluminium : E ≈ 70 000 MPa
= Exemple : tige de diamètre 10 mm, N = 10 kN : S = π × 10² / 4 ≈ 78,54 mm², σ ≈ 127,3 MPa
- Pour un S235 avec s = 2 : Rpe = 235 / 2 = 117,5 MPa ; ici σ = 127,3 MPa > Rpe, la tige de 10 mm ne convient pas.
- Au-delà de Re, la déformation devient permanente ; au-delà de Rm, la pièce casse.
### Je vérifie
? Que représente le coefficient de sécurité s ?
+ La marge entre la limite élastique du matériau et la contrainte admise
- Le pourcentage de carbone de l'acier
- L'allongement maximal de la pièce
! Rpe = Re / s : on n'admet qu'une fraction de Re pour couvrir les incertitudes.
? Un câble de section 50 mm² supporte une traction de 6 000 N. Sa contrainte vaut :
+ 120 MPa
- 300 MPa
- 12 MPa
! σ = N / S = 6 000 / 50 = 120 N/mm² = 120 MPa.
### Je m'exerce
1. Pour le tirant (N = 10 kN, acier S235, s = 2), calcule le diamètre minimal puis choisis un diamètre entier en millimètres.
2. Avec un diamètre de 12 mm et une longueur de 1,5 m, calcule l'allongement du tirant (E = 210 000 MPa).
### Corrigé
1. S ≥ N / Rpe = 10 000 / 117,5 ≈ 85,1 mm² ; d ≥ √(4 × 85,1 / π) ≈ √108,4 ≈ 10,41 mm. On choisit d = 11 mm (ou 12 mm, diamètre courant du commerce).
2. S = π × 12² / 4 ≈ 113,1 mm² ; σ = 10 000 / 113,1 ≈ 88,4 MPa ; ΔL = σ × L / E = 88,4 × 1 500 / 210 000 ≈ 0,63 mm.

## TN-CM-02 | Le cisaillement | 55 min
Objectif : Dimensionner une goupille ou un rivet sollicité au cisaillement.
### Situation d'apprentissage
Dans un atelier de maintenance de la SOTRA, une goupille d'articulation de porte de bus s'est rompue. Le technicien doit choisir un nouveau diamètre de goupille capable de supporter l'effort.
### Je retiens
> Une section est cisaillée quand deux forces opposées, très proches, tendent à faire glisser une partie de la pièce par rapport à l'autre.
= Contrainte tangentielle moyenne : τ = T / S (T : effort tranchant en N, S : section cisaillée en mm²)
= Condition de résistance : τ ≤ Rpg, avec Rpg = Reg / s
= Pour les aciers doux, on prend couramment Reg ≈ 0,5 × Re
> Simple cisaillement : une seule section cisaillée. Double cisaillement (chape) : deux sections, chacune reprend la moitié de l'effort.
= Exemple : goupille de diamètre 8 mm en double cisaillement, F = 6 000 N
= S = π × 8² / 4 ≈ 50,27 mm² ; τ = 6 000 / (2 × 50,27) ≈ 59,7 MPa
- Le montage en chape divise par deux la contrainte : c'est une solution courante pour les articulations.
- Le cisaillement est aussi recherché volontairement : découpage de tôles à la cisaille ou au poinçon.
### Je vérifie
? Dans une articulation en chape, la goupille travaille en :
+ double cisaillement
- simple cisaillement
- traction
! Elle est coupée selon deux sections, une de chaque côté de la pièce centrale.
? Un rivet en simple cisaillement, de section 20 mm², supporte 1 600 N. Contrainte de cisaillement ?
+ 80 MPa
- 40 MPa
- 32 000 MPa
! τ = T / S = 1 600 / 20 = 80 MPa.
### Je m'exerce
1. Un rivet en simple cisaillement doit transmettre 4 000 N. Avec Rpg = 80 MPa, calcule son diamètre minimal.
2. La même liaison est réalisée en double cisaillement. Quel diamètre minimal suffit alors ?
### Corrigé
1. S ≥ 4 000 / 80 = 50 mm² ; d ≥ √(4 × 50 / π) = √63,66 ≈ 7,98 mm, on prend d = 8 mm.
2. Chaque section reprend 2 000 N : S ≥ 25 mm² ; d ≥ √(4 × 25 / π) = √31,83 ≈ 5,64 mm, on prend d = 6 mm.

## TN-CM-03 | La flexion simple | 60 min
Objectif : Calculer le moment fléchissant maximal et la contrainte maximale dans une poutre.
### Situation d'apprentissage
Pour un entrepôt du port d'Abidjan, un atelier fabrique une passerelle dont chaque poutre de 1 m repose sur deux appuis. Un ouvrier chargé pèse au milieu de la poutre : faut-il poser la poutre rectangulaire à plat ou sur chant ?
### Je retiens
> En flexion, les fibres d'un côté de la poutre sont tendues, celles de l'autre côté comprimées ; la fibre moyenne (neutre) n'est pas sollicitée.
= Poutre sur deux appuis, charge F au milieu, portée L : RA = RB = F / 2 et Mf max = F × L / 4 (au milieu)
= Poutre encastrée (console) de longueur L, charge F à l'extrémité : Mf max = F × L (à l'encastrement)
= Contrainte maximale : σ max = Mf max / (I / v)
= Section rectangulaire b × h (h dans le sens de la charge) : I / v = b × h² / 6
= Condition de résistance : σ max ≤ Rpe
= Exemple : F = 2 000 N, L = 1 000 mm donne Mf max = 500 000 N·mm ; b = 20 mm, h = 40 mm donne I / v ≈ 5 333 mm³ et σ max ≈ 93,8 MPa
- La hauteur h intervient au carré : une poutre sur chant résiste beaucoup mieux qu'à plat.
- C'est pourquoi on utilise des profilés en I (IPE) : la matière est éloignée de la fibre neutre.
### Je vérifie
? Pour une poutre rectangulaire, quelle dimension augmente le plus la résistance à la flexion ?
+ La hauteur dans le sens de la charge
- La largeur
- La longueur
! I / v = b h² / 6 : doubler h multiplie la résistance par 4, doubler b seulement par 2.
? Une console de 0,8 m porte une charge de 500 N à son extrémité. Moment fléchissant maximal ?
+ 400 N·m
- 100 N·m
- 625 N·m
! Mf max = F × L = 500 × 0,8 = 400 N·m, à l'encastrement.
### Je m'exerce
1. Reprends l'exemple (F = 2 000 N, L = 1 m) avec la poutre posée à plat : b = 40 mm, h = 20 mm. Calcule σ max.
2. La poutre est en S235 avec s = 2. Quelle position convient ?
### Corrigé
1. I / v = 40 × 20² / 6 = 16 000 / 6 ≈ 2 667 mm³ ; σ max = 500 000 / 2 667 ≈ 187,5 MPa.
2. Rpe = 235 / 2 = 117,5 MPa. Sur chant : 93,8 MPa ≤ 117,5 MPa, la résistance est vérifiée. À plat : 187,5 MPa > 117,5 MPa, elle ne l'est pas. Il faut poser la poutre sur chant.

# Transmission de puissance et épreuve du BAC

## TN-CM-04 | Puissance, couple et rendement d'une chaîne de transmission | 60 min
Objectif : Calculer la puissance, le couple et le rendement à chaque étage d'une chaîne cinématique.
### Situation d'apprentissage
Une rizerie de Gagnoa entraîne son décortiqueuse par un moteur de 4 kW tournant à 1 450 tr/min, suivi d'un réducteur. Le responsable de maintenance veut connaître le couple disponible en sortie.
### Je retiens
> Puissance mécanique en rotation : P = C × ω (P en W, C en N·m, ω en rad/s) ; en translation : P = F × v.
> Le rendement d'un élément est η = P sortie / P entrée (toujours inférieur à 1).
= Rendement global d'éléments en série : η g = η1 × η2 × η3…
= Réducteur : N s = r × N e ; P s = η × P e ; C s = P s / ω s
= Exemple : moteur 4 kW à 1 450 tr/min : ω = 2π × 1 450 / 60 ≈ 151,8 rad/s ; C = 4 000 / 151,8 ≈ 26,3 N·m
= Réducteur r = 1/5, η = 0,90 : N s = 290 tr/min ; P s = 3,6 kW ; ω s ≈ 30,37 rad/s ; C s ≈ 118,5 N·m
- Un réducteur diminue la vitesse et augmente le couple ; la puissance diminue un peu à cause des pertes.
- Les pertes (frottements) se transforment en chaleur : d'où l'importance de la lubrification.
### Je vérifie
? Un réducteur parfait (η = 1) divise la vitesse par 4. Le couple de sortie est :
+ multiplié par 4
- divisé par 4
- inchangé
! À puissance constante, C = P / ω : si ω est divisé par 4, C est multiplié par 4.
? Une chaîne comprend un engrenage (η = 0,96) et une transmission par courroie (η = 0,95). Rendement global ?
+ 0,912
- 1,91
- 0,955
! η g = 0,96 × 0,95 = 0,912.
### Je m'exerce
1. Un treuil lève une charge de 500 kg à la vitesse constante de 0,2 m/s (g = 10 N/kg). Calcule la puissance utile.
2. Le rendement global du treuil est 0,80. Quelle puissance doit fournir le moteur ?
### Corrigé
1. F = m × g = 500 × 10 = 5 000 N ; P u = F × v = 5 000 × 0,2 = 1 000 W.
2. P moteur = P u / η = 1 000 / 0,80 = 1 250 W.

## TN-CM-05 | Méthode pour l'épreuve du BAC de construction mécanique | 60 min
Objectif : Organiser sa réponse à un sujet de BAC à partir d'un dossier technique.
### Situation d'apprentissage
À trois mois du BAC, les élèves de Terminale F1 d'un lycée technique de Yamoussoukro reçoivent un sujet blanc : dossier technique d'un monte-charge, dessin d'ensemble et questionnaire de 6 pages. Beaucoup perdent du temps à chercher par où commencer.
### Je retiens
> Étape 1 : lire tout le sujet et le dossier technique (mise en situation, nomenclature, dessin d'ensemble) avant de répondre.
> Étape 2 : analyse fonctionnelle et technologique : identifier les classes d'équivalence (pièces liées entre elles), les liaisons et tracer le schéma cinématique.
> Étape 3 : suivre la chaîne de transmission du moteur jusqu'à l'organe récepteur, en notant N, P, C et η à chaque étage.
> Étape 4 : calculs de résistance (traction, cisaillement, flexion) : isoler, faire le bilan des forces, appliquer le PFS, puis vérifier la condition de résistance.
> Étape 5 : partie graphique : respecter les normes (traits, vues, coupes, cotation fonctionnelle).
= Toujours écrire : formule littérale, application numérique, résultat avec unité
= Unités utiles : 1 MPa = 1 N/mm² ; 1 kW = 1 000 W ; ω (rad/s) = 2π N / 60
- Gérer le temps : repérer le barème et commencer par les parties où l'on est le plus sûr.
- Relire chaque résultat : un ordre de grandeur absurde (couple de 10 000 N·m sur un petit moteur) signale une erreur d'unité.
### Je vérifie
? Avant de calculer une contrainte, quelle conversion évite la plupart des erreurs ?
+ Exprimer les forces en N et les sections en mm² pour obtenir des MPa
- Exprimer les forces en kN et les sections en m²
- Arrondir toutes les valeurs à l'unité
! N / mm² = MPa : c'est l'unité directe de comparaison avec Re ou Rpe.
? Un élève trouve qu'un moteur de 1,5 kW à 1 440 tr/min fournit un couple de 1 041 N·m. Quelle est l'erreur probable ?
+ Il a utilisé N en tr/min au lieu de ω en rad/s
- Il a oublié le rendement
- Il a confondu le diamètre et le rayon
! 1 500 / 1 440 ≈ 1,04 ; avec ω = 150,8 rad/s on trouve C ≈ 9,95 N·m.
### Je m'exerce
1. Sujet type : un moteur de 1,5 kW à 1 440 tr/min entraîne une poulie de 100 mm reliée par courroie à une poulie de 200 mm ; l'arbre de cette poulie porte un pignon de 20 dents qui engrène avec une roue de 80 dents. Le rendement global est 0,85. Calcule la fréquence de rotation de sortie, la puissance de sortie et le couple de sortie.
2. Cite, dans l'ordre, les étapes à suivre pour vérifier la résistance de l'arbre de sortie.
### Corrigé
1. Poulies : N = 1 440 × 100 / 200 = 720 tr/min. Engrenage : N s = 720 × 20 / 80 = 180 tr/min. P s = 0,85 × 1 500 = 1 275 W. ω s = 2π × 180 / 60 ≈ 18,85 rad/s. C s = 1 275 / 18,85 ≈ 67,6 N·m.
2. Isoler l'arbre ; faire le bilan des actions extérieures ; appliquer le PFS pour trouver les inconnues ; identifier la sollicitation ; calculer la contrainte maximale ; la comparer à la résistance pratique ; conclure.
