---
order: 12
subject: Électronique
series: Série F2
duration: Épreuve écrite
---
# Méthode
> Le sujet étudie un système réel découpé en blocs : alimentation stabilisée, commande par transistor, amplificateur opérationnel, conversion analogique-numérique, logique combinatoire et séquentielle, microcontrôleur. Le correcteur attend pour chaque question la formule, l'application numérique et le résultat avec son unité.
1. **Lis tout le sujet** et souligne les données (tensions, fréquences, β, nombre de bits, valeurs des composants) ; repère les questions indépendantes.
2. **Trace le schéma fonctionnel** : transformateur, redressement, filtrage, régulation, charge ; ou capteur, amplification, conversion, traitement, commande.
3. **Calcule bloc par bloc** : écris la formule littérale, remplace par les valeurs en unités SI (V, A, Ω, F, Hz), donne le résultat avec 2 ou 3 chiffres significatifs.
4. **Vérifie les limites** : la sortie d'un AOP ne dépasse pas ± Vsat ; la tension minimale après filtrage doit rester supérieure à la tension d'entrée minimale du régulateur ; un transistor de commande doit être saturé.
5. **Choisis des valeurs normalisées** (série E12 : 1 – 1,2 – 1,5 – 1,8 – 2,2 – 2,7 – 3,3 – 3,9 – 4,7 – 5,6 – 6,8 – 8,2) du côté de la sécurité et justifie ton choix.
6. **Conclus par une phrase** : le montage convient-il au cahier des charges ?
- Piège fréquent : oublier les 2 × 0,7 V perdus dans le pont de diodes, ou prendre f = 50 Hz au lieu de 100 Hz pour l'ondulation en double alternance.
- Piège fréquent : confondre µF et F (2 200 µF = 0,0022 F) ou mA et A dans les calculs.
- Piège fréquent : en logique, oublier qu'avec n bascules on obtient au plus 2ⁿ états, de 0 à 2ⁿ − 1.

