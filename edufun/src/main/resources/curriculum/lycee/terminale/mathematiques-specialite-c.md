---
level: Terminale C
subject: Mathématiques
---
# Arithmétique et géométrie (série C)

## TC-MA-01 | Arithmétique : divisibilité, PGCD, congruences | 60 min
Objectif : Utiliser la division euclidienne, l'algorithme d'Euclide et les congruences.
### Je retiens
> a ≡ b [n] signifie que n divise a − b. Algorithme d'Euclide : PGCD(a ; b) = PGCD(b ; r). Théorème de Bézout : a et b premiers entre eux ⇔ il existe u, v tels que au + bv = 1. Théorème de Gauss : si a | bc et PGCD(a ; b) = 1, alors a | c.
### Je vérifie
? Que signifie a ≡ b [n] ?
+ n divise a − b
- a divise b
- a et b sont premiers entre eux
! La congruence modulo n signifie que n divise a − b.
? Calcule PGCD(84 ; 36).
+ 12
- 6
- 4
! 84 = 2 × 36 + 12 et 36 = 3 × 12 : le dernier reste non nul est 12.
### Je m'exerce
1. Calcule PGCD(252 ; 198).
2. Reste de la division de 7¹⁰⁰ par 5.
### Corrigé
1. 252 = 198 + 54 ; 198 = 3 × 54 + 36 ; 54 = 36 + 18 ; 36 = 2 × 18 : PGCD = 18.
2. 7 ≡ 2 [5], 2⁴ ≡ 1 [5], 100 = 4 × 25 → 7¹⁰⁰ ≡ 1 [5] : reste 1.

## TC-MA-02 | Les similitudes planes | 60 min
Objectif : Caractériser une similitude directe par son écriture complexe.
### Je retiens
> Une similitude directe a pour écriture complexe z' = az + b (a ≠ 0). Si a ≠ 1 : centre Ω d'affixe b/(1 − a), rapport |a|, angle arg(a). Elle multiplie les distances par |a| et conserve les angles orientés.
### Je vérifie
? L'écriture complexe d'une similitude directe est :
+ z' = az + b avec a ≠ 0
- z' = a + b
- z' = az² + b
! Toute similitude directe s'écrit z' = az + b avec a non nul.
? Caractérise z' = 3z + 4.
+ Rapport 3, angle 0, centre d'affixe −2
- Rapport 4, angle 0, centre d'affixe 3
- Rapport 3, angle π, centre d'affixe 2
! Centre b/(1 − a) = 4/(−2) = −2, rapport 3 (module de a), arg(3) = 0.
### Je m'exerce
1. Caractérise z' = (1 + i)z + 2.
### Corrigé
1. Rapport √2, angle π/4, centre ω = 2/(1 − 1 − i) = 2/(−i) = 2i.

## TC-MA-03 | Les coniques | 60 min
Objectif : Reconnaître parabole, ellipse et hyperbole par leur équation réduite.
### Je retiens
= Parabole : y² = 2px ; Ellipse : x²/a² + y²/b² = 1 ; Hyperbole : x²/a² − y²/b² = 1
> Définition par foyer et directrice : MF = e × d(M, D) ; e = 1 parabole, e < 1 ellipse, e > 1 hyperbole.
### Je vérifie
? Une conique d'excentricité e < 1 est :
+ une ellipse
- une parabole
- une hyperbole
! e = 1 parabole, e < 1 ellipse, e > 1 hyperbole.
? Quelle est la nature de la conique x²/16 − y²/9 = 1 ?
+ Une hyperbole
- Une ellipse
- Une parabole
! Le signe moins entre les deux termes caractérise l'hyperbole.
### Je m'exerce
1. Nature de la conique x²/25 + y²/9 = 1 ?
### Corrigé
1. Une ellipse (a = 5, b = 3).
