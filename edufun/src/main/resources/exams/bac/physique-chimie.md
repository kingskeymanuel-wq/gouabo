---
order: 5
subject: Physique-Chimie
series: Séries C et D
duration: Épreuve écrite
---
# Méthode
> Le sujet associe chimie (organique, acides-bases, cinétique) et physique (mécanique, électricité, nucléaire). On attend un raisonnement rédigé : système, référentiel, bilan des forces, loi utilisée.
1. **Mécanique** : précise le système et le référentiel, fais le bilan des forces, applique la 2e loi de Newton, projette sur les axes, intègre pour obtenir v(t) et x(t).
2. **Électricité** : écris les lois (maille, Ohm, q = Cu), établis l'équation différentielle, vérifie la solution.
3. **Chimie** : écris les équations équilibrées, utilise un tableau d'avancement, attention aux unités (mol, mol/L, L).
4. **Résultats** : unités, chiffres significatifs, cohérence physique.

# Sujet type 1 — Mécanique et radioactivité
**Exercice 1** — Un ballon de masse m = 0,45 kg est frappé depuis le sol avec une vitesse v₀ = 20 m/s faisant un angle α = 30° avec l'horizontale (g = 10 m/s², frottements négligés).
1. Établis les équations horaires x(t) et z(t).
2. Détermine l'instant où le ballon atteint le sommet et l'altitude maximale.
3. Calcule la portée.
**Exercice 2** — Le carbone 14 a une demi-vie de 5 730 ans. Un fragment de bois ancien a une activité égale à 25 % de celle d'un bois actuel.
1. Que signifie « demi-vie » ?
2. Détermine l'âge du fragment.
## Corrigé
**Exercice 1**
1. a = g (vers le bas). x(t) = v₀ cos α · t = 17,3 t ; z(t) = −5 t² + v₀ sin α · t = −5 t² + 10 t.
2. Au sommet, v_z = 0 : −10 t + 10 = 0 → t = 1 s ; z_max = −5 + 10 = 5 m.
3. z = 0 pour t = 2 s : portée x = 17,3 × 2 ≈ 34,6 m (ou v₀² sin 2α / g = 400 × 0,866 / 10 ≈ 34,6 m).
**Exercice 2**
1. Durée au bout de laquelle la moitié des noyaux radioactifs initialement présents s'est désintégrée.
2. 25 % = 1/4 = (1/2)² : deux demi-vies, soit 2 × 5 730 = 11 460 ans.

