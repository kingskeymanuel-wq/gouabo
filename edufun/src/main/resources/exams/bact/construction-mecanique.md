---
order: 10
subject: Construction mécanique
series: Séries E et F1
duration: Épreuve écrite
---
# Méthode
> Le sujet s'appuie sur un dossier technique (mise en situation, nomenclature, dessin d'ensemble) : analyse fonctionnelle et cinématique, chaîne de transmission (vitesses, puissances, couples, rendements), puis résistance des matériaux (traction, cisaillement, flexion). Le correcteur attend des isolements clairs, des formules littérales, des applications numériques avec unités et une conclusion à chaque vérification.
1. **Lis tout le dossier** avant de répondre : repère la fonction du mécanisme, les pièces de la nomenclature et les données chiffrées (puissance, fréquences, diamètres, nombres de dents, matériaux).
2. **Analyse cinématique** : regroupe les pièces en classes d'équivalence, nomme les liaisons (pivot, glissière, encastrement…) et suis la chaîne du moteur jusqu'au récepteur.
3. **Transmission** : à chaque étage, calcule N (r = d1/d2 ou Z1/Z2), P (η global = produit des rendements), ω = 2πN/60 et C = P/ω.
4. **Statique** : isole le solide, fais le bilan des actions extérieures, applique le PFS (moments au point où passe une inconnue).
5. **Résistance des matériaux** : identifie la sollicitation, calcule la contrainte (N en N, S en mm², résultat en MPa), compare à Rpe = Re/s ou Rpg = Reg/s et conclus ; choisis ensuite une dimension normalisée supérieure.
6. **Relis** les ordres de grandeur et le barème pour gérer ton temps.
- Piège : utiliser N en tr/min au lieu de ω en rad/s dans C = P/ω.
- Piège : oublier que la chape met l'axe en double cisaillement (deux sections).
- Piège : mélanger N·m et N·mm dans σ = Mf/(I/v) ; travaille en N·mm et mm³.

