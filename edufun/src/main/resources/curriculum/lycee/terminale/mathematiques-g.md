---
levels: Terminale G1, Terminale G2
subject: Mathématiques
---
# Analyse et statistiques

## TN-MG-01 | Séries statistiques doubles et ajustement affine | 60 min
Objectif : Déterminer la droite d'ajustement par la méthode des moindres carrés et faire une prévision.
### Situation d'apprentissage
Une entreprise de distribution de Treichville a relevé son chiffre d'affaires sur 5 années. Le directeur financier veut savoir si l'évolution est régulière et estimer le chiffre d'affaires de la 7e année pour préparer son budget.
### Je retiens
> Une série double associe deux caractères (xᵢ ; yᵢ) ; on la représente par un nuage de points. Le point moyen est G(x̄ ; ȳ).
= Covariance : cov(x, y) = Σ xᵢyᵢ / N − x̄ × ȳ
= Droite de régression de y en x : y = ax + b avec a = cov(x, y) / V(x) et b = ȳ − a x̄ (elle passe par G)
= Coefficient de corrélation linéaire : r = cov(x, y) / (σx × σy) ; si r est proche de 1 ou de −1, l'ajustement affine est justifié
= Exemple : rang xᵢ : 1, 2, 3, 4, 5 ; CA yᵢ (millions de F CFA) : 12, 15, 16, 19, 23
= x̄ = 3 ; ȳ = 17 ; Σxᵢyᵢ / 5 = 281 / 5 = 56,2 ; cov = 56,2 − 51 = 5,2 ; V(x) = 55 / 5 − 9 = 2
= a = 5,2 / 2 = 2,6 ; b = 17 − 2,6 × 3 = 9,2 ; droite y = 2,6x + 9,2
= V(y) = 1 515 / 5 − 289 = 14 ; r = 5,2 / √(2 × 14) ≈ 0,98
- Prévision pour x = 7 : y = 2,6 × 7 + 9,2 = 27,4 millions de F CFA.
- La méthode de Mayer (deux sous-nuages et leurs points moyens) donne une droite plus rapide à obtenir mais moins précise.
### Je vérifie
? Par quel point passe toujours la droite des moindres carrés ?
+ Le point moyen G(x̄ ; ȳ)
- L'origine du repère
- Le premier point du nuage
! b = ȳ − a x̄ signifie exactement que G est sur la droite.
? On a cov(x, y) = 6 et V(x) = 4, x̄ = 5 et ȳ = 20. Équation de la droite de y en x ?
+ y = 1,5x + 12,5
- y = 1,5x + 20
- y = 0,67x + 16,7
! a = 6 / 4 = 1,5 et b = 20 − 1,5 × 5 = 12,5.
### Je m'exerce
1. Dépenses de publicité xᵢ (centaines de milliers de F CFA) : 1, 2, 3, 4 ; ventes yᵢ (millions de F CFA) : 5, 7, 8, 10. Détermine la droite de régression de y en x et le coefficient de corrélation.
2. À l'aide de cette droite, estime les ventes pour 600 000 F CFA de publicité.
### Corrigé
1. x̄ = 2,5 ; ȳ = 7,5 ; Σxᵢyᵢ = 5 + 14 + 24 + 40 = 83 ; cov = 83 / 4 − 18,75 = 2 ; V(x) = 30 / 4 − 6,25 = 1,25 ; a = 2 / 1,25 = 1,6 ; b = 7,5 − 4 = 3,5 ; y = 1,6x + 3,5. V(y) = 238 / 4 − 56,25 = 3,25 ; r = 2 / √(1,25 × 3,25) ≈ 0,99 : très bonne corrélation.
2. 600 000 F CFA correspond à x = 6 : y = 1,6 × 6 + 3,5 = 13,1 millions de F CFA.

