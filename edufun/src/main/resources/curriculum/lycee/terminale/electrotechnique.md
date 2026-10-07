---
levels: Terminale E, Terminale F3
subject: Électrotechnique
---
# Machines électriques

## TN-ET-01 | Le transformateur monophasé | 60 min
Objectif : Calculer le rapport de transformation, les courants et le rendement d'un transformateur.
### Situation d'apprentissage
Un atelier de maintenance d'Abidjan doit alimenter en 24 V les circuits de commande d'une machine à partir du réseau 230 V. Le technicien choisit un transformateur de 100 VA et vérifie le nombre de spires de son secondaire.
### Je retiens
> Le transformateur est une machine statique qui modifie la valeur d'une tension alternative sans changer sa fréquence. Il ne fonctionne pas en continu.
= Rapport de transformation : m = U2 / U1 = N2 / N1 (transformateur parfait)
= Transformateur parfait : U1 × I1 = U2 × I2, donc I2 / I1 = 1 / m
= Puissance apparente nominale : S = U2 × I2
= Exemple : 230 V / 24 V, N1 = 920 spires : m = 24 / 230 ≈ 0,104 ; N2 = 920 × 24 / 230 = 96 spires
= Pour S = 100 VA : I2 = 100 / 24 ≈ 4,17 A ; I1 = 100 / 230 ≈ 0,435 A
= Rendement : η = P2 / P1 = P2 / (P2 + pertes fer + pertes cuivre)
- Les pertes fer (dans le circuit magnétique) se mesurent par l'essai à vide ; les pertes cuivre (effet Joule dans les enroulements) par l'essai en court-circuit.
- m < 1 : abaisseur ; m > 1 : élévateur.
### Je vérifie
? Pourquoi un transformateur ne fonctionne-t-il pas en courant continu ?
+ Il faut un flux magnétique variable pour induire une tension au secondaire
- Le continu fait fondre le circuit magnétique
- Le continu n'a pas de tension efficace
! L'induction exige une variation de flux, que seul l'alternatif fournit.
? Un transformateur parfait 230 V / 12 V débite 5 A au secondaire. Courant primaire ?
+ Environ 0,26 A
- 95,8 A
- 5 A
! I1 = U2 × I2 / U1 = 12 × 5 / 230 ≈ 0,261 A.
### Je m'exerce
1. Un transformateur fournit P2 = 80 W à une charge résistive ; ses pertes fer valent 5 W et ses pertes cuivre 3 W. Calcule son rendement.
2. Le primaire compte 1 150 spires sous 230 V. Combien de spires faut-il au secondaire pour obtenir 12 V ?
### Corrigé
1. P1 = 80 + 5 + 3 = 88 W ; η = 80 / 88 ≈ 0,909, soit 90,9 %.
2. N2 = N1 × U2 / U1 = 1 150 × 12 / 230 = 60 spires.

## TN-ET-02 | Le moteur à courant continu | 60 min
Objectif : Exploiter les relations fondamentales du moteur à courant continu à excitation indépendante.
### Situation d'apprentissage
Un laminoir d'une usine de tôles de Yopougon est entraîné par un moteur à courant continu dont on fait varier la vitesse en réglant la tension d'induit. Le technicien veut prévoir la vitesse et le couple selon la tension appliquée.
### Je retiens
> Le moteur à courant continu comprend un inducteur (qui crée le flux) et un induit tournant alimenté par l'intermédiaire du collecteur et des balais.
= Force électromotrice : E = k × Φ × Ω ; à flux constant, E = K × Ω (E proportionnelle à la vitesse)
= Loi des mailles de l'induit : U = E + R × I
= Puissance électromagnétique : Pem = E × I = Cem × Ω
= Exemple : U = 220 V, R = 0,5 Ω, I = 20 A : E = 220 − 0,5 × 20 = 210 V ; Pem = 210 × 20 = 4 200 W
= À 1 500 tr/min : Ω = 2π × 1 500 / 60 ≈ 157,1 rad/s ; Cem = 4 200 / 157,1 ≈ 26,7 N·m
- À flux constant, le couple est proportionnel au courant d'induit : Cem = K × I.
- On règle la vitesse en faisant varier la tension d'induit U (hacheur, redresseur commandé).
- Au démarrage, E = 0 : le courant I = U / R est très grand, il faut le limiter.
### Je vérifie
? À flux constant, si la tension d'induit diminue, la vitesse du moteur :
+ diminue
- augmente
- reste la même
! E = U − RI diminue et E = K Ω : la vitesse baisse.
? Un moteur (R = 1 Ω) est alimenté sous 120 V et absorbe 10 A. Sa force électromotrice vaut :
+ 110 V
- 130 V
- 12 V
! E = U − R I = 120 − 1 × 10 = 110 V.
### Je m'exerce
1. Le moteur de l'exemple est alimenté sous 180 V, toujours avec I = 20 A et le même flux. Calcule E et la nouvelle vitesse.
2. Calcule le courant de démarrage direct sous 220 V et commente.
### Corrigé
1. E = 180 − 0,5 × 20 = 170 V ; N proportionnelle à E : N = 1 500 × 170 / 210 ≈ 1 214 tr/min.
2. Au démarrage E = 0, donc I = 220 / 0,5 = 440 A, soit 22 fois le courant nominal : il faut démarrer sous tension réduite ou avec un rhéostat.

