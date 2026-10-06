---
levels: Terminale F2
subject: Électronique
---
# Électronique analogique

## TN-EL-01 | L'amplificateur opérationnel | 60 min
Objectif : Calculer la tension de sortie des montages de base de l'amplificateur opérationnel.
### Situation d'apprentissage
Une station de mesure installée par la SODECI au barrage d'adduction d'eau fournit un signal de capteur de 0,5 V seulement. Le technicien doit l'amplifier pour qu'il soit lisible par la carte d'acquisition.
### Je retiens
> AOP idéal : courants d'entrée nuls (i+ = i− = 0), gain très grand.
> En régime linéaire (contre-réaction sur l'entrée −) : V+ = V−.
> La sortie ne peut pas dépasser les tensions de saturation : environ ± (Vcc − 1 V) selon le modèle.
= Inverseur : Vs = −(R2 / R1) × Ve
= Non inverseur : Vs = (1 + R2 / R1) × Ve
= Suiveur : Vs = Ve (adaptation d'impédance)
= Sommateur inverseur (résistances égales R) : Vs = −(V1 + V2)
= Comparateur (sans contre-réaction) : Vs = +Vsat si V+ > V−, Vs = −Vsat si V+ < V−
- Toujours vérifier que la tension calculée reste entre −Vsat et +Vsat ; sinon, la sortie est saturée.
### Je vérifie
? Dans un AOP idéal en régime linéaire, on a :
+ V+ = V− et i+ = i− = 0
- V+ = 0 et Vs = 0
- i+ = i− = Vs / R
! Ce sont les deux hypothèses de base pour tous les calculs.
? Montage inverseur : R1 = 10 kΩ, R2 = 47 kΩ, Ve = 0,2 V. Que vaut Vs ?
+ −0,94 V
- 0,94 V
- −4,7 V
! Vs = −(47 / 10) × 0,2 = −4,7 × 0,2 = −0,94 V.
### Je m'exerce
1. Montage non inverseur : R1 = 1 kΩ, R2 = 9 kΩ, Ve = 0,5 V, alimentation ± 15 V (Vsat ≈ 14 V). Calcule Vs.
2. Même montage avec Ve = 2 V : que vaut Vs ?
### Corrigé
1. Vs = (1 + 9 / 1) × 0,5 = 10 × 0,5 = 5 V, valeur comprise entre −14 V et +14 V : régime linéaire.
2. Vs théorique = 10 × 2 = 20 V > 14 V : l'AOP sature, Vs ≈ +14 V.

# Électronique numérique

## TN-EL-02 | Les compteurs et les diviseurs de fréquence | 60 min
Objectif : Concevoir un compteur modulo N à bascules et calculer les fréquences de sortie.
### Situation d'apprentissage
Une entreprise de conditionnement de jus à Yopougon veut compter les bouteilles qui passent sur un tapis et déclencher l'emballage par paquets de 10. Il faut un compteur décimal.
### Je retiens
> Un compteur est formé de bascules ; n bascules donnent au maximum 2ⁿ états (de 0 à 2ⁿ − 1).
> Compteur asynchrone : l'horloge de chaque bascule est la sortie de la précédente ; compteur synchrone : toutes les bascules reçoivent la même horloge (plus rapide, pas de décalage).
> Compteur modulo N (N < 2ⁿ) : on force la remise à zéro dès que l'état N apparaît.
= Nombre de bascules : plus petit n tel que 2ⁿ ≥ N
= Exemple : modulo 10, 4 bascules (2⁴ = 16 ≥ 10) ; l'état 10 = 1010 (Q3 Q2 Q1 Q0) commande la remise à zéro par RAZ = Q3 · Q1
= Fréquence en sortie de la bascule de rang k (Q0 au rang 1) : f / 2ᵏ
- Si l'entrée de remise à zéro est active au niveau bas, on utilise une porte NAND : RAZ = /(Q3 · Q1).
### Je vérifie
? Combien de bascules faut-il au minimum pour un compteur modulo 60 ?
+ 6
- 5
- 60
! 2⁵ = 32 < 60 et 2⁶ = 64 ≥ 60 : il faut 6 bascules.
? Un compteur 4 bits reçoit une horloge de 1 kHz. Quelle est la fréquence de Q3 ?
+ 62,5 Hz
- 250 Hz
- 4 kHz
! Q3 est la 4e bascule : 1 000 / 2⁴ = 1 000 / 16 = 62,5 Hz.
### Je m'exerce
1. Un compteur 4 bits part de 0000. Quel est son état après 13 impulsions ?
2. Quelle porte et quelles sorties utiliser pour réaliser un compteur modulo 6 (RAZ active au niveau haut) ?
### Corrigé
1. 13 = 8 + 4 + 1, soit Q3 Q2 Q1 Q0 = 1101.
2. 3 bascules suffisent (2³ = 8 ≥ 6). L'état 6 vaut 110 : on fait RAZ = Q2 · Q1 avec une porte ET ; le compteur parcourt 0 à 5.

## TN-EL-03 | La conversion analogique-numérique | 55 min
Objectif : Calculer le quantum et le nombre délivré par un convertisseur analogique-numérique.
### Situation d'apprentissage
Le laboratoire d'un lycée technique de Yamoussoukro veut afficher la température d'une salle sur un écran. Le capteur LM35 fournit une tension analogique que le microcontrôleur doit transformer en nombre.
### Je retiens
> Un CAN (convertisseur analogique-numérique) transforme une tension en nombre binaire ; un CNA fait l'inverse.
= Quantum (résolution) : q = Upe / 2ⁿ (Upe : tension pleine échelle, n : nombre de bits)
= Nombre délivré : N = partie entière de (Ue / q)
= CNA : Us = N × q
= Exemple : CAN 8 bits, Upe = 5 V : q = 5 / 256 ≈ 19,5 mV ; Ue = 2 V donne N = 2 / 0,01953 ≈ 102,4, soit N = 102 = 01100110
= Théorème de Shannon : fréquence d'échantillonnage fe ≥ 2 × fmax du signal
- Plus le nombre de bits est grand, plus le quantum est petit et la mesure précise.
- Le capteur LM35 délivre 10 mV par degré Celsius.
### Je vérifie
? Combien de niveaux possède un CAN de 10 bits ?
+ 1 024
- 1 000
- 512
! 2¹⁰ = 1 024 niveaux.
? Un signal audio contient des fréquences jusqu'à 20 kHz. Fréquence d'échantillonnage minimale ?
+ 40 kHz
- 20 kHz
- 10 kHz
! Shannon : fe ≥ 2 × 20 kHz = 40 kHz.
### Je m'exerce
1. Calcule le quantum d'un CAN 10 bits de pleine échelle 5 V.
2. Ce CAN lit N = 62 sur un capteur LM35. Calcule la tension et la température correspondantes.
### Corrigé
1. q = 5 / 1 024 ≈ 0,00488 V soit 4,88 mV.
2. U = 62 × 4,883 mV ≈ 302,7 mV ; θ = 302,7 / 10 ≈ 30,3 °C.

## TN-EL-04 | Les microcontrôleurs | 60 min
Objectif : Décrire l'architecture d'un microcontrôleur et écrire un programme simple de commande.
### Situation d'apprentissage
Une PME d'Abidjan veut automatiser la ventilation d'une salle de serveurs : le ventilateur doit démarrer au-delà de 30 °C. On confie le projet aux élèves de Terminale F2, avec une carte à microcontrôleur ATmega328P (type Arduino Uno).
### Je retiens
> Un microcontrôleur réunit sur une seule puce : unité centrale (CPU), mémoire programme (Flash), mémoire vive (RAM), mémoire EEPROM, ports d'entrées-sorties, temporisateurs (timers), CAN et liaisons série (UART).
> ATmega328P : horloge 16 MHz sur la carte Arduino Uno, 32 Ko de Flash, 2 Ko de RAM, 1 Ko d'EEPROM, CAN 10 bits.
> Une broche de sortie fournit au plus quelques dizaines de mA (20 mA recommandés) : pour un moteur ou un relais, on passe par un transistor.
= Période d'horloge : T = 1 / f = 1 / 16 000 000 = 62,5 ns
= Structure d'un programme : void setup() pour les réglages, exécuté une fois ; void loop() exécuté en boucle
= pinMode(8, OUTPUT);
= int n = analogRead(A0);
= if (n > 61) digitalWrite(8, HIGH); else digitalWrite(8, LOW);
- Démarche : cahier des charges, choix des entrées-sorties, algorigramme, programme, essais.
### Je vérifie
? Quelle mémoire contient le programme d'un microcontrôleur et le conserve hors tension ?
+ La mémoire Flash
- La RAM
- Le registre d'horloge
! La Flash est non volatile ; la RAM s'efface à la coupure.
? Une LED (Vf = 2 V, I = 15 mA) est reliée à une sortie 5 V. Résistance normalisée à choisir ?
+ 220 Ω
- 22 Ω
- 2,2 kΩ
! R = (5 − 2) / 0,015 = 200 Ω ; on prend la valeur normalisée supérieure 220 Ω.
### Je m'exerce
1. Avec un LM35 sur A0 (CAN 10 bits, 5 V), calcule le nombre N correspondant au seuil de 30 °C.
2. Écris la boucle d'un programme qui fait clignoter une LED sur la broche 13 à la fréquence de 1 Hz.
### Corrigé
1. U = 30 × 10 mV = 0,30 V ; N = 0,30 / 0,004883 ≈ 61,4, soit N = 61 : le ventilateur démarre pour n > 61.
2. Période 1 s : allumée 0,5 s puis éteinte 0,5 s. Dans loop() : digitalWrite(13, HIGH); delay(500); digitalWrite(13, LOW); delay(500);

## TN-EL-05 | Méthode pour l'épreuve du BAC : étude d'une alimentation stabilisée | 60 min
Objectif : Appliquer une méthode rigoureuse pour étudier une alimentation stabilisée complète au BAC.
### Situation d'apprentissage
Le sujet de BAC blanc du lycée technique d'Abidjan demande d'étudier l'alimentation 5 V / 1 A d'une carte à microcontrôleur, du transformateur jusqu'au régulateur 7805.
### Je retiens
> Méthode : 1) lire tout le sujet et souligner les données ; 2) tracer le schéma fonctionnel ; 3) traiter chaque bloc dans l'ordre ; 4) écrire la formule, puis l'application numérique, puis le résultat avec son unité ; 5) vérifier l'ordre de grandeur ; 6) conclure par une phrase.
= Schéma fonctionnel : transformateur, redressement (pont), filtrage (condensateur), régulation (7805), charge
= Régulateur 78xx : tension d'entrée minimale ≈ Us + 2 V (7805 : Ue ≥ 7 V)
= Puissance dissipée par le régulateur : P ≈ (Ue moyenne − Us) × I
= Exemple : transformateur 230 V / 9 V : Umax ≈ 9 × √2 − 1,4 ≈ 11,3 V ; C = 4 700 µF, I = 1 A : ΔU ≈ 1 / (100 × 0,0047) ≈ 2,1 V ; Umin ≈ 9,2 V > 7 V, régulation assurée
= Ue moyenne ≈ 11,3 − 2,1 / 2 ≈ 10,3 V ; P ≈ (10,3 − 5) × 1 ≈ 5,3 W : un dissipateur thermique est indispensable
- Toujours vérifier que la tension minimale après filtrage reste supérieure à la tension minimale d'entrée du régulateur.
- Ne jamais donner un résultat sans unité ; arrondir raisonnablement (2 ou 3 chiffres significatifs).
### Je vérifie
? Quelle est la première étape d'une bonne méthode au BAC ?
+ Lire entièrement le sujet et relever les données
- Commencer directement les calculs de la dernière question
- Recopier le cours
! Une lecture complète évite les contresens et permet de repérer les liens entre les parties.
? Un régulateur 7812 alimente 0,5 A avec une tension d'entrée moyenne de 18 V. Puissance dissipée ?
+ 3 W
- 9 W
- 6 W
! P = (18 − 12) × 0,5 = 3 W.
### Je m'exerce
1. Alimentation 12 V / 0,5 A avec 7812 : transformateur 15 V efficaces, pont de diodes, C = 2 200 µF. Calcule Umax, ΔU et Umin, et conclus.
2. Calcule la puissance dissipée par le régulateur.
### Corrigé
1. Umax ≈ 15 × √2 − 1,4 ≈ 21,2 − 1,4 ≈ 19,8 V ; ΔU ≈ 0,5 / (100 × 0,0022) ≈ 2,3 V ; Umin ≈ 17,5 V ≥ 14 V : la régulation est assurée.
2. Ue moyenne ≈ 19,8 − 2,3 / 2 ≈ 18,7 V ; P ≈ (18,7 − 12) × 0,5 ≈ 3,3 W : prévoir un dissipateur.
