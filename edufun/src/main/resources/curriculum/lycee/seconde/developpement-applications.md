---
levels: Seconde A, Seconde C, Seconde E, Seconde F1, Seconde F2, Seconde F3, Seconde F4, Seconde F7, Seconde G1, Seconde G2
subject: Développement d'applications
---
# Programmer en Python

## 2N-DA-01 | Variables, types et entrées-sorties | 60 min
Objectif : Écrire un programme Python qui lit des données et affiche un résultat.
### Je retiens
> Types de base : entier (int), décimal (float), texte (str), booléen (bool). input() lit du texte ; on le convertit avec int() ou float().
= nom = input("Ton nom : ")
= age = int(input("Ton âge : "))
= print(f"Bonjour {nom}, dans 5 ans tu auras {age + 5} ans.")
### Je vérifie
? Quel est le type de la valeur renvoyée par input() ?
+ str (texte)
- int
- float
! input() renvoie toujours du texte : il faut le convertir pour calculer.
? Que vaut 7 // 2 en Python ?
- 3,5
+ 3
- 1
! // est la division entière ; 7 % 2 donnerait le reste, 1.
### Je m'exerce
1. Écris un programme qui convertit des francs CFA en euros (1 € = 655,957 F CFA).
### Corrigé
1. f = float(input("Montant en F CFA : ")) ; print(round(f / 655.957, 2), "€")

## 2N-DA-02 | Conditions et boucles | 60 min
Objectif : Utiliser if/elif/else, while et for.
### Je retiens
= note = float(input("Note : "))
= if note >= 16:
=     print("Très bien")
= elif note >= 10:
=     print("Admis")
= else:
=     print("Ajourné")
= for i in range(1, 11): print(7, "x", i, "=", 7 * i)
> En Python, l'indentation délimite les blocs ; while répète tant qu'une condition est vraie.
### Je vérifie
? Combien de fois s'exécute « for i in range(1, 11) » ?
- 11 fois
+ 10 fois
- 1 fois
! range(1, 11) produit les nombres de 1 à 10.
? Quel mot-clé teste une deuxième condition après if ?
+ elif
- elseif
- then
! elif signifie « sinon si ».
### Je m'exerce
1. Écris une boucle qui demande un mot de passe jusqu'à ce qu'il soit correct.
### Corrigé
1. On initialise mdp à une chaîne vide, puis « while mdp != "Edufun2026": mdp = input("Mot de passe : ") », et après la boucle « print("Accès autorisé") ».

## 2N-DA-03 | Les fonctions | 60 min
Objectif : Définir et appeler des fonctions avec paramètres et valeur de retour.
### Je retiens
= def moyenne(notes):
=     return sum(notes) / len(notes)
= print(moyenne([12, 15, 9]))  # 12.0
> Une fonction rend le code plus clair, réutilisable et facile à tester.
### Je vérifie
? Que renvoie moyenne([10, 20]) ?
- 30
+ 15.0
- 10
! (10 + 20) / 2 = 15.0.
? Quel mot-clé définit une fonction en Python ?
+ def
- function
- fun
! On écrit def nom(paramètres): puis le bloc indenté.
### Je m'exerce
1. Écris une fonction est_pair(n) qui renvoie True si n est pair.
### Corrigé
1. def est_pair(n): return n % 2 == 0

## 2N-DA-04 | Les listes et les dictionnaires | 60 min
Objectif : Stocker et parcourir des collections de données.
### Je retiens
= villes = ["Abidjan", "Bouaké", "Daloa"] ; villes.append("Korhogo")
= capitales = {"Ghana": "Accra", "Mali": "Bamako"} ; print(capitales["Mali"])
> Une liste est ordonnée (index à partir de 0) ; un dictionnaire associe des clés à des valeurs.
### Je vérifie
? Que vaut villes[0] ?
+ « Abidjan »
- « Bouaké »
- Une erreur
! En Python, les index commencent à 0.
? Que renvoie capitales["Ghana"] ?
- Bamako
+ Accra
- Ghana
! La clé « Ghana » est associée à la valeur « Accra ».
### Je m'exerce
1. Crée un dictionnaire des notes de 3 élèves et affiche celui qui a la meilleure note.
### Corrigé
1. notes = {"Awa": 15, "Yao": 11, "Aya": 13} ; print(max(notes, key=notes.get))  # Awa

## 2N-DA-05 | Projet : calculateur de moyenne trimestrielle | 60 min
Objectif : Réaliser un programme complet avec coefficients et mentions.
### Je retiens
> Moyenne pondérée = Σ(note × coefficient) / Σ(coefficients). On découpe le programme en fonctions : saisie, calcul, mention, affichage.
### Je vérifie
? Notes 12 (coef 3) et 8 (coef 1) : quelle est la moyenne pondérée ?
- 10
+ 11
- 12
! (12 × 3 + 8 × 1) / 4 = 44 / 4 = 11.
? Pourquoi découper le programme en fonctions ?
+ Pour le rendre lisible et facile à tester
- Pour qu'il soit plus long
- Parce que Python l'exige
! Chaque fonction a un rôle précis ; on peut la tester séparément.
### Je m'exerce
1. Écris la fonction moyenne_ponderee(notes, coefs).
### Corrigé
1. def moyenne_ponderee(notes, coefs): return sum(n * c for n, c in zip(notes, coefs)) / sum(coefs)