## TN-ET-03 | Le moteur asynchrone triphasé | 60 min
Objectif : Calculer la vitesse de synchronisme, le glissement, le rendement et le couple utile d'un moteur asynchrone.
### Situation d'apprentissage
La station de pompage d'eau potable de la SODECI à Yamoussoukro utilise des moteurs asynchrones triphasés. Le technicien relève sur l'un d'eux : 400 V, 15 A, cos φ = 0,84, 1 440 tr/min, 7,5 kW, et doit vérifier ses performances.
### Je retiens
> Les trois enroulements du stator, alimentés en triphasé, créent un champ tournant ; le rotor tourne un peu moins vite que ce champ.
= Vitesse de synchronisme : ns = f / p (tr/s) ou Ns = 60 × f / p (tr/min), p : nombre de paires de pôles
= À 50 Hz : p = 1 donne 3 000 tr/min ; p = 2 donne 1 500 tr/min ; p = 3 donne 1 000 tr/min
= Glissement : g = (Ns − N) / Ns
= Puissance absorbée : Pa = √3 × U × I × cos φ ; rendement : η = Pu / Pa ; couple utile : Cu = Pu / Ω
= Exemple : Pa = 1,732 × 400 × 15 × 0,84 ≈ 8 730 W ; η = 7 500 / 8 730 ≈ 0,859
= Ns = 1 500 tr/min (p = 2) ; g = (1 500 − 1 440) / 1 500 = 0,04 = 4 % ; Ω = 2π × 1 440 / 60 ≈ 150,8 rad/s ; Cu = 7 500 / 150,8 ≈ 49,7 N·m
- La puissance indiquée sur la plaque est la puissance utile (mécanique).
- Pour inverser le sens de rotation, on permute deux phases d'alimentation.
- Le démarrage étoile-triangle divise par 3 le courant de démarrage (pour un moteur prévu en triangle sur le réseau).
### Je vérifie
? Comment inverser le sens de rotation d'un moteur asynchrone triphasé ?
+ En permutant deux phases d'alimentation
- En inversant phase et neutre
- En changeant le couplage étoile en triangle
! La permutation de deux phases inverse le sens du champ tournant.
? Un moteur à 6 pôles est alimenté à 50 Hz. Vitesse de synchronisme ?
+ 1 000 tr/min
- 500 tr/min
- 3 000 tr/min
! 6 pôles = 3 paires : Ns = 60 × 50 / 3 = 1 000 tr/min.
### Je m'exerce
1. Un moteur à 2 paires de pôles tourne à 1 455 tr/min sur le réseau 50 Hz. Calcule son glissement.
2. Il absorbe 4,8 kW et fournit 4 kW. Calcule son rendement, les pertes et le couple utile.
### Corrigé
1. Ns = 60 × 50 / 2 = 1 500 tr/min ; g = (1 500 − 1 455) / 1 500 = 0,03 = 3 %.
2. η = 4 / 4,8 ≈ 0,833 soit 83,3 % ; pertes = 4,8 − 4 = 0,8 kW ; Ω = 2π × 1 455 / 60 ≈ 152,4 rad/s ; Cu = 4 000 / 152,4 ≈ 26,3 N·m.

# Sécurité et épreuve du BAC

