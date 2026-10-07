---
order: 3
subject: Mathématiques
series: Séries C et D
duration: Épreuve écrite
---
# Méthode
> Le sujet comprend en général des exercices (probabilités, complexes, suites, arithmétique en série C) et un problème d'analyse (étude de fonction ln ou exp, calcul d'aire).
1. **Lis tout le sujet** et repère les questions indépendantes.
2. **Justifie** : cite les théorèmes (valeurs intermédiaires, croissances comparées, intégration par parties…).
3. **Problème d'analyse** : domaine, limites (asymptotes), dérivée et signe, tableau de variations, tangentes, courbe soignée, puis calcul d'aire.
4. **Si tu bloques**, admets le résultat et continue.
5. **Vérifie** la cohérence : une probabilité est entre 0 et 1, une aire est positive.

# Sujet type 1 — Problème d'analyse
Soit f la fonction définie sur ]0 ; +∞[ par f(x) = x − 1 + ln(x)/x. On note (C) sa courbe.
1. a) Calcule la limite de f en 0 et en +∞.
   b) Montre que la droite (D) : y = x − 1 est asymptote à (C) en +∞ et étudie leur position relative.
2. On pose g(x) = x² + 1 − ln x sur ]0 ; +∞[. Étudie les variations de g et montre que g(x) > 0.
3. Montre que f'(x) = g(x)/x² et dresse le tableau de variations de f.
4. Calcule l'aire du domaine compris entre (C), (D) et les droites x = 1 et x = e.
## Corrigé
1. a) En 0⁺ : ln x → −∞ et 1/x → +∞, donc ln(x)/x → −∞ et f(x) → −∞. En +∞ : ln(x)/x → 0 (croissances comparées), donc f(x) → +∞.
   b) f(x) − (x − 1) = ln(x)/x → 0 en +∞ : (D) est asymptote oblique. Le signe de ln(x)/x est celui de ln x : (C) est au-dessous de (D) sur ]0 ; 1[, au-dessus sur ]1 ; +∞[, et elles se coupent en x = 1.
2. g'(x) = 2x − 1/x = (2x² − 1)/x, nul pour x = 1/√2. g est décroissante sur ]0 ; 1/√2], croissante ensuite. Minimum : g(1/√2) = 1/2 + 1 + (ln 2)/2 > 0. Donc g(x) > 0 pour tout x > 0.
3. f'(x) = 1 + (1 − ln x)/x² = (x² + 1 − ln x)/x² = g(x)/x² > 0 : f est strictement croissante sur ]0 ; +∞[ (de −∞ à +∞).
4. Sur [1 ; e], (C) est au-dessus de (D) : A = ∫₁ᵉ ln(x)/x dx = [(ln x)²/2]₁ᵉ = 1/2 unité d'aire.

# Sujet type 2 — Probabilités et nombres complexes
**Exercice 1** — Une urne contient 4 boules rouges et 6 boules vertes. On tire successivement et avec remise 3 boules. X est le nombre de boules rouges obtenues.
1. Justifie que X suit une loi binomiale et donne ses paramètres.
2. Calcule P(X = 2) et P(X ≥ 1).
3. Calcule l'espérance de X.
**Exercice 2** — Résous dans ℂ l'équation z² − 2z + 4 = 0, puis écris les solutions sous forme exponentielle.
## Corrigé
**Exercice 1**
1. Trois épreuves identiques et indépendantes (tirage avec remise) à deux issues (rouge avec p = 0,4) : X suit B(3 ; 0,4).
2. P(X = 2) = C₃² × 0,4² × 0,6 = 3 × 0,16 × 0,6 = 0,288. P(X ≥ 1) = 1 − P(X = 0) = 1 − 0,6³ = 1 − 0,216 = 0,784.
3. E(X) = np = 3 × 0,4 = 1,2.
**Exercice 2**
Δ = 4 − 16 = −12 = (2i√3)². z₁ = 1 + i√3, z₂ = 1 − i√3. Le module de z₁ vaut √(1 + 3) = 2 et arg(z₁) = π/3 : z₁ = 2e^(iπ/3), z₂ = 2e^(−iπ/3).

# QCM
? lim (x → +∞) ln(x)/x vaut :
+ 0
- +∞
- 1
! Croissances comparées : x l'emporte sur ln x.
? La dérivée de ln(u) est :
- 1/u
+ u'/u
- u' ln u
! (ln u)' = u'/u, pour u > 0.
? Une primitive de 2x eˣ² est :
+ eˣ²
- 2 eˣ²
- x² eˣ²
! (eᵘ)' = u' eᵘ avec u = x².
? ∫₀¹ 3x² dx vaut :
- 3
+ 1
- 1/3
! [x³]₀¹ = 1.
? Le module de 3 + 4i est :
- 7
+ 5
- 25
! √(9 + 16) = 5.
? Si X suit B(10 ; 0,3), son espérance vaut :
+ 3
- 0,3
- 7
! E(X) = np = 10 × 0,3.
? La suite définie par uₙ = 5 × 2ⁿ est :
- arithmétique de raison 2
+ géométrique de raison 2
- constante
! On passe d'un terme au suivant en multipliant par 2.
? Les solutions de y' = 3y sont :
+ y = C e³ˣ
- y = 3x + C
- y = C e^(x/3)
! y' = ay a pour solutions y = C eᵃˣ.
? e^(ln 5) est égal à :
- ln 5
+ 5
- e⁵
! exp et ln sont des fonctions réciproques.
? Le PGCD de 84 et 60 est (série C) :
- 6
+ 12
- 24
! 84 = 60 + 24 ; 60 = 2 × 24 + 12 ; 24 = 2 × 12 : PGCD = 12.
? P(A ∩ B) = P(A) × P(B) signifie que A et B sont :
+ indépendants
- incompatibles
- contraires
! C'est la définition de l'indépendance de deux événements.
? La forme exponentielle de 1 + i est :
+ √2 e^(iπ/4)
- 2 e^(iπ/4)
- √2 e^(iπ/2)
! Le module vaut √(1 + 1) = √2 et un argument est π/4 (cos θ = sin θ = √2/2).