# Sujet type 1 — Alimentation et commande de la pompe d'un château d'eau
Une PME de Bouaké réalise, pour une station de la SODECI, une carte de commande automatique de la pompe d'un château d'eau. La carte comprend une alimentation stabilisée 5 V, un microcontrôleur et un étage de commande du relais de la pompe.
**Partie A — Alimentation stabilisée (12 points)**
La carte consomme un courant I = 0,5 A. L'alimentation comprend : un transformateur 230 V / 9 V, 50 Hz ; un pont de Graetz (tension de seuil de chaque diode : 0,7 V) ; un condensateur de filtrage C ; un régulateur 7805 (tension d'entrée minimale : 7 V).
1. Calcule le rapport de transformation m du transformateur.
2. Calcule la valeur maximale de la tension au secondaire, puis la tension maximale Umax après le pont de diodes.
3. Quelle est la fréquence de la tension redressée ? Justifie.
4. Le cahier des charges impose une ondulation crête à crête ΔU ≤ 2 V. Calcule la capacité minimale du condensateur, puis choisis une valeur normalisée parmi 1 000 µF, 2 200 µF, 3 300 µF et 4 700 µF (on prendra la plus petite qui convient).
5. Avec la capacité choisie, calcule l'ondulation réelle et la tension minimale Umin après filtrage. La régulation est-elle assurée ?
6. Quelle tension de service minimale doit avoir le condensateur ? Choisis entre 10 V, 16 V et 25 V.
7. Quelle tension inverse chaque diode doit-elle supporter au minimum ? Quel courant moyen traverse chaque diode ?
8. Calcule la tension moyenne d'entrée du régulateur, puis la puissance qu'il dissipe. Que faut-il prévoir ?
**Partie B — Commande du relais de la pompe (6 points)**
La bobine du relais (résistance 150 Ω) est alimentée sous Vcc = 12 V par une source séparée, à travers un transistor NPN commandé par la broche 8 du microcontrôleur (niveau haut : 5 V). On donne : Vbe = 0,7 V, Vcesat = 0,2 V, β min = 100.
1. Calcule le courant de collecteur à saturation Icsat.
2. Calcule le courant de base minimal, puis la résistance de base Rb avec un coefficient de sécurité de 2. Choisis une valeur normalisée et vérifie la saturation.
3. Calcule la puissance dissipée par le transistor saturé.
4. Quel composant faut-il placer aux bornes de la bobine du relais ? Comment le brancher et pourquoi ?
**Partie C — Signalisation et programme (2 points)**
1. Une LED témoin (Vf = 2 V, I = 10 mA) est branchée sur la sortie 5 V à travers une résistance. Calcule cette résistance et choisis une valeur normalisée.
2. Un capteur de niveau est relié à la broche 2 : il donne LOW quand le réservoir est presque vide. Écris l'instruction de la boucle loop() qui met la pompe en marche (broche 8 à HIGH) quand le niveau est bas et l'arrête sinon.
## Corrigé
**Partie A**
1. m = U2 / U1 = 9 / 230 ≈ 0,039 (transformateur abaisseur).
2. U2max = 9 × √2 ≈ 12,73 V. Deux diodes conduisent en série à chaque alternance : Umax ≈ 12,73 − 2 × 0,7 ≈ 11,3 V.
3. Le pont redresse les deux alternances : on obtient deux « bosses » par période du secteur, donc f = 2 × 50 = 100 Hz.
4. ΔU ≈ I / (f × C) donc C ≥ I / (f × ΔU) = 0,5 / (100 × 2) = 2,5 × 10⁻³ F = 2 500 µF. La plus petite valeur normalisée qui convient est C = 3 300 µF (2 200 µF serait insuffisant).
5. ΔU ≈ 0,5 / (100 × 0,0033) ≈ 1,52 V ≤ 2 V. Umin ≈ 11,3 − 1,5 ≈ 9,8 V ≥ 7 V : la régulation est assurée.
6. La tension de service doit dépasser Umax ≈ 11,3 V : on choisit 16 V (10 V serait insuffisant ; 25 V convient aussi mais est plus encombrant et plus cher).
7. Une diode bloquée supporte environ la tension maximale du secondaire, soit environ 12,7 V : on prend une diode d'au moins 50 V (par exemple 1N4001 ou 1N4007, 1 A). Chaque diode conduit une alternance sur deux : courant moyen 0,5 / 2 = 0,25 A.
8. Ue moyenne ≈ Umax − ΔU / 2 ≈ 11,3 − 0,76 ≈ 10,6 V. P ≈ (Ue moyenne − Us) × I = (10,6 − 5) × 0,5 ≈ 2,8 W. C'est trop pour un boîtier TO-220 nu : il faut un dissipateur thermique.
**Partie B**
1. Icsat = (Vcc − Vcesat) / R = (12 − 0,2) / 150 ≈ 0,0787 A ≈ 78,7 mA.
2. Ib min = Icsat / β = 78,7 / 100 ≈ 0,787 mA ; avec un coefficient 2 : Ib = 1,57 mA. Rb = (5 − 0,7) / 0,00157 ≈ 2 740 Ω. On choisit la valeur normalisée inférieure 2,7 kΩ : Ib = 4,3 / 2 700 ≈ 1,59 mA ≥ 0,787 mA, le transistor est bien saturé.
3. P = Vcesat × Icsat = 0,2 × 0,0787 ≈ 0,016 W ≈ 16 mW (faible : pas de dissipateur).
4. Une diode de roue libre, branchée en inverse aux bornes de la bobine (cathode côté + 12 V). À l'ouverture du transistor, la bobine crée une surtension qui détruirait le transistor ; la diode permet au courant de la bobine de s'éteindre progressivement.
**Partie C**
1. R = (5 − 2) / 0,010 = 300 Ω ; on prend la valeur normalisée supérieure 330 Ω (I = 3 / 330 ≈ 9,1 mA, LED légèrement moins brillante mais protégée).
2. if (digitalRead(2) == LOW) digitalWrite(8, HIGH); else digitalWrite(8, LOW);
**Barème indicatif** : Partie A 12 points (1,5 point par question) ; Partie B 6 points ; Partie C 2 points.

