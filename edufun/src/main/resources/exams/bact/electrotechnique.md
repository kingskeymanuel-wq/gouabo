---
order: 11
subject: Électrotechnique
series: Séries E et F3
duration: Épreuve écrite
---
# Méthode
> Le sujet porte sur une installation alimentée par le réseau CIE 230 V / 400 V, 50 Hz : machines (transformateur, moteur à courant continu, moteur asynchrone), puissances et facteur de puissance, protection des personnes. Le correcteur attend la formule littérale, l'application numérique, le résultat avec son unité et une conclusion technique.
1. **Lis tout le sujet** : souligne les plaques signalétiques, les schémas décrits et les grandeurs demandées.
2. **Identifie le réseau** avant tout calcul : monophasé ou triphasé, tension simple V ou composée U, couplage étoile ou triangle (la plus petite tension de la plaque est celle d'un enroulement).
3. **Machines** : transformateur (m = U2/U1 = N2/N1, η = P2/(P2 + pertes)) ; moteur à courant continu (U = E + RI, E = KΩ, Pem = EI) ; moteur asynchrone (Ns = 60f/p, g, Pa = √3 UI cos φ, Cu = Pu/Ω).
4. **Bilan des puissances** : Pa = Pu + pertes, η < 1 ; Boucherot pour plusieurs récepteurs (P et Q s'additionnent, pas S).
5. **Sécurité** : nomme le schéma de liaison à la terre, calcule Id et Uc, compare à UL (50 V, ou 25 V en local mouillé) et vérifie RA × IΔn ≤ UL.
- Piège : la puissance d'une plaque de moteur est la puissance utile, pas la puissance absorbée.
- Piège : oublier √3 en triphasé ou confondre U = 400 V et V = 230 V.
- Piège : calculer un couple avec N en tr/min au lieu de Ω en rad/s.

# Sujet type 1 — Station de pompage
Une station de pompage d'eau potable de la SODECI près de Yamoussoukro est alimentée par le réseau triphasé CIE 230 V / 400 V, 50 Hz. Une pompe centrifuge est entraînée par un moteur asynchrone triphasé dont la plaque indique : 230 V / 400 V ; 15 kW ; 2 920 tr/min ; cos φ = 0,88 ; η = 0,90. Le local comprend aussi un éclairage et des résistances de chauffage absorbant au total 3 kW (cos φ = 1), répartis de façon équilibrée sur les trois phases.
**Partie A — Moteur asynchrone (10 points)**
1. Quel couplage faut-il réaliser pour le stator ? Justifie.
2. Détermine la vitesse de synchronisme et le nombre de pôles du moteur.
3. Calcule le glissement.
4. Calcule la puissance absorbée, les pertes totales et l'intensité du courant de ligne.
5. Calcule le couple utile.
6. Comment inverser le sens de rotation de la pompe ?
**Partie B — Puissances de l'installation (5 points)**
1. Calcule les puissances réactive et apparente absorbées par le moteur.
2. À l'aide du théorème de Boucherot, calcule les puissances active, réactive et apparente de l'installation, puis son facteur de puissance et le courant de ligne total.
**Partie C — Relèvement du facteur de puissance (5 points)**
On veut relever le facteur de puissance de l'installation à 0,95 à l'aide de trois condensateurs identiques couplés en triangle. On donne : C = P × (tan φ − tan φ') / (3 × U² × ω).
1. Calcule la puissance réactive que doivent fournir les condensateurs.
2. Calcule la capacité de chaque condensateur.
3. Calcule le nouveau courant de ligne et indique l'intérêt de la compensation.
## Corrigé
**Partie A**
1. Chaque enroulement supporte 230 V (plus petite tension de la plaque). Sur le réseau 400 V entre phases, il faut le couplage étoile : chaque enroulement est alors sous V = 400 / √3 ≈ 230 V.
2. N = 2 920 tr/min est juste inférieure à Ns : Ns = 3 000 tr/min. p = 60 × f / Ns = 60 × 50 / 3 000 = 1 paire de pôles, soit 2 pôles.
3. g = (3 000 − 2 920) / 3 000 = 80 / 3 000 ≈ 0,0267, soit 2,67 %.
4. Pa = Pu / η = 15 000 / 0,90 ≈ 16 667 W. Pertes = 16 667 − 15 000 ≈ 1 667 W. I = Pa / (√3 × U × cos φ) = 16 667 / (1,732 × 400 × 0,88) ≈ 16 667 / 609,7 ≈ 27,3 A.
5. Ω = 2π × 2 920 / 60 ≈ 305,8 rad/s ; Cu = 15 000 / 305,8 ≈ 49,1 N·m.
6. En permutant deux phases d'alimentation : le champ tournant change de sens.
**Partie B**
1. cos φ = 0,88 donne sin φ ≈ 0,475 et tan φ ≈ 0,540. Q moteur = Pa × tan φ ≈ 16 667 × 0,540 ≈ 8 996 var. S moteur = Pa / cos φ ≈ 16 667 / 0,88 ≈ 18 939 VA.
2. P = 16 667 + 3 000 = 19 667 W ; Q = 8 996 + 0 = 8 996 var ; S = √(19 667² + 8 996²) ≈ 21 626 VA. cos φ = P / S ≈ 0,909. I = S / (√3 × U) = 21 626 / 692,8 ≈ 31,2 A.
**Partie C**
1. tan φ = Q / P = 8 996 / 19 667 ≈ 0,4574 ; cos φ' = 0,95 donne tan φ' ≈ 0,3287. Qc = P × (tan φ − tan φ') = 19 667 × (0,4574 − 0,3287) ≈ 2 531 var.
2. C = Qc / (3 × U² × ω) = 2 531 / (3 × 400² × 314,16) ≈ 2 531 / 1,508 × 10⁸ ≈ 1,68 × 10⁻⁵ F ≈ 16,8 µF par condensateur.
3. I' = P / (√3 × U × cos φ') = 19 667 / (1,732 × 400 × 0,95) ≈ 29,9 A. La puissance active est inchangée, mais le courant appelé diminue : moins de pertes Joule dans les câbles, moins de chute de tension et pas de pénalité pour consommation d'énergie réactive.

# Sujet type 2 — Atelier de menuiserie
Une menuiserie industrielle de Yopougon est raccordée au réseau CIE 230 V / 400 V, 50 Hz. On étudie le transformateur des circuits de commande, le moteur du convoyeur et la protection des personnes.
**Partie A — Transformateur monophasé (6 points)**
Plaque : 230 V / 24 V ; 50 Hz ; S = 160 VA. Le primaire compte N1 = 1 150 spires. Essai à vide sous 230 V : P10 = 6 W. Essai en court-circuit au courant nominal : Pcc = 8 W. On admet U2 = 24 V en charge.
1. Calcule le rapport de transformation et le nombre de spires du secondaire.
2. Calcule les courants nominaux secondaire et primaire (transformateur supposé parfait pour I1).
3. Que représentent P10 et Pcc ?
4. Le transformateur débite son courant nominal dans une charge résistive. Calcule son rendement.
**Partie B — Moteur à courant continu du convoyeur (8 points)**
Moteur à excitation indépendante, flux constant. Induit : U = 240 V, R = 0,8 Ω, I = 15 A, N = 1 200 tr/min. Pertes collectives (fer et mécaniques) : 220 W. Puissance absorbée par l'inducteur : 120 W.
1. Calcule la force électromotrice E et la puissance électromagnétique.
2. Calcule le couple électromagnétique et la constante K = E / Ω.
3. Calcule la puissance utile, le couple utile et le rendement du moteur.
4. On réduit la tension d'induit à 160 V, le courant restant égal à 15 A. Calcule la nouvelle vitesse.
5. Calcule le courant de démarrage direct sous 240 V. Quelle tension faut-il appliquer au démarrage pour limiter le courant à 30 A ?
**Partie C — Protection des personnes (6 points)**
L'installation est en schéma TT : résistance de la prise de terre des masses RA = 30 Ω, du neutre RB = 10 Ω. La scie est protégée par un disjoncteur de 20 A. Un défaut franc met une phase (V = 230 V) en contact avec la carcasse.
1. Que signifient les deux lettres T et T ?
2. Calcule le courant de défaut Id et la tension de contact Uc. Est-elle dangereuse (UL = 50 V) ?
3. Le disjoncteur de 20 A peut-il assurer la protection ? Justifie.
4. Calcule la sensibilité maximale du dispositif différentiel. Un différentiel de 300 mA convient-il ? Que devient la sensibilité maximale en local mouillé (UL = 25 V) ?
## Corrigé
**Partie A**
1. m = U2 / U1 = 24 / 230 ≈ 0,104 (abaisseur). N2 = N1 × m = 1 150 × 24 / 230 = 120 spires.
2. I2 = S / U2 = 160 / 24 ≈ 6,67 A ; I1 = S / U1 = 160 / 230 ≈ 0,70 A.
3. P10 représente les pertes fer (circuit magnétique) ; Pcc représente les pertes cuivre (effet Joule dans les enroulements) au courant nominal.
4. Charge résistive : P2 = U2 × I2 = 160 W. η = 160 / (160 + 6 + 8) = 160 / 174 ≈ 0,920, soit 92 %.
**Partie B**
1. E = U − R × I = 240 − 0,8 × 15 = 228 V ; Pem = E × I = 228 × 15 = 3 420 W.
2. Ω = 2π × 1 200 / 60 ≈ 125,7 rad/s ; Cem = 3 420 / 125,7 ≈ 27,2 N·m. K = 228 / 125,7 ≈ 1,81 V·s/rad.
3. Pu = Pem − pertes collectives = 3 420 − 220 = 3 200 W. Cu = 3 200 / 125,7 ≈ 25,5 N·m. Puissance absorbée totale : U × I + P inducteur = 3 600 + 120 = 3 720 W. η = 3 200 / 3 720 ≈ 0,860, soit 86 %.
4. E' = 160 − 0,8 × 15 = 148 V. À flux constant, N est proportionnelle à E : N' = 1 200 × 148 / 228 ≈ 779 tr/min.
5. Au démarrage, Ω = 0 donc E = 0 : Id = 240 / 0,8 = 300 A (20 fois le courant nominal), dangereux pour l'induit et le réseau. Pour 30 A : U = R × I = 0,8 × 30 = 24 V (démarrage sous tension réduite par hacheur ou redresseur commandé, puis montée progressive de la tension).
**Partie C**
1. Première lettre T : neutre du transformateur relié à la terre ; seconde lettre T : masses de l'installation reliées à une prise de terre locale.
2. Id = V / (RA + RB) = 230 / 40 = 5,75 A ; Uc = RA × Id = 30 × 5,75 = 172,5 V > 50 V : tension dangereuse, la coupure est obligatoire.
3. Non : Id = 5,75 A est inférieur au calibre de 20 A, le disjoncteur ne déclenche pas. Seul un dispositif différentiel assure la protection en schéma TT.
4. IΔn ≤ UL / RA = 50 / 30 ≈ 1,67 A. Un 300 mA convient : RA × IΔn = 30 × 0,3 = 9 V ≤ 50 V. En local mouillé : IΔn ≤ 25 / 30 ≈ 0,83 A ; le 300 mA convient toujours (9 V ≤ 25 V).

# QCM
? Un transformateur parfait 230 V / 12 V a 1 150 spires au primaire. Son secondaire en compte :
+ 60
- 220
- 22 042
! N2 = N1 × U2 / U1 = 1 150 × 12 / 230 = 60 spires.
? Les pertes fer d'un transformateur se mesurent lors de :
+ l'essai à vide
- l'essai en court-circuit
- l'essai en charge nominale
! À vide, le courant est faible : les pertes Joule sont négligeables et la puissance absorbée correspond aux pertes fer.
? Un moteur à courant continu (R = 0,5 Ω) est alimenté sous 220 V et absorbe 20 A. Sa force électromotrice vaut :
+ 210 V
- 230 V
- 200 V
! E = U − R × I = 220 − 0,5 × 20 = 210 V.
? À flux constant, le couple électromagnétique d'un moteur à courant continu est proportionnel :
+ au courant d'induit
- à la tension d'induit
- à la vitesse de rotation
! Cem = K × I.
? Un moteur asynchrone à 4 pôles est alimenté à 50 Hz. Sa vitesse de synchronisme est :
+ 1 500 tr/min
- 3 000 tr/min
- 750 tr/min
! 4 pôles = 2 paires : Ns = 60 × 50 / 2 = 1 500 tr/min.
? Ce moteur tourne à 1 425 tr/min. Son glissement vaut :
+ 5 %
- 2,5 %
- 7,5 %
! g = (1 500 − 1 425) / 1 500 = 75 / 1 500 = 0,05.
? Un moteur dont la plaque indique 400 V / 690 V est branché sur un réseau 230 V / 400 V. Son couplage est :
+ triangle
- étoile
- étoile avec neutre
! Chaque enroulement supporte 400 V, tension entre phases du réseau : il faut le triangle.
? Sur le réseau basse tension 230 V / 400 V, la tension composée U et la tension simple V sont liées par :
+ U = V × √3
- U = V × √2
- U = V / √3
! 230 × 1,732 ≈ 400 V.
? La valeur maximale d'une tension sinusoïdale de valeur efficace 230 V est environ :
+ 325 V
- 163 V
- 400 V
! Umax = U × √2 = 230 × 1,414 ≈ 325 V.
? D'après le théorème de Boucherot, dans une installation :
+ les puissances actives s'additionnent
- les puissances apparentes s'additionnent toujours
- seules les puissances réactives des moteurs comptent
! P et Q (avec leur signe) s'additionnent ; S se calcule par S = √(P² + Q²).
? Avec UL = 50 V et un différentiel de 500 mA, la prise de terre des masses doit avoir une résistance au plus égale à :
+ 100 Ω
- 25 Ω
- 250 Ω
! RA ≤ UL / IΔn = 50 / 0,5 = 100 Ω.
? Le schéma IT est choisi dans les hôpitaux car :
+ le premier défaut d'isolement ne provoque pas de coupure
- il supprime tout besoin de prise de terre
- il coupe l'alimentation dès le premier défaut
! Le neutre isolé ou impédant limite le courant de premier défaut, ce qui assure la continuité de service.
