---
levels: Première E, Première F1
subject: Construction mécanique
---
# Statique

## 1N-CM-01 | Actions mécaniques et moment d'une force | 55 min
Objectif : Modéliser une action mécanique et calculer son moment par rapport à un point.
### Situation d'apprentissage
Au garage d'un mécanicien d'Adjamé, un apprenti n'arrive pas à desserrer un écrou de roue avec une petite clé. Le patron lui tend une clé plus longue : « Tu forces moins pour le même résultat. » Les élèves doivent expliquer pourquoi.
### Je retiens
> Une action mécanique se modélise par une force caractérisée par son point d'application, sa direction, son sens et son intensité en newtons (N).
> Le poids d'un corps : P = m × g, avec g ≈ 9,81 N/kg (souvent arrondi à 10 N/kg).
> Le moment d'une force par rapport à un point O mesure son effet de rotation autour de O.
= M(O) = F × d, en N·m, où d est la distance (bras de levier) de O à la droite d'action de F, en mètres
= Exemple : F = 50 N appliquée au bout d'une clé de 0,30 m perpendiculairement : M = 50 × 0,30 = 15 N·m
- Le moment est positif si la force fait tourner dans le sens trigonométrique, négatif dans l'autre sens (convention à fixer au départ).
- Si la droite d'action passe par O, le bras de levier est nul et le moment aussi.
### Je vérifie
? Pourquoi une clé plus longue facilite-t-elle le desserrage ?
+ Le bras de levier augmente, donc le même moment demande une force plus faible
- La clé longue est plus lourde
- La clé longue augmente la force du mécanicien
! M = F × d : à moment égal, si d augmente, F diminue.
? Un écrou doit être serré à 90 N·m avec une clé de 0,45 m. Quelle force perpendiculaire faut-il appliquer au bout ?
+ 200 N
- 40,5 N
- 405 N
! F = M / d = 90 / 0,45 = 200 N.
### Je m'exerce
1. Calcule le poids d'un moteur électrique de 25 kg (g = 9,81 N/kg).
2. Une manivelle de 0,20 m est actionnée par une force de 80 N perpendiculaire au bras. Calcule le moment produit.
### Corrigé
1. P = m × g = 25 × 9,81 = 245,25 N, soit environ 245 N.
2. M = F × d = 80 × 0,20 = 16 N·m.

## 1N-CM-02 | Principe fondamental de la statique | 60 min
Objectif : Appliquer le principe fondamental de la statique à un solide en équilibre.
### Situation d'apprentissage
Sur un chantier de Bouaké, un maçon transporte 60 kg de ciment dans une brouette. Il veut savoir quel effort ses bras supportent et quelle charge reçoit la roue.
### Je retiens
> Principe fondamental de la statique (PFS) : un solide est en équilibre si la somme vectorielle des forces extérieures est nulle et si la somme de leurs moments par rapport à n'importe quel point est nulle.
= Somme des forces = 0 (théorème de la résultante)
= Somme des moments en un point = 0 (théorème du moment)
> Solide soumis à 2 forces : elles ont même droite d'action, même intensité et des sens opposés.
> Solide soumis à 3 forces non parallèles : elles sont concourantes en un point et leur dynamique (triangle des forces) est fermé.
= Brouette : roue en O, charge 600 N à 0,40 m de O, mains à 1,20 m de O
= Moments en O : F × 1,20 − 600 × 0,40 = 0, donc F = 240 / 1,20 = 200 N
= Résultante verticale : R + 200 − 600 = 0, donc R = 400 N sur la roue
- On isole le solide, on fait le bilan des actions extérieures, puis on applique le PFS.
- Choisir le point de calcul des moments là où passe une force inconnue : elle disparaît de l'équation.
### Je vérifie
? Un solide soumis à deux forces est en équilibre. Ces forces :
+ ont même droite d'action, même intensité et des sens opposés
- sont perpendiculaires
- ont le même sens
! C'est la seule façon d'annuler à la fois la résultante et le moment.
? Une barre de 2 m repose sur deux appuis A et B à ses extrémités et porte une charge de 1 000 N à 0,5 m de A. Réaction en B ?
+ 250 N
- 750 N
- 500 N
! Moments en A : RB × 2 − 1 000 × 0,5 = 0, donc RB = 250 N (et RA = 750 N).
### Je m'exerce
1. Reprends la brouette avec une charge de 900 N placée à 0,30 m de la roue, les mains toujours à 1,20 m. Calcule l'effort des mains et la charge sur la roue.
2. Une poutre de 4 m sur deux appuis A et B porte une charge de 2 400 N à 1 m de A. Calcule RA et RB.
### Corrigé
1. Moments en O : F × 1,20 = 900 × 0,30 = 270, donc F = 225 N. Résultante : R = 900 − 225 = 675 N.
2. Moments en A : RB × 4 = 2 400 × 1, donc RB = 600 N. Résultante : RA = 2 400 − 600 = 1 800 N.

