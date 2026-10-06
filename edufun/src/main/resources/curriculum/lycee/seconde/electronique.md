---
levels: Seconde F2
subject: Électronique
---
# Composants passifs

## 2N-EL-01 | Les résistances et la loi d'Ohm | 55 min
Objectif : Lire la valeur d'une résistance et calculer une association, un courant et une puissance.
### Situation d'apprentissage
À l'atelier d'électronique du lycée technique d'Abidjan, Koffi doit remplacer une résistance grillée sur la carte d'un poste radio. Le corps de la résistance porte quatre anneaux de couleur et il ne sait pas les lire.
### Je retiens
> Une résistance s'oppose au passage du courant ; sa valeur s'exprime en ohms (Ω).
> Code des couleurs : noir 0, marron 1, rouge 2, orange 3, jaune 4, vert 5, bleu 6, violet 7, gris 8, blanc 9.
> Anneaux 1 et 2 : chiffres ; anneau 3 : multiplicateur (puissance de 10) ; anneau 4 : tolérance (or 5 %, argent 10 %).
= Exemple : jaune, violet, rouge, or donne 47 × 10² = 4 700 Ω = 4,7 kΩ à 5 % près
= Loi d'Ohm : U = R × I (U en V, R en Ω, I en A)
= Puissance dissipée : P = U × I = R × I² = U² / R (en W)
= Association en série : Req = R1 + R2
= Association en parallèle : Req = (R1 × R2) / (R1 + R2)
- En série, la résistance équivalente est plus grande que chaque résistance.
- En parallèle, elle est plus petite que la plus petite des résistances.
- On choisit toujours une résistance dont la puissance nominale (0,25 W ; 0,5 W ; 1 W…) dépasse la puissance réellement dissipée.
### Je vérifie
? Deux résistances de 1 kΩ sont montées en parallèle. La résistance équivalente vaut :
+ 500 Ω
- 2 kΩ
- 1 kΩ
! Req = (1 000 × 1 000) / (1 000 + 1 000) = 1 000 000 / 2 000 = 500 Ω.
? Quelle est la valeur d'une résistance marron, noir, rouge ?
+ 1 kΩ
- 102 Ω
- 10 kΩ
! Marron 1, noir 0, rouge × 10² : 10 × 100 = 1 000 Ω.
### Je m'exerce
1. Une résistance de 220 Ω est alimentée sous 12 V. Calcule le courant et la puissance dissipée, puis choisis entre une résistance de 0,25 W et une de 1 W.
2. Calcule la résistance équivalente de R1 = 330 Ω et R2 = 470 Ω en série, puis en parallèle.
### Corrigé
1. I = U / R = 12 / 220 = 0,0545 A soit 54,5 mA. P = U² / R = 144 / 220 = 0,65 W. La résistance de 0,25 W chaufferait et grillerait : on choisit celle de 1 W.
2. Série : 330 + 470 = 800 Ω. Parallèle : (330 × 470) / 800 = 155 100 / 800 ≈ 194 Ω.