# Sujet type 2 — Chaîne de mesure et d'alarme de température
Le laboratoire du CHU de Cocody surveille la température d'une étuve. Un capteur LM35 (10 mV par °C) attaque un amplificateur, dont la sortie est lue par le CAN d'un microcontrôleur et comparée à un seuil d'alarme. Une horloge à quartz permet d'horodater les mesures.
**Partie A — Amplification et conversion (9 points)**
L'amplificateur est un AOP idéal monté en non inverseur, avec R1 = 1 kΩ (entre l'entrée − et la masse) et R2 = 9 kΩ (entre la sortie et l'entrée −). Il est alimenté en ± 15 V ; ses tensions de saturation sont ± 14 V.
1. Rappelle les deux hypothèses de l'AOP idéal en régime linéaire.
2. Établis l'expression de Vs en fonction de Ve, puis calcule le gain.
3. Calcule la tension délivrée par le capteur et la tension Vs pour θ = 37 °C.
4. Le CAN du microcontrôleur a 10 bits et une pleine échelle de 5 V. Calcule son quantum q.
5. Quelle est la température maximale mesurable sans dépasser la pleine échelle du CAN ?
6. Calcule le nombre N délivré par le CAN pour θ = 37 °C et écris-le en binaire sur 10 bits.
7. À quelle variation de température correspond un quantum ?
8. Le microcontrôleur doit allumer une alarme (broche 8) au-delà de 40 °C. Calcule la valeur seuil de N et écris l'instruction correspondante.
**Partie B — Comparateur d'alarme analogique (4 points)**
En secours, un second AOP fonctionne en comparateur : V+ reçoit Vs, V− reçoit une tension de référence Vref obtenue par un pont diviseur R3 (entre + 15 V et V−) et R4 (entre V− et la masse), avec R3 + R4 = 15 kΩ.
1. Pourquoi cet AOP ne fonctionne-t-il pas en régime linéaire ?
2. Quelle valeur de Vref donne un seuil d'alarme à 40 °C ? Calcule R3 et R4.
3. Donne la tension de sortie du comparateur pour θ = 37 °C et pour θ = 42 °C.
**Partie C — Logique de décision (3 points)**
Pour éviter les fausses alarmes, trois capteurs a, b et c (1 = température excessive) sont utilisés : l'alarme S s'active si au moins deux capteurs sont à 1.
1. Écris la table de vérité de S.
2. Donne l'équation de S sous forme simplifiée (tableau de Karnaugh ou algèbre de Boole).
3. Écris S en n'utilisant que des opérateurs NAND.
**Partie D — Horloge et comptage (4 points)**
Un quartz délivre un signal de 32 768 Hz qui attaque des bascules JK montées en cascade (J = K = 1).
1. Combien de bascules faut-il pour obtenir un signal de 1 Hz ?
2. Quelle est la fréquence à la sortie de la 4e bascule ?
3. Les secondes sont comptées par un compteur modulo 10 asynchrone. Combien de bascules faut-il ? Donne l'équation de la remise à zéro (RAZ active au niveau haut).
4. Le compteur part de 0000. Quel est l'état Q3 Q2 Q1 Q0 après 7 impulsions ?
## Corrigé
**Partie A**
1. Courants d'entrée nuls (i+ = i− = 0) et V+ = V− (contre-réaction sur l'entrée −).
2. V+ = Ve. Les courants d'entrée étant nuls, R1 et R2 forment un diviseur : V− = Vs × R1 / (R1 + R2). Comme V+ = V− : Vs = (1 + R2 / R1) × Ve. Gain : 1 + 9 / 1 = 10.
3. Ve = 37 × 10 mV = 0,37 V ; Vs = 10 × 0,37 = 3,7 V, compris entre − 14 V et + 14 V : régime linéaire.
4. q = Upe / 2ⁿ = 5 / 1 024 ≈ 4,88 × 10⁻³ V = 4,88 mV.
5. Vs = 5 V correspond à Ve = 0,5 V, soit θ max = 0,5 / 0,010 = 50 °C.
6. N = partie entière de (3,7 / 0,004883) = partie entière de 757,8 = 757. 757 = 512 + 128 + 64 + 32 + 16 + 4 + 1, soit N = 1011110101 (contrôle : 512 + 128 + 64 + 32 + 16 + 4 + 1 = 757).
7. Un quantum de 4,88 mV en sortie correspond à 4,88 / 10 = 0,488 mV à la sortie du capteur, soit 0,488 / 10 ≈ 0,049 °C.
8. 40 °C donne Ve = 0,40 V et Vs = 4 V ; N = partie entière de (4 / 0,004883) = partie entière de 819,2 = 819. Instruction : if (analogRead(A0) > 819) digitalWrite(8, HIGH); else digitalWrite(8, LOW);
**Partie B**
1. Il n'y a pas de contre-réaction : la sortie bascule entre + Vsat et − Vsat selon le signe de V+ − V−.
2. À 40 °C, Vs = 4 V : il faut Vref = 4 V. Vref = 15 × R4 / (R3 + R4) = 15 × R4 / 15 kΩ = 4 V donne R4 = 4 kΩ et R3 = 15 − 4 = 11 kΩ.
3. 37 °C : V+ = 3,7 V < V− = 4 V, donc Vs = − 14 V (pas d'alarme). 42 °C : V+ = 4,2 V > 4 V, donc Vs = + 14 V (alarme).
**Partie C**
1. Table (a b c → S) : 000 → 0 ; 001 → 0 ; 010 → 0 ; 011 → 1 ; 100 → 0 ; 101 → 1 ; 110 → 1 ; 111 → 1.
2. S = /a · b · c + a · /b · c + a · b · /c + a · b · c. Dans le tableau de Karnaugh, on forme trois groupes de deux cases, chacun contenant la case 111 : S = a · b + a · c + b · c.
3. Par le théorème de De Morgan : S = /( /(a · b) · /(a · c) · /(b · c) ). On utilise trois NAND à deux entrées et une NAND à trois entrées.
**Partie D**
1. Chaque bascule divise la fréquence par 2 : 32 768 = 2¹⁵, il faut 15 bascules (32 768 / 2¹⁵ = 1 Hz).
2. 32 768 / 2⁴ = 32 768 / 16 = 2 048 Hz.
3. 2³ = 8 < 10 ≤ 2⁴ = 16 : 4 bascules. L'état 10 s'écrit 1010 : RAZ = Q3 · Q1 (porte ET). Le compteur parcourt 0 à 9.
4. 7 = 4 + 2 + 1 : Q3 Q2 Q1 Q0 = 0111.
**Barème indicatif** : Partie A 9 points ; Partie B 4 points ; Partie C 3 points ; Partie D 4 points.

# QCM
? Montage inverseur : R1 = 10 kΩ, R2 = 100 kΩ, Ve = 0,3 V. Que vaut Vs ?
+ − 3 V
- 3 V
- − 0,03 V
! Vs = −(R2 / R1) × Ve = −10 × 0,3 = − 3 V.
? Montage non inverseur : R1 = 10 kΩ, R2 = 22 kΩ, Ve = 0,5 V. Que vaut Vs ?
+ 1,6 V
- 1,1 V
- − 1,1 V
! Vs = (1 + 22 / 10) × 0,5 = 3,2 × 0,5 = 1,6 V.
? Un AOP en comparateur reçoit V+ = 2 V et V− = 3 V. Sa sortie vaut :
+ − Vsat
- + Vsat
- − 1 V
! V+ < V− : la sortie sature au niveau bas.
? Combien de bascules faut-il au minimum pour un compteur modulo 12 ?
+ 4
- 3
- 12
! 2³ = 8 < 12 ≤ 2⁴ = 16.
? Pour un compteur modulo 12 (RAZ active au niveau haut), l'équation de remise à zéro est :
+ RAZ = Q3 · Q2
- RAZ = Q3 · Q1
- RAZ = Q2 · Q1
! 12 s'écrit 1100 : on détecte Q3 = 1 et Q2 = 1.
? Un compteur 3 bits reçoit une horloge de 8 kHz. La fréquence de Q2 vaut :
+ 1 kHz
- 4 kHz
- 2,67 kHz
! Q2 est la 3e bascule : 8 000 / 2³ = 1 000 Hz.
? Quel est le quantum d'un CAN 8 bits de pleine échelle 5 V ?
+ Environ 19,5 mV
- Environ 4,9 mV
- 625 mV
! q = 5 / 2⁸ = 5 / 256 ≈ 0,0195 V.
? Un signal contient des fréquences jusqu'à 4 kHz. Fréquence d'échantillonnage minimale ?
+ 8 kHz
- 4 kHz
- 2 kHz
! Théorème de Shannon : fe ≥ 2 × fmax.
? Dans un microcontrôleur, quelle mémoire perd son contenu à la coupure de l'alimentation ?
+ La RAM
- La mémoire Flash
- L'EEPROM
! La RAM est volatile ; la Flash et l'EEPROM conservent les données hors tension.
? Redressement double alternance : I = 0,2 A et C = 1 000 µF. L'ondulation vaut environ :
+ 2 V
- 4 V
- 0,2 V
! ΔU ≈ I / (f × C) = 0,2 / (100 × 0,001) = 2 V.
? Quelle tension d'entrée minimale faut-il environ à un régulateur 7805 ?
+ 7 V
- 5 V
- 12 V
! Il faut environ 2 V de plus que la tension de sortie : 5 + 2 = 7 V.
? Simplifie S = a · b + a · /b + /a · /b.
+ S = a + /b
- S = a · b
- S = 1
! a · b + a · /b = a ; puis a + /a · /b = a + /b.
