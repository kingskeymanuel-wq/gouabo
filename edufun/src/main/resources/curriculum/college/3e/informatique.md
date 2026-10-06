---
level: 3e
subject: Informatique
---
# Numérique et société

## 3E-IN-01 | Le Web : comment fonctionne un site | 50 min
Objectif : Comprendre l'adresse web, le navigateur et le langage HTML.
### Je retiens
> Une page web est écrite en HTML (structure) et CSS (présentation). Le navigateur (Chrome, Firefox) affiche la page à partir de son adresse (URL). Le protocole « https » indique une connexion sécurisée.
= <h1>Mon école</h1> <p>Bienvenue au collège moderne de Bouaké.</p>
### Je vérifie
? Que signifie le « s » de https ?
+ sécurisé
- site
- serveur
! Avec https, les échanges sont chiffrés.
? Dans une page web, le langage CSS sert à :
+ gérer la présentation (couleurs, mise en forme)
- définir la structure du contenu
- afficher la page à la place du navigateur
! HTML donne la structure, CSS la présentation.
### Je m'exerce
1. Que signifie le « s » de https ?
### Corrigé
1. Sécurisé : les échanges sont chiffrés.

## 3E-IN-02 | Données personnelles et cybersécurité | 50 min
Objectif : Protéger ses comptes et ses données.
### Je retiens
> Mot de passe long et unique (phrase de passe), double authentification, méfiance face aux liens suspects (hameçonnage / « broutage »), mises à jour régulières. En Côte d'Ivoire, la loi de 2013 réprime la cybercriminalité et protège les données personnelles.
### Je vérifie
? Un message demande à Konan son code Mobile Money pour « débloquer un gain ». Il doit :
+ ne jamais donner son code et supprimer le message
- envoyer son code rapidement
- transférer le message à ses amis
! C'est une arnaque (hameçonnage).
? Quel mot de passe est le plus sûr ?
+ une longue phrase de passe unique
- 123456
- sa date de naissance
! Un mot de passe long et unique est difficile à deviner.
### Je m'exerce
1. Un message te demande ton code Mobile Money pour « débloquer un gain ». Que fais-tu ?
### Corrigé
1. Je ne donne jamais mon code : c'est une arnaque ; je supprime le message et je préviens mes parents.

## 3E-IN-03 | Initiation à Python | 55 min
Objectif : Écrire un premier programme en Python.
### Je retiens
= nom = input("Ton nom ? ")
= note = float(input("Ta note ? "))
= print("Bravo", nom) if note >= 10 else print("Courage", nom)
> En Python, l'indentation (décalage vers la droite) délimite les blocs d'instructions, par exemple après « if » ou « for ».
### Je vérifie
? En Python, qu'est-ce qui délimite un bloc d'instructions après « if » ou « for » ?
+ l'indentation
- les accolades
- les guillemets
! Le décalage vers la droite délimite les blocs en Python.
? Avec le programme print("Bravo", nom) if note >= 10 else print("Courage", nom), qu'affiche-t-il si nom vaut Awa et note vaut 8 ?
+ Courage Awa
- Bravo Awa
- Awa 8
! 8 n'est pas supérieur ou égal à 10, donc la partie else s'exécute.
### Je m'exerce
1. Écris un programme qui affiche la table de multiplication de 7.
### Corrigé
1. for i in range(1, 11): print(7, "x", i, "=", 7 * i)
