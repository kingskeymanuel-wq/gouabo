---
levels: Première E, Première F3
subject: Électrotechnique
---
# Régime sinusoïdal monophasé

## 1N-ET-01 | Grandeurs sinusoïdales | 55 min
Objectif : Caractériser une tension sinusoïdale par sa valeur efficace, sa fréquence et sa phase.
### Situation d'apprentissage
Au laboratoire d'électrotechnique du lycée technique de Yamoussoukro, les élèves observent à l'oscilloscope la tension du réseau de la CIE à travers un transformateur abaisseur. Le professeur leur demande pourquoi on parle de « 230 V » alors que la courbe monte bien plus haut.
### Je retiens
> Une grandeur sinusoïdale s'écrit u(t) = Umax × sin(ωt + φ).
= Pulsation : ω = 2π × f (rad/s) ; période : T = 1 / f
= Réseau ivoirien : f = 50 Hz, donc T = 20 ms et ω ≈ 314 rad/s
= Valeur efficace : U = Umax / √2 ; pour U = 230 V, Umax = 230 × √2 ≈ 325 V
> La valeur efficace est celle qui produit le même effet Joule qu'une tension continue de même valeur ; c'est elle qu'affichent les voltmètres en position AC.
> Le déphasage φ entre tension et courant se mesure par le décalage temporel Δt : φ = 2π × Δt / T (en rad), soit 360° × Δt / T.
- La valeur moyenne d'une grandeur sinusoïdale est nulle.
- On représente une grandeur sinusoïdale par un vecteur de Fresnel de longueur égale à la valeur efficace.
### Je vérifie
? Quelle valeur affiche un voltmètre branché sur une prise du réseau CIE ?
+ La valeur efficace, environ 230 V
- La valeur maximale, environ 325 V
- La valeur moyenne, 0 V
! En alternatif, le voltmètre mesure la valeur efficace.
? Le courant est en retard de 2,5 ms sur la tension à 50 Hz. Déphasage ?
+ 45°
- 25°
- 90°
! φ = 360° × 2,5 / 20 = 45°.
### Je m'exerce
1. Une tension a une valeur maximale de 34 V et une période de 20 ms. Calcule sa valeur efficace, sa fréquence et sa pulsation.
2. Écris l'expression u(t) de la tension du réseau (230 V, 50 Hz), avec une phase à l'origine nulle.
### Corrigé
1. U = 34 / √2 ≈ 24,0 V ; f = 1 / 0,020 = 50 Hz ; ω = 2π × 50 ≈ 314 rad/s.
2. u(t) = 325 × sin(314 t), avec u en volts et t en secondes.

## 1N-ET-02 | Impédance des dipôles R, L et C | 60 min
Objectif : Calculer l'impédance d'un circuit et l'intensité qui le traverse en régime sinusoïdal.
### Situation d'apprentissage
Un technicien d'une entreprise de froid de Treichville contrôle une bobine de contacteur. Branchée en continu, elle laisse passer un fort courant ; branchée en alternatif 230 V, le courant est bien plus faible. Il veut comprendre la différence.
### Je retiens
> L'impédance Z (en Ω) généralise la résistance en alternatif : U = Z × I (valeurs efficaces).
= Résistance : Z = R, courant en phase avec la tension
= Bobine parfaite : Z = XL = L × ω, courant en retard de 90°
= Condensateur parfait : Z = XC = 1 / (C × ω), courant en avance de 90°
= Circuit R et L en série : Z = √(R² + (Lω)²) et tan φ = Lω / R
= Exemple : R = 30 Ω et Lω = 40 Ω donnent Z = √(900 + 1 600) = 50 Ω ; sous 230 V, I = 4,6 A ; cos φ = R / Z = 0,6
- En continu, la bobine n'oppose que sa résistance : le courant est beaucoup plus grand.
- La réactance d'une bobine augmente avec la fréquence, celle d'un condensateur diminue.
### Je vérifie
? Quand la fréquence augmente, la réactance d'un condensateur :
+ diminue
- augmente
- ne change pas
! XC = 1 / (Cω) est inversement proportionnelle à ω.
? Une bobine parfaite de 0,1 H est alimentée sous 50 Hz. Sa réactance vaut environ :
+ 31,4 Ω
- 5 Ω
- 0,03 Ω
! XL = L × 2π f = 0,1 × 314,16 ≈ 31,4 Ω.
### Je m'exerce
1. Un circuit série comprend R = 40 Ω et une bobine de réactance 30 Ω, sous 230 V et 50 Hz. Calcule Z, I et cos φ.
2. Calcule la réactance d'un condensateur de 10 µF à 50 Hz.
### Corrigé
1. Z = √(40² + 30²) = √2 500 = 50 Ω ; I = 230 / 50 = 4,6 A ; cos φ = 40 / 50 = 0,8.
2. XC = 1 / (10 × 10⁻⁶ × 314,16) ≈ 318 Ω.

