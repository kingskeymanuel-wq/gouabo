---
order: 4
subject: Mathématiques
series: Série A
duration: Épreuve écrite
---
# Méthode
> Le sujet porte sur des situations concrètes : pourcentages, suites et mathématiques financières, statistiques, probabilités, fonctions simples.
1. Traduis la situation en calcul : quelle est la quantité de départ ? quel taux ? sur combien de périodes ?
2. Écris la formule avant de calculer (Cₙ = C₀(1 + t)ⁿ).
3. Utilise la calculatrice avec soin et arrondis comme demandé.
4. Conclus chaque question par une phrase en français.

# Sujet type 1 — Épargne et statistiques
**Exercice 1** — Koffi place 500 000 F à intérêts composés au taux annuel de 5 %.
1. Quel est le capital au bout de 1 an ? de 2 ans ?
2. Exprime Cₙ en fonction de n.
3. Au bout de combien d'années le capital dépassera-t-il 700 000 F ?
**Exercice 2** — Les ventes d'une boutique (en milliers de F) sur 5 mois sont : 120 ; 135 ; 150 ; 160 ; 175.
1. Calcule la moyenne des ventes.
2. Calcule l'augmentation en pourcentage entre le 1er et le 5e mois.
## Corrigé
**Exercice 1**
1. C₁ = 500 000 × 1,05 = 525 000 F ; C₂ = 525 000 × 1,05 = 551 250 F.
2. Cₙ = 500 000 × 1,05ⁿ (suite géométrique de raison 1,05).
3. On cherche n tel que 1,05ⁿ > 1,4 : n > ln 1,4 / ln 1,05 ≈ 6,9. Il faut 7 ans (C₇ ≈ 703 550 F).
**Exercice 2**
1. Moyenne = (120 + 135 + 150 + 160 + 175) / 5 = 740 / 5 = 148 milliers de F.
2. (175 − 120)/120 ≈ 0,458 soit une augmentation d'environ 45,8 %.

# Sujet type 2 — Probabilités, suite arithmétique et bénéfice
**Exercice 1 (6 points)** — Dans une classe de Terminale A de 40 élèves d'un lycée de Bouaké, il y a 25 filles. Parmi les filles, 10 pratiquent un sport ; parmi les garçons, 9 pratiquent un sport. On choisit un élève au hasard (tous les élèves ont la même chance d'être choisis). On note F l'événement « l'élève est une fille » et S l'événement « l'élève pratique un sport ».
1. Calcule P(F) et P(S).
2. Définis par une phrase l'événement F ∩ S et calcule sa probabilité.
3. Calcule P(F ∪ S).
4. Calcule la probabilité que l'élève choisi soit un garçon qui ne pratique pas de sport.
**Exercice 2 (7 points)** — Awa est embauchée dans une entreprise de San-Pedro avec un salaire mensuel de 120 000 F la première année. Chaque année, son salaire mensuel augmente de 6 000 F. On note u₀ = 120 000 le salaire mensuel de la première année et uₙ celui de l'année n + 1.
1. Calcule u₁ et u₂.
2. Quelle est la nature de la suite (uₙ) ? Exprime uₙ en fonction de n.
3. À partir de quelle année le salaire mensuel d'Awa atteindra-t-il 180 000 F ?
4. Calcule la somme totale perçue par Awa pendant ses 10 premières années de travail (12 salaires par an).
**Exercice 3 (7 points)** — Une coopérative de Korhogo transforme x tonnes de noix de cajou par mois, avec 0 ≤ x ≤ 30. Son bénéfice mensuel, en dizaines de milliers de francs CFA, est B(x) = −x² + 40x − 300.
1. Calcule B(0) et B(15). Interprète B(0).
2. Calcule la dérivée B'(x) et étudie son signe.
3. Dresse le tableau de variations de B sur [0 ; 30]. Pour quelle quantité le bénéfice est-il maximal ? Donne ce bénéfice maximal en francs CFA.
4. Résous B(x) = 0, puis indique pour quelles quantités la coopérative ne perd pas d'argent.
## Corrigé
**Exercice 1**
1. P(F) = 25/40 = 0,625. Le nombre d'élèves sportifs est 10 + 9 = 19, donc P(S) = 19/40 = 0,475.
2. F ∩ S : « l'élève est une fille qui pratique un sport ». P(F ∩ S) = 10/40 = 0,25.
3. P(F ∪ S) = P(F) + P(S) − P(F ∩ S) = 25/40 + 19/40 − 10/40 = 34/40 = 0,85.
4. Il y a 40 − 25 = 15 garçons, dont 15 − 9 = 6 ne pratiquent pas de sport : la probabilité vaut 6/40 = 0,15. (Vérification : c'est l'événement contraire de F ∪ S, et 1 − 0,85 = 0,15.)
**Exercice 2**
1. u₁ = 120 000 + 6 000 = 126 000 F ; u₂ = 126 000 + 6 000 = 132 000 F.
2. On ajoute chaque année la même quantité 6 000 : (uₙ) est une suite arithmétique de premier terme u₀ = 120 000 et de raison r = 6 000. uₙ = u₀ + n r = 120 000 + 6 000 n.
3. On résout 120 000 + 6 000 n ≥ 180 000, soit 6 000 n ≥ 60 000, donc n ≥ 10. Le salaire atteint 180 000 F pour n = 10, c'est-à-dire la 11e année.
4. Les 10 premières années correspondent à u₀, u₁, …, u₉ avec u₉ = 120 000 + 54 000 = 174 000 F. Somme des salaires mensuels : S = 10 × (u₀ + u₉)/2 = 10 × (120 000 + 174 000)/2 = 1 470 000 F. Total perçu : 12 × 1 470 000 = 17 640 000 F.
**Exercice 3**
1. B(0) = −300 : sans production, la coopérative perd 300 dizaines de milliers de F, soit 3 000 000 F (ses charges fixes). B(15) = −225 + 600 − 300 = 75, soit un bénéfice de 750 000 F.
2. B'(x) = −2x + 40. B'(x) > 0 pour x < 20, B'(x) = 0 pour x = 20, B'(x) < 0 pour x > 20.
3. B est croissante sur [0 ; 20] et décroissante sur [20 ; 30]. Valeurs : B(0) = −300 ; B(20) = −400 + 800 − 300 = 100 ; B(30) = −900 + 1 200 − 300 = 0. Le bénéfice est maximal pour 20 tonnes et vaut 100 dizaines de milliers de F, soit 1 000 000 F.
4. B(x) = 0 équivaut à x² − 40x + 300 = 0. Δ = 1 600 − 1 200 = 400, √Δ = 20 : x₁ = (40 − 20)/2 = 10 et x₂ = (40 + 20)/2 = 30. B(x) = −(x − 10)(x − 30) est positif ou nul entre les racines : la coopérative ne perd pas d'argent pour une production comprise entre 10 et 30 tonnes.