# Sujet type 2 — Dosage acido-basique et charge d'un condensateur
**Exercice 1 (chimie)** — Dans un laboratoire de contrôle qualité à Abidjan, un technicien dose V_a = 20,0 mL d'une solution d'acide éthanoïque CH₃COOH de concentration C_a inconnue par une solution d'hydroxyde de sodium de concentration C_b = 0,10 mol/L. L'équivalence est obtenue pour un volume V_bE = 16,0 mL. On donne pKa(CH₃COOH/CH₃COO⁻) = 4,8 à 25 °C.
1. Écris l'équation de la réaction de dosage et précise ses caractéristiques.
2. Définis l'équivalence et calcule C_a.
3. Quel est le pH du mélange à la demi-équivalence ? Justifie.
4. Le pH à l'équivalence est-il inférieur, égal ou supérieur à 7 ? Justifie et propose un indicateur coloré adapté parmi : hélianthine (3,1 – 4,4), bleu de bromothymol (6,0 – 7,6), phénolphtaléine (8,2 – 10).
**Exercice 2 (physique)** — Un élève de Terminale D à Daloa charge un condensateur de capacité C = 100 µF, initialement déchargé, à travers un conducteur ohmique de résistance R = 10 kΩ, à l'aide d'un générateur de tension constante E = 12 V. À t = 0, il ferme l'interrupteur.
1. Établis l'équation différentielle vérifiée par la tension u_C aux bornes du condensateur.
2. Vérifie que u_C(t) = E(1 − e^(−t/τ)) est solution et donne l'expression et la valeur de τ.
3. Calcule u_C à l'instant t = τ. Au bout de combien de temps considère-t-on le condensateur chargé ?
4. Calcule l'énergie emmagasinée par le condensateur en fin de charge.
## Corrigé
**Exercice 1 (10 points)**
1. CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O. Réaction rapide, totale et exothermique, qui peut donc servir de support au dosage. (2 pts)
2. À l'équivalence, les réactifs ont été mélangés dans les proportions stœchiométriques : C_a × V_a = C_b × V_bE, d'où C_a = 0,10 × 16,0 / 20,0 = 0,080 mol/L. (3 pts)
3. À la demi-équivalence (V_b = 8,0 mL), la moitié de l'acide a été transformée : [CH₃COOH] = [CH₃COO⁻], donc pH = pKa + log([CH₃COO⁻]/[CH₃COOH]) = pKa = 4,8. (2 pts)
4. À l'équivalence, la solution contient des ions éthanoate CH₃COO⁻, base faible, et des ions Na⁺ indifférents : la solution est basique, pH > 7. L'indicateur adapté est la phénolphtaléine, dont la zone de virage (8,2 – 10) contient le pH à l'équivalence. (3 pts)
**Exercice 2 (10 points)**
1. Loi des mailles : E = u_R + u_C = R i + u_C, avec i = dq/dt = C du_C/dt. D'où RC du_C/dt + u_C = E. (3 pts)
2. du_C/dt = (E/τ) e^(−t/τ). En remplaçant : RC (E/τ) e^(−t/τ) + E − E e^(−t/τ) = E, ce qui est vérifié pour tout t si τ = RC. De plus u_C(0) = 0 (condensateur déchargé). τ = RC = 10 × 10³ × 100 × 10⁻⁶ = 1,0 s. (3 pts)
3. u_C(τ) = E(1 − e⁻¹) = 12 × 0,632 ≈ 7,6 V, soit 63 % de E. On considère le condensateur chargé au bout de 5τ = 5 s (u_C atteint alors plus de 99 % de E). (2 pts)
4. W = ½ C E² = 0,5 × 100 × 10⁻⁶ × 12² = 7,2 × 10⁻³ J = 7,2 mJ. (2 pts)

# QCM
? La 2e loi de Newton s'écrit :
+ Σ F = m a
- Σ F = m v
- F = m g h
! La somme des forces extérieures égale la masse fois l'accélération du centre d'inertie.
? La constante de temps d'un dipôle RC vaut :
- R/C
+ R × C
- 1/(RC)
! τ = RC, en secondes.
? La période propre d'un circuit LC est :
+ 2π√(LC)
- 2πLC
- √(L/C)
! T₀ = 2π√(LC).
? Le pH d'une solution d'acide chlorhydrique à 10⁻³ mol/L vaut :
- 11
+ 3
- 7
! Acide fort : pH = −log C = 3.
? L'oxydation ménagée d'un alcool secondaire donne :
- un aldéhyde
+ une cétone
- un acide carboxylique
! Les alcools primaires donnent aldéhydes puis acides ; les secondaires, des cétones.
? Après 3 demi-vies, il reste :
+ 1/8 des noyaux initiaux
- 1/3
- 1/6
! (1/2)³ = 1/8.
? Le rayon de la trajectoire d'une particule chargée dans un champ magnétique est :
- R = qB/(mv)
+ R = mv/(qB), avec q pris en valeur absolue
- R = mvB
! R augmente avec la vitesse et la masse, diminue avec la charge (en valeur absolue) et B.
? La loi de Lenz affirme que le courant induit :
+ s'oppose à la cause qui lui donne naissance
- renforce la variation du flux
- n'existe pas sans pile
! C'est une loi de modération.
? À l'équivalence d'un dosage acide fort-base forte à 25 °C, le pH vaut :
- 3
+ 7
- 10
! La solution obtenue est neutre.
? Le catalyseur :
+ accélère la réaction sans être consommé
- augmente la quantité de produit final
- ralentit la réaction
! Il modifie la vitesse, pas l'état final.
? La réaction d'estérification entre un acide carboxylique et un alcool est :
+ lente, limitée et athermique
- rapide et totale
- lente et totale
! Elle conduit à un équilibre (avec l'hydrolyse) ; un catalyseur (ions H⁺) ou la chaleur accélèrent l'atteinte de l'équilibre sans le déplacer.
? Dans l'expérience des fentes de Young, l'interfrange vaut :
+ i = λD/a
- i = aD/λ
- i = λa/D
! L'interfrange augmente avec la longueur d'onde λ et la distance D à l'écran, et diminue quand l'écart a entre les fentes augmente.