## 1N-ET-03 | Puissances active, réactive et apparente | 60 min
Objectif : Calculer les puissances P, Q et S d'une installation monophasée.
### Situation d'apprentissage
Une boulangerie de Marcory a reçu un courrier de son fournisseur d'électricité au sujet de son mauvais facteur de puissance. Le patron, qui croyait payer seulement des watts, demande à un élève de Première F3 de lui expliquer.
### Je retiens
= Puissance active : P = U × I × cos φ (en W), c'est la puissance réellement transformée en travail ou en chaleur
= Puissance réactive : Q = U × I × sin φ (en var), échangée avec les bobines et condensateurs
= Puissance apparente : S = U × I (en VA), elle dimensionne câbles, transformateurs et protections
= Relation : S² = P² + Q² ; facteur de puissance : cos φ = P / S
= Exemple : U = 230 V, I = 4,6 A, cos φ = 0,6 : S = 1 058 VA ; P = 634,8 W ; Q = 1 058 × 0,8 = 846,4 var
> Théorème de Boucherot : les puissances actives s'additionnent, les puissances réactives s'additionnent (en tenant compte du signe), mais pas les puissances apparentes.
- Une bobine consomme de la puissance réactive (Q > 0), un condensateur en fournit (Q < 0).
- Pour la même puissance active, un faible cos φ impose un courant plus fort, donc plus de pertes en ligne.
### Je vérifie
? Quelle puissance dimensionne la section des câbles d'une installation ?
+ La puissance apparente S
- La puissance active P seulement
- La puissance réactive Q seulement
! Le courant I = S / U détermine l'échauffement des câbles.
? Un moteur monophasé absorbe 5 A sous 230 V avec cos φ = 0,8. Puissance active ?
+ 920 W
- 1 150 W
- 690 W
! P = 230 × 5 × 0,8 = 920 W.
### Je m'exerce
1. Une installation comprend un four résistif de 2 000 W et un moteur (P = 1 500 W, Q = 1 200 var). Calcule P, Q et S totales, puis le facteur de puissance.
2. Calcule le courant total sous 230 V.
### Corrigé
1. P = 2 000 + 1 500 = 3 500 W ; Q = 0 + 1 200 = 1 200 var ; S = √(3 500² + 1 200²) = √13 690 000 = 3 700 VA ; cos φ = 3 500 / 3 700 ≈ 0,946.
2. I = S / U = 3 700 / 230 ≈ 16,1 A.