# Cinématique et transmission du mouvement

## 1N-CM-03 | Mouvements de translation et de rotation | 55 min
Objectif : Calculer les vitesses d'un solide en translation ou en rotation autour d'un axe fixe.
### Situation d'apprentissage
Dans une usine de transformation de cacao de San-Pédro, un tapis roulant est entraîné par un tambour. Le technicien veut connaître la vitesse du tapis à partir de la fréquence de rotation du tambour.
### Je retiens
> Translation rectiligne uniforme : tous les points ont la même vitesse constante, v = d / t (m/s).
> Rotation autour d'un axe fixe : chaque point décrit un cercle ; tous ont la même vitesse angulaire ω.
= ω = 2π × N / 60, avec ω en rad/s et N en tr/min
= v = ω × R, avec v en m/s et R en m
= Exemple : N = 1 500 tr/min donne ω = 2π × 1 500 / 60 ≈ 157,1 rad/s ; à R = 0,10 m, v ≈ 15,7 m/s
- Plus un point est éloigné de l'axe, plus sa vitesse linéaire est grande.
- Un tapis entraîné sans glissement par un tambour a la vitesse linéaire de la périphérie du tambour.
### Je vérifie
? Deux points d'un même disque en rotation, l'un à 5 cm, l'autre à 10 cm de l'axe :
+ ont la même vitesse angulaire, le second a une vitesse linéaire double
- ont la même vitesse linéaire
- le premier tourne deux fois plus vite
! ω est commune à tout le solide et v = ω R est proportionnelle à R.
? Un arbre tourne à 600 tr/min. Sa vitesse angulaire vaut environ :
+ 62,8 rad/s
- 10 rad/s
- 3 770 rad/s
! ω = 2π × 600 / 60 = 20π ≈ 62,8 rad/s.
### Je m'exerce
1. Le tambour du tapis a un diamètre de 400 mm et tourne à 60 tr/min. Calcule la vitesse du tapis.
2. Combien de temps met un sac de cacao pour parcourir 15 m sur ce tapis ?
### Corrigé
1. ω = 2π × 60 / 60 = 2π ≈ 6,283 rad/s ; R = 0,200 m ; v = 6,283 × 0,200 ≈ 1,26 m/s.
2. t = d / v = 15 / 1,257 ≈ 11,9 s.