## TN-ET-04 | Régimes de neutre et protection contre les contacts indirects | 60 min
Objectif : Calculer la tension de contact lors d'un défaut en schéma TT et vérifier la protection par différentiel.
### Situation d'apprentissage
Dans un atelier de couture de Treichville, une machine présente un défaut d'isolement : sa carcasse est touchée par un fil de phase. L'inspecteur vérifie si la prise de terre et le disjoncteur différentiel protègent réellement les couturières.
### Je retiens
> Un schéma de liaison à la terre (régime de neutre) est désigné par deux lettres : la première pour le neutre du transformateur, la seconde pour les masses de l'installation.
= TT : neutre à la terre, masses reliées à une prise de terre locale ; schéma courant pour les abonnés domestiques en basse tension
= TN : neutre à la terre, masses reliées au neutre (le défaut devient un court-circuit, coupé par les disjoncteurs)
= IT : neutre isolé ou impédant ; le premier défaut ne provoque pas de coupure (hôpitaux, industries à continuité de service)
> En TT, le courant de défaut traverse la prise de terre des masses RA et celle du neutre RB.
= Courant de défaut : Id = V / (RA + RB)
= Tension de contact : Uc = RA × Id
= Exemple : V = 230 V, RA = 20 Ω, RB = 10 Ω : Id = 230 / 30 ≈ 7,67 A ; Uc = 20 × 7,67 ≈ 153 V, supérieure à UL = 50 V : la coupure est obligatoire
= Condition de protection par différentiel : RA × IΔn ≤ UL
- Un disjoncteur de 16 A ne coupe pas un défaut de 7,67 A : seul le dispositif différentiel assure la protection en TT.
- Les circuits terminaux sont protégés par des DDR 30 mA, qui protègent aussi contre les contacts directs (protection complémentaire).
### Je vérifie
? En schéma TT, quel appareil assure la coupure en cas de défaut d'isolement ?
+ Le dispositif différentiel
- Le disjoncteur magnétothermique seul
- Le fusible du neutre
! Le courant de défaut, limité par les prises de terre, est trop faible pour faire déclencher la protection contre les surintensités.
? Avec UL = 50 V et un différentiel de 500 mA, quelle résistance maximale peut avoir la prise de terre RA ?
+ 100 Ω
- 25 Ω
- 1 000 Ω
! RA ≤ UL / IΔn = 50 / 0,5 = 100 Ω.
### Je m'exerce
1. Dans un atelier, RA = 40 Ω et RB = 5 Ω. Calcule Id et Uc lors d'un défaut franc sous 230 V.
2. Le local est mouillé (UL = 25 V). Quelle sensibilité maximale IΔn du différentiel faut-il choisir ? Un 30 mA convient-il ?
### Corrigé
1. Id = 230 / (40 + 5) ≈ 5,11 A ; Uc = 40 × 5,11 ≈ 204 V : tension dangereuse, coupure nécessaire.
2. IΔn ≤ UL / RA = 25 / 40 = 0,625 A, soit 625 mA au plus. Un différentiel 30 mA convient largement (40 × 0,030 = 1,2 V ≤ 25 V).

## TN-ET-05 | Méthode pour l'épreuve du BAC d'électrotechnique | 60 min
Objectif : Organiser la résolution d'un problème de BAC portant sur une installation et ses machines.
### Situation d'apprentissage
Les élèves de Terminale F3 d'un lycée technique de Bouaké préparent le BAC blanc. Le sujet porte sur un atelier alimenté par le réseau CIE 230 V / 400 V : un moteur asynchrone, un transformateur de commande et la protection des personnes.
### Je retiens
> Étape 1 : lire tout le sujet, souligner les données (plaques signalétiques, schémas) et noter les grandeurs demandées.
> Étape 2 : identifier le type de réseau (monophasé ou triphasé, U ou V) et le couplage avant tout calcul.
> Étape 3 : pour chaque question, écrire la formule littérale, faire l'application numérique, donner le résultat avec son unité.
> Étape 4 : réaliser un bilan des puissances : Pa = Pu + pertes ; vérifier que η est inférieur à 1.
> Étape 5 : pour la sécurité, citer le schéma de liaison à la terre, calculer Id et Uc, comparer à UL et conclure.
= Formules à maîtriser : P = √3 U I cos φ ; Ns = 60 f / p ; g = (Ns − N) / Ns ; Cu = Pu / Ω ; Ω = 2π N / 60
= Plaque « 400 V / 690 V » sur réseau 400 V : triangle ; « 230 V / 400 V » sur réseau 400 V : étoile
- Contrôler les ordres de grandeur : un rendement de 120 % ou un glissement de 40 % signale une erreur.
- Soigner les schémas : symboles normalisés, repérage L1, L2, L3, N, PE.
### Je vérifie
? Sur une plaque de moteur, la puissance indiquée est :
+ la puissance utile mécanique
- la puissance absorbée électrique
- la puissance apparente
! Le constructeur indique toujours la puissance disponible sur l'arbre.
? Un élève trouve un rendement de 1,15 pour un moteur. Que doit-il conclure ?
+ Qu'il a fait une erreur, car un rendement est toujours inférieur à 1
- Que le moteur est très performant
- Que le moteur produit de l'énergie
! Les pertes rendent Pu inférieure à Pa : η < 1.
### Je m'exerce
1. Sujet type : un moteur asynchrone porte la plaque 400 V / 690 V, 11 kW, 1 455 tr/min, cos φ = 0,85, η = 0,88. Le réseau est en 230 V / 400 V, 50 Hz. Donne le couplage, puis calcule la puissance absorbée, le courant de ligne, le glissement et le couple utile.
2. Calcule les pertes totales du moteur.
### Corrigé
1. Chaque enroulement supporte 400 V : couplage triangle. Pa = Pu / η = 11 000 / 0,88 = 12 500 W. I = Pa / (√3 × U × cos φ) = 12 500 / (1,732 × 400 × 0,85) ≈ 12 500 / 588,9 ≈ 21,2 A. Ns = 1 500 tr/min, g = (1 500 − 1 455) / 1 500 = 3 %. Ω = 2π × 1 455 / 60 ≈ 152,4 rad/s ; Cu = 11 000 / 152,4 ≈ 72,2 N·m.
2. Pertes = Pa − Pu = 12 500 − 11 000 = 1 500 W.
