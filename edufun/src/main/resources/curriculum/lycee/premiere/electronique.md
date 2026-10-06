---
levels: Première F2
subject: Électronique
---
# Alimentation et redressement

## 1N-EL-01 | Redressement double alternance et filtrage | 60 min
Objectif : Dimensionner un pont de diodes et le condensateur de filtrage d'une alimentation.
### Situation d'apprentissage
L'atelier de maintenance d'une entreprise de Yopougon doit fabriquer un chargeur alimenté par le secteur CIE (230 V, 50 Hz). Le chef d'atelier demande aux stagiaires de Première F2 de choisir le pont de diodes et le condensateur de filtrage.
### Je retiens
> Le pont de Graetz (4 diodes) redresse les deux alternances : à chaque alternance, deux diodes conduisent en série.
> La tension redressée a une fréquence double : 100 Hz pour un secteur à 50 Hz.
> Le condensateur de filtrage se charge au maximum puis se décharge dans la charge : il réduit l'ondulation.
= Tension maximale redressée : Umax ≈ Ueff × √2 − 2 × 0,7 V
= Ondulation crête à crête (double alternance) : ΔU ≈ I / (f × C) avec f = 100 Hz
= Exemple : 12 V efficaces donne Umax ≈ 16,97 − 1,4 ≈ 15,6 V ; avec I = 0,5 A et C = 2 200 µF : ΔU ≈ 0,5 / (100 × 0,0022) ≈ 2,3 V
- Plus le courant demandé est grand, plus il faut un condensateur de forte capacité.
- Chaque diode du pont doit supporter en inverse au moins la tension Umax et le courant moyen demandé.
- La tension de service du condensateur doit dépasser Umax (par exemple 25 V pour 15,6 V).
### Je vérifie
? Quelle est la fréquence de la tension redressée par un pont de diodes sur le secteur à 50 Hz ?
+ 100 Hz
- 50 Hz
- 25 Hz
! Les deux alternances sont redressées : on obtient deux bosses par période, soit 100 Hz.
? Avec I = 1 A et C = 4 700 µF en double alternance, l'ondulation vaut environ :
+ 2,1 V
- 0,21 V
- 21 V
! ΔU ≈ 1 / (100 × 0,0047) = 1 / 0,47 ≈ 2,1 V.
### Je m'exerce
1. On veut une ondulation inférieure à 1 V pour un courant de 1 A en double alternance. Quelle capacité minimale faut-il ?
2. Un transformateur délivre 9 V efficaces. Calcule la tension maximale après le pont de diodes.
### Corrigé
1. C ≥ I / (f × ΔU) = 1 / (100 × 1) = 0,01 F = 10 000 µF.
2. Umax ≈ 9 × √2 − 1,4 ≈ 12,73 − 1,4 ≈ 11,3 V.

## 1N-EL-02 | La diode Zener et la stabilisation de tension | 55 min
Objectif : Calculer la résistance de limitation et la puissance d'un montage à diode Zener.
### Situation d'apprentissage
Au laboratoire du lycée technique de Bouaké, un capteur doit être alimenté sous 5,1 V stable alors que la tension disponible varie autour de 12 V. Le professeur propose un montage à diode Zener.
### Je retiens
> Une diode Zener s'utilise polarisée en inverse : au-delà de sa tension Zener Uz, elle maintient une tension presque constante à ses bornes.
> On place une résistance série Rs pour limiter le courant ; la charge est branchée en parallèle sur la Zener.
= Résistance série : Rs = (Ue − Uz) / (Iz + Ich)
= Puissance de la Zener : Pz = Uz × Iz ; puissance de Rs : P = (Ue − Uz)² / Rs
= Exemple : Ue = 12 V, Uz = 5,1 V, Ich = 20 mA, Iz = 10 mA donne Rs = 6,9 / 0,030 = 230 Ω, on prend 220 Ω
- Le cas le plus défavorable pour la Zener est la charge débranchée : tout le courant passe alors dans la Zener.
- Ce montage convient pour de faibles courants ; pour plus de puissance, on utilise un régulateur intégré (Terminale).
### Je vérifie
? Comment une diode Zener est-elle branchée pour stabiliser une tension ?
+ En inverse, avec une résistance série
- En direct, sans résistance
- En série avec la charge, en direct
! En inverse, elle impose Uz ; la résistance série absorbe la différence de tension.
? Une Zener de 6,2 V est traversée par 20 mA. Quelle puissance dissipe-t-elle ?
+ 124 mW
- 31 mW
- 1,24 W
! Pz = 6,2 × 0,020 = 0,124 W.
### Je m'exerce
1. Ue = 15 V, Uz = 9,1 V, Ich = 40 mA, Iz = 10 mA. Calcule Rs, choisis une valeur normalisée et calcule sa puissance.
2. Charge débranchée, quelle puissance dissipe la Zener ? Quelle puissance nominale choisir ?
### Corrigé
1. Rs = (15 − 9,1) / 0,050 = 5,9 / 0,050 = 118 Ω, on prend 120 Ω. P = 5,9² / 120 = 34,81 / 120 ≈ 0,29 W : résistance de 0,5 W.
2. I = 5,9 / 120 ≈ 49,2 mA passent dans la Zener : Pz = 9,1 × 0,0492 ≈ 0,45 W. On choisit une Zener de 1 W par sécurité.