## TN-MG-02 | Fonctions exponentielle et logarithme népérien | 60 min
Objectif : Utiliser les propriétés de ln et de exp pour résoudre des problèmes de gestion.
### Situation d'apprentissage
Une coopérative de Gagnoa place ses excédents à 5 % par an, intérêts composés. Le trésorier veut connaître précisément le nombre d'années nécessaire pour doubler le capital, sans faire d'essais successifs à la calculatrice.
### Je retiens
> La fonction ln est définie sur ]0 ; +∞[, strictement croissante, avec ln 1 = 0 et ln e = 1 (e ≈ 2,718).
> La fonction exp est définie sur R, strictement positive et croissante ; exp(x) = eˣ et e^(ln x) = x pour x > 0.
= ln(ab) = ln a + ln b ; ln(a / b) = ln a − ln b ; ln(aⁿ) = n ln a
= Dérivées : (ln x)' = 1 / x ; (eˣ)' = eˣ ; (e^u)' = u' e^u ; (ln u)' = u' / u
= Résolution : qⁿ ≥ k (q > 1, k > 0) équivaut à n ≥ ln k / ln q
= Exemple : 1,05ⁿ ≥ 2 équivaut à n ≥ ln 2 / ln 1,05 ≈ 14,21 ; le capital double au bout de 15 ans
- Attention : si 0 < q < 1, ln q < 0 et le sens de l'inégalité change en divisant.
### Je vérifie
? Que vaut ln(e³) ?
+ 3
- e³
- 3e
! ln(eⁿ) = n ln e = n.
? Quelle est la solution de eˣ = 5 ?
+ x = ln 5 ≈ 1,609
- x = e⁵
- x = 5 / e
! On applique ln aux deux membres : x = ln 5.
### Je m'exerce
1. Un capital de 2 000 000 F CFA est placé à 6 % l'an, intérêts composés. Au bout de combien d'années entières dépassera-t-il 3 000 000 F CFA ?
2. Soit f(x) = 2x − ln x sur ]0 ; +∞[. Calcule f'(x), étudie son signe et détermine le minimum de f.
### Corrigé
1. 2 000 000 × 1,06ⁿ ≥ 3 000 000 équivaut à 1,06ⁿ ≥ 1,5, soit n ≥ ln 1,5 / ln 1,06 ≈ 0,4055 / 0,0583 ≈ 6,96. Il faut 7 ans.
2. f'(x) = 2 − 1/x = (2x − 1) / x. Pour x > 0, f'(x) est négative sur ]0 ; 0,5[ et positive sur ]0,5 ; +∞[. Minimum en x = 0,5 : f(0,5) = 1 − ln 0,5 = 1 + ln 2 ≈ 1,69.

# Finance et probabilités

## TN-MG-03 | Annuités et emprunts indivis | 60 min
Objectif : Calculer la valeur acquise ou actuelle d'une suite d'annuités et construire un tableau d'amortissement.
### Situation d'apprentissage
Un transporteur de Bouaké emprunte 1 000 000 F CFA à 10 % l'an, remboursable en 3 annuités constantes de fin d'année, pour réparer son camion. Il veut connaître le montant de chaque annuité et la part d'intérêts payée chaque année.
### Je retiens
> Des annuités constantes sont des versements égaux effectués à intervalles réguliers (ici en fin de période).
= Valeur acquise de n annuités a : Vₙ = a × ((1 + i)ⁿ − 1) / i
= Valeur actuelle de n annuités a : V₀ = a × (1 − (1 + i)⁻ⁿ) / i
= Annuité constante d'un emprunt V₀ : a = V₀ × i / (1 − (1 + i)⁻ⁿ)
= Exemple : V₀ = 1 000 000, i = 0,10, n = 3 : a = 100 000 / (1 − 1,1⁻³) = 100 000 / 0,2486852 ≈ 402 115 F CFA
= Année 1 : intérêt 100 000 ; amortissement 302 115 ; capital restant dû 697 885
= Année 2 : intérêt 69 788,5 ; amortissement 332 326,5 ; capital restant dû 365 558,5
= Année 3 : intérêt 36 556 ; amortissement 365 559 ; capital restant dû 0 (aux arrondis près)
- Chaque année : intérêt = capital restant dû × i ; amortissement = annuité − intérêt.
- Les amortissements forment une suite géométrique de raison 1 + i.
### Je vérifie
? Dans un emprunt à annuités constantes, que deviennent les intérêts au fil des années ?
+ Ils diminuent, car le capital restant dû diminue
- Ils augmentent
- Ils restent constants
! L'intérêt est calculé sur le capital restant dû, qui baisse à chaque remboursement.
? On verse 100 000 F CFA en fin d'année pendant 3 ans à 10 %. Valeur acquise juste après le dernier versement ?
+ 331 000 F CFA
- 300 000 F CFA
- 330 000 F CFA
! V₃ = 100 000 × (1,1³ − 1) / 0,1 = 100 000 × 3,31 = 331 000 F CFA.
### Je m'exerce
1. Calcule la valeur acquise de 6 annuités de 500 000 F CFA placées à 8 %, au moment du dernier versement.
2. Une PME emprunte 5 000 000 F CFA à 9 % sur 5 ans, par annuités constantes. Calcule l'annuité puis la première ligne du tableau d'amortissement.
### Corrigé
1. V₆ = 500 000 × (1,08⁶ − 1) / 0,08 = 500 000 × (1,586874 − 1) / 0,08 ≈ 500 000 × 7,335929 ≈ 3 667 965 F CFA.
2. a = 5 000 000 × 0,09 / (1 − 1,09⁻⁵) = 450 000 / 0,350069 ≈ 1 285 462 F CFA. Ligne 1 : capital dû 5 000 000 ; intérêt 450 000 ; amortissement 835 462 ; capital restant dû 4 164 538 F CFA.

## TN-MG-04 | Probabilités et espérance mathématique | 55 min
Objectif : Calculer des probabilités, des probabilités conditionnelles et l'espérance d'une variable aléatoire.
### Situation d'apprentissage
Le service des ressources humaines d'une entreprise de Yopougon organise une tombola pour la fête de fin d'année et étudie la répartition des diplômes des employés. Il faut calculer les chances de gain et le gain moyen d'un participant.
### Je retiens
> En situation d'équiprobabilité : P(A) = nombre de cas favorables / nombre de cas possibles.
= P(contraire de A) = 1 − P(A) ; P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
= Probabilité conditionnelle : P_B(A) = P(A ∩ B) / P(B)
= Combinaisons : nombre de façons de choisir p éléments parmi n, C(n, p) = n! / (p! (n − p)!) ; C(5, 2) = 10
= Espérance : E(X) = Σ xᵢ × pᵢ (moyenne des valeurs pondérées par leurs probabilités)
- Pour une loi de probabilité, la somme des pᵢ vaut 1.
- Un jeu est équitable si l'espérance du gain est nulle.
### Je vérifie
? On lance un dé équilibré. Probabilité d'obtenir un nombre pair ?
+ 1/2
- 1/3
- 1/6
! 3 cas favorables (2, 4, 6) sur 6 possibles.
? Gain X d'une tombola : −500 F CFA avec p = 0,7 ; 1 000 F CFA avec p = 0,2 ; 5 000 F CFA avec p = 0,1. Espérance ?
+ 350 F CFA
- 5 500 F CFA
- 1 833 F CFA
! E(X) = −350 + 200 + 500 = 350 F CFA.
### Je m'exerce
1. Une entreprise compte 40 employés : 25 hommes et 15 femmes ; 10 hommes et 6 femmes ont un BTS. On choisit un employé au hasard. Calcule P(BTS), P(femme et BTS) et la probabilité qu'il ait un BTS sachant que c'est une femme.
2. On choisit au hasard 2 délégués parmi 5 candidats dont Awa et Yao. Combien de choix possibles ? Quelle est la probabilité que Awa et Yao soient tous les deux choisis ?
### Corrigé
1. P(BTS) = 16 / 40 = 0,4 ; P(F ∩ BTS) = 6 / 40 = 0,15 ; P_F(BTS) = 0,15 / (15/40) = 6 / 15 = 0,4.
2. C(5, 2) = 5 × 4 / 2 = 10 choix possibles. Un seul choix contient Awa et Yao : probabilité 1 / 10 = 0,1.

## TN-MG-05 | Méthode pour l'épreuve du BAC | 60 min
Objectif : Organiser la résolution d'un sujet de mathématiques du BAC G en gérant le temps et la rédaction.
### Situation d'apprentissage
À un mois du BAC, les élèves de Terminale G2 d'un lycée technique d'Abidjan traitent un sujet blanc comportant un exercice de mathématiques financières, un exercice de statistiques et un problème sur une fonction.
### Je retiens
> Lire tout le sujet, puis commencer par l'exercice le mieux maîtrisé ; garder le problème pour un moment de concentration.
> Rédiger : formule littérale, remplacement par les valeurs, résultat avec l'unité (F CFA, années, %) et une phrase de conclusion.
> Garder 10 minutes pour relire : arrondis, unités, cohérence des résultats.
= Financier : I = C × t × j / 360 ; Cₙ = C₀(1 + i)ⁿ ; E = V × t × j / 360 ; a = V₀ × i / (1 − (1 + i)⁻ⁿ)
= Statistiques : x̄ ; V = Σnᵢxᵢ² / N − x̄² ; a = cov / V(x) ; b = ȳ − a x̄
= Analyse : qⁿ ≥ k équivaut à n ≥ ln k / ln q (q > 1) ; signe de la dérivée pour les variations
- Contrôler les ordres de grandeur : une valeur actuelle est inférieure au nominal ; une annuité est supérieure à V₀ / n ; une probabilité est entre 0 et 1.
- Arrondir seulement le résultat final, en gardant les calculs intermédiaires dans la calculatrice.
### Je vérifie
? Pour un emprunt de 3 000 000 F CFA sur 5 ans avec intérêts, une annuité calculée de 450 000 F CFA est :
+ impossible, car elle est inférieure à 3 000 000 / 5 = 600 000 F CFA
- correcte
- trop élevée
! Les annuités doivent rembourser au moins le capital, donc dépasser 600 000 F CFA par an.
? Quand faut-il arrondir dans un calcul financier ?
+ Seulement au résultat final
- À chaque étape
- Jamais
! Arrondir trop tôt accumule les erreurs, surtout avec les puissances.
### Je m'exerce
1. Sujet type. a) Un effet de 900 000 F CFA est escompté 45 jours avant l'échéance à 12 % : calcule l'escompte et la valeur actuelle. b) La valeur actuelle obtenue est placée à 5 % l'an, intérêts composés, pendant 2 ans : calcule la valeur acquise. c) Au bout de combien d'années entières ce placement dépasserait-il 1 000 000 F CFA ?
2. Pour la série xᵢ : 1, 2, 3, 4 et yᵢ : 3, 5, 6, 8, calcule le point moyen et la droite de régression de y en x.
### Corrigé
1. a) E = 900 000 × 0,12 × 45 / 360 = 13 500 F CFA ; a = 886 500 F CFA. b) C₂ = 886 500 × 1,05² = 886 500 × 1,1025 = 977 366,25 F CFA, soit environ 977 366 F CFA. c) 886 500 × 1,05ⁿ > 1 000 000 équivaut à 1,05ⁿ > 1,12803, soit n > ln 1,12803 / ln 1,05 ≈ 0,1205 / 0,0488 ≈ 2,47 ; il faut 3 ans.
2. x̄ = 2,5 ; ȳ = 5,5 ; G(2,5 ; 5,5). Σxᵢyᵢ = 3 + 10 + 18 + 32 = 63 ; cov = 63 / 4 − 13,75 = 2 ; V(x) = 1,25 ; a = 1,6 ; b = 5,5 − 4 = 1,5 ; y = 1,6x + 1,5.