## 1N-ET-04 | Relèvement du facteur de puissance | 55 min
Objectif : Calculer la capacité du condensateur qui relève le facteur de puissance d'une installation.
### Situation d'apprentissage
Le patron de la boulangerie de Marcory décide d'installer un condensateur sur son pétrin électrique (P = 2 000 W, cos φ = 0,6, 230 V, 50 Hz) pour atteindre cos φ = 0,9. L'électricien doit choisir la capacité.
### Je retiens
> Un condensateur placé en parallèle fournit de la puissance réactive et compense celle consommée par les moteurs : P ne change pas, Q et le courant diminuent.
= Puissance réactive à fournir : QC = P × (tan φ − tan φ')
= Capacité : C = P × (tan φ − tan φ') / (U² × ω)
= Exemple : cos φ = 0,6 donne tan φ ≈ 1,333 ; cos φ' = 0,9 donne tan φ' ≈ 0,484
= QC = 2 000 × 0,849 ≈ 1 698 var ; C = 1 698 / (230² × 314,16) ≈ 1,02 × 10⁻⁴ F ≈ 102 µF
= Courant avant : I = 2 000 / (230 × 0,6) ≈ 14,5 A ; après : I' = 2 000 / (230 × 0,9) ≈ 9,7 A
- Un meilleur facteur de puissance réduit les pertes en ligne et évite des pénalités pour consommation d'énergie réactive.
- On ne cherche pas cos φ = 1 exactement, pour éviter la surcompensation.
### Je vérifie
? Après l'ajout d'un condensateur en parallèle, la puissance active de l'installation :
+ reste la même
- augmente
- diminue fortement
! Un condensateur parfait ne consomme pas de puissance active.
? Une installation consomme P = 4 000 W avec tan φ = 1. On veut tan φ' = 0,4. Puissance réactive à fournir ?
+ 2 400 var
- 1 600 var
- 4 000 var
! QC = 4 000 × (1 − 0,4) = 2 400 var.
### Je m'exerce
1. Un atelier consomme P = 3 000 W sous 230 V, 50 Hz, avec cos φ = 0,7. Calcule la capacité qui porte cos φ à 0,95.
2. Calcule le courant de ligne avant et après compensation.
### Corrigé
1. tan φ = 0,714 / 0,7 ≈ 1,020 ; tan φ' = 0,312 / 0,95 ≈ 0,329 ; QC = 3 000 × (1,020 − 0,329) ≈ 2 073 var ; C = 2 073 / (52 900 × 314,16) ≈ 1,25 × 10⁻⁴ F ≈ 125 µF.
2. Avant : I = 3 000 / (230 × 0,7) ≈ 18,6 A ; après : I' = 3 000 / (230 × 0,95) ≈ 13,7 A.

# Réseaux triphasés

## 1N-ET-05 | Le réseau triphasé et le couplage des récepteurs | 60 min
Objectif : Relier tensions simples et composées et calculer la puissance d'un récepteur triphasé équilibré.
### Situation d'apprentissage
Une menuiserie de la zone industrielle de Koumassi reçoit un nouveau moteur dont la plaque indique « 230 V / 400 V ». Le réseau de l'atelier est en 400 V entre phases. L'électricien doit choisir le bon couplage dans la plaque à bornes.
### Je retiens
> Le réseau triphasé comporte trois phases (L1, L2, L3) et souvent un neutre N ; les trois tensions sont déphasées de 120°.
= Tension simple V (entre phase et neutre) ; tension composée U (entre deux phases) : U = V × √3
= Réseau basse tension : V = 230 V et U = 400 V
= Couplage étoile : chaque élément est sous V ; le courant de ligne I égale le courant dans l'élément J
= Couplage triangle : chaque élément est sous U ; I = J × √3
= Puissance active d'un récepteur équilibré : P = √3 × U × I × cos φ ; Q = √3 × U × I × sin φ ; S = √3 × U × I
= Exemple : moteur sous 400 V, I = 10 A, cos φ = 0,85 : P = 1,732 × 400 × 10 × 0,85 ≈ 5 889 W
> Règle de couplage : la plus petite tension de la plaque doit être celle que supporte chaque enroulement. Moteur 230 V / 400 V sur réseau 400 V : couplage étoile.
- Le triphasé transporte plus de puissance avec moins de cuivre et crée naturellement un champ tournant pour les moteurs.
### Je vérifie
? Sur le réseau 230 V / 400 V, quelle tension mesure-t-on entre deux phases ?
+ 400 V
- 230 V
- 690 V
! La tension composée vaut U = 230 × √3 ≈ 400 V.
? Un moteur 400 V / 690 V doit être branché sur un réseau 400 V entre phases. Couplage ?
+ Triangle
- Étoile
- Aucun, il ne peut pas fonctionner
! Chaque enroulement supporte 400 V : en triangle il reçoit justement U = 400 V.
### Je m'exerce
1. Trois résistances de 46 Ω sont couplées en étoile sur le réseau 400 V. Calcule le courant dans chaque résistance et la puissance totale.
2. Les mêmes résistances sont couplées en triangle. Calcule J, I et la puissance totale. Compare.
### Corrigé
1. Chaque résistance est sous V = 230 V : J = I = 230 / 46 = 5 A ; P = 3 × 46 × 5² = 3 450 W (ou √3 × 400 × 5 × 1 ≈ 3 464 W, l'écart vient de l'arrondi 400 au lieu de 398,4 V).
2. Chaque résistance est sous 400 V : J = 400 / 46 ≈ 8,70 A ; I = 8,70 × √3 ≈ 15,1 A ; P = 3 × 400² / 46 ≈ 10 435 W. La puissance est environ trois fois plus grande en triangle (exactement 3 fois avec U = V × √3).
