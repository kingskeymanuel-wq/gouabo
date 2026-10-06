---
levels: Première C, Première D
subject: Mathématiques
---
# Analyse

## 1S-MA-01 | Limites et continuité (introduction) | 60 min
Objectif : Calculer des limites de fonctions polynômes et rationnelles.
### Je retiens
> En ±∞, un polynôme a la même limite que son terme de plus haut degré ; une fonction rationnelle a la même limite que le quotient des termes de plus haut degré.
= lim (x → +∞) (2x³ − x + 1) = +∞ ;  lim (x → +∞) (3x² + 1)/(x² − 4) = 3
> Forme « a/0 » : on étudie le signe du dénominateur (limite à gauche et à droite).
### Je m'exerce
1. Calcule lim (x → −∞) (−x² + 5x).
2. Calcule lim (x → 2⁺) 1/(x − 2).
### Corrigé
1. −∞.
2. +∞.

## 1S-MA-02 | Dérivation | 60 min
Objectif : Calculer des dérivées et déterminer une tangente.
### Je retiens
= (xⁿ)' = n xⁿ⁻¹ ; (u + v)' = u' + v' ; (uv)' = u'v + uv' ; (u/v)' = (u'v − uv')/v²
= Tangente en a : y = f'(a)(x − a) + f(a)
### Je m'exerce
1. Dérive f(x) = 3x⁴ − 2x + 7 ; g(x) = (2x + 1)/(x − 3).
2. Équation de la tangente à f(x) = x² en a = 3.
### Corrigé
1. f'(x) = 12x³ − 2 ; g'(x) = (2(x − 3) − (2x + 1))/(x − 3)² = −7/(x − 3)².
2. y = 6(x − 3) + 9 = 6x − 9.

## 1S-MA-03 | Étude et représentation de fonctions | 60 min
Objectif : Étudier les variations d'une fonction grâce au signe de sa dérivée.
### Je retiens
> Si f' > 0 sur I, f est strictement croissante ; si f' < 0, strictement décroissante. Un extremum local correspond à un changement de signe de f'. Plan d'étude : domaine, limites, dérivée, tableau de variations, courbe.
### Je m'exerce
1. Étudie les variations de f(x) = x³ − 3x.
### Corrigé
1. f'(x) = 3x² − 3 = 3(x − 1)(x + 1) ; f croissante sur ]−∞ ; −1], décroissante sur [−1 ; 1], croissante sur [1 ; +∞[ ; maximum f(−1) = 2, minimum f(1) = −2.

## 1S-MA-04 | Les suites numériques | 60 min
Objectif : Étudier une suite arithmétique ou géométrique et calculer des sommes.
### Je retiens
= Arithmétique : uₙ = u₀ + nr ; somme de termes consécutifs = nombre de termes × (premier + dernier)/2
= Géométrique : uₙ = u₀qⁿ ; 1 + q + … + qⁿ = (1 − qⁿ⁺¹)/(1 − q) (q ≠ 1)
### Je m'exerce
1. Calcule 1 + 2 + … + 100.
2. Une population de 1 000 bactéries double chaque heure. Combien après 10 h ?
### Corrigé
1. 100 × 101/2 = 5 050.
2. 1 000 × 2¹⁰ = 1 024 000.

## 1S-MA-05 | Équations trigonométriques | 55 min
Objectif : Résoudre cos x = cos a, sin x = sin a.
### Je retiens
= cos x = cos a ⇔ x = a + 2kπ ou x = −a + 2kπ
= sin x = sin a ⇔ x = a + 2kπ ou x = π − a + 2kπ (k ∈ ℤ)
= cos(a + b) = cos a cos b − sin a sin b ; sin 2a = 2 sin a cos a
### Je m'exerce
1. Résous dans ℝ : cos x = 1/2.
### Corrigé
1. x = π/3 + 2kπ ou x = −π/3 + 2kπ.

# Géométrie, dénombrement et statistiques

## 1S-MA-06 | Le produit scalaire | 60 min
Objectif : Calculer un produit scalaire et l'utiliser (orthogonalité, longueurs, angles).
### Je retiens
= u·v = xx' + yy' (repère orthonormé) ; u·v = ‖u‖ ‖v‖ cos(u, v)
= u ⊥ v ⇔ u·v = 0 ;  Al-Kashi : a² = b² + c² − 2bc cos Â
### Je m'exerce
1. u(3 ; −2), v(4 ; 6). Sont-ils orthogonaux ?
### Corrigé
1. 12 − 12 = 0 : oui.

## 1S-MA-07 | Le dénombrement | 60 min
Objectif : Dénombrer avec les arrangements, permutations et combinaisons.
### Je retiens
= Permutations de n objets : n! ; Arrangements : Aₙᵖ = n!/(n − p)! ; Combinaisons : Cₙᵖ = n!/(p!(n − p)!)
> L'ordre compte : arrangement ; l'ordre ne compte pas : combinaison.
### Je m'exerce
1. De combien de façons peut-on élire un président et un secrétaire parmi 10 élèves ?
2. Combien de groupes de 3 élèves parmi 10 ?
### Corrigé
1. A₁₀² = 90.
2. C₁₀³ = 120.

## 1S-MA-08 | Statistiques à deux variables | 55 min
Objectif : Représenter un nuage de points et déterminer une droite d'ajustement.
### Je retiens
> Point moyen G(x̄ ; ȳ). Méthode de Mayer : on partage le nuage en deux groupes et on trace la droite passant par leurs points moyens. Méthode des moindres carrés : y = ax + b avec a = cov(x, y)/V(x) et b = ȳ − a x̄.
### Je m'exerce
1. Quel point appartient toujours à la droite des moindres carrés ?
### Corrigé
1. Le point moyen G(x̄ ; ȳ).
