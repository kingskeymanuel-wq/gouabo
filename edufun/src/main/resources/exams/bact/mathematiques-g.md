---
order: 4
subject: Mathématiques
series: Séries G1 et G2
duration: Épreuve écrite
---
# Méthode
> Le sujet comprend en général des exercices de statistiques à deux variables, de suites et de mathématiques financières (intérêts composés, escompte, annuités, emprunts), et un problème d'étude de fonction utilisant ln ou exp dans un contexte de gestion. Le correcteur attend des formules écrites, des calculs justifiés et une phrase de conclusion.
1. **Lis tout le sujet** et commence par l'exercice que tu maîtrises le mieux ; garde le problème pour un moment de concentration.
2. **Statistiques à deux variables** : calcule x̄, ȳ, Σxᵢyᵢ, Σxᵢ², puis cov(x, y) = Σxᵢyᵢ / N − x̄ȳ et V(x) = Σxᵢ² / N − x̄² ; a = cov / V(x), b = ȳ − a x̄ ; vérifie que la droite passe par G(x̄ ; ȳ).
3. **Suites et finance** : identifie la nature (hausse constante en valeur : arithmétique ; en pourcentage : géométrique), écris la formule littérale (Cₙ = C₀(1 + i)ⁿ, E = V × t × j / 360, a = V₀ × i / (1 − (1 + i)⁻ⁿ)), puis l'application numérique et le résultat en F CFA.
4. **Recherche d'une durée** : qⁿ ≥ k équivaut à n ≥ ln k / ln q pour q > 1 ; arrondis à l'entier supérieur et conclus en années.
5. **Problème d'analyse** : dérivée, signe, tableau de variations, valeurs remarquables, tangente, solutions d'une équation f(x) = k ; interprète chaque résultat dans le contexte (production, bénéfice).
6. **Relis** : arrondis seulement à la fin, contrôle les ordres de grandeur (une valeur actuelle est inférieure au nominal, une annuité dépasse V₀ / n, −1 ≤ r ≤ 1).
- Piège fréquent : compter mal le nombre de termes d'une somme (de u₀ à uₙ il y a n + 1 termes).
- Piège fréquent : arrondir trop tôt une puissance comme 1,08⁻⁴, ce qui fausse le tableau d'amortissement.

# Sujet type 1 — Ajustement affine et fonction logarithme
**Exercice — Statistiques à deux variables (8 points)**
Une société de distribution de Treichville a relevé son chiffre d'affaires annuel y (en millions de F CFA) de 2020 à 2025. On note x le rang de l'année (x = 1 pour 2020).
- x : 1 ; 2 ; 3 ; 4 ; 5 ; 6
- y : 18 ; 21 ; 25 ; 27 ; 31 ; 34
1. Décris l'allure du nuage de points et calcule les coordonnées du point moyen G.
2. Calcule la variance de x et la covariance de x et y.
3. Détermine par la méthode des moindres carrés une équation de la droite de régression de y en x.
4. Sachant que V(y) = 30, calcule le coefficient de corrélation linéaire r et interprète-le.
5. En supposant que la tendance se maintient, estime le chiffre d'affaires de 2027, puis détermine à partir de quelle année il dépassera 45 millions de F CFA.

**Problème — Étude d'un bénéfice (12 points)**
Une PME de Treichville fabrique des cartons de savon. Son bénéfice mensuel, en millions de F CFA, est modélisé par f(x) = 10 ln x − x + 2, où x est le nombre de centaines de cartons vendus, avec x ∈ [1 ; 20]. On prendra ln 2 ≈ 0,693 ; ln 5 ≈ 1,609 ; ln 10 ≈ 2,303.
1. Calcule f'(x) et montre que f'(x) = (10 − x) / x. Étudie son signe et dresse le tableau de variations de f sur [1 ; 20].
2. Calcule f(1), f(2), f(5), f(10), f(15) et f(20) (arrondis à 0,01 près ; on donne ln 15 ≈ 2,708 et ln 20 ≈ 2,996).
3. Détermine une équation de la tangente (T) à la courbe de f au point d'abscisse 1.
4. a) Montre que l'équation f(x) = 12 admet une solution unique α dans [1 ; 10] et vérifie que 4,0 < α < 4,1 (on donne f(4) ≈ 11,86 et f(4,1) ≈ 12,01).
   b) Montre que l'équation f(x) = 12 admet une solution unique β dans [10 ; 20] et vérifie que 19,9 < β < 20 (on donne f(19,9) ≈ 12,01).
   c) Pour quelles ventes le bénéfice est-il au moins égal à 12 millions de F CFA ?