## 2N-EL-02 | Condensateurs et bobines | 55 min
Objectif : Calculer la charge, l'énergie et la constante de temps d'un circuit RC.
### Situation d'apprentissage
Dans une PME de réparation de Treichville, un technicien explique à Aya, stagiaire de Seconde F2, pourquoi le gros condensateur d'une alimentation reste dangereux quelques secondes après avoir débranché l'appareil.
### Je retiens
> Un condensateur stocke des charges électriques ; sa capacité C s'exprime en farads (F), souvent en µF (10⁻⁶ F) ou nF (10⁻⁹ F).
> Une bobine stocke de l'énergie sous forme magnétique ; son inductance L s'exprime en henrys (H).
= Charge : Q = C × U (Q en coulombs)
= Énergie du condensateur : W = ½ C U² ; énergie de la bobine : W = ½ L I²
= Constante de temps du circuit RC : τ = R × C (en secondes)
= Au bout de τ, le condensateur est chargé à 63 % ; au bout de 5τ, il est pratiquement chargé (plus de 99 %).
= Condensateurs en parallèle : C = C1 + C2 ; en série : 1/C = 1/C1 + 1/C2
- Un condensateur électrolytique est polarisé : respecter le + et le −, ne jamais dépasser sa tension de service.
- La bobine s'oppose aux variations brusques du courant.
### Je vérifie
? Que représente la constante de temps τ = RC ?
+ La durée caractéristique de la charge ou de la décharge du condensateur
- La tension maximale que supporte le condensateur
- La fréquence du courant du secteur
! Après τ le condensateur atteint 63 % de sa charge ; il est quasi chargé après 5τ.
? R = 10 kΩ et C = 100 µF. Que vaut τ ?
+ 1 s
- 0,1 s
- 1 000 s
! τ = 10 000 × 100 × 10⁻⁶ = 1 s.
### Je m'exerce
1. Un condensateur de 470 µF est chargé sous 12 V. Calcule sa charge et l'énergie stockée.
2. Ce condensateur se charge à travers une résistance de 1 kΩ. Au bout de combien de temps est-il pratiquement chargé ?
### Corrigé
1. Q = 470 × 10⁻⁶ × 12 = 5,64 × 10⁻³ C. W = ½ × 470 × 10⁻⁶ × 12² = 0,5 × 470 × 10⁻⁶ × 144 ≈ 0,0338 J soit 33,8 mJ.
2. τ = 1 000 × 470 × 10⁻⁶ = 0,47 s ; charge pratiquement complète après 5τ = 2,35 s.

# Diodes

## 2N-EL-03 | La diode, la LED et le redressement simple alternance | 60 min
Objectif : Polariser une diode, calculer la résistance de protection d'une LED et décrire un redressement simple alternance.
### Situation d'apprentissage
Le club électronique du lycée technique de Yamoussoukro fabrique un voyant de charge pour batterie 12 V. Ils veulent allumer une LED rouge sans la détruire et comprendre comment on obtient du courant continu à partir du secteur CIE.
### Je retiens
> La diode laisse passer le courant de l'anode vers la cathode (sens direct) et le bloque en sens inverse.
> Diode au silicium passante : tension de seuil d'environ 0,6 à 0,7 V.
> LED : tension directe d'environ 2 V (rouge), courant de 10 à 20 mA ; elle doit toujours être protégée par une résistance série.
= Résistance de protection : R = (E − Vf) / I
= Exemple : E = 12 V, Vf = 2 V, I = 20 mA donne R = 10 / 0,020 = 500 Ω ; on prend la valeur normalisée supérieure 560 Ω, d'où I = 10 / 560 ≈ 17,9 mA
= Tension maximale d'une tension sinusoïdale : Umax = Ueff × √2
= Redressement simple alternance : Umax charge ≈ Umax − 0,7 V ; seule l'alternance positive passe ; fréquence de sortie 50 Hz
- Le redressement simple alternance est simple mais donne une tension très ondulée ; on l'améliore en Première (pont de diodes et filtrage).
### Je vérifie
? Une diode est passante lorsque :
+ son anode est plus positive que sa cathode d'au moins 0,6 V environ
- sa cathode est plus positive que son anode
- elle est traversée par un courant alternatif uniquement
! En sens direct, au-delà de la tension de seuil, la diode conduit.
? Une LED (Vf = 2 V, I = 10 mA) est alimentée sous 5 V. Quelle résistance faut-il ?
+ 300 Ω
- 500 Ω
- 200 Ω
! R = (5 − 2) / 0,010 = 300 Ω.
### Je m'exerce
1. Un transformateur délivre 12 V efficaces. Calcule la tension maximale au secondaire puis la tension maximale aux bornes de la charge après une diode en simple alternance.
2. Calcule la résistance de protection d'une LED verte (Vf = 2,2 V, I = 15 mA) alimentée sous 9 V.
### Corrigé
1. Umax = 12 × √2 ≈ 16,97 V ; aux bornes de la charge : 16,97 − 0,7 ≈ 16,3 V.
2. R = (9 − 2,2) / 0,015 = 6,8 / 0,015 ≈ 453 Ω ; on prend 470 Ω (valeur normalisée), soit I = 6,8 / 470 ≈ 14,5 mA.

# Logique combinatoire