# Le transistor bipolaire

## 1N-EL-03 | Le transistor bipolaire en amplification et en commutation | 60 min
Objectif : Calculer les courants d'un transistor NPN et dimensionner sa résistance de base en commutation.
### Situation d'apprentissage
Une PME d'Abidjan conçoit une commande de pompe pour château d'eau. La sortie de la carte de commande (5 V) est trop faible pour alimenter directement le relais de 12 V : il faut un transistor.
### Je retiens
> Le transistor NPN a trois bornes : base (B), collecteur (C), émetteur (E). Un petit courant de base commande un grand courant de collecteur.
= Ic = β × Ib ; Ie = Ic + Ib ; Vbe ≈ 0,7 V (silicium)
= Régime linéaire : Vce = Vcc − Rc × Ic
= Commutation : bloqué si Ib = 0 (Ic = 0, interrupteur ouvert) ; saturé si Ib ≥ Icsat / β (Vce ≈ 0,2 V, interrupteur fermé)
= Exemple : relais de 120 Ω sous 12 V, Icsat ≈ 12 / 120 = 100 mA ; β = 100 donne Ib min = 1 mA ; on prend Ib = 2 mA (coefficient de sécurité 2) ; Rb = (5 − 0,7) / 0,002 = 2 150 Ω, on choisit 2,2 kΩ
- Une diode de roue libre doit être placée en inverse aux bornes de la bobine du relais pour protéger le transistor.
### Je vérifie
? Un transistor a β = 200 et Ib = 50 µA en régime linéaire. Que vaut Ic ?
+ 10 mA
- 4 mA
- 250 µA
! Ic = 200 × 50 µA = 10 000 µA = 10 mA.
? En commutation, un transistor saturé se comporte comme :
+ un interrupteur fermé
- un interrupteur ouvert
- une résistance infinie
! Saturé, Vce ≈ 0,2 V : le courant circule entre collecteur et émetteur.
### Je m'exerce
1. Vcc = 12 V, Rc = 1 kΩ, β = 150, Ib = 40 µA. Calcule Ic et Vce.
2. Pour une LED commandée en saturation (Icsat = 20 mA, β = 100), commande sous 5 V, calcule Rb avec un coefficient de sécurité de 2.
### Corrigé
1. Ic = 150 × 40 µA = 6 mA ; Vce = 12 − 1 000 × 0,006 = 6 V (le transistor est bien en régime linéaire).
2. Ib min = 20 / 100 = 0,2 mA ; Ib = 0,4 mA ; Rb = (5 − 0,7) / 0,0004 = 10 750 Ω, on choisit 10 kΩ (Ib ≈ 0,43 mA, saturation assurée).

# Logique

