---
levels: Terminale C, Terminale D
subject: Mathématiques
---
# Analyse

## TS-MA-01 | Limites et continuité | 60 min
Objectif : Calculer des limites (formes indéterminées, théorèmes de comparaison) et utiliser la continuité.
### Je retiens
> Formes indéterminées : ∞ − ∞, 0 × ∞, ∞/∞, 0/0 ; on factorise, on utilise la quantité conjuguée ou les croissances comparées. Théorème des gendarmes : si g ≤ f ≤ h et lim g = lim h = L, alors lim f = L.
> Théorème des valeurs intermédiaires : si f est continue et strictement monotone sur [a ; b] et k entre f(a) et f(b), l'équation f(x) = k a une solution unique dans [a ; b].
### Je m'exerce
1. Calcule lim (x → +∞) (√(x + 1) − √x).
2. Montre que x³ + x − 1 = 0 a une unique solution dans [0 ; 1].
### Corrigé
1. On multiplie par la quantité conjuguée : 1/(√(x + 1) + √x) → 0.
2. f(x) = x³ + x − 1 est continue, strictement croissante (f'(x) = 3x² + 1 > 0), f(0) = −1 < 0 < f(1) = 1 : solution unique.

## TS-MA-02 | Dérivabilité et étude de fonctions | 60 min
Objectif : Étudier une fonction complète (asymptotes, variations, tangentes, courbe).
### Je retiens
= (u∘v)' = v' × u'∘v ;  (√u)' = u'/(2√u) ;  (uⁿ)' = n u' uⁿ⁻¹
> Asymptote verticale x = a si lim f = ±∞ en a ; horizontale y = b si lim f = b en ±∞ ; oblique y = ax + b si lim (f(x) − (ax + b)) = 0.
### Je m'exerce
1. f(x) = x + 1 + 1/(x − 1). Montre que y = x + 1 est asymptote oblique en +∞.
### Corrigé
1. f(x) − (x + 1) = 1/(x − 1) → 0 quand x → +∞.

## TS-MA-03 | Fonction logarithme népérien | 60 min
Objectif : Utiliser les propriétés de ln et étudier des fonctions avec ln.
### Je retiens
= ln(ab) = ln a + ln b ; ln(a/b) = ln a − ln b ; ln(aⁿ) = n ln a ; ln 1 = 0 ; ln e = 1
= (ln x)' = 1/x ; (ln u)' = u'/u ;  lim (x → +∞) ln x / x = 0 ; lim (x → 0⁺) x ln x = 0
### Je m'exerce
1. Résous ln(2x − 1) = ln(x + 3).
2. Dérive f(x) = ln(x² + 1).
### Corrigé
1. 2x − 1 = x + 3 avec x > 1/2 → x = 4.
2. f'(x) = 2x/(x² + 1).

## TS-MA-04 | Fonctions exponentielles | 60 min
Objectif : Utiliser la fonction exp et résoudre des équations et inéquations.
### Je retiens
= eᵃ⁺ᵇ = eᵃ eᵇ ; (eˣ)' = eˣ ; (eᵘ)' = u'eᵘ ; ln(eˣ) = x ; e^(ln x) = x (x > 0)
= lim (x → +∞) eˣ/x = +∞ ; lim (x → −∞) x eˣ = 0
### Je m'exerce
1. Résous e²ˣ − 3eˣ + 2 = 0.
### Corrigé
1. On pose X = eˣ : X² − 3X + 2 = 0 → X = 1 ou X = 2 → x = 0 ou x = ln 2.

## TS-MA-05 | Primitives et calcul intégral | 60 min
Objectif : Calculer des primitives, des intégrales et des aires.
### Je retiens
= ∫ₐᵇ f(x) dx = F(b) − F(a), où F est une primitive de f
= Intégration par parties : ∫ u v' = [uv] − ∫ u' v
> Si f ≥ 0 sur [a ; b], l'intégrale est l'aire (en unités d'aire) sous la courbe.
### Je m'exerce
1. Calcule ∫₀¹ (3x² + 2x) dx.
2. Calcule ∫₁ᵉ ln x dx.
### Corrigé
1. [x³ + x²]₀¹ = 2.
2. Par parties (u = ln x, v' = 1) : [x ln x]₁ᵉ − ∫₁ᵉ 1 dx = e − (e − 1) = 1.

## TS-MA-06 | Suites numériques : convergence et récurrence | 60 min
Objectif : Démontrer par récurrence et étudier la convergence d'une suite.
### Je retiens
> Raisonnement par récurrence : initialisation, hérédité, conclusion. Toute suite croissante majorée converge. Pour uₙ₊₁ = f(uₙ) convergente vers L avec f continue, L vérifie f(L) = L.
### Je m'exerce
1. u₀ = 1, uₙ₊₁ = ½uₙ + 2. Montre que vₙ = uₙ − 4 est géométrique et trouve la limite de uₙ.
### Corrigé
1. vₙ₊₁ = ½uₙ + 2 − 4 = ½(uₙ − 4) = ½vₙ : géométrique de raison ½, v₀ = −3 ; vₙ → 0 donc uₙ → 4.

## TS-MA-07 | Équations différentielles | 55 min
Objectif : Résoudre y' = ay + b et y'' + ω²y = 0.
### Je retiens
= y' = ay : y = C eᵃˣ ;  y' = ay + b : y = C eᵃˣ − b/a
= y'' + ω²y = 0 : y = A cos ωx + B sin ωx
### Je m'exerce
1. Résous y' = 2y avec y(0) = 3.
### Corrigé
1. y = 3e²ˣ.

# Algèbre et probabilités

## TS-MA-08 | Nombres complexes | 60 min
Objectif : Calculer avec les complexes (forme algébrique, trigonométrique, exponentielle) et résoudre z² = a.
### Je retiens
= z = a + ib ; |z| = √(a² + b²) ; z = r e^(iθ) = r(cos θ + i sin θ)
= Moivre : (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ
> Équation az² + bz + c = 0 avec Δ < 0 : z = (−b ± i√(−Δ))/(2a).
### Je m'exerce
1. Forme exponentielle de 1 + i.
2. Résous z² + 2z + 5 = 0.
### Corrigé
1. √2 e^(iπ/4).
2. Δ = −16 : z = −1 + 2i ou z = −1 − 2i.

## TS-MA-09 | Probabilités : conditionnement et loi binomiale | 60 min
Objectif : Calculer des probabilités conditionnelles et utiliser la loi binomiale.
### Je retiens
= P_B(A) = P(A ∩ B)/P(B) ; formule des probabilités totales
= Loi binomiale B(n ; p) : P(X = k) = Cₙᵏ pᵏ (1 − p)ⁿ⁻ᵏ ; E(X) = np ; V(X) = np(1 − p)
### Je m'exerce
1. On lance 5 fois une pièce équilibrée. Probabilité d'obtenir exactement 3 « pile » ?
### Corrigé
1. C₅³ (½)⁵ = 10/32 = 5/16.

## TS-MA-10 | Préparer l'épreuve de mathématiques du BAC | 60 min
Objectif : Gérer son temps et rédiger une copie efficace.
### Je retiens
> Lire tout le sujet ; repérer les questions indépendantes ; rédiger proprement en citant les théorèmes ; vérifier la cohérence des résultats (signe, ordre de grandeur) ; ne pas rester bloqué : admettre un résultat pour continuer. Le problème d'analyse porte souvent sur ln ou exp avec un calcul d'aire.
### Je m'exerce
1. Que faire si tu n'arrives pas à démontrer le résultat d'une question ?
### Corrigé
1. L'admettre (en le signalant) et l'utiliser pour traiter les questions suivantes.
