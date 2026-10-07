---
order: 13
subject: Génie civil
series: Série F4
duration: Épreuve écrite
---
# Méthode
> Le sujet porte sur un ouvrage réel (bâtiment, route, ouvrage annexe) : résistance des matériaux, béton armé selon le BAEL 91 modifié 99, fondations, topographie, terrassements, chaussées et métré-devis en F CFA. Le correcteur attend des unités cohérentes, des formules écrites avant les applications numériques et des choix arrondis du côté de la sécurité.
1. **Lis tout le sujet** et relève les données avec leurs unités (kN, kN/m, m, MPa, cm²) ; fais un schéma de la poutre, de la semelle ou du profil.
2. **Convertis** dans un système cohérent : N, mm et MPa (1 MPa = 1 N/mm², 1 kN·m = 10⁶ N·mm, 1 m² = 10⁶ mm²).
3. **Choisis la bonne combinaison** : ELU (Pu = 1,35 G + 1,5 Q) pour les aciers ; ELS (Pser = G + Q) pour la portance du sol.
4. **Béton armé** : suis l'ordre Mu, d ≈ 0,9 h, μbu, comparaison à μl = 0,392, αu, z, Au, choix des barres, section minimale.
5. **Arrondis du côté de la sécurité** : dimensions au multiple de 5 cm supérieur, nombre de voyages et de sacs à l'entier supérieur, section d'acier réelle ≥ section calculée.
6. **Devis** : quantité × prix unitaire pour chaque poste, total HT, TVA à 18 %, total TTC ; conclus par une phrase.
- Piège fréquent : utiliser Nu au lieu de Nser pour dimensionner la surface d'une semelle.
- Piège fréquent : oublier le foisonnement dans le calcul du nombre de camions.
- Piège fréquent : en nivellement, inverser lecture arrière et lecture avant (Δh = LAR − LAV).

