
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (à remplacer par vos propres valeurs)
const SUPABASE_URL = "https://tgjtkmduelappimtorwe.supabase.co";
const SUPABASE_KEY = "YOUR_SERVICE_KEY"; // Remplacer par la clé service

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fonction pour récupérer tous les langages
const getLanguages = async () => {
  const { data, error } = await supabase
    .from('programming_languages')
    .select('*');
    
  if (error) {
    console.error('Erreur lors de la récupération des langages:', error);
    return [];
  }
  
  return data;
};

// Résumés par langage
const summaries = {
  'Python': {
    title: 'Les fondamentaux de Python',
    content: `# Introduction à Python

Python est un langage de programmation polyvalent, interprété et de haut niveau, créé par Guido van Rossum et publié pour la première fois en 1991. Il est conçu pour être simple à lire et à écrire, avec une syntaxe qui met l'accent sur la lisibilité du code, ce qui réduit considérablement le coût de maintenance.

## Variables et Types de données

En Python, les variables sont dynamiquement typées, ce qui signifie qu'elles peuvent changer de type au cours de l'exécution du programme.

\`\`\`python
# Entiers
age = 25

# Flottants
prix = 19.99

# Chaînes de caractères
nom = "Python"

# Booléens
est_vrai = True
est_faux = False

# Listes (tableaux mutables)
fruits = ["pomme", "banane", "orange"]

# Tuples (tableaux immuables)
coordonnees = (10, 20)

# Dictionnaires (paires clé-valeur)
personne = {"nom": "Dupont", "age": 30}

# Ensembles (collections non ordonnées d'éléments uniques)
nombres_uniques = {1, 2, 3, 4, 5}
\`\`\`

## Structures Conditionnelles

Les instructions conditionnelles permettent d'exécuter différents blocs de code selon que certaines conditions sont remplies ou non.

\`\`\`python
age = 18

if age < 18:
    print("Mineur")
elif age == 18:
    print("Tout juste majeur")
else:
    print("Majeur")
\`\`\`

## Boucles

Les boucles permettent d'exécuter un bloc de code plusieurs fois.

\`\`\`python
# Boucle for
for i in range(5):
    print(i)  # Affiche 0, 1, 2, 3, 4

# Boucle while
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1  # Affiche 0, 1, 2, 3, 4
\`\`\`

## Fonctions

Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.

\`\`\`python
def saluer(nom):
    return f"Bonjour, {nom}!"

message = saluer("Alice")
print(message)  # Affiche "Bonjour, Alice!"
\`\`\`

## Classes et Objets

Python est un langage de programmation orienté objet. Les classes permettent de créer des objets avec des attributs et des méthodes.

\`\`\`python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def presentation(self):
        return f"Je m'appelle {self.nom} et j'ai {self.age} ans."

p1 = Personne("Alice", 30)
print(p1.presentation())  # Affiche "Je m'appelle Alice et j'ai 30 ans."
\`\`\`

## Modules et Bibliothèques

Python dispose d'une vaste bibliothèque standard et de nombreux modules tiers qui étendent ses fonctionnalités.

\`\`\`python
# Module de la bibliothèque standard
import math
print(math.sqrt(16))  # Affiche 4.0

# Module tiers populaire (nécessite installation)
import pandas as pd
données = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
\`\`\`

## Gestion des Exceptions

La gestion des exceptions permet de traiter les erreurs de manière élégante.

\`\`\`python
try:
    résultat = 10 / 0
except ZeroDivisionError:
    print("Division par zéro impossible!")
finally:
    print("Ce bloc est toujours exécuté.")
\`\`\`

Python est largement utilisé dans le développement web, l'analyse de données, l'intelligence artificielle, l'automatisation et bien d'autres domaines. Sa simplicité et sa polyvalence en font un excellent choix pour les débutants comme pour les programmeurs expérimentés.`
  },
  'Java': {
    title: 'Les bases de Java',
    content: `# Introduction à Java

Java est un langage de programmation orienté objet de haut niveau, développé par Sun Microsystems (maintenant propriété d'Oracle). Il est conçu pour être portable, ce qui signifie qu'un programme Java peut s'exécuter sur n'importe quelle plateforme sans être recompilé.

## Variables et Types de données

Java est un langage fortement typé, ce qui signifie que vous devez déclarer le type de chaque variable avant de l'utiliser.

\`\`\`java
// Types primitifs
int age = 25;
double prix = 19.99;
char grade = 'A';
boolean estVrai = true;

// Chaînes de caractères (non primitif)
String nom = "Java";

// Tableaux
int[] nombres = {1, 2, 3, 4, 5};
String[] fruits = {"pomme", "banane", "orange"};
\`\`\`

## Structures Conditionnelles

Les instructions conditionnelles permettent d'exécuter différents blocs de code selon que certaines conditions sont remplies ou non.

\`\`\`java
int age = 18;

if (age < 18) {
    System.out.println("Mineur");
} else if (age == 18) {
    System.out.println("Tout juste majeur");
} else {
    System.out.println("Majeur");
}
\`\`\`

## Boucles

Les boucles permettent d'exécuter un bloc de code plusieurs fois.

\`\`\`java
// Boucle for
for (int i = 0; i < 5; i++) {
    System.out.println(i);  // Affiche 0, 1, 2, 3, 4
}

// Boucle while
int compteur = 0;
while (compteur < 5) {
    System.out.println(compteur);
    compteur++;  // Affiche 0, 1, 2, 3, 4
}

// Boucle do-while
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);  // Affiche 0, 1, 2, 3, 4
\`\`\`

## Méthodes

Les méthodes sont des blocs de code réutilisables qui effectuent une tâche spécifique.

\`\`\`java
public static String saluer(String nom) {
    return "Bonjour, " + nom + "!";
}

// Appel de la méthode
String message = saluer("Alice");
System.out.println(message);  // Affiche "Bonjour, Alice!"
\`\`\`

## Classes et Objets

Java est un langage de programmation orienté objet. Tout le code Java est écrit à l'intérieur de classes.

\`\`\`java
public class Personne {
    // Attributs
    private String nom;
    private int age;
    
    // Constructeur
    public Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
    
    // Méthode
    public String presentation() {
        return "Je m'appelle " + nom + " et j'ai " + age + " ans.";
    }
}

// Création d'un objet
Personne p1 = new Personne("Alice", 30);
System.out.println(p1.presentation());  // Affiche "Je m'appelle Alice et j'ai 30 ans."
\`\`\`

## Héritage

L'héritage permet à une classe d'hériter des attributs et des méthodes d'une autre classe.

\`\`\`java
public class Etudiant extends Personne {
    private String ecole;
    
    public Etudiant(String nom, int age, String ecole) {
        super(nom, age);  // Appel du constructeur de la classe parent
        this.ecole = ecole;
    }
    
    @Override
    public String presentation() {
        return super.presentation() + " J'étudie à " + ecole + ".";
    }
}
\`\`\`

## Gestion des Exceptions

La gestion des exceptions permet de traiter les erreurs de manière élégante.

\`\`\`java
try {
    int résultat = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Division par zéro impossible!");
} finally {
    System.out.println("Ce bloc est toujours exécuté.");
}
\`\`\`

Java est largement utilisé dans le développement d'applications d'entreprise, d'applications mobiles (Android), et de nombreux autres domaines. Sa portabilité, sa robustesse et sa sécurité en font un choix populaire pour de nombreux projets de développement logiciel.`
  },
  'JavaScript': {
    title: 'Apprendre JavaScript',
    content: `# Introduction à JavaScript

JavaScript est un langage de programmation de haut niveau, interprété, qui permet d'ajouter de l'interactivité aux pages web. Initialement conçu pour fonctionner côté client dans les navigateurs web, JavaScript peut maintenant également être utilisé côté serveur avec Node.js.

## Variables et Types de données

JavaScript est un langage à typage dynamique, ce qui signifie que les variables peuvent changer de type pendant l'exécution du programme.

\`\`\`javascript
// Déclaration de variables avec let, const ou var
let age = 25;
const PI = 3.14159;
var nom = "JavaScript";

// Types de données
let nombre = 42;          // Number
let prix = 19.99;         // Number (pas de distinction entre entier et flottant)
let nom = "JavaScript";   // String
let estVrai = true;       // Boolean
let rien = null;          // Null
let nonDefini;            // Undefined
let symbole = Symbol();   // Symbol (ES6)
let grand = BigInt(9007199254740991);  // BigInt (ES2020)

// Objets et tableaux
let personne = {          // Object
  nom: "Dupont",
  age: 30
};

let fruits = ["pomme", "banane", "orange"];  // Array
\`\`\`

## Structures Conditionnelles

Les instructions conditionnelles permettent d'exécuter différents blocs de code selon que certaines conditions sont remplies ou non.

\`\`\`javascript
let age = 18;

if (age < 18) {
  console.log("Mineur");
} else if (age === 18) {
  console.log("Tout juste majeur");
} else {
  console.log("Majeur");
}

// Opérateur ternaire
let statut = age < 18 ? "Mineur" : "Majeur";

// Switch
switch (age) {
  case 18:
    console.log("Tout juste majeur");
    break;
  case 21:
    console.log("Majeur aux US");
    break;
  default:
    console.log("Âge quelconque");
}
\`\`\`

## Boucles

Les boucles permettent d'exécuter un bloc de code plusieurs fois.

\`\`\`javascript
// Boucle for
for (let i = 0; i < 5; i++) {
  console.log(i);  // Affiche 0, 1, 2, 3, 4
}

// Boucle while
let compteur = 0;
while (compteur < 5) {
  console.log(compteur);
  compteur++;  // Affiche 0, 1, 2, 3, 4
}

// Boucle do-while
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);  // Affiche 0, 1, 2, 3, 4

// Boucle for...of (pour les itérables comme Array)
let fruits = ["pomme", "banane", "orange"];
for (let fruit of fruits) {
  console.log(fruit);
}

// Boucle for...in (pour les objets)
let personne = { nom: "Dupont", age: 30 };
for (let propriété in personne) {
  console.log(propriété + ": " + personne[propriété]);
}
\`\`\`

## Fonctions

Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.

\`\`\`javascript
// Déclaration de fonction
function saluer(nom) {
  return "Bonjour, " + nom + "!";
}

// Expression de fonction
const saluer = function(nom) {
  return "Bonjour, " + nom + "!";
};

// Fonction fléchée (ES6)
const saluer = (nom) => {
  return "Bonjour, " + nom + "!";
};

// Version simplifiée pour les fonctions à une ligne
const saluer = nom => "Bonjour, " + nom + "!";

// Appel de fonction
let message = saluer("Alice");
console.log(message);  // Affiche "Bonjour, Alice!"
\`\`\`

## Objets et Classes

JavaScript utilise des objets et, depuis ES6, des classes pour la programmation orientée objet.

\`\`\`javascript
// Création d'un objet
let personne = {
  nom: "Dupont",
  age: 30,
  presentation: function() {
    return "Je m'appelle " + this.nom + " et j'ai " + this.age + " ans.";
  }
};

console.log(personne.presentation());

// Classes (ES6)
class Personne {
  constructor(nom, age) {
    this.nom = nom;
    this.age = age;
  }
  
  presentation() {
    return \`Je m'appelle \${this.nom} et j'ai \${this.age} ans.\`;
  }
}

let p1 = new Personne("Alice", 30);
console.log(p1.presentation());  // Affiche "Je m'appelle Alice et j'ai 30 ans."
\`\`\`

## Promesses et Async/Await

JavaScript utilise des promesses et la syntaxe async/await pour gérer les opérations asynchrones.

\`\`\`javascript
// Promesses
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Données reçues");
    }, 2000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/Await (ES8)
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getData();
\`\`\`

JavaScript est un langage essentiel pour le développement web, mais aussi pour le développement d'applications mobiles, de jeux, et même d'applications serveur avec Node.js. Sa flexibilité et son omniprésence en font l'un des langages de programmation les plus populaires au monde.`
  },
  'C': {
    title: 'Introduction au langage C',
    content: `# Introduction au langage C

Le C est un langage de programmation impératif et structuré, créé au début des années 1970 par Dennis Ritchie pour le développement du système d'exploitation UNIX. Il est considéré comme un langage de niveau intermédiaire, combinant des éléments de langages de haut niveau avec la fonctionnalité d'assemblage de bas niveau.

## Variables et Types de données

Le C est un langage à typage statique, ce qui signifie que le type de chaque variable doit être déclaré avant son utilisation.

\`\`\`c
// Types de base
int age = 25;            // Entier
float prix = 19.99;      // Flottant simple précision
double pi = 3.14159265;  // Flottant double précision
char grade = 'A';        // Caractère

// Constantes
const float PI = 3.14159;

// Tableaux
int nombres[5] = {1, 2, 3, 4, 5};
char nom[10] = "C";  // Chaîne de caractères (tableau de caractères)
\`\`\`

## Structures Conditionnelles

Les instructions conditionnelles permettent d'exécuter différents blocs de code selon que certaines conditions sont remplies ou non.

\`\`\`c
int age = 18;

if (age < 18) {
    printf("Mineur\n");
} else if (age == 18) {
    printf("Tout juste majeur\n");
} else {
    printf("Majeur\n");
}

// Opérateur ternaire
int statut = (age < 18) ? 0 : 1;  // 0 pour mineur, 1 pour majeur

// Switch
switch (age) {
    case 18:
        printf("Tout juste majeur\n");
        break;
    case 21:
        printf("Majeur aux US\n");
        break;
    default:
        printf("Âge quelconque\n");
}
\`\`\`

## Boucles

Les boucles permettent d'exécuter un bloc de code plusieurs fois.

\`\`\`c
// Boucle for
for (int i = 0; i < 5; i++) {
    printf("%d\n", i);  // Affiche 0, 1, 2, 3, 4
}

// Boucle while
int compteur = 0;
while (compteur < 5) {
    printf("%d\n", compteur);
    compteur++;  // Affiche 0, 1, 2, 3, 4
}

// Boucle do-while
int j = 0;
do {
    printf("%d\n", j);
    j++;
} while (j < 5);  // Affiche 0, 1, 2, 3, 4
\`\`\`

## Fonctions

Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.

\`\`\`c
// Déclaration et définition d'une fonction
int addition(int a, int b) {
    return a + b;
}

// Prototype de fonction (déclaration préalable)
void saluer(char nom[]);

// Définition de la fonction
void saluer(char nom[]) {
    printf("Bonjour, %s!\n", nom);
}

// Appel de fonction
int somme = addition(5, 3);
printf("Somme: %d\n", somme);  // Affiche "Somme: 8"

saluer("Alice");  // Affiche "Bonjour, Alice!"
\`\`\`

## Pointeurs

Les pointeurs sont des variables qui stockent l'adresse mémoire d'une autre variable.

\`\`\`c
int x = 10;
int *ptr = &x;  // ptr contient l'adresse de x

printf("Valeur de x: %d\n", x);        // Affiche 10
printf("Adresse de x: %p\n", &x);      // Affiche l'adresse mémoire de x
printf("Valeur de ptr: %p\n", ptr);    // Affiche la même adresse
printf("Valeur pointée par ptr: %d\n", *ptr);  // Affiche 10

// Modification via pointeur
*ptr = 20;
printf("Nouvelle valeur de x: %d\n", x);  // Affiche 20
\`\`\`

## Structures

Les structures permettent de regrouper des variables de différents types sous un même nom.

\`\`\`c
// Définition d'une structure
struct Personne {
    char nom[50];
    int age;
    float taille;
};

// Utilisation de la structure
struct Personne p1;
strcpy(p1.nom, "Jean");
p1.age = 30;
p1.taille = 1.75;

printf("Nom: %s, Age: %d, Taille: %.2f\n", p1.nom, p1.age, p1.taille);

// Initialisation lors de la déclaration
struct Personne p2 = {"Alice", 25, 1.68};
\`\`\`

## Allocation Dynamique de Mémoire

Le C permet l'allocation et la libération dynamique de mémoire avec les fonctions malloc(), calloc(), realloc() et free().

\`\`\`c
// Allocation de mémoire pour un entier
int *ptr = (int*) malloc(sizeof(int));
*ptr = 10;
printf("Valeur: %d\n", *ptr);  // Affiche 10

// Libération de la mémoire
free(ptr);

// Allocation d'un tableau
int *tableau = (int*) malloc(5 * sizeof(int));
for (int i = 0; i < 5; i++) {
    tableau[i] = i + 1;
}

// N'oubliez pas de libérer la mémoire
free(tableau);
\`\`\`

Le C est largement utilisé pour le développement système, les pilotes de périphériques, les systèmes embarqués et les applications nécessitant des performances élevées. Sa proximité avec le matériel et son efficacité en font un choix populaire pour les projets où la performance est critique.`
  },
  'C++': {
    title: 'Fondamentaux du C++',
    content: `# Introduction au C++

Le C++ est un langage de programmation polyvalent créé par Bjarne Stroustrup comme une extension du langage C. Il ajoute des fonctionnalités orientées objet et de nombreuses améliorations au C, tout en maintenant sa compatibilité et ses performances.

## Variables et Types de données

Le C++ est un langage à typage statique, ce qui signifie que le type de chaque variable doit être déclaré avant son utilisation.

\`\`\`cpp
// Types de base
int age = 25;              // Entier
float prix = 19.99f;       // Flottant simple précision
double pi = 3.14159265;    // Flottant double précision
char grade = 'A';          // Caractère
bool estVrai = true;       // Booléen (vrai/faux)

// Constantes
const double PI = 3.14159265;

// Chaînes de caractères
char nomC[10] = "C++";     // Style C
std::string nom = "C++";   // Style C++ (nécessite #include <string>)

// Tableaux
int nombres[5] = {1, 2, 3, 4, 5};

// Vecteurs (tableau dynamique)
std::vector<int> vecteur = {1, 2, 3, 4, 5};  // nécessite #include <vector>
\`\`\`

## Structures Conditionnelles

Les instructions conditionnelles permettent d'exécuter différents blocs de code selon que certaines conditions sont remplies ou non.

\`\`\`cpp
int age = 18;

if (age < 18) {
    std::cout << "Mineur" << std::endl;
} else if (age == 18) {
    std::cout << "Tout juste majeur" << std::endl;
} else {
    std::cout << "Majeur" << std::endl;
}

// Opérateur ternaire
std::string statut = (age < 18) ? "Mineur" : "Majeur";

// Switch
switch (age) {
    case 18:
        std::cout << "Tout juste majeur" << std::endl;
        break;
    case 21:
        std::cout << "Majeur aux US" << std::endl;
        break;
    default:
        std::cout << "Âge quelconque" << std::endl;
}
\`\`\`

## Boucles

Les boucles permettent d'exécuter un bloc de code plusieurs fois.

\`\`\`cpp
// Boucle for
for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;  // Affiche 0, 1, 2, 3, 4
}

// Boucle while
int compteur = 0;
while (compteur < 5) {
    std::cout << compteur << std::endl;
    compteur++;  // Affiche 0, 1, 2, 3, 4
}

// Boucle do-while
int j = 0;
do {
    std::cout << j << std::endl;
    j++;
} while (j < 5);  // Affiche 0, 1, 2, 3, 4

// Boucle for basée sur une plage (C++11)
std::vector<int> nombres = {1, 2, 3, 4, 5};
for (int nombre : nombres) {
    std::cout << nombre << std::endl;
}
\`\`\`

## Fonctions

Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.

\`\`\`cpp
// Déclaration et définition d'une fonction
int addition(int a, int b) {
    return a + b;
}

// Prototype de fonction (déclaration préalable)
void saluer(const std::string& nom);

// Définition de la fonction
void saluer(const std::string& nom) {
    std::cout << "Bonjour, " << nom << "!" << std::endl;
}

// Fonction avec paramètres par défaut
void afficherInfo(std::string nom, int age = 30) {
    std::cout << nom << " a " << age << " ans." << std::endl;
}

// Surcharge de fonction
void afficher(int nombre) {
    std::cout << "Entier: " << nombre << std::endl;
}

void afficher(std::string texte) {
    std::cout << "Texte: " << texte << std::endl;
}

// Appel de fonctions
int somme = addition(5, 3);
std::cout << "Somme: " << somme << std::endl;  // Affiche "Somme: 8"

saluer("Alice");  // Affiche "Bonjour, Alice!"
afficherInfo("Bob");  // Affiche "Bob a 30 ans."
afficherInfo("Charlie", 25);  // Affiche "Charlie a 25 ans."

afficher(42);  // Appelle la première version
afficher("Bonjour");  // Appelle la deuxième version
\`\`\`

## Classes et Objets

Le C++ est un langage de programmation orienté objet. Les classes permettent de créer des objets avec des attributs et des méthodes.

\`\`\`cpp
class Personne {
private:
    std::string nom;
    int age;
    
public:
    // Constructeur
    Personne(const std::string& n, int a) : nom(n), age(a) {}
    
    // Méthodes
    void presentation() const {
        std::cout << "Je m'appelle " << nom << " et j'ai " << age << " ans." << std::endl;
    }
    
    // Accesseurs (getters)
    std::string getNom() const { return nom; }
    int getAge() const { return age; }
    
    // Mutateurs (setters)
    void setNom(const std::string& n) { nom = n; }
    void setAge(int a) { age = a; }
};

// Création d'objets
Personne p1("Alice", 30);
p1.presentation();  // Affiche "Je m'appelle Alice et j'ai 30 ans."

std::cout << "Nom: " << p1.getNom() << std::endl;
p1.setAge(31);
std::cout << "Nouvel âge: " << p1.getAge() << std::endl;
\`\`\`

## Héritage

L'héritage permet à une classe d'hériter des attributs et des méthodes d'une autre classe.

\`\`\`cpp
class Etudiant : public Personne {
private:
    std::string ecole;
    
public:
    // Constructeur
    Etudiant(const std::string& n, int a, const std::string& e)
        : Personne(n, a), ecole(e) {}
    
    // Méthode redéfinie
    void presentation() const override {
        Personne::presentation();  // Appel de la méthode de la classe parent
        std::cout << "J'étudie à " << ecole << "." << std::endl;
    }
};

// Utilisation de la classe dérivée
Etudiant e1("Bob", 20, "Polytechnique");
e1.presentation();
\`\`\`

## Templates

Les templates permettent la programmation générique en C++.

\`\`\`cpp
// Fonction template
template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Classe template
template <typename T>
class Pile {
private:
    std::vector<T> elements;
    
public:
    void empiler(const T& element) {
        elements.push_back(element);
    }
    
    T depiler() {
        if (elements.empty()) {
            throw std::out_of_range("Pile vide");
        }
        T dernier = elements.back();
        elements.pop_back();
        return dernier;
    }
    
    bool estVide() const {
        return elements.empty();
    }
};

// Utilisation des templates
int max_int = maximum<int>(10, 20);  // 20
double max_double = maximum(3.14, 2.71);  // 3.14 (le type est déduit)

Pile<int> pileEntiers;
pileEntiers.empiler(10);
pileEntiers.empiler(20);
std::cout << pileEntiers.depiler() << std::endl;  // 20
\`\`\`

Le C++ est utilisé dans de nombreux domaines, notamment les jeux vidéo, les systèmes d'exploitation, les applications embarquées, les logiciels hautes performances et les applications financières. Sa puissance, sa flexibilité et son efficacité en font un choix populaire pour les projets où la performance et le contrôle détaillé sont importants.`
  },
  'PHP': {
    title: 'Introduction à PHP',
    content: `# Introduction à PHP

PHP (PHP: Hypertext Preprocessor) est un langage de script open source principalement utilisé pour le développement web côté serveur. Créé en 1994 par Rasmus Lerdorf, PHP est spécifiquement conçu pour la création de sites web dynamiques et d'applications web.

## Configuration de base

Un script PHP commence par \`<?php\` et se termine par \`?>\`. Il peut être intégré directement dans le HTML.

\`\`\`php
<!DOCTYPE html>
<html>
<head>
    <title>Ma page PHP</title>
</head>
<body>
    <h1>Bonjour en PHP</h1>
    <?php
        echo "Bonjour, monde!";
    ?>
</body>
</html>
\`\`\`

## Variables et Types de données

PHP est un langage à typage dynamique, ce qui signifie que les variables peuvent changer de type pendant l'exécution du programme.

\`\`\`php
// Déclaration de variables
$age = 25;              // Entier
$prix = 19.99;          // Flottant
$nom = "PHP";           // Chaîne de caractères
$estVrai = true;        // Booléen
$rien = null;           // Null

// Tableaux
$nombres = [1, 2, 3, 4, 5];  // Tableau indexé numériquement

// Tableau associatif
$personne = [
    "nom" => "Dupont",
    "age" => 30,
    "ville" => "Paris"
];

// Vérification du type
echo gettype($age);     // Affiche "integer"
var_dump($prix);        // Affiche des informations détaillées sur la variable
\`\`\`

## Structures Conditionnelles

Les instructions conditionnelles permettent d'exécuter différents blocs de code selon que certaines conditions sont remplies ou non.

\`\`\`php
$age = 18;

if ($age < 18) {
    echo "Mineur";
} elseif ($age == 18) {
    echo "Tout juste majeur";
} else {
    echo "Majeur";
}

// Opérateur ternaire
$statut = ($age < 18) ? "Mineur" : "Majeur";

// Switch
switch ($age) {
    case 18:
        echo "Tout juste majeur";
        break;
    case 21:
        echo "Majeur aux US";
        break;
    default:
        echo "Âge quelconque";
}
\`\`\`

## Boucles

Les boucles permettent d'exécuter un bloc de code plusieurs fois.

\`\`\`php
// Boucle for
for ($i = 0; $i < 5; $i++) {
    echo $i . "<br>";  // Affiche 0, 1, 2, 3, 4
}

// Boucle while
$compteur = 0;
while ($compteur < 5) {
    echo $compteur . "<br>";
    $compteur++;  // Affiche 0, 1, 2, 3, 4
}

// Boucle do-while
$j = 0;
do {
    echo $j . "<br>";
    $j++;
} while ($j < 5);  // Affiche 0, 1, 2, 3, 4

// Boucle foreach (pour les tableaux)
$fruits = ["pomme", "banane", "orange"];
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}

// Foreach avec clé et valeur
$personne = ["nom" => "Dupont", "age" => 30];
foreach ($personne as $clé => $valeur) {
    echo $clé . ": " . $valeur . "<br>";
}
\`\`\`

## Fonctions

Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.

\`\`\`php
// Déclaration d'une fonction
function saluer($nom) {
    return "Bonjour, " . $nom . "!";
}

// Fonction avec paramètres par défaut
function afficherInfo($nom, $age = 30) {
    echo $nom . " a " . $age . " ans.";
}

// Fonction avec nombre variable d'arguments
function somme(...$nombres) {
    return array_sum($nombres);
}

// Fonctions anonymes (closures)
$double = function($x) {
    return $x * 2;
};

// Appel de fonctions
$message = saluer("Alice");
echo $message;  // Affiche "Bonjour, Alice!"

afficherInfo("Bob");  // Affiche "Bob a 30 ans."
afficherInfo("Charlie", 25);  // Affiche "Charlie a 25 ans."

echo somme(1, 2, 3, 4, 5);  // Affiche 15

echo $double(5);  // Affiche 10
\`\`\`

## Classes et Objets

PHP supporte la programmation orientée objet. Les classes permettent de créer des objets avec des propriétés et des méthodes.

\`\`\`php
class Personne {
    // Propriétés
    private $nom;
    private $age;
    
    // Constructeur
    public function __construct($nom, $age) {
        $this->nom = $nom;
        $this->age = $age;
    }
    
    // Méthodes
    public function presentation() {
        return "Je m'appelle " . $this->nom . " et j'ai " . $this->age . " ans.";
    }
    
    // Getters et Setters
    public function getNom() {
        return $this->nom;
    }
    
    public function setNom($nom) {
        $this->nom = $nom;
    }
    
    public function getAge() {
        return $this->age;
    }
    
    public function setAge($age) {
        $this->age = $age;
    }
}

// Création d'un objet
$p1 = new Personne("Alice", 30);
echo $p1->presentation();  // Affiche "Je m'appelle Alice et j'ai 30 ans."

echo $p1->getNom();  // Affiche "Alice"
$p1->setAge(31);
echo $p1->getAge();  // Affiche 31
\`\`\`

## Héritage

L'héritage permet à une classe d'hériter des propriétés et des méthodes d'une autre classe.

\`\`\`php
class Etudiant extends Personne {
    private $ecole;
    
    public function __construct($nom, $age, $ecole) {
        parent::__construct($nom, $age);  // Appel du constructeur parent
        $this->ecole = $ecole;
    }
    
    public function presentation() {
        return parent::presentation() . " J'étudie à " . $this->ecole . ".";
    }
}

// Utilisation de la classe dérivée
$e1 = new Etudiant("Bob", 20, "Polytechnique");
echo $e1->presentation();  // Affiche "Je m'appelle Bob et j'ai 20 ans. J'étudie à Polytechnique."
\`\`\`

## Manipulation de Fichiers

PHP permet de lire et d'écrire des fichiers sur le serveur.

\`\`\`php
// Lecture d'un fichier
$contenu = file_get_contents("fichier.txt");
echo $contenu;

// Écriture dans un fichier
file_put_contents("nouveau.txt", "Bonjour, monde!");

// Manipulation avancée avec fopen
$fichier = fopen("donnees.txt", "r");
while (!feof($fichier)) {
    $ligne = fgets($fichier);
    echo $ligne . "<br>";
}
fclose($fichier);
\`\`\`

## Bases de données

PHP s'intègre facilement avec de nombreuses bases de données, notamment MySQL via l'extension MySQLi ou PDO.

\`\`\`php
// Connexion avec MySQLi
$mysqli = new mysqli("localhost", "utilisateur", "mot_de_passe", "base_de_données");

if ($mysqli->connect_error) {
    die("Connexion échouée: " . $mysqli->connect_error);
}

// Exécution d'une requête
$result = $mysqli->query("SELECT * FROM utilisateurs");

// Parcours des résultats
while ($row = $result->fetch_assoc()) {
    echo "Nom: " . $row["nom"] . "<br>";
}

$mysqli->close();

// Connexion avec PDO
try {
    $pdo = new PDO("mysql:host=localhost;dbname=base_de_données", "utilisateur", "mot_de_passe");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE age > ?");
    $stmt->execute([18]);
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "Nom: " . $row["nom"] . "<br>";
    }
} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage();
}
\`\`\`

PHP est principalement utilisé pour le développement de sites web dynamiques et d'applications web. Avec des frameworks comme Laravel, Symfony ou WordPress, il est possible de créer rapidement des applications web robustes et complexes.`
  },
  'SQL': {
    title: 'Les fondamentaux du SQL',
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

// Fonction principale d'insertion
const seedLanguageSummaries = async () => {
  const languages = await getLanguages();
  
  if (!languages || languages.length === 0) {
    console.log('Aucun langage trouvé dans la base de données.');
    return;
  }
  
  console.log(`${languages.length} langages trouvés. Insertion des résumés...`);
  
  for (const language of languages) {
    // Chercher le résumé correspondant au nom du langage
    const summary = summaries[language.name];
    
    if (summary) {
      // Vérifier si un résumé existe déjà pour ce langage
      const { data: existingSummary, error: checkError } = await supabase
        .from('language_summaries')
        .select('id')
        .eq('language_id', language.id)
        .maybeSingle();
        
      if (checkError) {
        console.error(`Erreur lors de la vérification pour ${language.name}:`, checkError);
        continue;
      }
      
      if (existingSummary) {
        // Mettre à jour le résumé existant
        const { error: updateError } = await supabase
          .from('language_summaries')
          .update({
            title: summary.title,
            content: summary.content
          })
          .eq('id', existingSummary.id);
          
        if (updateError) {
          console.error(`Erreur lors de la mise à jour pour ${language.name}:`, updateError);
        } else {
          console.log(`Résumé pour ${language.name} mis à jour.`);
        }
      } else {
        // Insérer un nouveau résumé
        const { error: insertError } = await supabase
          .from('language_summaries')
          .insert([{
            language_id: language.id,
            title: summary.title,
            content: summary.content
          }]);
          
        if (insertError) {
          console.error(`Erreur lors de l'insertion pour ${language.name}:`, insertError);
        } else {
          console.log(`Résumé pour ${language.name} inséré.`);
        }
      }
    } else {
      console.log(`Aucun résumé trouvé pour ${language.name}.`);
    }
  }
  
  console.log('Fin de l\'insertion des résumés.');
};

// Exécuter la fonction principale
seedLanguageSummaries()
  .catch(error => {
    console.error('Une erreur est survenue:', error);
  });