5. Quel nombre de cartons faut-il vendre pour obtenir le bénéfice maximal ? Quel est ce bénéfice ?
## Corrigé
**Exercice**
1. Les points sont presque alignés selon une droite croissante : un ajustement affine est envisageable. x̄ = 21 / 6 = 3,5 ; ȳ = 156 / 6 = 26 ; G(3,5 ; 26). (1,5 point)
2. Σxᵢ² = 1 + 4 + 9 + 16 + 25 + 36 = 91 ; V(x) = 91 / 6 − 3,5² = 15,1667 − 12,25 ≈ 2,917. Σxᵢyᵢ = 18 + 42 + 75 + 108 + 155 + 204 = 602 ; cov(x, y) = 602 / 6 − 3,5 × 26 = 100,333 − 91 ≈ 9,333. (2 points)
3. a = cov(x, y) / V(x) = 9,333 / 2,917 = 3,2 (valeur exacte : (28/3) / (35/12) = 3,2) ; b = ȳ − a x̄ = 26 − 3,2 × 3,5 = 26 − 11,2 = 14,8. Droite : y = 3,2x + 14,8. (2 points)
4. σx = √2,917 ≈ 1,708 ; σy = √30 ≈ 5,477 ; r = 9,333 / (1,708 × 5,477) ≈ 9,333 / 9,354 ≈ 0,998. r est très proche de 1 : la corrélation linéaire est très forte et l'ajustement affine est justifié. (1,5 point)
5. 2027 correspond à x = 8 : y = 3,2 × 8 + 14,8 = 40,4 millions de F CFA. 3,2x + 14,8 > 45 équivaut à x > 30,2 / 3,2 = 9,4375 ; le premier rang entier est x = 10, soit l'année 2029. (1 point)
**Problème**
1. (ln x)' = 1/x, donc f'(x) = 10/x − 1 = (10 − x) / x. Sur [1 ; 20], x > 0 : f'(x) a le signe de 10 − x. f'(x) > 0 sur [1 ; 10[, f'(10) = 0, f'(x) < 0 sur ]10 ; 20]. f est croissante sur [1 ; 10] et décroissante sur [10 ; 20], avec un maximum en x = 10. (3 points)
2. f(1) = 0 − 1 + 2 = 1 ; f(2) = 6,93 − 2 + 2 ≈ 6,93 ; f(5) = 16,09 − 5 + 2 ≈ 13,09 ; f(10) = 23,03 − 10 + 2 ≈ 15,03 ; f(15) = 27,08 − 15 + 2 ≈ 14,08 ; f(20) = 29,96 − 20 + 2 ≈ 11,96. (2 points)
3. f(1) = 1 et f'(1) = 9 / 1 = 9. (T) : y = f'(1)(x − 1) + f(1) = 9(x − 1) + 1, soit y = 9x − 8. (2 points)
4. a) Sur [1 ; 10], f est continue et strictement croissante ; f(1) = 1 < 12 < f(10) ≈ 15,03. D'après le théorème des valeurs intermédiaires (bijection), l'équation f(x) = 12 a une solution unique α. Comme f(4) ≈ 11,86 < 12 < f(4,1) ≈ 12,01, on a 4,0 < α < 4,1.
   b) Sur [10 ; 20], f est continue et strictement décroissante ; f(10) ≈ 15,03 > 12 > f(20) ≈ 11,96 : solution unique β. Comme f(19,9) ≈ 12,01 > 12 > f(20), on a 19,9 < β < 20.
   c) D'après les variations, f(x) ≥ 12 pour x ∈ [α ; β]. Le bénéfice atteint au moins 12 millions de F CFA pour des ventes comprises entre environ 410 et 1 990 cartons. (4 points)
5. Le maximum est atteint pour x = 10, soit 1 000 cartons ; bénéfice maximal f(10) = 10 ln 10 − 8 ≈ 15,03 millions de F CFA, soit environ 15 026 000 F CFA. (1 point)

# Sujet type 2 — Suites, emprunt et fonction exponentielle
**Exercice 1 — Suites (6 points)**
Awa, titulaire d'un BTS, reçoit deux propositions d'embauche à Abidjan. La première année, le salaire annuel est de 1 800 000 F CFA dans les deux cas.
- Proposition A : augmentation de 90 000 F CFA chaque année.
- Proposition B : augmentation de 4 % chaque année.
On note uₙ et vₙ les salaires annuels de la (n + 1)-ième année pour A et B (u₀ = v₀ = 1 800 000).
1. Précise la nature de chaque suite et exprime uₙ et vₙ en fonction de n.
2. Calcule le salaire de la 5e année dans chaque cas.
3. Calcule le total des salaires perçus pendant les 5 premières années dans chaque cas. Quelle proposition est la plus avantageuse sur cette période ?
4. Avec la proposition B, à partir de quelle année le salaire annuel dépassera-t-il 2 500 000 F CFA ? (utilise les logarithmes)