# QCM
? Augmenter un prix de 20 % revient à le multiplier par :
- 0,8
+ 1,2
- 20
! 1 + 20/100 = 1,2.
? Un prix baisse de 10 % puis augmente de 10 %. Au total, il :
+ baisse de 1 %
- reste identique
- augmente de 1 %
! 0,9 × 1,1 = 0,99.
? La suite 3 ; 7 ; 11 ; 15 est :
+ arithmétique de raison 4
- géométrique de raison 4
- ni l'une ni l'autre
! On ajoute 4 à chaque terme.
? 100 000 F à 10 % d'intérêts composés pendant 2 ans donnent :
- 120 000 F
+ 121 000 F
- 110 000 F
! 100 000 × 1,1² = 121 000 F.
? On lance un dé équilibré. Probabilité d'obtenir un nombre pair :
+ 1/2
- 1/3
- 1/6
! 3 issues favorables (2, 4, 6) sur 6.
? La moyenne de 8, 10 et 15 est :
- 10
+ 11
- 33
! 33 / 3 = 11.
? Une suite géométrique de premier terme u₀ = 2 et de raison 3 a pour terme u₃ :
+ 54
- 18
- 11
! u₃ = u₀ × 3³ = 2 × 27 = 54.
? La médiane de la série 3 ; 5 ; 8 ; 9 ; 12 est :
+ 8
- 7,4
- 9
! La série est rangée et compte 5 valeurs : la médiane est la 3e valeur (7,4 est la moyenne).
? Si P(A) = 0,3, la probabilité de l'événement contraire de A vaut :
+ 0,7
- 0,3
- 1,3
! P(contraire de A) = 1 − P(A) = 1 − 0,3 = 0,7.
? La dérivée de f(x) = x² + 3x est :
+ f'(x) = 2x + 3
- f'(x) = x + 3
- f'(x) = 2x + 3x
! (x²)' = 2x et (3x)' = 3.
? La somme 1 + 2 + 3 + … + 100 vaut :
+ 5 050
- 5 000
- 10 100
! Somme des termes d'une suite arithmétique : 100 × (1 + 100)/2 = 5 050.
? Un capital placé à intérêts simples au taux annuel de 4 % rapporte en 3 ans :
+ 12 % du capital
- 4 % du capital
- environ 12,49 % du capital
! En intérêts simples, les intérêts sont les mêmes chaque année : 3 × 4 % = 12 % (12,49 % correspond aux intérêts composés).
