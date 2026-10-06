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
### Je vérifie
? Quelle méthode utiliser pour lever la forme indéterminée de √(x + 1) − √x en +∞ ?
+ Multiplier par la quantité conjuguée
- Remplacer x par 0
- Dériver la fonction
! La quantité conjuguée transforme la différence en quotient.
? Calcule la limite en +∞ de (2x² + 1)/(x² + 3).
+ 2
- 1/3
- +∞
! On factorise par x² : le quotient tend vers 2/1 = 2.
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
### Je vérifie
? La dérivée de √u est :
+ u'/(2√u)
- 1/(2√u)
- 2u'√u
! (√u)' = u'/(2√u).
? f(x) = 2 + 1/x. Quelle asymptote la courbe admet-elle en +∞ ?
+ La droite horizontale y = 2
- La droite verticale x = 2
- La droite oblique y = 2x
! 1/x tend vers 0, donc f(x) tend vers 2.
### Je m'exerce
1. f(x) = x + 1 + 1/(x − 1). Montre que y = x + 1 est asymptote oblique en +∞.
### Corrigé
1. f(x) − (x + 1) = 1/(x − 1) → 0 quand x → +∞.

## TS-MA-03 | Fonction logarithme népérien | 60 min
Objectif : Utiliser les propriétés de ln et étudier des fonctions avec ln.
### Je retiens
= ln(ab) = ln a + ln b ; ln(a/b) = ln a − ln b ; ln(aⁿ) = n ln a ; ln 1 = 0 ; ln e = 1
= (ln x)' = 1/x ; (ln u)' = u'/u ;  lim (x → +∞) ln x / x = 0 ; lim (x → 0⁺) x ln x = 0
### Je vérifie
? ln(a × b) est égal à :
+ ln a + ln b
- ln a × ln b
- ln a − ln b
! Le logarithme transforme un produit en somme.
? Dérive f(x) = ln(3x + 1).
+ 3/(3x + 1)
- 1/(3x + 1)
- 3 ln(3x + 1)
! (ln u)' = u'/u avec u' = 3.
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
### Je vérifie
? Quelle est la dérivée de e^(3x) ?
+ 3e^(3x)
- e^(3x)
- 3x e^(3x − 1)
! (eᵘ)' = u'eᵘ avec u' = 3.
? Résous eˣ = 5.
+ x = ln 5
- x = 5e
- x = e⁵
! On applique ln : ln(eˣ) = x = ln 5.
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
### Je vérifie
? Si F est une primitive de f, l'intégrale de a à b de f vaut :
+ F(b) − F(a)
- F(a) − F(b)
- f(b) − f(a)
! ∫ₐᵇ f(x) dx = F(b) − F(a).
? Calcule ∫₀² 2x dx.
+ 4
- 2
- 8
! Une primitive est x² : 2² − 0² = 4.
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
### Je vérifie
? Quelles sont les étapes d'un raisonnement par récurrence ?
+ Initialisation, hérédité, conclusion
- Hypothèse, calcul, limite
- Factorisation, dérivation, conclusion
! On vérifie le premier rang, puis le passage de n à n + 1, puis on conclut.
? uₙ₊₁ = ½uₙ + 3 converge vers L. Que vaut L ?
+ 6
- 3
- 1,5
! L vérifie L = ½L + 3, donc ½L = 3 et L = 6.
### Je m'exerce
1. u₀ = 1, uₙ₊₁ = ½uₙ + 2. Montre que vₙ = uₙ − 4 est géométrique et trouve la limite de uₙ.
### Corrigé
1. vₙ₊₁ = ½uₙ + 2 − 4 = ½(uₙ − 4) = ½vₙ : géométrique de raison ½, v₀ = −3 ; vₙ → 0 donc uₙ → 4.

## TS-MA-07 | Équations différentielles | 55 min
Objectif : Résoudre y' = ay + b et y'' + ω²y = 0.
### Je retiens
= y' = ay : y = C eᵃˣ ;  y' = ay + b : y = C eᵃˣ − b/a
= y'' + ω²y = 0 : y = A cos ωx + B sin ωx
### Je vérifie
? Quelles sont les solutions de y'' + 4y = 0 ?
+ y = A cos 2x + B sin 2x
- y = A cos 4x + B sin 4x
- y = C e⁴ˣ
! Ici ω² = 4, donc ω = 2.
? Résous y' = −3y avec y(0) = 2.
+ y = 2e^(−3x)
- y = −3e^(2x)
- y = 2e^(3x)
! y = Ce^(−3x) et y(0) = C = 2.
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
### Je vérifie
? Quel est le module de z = 3 + 4i ?
+ 5
- 7
- 25
! Module = √(9 + 16) = √25 = 5.
? Résous z² + 2z + 2 = 0.
+ z = −1 + i ou z = −1 − i
- z = 1 + i ou z = 1 − i
- z = −2 + 2i ou z = −2 − 2i
! Δ = 4 − 8 = −4, donc z = (−2 ± 2i)/2 = −1 ± i.
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
### Je vérifie
? X suit la loi binomiale B(10 ; 0,3). Quelle est son espérance ?
+ 3
- 0,3
- 2,1
! E(X) = np = 10 × 0,3 = 3 (2,1 est la variance).
? On lance 3 fois une pièce équilibrée. Probabilité d'obtenir exactement 2 « pile » ?
+ 3/8
- 1/8
- 2/3
! C₃² × (½)³ = 3 × 1/8 = 3/8.
### Je m'exerce
1. On lance 5 fois une pièce équilibrée. Probabilité d'obtenir exactement 3 « pile » ?
### Corrigé
1. C₅³ (½)⁵ = 10/32 = 5/16.

## TS-MA-10 | Préparer l'épreuve de mathématiques du BAC | 60 min
Objectif : Gérer son temps et rédiger une copie efficace.
### Je retiens
> Lire tout le sujet ; repérer les questions indépendantes ; rédiger proprement en citant les théorèmes ; vérifier la cohérence des résultats (signe, ordre de grandeur) ; ne pas rester bloqué : admettre un résultat pour continuer. Le problème d'analyse porte souvent sur ln ou exp avec un calcul d'aire.
### Je vérifie
? Ibrahim n'arrive pas à démontrer le résultat d'une question. Que doit-il faire ?
+ L'admettre en le signalant et continuer
- Abandonner tout l'exercice
- Inventer une démonstration fausse
! Un résultat admis permet de traiter les questions suivantes.
? Pourquoi lire tout le sujet au début de l'épreuve ?
+ Pour repérer les questions indépendantes et organiser son temps
- Pour recopier l'énoncé
- Pour finir plus vite sans réfléchir
! La lecture complète aide à repérer les questions indépendantes.
### Je m'exerce
1. Que faire si tu n'arrives pas à démontrer le résultat d'une question ?
### Corrigé
1. L'admettre (en le signalant) et l'utiliser pour traiter les questions suivantes.