# Sujet type 1 — Treuil de monte-charge
Une PME de Treichville fabrique un monte-charge pour l'entrepôt d'un grossiste. Le treuil comprend : un moteur électrique, une transmission par poulies et courroie, un réducteur à un engrenage à denture droite et un tambour sur lequel s'enroule le câble de levage. L'arbre du tambour est guidé dans le bâti par deux roulements à billes ; le crochet est relié au câble par une chape et un axe.
**Données** : moteur P = 3 kW, N1 = 1 440 tr/min ; poulie motrice d1 = 90 mm, poulie réceptrice d2 = 270 mm, rendement de la courroie η1 = 0,95 ; pignon Z3 = 18 dents, roue Z4 = 72 dents, module m = 2 mm, rendement de l'engrenage η2 = 0,97 ; tambour de diamètre D = 200 mm (on néglige l'épaisseur du câble) ; g = 10 N/kg.
**Partie A — Analyse fonctionnelle (3 points)**
1. Quelle est la fonction globale du treuil ?
2. Nomme la liaison entre l'arbre du tambour et le bâti et indique son nombre de degrés de liberté.
3. Donne, dans l'ordre, les éléments de la chaîne de transmission.
**Partie B — Transmission de puissance (9 points)**
1. Calcule la vitesse angulaire du moteur et le couple moteur.
2. Calcule la vitesse linéaire de la courroie.
3. Calcule la fréquence de rotation de la poulie réceptrice puis celle du tambour. Donne le rapport global de transmission.
4. Calcule les diamètres primitifs du pignon et de la roue, l'entraxe, ainsi que les diamètres de tête et de pied de la roue.
5. Calcule le rendement global, la puissance disponible sur le tambour et le couple sur le tambour.
6. Calcule la vitesse de montée de la charge et l'effort maximal dans le câble à pleine puissance. Quelle masse maximale peut-on lever ?
**Partie C — Résistance de l'axe de la chape (8 points)**
L'axe de la chape du crochet, en acier S235 (Re = 235 MPa), supporte l'effort du câble F = 2 200 N. On prend Reg = 0,5 × Re et un coefficient de sécurité s = 4.
1. Quelle est la sollicitation de l'axe ? Combien de sections sont cisaillées ?
2. Calcule la résistance pratique au glissement Rpg.
3. Calcule le diamètre minimal de l'axe, puis choisis un diamètre normalisé parmi 6 mm, 8 mm et 10 mm.
4. Calcule la contrainte réelle dans l'axe choisi et conclus.
## Corrigé
**Partie A**
1. Lever et descendre une charge à vitesse constante (transformer l'énergie électrique en énergie mécanique de levage).
2. Liaison pivot (deux roulements) : 1 degré de liberté, la rotation autour de l'axe de l'arbre.
3. Moteur → poulie motrice → courroie → poulie réceptrice → pignon → roue → arbre du tambour → tambour → câble → crochet.
**Partie B**
1. ω1 = 2π × 1 440 / 60 ≈ 150,8 rad/s ; C1 = P / ω1 = 3 000 / 150,8 ≈ 19,9 N·m.
2. v = ω1 × R1 = 150,8 × 0,045 ≈ 6,79 m/s.
3. N2 = N1 × d1 / d2 = 1 440 × 90 / 270 = 480 tr/min. N tambour = N2 × Z3 / Z4 = 480 × 18 / 72 = 120 tr/min. Rapport global : r = (90/270) × (18/72) = 1/3 × 1/4 = 1/12 (vérification : 1 440 / 12 = 120 tr/min).
4. d3 = m × Z3 = 2 × 18 = 36 mm ; d4 = 2 × 72 = 144 mm ; a = (36 + 144) / 2 = 90 mm. da4 = d4 + 2m = 148 mm ; df4 = d4 − 2,5m = 144 − 5 = 139 mm.
5. η g = 0,95 × 0,97 = 0,9215. P tambour = 0,9215 × 3 000 ≈ 2 764,5 W. ω tambour = 2π × 120 / 60 = 4π ≈ 12,57 rad/s ; C tambour = 2 764,5 / 12,57 ≈ 220 N·m.
6. v charge = ω × D/2 = 12,57 × 0,10 ≈ 1,26 m/s. F = C / R = 220 / 0,10 = 2 200 N (vérification : P / v = 2 764,5 / 1,257 ≈ 2 200 N). Masse maximale : m = F / g = 2 200 / 10 = 220 kg.
**Partie C**
1. L'axe est sollicité au cisaillement ; monté dans une chape, il travaille en double cisaillement (2 sections).
2. Reg = 0,5 × 235 = 117,5 MPa ; Rpg = 117,5 / 4 ≈ 29,4 MPa.
3. Condition : τ = F / (2S) ≤ Rpg, donc S ≥ 2 200 / (2 × 29,375) ≈ 37,4 mm². d ≥ √(4 × 37,4 / π) ≈ √47,7 ≈ 6,9 mm. On choisit d = 8 mm (6 mm est insuffisant).
4. S = π × 8² / 4 ≈ 50,3 mm² ; τ = 2 200 / (2 × 50,3) ≈ 21,9 MPa ≤ 29,4 MPa : la condition de résistance est vérifiée.

# Sujet type 2 — Poutre de pont roulant
Dans un atelier de réparation d'engins d'un chantier de Bouaké, un palan électrique se déplace sur une poutre horizontale AB de portée L = 4 m. La poutre repose en A et B sur deux appuis simples ; chaque appui est suspendu à la charpente par un tirant vertical en acier. Le palan chargé exerce sur la poutre une force verticale F = 12 kN. On néglige le poids propre de la poutre.
**Données** : acier S235, Re = 235 MPa, coefficient de sécurité s = 2, E = 210 000 MPa. Profilés IPE disponibles (module de flexion I/v) : IPE 120 : 53,0 cm³ ; IPE 140 : 77,3 cm³ ; IPE 160 : 109 cm³ ; IPE 180 : 146 cm³.
**Partie A — Statique (5 points)**
Le palan est arrêté à 1,5 m de A.
1. Isole la poutre et fais le bilan des actions extérieures.
2. Applique le PFS pour calculer les réactions RA et RB.
**Partie B — Flexion de la poutre (9 points)**
1. Quelle est la sollicitation de la poutre ? Où se trouvent les fibres tendues et les fibres comprimées ?
2. Calcule le moment fléchissant maximal pour la position de la partie A et précise sa position.
3. Pour une charge en un point situé à x de A, on admet que Mf max = F × x × (L − x) / L. Montre que la position la plus défavorable est le milieu de la poutre et calcule Mf max dans ce cas.
4. Calcule Rpe, puis le module de flexion minimal nécessaire. Choisis le profilé IPE convenable et calcule la contrainte maximale réelle.
5. Pourquoi utilise-t-on un profilé en I plutôt qu'un rond plein de même masse ?
**Partie C — Tirant de l'appui A (6 points)**
Le tirant de A a un diamètre d = 12 mm et une longueur l = 2 m. On le vérifie pour RA = 7 500 N.
1. Quelle est la sollicitation du tirant ?
2. Calcule la contrainte dans le tirant et vérifie sa résistance.
3. Calcule son allongement.
## Corrigé
**Partie A**
1. Poutre isolée : F = 12 000 N vertical vers le bas à 1,5 m de A ; RA et RB verticales vers le haut (appuis simples).
2. Moments en A : RB × 4 − 12 000 × 1,5 = 0, donc RB = 18 000 / 4 = 4 500 N. Résultante : RA = 12 000 − 4 500 = 7 500 N.
**Partie B**
1. Flexion simple. Les fibres inférieures sont tendues, les fibres supérieures comprimées ; la fibre neutre n'est pas sollicitée.
2. Mf max sous la charge : Mf = RA × 1,5 = 7 500 × 1,5 = 11 250 N·m (vérification : RB × 2,5 = 4 500 × 2,5 = 11 250 N·m).
3. f(x) = x(L − x) est un trinôme maximal pour x = L/2 (dérivée L − 2x nulle). Mf max = F × L / 4 = 12 000 × 4 / 4 = 12 000 N·m = 12 × 10⁶ N·mm.
4. Rpe = 235 / 2 = 117,5 MPa. I/v ≥ Mf max / Rpe = 12 × 10⁶ / 117,5 ≈ 102 128 mm³ ≈ 102,1 cm³. L'IPE 140 (77,3 cm³) est insuffisant ; on choisit l'IPE 160 (109 cm³). σ max = 12 × 10⁶ / 109 000 ≈ 110,1 MPa ≤ 117,5 MPa : vérifié.
5. Dans un IPE, la matière est éloignée de la fibre neutre (ailes), là où les contraintes sont les plus fortes : pour la même masse, le module I/v est bien plus grand.
**Partie C**
1. Traction.
2. S = π × 12² / 4 ≈ 113,1 mm² ; σ = 7 500 / 113,1 ≈ 66,3 MPa ≤ Rpe = 117,5 MPa : la résistance est vérifiée.
3. ΔL = σ × l / E = 66,3 × 2 000 / 210 000 ≈ 0,63 mm.

# QCM
? La contrainte normale dans une barre tendue s'écrit :
+ σ = N / S
- σ = N × S
- σ = S / N
! Avec N en newtons et S en mm², σ est en MPa.
? Pour un acier de Re = 360 MPa et un coefficient de sécurité s = 3, la résistance pratique vaut :
+ 120 MPa
- 1 080 MPa
- 357 MPa
! Rpe = Re / s = 360 / 3 = 120 MPa.
? Une tige d'acier (E = 210 000 MPa) de 1 m subit σ = 105 MPa. Son allongement est :
+ 0,5 mm
- 5 mm
- 0,05 mm
! ΔL = σ × L / E = 105 × 1 000 / 210 000 = 0,5 mm.
? Une goupille de section 25 mm² en double cisaillement transmet 3 000 N. La contrainte tangentielle vaut :
+ 60 MPa
- 120 MPa
- 240 MPa
! τ = T / (2S) = 3 000 / 50 = 60 MPa.
? Une poutre sur deux appuis de portée 2 m porte 4 000 N en son milieu. Le moment fléchissant maximal est :
+ 2 000 N·m
- 8 000 N·m
- 4 000 N·m
! Mf max = F × L / 4 = 4 000 × 2 / 4 = 2 000 N·m.
? Le module de flexion d'une section rectangulaire b × h (h dans le sens de la charge) est :
+ b × h² / 6
- b² × h / 6
- b × h / 2
! La hauteur intervient au carré : une poutre posée sur chant résiste mieux.
? Un moteur de 1,5 kW tourne à 1 500 tr/min. Son couple vaut environ :
+ 9,5 N·m
- 1 N·m
- 95 N·m
! ω = 2π × 1 500 / 60 ≈ 157,1 rad/s ; C = 1 500 / 157,1 ≈ 9,5 N·m.
? Un réducteur de rendement 0,9 reçoit 5 kW. Il fournit :
+ 4,5 kW
- 5,6 kW
- 0,5 kW
! P s = η × P e = 0,9 × 5 = 4,5 kW.
? Un pignon de 20 dents entraîne une roue de 60 dents. Si le pignon tourne à 900 tr/min, la roue tourne à :
+ 300 tr/min
- 2 700 tr/min
- 900 tr/min
! N2 = N1 × Z1 / Z2 = 900 × 20 / 60 = 300 tr/min.
? Deux roues de module 2,5 mm ont 16 et 48 dents. L'entraxe vaut :
+ 80 mm
- 160 mm
- 40 mm
! a = m × (Z1 + Z2) / 2 = 2,5 × 64 / 2 = 80 mm.
? Une liaison pivot autorise :
+ une seule rotation autour de son axe
- une seule translation
- une rotation et une translation suivant le même axe
! La rotation et la translation combinées caractérisent la liaison pivot glissant.
? Un solide en équilibre est soumis à trois forces non parallèles. Elles sont :
+ concourantes en un même point
- toutes de même intensité
- toutes parallèles
! Le théorème du moment impose que leurs droites d'action se coupent en un point, et le triangle des forces est fermé.