## 1N-EL-04 | Simplification logique, multiplexeurs et décodeurs | 60 min
Objectif : Simplifier une fonction logique et utiliser les circuits combinatoires intégrés.
### Situation d'apprentissage
Pour le tableau d'affichage du gymnase du lycée technique d'Abidjan, les élèves doivent réduire le nombre de portes logiques d'un montage et choisir un décodeur pour piloter les afficheurs.
### Je retiens
> Simplifier une équation, c'est réduire le nombre de portes : on utilise l'algèbre de Boole ou le tableau de Karnaugh.
> Karnaugh : on place les 1 de la sortie dans une grille ordonnée en code Gray, puis on regroupe les cases adjacentes par 2, 4 ou 8 ; chaque groupe élimine les variables qui changent.
= Exemple : S = a · b · c + a · b · /c + a · /b · c = a · b + a · /b · c = a · (b + /b · c) = a · (b + c) = a · b + a · c
> Multiplexeur 2ⁿ vers 1 : n entrées de sélection choisissent l'entrée recopiée sur la sortie.
> Décodeur n vers 2ⁿ : active une seule sortie selon le code binaire présent sur ses n entrées.
> Le décodeur BCD-7 segments transforme un chiffre codé en binaire (0 à 9) en commande des 7 segments d'un afficheur.
- Toute fonction logique peut être réalisée uniquement avec des portes NAND (ou uniquement avec des NOR).
### Je vérifie
? Combien d'entrées de sélection possède un multiplexeur 8 vers 1 ?
+ 3
- 8
- 2
! 2³ = 8 : trois bits suffisent pour choisir une entrée parmi huit.
? Simplifie S = /a · /b + /a · b + a · b.
+ S = /a + b
- S = a · b
- S = 1
! /a · /b + /a · b = /a ; puis /a + a · b = /a + b.
### Je m'exerce
1. Simplifie S = a · b + a · /b + /a · b.
2. Combien de sorties possède un décodeur à 4 entrées ? Combien d'entrées de sélection faut-il pour un multiplexeur 16 vers 1 ?
### Corrigé
1. a · b + a · /b = a, donc S = a + /a · b = a + b.
2. 2⁴ = 16 sorties ; il faut 4 entrées de sélection.

## 1N-EL-05 | Les bascules RS, D et JK | 60 min
Objectif : Décrire le fonctionnement des bascules et prévoir l'état de leur sortie.
### Situation d'apprentissage
Le portail automatique d'une résidence de Cocody doit se souvenir qu'on a appuyé sur le bouton d'ouverture, même après avoir relâché le bouton. Les élèves découvrent la mémoire électronique : la bascule.
### Je retiens
> Une bascule est un circuit séquentiel : sa sortie Q dépend des entrées et de l'état précédent (effet mémoire).
= Bascule RS : S = 1, R = 0 donne Q = 1 ; S = 0, R = 1 donne Q = 0 ; S = R = 0 : mémoire ; S = R = 1 : état interdit
= Bascule D synchrone : au front actif de l'horloge, Q prend la valeur de D
= Bascule JK : J = K = 0 mémoire ; J = 1, K = 0 donne Q = 1 ; J = 0, K = 1 donne Q = 0 ; J = K = 1 : Q bascule (change d'état) à chaque front
- Une bascule JK avec J = K = 1 (ou une bascule D avec D relié à /Q) divise la fréquence d'horloge par 2.
- En reliant n bascules en cascade, on divise la fréquence par 2ⁿ.
### Je vérifie
? Une bascule JK a J = K = 1. Que fait la sortie à chaque front d'horloge ?
+ Elle change d'état
- Elle reste à 0
- Elle reste à 1
! J = K = 1 correspond au mode basculement.
? Une horloge de 1 kHz attaque une bascule JK avec J = K = 1. Fréquence de Q ?
+ 500 Hz
- 2 kHz
- 1 kHz
! Q change d'état à chaque front actif : il faut deux fronts pour une période, d'où 1 000 / 2 = 500 Hz.
### Je m'exerce
1. Une bascule D (Q = 0 au départ) reçoit successivement D = 1, 0, 1, 1 au moment de quatre fronts montants. Donne les valeurs successives de Q.
2. Trois bascules JK en cascade (J = K = 1) reçoivent une horloge de 8 kHz. Quelle est la fréquence à la sortie de la dernière ?
### Corrigé
1. Q recopie D à chaque front : 1, 0, 1, 1.
2. Chaque bascule divise par 2 : 8 000 / 2³ = 8 000 / 8 = 1 000 Hz = 1 kHz.