**Exercice 2 — Emprunt indivis (7 points)**
Un commerçant du marché d'Adjamé emprunte 2 000 000 F CFA à une banque, au taux annuel de 8 %, remboursable par 4 annuités constantes de fin d'année.
1. Calcule le montant de l'annuité a (arrondi au franc).
2. Construis le tableau d'amortissement (pour chaque année : capital restant dû en début d'année, intérêt, amortissement, capital restant dû en fin d'année), en arrondissant les intérêts au franc.
3. Vérifie que les amortissements forment (aux arrondis près) une suite géométrique dont tu donneras la raison.
4. Calcule le coût total du crédit (total des intérêts).

**Exercice 3 — Placement (3 points)**
Un enseignant de Daloa place 1 500 000 F CFA au taux annuel de 6 %, intérêts composés.
1. Calcule la valeur acquise au bout de 4 ans.
2. Au bout de combien d'années entières la valeur acquise dépassera-t-elle 2 000 000 F CFA ?

**Exercice 4 — Dépréciation d'une machine (4 points)**
Une imprimerie de Bouaké achète une machine de 12 millions de F CFA. Sa valeur, en millions de F CFA, au bout de t années est V(t) = 12 e^(−0,2t), pour t ≥ 0.
1. Calcule V(0) et V(3) (arrondi à 0,01 près).
2. Calcule V'(t), étudie le sens de variation de V et donne la limite de V(t) quand t tend vers +∞.
3. Au bout de combien d'années entières la valeur de la machine deviendra-t-elle inférieure à 3 millions de F CFA ?
## Corrigé
**Exercice 1**
1. (uₙ) est arithmétique de raison r = 90 000 : uₙ = 1 800 000 + 90 000n. (vₙ) est géométrique de raison q = 1,04 : vₙ = 1 800 000 × 1,04ⁿ. (1,5 point)
2. La 5e année correspond à n = 4 : u₄ = 1 800 000 + 360 000 = 2 160 000 F CFA ; v₄ = 1 800 000 × 1,04⁴ = 1 800 000 × 1,16985856 ≈ 2 105 745 F CFA. (1,5 point)
3. De u₀ à u₄ il y a 5 termes : S_A = 5 × (1 800 000 + 2 160 000) / 2 = 5 × 1 980 000 = 9 900 000 F CFA. S_B = 1 800 000 × (1,04⁵ − 1) / 0,04 = 1 800 000 × 5,4163226 ≈ 9 749 381 F CFA. Sur 5 ans, la proposition A est la plus avantageuse (environ 150 619 F CFA de plus). (2 points)
4. 1 800 000 × 1,04ⁿ > 2 500 000 équivaut à 1,04ⁿ > 1,3889, soit n > ln 1,3889 / ln 1,04 ≈ 0,3285 / 0,0392 ≈ 8,38. Donc n = 9 : c'est la 10e année (v₈ ≈ 2 463 424 F CFA et v₉ ≈ 2 561 961 F CFA). (1 point)
**Exercice 2**
1. a = V₀ × i / (1 − (1 + i)⁻ⁿ) = 2 000 000 × 0,08 / (1 − 1,08⁻⁴) = 160 000 / (1 − 0,7350299) = 160 000 / 0,2649701 ≈ 603 842 F CFA. Contrôle : a > 2 000 000 / 4 = 500 000. (2 points)
2. Intérêt = capital dû × 0,08 ; amortissement = a − intérêt. (3 points)
- Année 1 : capital dû 2 000 000 ; intérêt 160 000 ; amortissement 443 842 ; reste dû 1 556 158.
- Année 2 : capital dû 1 556 158 ; intérêt 124 493 ; amortissement 479 349 ; reste dû 1 076 809.
- Année 3 : capital dû 1 076 809 ; intérêt 86 145 ; amortissement 517 697 ; reste dû 559 112.
- Année 4 : capital dû 559 112 ; intérêt 44 729 ; amortissement 559 113 ; reste dû 0 (l'écart de 1 F CFA vient des arrondis ; on ajuste la dernière ligne).
3. 479 349 / 443 842 ≈ 1,08 ; 517 697 / 479 349 ≈ 1,08 ; 559 113 / 517 697 ≈ 1,08 : les amortissements forment une suite géométrique de raison 1 + i = 1,08. (1 point)
4. Coût du crédit = 4 × 603 842 − 2 000 000 = 2 415 368 − 2 000 000 = 415 368 F CFA (la somme des intérêts du tableau donne 415 367 F CFA, aux arrondis près). (1 point)
**Exercice 3**
1. C₄ = 1 500 000 × 1,06⁴ = 1 500 000 × 1,26247696 ≈ 1 893 715 F CFA. (1 point)
2. 1 500 000 × 1,06ⁿ > 2 000 000 équivaut à 1,06ⁿ > 4/3, soit n > ln(4/3) / ln 1,06 ≈ 0,2877 / 0,0583 ≈ 4,94. Il faut 5 ans (C₅ ≈ 2 007 338 F CFA). (2 points)
**Exercice 4**
1. V(0) = 12 × e⁰ = 12 millions de F CFA ; V(3) = 12 e^(−0,6) ≈ 12 × 0,5488 ≈ 6,59 millions de F CFA. (1 point)
2. (e^u)' = u' e^u avec u = −0,2t : V'(t) = 12 × (−0,2) e^(−0,2t) = −2,4 e^(−0,2t). Comme e^(−0,2t) > 0, V'(t) < 0 : V est strictement décroissante. Quand t tend vers +∞, −0,2t tend vers −∞ donc e^(−0,2t) tend vers 0 et V(t) tend vers 0. (1,5 point)
3. 12 e^(−0,2t) < 3 équivaut à e^(−0,2t) < 0,25, soit −0,2t < ln 0,25 = −ln 4, donc t > ln 4 / 0,2 = 5 ln 4 ≈ 6,93. La valeur devient inférieure à 3 millions de F CFA au bout de 7 ans (V(7) ≈ 2,96 millions de F CFA). (1,5 point)

# QCM
? La droite de régression de y en x obtenue par les moindres carrés passe toujours par :
+ le point moyen G(x̄ ; ȳ)
- l'origine du repère
- le premier point du nuage
! b = ȳ − a x̄ signifie que G appartient à la droite.
? On a cov(x, y) = 4, V(x) = 2, x̄ = 3 et ȳ = 10. La droite de y en x est :
+ y = 2x + 4
- y = 2x + 10
- y = 0,5x + 8,5
! a = 4 / 2 = 2 et b = 10 − 2 × 3 = 4.
? Un coefficient de corrélation r = −0,97 signifie :
+ une forte corrélation linéaire, y diminuant quand x augmente
- une absence de corrélation
- une erreur de calcul, car r doit être positif
! r est compris entre −1 et 1 ; proche de −1, la corrélation est forte et décroissante.
? Une suite arithmétique a pour premier terme u₀ = 5 et pour raison 3. Que vaut u₁₀ ?
+ 35
- 30
- 38
! u₁₀ = 5 + 10 × 3 = 35.
? Un loyer augmente de 5 % par an. La suite des loyers annuels est :
+ géométrique de raison 1,05
- arithmétique de raison 5
- géométrique de raison 0,05
! Augmenter de 5 % revient à multiplier par 1,05.
? La somme 2 + 4 + 6 + … + 20 vaut :
+ 110
- 100
- 220
! 10 termes : 10 × (2 + 20) / 2 = 110.
? 500 000 F CFA sont placés à 10 % l'an, intérêts composés, pendant 2 ans. Valeur acquise ?
+ 605 000 F CFA
- 600 000 F CFA
- 550 000 F CFA
! C₂ = 500 000 × 1,1² = 500 000 × 1,21.
? Un effet de 720 000 F CFA est escompté 45 jours avant l'échéance au taux de 10 %. Escompte ?
+ 9 000 F CFA
- 72 000 F CFA
- 3 240 F CFA
! E = 720 000 × 0,10 × 45 / 360 = 9 000 F CFA.
? Dans un emprunt remboursé par annuités constantes, les amortissements :
+ augmentent selon une suite géométrique de raison 1 + i
- diminuent chaque année
- sont tous égaux
! Les intérêts diminuent avec le capital restant dû, donc la part d'amortissement augmente.
? ln(a × b) est égal à (a > 0, b > 0) :
+ ln a + ln b
- ln a × ln b
- ln a − ln b
! Le logarithme transforme un produit en somme.
? Un capital placé à 5 % l'an, intérêts composés, double au bout de :
+ 15 ans, car n ≥ ln 2 / ln 1,05 ≈ 14,2
- 20 ans, car 100 / 5 = 20
- 14 ans exactement
! 1,05ⁿ ≥ 2 équivaut à n ≥ 14,2 ; il faut donc 15 années entières.
? La dérivée de f(x) = e^(−0,5x) est :
+ −0,5 e^(−0,5x)
- e^(−0,5x)
- −0,5x e^(−0,5x)
! (e^u)' = u' e^u avec u' = −0,5.