## 2N-EL-04 | Numération binaire et hexadécimale | 50 min
Objectif : Convertir un nombre entre les bases 10, 2 et 16.
### Situation d'apprentissage
Sur l'afficheur d'un automate de la zone industrielle de Yopougon, le technicien lit le code « C8 ». Le responsable de maintenance demande à Ibrahim, stagiaire F2, de dire à quel nombre décimal correspond ce code.
### Je retiens
> Les circuits numériques ne connaissent que deux états : 0 et 1 (bit). Un octet compte 8 bits.
> Base 2 : chaque rang vaut une puissance de 2 (1, 2, 4, 8, 16, 32, 64, 128…).
> Base 16 : chiffres 0 à 9 puis A = 10, B = 11, C = 12, D = 13, E = 14, F = 15 ; un chiffre hexadécimal correspond à 4 bits.
= 1101 en base 2 = 8 + 4 + 0 + 1 = 13
= 200 = 128 + 64 + 8 donne 11001000 en base 2
= 11001000 se découpe en 1100 et 1000, soit C et 8 : 200 = C8 en hexadécimal
= Avec n bits, on code 2ⁿ valeurs, de 0 à 2ⁿ − 1 (8 bits : 0 à 255)
- Conversion décimal vers binaire : divisions successives par 2, on lit les restes du dernier au premier.
### Je vérifie
? Combien de valeurs différentes peut-on coder sur 8 bits ?
+ 256
- 255
- 128
! 2⁸ = 256 valeurs, de 0 à 255.
? Que vaut 3F (hexadécimal) en décimal ?
+ 63
- 315
- 48
! 3 × 16 + 15 = 48 + 15 = 63.
### Je m'exerce
1. Convertis 45 en binaire puis en hexadécimal.
2. Convertis 10110110 (binaire) en décimal.
### Corrigé
1. 45 = 32 + 8 + 4 + 1 donne 101101, soit 0010 1101 sur 8 bits, c'est-à-dire 2D en hexadécimal (2 × 16 + 13 = 45).
2. 128 + 32 + 16 + 4 + 2 = 182.

## 2N-EL-05 | Algèbre de Boole et portes logiques | 60 min
Objectif : Écrire et simplifier l'équation logique d'un système simple.
### Situation d'apprentissage
Un commerçant de Treichville veut une alarme : elle doit sonner si la porte est ouverte alors que le système est armé, ou si l'on appuie sur le bouton de panique. Les élèves de Seconde F2 doivent écrire l'équation et choisir les portes logiques.
### Je retiens
> On note /a le complément de a (« a barre ») : /a = 1 si a = 0.
> Porte ET : S = a · b vaut 1 seulement si a = 1 et b = 1.
> Porte OU : S = a + b vaut 1 si au moins une entrée vaut 1.
> Porte NON : S = /a.
> NON-ET (NAND) : S = /(a · b) ; NON-OU (NOR) : S = /(a + b) ; OU exclusif (XOR) : S = 1 si les entrées sont différentes.
= Règles : a + 0 = a ; a + 1 = 1 ; a · 0 = 0 ; a · 1 = a ; a + /a = 1 ; a · /a = 0
= Absorption : a + a · b = a
= Théorèmes de De Morgan : /(a · b) = /a + /b ; /(a + b) = /a · /b
= Exemple : S = a · b + a · /b = a · (b + /b) = a · 1 = a
- Pour décrire un système : repérer les entrées, la sortie, puis écrire la condition de mise à 1 de la sortie.
### Je vérifie
? Que vaut la sortie d'une porte OU exclusif pour a = 1 et b = 1 ?
+ 0
- 1
- 2
! Le XOR vaut 1 seulement si les entrées sont différentes.
? Simplifie S = a + a · b.
+ S = a
- S = b
- S = a · b
! a + a · b = a · (1 + b) = a · 1 = a (absorption).
### Je m'exerce
1. Écris l'équation de l'alarme du commerçant avec p (porte ouverte), m (système armé) et b (bouton de panique). Que vaut S pour p = 1, m = 0, b = 0 ?
2. Simplifie S = /a · b + a · b + a · /b.
### Corrigé
1. S = p · m + b. Pour p = 1, m = 0, b = 0 : S = 1 · 0 + 0 = 0, l'alarme ne sonne pas (système désarmé).
2. /a · b + a · b = b · (/a + a) = b, donc S = b + a · /b = (b + a) · (b + /b) = a + b.