## 1N-CM-04 | Transmission par poulies et courroie | 55 min
Objectif : Calculer le rapport de transmission d'un système poulies-courroie.
### Situation d'apprentissage
Une scierie de Yopougon utilise un moteur tournant à 1 450 tr/min pour entraîner une scie circulaire par courroie trapézoïdale. Le menuisier veut faire tourner la scie plus lentement en changeant une poulie.
### Je retiens
> Sans glissement, la vitesse linéaire de la courroie est la même sur les deux poulies.
= v = ω1 × R1 = ω2 × R2, donc N1 × d1 = N2 × d2
= Rapport de transmission : r = N2 / N1 = d1 / d2 (1 : poulie motrice, 2 : poulie réceptrice)
= Exemple : d1 = 100 mm, d2 = 250 mm, N1 = 1 450 tr/min donne r = 0,4 et N2 = 580 tr/min
- Si la poulie réceptrice est plus grande que la motrice, la vitesse diminue (réduction) et le couple disponible augmente.
- Avec une courroie ouverte, les deux poulies tournent dans le même sens ; avec une courroie croisée, en sens inverse.
- Avantages : silencieuse, absorbe les chocs, grands entraxes possibles. Inconvénient : possible glissement (sauf courroie crantée).
### Je vérifie
? Si la poulie réceptrice a un diamètre double de celui de la poulie motrice, sa fréquence de rotation est :
+ divisée par 2
- multipliée par 2
- identique
! N2 = N1 × d1 / d2 = N1 / 2.
? Moteur à 1 450 tr/min, poulie motrice 120 mm. Quel diamètre de poulie réceptrice donne 870 tr/min ?
+ 200 mm
- 72 mm
- 150 mm
! d2 = N1 × d1 / N2 = 1 450 × 120 / 870 = 200 mm.
### Je m'exerce
1. Une poulie motrice de 80 mm tourne à 1 500 tr/min et entraîne une poulie de 240 mm. Calcule r et N2.
2. Calcule la vitesse linéaire de la courroie dans ce montage.
### Corrigé
1. r = d1 / d2 = 80 / 240 = 1/3 ≈ 0,333 ; N2 = 1 500 / 3 = 500 tr/min.
2. ω1 = 2π × 1 500 / 60 ≈ 157,1 rad/s ; R1 = 0,040 m ; v = 157,1 × 0,040 ≈ 6,28 m/s.

## 1N-CM-05 | Les engrenages à denture droite | 60 min
Objectif : Calculer les caractéristiques d'un engrenage cylindrique droit et son rapport de transmission.
### Situation d'apprentissage
Le réducteur d'une bétonnière d'un chantier de Cocody est en panne : un pignon est cassé. Pour commander la pièce, le technicien doit retrouver son module, son nombre de dents et l'entraxe.
### Je retiens
> Deux roues dentées ne peuvent engrener que si elles ont le même module m (en mm, valeur normalisée : 1 ; 1,25 ; 1,5 ; 2 ; 2,5 ; 3…).
= Diamètre primitif : d = m × Z (Z : nombre de dents)
= Diamètre de tête : da = d + 2m ; diamètre de pied : df = d − 2,5m
= Saillie ha = m ; creux hf = 1,25 m ; hauteur de dent h = 2,25 m
= Entraxe : a = (d1 + d2) / 2 = m × (Z1 + Z2) / 2
= Rapport de transmission : r = N2 / N1 = Z1 / Z2 = d1 / d2
= Exemple : m = 2, Z1 = 20, Z2 = 60 donne d1 = 40 mm, d2 = 120 mm, a = 80 mm, r = 1/3
- Deux roues extérieures en prise tournent en sens inverse.
- Avantage : pas de glissement, rapport exact. Inconvénient : entraxe faible, lubrification nécessaire.
### Je vérifie
? Quelle condition est indispensable pour que deux roues dentées engrènent ?
+ Avoir le même module
- Avoir le même nombre de dents
- Avoir le même diamètre
! Le module fixe la taille des dents ; il doit être identique sur les deux roues.
? Un pignon de 18 dents tourne à 1 200 tr/min et entraîne une roue de 54 dents. Fréquence de la roue ?
+ 400 tr/min
- 3 600 tr/min
- 600 tr/min
! N2 = N1 × Z1 / Z2 = 1 200 × 18 / 54 = 400 tr/min.
### Je m'exerce
1. Un engrenage a m = 2,5 mm, Z1 = 16 et Z2 = 48. Calcule d1, d2, da1 et l'entraxe a.
2. Le pignon tourne à 1 440 tr/min. Calcule la fréquence de rotation de la roue.
### Corrigé
1. d1 = 2,5 × 16 = 40 mm ; d2 = 2,5 × 48 = 120 mm ; da1 = 40 + 2 × 2,5 = 45 mm ; a = (40 + 120) / 2 = 80 mm.
2. N2 = 1 440 × 16 / 48 = 480 tr/min.
