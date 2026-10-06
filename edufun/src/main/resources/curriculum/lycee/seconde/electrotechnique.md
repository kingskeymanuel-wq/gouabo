---
levels: Seconde E, Seconde F3
subject: Électrotechnique
---
# Circuits en courant continu

## 2N-ET-01 | Grandeurs électriques et loi d'Ohm | 55 min
Objectif : Appliquer la loi d'Ohm et calculer la résistance d'un conducteur.
### Situation d'apprentissage
Un électricien installe une pompe dans une ferme à 50 m du tableau électrique, près de Dabou. Le propriétaire lui demande pourquoi il refuse d'utiliser un câble trop fin : « Le courant passe quand même ! »
### Je retiens
> L'intensité I (en ampères, A) mesure le débit de charges ; elle se mesure avec un ampèremètre branché en série.
> La tension U (en volts, V) est une différence de potentiel ; elle se mesure avec un voltmètre branché en parallèle (dérivation).
> La résistance R (en ohms, Ω) caractérise l'opposition d'un conducteur au passage du courant.
= Loi d'Ohm : U = R × I
= Résistance d'un fil : R = ρ × L / S (ρ en Ω·m, L en m, S en m²)
= Cuivre : ρ ≈ 1,7 × 10⁻⁸ Ω·m ; aluminium : ρ ≈ 2,8 × 10⁻⁸ Ω·m
= Exemple : câble cuivre 2,5 mm², 50 m aller et 50 m retour (L = 100 m) : R = 1,7 × 10⁻⁸ × 100 / (2,5 × 10⁻⁶) = 0,68 Ω
- Plus le fil est long et fin, plus sa résistance est grande et plus il chauffe.
- Rappel : 1 mm² = 10⁻⁶ m².
### Je vérifie
? Comment branche-t-on un voltmètre ?
+ En parallèle sur le dipôle
- En série avec le dipôle
- À la place du dipôle
! Le voltmètre mesure une différence de potentiel entre deux points : il se place en dérivation.
? Une résistance de 47 Ω est traversée par un courant de 0,2 A. Tension à ses bornes ?
+ 9,4 V
- 235 V
- 47,2 V
! U = R × I = 47 × 0,2 = 9,4 V.
### Je m'exerce
1. Une pompe absorbe 10 A à travers le câble de 0,68 Ω de l'exemple. Calcule la chute de tension dans le câble.
2. Calcule la résistance du même câble (L = 100 m) en 1,5 mm². Conclus.
### Corrigé
1. ΔU = R × I = 0,68 × 10 = 6,8 V perdus dans le câble.
2. R = 1,7 × 10⁻⁸ × 100 / (1,5 × 10⁻⁶) ≈ 1,13 Ω ; la chute de tension serait 11,3 V à 10 A : le câble fin chauffe davantage et la pompe reçoit une tension plus faible.

## 2N-ET-02 | Lois de Kirchhoff et associations de résistances | 60 min
Objectif : Utiliser la loi des nœuds, la loi des mailles et calculer une résistance équivalente.
### Situation d'apprentissage
À l'atelier d'électrotechnique du lycée technique de Bouaké, les élèves doivent réparer une guirlande et une plaque chauffante comportant plusieurs résistances. Ils doivent prévoir les courants avant de mettre sous tension.
### Je retiens
> Loi des nœuds : la somme des intensités qui arrivent à un nœud est égale à la somme de celles qui en partent.
> Loi des mailles : dans une maille, la somme algébrique des tensions est nulle.
= Association en série : Req = R1 + R2 + R3…
= Association en parallèle : 1 / Req = 1 / R1 + 1 / R2 + … ; pour deux résistances : Req = R1 × R2 / (R1 + R2)
= Diviseur de tension (R1 et R2 en série sous U) : U2 = U × R2 / (R1 + R2)
= Exemple : R1 = 60 Ω et R2 = 30 Ω en parallèle donnent Req = 1 800 / 90 = 20 Ω
- En série, le même courant traverse toutes les résistances ; en parallèle, elles ont toutes la même tension.
- Req en parallèle est toujours plus petite que la plus petite des résistances.
### Je vérifie
? Dans une association en parallèle, quelle grandeur est commune à toutes les résistances ?
+ La tension
- L'intensité
- La puissance
! Les résistances en parallèle sont branchées entre les deux mêmes points.
? Trois résistances de 10 Ω, 22 Ω et 68 Ω sont en série. Résistance équivalente ?
+ 100 Ω
- 6,5 Ω
- 33,3 Ω
! En série, on additionne : 10 + 22 + 68 = 100 Ω.
### Je m'exerce
1. Deux résistances de 40 Ω et 120 Ω sont en série sous 24 V. Calcule le courant et la tension aux bornes de chacune.
2. Les mêmes résistances sont en parallèle sous 24 V. Calcule Req, le courant dans chaque branche et le courant total.
### Corrigé
1. Req = 160 Ω ; I = 24 / 160 = 0,15 A ; U1 = 40 × 0,15 = 6 V ; U2 = 120 × 0,15 = 18 V ; vérification : 6 + 18 = 24 V.
2. Req = 40 × 120 / 160 = 30 Ω ; I1 = 24 / 40 = 0,6 A ; I2 = 24 / 120 = 0,2 A ; I = 0,8 A (= 24 / 30, loi des nœuds vérifiée).

