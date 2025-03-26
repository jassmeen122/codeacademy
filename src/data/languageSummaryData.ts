// Default language summaries that will be used if no data exists in the database
export const defaultLanguageSummaries: Record<string, { title: string, content: string }> = {
  python: {
    title: "Concepts fondamentaux en Python",
    content: `# 1. Déclaration des variables en Python

Qu'est-ce qu'une variable ?
Une variable est un espace mémoire où l'on stocke une donnée. Elle permet de conserver une information et de la réutiliser plus tard dans le programme.

Imagine une boîte où tu ranges un objet. Si tu écris "Nom" sur la boîte et que tu mets un papier avec "Yassmine" à l'intérieur, cette boîte devient une variable qui contient la valeur "Yassmine".

En Python, il est très simple de créer une variable :

\`\`\`python
nom = "Yassmine"  # Une variable contenant du texte
age = 19  # Une variable contenant un nombre entier
prix = 99.99  # Une variable contenant un nombre décimal
est_actif = True  # Une variable contenant une valeur booléenne (Vrai ou Faux)
\`\`\`

💡 Remarque importante :

Python détecte automatiquement le type de la variable.

Contrairement à d'autres langages comme Java ou C, on ne déclare pas le type (ex: int, string).

Par exemple, dans Java, il faut écrire :

\`\`\`java
String nom = "Yassmine";
int age = 19;
\`\`\`

Mais en Python, il suffit de faire :

\`\`\`python
nom = "Yassmine"
age = 19
\`\`\`

C'est plus simple et plus rapide !

# 2. Les conditions en Python

Les conditions permettent d'exécuter des instructions uniquement si certaines situations sont vraies.
Par exemple, si tu veux savoir si une personne peut entrer dans une boîte de nuit, tu vas poser une condition :

Si elle a 18 ans ou plus, elle peut entrer.

Sinon, elle ne peut pas entrer.

En Python, cela s'écrit comme ceci :

\`\`\`python
age = 19

if age >= 18:  # Si l'âge est supérieur ou égal à 18
    print("Vous êtes majeur, vous pouvez entrer.")  
else:  # Sinon
    print("Vous êtes mineur, l'entrée est interdite.")
\`\`\`

🔹 Explication du code :

if signifie "si", il teste une condition.

>= signifie "supérieur ou égal à".

else signifie "sinon", c'est-à-dire que si la condition n'est pas respectée, on exécute le code qui suit.

## Ajout de plusieurs conditions avec elif

Parfois, il faut tester plusieurs cas. Par exemple, si on veut classer une note :

Si la note est supérieure ou égale à 18 → "Excellent"

Sinon si la note est entre 14 et 17 → "Bien"

Sinon si la note est entre 10 et 13 → "Passable"

Sinon → "Échec"

Voici le code Python correspondant :

\`\`\`python
note = 15

if note >= 18:
    print("Excellent")
elif note >= 14:  # Sinon si la note est entre 14 et 17
    print("Bien")
elif note >= 10:  # Sinon si la note est entre 10 et 13
    print("Passable")
else:  # Si la note est en dessous de 10
    print("Échec")
\`\`\`

🔹 Pourquoi elif ?

elif signifie "sinon si", il permet d'ajouter d'autres conditions.

Le programme teste les conditions dans l'ordre et s'arrête dès qu'une condition est vraie.

## Les conditions multiples avec and et or

On peut combiner plusieurs conditions :

and (ET) → Les deux conditions doivent être vraies.

or (OU) → Au moins une des conditions doit être vraie.

Exemple avec and :

\`\`\`python
age = 20
argent = 50

if age >= 18 and argent >= 100:  # Les DEUX conditions doivent être vraies
    print("Vous pouvez entrer dans la boîte de nuit.")
else:
    print("Vous ne pouvez pas entrer.")
\`\`\`

Ici, pour entrer :
✔️ Il faut avoir au moins 18 ans ET au moins 100€.
Si l'une des conditions est fausse, l'entrée est refusée.

Exemple avec or :

\`\`\`python
carte_membre = False
argent = 150

if carte_membre or argent >= 100:  # UNE des conditions doit être vraie
    print("Vous avez accès à la salle VIP !")
else:
    print("Accès refusé.")
\`\`\`

Ici, on peut accéder à la salle VIP SI :
✔️ On a une carte membre OU on a plus de 100€.

# 3. Les fonctions en Python

Une fonction est un morceau de code qui réalise une tâche précise.
Au lieu d'écrire le même code plusieurs fois, on le met dans une fonction et on l'appelle quand on en a besoin.

💡 Pourquoi utiliser une fonction ?
✅ Évite les répétitions de code.
✅ Rend le programme plus clair et mieux organisé.
✅ Permet de réutiliser le code facilement.

## Créer et utiliser une fonction simple

Une fonction en Python se définit avec le mot-clé def suivi du nom de la fonction et des parenthèses ().

\`\`\`python
def dire_bonjour():
    print("Bonjour, bienvenue en Python !")

# Appel de la fonction
dire_bonjour()
\`\`\`

🔹 Explication :

def dire_bonjour(): crée une fonction appelée dire_bonjour.

À l'intérieur, print() affiche un message.

Pour exécuter la fonction, on l'appelle avec dire_bonjour().

## Fonctions avec paramètres

Une fonction peut recevoir des informations grâce aux paramètres.

\`\`\`python
def saluer(nom):
    print(f"Bonjour, {nom} !")

saluer("Yassmine")  # Bonjour, Yassmine !
saluer("Ahmed")  # Bonjour, Ahmed !
\`\`\`

🔹 Ici, nom est un paramètre, il permet de passer un prénom à la fonction.

## Fonctions qui retournent une valeur (return)

Parfois, une fonction doit renvoyer un résultat qu'on peut utiliser dans le programme.
On utilise return pour renvoyer une valeur.

\`\`\`python
def additionner(a, b):
    return a + b  # Retourne la somme

somme = additionner(5, 7)
print(somme)  # Affiche 12
\`\`\`

🔹 additionner(a, b) renvoie a + b, puis on stocke ce résultat dans somme.

## Fonctions avec paramètres par défaut

Une fonction peut avoir un paramètre avec une valeur par défaut.

\`\`\`python
def presentation(nom, age=18):
    print(f"Je m'appelle {nom} et j'ai {age} ans.")

presentation("Yassmine")  # Valeur par défaut : 18 ans
presentation("Ahmed", 20)  # Remplace 18 par 20
\`\`\`

Si aucun âge n'est donné, Python prend 18 par défaut.

# Conclusion

On a vu trois concepts essentiels en Python :
✔️ Les variables → Stocker des valeurs.
✔️ Les conditions → Exécuter un code selon une situation.
✔️ Les fonctions → Organiser le code pour éviter les répétitions.

Ces notions sont la base de tout programme en Python !`
  },
  java: {
    title: "Concepts fondamentaux en Java",
    content: `# 1. Déclaration des variables en Java

Qu'est-ce qu'une variable ?
Comme en Python, une variable en Java est un espace mémoire où l'on stocke une donnée.

Cependant, en Java, contrairement à Python, il faut toujours préciser le type de la variable.

Syntaxe pour déclarer une variable en Java

\`\`\`java
int age = 19;  // Une variable entière (int)
double prix = 99.99;  // Un nombre à virgule (double)
boolean estActif = true;  // Une valeur booléenne (true/false)
String nom = "Yassmine";  // Une chaîne de caractères (String)
\`\`\`

📌 Différence avec Python :

En Python, on écrit juste nom = "Yassmine", et Python devine que c'est une chaîne de caractères.

En Java, on doit obligatoirement dire que c'est un String.

## Les types de données en Java

Voici les principaux types que tu dois connaître :

Type | Description | Exemple
--- | --- | ---
int | Nombre entier | int age = 25;
double | Nombre à virgule | double prix = 9.99;
boolean | Vrai ou Faux | boolean estVrai = true;
char | Un seul caractère | char lettre = 'A';
String | Texte | String nom = "Yassmine";

# 2. Les conditions en Java

Les conditions permettent d'exécuter du code seulement si une certaine situation est vraie.

## La condition if...else en Java

Prenons un exemple simple :

\`\`\`java
int age = 19;

if (age >= 18) {
    System.out.println("Vous êtes majeur, vous pouvez entrer.");
} else {
    System.out.println("Vous êtes mineur, l'entrée est interdite.");
}
\`\`\`

🔹 Explication :

if (condition) → Vérifie si la condition est vraie.

else → Exécute ce code si la condition est fausse.

System.out.println() → Affiche du texte à l'écran.

📌 Différence avec Python :

En Python, on utilise print() au lieu de System.out.println().

Java utilise des {} pour entourer les blocs de code, alors que Python utilise l'indentation.

## La condition if...else if...else

Imaginons qu'on veut classer une note en fonction d'une grille :

\`\`\`java
int note = 15;

if (note >= 18) {
    System.out.println("Excellent");
} else if (note >= 14) {  // Sinon si
    System.out.println("Bien");
} else if (note >= 10) {
    System.out.println("Passable");
} else {
    System.out.println("Échec");
}
\`\`\`

🔹 Ce qu'il faut retenir :

else if permet d'ajouter d'autres conditions.

Le programme s'arrête dès qu'une condition est vraie.

## Les conditions multiples avec && et ||

Comme en Python :

&& (ET logique) → Les deux conditions doivent être vraies.

|| (OU logique) → Au moins une des conditions doit être vraie.

Exemple avec && (ET logique)

\`\`\`java
int age = 20;
int argent = 50;

if (age >= 18 && argent >= 100) { 
    System.out.println("Vous pouvez entrer dans la boîte de nuit.");
} else {
    System.out.println("Vous ne pouvez pas entrer.");
}
\`\`\`

💡 Explication :
✔️ La personne doit avoir plus de 18 ans ET au moins 100€.
❌ Si l'une des conditions est fausse, elle ne peut pas entrer.

Exemple avec || (OU logique)

\`\`\`java
boolean carteMembre = false;
int argent = 150;

if (carteMembre || argent >= 100) { 
    System.out.println("Vous avez accès à la salle VIP !");
} else {
    System.out.println("Accès refusé.");
}
\`\`\`

💡 Explication :
✔️ Si la personne a une carte membre OU si elle a 100€ ou plus, elle peut entrer.

# 3. Les fonctions en Java

Une fonction (appelée "méthode" en Java) est un bloc de code qui effectue une action précise.

## Créer une fonction simple

En Java, une fonction est définie avec :

Un type de retour (void, int, String, etc.).

Un nom de fonction.

Des parenthèses () avec ou sans paramètres.

Un corps de fonction {} qui contient le code à exécuter.

Exemple d'une fonction sans paramètres

\`\`\`java
public static void direBonjour() {
    System.out.println("Bonjour, bienvenue en Java !");
}

// Appel de la fonction
direBonjour();
\`\`\`

🔹 Explication :

public static void → Mot-clé utilisé pour définir une fonction en Java.

direBonjour() → Nom de la fonction.

void signifie que la fonction ne retourne rien.

## Fonctions avec paramètres

Une fonction peut prendre des informations en entrée (comme en Python).

\`\`\`java
public static void saluer(String nom) {
    System.out.println("Bonjour, " + nom + " !");
}

// Appel de la fonction
saluer("Yassmine");
saluer("Ahmed");
\`\`\`

💡 Explication :

La fonction saluer() prend un paramètre nom de type String.

Elle affiche "Bonjour, Yassmine !" si on appelle saluer("Yassmine").

## Fonctions qui retournent une valeur

Une fonction peut renvoyer un résultat grâce au mot-clé return.

\`\`\`java
public static int additionner(int a, int b) {
    return a + b;  // Retourne la somme
}

public static void main(String[] args) {
    int somme = additionner(5, 7);
    System.out.println(somme);  // Affiche 12
}
\`\`\`

💡 Explication :

additionner(int a, int b) prend deux nombres et retourne leur somme.

On stocke le résultat dans somme et on l'affiche.

## Fonctions avec paramètres par défaut ?

💡 En Java, il n'y a pas de paramètres par défaut comme en Python.
On doit créer plusieurs versions d'une fonction (surcharge de méthode) :

\`\`\`java
public static void presentation(String nom) {
    System.out.println("Je m'appelle " + nom + " et j'ai 18 ans.");
}

public static void presentation(String nom, int age) {
    System.out.println("Je m'appelle " + nom + " et j'ai " + age + " ans.");
}

// Appel des fonctions
presentation("Yassmine");  // Prend 18 ans par défaut
presentation("Ahmed", 20);
\`\`\`

Ici, la première fonction suppose 18 ans par défaut, et la deuxième permet de préciser l'âge.

# Conclusion

On a vu trois concepts essentiels en Java :
✔️ Les variables → Stocker des valeurs en précisant leur type.
✔️ Les conditions → Exécuter un code en fonction d'une situation.
✔️ Les fonctions → Éviter les répétitions et organiser le code.

💡 Différences avec Python :

En Java, on déclare toujours le type des variables.

Java utilise des {} au lieu d'indentation.

Pour afficher du texte, on utilise System.out.println() au lieu de print().

Les fonctions en Java s'appellent méthodes, et elles doivent toujours être définies dans une classe.

Java est plus strict que Python, mais il est très puissant et utilisé dans les grandes applications !`
  },
  javascript: {
    title: "Concepts fondamentaux en JavaScript",
    content: `# 1. Déclaration des variables en JavaScript

Qu'est-ce qu'une variable ?
Une variable est un espace en mémoire où l'on stocke une donnée. Contrairement à Java, JavaScript est un langage dynamique, ce qui signifie qu'on n'a pas besoin de préciser le type de données (comme en Python).

## Les trois façons de déclarer une variable en JavaScript
Il existe trois mots-clés pour déclarer une variable :

var (ancienne méthode, à éviter)

let (méthode recommandée)

const (pour les valeurs constantes)

Exemple :

\`\`\`javascript
var nom = "Yassmine"; // Ancienne manière (peut poser des problèmes)
let age = 19;         // Nouvelle manière, recommandée
const pays = "Maroc"; // Une valeur qui ne changera pas
\`\`\`

## Quelle est la différence entre var, let et const ?
Mot-clé | Modification possible ? | Portée (scope)
--- | --- | ---
var | Oui | Fonction
let | Oui | Bloc {}
const | Non | Bloc {}

💡 Conseil :

Utilise let pour les variables qui peuvent changer.

Utilise const si la valeur ne doit jamais changer.

Évite var, car il peut créer des bugs.

# 2. Conditions en JavaScript
Une condition permet d'exécuter un code seulement si une certaine situation est vraie.

## Condition if simple

\`\`\`javascript
let age = 19;

if (age >= 18) {
    console.log("Vous êtes majeur.");
}
\`\`\`

💡 Explication :

Si age est supérieur ou égal à 18, alors on affiche "Vous êtes majeur.".

## Condition if...else

\`\`\`javascript
let age = 16;

if (age >= 18) {
    console.log("Vous êtes majeur.");
} else {
    console.log("Vous êtes mineur.");
}
\`\`\`

💡 Explication :

Si age est inférieur à 18, alors on affiche "Vous êtes mineur.".

## Condition if...else if...else
Si on veut tester plusieurs cas, on utilise else if :

\`\`\`javascript
let note = 15;

if (note >= 18) {
    console.log("Excellent !");
} else if (note >= 14) {
    console.log("Bien !");
} else if (note >= 10) {
    console.log("Passable.");
} else {
    console.log("Échec.");
}
\`\`\`

💡 Explication :

Si note est supérieure ou égale à 18, on affiche "Excellent".

Sinon, si note >= 14, on affiche "Bien".

Sinon, si note >= 10, on affiche "Passable".

Sinon, on affiche "Échec."

## Conditions avec && et ||
Comme en Java :

&& (ET logique) → Les deux conditions doivent être vraies.

|| (OU logique) → Au moins une condition doit être vraie.

Exemple avec && (ET logique)

\`\`\`javascript
let argent = 50;
let age = 20;

if (age >= 18 && argent >= 100) {
    console.log("Vous pouvez entrer en boîte.");
} else {
    console.log("Accès refusé.");
}
\`\`\`

💡 Explication :
✔️ La personne doit avoir plus de 18 ans ET au moins 100€.

Exemple avec || (OU logique)

\`\`\`javascript
let carteMembre = false;
let argent = 150;

if (carteMembre || argent >= 100) {
    console.log("Accès VIP accordé.");
} else {
    console.log("Accès refusé.");
}
\`\`\`

💡 Explication :
✔️ Si la personne a une carte membre OU si elle a au moins 100€, elle peut entrer.

# 3. Fonctions en JavaScript
Une fonction est un bloc de code qui effectue une action et peut être réutilisée plusieurs fois.

## Créer une fonction sans paramètres

\`\`\`javascript
function direBonjour() {
    console.log("Bonjour, bienvenue !");
}

// Appel de la fonction
direBonjour();
\`\`\`

💡 Explication :

function direBonjour() → Définit une fonction nommée direBonjour.

console.log("Bonjour, bienvenue !") → Affiche "Bonjour, bienvenue !".

## Fonctions avec paramètres

\`\`\`javascript
function saluer(nom) {
    console.log("Bonjour, " + nom + " !");
}

// Appel de la fonction
saluer("Yassmine");
saluer("Ahmed");
\`\`\`

💡 Explication :

La fonction saluer(nom) prend un paramètre nom.

Elle affiche "Bonjour, Yassmine !", "Bonjour, Ahmed !", etc.

## Fonctions qui retournent une valeur

\`\`\`javascript
function additionner(a, b) {
    return a + b;
}

// Stocker le résultat et l'afficher
let resultat = additionner(5, 7);
console.log(resultat);  // Affiche 12
\`\`\`

💡 Explication :

La fonction additionne deux nombres et retourne le résultat.

La valeur est stockée dans resultat et affichée avec console.log().

## Fonctions fléchées (Arrow Functions)
Depuis ES6, JavaScript propose une nouvelle façon d'écrire des fonctions plus courte :

\`\`\`javascript
const multiplier = (x, y) => x * y;

console.log(multiplier(3, 4));  // Affiche 12
\`\`\`

💡 Explication :

(x, y) => x * y; est une fonction fléchée.

Elle est équivalente à :

\`\`\`javascript
function multiplier(x, y) {
    return x * y;
}
\`\`\`

# Conclusion
✔️ JavaScript est un langage dynamique utilisé pour le développement web.
✔️ Il permet de déclarer des variables sans préciser le type.
✔️ Les conditions sont similaires à celles de Java et Python.
✔️ Les fonctions peuvent être classiques ou sous forme fléchée (ES6).
✔️ Il est utilisé dans les navigateurs (Frontend) et aussi côté serveur (Node.js).

💡 JavaScript est essentiel pour le développement web moderne ! 🚀`
  },
  php: {
    title: "Introduction à PHP",
    content: `# Introduction à PHP

PHP (Hypertext Preprocessor) est un langage de programmation côté serveur utilisé principalement pour le développement web. Il permet de générer des pages dynamiques, se connecter à une base de données, et gérer les formulaires.

💡 Points forts de PHP :
✔️ Facile à apprendre et à utiliser.
✔️ Intégré avec HTML.
✔️ Compatible avec MySQL, PostgreSQL, SQLite, etc.
✔️ Fonctionne sur tous les serveurs web (Apache, Nginx…).

## 1. Déclaration des Variables en PHP

En PHP, les variables commencent toujours par $, et il n'est pas nécessaire de préciser le type de la variable (PHP est un langage faiblement typé).

### Syntaxe des Variables

\`\`\`php
<?php
$nom = "Yassmine";  // Chaîne de caractères
$age = 19;          // Entier
$prix = 15.99;      // Float
$estConnecte = true; // Booléen

echo "Nom : $nom, Age : $age, Prix : $prix";
?>
\`\`\`

💡 Explication :

$nom = "Yassmine"; → Variable contenant une chaîne de caractères.

$age = 19; → Variable de type entier.

$prix = 15.99; → Variable de type décimal.

$estConnecte = true; → Booléen (true ou false).

👉 PHP déduit automatiquement le type des variables en fonction de la valeur qu'on leur attribue.

## 2. Conditions en PHP (if, else if, else)

PHP utilise les mêmes conditions que la plupart des langages de programmation (if, else if, else).

### Condition if simple

\`\`\`php
<?php
$age = 20;

if ($age >= 18) {
    echo "Vous êtes majeur.";
}
?>
\`\`\`

💡 Explication :
Si $age est supérieur ou égal à 18, on affiche "Vous êtes majeur.".

### Condition if...else

\`\`\`php
<?php
$age = 16;

if ($age >= 18) {
    echo "Vous êtes majeur.";
} else {
    echo "Vous êtes mineur.";
}
?>
\`\`\`

💡 Explication :
Si $age est inférieur à 18, alors on affiche "Vous êtes mineur.".

### Condition if...else if...else

\`\`\`php
<?php
$note = 15;

if ($note >= 18) {
    echo "Excellent !";
} elseif ($note >= 14) {
    echo "Bien !";
} elseif ($note >= 10) {
    echo "Passable.";
} else {
    echo "Échec.";
}
?>
\`\`\`

💡 Explication :

Si note >= 18, on affiche "Excellent !".

Si note >= 14, on affiche "Bien !".

Si note >= 10, on affiche "Passable".

Sinon, on affiche "Échec."

## 3. Fonctions en PHP

Une fonction est un bloc de code qui exécute une tâche spécifique.

### Déclaration d'une fonction sans paramètre

\`\`\`php
<?php
function direBonjour() {
    echo "Bonjour, bienvenue sur notre site !";
}

direBonjour();
?>
\`\`\`

💡 Explication :

function direBonjour() → Déclaration d'une fonction nommée direBonjour.

echo "Bonjour..."; → Affichage d'un message.

direBonjour(); → Appel de la fonction.

### Fonction avec paramètres

\`\`\`php
<?php
function saluer($nom) {
    echo "Bonjour, $nom !";
}

saluer("Yassmine");
?>
\`\`\`

💡 Explication :

$nom est un paramètre passé à la fonction saluer.

Lorsqu'on appelle saluer("Yassmine");, le message "Bonjour, Yassmine !" s'affiche.

### Fonction avec retour de valeur

\`\`\`php
<?php
function additionner($a, $b) {
    return $a + $b;
}

$resultat = additionner(5, 7);
echo "Résultat : $resultat";
?>
\`\`\`

💡 Explication :

La fonction additionner($a, $b) retourne la somme de $a et $b.

Le résultat est stocké dans la variable $resultat et affiché.

## 4. PHP et HTML : Exemple Complet

PHP est souvent intégré dans des pages HTML.

\`\`\`php
<!DOCTYPE html>
<html>
<head>
    <title>Exemple PHP</title>
</head>
<body>

<h1>Bienvenue sur mon site</h1>

<?php
$nom = "Yassmine";
echo "<p>Bonjour, $nom !</p>";
?>

</body>
</html>
\`\`\`

💡 Explication :

PHP est intégré entre <?php ... ?>.

L'instruction echo "<p>Bonjour, $nom !</p>"; affiche du texte dans une balise HTML.

# Conclusion

✔️ PHP est un langage puissant pour le développement web dynamique.
✔️ Les variables sont déclarées avec $ sans type spécifique.
✔️ Les conditions et les fonctions sont similaires aux autres langages.
✔️ PHP fonctionne en combinaison avec HTML pour générer des pages interactives.

🚀 PHP est l'un des langages les plus utilisés pour créer des sites web dynamiques comme Facebook, WordPress et Wikipedia !`
  },
  sql: {
    title: "Les fondamentaux du SQL",
    content: `# Introduction à SQL

SQL (Structured Query Language) est un langage de programmation utilisé pour gérer les bases de données relationnelles. Il permet de créer, modifier, interroger et administrer des bases de données.

## Structure d'une Base de Données Relationnelle

Une base de données relationnelle est composée de tables, qui sont des structures organisées en lignes (enregistrements) et colonnes (champs).

## Création de Base de Données et de Tables

\`\`\`sql
-- Création d'une base de données
CREATE DATABASE ma_base_de_donnees;

-- Utilisation d'une base de données
USE ma_base_de_donnees;

-- Création d'une table
CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    date_naissance DATE,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création d'une autre table avec une clé étrangère
CREATE TABLE commandes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT,
    produit VARCHAR(100) NOT NULL,
    quantite INT DEFAULT 1,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);
\`\`\`

## Insertion de Données

\`\`\`sql
-- Insertion d'un seul enregistrement
INSERT INTO utilisateurs (nom, prenom, email, date_naissance)
VALUES ('Dupont', 'Jean', 'jean.dupont@example.com', '1990-05-15');

-- Insertion de plusieurs enregistrements
INSERT INTO utilisateurs (nom, prenom, email, date_naissance)
VALUES 
    ('Martin', 'Sophie', 'sophie.martin@example.com', '1985-12-10'),
    ('Durand', 'Pierre', 'pierre.durand@example.com', '1992-08-22');
\`\`\`

## Requêtes de Sélection

\`\`\`sql
-- Sélection de tous les enregistrements et toutes les colonnes
SELECT * FROM utilisateurs;

-- Sélection de colonnes spécifiques
SELECT nom, prenom, email FROM utilisateurs;

-- Sélection avec condition
SELECT * FROM utilisateurs WHERE date_naissance > '1990-01-01';

-- Sélection avec plusieurs conditions
SELECT * FROM utilisateurs
WHERE date_naissance > '1990-01-01' AND nom = 'Dupont';

-- Utilisation de OR
SELECT * FROM utilisateurs
WHERE nom = 'Dupont' OR nom = 'Martin';

-- Utilisation de IN
SELECT * FROM utilisateurs
WHERE nom IN ('Dupont', 'Martin', 'Durand');

-- Utilisation de LIKE pour les recherches partielles
SELECT * FROM utilisateurs
WHERE email LIKE '%@example.com';

-- Utilisation de BETWEEN pour les plages de valeurs
SELECT * FROM utilisateurs
WHERE date_naissance BETWEEN '1980-01-01' AND '1989-12-31';

-- Tri des résultats
SELECT * FROM utilisateurs
ORDER BY nom ASC, prenom DESC;

-- Limitation du nombre de résultats
SELECT * FROM utilisateurs
LIMIT 10;

-- Décalage des résultats (pour la pagination)
SELECT * FROM utilisateurs
LIMIT 10 OFFSET 20;
\`\`\`

## Fonctions d'Agrégation

\`\`\`sql
-- Comptage d'enregistrements
SELECT COUNT(*) FROM utilisateurs;

-- Comptage avec condition
SELECT COUNT(*) FROM utilisateurs
WHERE date_naissance > '1990-01-01';

-- Autres fonctions d'agrégation
SELECT 
    MIN(date_naissance) AS plus_ancien,
    MAX(date_naissance) AS plus_recent,
    AVG(YEAR(CURRENT_DATE) - YEAR(date_naissance)) AS age_moyen
FROM utilisateurs;

-- Groupement
SELECT YEAR(date_naissance) AS annee, COUNT(*) AS nombre
FROM utilisateurs
GROUP BY annee
ORDER BY annee;

-- Groupement avec condition sur groupes
SELECT YEAR(date_naissance) AS annee, COUNT(*) AS nombre
FROM utilisateurs
GROUP BY annee
HAVING nombre > 1
ORDER BY annee;
\`\`\`

## Jointures

\`\`\`sql
-- Jointure interne (INNER JOIN)
SELECT u.nom, u.prenom, c.produit, c.quantite
FROM utilisateurs u
INNER JOIN commandes c ON u.id = c.utilisateur_id;

-- Jointure externe gauche (LEFT JOIN)
SELECT u.nom, u.prenom, c.produit, c.quantite
FROM utilisateurs u
LEFT JOIN commandes c ON u.id = c.utilisateur_id;

-- Jointure externe droite (RIGHT JOIN)
SELECT u.nom, u.prenom, c.produit, c.quantite
FROM utilisateurs u
RIGHT JOIN commandes c ON u.id = c.utilisateur_id;

-- Jointure complète (FULL JOIN) - Pas supporté par MySQL, mais équivalent à :
SELECT u.nom, u.prenom, c.produit, c.quantite
FROM utilisateurs u
LEFT JOIN commandes c ON u.id = c.utilisateur_id
UNION
SELECT u.nom, u.prenom, c.produit, c.quantite
FROM utilisateurs u
RIGHT JOIN commandes c ON u.id = c.utilisateur_id
WHERE u.id IS NULL;
\`\`\`

## Sous-requêtes

\`\`\`sql
-- Sous-requête dans la clause WHERE
SELECT * FROM utilisateurs
WHERE id IN (SELECT utilisateur_id FROM commandes WHERE produit = 'Ordinateur');

-- Sous-requête dans la clause FROM
SELECT temp.annee, temp.nombre
FROM (
    SELECT YEAR(date_naissance) AS annee, COUNT(*) AS nombre
    FROM utilisateurs
    GROUP BY annee
) AS temp
WHERE temp.nombre > 1;
\`\`\`

## Mise à Jour de Données

\`\`\`sql
-- Mise à jour d'un enregistrement
UPDATE utilisateurs
SET email = 'nouveau.email@example.com'
WHERE id = 1;

-- Mise à jour de plusieurs enregistrements
UPDATE utilisateurs
SET date_inscription = CURRENT_TIMESTAMP
WHERE date_inscription IS NULL;
\`\`\`

## Suppression de Données

\`\`\`sql
-- Suppression d'un enregistrement
DELETE FROM utilisateurs
WHERE id = 1;

-- Suppression de plusieurs enregistrements
DELETE FROM utilisateurs
WHERE date_naissance < '1980-01-01';

-- Suppression de tous les enregistrements
DELETE FROM utilisateurs;
-- ou
TRUNCATE TABLE utilisateurs;
\`\`\`

## Modification de Structure de Table

\`\`\`sql
-- Ajout d'une colonne
ALTER TABLE utilisateurs
ADD COLUMN telephone VARCHAR(15);

-- Modification d'une colonne
ALTER TABLE utilisateurs
MODIFY COLUMN telephone VARCHAR(20);

-- Suppression d'une colonne
ALTER TABLE utilisateurs
DROP COLUMN telephone;

-- Ajout d'une contrainte
ALTER TABLE utilisateurs
ADD CONSTRAINT email_unique UNIQUE (email);

-- Suppression d'une contrainte
ALTER TABLE utilisateurs
DROP CONSTRAINT email_unique;
\`\`\`

## Suppression de Tables et de Bases de Données

\`\`\`sql
-- Suppression d'une table
DROP TABLE commandes;

-- Suppression d'une base de données
DROP DATABASE ma_base_de_donnees;
\`\`\`

## Transactions

\`\`\`sql
-- Début d'une transaction
START TRANSACTION;

-- Opérations
INSERT INTO utilisateurs (nom, prenom) VALUES ('Smith', 'John');
UPDATE commandes SET quantite = quantite - 1 WHERE id = 5;

-- Validation des modifications
COMMIT;

-- ou Annulation des modifications
ROLLBACK;
\`\`\`

## Vues

\`\`\`sql
-- Création d'une vue
CREATE VIEW utilisateurs_recents AS
SELECT * FROM utilisateurs
WHERE date_inscription > DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH);

-- Utilisation d'une vue
SELECT * FROM utilisateurs_recents;

-- Suppression d'une vue
DROP VIEW utilisateurs_recents;
\`\`\`

SQL est un langage essentiel pour travailler avec des bases de données relationnelles. Que ce soit pour des sites web, des applications d'entreprise ou des analyses de données, la maîtrise du SQL ouvre de nombreuses opportunités dans le domaine de l'informatique.`
  }
};

// Returns the YouTube embed URL for a language
export const getYoutubeEmbedUrl = (languageId: string | undefined): string => {
  if (!languageId) return '';
  
  const videoInfo = languageVideoMap[languageId];
  return videoInfo?.courseVideo || '';
};

// Opens a YouTube video in a new tab
export const openYoutubeVideo = (url: string): void => {
  if (!url) return;
  
  const youtubeUrl = url.replace('embed/', 'watch?v=');
  window.open(youtubeUrl, '_blank');
};