# Sujet type 1 — Poutre et fondations d'un bâtiment scolaire à Bouaké
Une entreprise de BTP construit un bâtiment de salles de classe à Bouaké. On étudie une poutre de plancher, une semelle isolée sous poteau, puis on chiffre une partie des fondations. Matériaux : béton fc28 = 25 MPa, acier FeE400, γb = 1,5, θ = 1, γs = 1,15. Section d'une barre : HA 12 = 1,13 cm² ; HA 14 = 1,54 cm² ; HA 16 = 2,01 cm².
**Partie A — Poutre en béton armé (9 points)**
La poutre, rectangulaire de section b = 20 cm et h = 40 cm, repose sur deux appuis simples ; sa portée est L = 4,5 m. Elle supporte une charge permanente g = 12 kN/m (poids propre compris) et une charge d'exploitation q = 6 kN/m, uniformément réparties. On prend d = 36 cm.
1. Calcule la charge ultime pu et la charge de service pser.
2. Calcule les réactions d'appui et l'effort tranchant maximal à l'ELU.
3. Calcule le moment fléchissant maximal Mu. Où est-il atteint ?
4. Calcule fbu et fsu.
5. Calcule le moment réduit μbu. Faut-il des aciers comprimés ?
6. Calcule αu, le bras de levier z, puis la section d'armatures tendues Au.
7. Choisis les barres. La solution 2 HA 16 + 1 HA 14 convient-elle ?
8. Vérifie la condition de non-fragilité (ft28 = 0,6 + 0,06 fc28 ; Amin = 0,23 b d ft28 / fe).
**Partie B — Semelle isolée sous poteau (5 points)**
Un poteau transmet G = 250 kN et Q = 90 kN. Le rapport de sol donne une contrainte admissible σ sol = 0,2 MPa.
1. Calcule Nser et Nu.
2. Calcule la surface minimale de la semelle, puis le côté de la semelle carrée (arrondi au multiple de 5 cm supérieur).
3. La semelle a une hauteur de 0,40 m. Calcule le volume de béton et la masse de ciment nécessaire pour un dosage de 350 kg/m³.
4. Calcule le volume de béton de propreté de 5 cm d'épaisseur sous la semelle.
**Partie C — Terrassement et devis des 8 semelles (6 points)**
Le bâtiment comporte 8 semelles identiques. Chaque fouille mesure 1,55 m × 1,55 m × 1,20 m. Le coefficient de foisonnement de la terre est de 25 %. On dispose de camions de 6 m³.
1. Calcule le volume de déblai en place pour les 8 fouilles, puis le volume foisonné.
2. Calcule le nombre de voyages de camion.
3. Calcule le nombre total de sacs de ciment de 50 kg pour le béton des 8 semelles.
4. Établis le devis estimatif avec les prix unitaires suivants : béton des semelles 90 000 F CFA/m³ ; béton de propreté 60 000 F CFA/m³ ; évacuation des terres 25 000 F CFA par voyage. Calcule le total HT, la TVA à 18 % et le total TTC.
## Corrigé
**Partie A**
1. pu = 1,35 × 12 + 1,5 × 6 = 16,2 + 9 = 25,2 kN/m ; pser = 12 + 6 = 18 kN/m.
2. Par symétrie : RA = RB = pu L / 2 = 25,2 × 4,5 / 2 = 56,7 kN. L'effort tranchant maximal, aux appuis, vaut Vu = 56,7 kN.
3. Mu = pu L² / 8 = 25,2 × 4,5² / 8 = 25,2 × 20,25 / 8 ≈ 63,79 kN·m, atteint au milieu de la portée (moment nul sur les appuis).
4. fbu = 0,85 × 25 / (1 × 1,5) ≈ 14,17 MPa ; fsu = 400 / 1,15 ≈ 347,8 MPa.
5. μbu = Mu / (b d² fbu) = 63,79 × 10⁶ / (200 × 360² × 14,17) = 63,79 × 10⁶ / (367,3 × 10⁶) ≈ 0,174. μbu ≤ μl = 0,392 : pas d'aciers comprimés.
6. αu = 1,25 × (1 − √(1 − 2 × 0,174)) = 1,25 × (1 − √0,652) = 1,25 × (1 − 0,808) ≈ 0,240 ; z = 360 × (1 − 0,4 × 0,240) ≈ 360 × 0,904 ≈ 325 mm ; Au = Mu / (z × fsu) = 63,79 × 10⁶ / (325 × 347,8) ≈ 564 mm² = 5,64 cm².
7. 3 HA 16 = 3 × 2,01 = 6,03 cm² ≥ 5,64 cm² : convient. La solution 2 HA 16 + 1 HA 14 = 4,02 + 1,54 = 5,56 cm² < 5,64 cm² ne convient pas.
8. ft28 = 0,6 + 0,06 × 25 = 2,1 MPa ; Amin = 0,23 × 200 × 360 × 2,1 / 400 ≈ 87 mm² = 0,87 cm². 6,03 cm² ≥ 0,87 cm² : condition vérifiée.
**Partie B**
1. Nser = 250 + 90 = 340 kN ; Nu = 1,35 × 250 + 1,5 × 90 = 337,5 + 135 = 472,5 kN.
2. S ≥ Nser / σ sol = 340 000 / 0,2 = 1 700 000 mm² = 1,70 m². Côté ≥ √1,70 ≈ 1,30 m (1,304 m) : on prend 1,35 m (S = 1,8225 m² ≥ 1,70 m²).
3. V = 1,35 × 1,35 × 0,40 ≈ 0,729 m³ ; ciment = 0,729 × 350 ≈ 255 kg (environ 5,1 sacs, soit 6 sacs de 50 kg par semelle si l'on commande semelle par semelle).
4. V propreté = 1,35 × 1,35 × 0,05 ≈ 0,091 m³.
**Partie C**
1. Une fouille : 1,55 × 1,55 × 1,20 ≈ 2,883 m³ ; 8 fouilles : 8 × 2,883 ≈ 23,06 m³ en place. Volume foisonné : 23,06 × 1,25 ≈ 28,83 m³.
2. 28,83 / 6 ≈ 4,8 : il faut 5 voyages.
3. Béton des 8 semelles : 8 × 0,729 = 5,832 m³ ; ciment : 5,832 × 350 ≈ 2 041 kg ; 2 041 / 50 ≈ 40,8, soit 41 sacs.
4. Devis : béton des semelles 5,832 m³ × 90 000 = 524 880 F CFA ; béton de propreté 8 × 0,091125 = 0,729 m³ × 60 000 = 43 740 F CFA ; évacuation 5 × 25 000 = 125 000 F CFA. Total HT = 693 620 F CFA ; TVA = 693 620 × 0,18 ≈ 124 852 F CFA ; total TTC ≈ 818 472 F CFA.
**Barème indicatif** : Partie A 9 points ; Partie B 5 points ; Partie C 6 points.

# Sujet type 2 — Voie d'accès à une zone industrielle de Yopougon
Une PME de Yopougon fait aménager une voie d'accès bitumée de 600 m de long et 6 m de large vers ses entrepôts. On étudie le nivellement de l'axe, la chaussée, puis deux ouvrages annexes : une passerelle piétonne en bois au-dessus du fossé et un tirant du hangar de chantier.
**Partie A — Nivellement de l'axe (5 points)**
Le géomètre part d'un repère A d'altitude ZA = 45,000 m et relève les lectures suivantes sur mire.
Station 1 : lecture arrière sur A = 1,850 m ; lecture avant sur B = 0,920 m.
Station 2 : lecture arrière sur B = 1,640 m ; lecture avant sur C = 2,315 m.
Station 3 : lecture arrière sur C = 0,780 m ; lecture avant sur D = 1,465 m.
1. Calcule les altitudes ZB, ZC et ZD.
2. Effectue le contrôle du cheminement.
3. Quel est le point le plus haut ? le plus bas ?
4. La distance horizontale entre A et D est de 215 m. Calcule la pente moyenne de A vers D, en %.
**Partie B — Chaussée (7 points)**
La chaussée souple comporte, de bas en haut, au-dessus de la couche de forme : une couche de fondation en graveleux latéritique de 0,25 m, une couche de base en grave-ciment de 0,15 m et une couche de roulement en enduit superficiel.
1. Donne le rôle de la couche de roulement et celui des fossés.
2. Calcule le volume compacté de la couche de fondation et celui de la couche de base.
3. Pour obtenir 1 m³ de latérite compactée, il faut apporter 1,30 m³ de latérite mesurée dans la benne. Calcule le volume de latérite à transporter et le nombre de voyages de camions de 10 m³.
4. Le liant de l'enduit superficiel est dosé à 1,5 kg/m². Calcule la masse de liant en tonnes.
5. Le profil en travers présente un dévers de 2,5 % de part et d'autre de l'axe. Calcule la différence de hauteur entre l'axe et le bord de la chaussée.
6. Un marigot coupe le tracé. Quel ouvrage hydraulique en béton armé à section rectangulaire peut-on construire sous la chaussée ?
**Partie C — Ouvrages annexes (8 points)**
**C1 — Passerelle en bois.** Une poutre en bois de section 15 cm × 25 cm, posée sur deux appuis de portée L = 3,5 m, supporte une charge uniformément répartie p = 4 kN/m. La contrainte admissible du bois est de 10 MPa.
1. Calcule les réactions d'appui et le moment fléchissant maximal.
2. La poutre est posée sur chant (h = 25 cm, b = 15 cm). Calcule I / v et la contrainte maximale de flexion. Conclus.
3. Même calcul si la poutre est posée à plat (h = 15 cm, b = 25 cm). Quelle disposition faut-il retenir et pourquoi ?
**C2 — Tirant du hangar.** Un tirant en acier rond supporte un effort de traction N = 45 kN. La contrainte admissible est σ adm = 160 MPa et E = 200 000 MPa ; sa longueur est de 3 m.
4. Calcule le diamètre minimal du tirant et choisis un diamètre entier pair en mm.
5. Avec ce diamètre, calcule la contrainte réelle et l'allongement du tirant.
## Corrigé
**Partie A**
1. ZB = 45,000 + 1,850 − 0,920 = 45,930 m ; ZC = 45,930 + 1,640 − 2,315 = 45,255 m ; ZD = 45,255 + 0,780 − 1,465 = 44,570 m.
2. Σ LAR = 1,850 + 1,640 + 0,780 = 4,270 m ; Σ LAV = 0,920 + 2,315 + 1,465 = 4,700 m. Σ LAR − Σ LAV = − 0,430 m et ZD − ZA = 44,570 − 45,000 = − 0,430 m : le calcul est juste.
3. Point le plus haut : B (45,930 m) ; point le plus bas : D (44,570 m).
4. p = (ZD − ZA) / distance = − 0,430 / 215 = − 0,002, soit une descente de 0,2 % de A vers D. Cette pente en long est faible : l'évacuation des eaux repose surtout sur le dévers et les fossés.
**Partie B**
1. La couche de roulement reçoit directement le trafic : elle assure l'étanchéité de la chaussée et l'adhérence des pneus. Les fossés recueillent et évacuent l'eau de pluie, premier ennemi de la route.
2. Fondation : 600 × 6 × 0,25 = 900 m³ ; base : 600 × 6 × 0,15 = 540 m³.
3. Latérite à transporter : 900 × 1,30 = 1 170 m³ ; 1 170 / 10 = 117 voyages.
4. Surface : 600 × 6 = 3 600 m² ; liant : 3 600 × 1,5 = 5 400 kg = 5,4 t.
5. Demi-largeur : 3 m ; différence de hauteur : 3 × 0,025 = 0,075 m = 7,5 cm (le bord est plus bas que l'axe).
6. Un dalot (cadre en béton armé) ; pour un faible débit, on pourrait aussi poser une buse.
**Partie C**
1. RA = RB = p L / 2 = 4 × 3,5 / 2 = 7 kN ; Mmax = p L² / 8 = 4 × 3,5² / 8 = 4 × 12,25 / 8 ≈ 6,125 kN·m = 6,125 × 10⁶ N·mm, au milieu.
2. I / v = b h² / 6 = 150 × 250² / 6 = 1 562 500 mm³ ; σ = 6,125 × 10⁶ / 1 562 500 ≈ 3,92 MPa ≤ 10 MPa : la poutre résiste.
3. I / v = 250 × 150² / 6 = 937 500 mm³ ; σ = 6,125 × 10⁶ / 937 500 ≈ 6,53 MPa. Les deux conviennent, mais on retient la pose sur chant : I / v dépend de h², la contrainte est plus faible (3,92 MPa contre 6,53 MPa) pour la même quantité de bois.
4. S ≥ N / σ adm = 45 000 / 160 = 281,25 mm² ; d ≥ √(4 × 281,25 / π) = √358,1 ≈ 18,9 mm : on choisit d = 20 mm.
5. S = π × 20² / 4 ≈ 314,2 mm² ; σ = 45 000 / 314,2 ≈ 143,2 MPa ≤ 160 MPa. ε = σ / E = 143,2 / 200 000 ≈ 7,16 × 10⁻⁴ ; ΔL = 7,16 × 10⁻⁴ × 3 000 mm ≈ 2,15 mm.
**Barème indicatif** : Partie A 5 points ; Partie B 7 points ; Partie C 8 points.

# QCM
? Une poutre sur deux appuis de 5 m porte une charge répartie de 12 kN/m. Mmax vaut :
+ 37,5 kN·m
- 75 kN·m
- 15 kN·m
! Mmax = p L² / 8 = 12 × 25 / 8 = 37,5 kN·m.
? Une charge concentrée de 20 kN est placée au milieu d'une poutre de 4 m. Mmax vaut :
+ 20 kN·m
- 40 kN·m
- 80 kN·m
! Mmax = P L / 4 = 20 × 4 / 4 = 20 kN·m.
? Que vaut fbu pour un béton de fc28 = 30 MPa en situation durable ?
+ 17 MPa
- 30 MPa
- 25,5 MPa
! fbu = 0,85 × 30 / (1 × 1,5) = 17 MPa.
? Quelle est la résistance de calcul fsu d'un acier FeE500 ?
+ Environ 434,8 MPa
- 500 MPa
- Environ 347,8 MPa
! fsu = fe / γs = 500 / 1,15 ≈ 434,8 MPa.
? G = 30 kN/m et Q = 10 kN/m. La charge ultime vaut :
+ 55,5 kN/m
- 40 kN/m
- 60 kN/m
! Pu = 1,35 × 30 + 1,5 × 10 = 40,5 + 15 = 55,5 kN/m.
? Pour une section rectangulaire b = 10 cm, h = 30 cm, le module I / v vaut :
+ 1 500 000 mm³
- 500 000 mm³
- 4 500 000 mm³
! I / v = b h² / 6 = 100 × 300² / 6 = 1 500 000 mm³.
? En flexion simple à l'ELU avec un acier FeE400, on n'a pas besoin d'aciers comprimés si :
+ μbu ≤ 0,392
- μbu ≥ 0,392
- μbu = 1
! μl ≈ 0,392 est la limite au-delà de laquelle le béton comprimé ne suffit plus.
? Quel enrobage minimal le BAEL impose-t-il en atmosphère marine ?
+ 5 cm
- 1 cm
- 3 cm
! Sur le littoral ivoirien, les aciers doivent être protégés par au moins 5 cm de béton.
? Quelle est la section d'une barre HA 12 ?
+ 1,13 cm²
- 1,20 cm²
- 0,79 cm²
! S = π × 1,2² / 4 ≈ 1,13 cm².
? Pour la surface d'une semelle comparée à la contrainte admissible du sol, on utilise :
+ Nser = G + Q
- Nu = 1,35 G + 1,5 Q
- Q seulement
! La portance du sol se vérifie avec les charges de service.
? Dans une chaussée souple, quelle couche est posée directement sur la couche de forme ?
+ La couche de fondation
- La couche de roulement
- La couche de base
! De bas en haut : couche de forme, fondation, base, roulement.
? Un dalot est :
+ un ouvrage hydraulique en cadre de béton armé sous la chaussée
- une couche de chaussée en latérite
- un engin de compactage
! Il permet à l'eau d'un marigot ou d'un fossé de passer sous la route.