## 2N-ET-03 | Puissance, énergie et effet Joule | 55 min
Objectif : Calculer la puissance et l'énergie consommées par un appareil et estimer leur coût.
### Situation d'apprentissage
Une famille d'Abobo trouve sa facture d'électricité de la CIE trop élevée. Le fils, élève en Seconde F3, décide de calculer la consommation de chaque appareil de la maison.
### Je retiens
= Puissance : P = U × I (en watts, W)
= Pour une résistance : P = R × I² = U² / R (effet Joule : l'énergie est transformée en chaleur)
= Énergie : W = P × t ; en joules si P en W et t en s ; en kilowattheures (kWh) si P en kW et t en h
= 1 kWh = 3,6 × 10⁶ J
= Exemple : fer à repasser de 1 000 W utilisé 2 h par jour pendant 30 jours : W = 1 × 2 × 30 = 60 kWh
> Le compteur de la CIE mesure l'énergie en kWh ; le coût est égal à l'énergie multipliée par le prix du kWh (fixé par la tarification en vigueur).
- La puissance nominale d'un appareil est indiquée sur sa plaque signalétique.
- Les appareils chauffants (fer, chauffe-eau, plaque) sont les plus gourmands.
### Je vérifie
? Que mesure le compteur d'électricité d'un logement ?
+ L'énergie consommée en kWh
- La puissance en W
- L'intensité en A
! La facture porte sur l'énergie, produit de la puissance par la durée.
? Une ampoule LED de 10 W reste allumée 10 h. Énergie consommée ?
+ 0,1 kWh
- 100 kWh
- 1 kWh
! W = 0,010 kW × 10 h = 0,1 kWh.
### Je m'exerce
1. Un réfrigérateur de 150 W fonctionne en moyenne 10 h par jour. Calcule son énergie consommée en 30 jours.
2. En supposant un prix de 80 F CFA le kWh (valeur d'exercice), calcule le coût mensuel du réfrigérateur et celui du fer à repasser de l'exemple.
### Corrigé
1. W = 0,150 × 10 × 30 = 45 kWh.
2. Réfrigérateur : 45 × 80 = 3 600 F CFA. Fer à repasser : 60 × 80 = 4 800 F CFA.

# Installation domestique et sécurité

## 2N-ET-04 | Schémas d'une installation domestique | 60 min
Objectif : Lire et réaliser les schémas de commande d'éclairage et de prise de courant d'un logement.
### Situation d'apprentissage
Un entrepreneur de Yopougon embauche deux élèves de F3 en stage pour câbler une villa neuve. Le chef de chantier leur remet le plan : un simple allumage dans les chambres, un va-et-vient dans le couloir et des prises dans le salon.
### Je retiens
> L'installation est conçue selon la norme NF C 15-100, utilisée comme référence en Côte d'Ivoire.
> Conducteurs : protection (terre) en vert-jaune obligatoirement ; neutre en bleu clair ; phase dans une autre couleur (rouge, marron, noir…).
> L'interrupteur coupe toujours la phase, jamais le neutre.
= Simple allumage : un interrupteur commande un ou plusieurs points lumineux depuis un seul endroit
= Va-et-vient : deux interrupteurs va-et-vient reliés par deux navettes commandent une lampe depuis deux endroits
= Prise de courant 2P+T : phase, neutre et terre
= Circuit éclairage : conducteurs de 1,5 mm², disjoncteur 16 A au plus, 8 points lumineux au maximum
= Circuit prises 16 A : conducteurs de 2,5 mm² protégés par disjoncteur 20 A
- Chaque circuit part du tableau de répartition et a sa propre protection.
- Schéma développé : montre le fonctionnement ; schéma architectural (unifilaire) : situe les appareils sur le plan.
### Je vérifie
? Quel conducteur l'interrupteur doit-il couper ?
+ La phase
- Le neutre
- La terre
! Coupure de la phase : la lampe éteinte n'est plus sous tension, ce qui protège lors d'un changement d'ampoule.
? Quelle section utiliser pour un circuit de prises protégé par un disjoncteur 20 A ?
+ 2,5 mm²
- 1,5 mm²
- 0,75 mm²
! La NF C 15-100 associe 2,5 mm² de cuivre à une protection de 20 A pour les prises 16 A.
### Je m'exerce
1. Décris le câblage d'un va-et-vient : que relie-t-on à chaque interrupteur ?
2. Un client veut 12 points lumineux sur un même circuit d'éclairage. Que lui proposes-tu ?
### Corrigé
1. La phase arrive sur la borne commune du premier interrupteur ; deux navettes relient les bornes de sortie des deux interrupteurs ; la borne commune du second interrupteur est reliée à la lampe ; l'autre borne de la lampe est reliée au neutre. Chaque interrupteur change de navette, ce qui allume ou éteint la lampe depuis les deux endroits.
2. La norme limite un circuit d'éclairage à 8 points lumineux : il faut créer deux circuits (par exemple 6 et 6), chacun protégé par son propre disjoncteur.

## 2N-ET-05 | Dangers du courant et protection des personnes | 55 min
Objectif : Expliquer les dangers du courant électrique et le rôle de la terre et du dispositif différentiel.
### Situation d'apprentissage
Dans un quartier de Bingerville, une habitante a reçu une décharge en touchant la carcasse de sa machine à laver. L'électricien constate que la prise n'est pas reliée à la terre et que le tableau n'a pas de dispositif différentiel 30 mA.
### Je retiens
> Le danger dépend de l'intensité qui traverse le corps, de la durée du passage et du trajet (main-main, main-pieds).
= Ordres de grandeur en alternatif 50 Hz : 0,5 mA seuil de perception ; environ 10 mA contraction musculaire (impossible de lâcher) ; à partir d'environ 30 mA, risque de paralysie respiratoire ; au-delà, risque de fibrillation cardiaque
= Intensité dans le corps : I = U / R corps ; exemple avec U = 230 V et R corps = 1 000 Ω : I = 0,23 A = 230 mA, mortel
= Tension limite conventionnelle de sécurité UL : 50 V en alternatif en local sec, 25 V en local mouillé
> Contact direct : on touche une partie normalement sous tension (fil dénudé). Contact indirect : on touche une masse mise accidentellement sous tension (carcasse d'appareil).
> Protection contre les contacts indirects : mise à la terre des masses associée à un dispositif différentiel (DDR) qui coupe le circuit dès qu'un courant de fuite dépasse sa sensibilité.
- Le DDR 30 mA (haute sensibilité) est obligatoire sur les circuits terminaux d'un logement.
- Avant toute intervention : couper, condamner le disjoncteur, vérifier l'absence de tension.
### Je vérifie
? Quel est le rôle d'un dispositif différentiel 30 mA ?
+ Couper le circuit si un courant de fuite dépasse 30 mA
- Limiter la tension à 30 V
- Protéger les câbles contre les courts-circuits seulement
! Il compare le courant aller et retour ; une différence révèle une fuite, souvent à travers une personne.
? Une personne de résistance 2 000 Ω touche un conducteur à 230 V, l'autre main sur une masse à la terre. Courant traversant le corps ?
+ 115 mA
- 0,115 mA
- 460 mA
! I = U / R = 230 / 2 000 = 0,115 A = 115 mA, courant dangereux.
### Je m'exerce
1. Calcule le courant traversant une personne de 1 500 Ω soumise à la tension de sécurité de 50 V.
2. Explique pourquoi la machine à laver de la situation est dangereuse et ce que l'électricien doit faire.
### Corrigé
1. I = 50 / 1 500 ≈ 0,033 A, soit environ 33 mA : c'est pour cela qu'on admet que 50 V est la limite en local sec (au-delà, le courant devient dangereux).
2. Sans terre, un défaut d'isolement met la carcasse sous tension et le courant passe par la personne ; sans différentiel, rien ne coupe. Il faut relier la prise au conducteur de protection vert-jaune raccordé à la prise de terre, et installer un interrupteur ou disjoncteur différentiel 30 mA en tête des circuits.
