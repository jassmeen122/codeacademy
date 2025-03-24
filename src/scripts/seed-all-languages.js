
// Script to seed all language summaries
import { supabase } from '../integrations/supabase/client';

const programmingLanguages = [
  {
    name: 'Python',
    description: 'Python est un langage de programmation polyvalent, idéal pour les débutants. Il est utilisé dans de nombreux domaines comme l\'intelligence artificielle, le développement web et l\'analyse de données.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png',
    color: '#306998',
    icon: 'code'
  },
  {
    name: 'JavaScript',
    description: 'JavaScript est un langage de programmation essentiel pour le développement web. Il permet de créer des sites web interactifs et est utilisé tant côté client que côté serveur avec Node.js.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png',
    color: '#f7df1e',
    icon: 'code'
  },
  {
    name: 'Java',
    description: 'Java est un langage orienté objet très populaire, utilisé principalement pour le développement d\'applications Android et de systèmes d\'entreprise.',
    image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/1200px-Java_programming_language_logo.svg.png',
    color: '#f89820',
    icon: 'coffee'
  },
  {
    name: 'C',
    description: 'C est un langage de programmation puissant et efficace, utilisé pour développer des systèmes d\'exploitation, des compilateurs et des applications performantes.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png',
    color: '#5c6bc0',
    icon: 'code'
  },
  {
    name: 'C++',
    description: 'C++ est une extension du langage C qui ajoute des fonctionnalités de programmation orientée objet. Il est utilisé dans le développement de jeux vidéo, de systèmes embarqués et d\'applications hautes performances.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png',
    color: '#00599c',
    icon: 'code'
  },
  {
    name: 'PHP',
    description: 'PHP est un langage de script côté serveur conçu pour le développement web, mais également utilisé comme langage de programmation généraliste.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/2560px-PHP-logo.svg.png',
    color: '#8892bf',
    icon: 'code'
  },
  {
    name: 'SQL',
    description: 'SQL est le langage standard pour gérer et manipuler les bases de données. Il est crucial pour les développeurs travaillant avec des systèmes de gestion de bases de données relationnelles.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png',
    color: '#f29111',
    icon: 'database'
  }
];

const summaryContents = {
  'Python': `1. Introduction à Python
Python est un langage de programmation polyvalent créé par Guido van Rossum. Il est connu pour sa syntaxe claire et lisible, ce qui en fait un excellent choix pour les débutants.

🔹 Caractéristiques principales :
- Langage interprété (pas besoin de compiler)
- Syntaxe simple et lisible
- Typage dynamique (pas besoin de déclarer les types)
- Riche en bibliothèques

2. Variables et Types de Données
Python utilise un typage dynamique, ce qui signifie que vous n'avez pas besoin de déclarer le type de vos variables.

🔹 Déclaration des variables
# Déclaration simple
nom = "Yassmine"  # chaîne de caractères (string)
age = 19          # entier (integer)
taille = 1.65     # nombre à virgule flottante (float)
est_etudiant = True  # booléen (boolean)

print("Je m'appelle", nom, "et j'ai", age, "ans.")

🔹 Types de données principales
Type	Exemple	Description
string	"Bonjour"	Texte
int	42	Nombre entier
float	3.14	Nombre décimal
bool	True/False	Valeur booléenne
list	[1, 2, 3]	Collection ordonnée
tuple	(1, 2, 3)	Collection immuable
dict	{"nom": "Ali"}	Paires clé-valeur

3. Conditions en Python
Python utilise des instructions if, elif et else pour les conditions.

🔹 Structure de base
age = 19

if age < 18:
    print("Vous êtes mineur.")
elif age == 18:
    print("Vous venez d'atteindre la majorité.")
else:
    print("Vous êtes majeur.")

🔹 Opérateurs de comparaison
==  # égal à
!=  # différent de
<   # inférieur à
>   # supérieur à
<=  # inférieur ou égal à
>=  # supérieur ou égal à

🔹 Opérateurs logiques
and  # ET logique
or   # OU logique
not  # NON logique

4. Boucles en Python
Python propose deux types de boucles: for et while.

🔹 Boucle for
# Parcourir une liste
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(fruit)

# Parcourir une plage de nombres
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

🔹 Boucle while
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1  # incrémentation

5. Fonctions en Python
Les fonctions sont définies avec le mot-clé def.

🔹 Définition de base
def saluer(nom):
    """Cette fonction affiche un message de salutation."""
    print(f"Bonjour, {nom}!")

# Appel de la fonction
saluer("Yassmine")

🔹 Fonctions avec valeur de retour
def additionner(a, b):
    return a + b

resultat = additionner(5, 3)
print(resultat)  # Affiche 8

6. Listes, Tuples et Dictionnaires
Python offre plusieurs structures de données intégrées.

🔹 Listes (modifiables)
fruits = ["pomme", "banane", "orange"]
fruits.append("raisin")  # Ajouter un élément
fruits[0] = "kiwi"       # Modifier un élément
print(fruits)

🔹 Tuples (non modifiables)
coordonnees = (10, 20)
# coordonnees[0] = 15  # Erreur: les tuples sont immuables

🔹 Dictionnaires (paires clé-valeur)
personne = {
    "nom": "Dalil",
    "age": 19,
    "ville": "Casablanca"
}
print(personne["nom"])  # Accéder à une valeur
personne["email"] = "example@email.com"  # Ajouter une paire

7. Modules et Bibliothèques
Python possède une vaste bibliothèque standard et de nombreux modules tiers.

🔹 Importation de modules
# Module de la bibliothèque standard
import math
print(math.sqrt(16))  # Racine carrée: 4.0

# Importation spécifique
from datetime import datetime
print(datetime.now())  # Date et heure actuelles

8. Gestion des Exceptions
Python permet de gérer les erreurs avec try, except, finally.

🔹 Structure try-except
try:
    nombre = int(input("Entrez un nombre: "))
    resultat = 10 / nombre
    print(resultat)
except ZeroDivisionError:
    print("Erreur: Division par zéro!")
except ValueError:
    print("Erreur: Veuillez entrer un nombre valide!")
finally:
    print("Opération terminée.")

9. Utilisation Pratique
Python est utilisé dans de nombreux domaines:

🔹 Analyse de données
import pandas as pd
# Créer un DataFrame
donnees = pd.DataFrame({
    'Nom': ['Ali', 'Sara', 'Karim'],
    'Age': [22, 25, 23]
})
print(donnees)

🔹 Intelligence artificielle
# Exemple simplifié avec scikit-learn
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np

# Données fictives
X = np.array([[1], [2], [3], [4]])  # Caractéristiques
y = np.array([2, 4, 6, 8])          # Cibles

# Création du modèle
modele = LinearRegression()
modele.fit(X, y)

# Prédiction
prediction = modele.predict([[5]])
print(f"Prédiction pour 5: {prediction[0]}")`,
  
  'JavaScript': `1. Déclaration des variables en JavaScript
Qu'est-ce qu'une variable ?
Une variable est un espace en mémoire où l'on stocke une donnée. Contrairement à Java, JavaScript est un langage dynamique, ce qui signifie qu'on n'a pas besoin de préciser le type de données (comme en Python).

Les trois façons de déclarer une variable en JavaScript
Il existe trois mots-clés pour déclarer une variable :

var (ancienne méthode, à éviter)

let (méthode recommandée)

const (pour les valeurs constantes)

Exemple :
var nom = "Yassmine"; // Ancienne manière (peut poser des problèmes)
let age = 19;         // Nouvelle manière, recommandée
const pays = "Maroc"; // Une valeur qui ne changera pas

Quelle est la différence entre var, let et const ?
Mot-clé	Modification possible ?	Portée (scope)
var	Oui	Fonction
let	Oui	Bloc {}
const	Non	Bloc {}

💡 Conseil :

Utilise let pour les variables qui peuvent changer.

Utilise const si la valeur ne doit jamais changer.

Évite var, car il peut créer des bugs.

2. Conditions en JavaScript
Une condition permet d'exécuter un code seulement si une certaine situation est vraie.

Condition if simple
let age = 19;

if (age >= 18) {
    console.log("Vous êtes majeur.");
}

💡 Explication :

Si age est supérieur ou égal à 18, alors on affiche "Vous êtes majeur.".

Condition if...else
let age = 16;

if (age >= 18) {
    console.log("Vous êtes majeur.");
} else {
    console.log("Vous êtes mineur.");
}

💡 Explication :

Si age est inférieur à 18, alors on affiche "Vous êtes mineur.".

Condition if...else if...else
Si on veut tester plusieurs cas, on utilise else if :

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

💡 Explication :

Si note est supérieure ou égale à 18, on affiche "Excellent".

Sinon, si note >= 14, on affiche "Bien".

Sinon, si note >= 10, on affiche "Passable".

Sinon, on affiche "Échec".

Conditions avec && et ||
Comme en Java :

&& (ET logique) → Les deux conditions doivent être vraies.

|| (OU logique) → Au moins une condition doit être vraie.

Exemple avec && (ET logique)
let argent = 50;
let age = 20;

if (age >= 18 && argent >= 100) {
    console.log("Vous pouvez entrer en boîte.");
} else {
    console.log("Accès refusé.");
}

💡 Explication :
✔️ La personne doit avoir plus de 18 ans ET au moins 100€.

Exemple avec || (OU logique)
let carteMembre = false;
let argent = 150;

if (carteMembre || argent >= 100) {
    console.log("Accès VIP accordé.");
} else {
    console.log("Accès refusé.");
}

💡 Explication :
✔️ Si la personne a une carte membre OU si elle a au moins 100€, elle peut entrer.

3. Fonctions en JavaScript
Une fonction est un bloc de code qui effectue une action et peut être réutilisé plusieurs fois.

Créer une fonction sans paramètres
function direBonjour() {
    console.log("Bonjour, bienvenue !");
}

// Appel de la fonction
direBonjour();

💡 Explication :

function direBonjour() → Définit une fonction nommée direBonjour.

console.log("Bonjour, bienvenue !") → Affiche "Bonjour, bienvenue !".

Fonctions avec paramètres
function saluer(nom) {
    console.log("Bonjour, " + nom + " !");
}

// Appel de la fonction
saluer("Yassmine");
saluer("Ahmed");

💡 Explication :

La fonction saluer(nom) prend un paramètre nom.

Elle affiche "Bonjour, Yassmine !", "Bonjour, Ahmed !", etc.

Fonctions qui retournent une valeur
function additionner(a, b) {
    return a + b;
}

// Stocker le résultat et l'afficher
let resultat = additionner(5, 7);
console.log(resultat);  // Affiche 12

💡 Explication :

La fonction additionne deux nombres et retourne le résultat.

La valeur est stockée dans resultat et affichée avec console.log().

Fonctions fléchées (Arrow Functions)
Depuis ES6, JavaScript propose une nouvelle façon d'écrire des fonctions plus courte :

const multiplier = (x, y) => x * y;

console.log(multiplier(3, 4));  // Affiche 12

💡 Explication :

(x, y) => x * y; est une fonction fléchée.

Elle est équivalente à :

function multiplier(x, y) {
    return x * y;
}

4. Différences entre JavaScript et Java
Caractéristique	Java	JavaScript
Type de langage	Langage compilé	Langage interprété
Déclaration des variables	int x = 5; (typé)	let x = 5; (dynamique)
Syntaxe des fonctions	public static void fonction()	function fonction()
Utilisation principale	Applications (Desktop, Android)	Web (Frontend & Backend)
Exécution	Nécessite un compilateur (javac)	Directement dans le navigateur`,
  
  'Java': `1. Introduction à Java
Java est un langage de programmation orienté objet créé par Sun Microsystems (maintenant Oracle) en 1995. Il est conçu pour être portable et peut s'exécuter sur différentes plateformes grâce à la machine virtuelle Java (JVM).

🔹 Caractéristiques principales :
- Langage orienté objet
- Multiplateforme (Write Once, Run Anywhere)
- Typage statique (les types de variables doivent être déclarés)
- Gestion automatique de la mémoire (garbage collection)

2. Structure d'un programme Java
Tout programme Java doit contenir au moins une classe avec une méthode main.

🔹 Structure de base
public class MonProgramme {
    public static void main(String[] args) {
        System.out.println("Bonjour, monde !");
    }
}

💡 Explication :
- public class MonProgramme : définit une classe nommée MonProgramme
- public static void main(String[] args) : méthode principale qui est exécutée lors du lancement
- System.out.println() : affiche du texte dans la console

3. Variables et Types de Données
Java est un langage à typage statique, ce qui signifie que vous devez spécifier le type de chaque variable.

🔹 Types primitifs
Type	Description	Exemple
int	Entier (32 bits)	int age = 25;
double	Nombre à virgule flottante	double prix = 19.99;
boolean	Valeur booléenne	boolean estVrai = true;
char	Caractère unique	char lettre = 'A';
byte	Entier (8 bits)	byte petit = 127;
short	Entier (16 bits)	short moyen = 32000;
long	Entier (64 bits)	long grand = 9223372036854775807L;
float	Flottant (32 bits)	float decimal = 3.14f;

🔹 Déclaration de variables
int age = 19;
String nom = "Yassmine";
double taille = 1.65;
boolean estEtudiant = true;

System.out.println("Je m'appelle " + nom + " et j'ai " + age + " ans.");

4. Opérateurs
Java offre une variété d'opérateurs similaires à ceux des autres langages.

🔹 Opérateurs arithmétiques
+    // Addition
-    // Soustraction
*    // Multiplication
/    // Division
%    // Modulo (reste de la division)
++   // Incrémentation
--   // Décrémentation

🔹 Opérateurs de comparaison
==   // Égal à
!=   // Différent de
>    // Supérieur à
<    // Inférieur à
>=   // Supérieur ou égal à
<=   // Inférieur ou égal à

🔹 Opérateurs logiques
&&   // ET logique
||   // OU logique
!    // NON logique

5. Structures conditionnelles
Java utilise des structures similaires à la plupart des langages.

🔹 If-else
int age = 19;

if (age < 18) {
    System.out.println("Vous êtes mineur.");
} else if (age == 18) {
    System.out.println("Vous venez tout juste d'être majeur.");
} else {
    System.out.println("Vous êtes majeur.");
}

🔹 Switch
int jour = 3;
String nomJour;

switch (jour) {
    case 1:
        nomJour = "Lundi";
        break;
    case 2:
        nomJour = "Mardi";
        break;
    case 3:
        nomJour = "Mercredi";
        break;
    // ... autres jours
    default:
        nomJour = "Jour invalide";
}

System.out.println("Aujourd'hui c'est " + nomJour);

6. Boucles
Java offre plusieurs types de boucles pour répéter des blocs de code.

🔹 Boucle for
for (int i = 0; i < 5; i++) {
    System.out.println("Itération " + i);
}

🔹 Boucle while
int compteur = 0;
while (compteur < 5) {
    System.out.println("Compteur : " + compteur);
    compteur++;
}

🔹 Boucle do-while
int nombre = 1;
do {
    System.out.println("Nombre : " + nombre);
    nombre++;
} while (nombre <= 5);

🔹 Boucle for-each (pour parcourir des collections)
String[] fruits = {"Pomme", "Banane", "Orange"};
for (String fruit : fruits) {
    System.out.println(fruit);
}

7. Tableaux et collections
Java propose diverses façons de stocker des groupes de données.

🔹 Tableaux
// Déclaration et initialisation
int[] nombres = {1, 2, 3, 4, 5};

// Accès aux éléments
System.out.println("Premier élément : " + nombres[0]);

// Tableaux à plusieurs dimensions
int[][] matrice = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

System.out.println(matrice[1][1]); // Affiche 5

🔹 ArrayList (collection dynamique)
import java.util.ArrayList;

ArrayList<String> liste = new ArrayList<>();
liste.add("Pomme");
liste.add("Banane");
liste.add("Orange");

System.out.println(liste.get(1)); // Affiche "Banane"
System.out.println(liste.size()); // Affiche 3

liste.remove("Banane");
System.out.println(liste); // Affiche [Pomme, Orange]

8. Méthodes (Fonctions)
En Java, les fonctions sont appelées méthodes et doivent être définies dans une classe.

🔹 Définition et appel de méthodes
public class Calculatrice {
    // Méthode sans paramètres et sans retour
    public static void afficherMessage() {
        System.out.println("Bienvenue dans la calculatrice !");
    }
    
    // Méthode avec paramètres et retour
    public static int additionner(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        afficherMessage();
        int somme = additionner(5, 3);
        System.out.println("5 + 3 = " + somme);
    }
}

9. Programmation Orientée Objet (POO)
Java est centré sur la POO, qui permet de structurer le code en objets.

🔹 Classes et Objets
// Définition d'une classe
public class Personne {
    // Attributs
    private String nom;
    private int age;
    
    // Constructeur
    public Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
    
    // Méthodes
    public void sePresenter() {
        System.out.println("Bonjour, je m'appelle " + nom + " et j'ai " + age + " ans.");
    }
    
    // Getters et Setters
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
}

// Utilisation de la classe
public class Main {
    public static void main(String[] args) {
        Personne personne1 = new Personne("Yassmine", 19);
        personne1.sePresenter();
        
        // Modification d'attributs
        personne1.setAge(20);
        System.out.println("Nouvel âge : " + personne1.getAge());
    }
}

10. Héritage et Polymorphisme
Java permet l'héritage entre classes, ce qui facilite la réutilisation du code.

🔹 Héritage
// Classe parent
public class Animal {
    protected String nom;
    
    public Animal(String nom) {
        this.nom = nom;
    }
    
    public void manger() {
        System.out.println(nom + " est en train de manger.");
    }
}

// Classe enfant
public class Chien extends Animal {
    private String race;
    
    public Chien(String nom, String race) {
        super(nom); // Appel du constructeur parent
        this.race = race;
    }
    
    public void aboyer() {
        System.out.println(nom + " aboie !");
    }
    
    // Surcharge (override) de la méthode parent
    @Override
    public void manger() {
        System.out.println(nom + " le chien mange des croquettes.");
    }
}

// Utilisation
public class Main {
    public static void main(String[] args) {
        Chien monChien = new Chien("Rex", "Berger Allemand");
        monChien.manger(); // Méthode surchargée
        monChien.aboyer(); // Méthode spécifique
    }
}

11. Exception Handling
Java permet de gérer les exceptions pour traiter les erreurs.

🔹 Try-Catch
try {
    int[] nombres = {1, 2, 3};
    System.out.println(nombres[5]); // Index hors limites
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Erreur: Index hors limites");
} finally {
    System.out.println("Ce bloc est toujours exécuté");
}

12. Entrées/Sorties
Java fournit diverses méthodes pour lire les entrées utilisateur et écrire des sorties.

🔹 Lecture des entrées
import java.util.Scanner;

public class EntreeUtilisateur {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Entrez votre nom : ");
        String nom = scanner.nextLine();
        
        System.out.print("Entrez votre âge : ");
        int age = scanner.nextInt();
        
        System.out.println("Bonjour, " + nom + ". Vous avez " + age + " ans.");
        
        scanner.close(); // Toujours fermer le scanner
    }
}`,
  
  'C': `1. Introduction au langage C
Le langage C est un langage de programmation procédural créé en 1972 par Dennis Ritchie chez Bell Labs. C'est un langage de bas niveau qui offre un contrôle direct sur la mémoire et le matériel.

🔹 Caractéristiques principales :
- Langage compilé (le code est traduit en langage machine avant exécution)
- Syntaxe concise et efficace
- Accès direct à la mémoire
- Grande portabilité
- Utilisé pour le développement système, les embarqués, et les applications performantes

2. Structure d'un programme C
Tout programme C doit avoir une fonction main qui sert de point d'entrée.

🔹 Structure de base
#include <stdio.h>  // Inclusion de bibliothèque

int main() {
    // Corps du programme
    printf("Bonjour, monde !\n");
    
    return 0;  // Code de retour (0 = succès)
}

💡 Explication :
- #include <stdio.h> : Inclusion de la bibliothèque standard d'entrée/sortie
- int main() : Fonction principale retournant un entier
- printf() : Fonction pour afficher du texte
- return 0 : Indique que le programme s'est terminé correctement

3. Variables et Types de Données
Le C est un langage à typage statique, ce qui signifie que le type de chaque variable doit être déclaré.

🔹 Types de base
Type	Description	Exemple
int	Entier	int age = 25;
float	Nombre à virgule flottante	float prix = 19.99f;
double	Nombre à virgule flottante (précision double)	double pi = 3.14159265359;
char	Caractère unique	char lettre = 'A';

🔹 Déclaration de variables
int age = 19;
float taille = 1.75f;
char premiere_lettre = 'Y';
double pi = 3.14159;

printf("J'ai %d ans et je mesure %.2f mètres.\n", age, taille);

🔹 Constantes
#define PI 3.14159  // Définition de constante préprocesseur

const int TAILLE_MAX = 100;  // Constante en C moderne

4. Opérateurs
Le C offre une variété d'opérateurs similaires à ceux d'autres langages.

🔹 Opérateurs arithmétiques
+    // Addition
-    // Soustraction
*    // Multiplication
/    // Division
%    // Modulo (reste de la division)
++   // Incrémentation
--   // Décrémentation

🔹 Opérateurs de comparaison
==   // Égal à
!=   // Différent de
>    // Supérieur à
<    // Inférieur à
>=   // Supérieur ou égal à
<=   // Inférieur ou égal à

🔹 Opérateurs logiques
&&   // ET logique
||   // OU logique
!    // NON logique

🔹 Opérateurs bit à bit
&    // ET bit à bit
|    // OU bit à bit
^    // OU exclusif bit à bit
~    // NON bit à bit
<<   // Décalage à gauche
>>   // Décalage à droite

5. Structures conditionnelles
Le C utilise des structures similaires à la plupart des langages.

🔹 If-else
int age = 19;

if (age < 18) {
    printf("Vous êtes mineur.\n");
} else if (age == 18) {
    printf("Vous venez tout juste d'être majeur.\n");
} else {
    printf("Vous êtes majeur.\n");
}

🔹 Switch
int jour = 3;

switch (jour) {
    case 1:
        printf("Lundi\n");
        break;
    case 2:
        printf("Mardi\n");
        break;
    case 3:
        printf("Mercredi\n");
        break;
    // ... autres jours
    default:
        printf("Jour invalide\n");
}

🔹 Opérateur ternaire
int age = 20;
char* statut = (age >= 18) ? "majeur" : "mineur";
printf("Vous êtes %s.\n", statut);

6. Boucles
Le C offre trois types principaux de boucles.

🔹 Boucle for
for (int i = 0; i < 5; i++) {
    printf("Itération %d\n", i);
}

🔹 Boucle while
int compteur = 0;
while (compteur < 5) {
    printf("Compteur : %d\n", compteur);
    compteur++;
}

🔹 Boucle do-while
int nombre = 1;
do {
    printf("Nombre : %d\n", nombre);
    nombre++;
} while (nombre <= 5);

7. Tableaux
Les tableaux en C sont des collections d'éléments du même type stockés de manière contiguë en mémoire.

🔹 Déclaration et initialisation
// Déclaration et initialisation
int nombres[5] = {1, 2, 3, 4, 5};

// Accès aux éléments
printf("Premier élément : %d\n", nombres[0]);

// Tableaux à plusieurs dimensions
int matrice[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

printf("Élément central : %d\n", matrice[1][1]); // Affiche 5

8. Chaînes de caractères
En C, les chaînes de caractères sont des tableaux de caractères terminés par le caractère nul ('\0').

🔹 Déclaration et manipulation
char nom[50] = "Yassmine";
printf("Bonjour, %s !\n", nom);

// Fonctions de manipulation de chaînes (inclure <string.h>)
#include <string.h>

char prenom[20] = "Yassmine";
char nom[20] = "Dalil";
char nom_complet[40];

// Copie de chaîne
strcpy(nom_complet, prenom);

// Concaténation de chaînes
strcat(nom_complet, " ");
strcat(nom_complet, nom);

printf("Nom complet : %s\n", nom_complet);

// Longueur d'une chaîne
int longueur = strlen(nom_complet);
printf("Longueur : %d\n", longueur);

9. Fonctions
Les fonctions permettent de diviser le code en blocs réutilisables.

🔹 Définition et appel de fonctions
// Déclaration (prototype) de fonction
int additionner(int a, int b);

int main() {
    int resultat = additionner(5, 3);
    printf("5 + 3 = %d\n", resultat);
    return 0;
}

// Définition de la fonction
int additionner(int a, int b) {
    return a + b;
}

🔹 Passage par valeur vs par référence
// Passage par valeur
void incrementer_valeur(int n) {
    n++; // Cette modification n'affecte pas la variable originale
}

// Passage par référence (en utilisant des pointeurs)
void incrementer_reference(int* n) {
    (*n)++; // Cette modification affecte la variable originale
}

int main() {
    int a = 5;
    incrementer_valeur(a);
    printf("Après incrementer_valeur : %d\n", a); // Affiche 5
    
    incrementer_reference(&a);
    printf("Après incrementer_reference : %d\n", a); // Affiche 6
    
    return 0;
}

10. Pointeurs
Les pointeurs sont des variables qui stockent des adresses mémoire, permettant un accès et une manipulation directs de la mémoire.

🔹 Déclaration et utilisation
int n = 10;
int* p = &n; // p contient l'adresse de n

printf("Valeur de n : %d\n", n);
printf("Adresse de n : %p\n", &n);
printf("Contenu du pointeur p : %p\n", p);
printf("Valeur pointée par p : %d\n", *p);

// Modification via le pointeur
*p = 20;
printf("Nouvelle valeur de n : %d\n", n); // Affiche 20

🔹 Arithmétique des pointeurs
int tableau[5] = {10, 20, 30, 40, 50};
int* ptr = tableau; // ptr pointe vers le premier élément

// Accès aux éléments via le pointeur
printf("Premier élément : %d\n", *ptr);
printf("Deuxième élément : %d\n", *(ptr + 1));
printf("Troisième élément : %d\n", *(ptr + 2));

// Parcours du tableau avec arithmétique des pointeurs
for (int i = 0; i < 5; i++) {
    printf("Élément %d : %d\n", i, *(ptr + i));
}

11. Structures
Les structures permettent de regrouper différents types de données sous un seul nom.

🔹 Définition et utilisation
// Définition d'une structure
struct Personne {
    char nom[50];
    int age;
    float taille;
};

int main() {
    // Déclaration et initialisation
    struct Personne p1 = {"Yassmine", 19, 1.65f};
    
    // Accès aux membres
    printf("Nom : %s\n", p1.nom);
    printf("Age : %d\n", p1.age);
    printf("Taille : %.2f m\n", p1.taille);
    
    // Modification des membres
    p1.age = 20;
    printf("Nouvel âge : %d\n", p1.age);
    
    return 0;
}

🔹 Pointeurs vers des structures
struct Personne p1 = {"Yassmine", 19, 1.65f};
struct Personne* ptr = &p1;

// Accès aux membres via le pointeur
printf("Nom (via pointeur) : %s\n", ptr->nom); // Équivalent à (*ptr).nom
printf("Age (via pointeur) : %d\n", ptr->age);

12. Allocation dynamique de mémoire
Le C permet d'allouer et de libérer de la mémoire dynamiquement pendant l'exécution du programme.

🔹 Fonctions d'allocation (inclure <stdlib.h>)
#include <stdlib.h>

// Allocation d'un entier
int* p = (int*) malloc(sizeof(int));
*p = 42;
printf("Valeur allouée : %d\n", *p);

// Allocation d'un tableau
int* tableau = (int*) malloc(5 * sizeof(int));
for (int i = 0; i < 5; i++) {
    tableau[i] = i * 10;
    printf("tableau[%d] = %d\n", i, tableau[i]);
}

// Liberation de la mémoire (TRÈS IMPORTANT en C)
free(p);
free(tableau);

// Allocation avec calloc (initialise à zéro)
int* nombres = (int*) calloc(5, sizeof(int));
// ...utilisation...
free(nombres);

// Redimensionnement avec realloc
tableau = (int*) realloc(tableau, 10 * sizeof(int));
// ...utilisation du tableau redimensionné...
free(tableau);

13. Fichiers
Le C permet de lire et d'écrire des données dans des fichiers.

🔹 Opérations sur les fichiers (inclure <stdio.h>)
#include <stdio.h>

// Écriture dans un fichier
FILE* fichier = fopen("exemple.txt", "w");
if (fichier != NULL) {
    fprintf(fichier, "Bonjour depuis C !\n");
    fprintf(fichier, "Nombre : %d\n", 42);
    fclose(fichier);
}

// Lecture d'un fichier
fichier = fopen("exemple.txt", "r");
if (fichier != NULL) {
    char ligne[100];
    while (fgets(ligne, sizeof(ligne), fichier) != NULL) {
        printf("Lu : %s", ligne);
    }
    fclose(fichier);
}

14. Préprocesseur
Le préprocesseur C traite le code avant la compilation proprement dite.

🔹 Directives du préprocesseur
#include <stdio.h>  // Inclusion de bibliothèque
#define PI 3.14159  // Définition de constante
#define CARRE(x) ((x) * (x))  // Définition de macro

// Compilation conditionnelle
#ifdef DEBUG
    #define LOG(msg) printf("DEBUG: %s\n", msg)
#else
    #define LOG(msg) // Ne fait rien en mode production
#endif

int main() {
    printf("Valeur de PI : %f\n", PI);
    printf("Carré de 5 : %d\n", CARRE(5));
    
    LOG("Programme en cours d'exécution");
    
    return 0;
}`,
  
  'C++': `1. Introduction au C++
Le C++ est un langage de programmation créé par Bjarne Stroustrup en 1983 comme une extension du langage C. Il ajoute des fonctionnalités de programmation orientée objet et de nombreuses améliorations par rapport au C.

🔹 Caractéristiques principales :
- Combines programmation procédurale et orientée objet
- Performance élevée et accès bas niveau
- Typage statique fort
- Support des templates (programmation générique)
- Gestion manuelle de la mémoire (avec options automatiques modernes)
- Utilisé dans le développement de jeux, systèmes embarqués, applications hautes performances

2. Structure d'un programme C++
Similaire au C, un programme C++ commence par un point d'entrée main().

🔹 Structure de base
#include <iostream>  // Inclusion de bibliothèque

int main() {
    // Corps du programme
    std::cout << "Bonjour, monde !" << std::endl;
    
    return 0;  // Code de retour (0 = succès)
}

💡 Explication :
- #include <iostream> : Inclusion de la bibliothèque d'entrée/sortie
- std::cout : Flux de sortie standard (écran)
- std::endl : Insère une nouvelle ligne et vide le tampon

🔹 Utilisation de l'espace de nommage std
#include <iostream>
using namespace std;  // Permet d'utiliser cout sans préfixe std::

int main() {
    cout << "C++ est puissant !" << endl;
    return 0;
}

3. Variables et Types de Données
Le C++ hérite des types de données du C et en ajoute de nouveaux.

🔹 Types de base
Type	Description	Exemple
int	Entier	int age = 25;
float	Nombre à virgule flottante	float prix = 19.99f;
double	Nombre à virgule flottante (précision double)	double pi = 3.14159265359;
char	Caractère unique	char lettre = 'A';
bool	Booléen	bool estVrai = true;

🔹 Déclaration de variables
int age = 19;
float taille = 1.75f;
char premiere_lettre = 'Y';
bool est_etudiant = true;
string nom = "Yassmine";  // Nécessite #include <string>

cout << "Je m'appelle " << nom << " et j'ai " << age << " ans." << endl;

🔹 Constantes
#define PI 3.14159  // Définition de constante préprocesseur (style C)

const double PI_CONST = 3.14159;  // Constante avec type (style C++ préféré)
constexpr int TAILLE_MAX = 100;   // Constante évaluée à la compilation (C++11)

4. Entrées/Sorties
C++ utilise des flux (streams) pour les entrées/sorties.

🔹 Sortie standard (cout)
#include <iostream>
using namespace std;

int main() {
    int age = 19;
    string nom = "Yassmine";
    
    cout << "Bonjour, " << nom << "!" << endl;
    cout << "Vous avez " << age << " ans." << endl;
    
    return 0;
}

🔹 Entrée standard (cin)
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nom;
    int age;
    
    cout << "Entrez votre nom : ";
    cin >> nom;
    
    cout << "Entrez votre âge : ";
    cin >> age;
    
    cout << "Bonjour, " << nom << "! Vous avez " << age << " ans." << endl;
    
    return 0;
}

5. Structures conditionnelles
Similaires au C, avec l'ajout du type bool.

🔹 If-else
int age = 19;

if (age < 18) {
    cout << "Vous êtes mineur." << endl;
} else if (age == 18) {
    cout << "Vous venez tout juste d'être majeur." << endl;
} else {
    cout << "Vous êtes majeur." << endl;
}

🔹 Switch
int jour = 3;

switch (jour) {
    case 1:
        cout << "Lundi" << endl;
        break;
    case 2:
        cout << "Mardi" << endl;
        break;
    case 3:
        cout << "Mercredi" << endl;
        break;
    // ... autres jours
    default:
        cout << "Jour invalide" << endl;
}

🔹 Opérateur ternaire
int age = 20;
string statut = (age >= 18) ? "majeur" : "mineur";
cout << "Vous êtes " << statut << "." << endl;

6. Boucles
Similaires au C, avec quelques améliorations.

🔹 Boucle for
for (int i = 0; i < 5; i++) {
    cout << "Itération " << i << endl;
}

🔹 Boucle for avec plage (C++11)
int tableau[] = {10, 20, 30, 40, 50};

for (int valeur : tableau) {
    cout << valeur << " ";
}
cout << endl;

// Pour les chaînes de caractères
string nom = "Yassmine";
for (char lettre : nom) {
    cout << lettre << " ";
}
cout << endl;

🔹 Boucle while
int compteur = 0;
while (compteur < 5) {
    cout << "Compteur : " << compteur << endl;
    compteur++;
}

🔹 Boucle do-while
int nombre = 1;
do {
    cout << "Nombre : " << nombre << endl;
    nombre++;
} while (nombre <= 5);

7. Chaînes de caractères
C++ offre deux façons de manipuler les chaînes : style C et classe string.

🔹 Style C (tableau de caractères)
char nom[50] = "Yassmine";
cout << "Bonjour, " << nom << " !" << endl;

🔹 Classe string (plus moderne et puissante)
#include <string>
using namespace std;

string prenom = "Yassmine";
string nom = "Dalil";

// Concaténation
string nom_complet = prenom + " " + nom;
cout << "Nom complet : " << nom_complet << endl;

// Méthodes utiles
cout << "Longueur : " << nom_complet.length() << endl;
cout << "Première lettre : " << nom_complet[0] << endl;
cout << "Sous-chaîne : " << nom_complet.substr(0, 8) << endl;

if (prenom == "Yassmine") {
    cout << "Bonjour Yassmine !" << endl;
}

8. Fonctions
Les fonctions en C++ peuvent avoir des valeurs par défaut et la surcharge.

🔹 Définition et appel
// Déclaration (prototype)
int additionner(int a, int b);

int main() {
    int resultat = additionner(5, 3);
    cout << "5 + 3 = " << resultat << endl;
    return 0;
}

// Définition
int additionner(int a, int b) {
    return a + b;
}

🔹 Paramètres par défaut
void afficher_message(string message = "Bonjour", int fois = 1) {
    for (int i = 0; i < fois; i++) {
        cout << message << endl;
    }
}

int main() {
    afficher_message();  // Affiche "Bonjour" une fois
    afficher_message("Salut");  // Affiche "Salut" une fois
    afficher_message("Coucou", 3);  // Affiche "Coucou" trois fois
    return 0;
}

🔹 Surcharge de fonctions
// Plusieurs fonctions avec le même nom mais des paramètres différents
int additionner(int a, int b) {
    return a + b;
}

double additionner(double a, double b) {
    return a + b;
}

string additionner(string a, string b) {
    return a + b;
}

int main() {
    cout << additionner(5, 3) << endl;  // Utilise la version int
    cout << additionner(2.5, 3.7) << endl;  // Utilise la version double
    cout << additionner("Hello ", "World") << endl;  // Utilise la version string
    return 0;
}

9. Classes et Objets
La programmation orientée objet est une fonctionnalité clé du C++.

🔹 Définition de classe
class Personne {
private:
    // Attributs (membres de données)
    string nom;
    int age;
    
public:
    // Constructeur
    Personne(string n, int a) {
        nom = n;
        age = a;
    }
    
    // Méthodes
    void se_presenter() {
        cout << "Bonjour, je m'appelle " << nom << " et j'ai " << age << " ans." << endl;
    }
    
    // Accesseurs (getters)
    string get_nom() const {
        return nom;
    }
    
    int get_age() const {
        return age;
    }
    
    // Mutateurs (setters)
    void set_age(int nouvel_age) {
        if (nouvel_age > 0) {
            age = nouvel_age;
        }
    }
};

🔹 Utilisation de la classe
int main() {
    // Création d'objets
    Personne p1("Yassmine", 19);
    p1.se_presenter();
    
    // Utilisation des accesseurs et mutateurs
    cout << "Nom : " << p1.get_nom() << endl;
    
    p1.set_age(20);
    cout << "Nouvel âge : " << p1.get_age() << endl;
    
    return 0;
}

10. Constructeurs et Destructeur
Les constructeurs initialisent les objets, le destructeur nettoie les ressources.

🔹 Constructeurs multiples
class Rectangle {
private:
    double longueur;
    double largeur;
    
public:
    // Constructeur par défaut
    Rectangle() {
        longueur = 0.0;
        largeur = 0.0;
    }
    
    // Constructeur avec paramètres
    Rectangle(double l, double L) {
        longueur = l;
        largeur = L;
    }
    
    // Constructeur avec un seul paramètre (crée un carré)
    Rectangle(double cote) {
        longueur = cote;
        largeur = cote;
    }
    
    // Liste d'initialisation (meilleure pratique)
    Rectangle(double l, double L, string n) : longueur(l), largeur(L), nom(n) {
        // Corps du constructeur (peut être vide)
    }
    
    // Destructeur
    ~Rectangle() {
        cout << "Destruction du rectangle" << endl;
        // Libération de ressources si nécessaire
    }
    
    // Méthode pour calculer l'aire
    double aire() const {
        return longueur * largeur;
    }
    
    string nom;
};

11. Héritage
L'héritage permet de créer des hiérarchies de classes.

🔹 Classe de base et classe dérivée
// Classe de base
class Animal {
protected:
    string nom;
    
public:
    Animal(string n) : nom(n) {}
    
    void manger() {
        cout << nom << " est en train de manger." << endl;
    }
    
    virtual void faire_bruit() {
        cout << nom << " fait un bruit." << endl;
    }
};

// Classe dérivée
class Chien : public Animal {
private:
    string race;
    
public:
    Chien(string n, string r) : Animal(n), race(r) {}
    
    void aboyer() {
        cout << nom << " aboie !" << endl;
    }
    
    // Surcharge (override) de la méthode de la classe de base
    void faire_bruit() override {
        cout << nom << " dit Wouf Wouf !" << endl;
    }
    
    string get_race() const {
        return race;
    }
};

🔹 Utilisation de l'héritage
int main() {
    Animal animal("Animal Générique");
    animal.faire_bruit();  // Affiche "Animal Générique fait un bruit."
    
    Chien rex("Rex", "Berger Allemand");
    rex.manger();  // Méthode héritée
    rex.aboyer();  // Méthode spécifique
    rex.faire_bruit();  // Méthode surchargée
    
    cout << "Race de Rex : " << rex.get_race() << endl;
    
    // Polymorphisme
    Animal* a = &rex;
    a->faire_bruit();  // Appelle la version surchargée
    
    return 0;
}

12. Polymorphisme
Le polymorphisme permet à des objets de différentes classes d'être traités comme des objets d'une classe commune.

🔹 Utilisation de fonctions virtuelles
class Forme {
public:
    virtual double aire() const {
        return 0.0;
    }
    
    virtual void afficher() const {
        cout << "Forme générique" << endl;
    }
    
    // Destructeur virtuel (important pour l'héritage)
    virtual ~Forme() {}
};

class Cercle : public Forme {
private:
    double rayon;
    
public:
    Cercle(double r) : rayon(r) {}
    
    double aire() const override {
        return 3.14159 * rayon * rayon;
    }
    
    void afficher() const override {
        cout << "Cercle de rayon " << rayon << endl;
    }
};

class Rectangle : public Forme {
private:
    double longueur;
    double largeur;
    
public:
    Rectangle(double l, double L) : longueur(l), largeur(L) {}
    
    double aire() const override {
        return longueur * largeur;
    }
    
    void afficher() const override {
        cout << "Rectangle de dimensions " << longueur << "x" << largeur << endl;
    }
};

🔹 Utilisation du polymorphisme
int main() {
    Forme* formes[3];
    formes[0] = new Cercle(2.5);
    formes[1] = new Rectangle(3.0, 4.0);
    formes[2] = new Cercle(1.0);
    
    double aire_totale = 0.0;
    
    for (int i = 0; i < 3; i++) {
        formes[i]->afficher();
        aire_totale += formes[i]->aire();
        
        // Libération de la mémoire
        delete formes[i];
    }
    
    cout << "Aire totale : " << aire_totale << endl;
    
    return 0;
}

13. Templates
Les templates permettent d'écrire du code générique qui fonctionne avec différents types de données.

🔹 Fonction template
template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << "Max (5, 10) : " << maximum(5, 10) << endl;
    cout << "Max (3.14, 2.71) : " << maximum(3.14, 2.71) << endl;
    cout << "Max (abc, xyz) : " << maximum(string("abc"), string("xyz")) << endl;
    
    return 0;
}

🔹 Classe template
template <typename T>
class Pile {
private:
    T elements[100];
    int taille;
    
public:
    Pile() : taille(0) {}
    
    void empiler(T element) {
        if (taille < 100) {
            elements[taille++] = element;
        }
    }
    
    T depiler() {
        if (taille > 0) {
            return elements[--taille];
        }
        throw runtime_error("Pile vide");
    }
    
    bool est_vide() const {
        return taille == 0;
    }
};

int main() {
    // Pile d'entiers
    Pile<int> pile_entiers;
    pile_entiers.empiler(10);
    pile_entiers.empiler(20);
    cout << pile_entiers.depiler() << endl;  // Affiche 20
    
    // Pile de chaînes
    Pile<string> pile_chaines;
    pile_chaines.empiler("Bonjour");
    pile_chaines.empiler("Monde");
    cout << pile_chaines.depiler() << endl;  // Affiche "Monde"
    
    return 0;
}

14. STL (Standard Template Library)
La STL fournit des conteneurs, itérateurs et algorithmes prêts à l'emploi.

🔹 Conteneurs
#include <vector>
#include <list>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    // Vector (tableau dynamique)
    vector<int> nombres = {10, 20, 30, 40, 50};
    nombres.push_back(60);  // Ajoute à la fin
    
    cout << "Taille du vecteur : " << nombres.size() << endl;
    cout << "Premier élément : " << nombres.front() << endl;
    cout << "Dernier élément : " << nombres.back() << endl;
    
    // Parcours avec itérateur
    for (vector<int>::iterator it = nombres.begin(); it != nombres.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // Parcours simplifié (C++11)
    for (int n : nombres) {
        cout << n << " ";
    }
    cout << endl;
    
    // Liste chaînée
    list<string> noms = {"Yassmine", "Ahmed", "Sara"};
    noms.push_front("Karim");  // Ajoute au début
    
    // Map (dictionnaire)
    map<string, int> ages;
    ages["Yassmine"] = 19;
    ages["Ahmed"] = 22;
    
    cout << "Age de Yassmine : " << ages["Yassmine"] << endl;
    
    // Parcours d'une map
    for (const auto& paire : ages) {
        cout << paire.first << " : " << paire.second << " ans" << endl;
    }
    
    return 0;
}

🔹 Algorithmes
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    vector<int> nombres = {5, 2, 8, 1, 9, 3};
    
    // Tri
    sort(nombres.begin(), nombres.end());
    
    // Affichage avec for_each et lambda (C++11)
    cout << "Nombres triés : ";
    for_each(nombres.begin(), nombres.end(), [](int n) {
        cout << n << " ";
    });
    cout << endl;
    
    // Recherche
    auto it = find(nombres.begin(), nombres.end(), 8);
    if (it != nombres.end()) {
        cout << "Trouvé " << *it << " à la position " << distance(nombres.begin(), it) << endl;
    }
    
    // Min/Max
    auto [min_it, max_it] = minmax_element(nombres.begin(), nombres.end());
    cout << "Min : " << *min_it << ", Max : " << *max_it << endl;
    
    return 0;
}`,
  
  'PHP': `1. Introduction à PHP
PHP (Hypertext Preprocessor) est un langage de programmation côté serveur utilisé principalement pour le développement web. Il permet de générer des pages dynamiques, se connecter à une base de données, et gérer les formulaires.

💡 Points forts de PHP :
✔️ Facile à apprendre et à utiliser.
✔️ Intégré avec HTML.
✔️ Compatible avec MySQL, PostgreSQL, SQLite, etc.
✔️ Fonctionne sur tous les serveurs web (Apache, Nginx…).

2. Déclaration des Variables en PHP
En PHP, les variables commencent toujours par $, et il n'est pas nécessaire de préciser le type de la variable (PHP est un langage faiblement typé).

🔹 Syntaxe des Variables
<?php
$nom = "Yassmine";  // Chaîne de caractères
$age = 19;          // Entier
$prix = 15.99;      // Float
$estConnecte = true; // Booléen

echo "Nom : $nom, Age : $age, Prix : $prix";
?>

💡 Explication :

$nom = "Yassmine"; → Variable contenant une chaîne de caractères.

$age = 19; → Variable de type entier.

$prix = 15.99; → Variable de type décimal.

$estConnecte = true; → Booléen (true ou false).

👉 PHP déduit automatiquement le type des variables en fonction de la valeur qu'on leur attribue.

3. Conditions en PHP (if, else if, else)
PHP utilise les mêmes conditions que la plupart des langages de programmation (if, else if, else).

🔹 Condition if simple
<?php
$age = 20;

if ($age >= 18) {
    echo "Vous êtes majeur.";
}
?>

💡 Explication :
Si $age est supérieur ou égal à 18, on affiche "Vous êtes majeur.".

🔹 Condition if...else
<?php
$age = 16;

if ($age >= 18) {
    echo "Vous êtes majeur.";
} else {
    echo "Vous êtes mineur.";
}
?>

💡 Explication :
Si $age est inférieur à 18, alors on affiche "Vous êtes mineur.".

🔹 Condition if...else if...else
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

💡 Explication :

Si note >= 18, on affiche "Excellent !".

Si note >= 14, on affiche "Bien !".

Si note >= 10, on affiche "Passable.".

Sinon, on affiche "Échec.".

4. Fonctions en PHP
Une fonction est un bloc de code qui exécute une tâche spécifique.

🔹 Déclaration d'une fonction sans paramètre
<?php
function direBonjour() {
    echo "Bonjour, bienvenue sur notre site !";
}

direBonjour();
?>

💡 Explication :

function direBonjour() → Déclaration d'une fonction nommée direBonjour.

echo "Bonjour..."; → Affichage d'un message.

direBonjour(); → Appel de la fonction.

🔹 Fonction avec paramètres
<?php
function saluer($nom) {
    echo "Bonjour, $nom !";
}

saluer("Yassmine");
?>

💡 Explication :

$nom est un paramètre passé à la fonction saluer.

Lorsqu'on appelle saluer("Yassmine");, le message "Bonjour, Yassmine !" s'affiche.

🔹 Fonction avec retour de valeur
<?php
function additionner($a, $b) {
    return $a + $b;
}

$resultat = additionner(5, 7);
echo "Résultat : $resultat";
?>

💡 Explication :

La fonction additionner($a, $b) retourne la somme de $a et $b.

Le résultat est stocké dans la variable $resultat et affiché.

5. Tableaux en PHP
PHP propose plusieurs types de tableaux pour stocker des collections de valeurs.

🔹 Tableau indexé
<?php
// Déclaration et initialisation
$fruits = array("Pomme", "Banane", "Orange");
// Syntaxe alternative (PHP 5.4+)
$legumes = ["Carotte", "Tomate", "Poivron"];

// Accès aux éléments par index
echo $fruits[0];  // Affiche "Pomme"
echo $legumes[1];  // Affiche "Tomate"

// Ajouter un élément
$fruits[] = "Fraise";

// Parcourir un tableau
foreach ($fruits as $fruit) {
    echo "$fruit, ";
}
?>

🔹 Tableau associatif (clé-valeur)
<?php
// Déclaration et initialisation
$personne = array(
    "nom" => "Dalil",
    "age" => 19,
    "ville" => "Casablanca"
);
// Syntaxe alternative
$etudiant = [
    "prenom" => "Yassmine",
    "formation" => "Informatique",
    "annee" => 2
];

// Accès aux éléments par clé
echo $personne["nom"];  // Affiche "Dalil"
echo $etudiant["formation"];  // Affiche "Informatique"

// Parcourir un tableau associatif
foreach ($personne as $cle => $valeur) {
    echo "$cle : $valeur, ";
}
?>

🔹 Tableau multidimensionnel
<?php
$etudiants = [
    ["Yassmine", "Informatique", 19],
    ["Ahmed", "Mathématiques", 20],
    ["Sara", "Physique", 21]
];

echo $etudiants[0][0];  // Affiche "Yassmine"
echo $etudiants[1][1];  // Affiche "Mathématiques"

// Tableau associatif multidimensionnel
$classes = [
    "info" => ["Yassmine", "Karim", "Leila"],
    "math" => ["Ahmed", "Meryem", "Omar"]
];

echo $classes["info"][0];  // Affiche "Yassmine"
?>

6. Boucles en PHP
PHP offre plusieurs types de boucles pour répéter des blocs de code.

🔹 Boucle for
<?php
for ($i = 0; $i < 5; $i++) {
    echo "Itération $i<br>";
}
?>

🔹 Boucle while
<?php
$compteur = 0;
while ($compteur < 5) {
    echo "Compteur : $compteur<br>";
    $compteur++;
}
?>

🔹 Boucle do-while
<?php
$nombre = 1;
do {
    echo "Nombre : $nombre<br>";
    $nombre++;
} while ($nombre <= 5);
?>

🔹 Boucle foreach
<?php
$fruits = ["Pomme", "Banane", "Orange", "Fraise"];

foreach ($fruits as $fruit) {
    echo "$fruit, ";
}

// Avec clé et valeur
$personne = [
    "nom" => "Dalil",
    "prenom" => "Yassmine",
    "age" => 19
];

foreach ($personne as $cle => $valeur) {
    echo "$cle : $valeur<br>";
}
?>

7. Chaînes de caractères
PHP offre de nombreuses fonctions pour manipuler les chaînes de caractères.

🔹 Concaténation
<?php
$prenom = "Yassmine";
$nom = "Dalil";

// Concaténation avec l'opérateur .
$nom_complet = $prenom . " " . $nom;
echo $nom_complet;  // Affiche "Yassmine Dalil"

// Alternative avec les variables dans les guillemets doubles
echo "Bonjour, $prenom $nom!";  // Affiche "Bonjour, Yassmine Dalil!"
echo 'Bonjour, $prenom $nom!';  // Affiche "Bonjour, $prenom $nom!" (guillemets simples)
?>

🔹 Fonctions utiles pour les chaînes
<?php
$texte = "Bienvenue sur notre site web";

// Longueur d'une chaîne
echo strlen($texte);  // Affiche 28

// Mettre en majuscules/minuscules
echo strtoupper($texte);  // BIENVENUE SUR NOTRE SITE WEB
echo strtolower($texte);  // bienvenue sur notre site web

// Remplacer du texte
echo str_replace("site", "portail", $texte);  // Bienvenue sur notre portail web

// Extraire une sous-chaîne
echo substr($texte, 0, 9);  // Bienvenue

// Position d'un mot dans une chaîne
echo strpos($texte, "site");  // 17
?>

8. Inclusion de fichiers
PHP permet d'inclure d'autres fichiers pour organiser le code.

🔹 Inclure des fichiers
// fichier: fonctions.php
<?php
function saluer($nom) {
    return "Bonjour, $nom !";
}
?>

// fichier: index.php
<?php
include 'fonctions.php';  // ou require 'fonctions.php';
echo saluer("Yassmine");  // Affiche "Bonjour, Yassmine !"
?>

💡 Différences entre include et require :
- include : génère un warning si le fichier n'existe pas et continue l'exécution
- require : génère une erreur fatale si le fichier n'existe pas et arrête l'exécution
- include_once et require_once : s'assurent que le fichier n'est inclus qu'une seule fois

9. Formulaires et traitement des données
PHP est souvent utilisé pour traiter les données de formulaires HTML.

🔹 Formulaire HTML et traitement PHP
<!-- formulaire.html -->
<form action="traitement.php" method="post">
    <label for="nom">Nom :</label>
    <input type="text" id="nom" name="nom">
    
    <label for="email">Email :</label>
    <input type="email" id="email" name="email">
    
    <button type="submit">Envoyer</button>
</form>

<!-- traitement.php -->
<?php
// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les données du formulaire
    $nom = $_POST["nom"];
    $email = $_POST["email"];
    
    // Validation simple
    if (empty($nom) || empty($email)) {
        echo "Veuillez remplir tous les champs.";
    } else {
        // Traitement des données
        echo "Merci, $nom. Votre email ($email) a été enregistré.";
    }
}
?>

🔹 Variables superglobales
PHP offre plusieurs variables superglobales pour accéder aux données :
- $_POST : données envoyées par la méthode POST
- $_GET : données envoyées par la méthode GET (via l'URL)
- $_REQUEST : combine $_POST, $_GET et $_COOKIE
- $_SERVER : informations sur le serveur et l'environnement
- $_SESSION : variables de session (persistantes entre les pages)
- $_COOKIE : cookies HTTP

10. Connexion à une base de données
PHP est souvent utilisé avec des bases de données pour créer des applications dynamiques.

🔹 Connexion et requêtes avec PDO (PHP Data Objects)
<?php
try {
    // Connexion à la base de données
    $pdo = new PDO('mysql:host=localhost;dbname=mon_site', 'utilisateur', 'mot_de_passe');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Requête SELECT
    $requete = $pdo->query('SELECT * FROM utilisateurs');
    
    // Afficher les résultats
    while ($utilisateur = $requete->fetch(PDO::FETCH_ASSOC)) {
        echo "Nom : " . $utilisateur['nom'] . ", Email : " . $utilisateur['email'] . "<br>";
    }
    
    // Requête préparée (sécurisée contre les injections SQL)
    $stmt = $pdo->prepare('INSERT INTO utilisateurs (nom, email) VALUES (?, ?)');
    $stmt->execute(['Yassmine', 'yassmine@example.com']);
    
    echo "Nouvel utilisateur ajouté avec l'ID : " . $pdo->lastInsertId();
    
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>

11. Sessions et cookies
PHP permet de stocker des données entre les pages avec les sessions et cookies.

🔹 Sessions
<?php
// Démarrer ou reprendre une session
session_start();

// Stocker des données de session
$_SESSION['utilisateur'] = "Yassmine";
$_SESSION['est_connecte'] = true;

// Accéder aux données de session (sur une autre page)
echo "Bonjour, " . $_SESSION['utilisateur'];

// Supprimer une variable de session
unset($_SESSION['est_connecte']);

// Détruire complètement la session
session_destroy();
?>

🔹 Cookies
<?php
// Définir un cookie (nom, valeur, expiration en secondes depuis maintenant)
setcookie("utilisateur", "Yassmine", time() + 3600);  // expire dans 1 heure

// Accéder à un cookie
if (isset($_COOKIE["utilisateur"])) {
    echo "Bienvenue, " . $_COOKIE["utilisateur"];
}

// Supprimer un cookie (en définissant une date d'expiration dans le passé)
setcookie("utilisateur", "", time() - 3600);
?>

12. PHP et HTML : Exemple Complet
PHP est souvent intégré dans des pages HTML pour créer des sites dynamiques.

```php
<!DOCTYPE html>
<html>
<head>
    <title>Mon Site Dynamique</title>
    <meta charset="UTF-8">
</head>
<body>
    <header>
        <h1>Bienvenue sur Mon Site</h1>
        <nav>
            <ul>
                <li><a href="index.php">Accueil</a></li>
                <li><a href="apropos.php">À propos</a></li>
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <?php
        // Date et heure actuelles
        $date = date("d/m/Y H:i:s");
        echo "<p>Aujourd'hui, nous sommes le $date</p>";
        
        // Liste dynamique
        $articles = [
            ["titre" => "PHP pour les débutants", "auteur" => "Yassmine D."],
            ["titre" => "Bases de données MySQL", "auteur" => "Ahmed K."],
            ["titre" => "Développement web moderne", "auteur" => "Sara L."]
        ];
        
        echo "<h2>Nos derniers articles</h2>";
        echo "<ul>";
        foreach ($articles as $article) {
            echo "<li>" . $article["titre"] . " par " . $article["auteur"] . "</li>";
        }
        echo "</ul>";
        
        // Fonction conditionnelle
        function salutation() {
            $heure = date("H");
            if ($heure < 12) {
                return "Bonjour";
            } elseif ($heure < 18) {
                return "Bon après-midi";
            } else {
                return "Bonsoir";
            }
        }
        
        echo "<p>" . salutation() . " et bienvenue sur notre site !</p>";
        ?>
    </main>
    
    <footer>
        <p>&copy; <?php echo date("Y"); ?> - Mon Site Dynamique</p>
    </footer>
</body>
</html>
```

13. Résumé des Différences avec d'autres Langages
Caractéristique	PHP	JavaScript	Python
Exécution	Côté serveur	Côté client	Serveur/Bureau
Déclaration variable	$nom = "Ali";	let nom = "Ali";	nom = "Ali"
Affichage	echo "Texte";	console.log("Texte");	print("Texte")
Conditions	if...else	if...else	if...else
Fonctions	function nom()	function nom()	def nom()`,
  
  'SQL': `1. Introduction à SQL
SQL (Structured Query Language) est un langage standardisé utilisé pour communiquer avec les bases de données relationnelles. Il permet de créer, lire, mettre à jour et supprimer des données.

🔹 Caractéristiques principales :
- Langage déclaratif (on décrit ce qu'on veut, pas comment l'obtenir)
- Standard utilisé par presque tous les systèmes de gestion de bases de données (MySQL, PostgreSQL, SQLite, SQL Server, Oracle...)
- Composé de plusieurs sous-langages : DDL (Data Definition Language), DML (Data Manipulation Language), DCL (Data Control Language)

2. Création et Modification de Tables (DDL)
Le langage de définition des données (DDL) permet de créer et modifier la structure des bases de données.

🔹 Création d'une base de données
CREATE DATABASE ecole;

🔹 Utilisation d'une base de données
USE ecole;

🔹 Création d'une table
CREATE TABLE etudiants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    date_naissance DATE,
    email VARCHAR(100) UNIQUE,
    filiere VARCHAR(50),
    moyenne FLOAT DEFAULT 0.0
);

CREATE TABLE cours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    credit INT,
    professeur_id INT
);

🔹 Modification d'une table
-- Ajouter une colonne
ALTER TABLE etudiants ADD COLUMN telephone VARCHAR(20);

-- Modifier une colonne
ALTER TABLE etudiants MODIFY COLUMN email VARCHAR(150);

-- Supprimer une colonne
ALTER TABLE etudiants DROP COLUMN telephone;

🔹 Suppression
-- Supprimer une table
DROP TABLE cours;

-- Supprimer une base de données
DROP DATABASE ecole;

3. Manipulation des Données (DML)
Le langage de manipulation des données (DML) permet d'insérer, mettre à jour, supprimer et récupérer des données.

🔹 Insertion de données
-- Insertion simple
INSERT INTO etudiants (nom, prenom, date_naissance, email, filiere)
VALUES ('Dalil', 'Yassmine', '2005-05-15', 'yassmine@example.com', 'Informatique');

-- Insertion multiple
INSERT INTO etudiants (nom, prenom, filiere)
VALUES 
    ('Karimi', 'Ahmed', 'Mathématiques'),
    ('Alaoui', 'Sara', 'Physique'),
    ('Hassan', 'Karim', 'Informatique');

🔹 Mise à jour de données
-- Mise à jour simple
UPDATE etudiants
SET email = 'ahmed.karimi@example.com'
WHERE nom = 'Karimi' AND prenom = 'Ahmed';

-- Mise à jour multiple
UPDATE etudiants
SET moyenne = 15.5
WHERE filiere = 'Informatique';

🔹 Suppression de données
-- Suppression avec condition
DELETE FROM etudiants
WHERE nom = 'Hassan';

-- Suppression de toutes les données
DELETE FROM etudiants;
-- ou
TRUNCATE TABLE etudiants;

4. Requêtes de Sélection (SELECT)
Les requêtes SELECT sont utilisées pour récupérer des données d'une ou plusieurs tables.

🔹 Sélection de base
-- Sélectionner toutes les colonnes
SELECT * FROM etudiants;

-- Sélectionner des colonnes spécifiques
SELECT nom, prenom, filiere FROM etudiants;

🔹 Filtrage avec WHERE
-- Égalité
SELECT * FROM etudiants WHERE filiere = 'Informatique';

-- Comparaison
SELECT * FROM etudiants WHERE moyenne > 12;

-- Intervalle
SELECT * FROM etudiants WHERE moyenne BETWEEN 10 AND 15;

-- Liste de valeurs
SELECT * FROM etudiants WHERE filiere IN ('Informatique', 'Mathématiques');

-- Pattern matching
SELECT * FROM etudiants WHERE nom LIKE 'A%';  -- Noms commençant par A
SELECT * FROM etudiants WHERE email LIKE '%@gmail.com';  -- Emails Gmail

-- NULL
SELECT * FROM etudiants WHERE date_naissance IS NULL;

🔹 Tri avec ORDER BY
-- Tri croissant (ascendant)
SELECT * FROM etudiants ORDER BY nom ASC;

-- Tri décroissant (descendant)
SELECT * FROM etudiants ORDER BY moyenne DESC;

-- Tri multiple
SELECT * FROM etudiants ORDER BY filiere ASC, moyenne DESC;

🔹 Limitation avec LIMIT
-- Limiter le nombre de résultats
SELECT * FROM etudiants LIMIT 10;

-- Pagination (skip 10, take 5)
SELECT * FROM etudiants LIMIT 5 OFFSET 10;

5. Fonctions d'Agrégation
Les fonctions d'agrégation effectuent des calculs sur des ensembles de valeurs.

🔹 Fonctions courantes
-- Compter
SELECT COUNT(*) FROM etudiants;
SELECT COUNT(DISTINCT filiere) FROM etudiants;

-- Somme
SELECT SUM(moyenne) FROM etudiants;

-- Moyenne
SELECT AVG(moyenne) FROM etudiants WHERE filiere = 'Informatique';

-- Minimum et Maximum
SELECT MIN(moyenne) AS min_moyenne, MAX(moyenne) AS max_moyenne FROM etudiants;

🔹 Regroupement avec GROUP BY
-- Compter le nombre d'étudiants par filière
SELECT filiere, COUNT(*) AS nombre_etudiants
FROM etudiants
GROUP BY filiere;

-- Moyenne par filière
SELECT filiere, AVG(moyenne) AS moyenne_generale
FROM etudiants
GROUP BY filiere;

🔹 Filtrage de groupes avec HAVING
-- Filières ayant plus de 5 étudiants
SELECT filiere, COUNT(*) AS nombre_etudiants
FROM etudiants
GROUP BY filiere
HAVING COUNT(*) > 5;

-- Filières avec une moyenne générale > 12
SELECT filiere, AVG(moyenne) AS moyenne_generale
FROM etudiants
GROUP BY filiere
HAVING AVG(moyenne) > 12;

6. Jointures entre Tables
Les jointures permettent de combiner des données provenant de plusieurs tables.

🔹 Structure des tables
CREATE TABLE professeurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    specialite VARCHAR(50)
);

ALTER TABLE cours
ADD CONSTRAINT fk_professeur
FOREIGN KEY (professeur_id) REFERENCES professeurs(id);

CREATE TABLE inscriptions (
    etudiant_id INT,
    cours_id INT,
    date_inscription DATE,
    note FLOAT,
    PRIMARY KEY (etudiant_id, cours_id),
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id),
    FOREIGN KEY (cours_id) REFERENCES cours(id)
);

🔹 INNER JOIN
-- Joindre étudiants et inscriptions
SELECT e.nom, e.prenom, c.titre, i.note
FROM etudiants e
INNER JOIN inscriptions i ON e.id = i.etudiant_id
INNER JOIN cours c ON i.cours_id = c.id;

🔹 LEFT JOIN
-- Tous les étudiants, même ceux sans inscription
SELECT e.nom, e.prenom, c.titre
FROM etudiants e
LEFT JOIN inscriptions i ON e.id = i.etudiant_id
LEFT JOIN cours c ON i.cours_id = c.id;

🔹 RIGHT JOIN
-- Tous les cours, même ceux sans étudiant
SELECT c.titre, e.nom, e.prenom
FROM inscriptions i
RIGHT JOIN cours c ON i.cours_id = c.id
LEFT JOIN etudiants e ON i.etudiant_id = e.id;

🔹 FULL JOIN (pas disponible dans MySQL, simulation)
-- Tous les étudiants et tous les cours
SELECT e.nom, e.prenom, c.titre
FROM etudiants e
LEFT JOIN inscriptions i ON e.id = i.etudiant_id
LEFT JOIN cours c ON i.cours_id = c.id
UNION
SELECT e.nom, e.prenom, c.titre
FROM etudiants e
RIGHT JOIN inscriptions i ON e.id = i.etudiant_id
RIGHT JOIN cours c ON i.cours_id = c.id;

7. Sous-requêtes
Les sous-requêtes sont des requêtes imbriquées dans d'autres requêtes.

🔹 Sous-requête dans WHERE
-- Étudiants inscrits à un cours spécifique
SELECT nom, prenom
FROM etudiants
WHERE id IN (
    SELECT etudiant_id
    FROM inscriptions
    WHERE cours_id = 3
);

-- Étudiants avec une moyenne supérieure à la moyenne générale
SELECT nom, prenom, moyenne
FROM etudiants
WHERE moyenne > (
    SELECT AVG(moyenne)
    FROM etudiants
);

🔹 Sous-requête dans FROM
-- Calcul intermédiaire
SELECT filiere, AVG(note_moyenne) AS moyenne_filiere
FROM (
    SELECT e.filiere, e.id, AVG(i.note) AS note_moyenne
    FROM etudiants e
    JOIN inscriptions i ON e.id = i.etudiant_id
    GROUP BY e.id, e.filiere
) AS moyennes_etudiants
GROUP BY filiere;

🔹 Sous-requête dans SELECT
-- Afficher la moyenne de classe avec chaque étudiant
SELECT 
    nom, 
    prenom, 
    moyenne, 
    (SELECT AVG(moyenne) FROM etudiants) AS moyenne_classe
FROM etudiants;

8. Opérations sur les Ensembles
SQL permet d'effectuer des opérations entre ensembles de résultats.

🔹 UNION (combinaison sans doublons)
-- Combiner les noms des étudiants et des professeurs
SELECT nom, prenom, 'Étudiant' AS role FROM etudiants
UNION
SELECT nom, prenom, 'Professeur' AS role FROM professeurs
ORDER BY nom, prenom;

🔹 UNION ALL (combinaison avec doublons)
-- Similaire à UNION mais garde les doublons
SELECT filiere FROM etudiants
UNION ALL
SELECT specialite FROM professeurs;

🔹 INTERSECT (éléments communs)
-- Noms présents à la fois chez les étudiants et les professeurs
-- (simulé car non supporté directement par MySQL)
SELECT nom FROM etudiants
WHERE nom IN (SELECT nom FROM professeurs);

🔹 EXCEPT (différence d'ensembles)
-- Noms d'étudiants qui ne sont pas des noms de professeurs
-- (simulé car non supporté directement par MySQL)
SELECT nom FROM etudiants
WHERE nom NOT IN (SELECT nom FROM professeurs);

9. Transactions
Les transactions permettent de grouper plusieurs opérations en une seule unité de travail.

🔹 Structure d'une transaction
-- Démarrer une transaction
START TRANSACTION;

-- Opérations
INSERT INTO etudiants (nom, prenom, filiere) VALUES ('Nouvel', 'Etudiant', 'Biologie');
UPDATE cours SET credit = 5 WHERE id = 2;

-- Valider les modifications
COMMIT;

-- OU annuler les modifications
ROLLBACK;

🔹 Transaction avec point de sauvegarde
START TRANSACTION;

INSERT INTO etudiants (nom, prenom, filiere) VALUES ('Etudiant1', 'Test1', 'Chimie');
SAVEPOINT point1;

INSERT INTO etudiants (nom, prenom, filiere) VALUES ('Etudiant2', 'Test2', 'Physique');
SAVEPOINT point2;

-- Si problème, on peut revenir à un point de sauvegarde
ROLLBACK TO point1;

-- Puis continuer ou valider
COMMIT;

10. Vues
Les vues sont des requêtes enregistrées qui peuvent être utilisées comme des tables virtuelles.

🔹 Création de vue
-- Vue simple
CREATE VIEW etudiants_info AS
SELECT id, nom, prenom, filiere, moyenne
FROM etudiants
WHERE moyenne > 10;

-- Vue plus complexe
CREATE VIEW resultats_cours AS
SELECT 
    e.nom, 
    e.prenom, 
    c.titre AS cours, 
    i.note,
    p.nom AS professeur
FROM etudiants e
JOIN inscriptions i ON e.id = i.etudiant_id
JOIN cours c ON i.cours_id = c.id
JOIN professeurs p ON c.professeur_id = p.id;

🔹 Utilisation de vue
-- Interroger une vue comme une table normale
SELECT * FROM etudiants_info WHERE filiere = 'Informatique';

-- Jointure avec une vue
SELECT ri.nom, ri.prenom, ri.cours, ri.note
FROM resultats_cours ri
WHERE ri.note > 15;

🔹 Modification de vue
-- Modifier une vue existante
ALTER VIEW etudiants_info AS
SELECT id, nom, prenom, filiere, moyenne, email
FROM etudiants
WHERE moyenne > 8;

-- Supprimer une vue
DROP VIEW resultats_cours;

11. Index
Les index améliorent les performances des requêtes en permettant un accès plus rapide aux données.

🔹 Création d'index
-- Index simple
CREATE INDEX idx_filiere ON etudiants(filiere);

-- Index composé (sur plusieurs colonnes)
CREATE INDEX idx_nom_prenom ON etudiants(nom, prenom);

-- Index unique
CREATE UNIQUE INDEX idx_email ON etudiants(email);

🔹 Suppression d'index
DROP INDEX idx_filiere ON etudiants;

12. Contrôle d'Accès (DCL)
Le langage de contrôle des données (DCL) gère les permissions sur les objets de la base.

🔹 Gestion des utilisateurs
-- Créer un utilisateur
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password123';

-- Supprimer un utilisateur
DROP USER 'app_user'@'localhost';

🔹 Attribution de privilèges
-- Donner des droits spécifiques
GRANT SELECT, INSERT ON ecole.etudiants TO 'app_user'@'localhost';

-- Donner tous les droits sur une base
GRANT ALL PRIVILEGES ON ecole.* TO 'admin'@'localhost';

-- Révoquer des droits
REVOKE INSERT ON ecole.etudiants FROM 'app_user'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

13. Exemples Avancés
Voici quelques exemples plus complexes pour illustrer la puissance de SQL.

🔹 Requête hiérarchique (manager-employé)
-- Table auto-référencée
CREATE TABLE employes (
    id INT PRIMARY KEY,
    nom VARCHAR(50),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employes(id)
);

-- Requête récursive avec CTE (Common Table Expression)
WITH RECURSIVE hierarchie AS (
    -- Cas de base : les managers de haut niveau (sans manager)
    SELECT id, nom, manager_id, 0 AS niveau
    FROM employes
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Cas récursif : employés avec leur manager
    SELECT e.id, e.nom, e.manager_id, h.niveau + 1
    FROM employes e
    JOIN hierarchie h ON e.manager_id = h.id
)
SELECT id, nom, niveau, manager_id
FROM hierarchie
ORDER BY niveau, nom;

🔹 Fenêtrage (Window Functions)
-- Classement des étudiants par moyenne dans chaque filière
SELECT 
    nom, 
    prenom, 
    filiere, 
    moyenne,
    RANK() OVER (PARTITION BY filiere ORDER BY moyenne DESC) AS rang_filiere,
    DENSE_RANK() OVER (ORDER BY moyenne DESC) AS rang_general
FROM etudiants;

-- Calcul de moyennes mobiles
SELECT 
    date, 
    valeur,
    AVG(valeur) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j
FROM mesures;

🔹 Pivot (transformer lignes en colonnes)
-- Compter les étudiants par filière et par année
SELECT 
    YEAR(date_naissance) AS annee,
    SUM(CASE WHEN filiere = 'Informatique' THEN 1 ELSE 0 END) AS info,
    SUM(CASE WHEN filiere = 'Mathématiques' THEN 1 ELSE 0 END) AS maths,
    SUM(CASE WHEN filiere = 'Physique' THEN 1 ELSE 0 END) AS physique,
    COUNT(*) AS total
FROM etudiants
GROUP BY YEAR(date_naissance)
ORDER BY annee;

14. Différences entre les SGBD
Bien que SQL soit standardisé, il existe des variations entre les systèmes de gestion de bases de données.

🔹 Principales différences
Type	MySQL	PostgreSQL	SQLite	SQL Server
Auto-increment	AUTO_INCREMENT	SERIAL	AUTOINCREMENT	IDENTITY
Limit	LIMIT 10	LIMIT 10	LIMIT 10	TOP 10
Rounding	ROUND()	ROUND()	ROUND()	ROUND()
Date Function	NOW()	NOW()	datetime('now')	GETDATE()
GUID/UUID	UUID()	gen_random_uuid()	-	NEWID()
Concatenate	CONCAT(a, b)	a || b	a || b	a + b

15. Bonnes Pratiques
Quelques conseils pour écrire du SQL efficace et maintenable.

🔹 Performance
- Utilisez des index pour les colonnes fréquemment interrogées
- Évitez SELECT * et sélectionnez uniquement les colonnes nécessaires
- Limitez les résultats avec LIMIT quand c'est possible
- Utilisez EXPLAIN pour analyser les performances des requêtes

🔹 Sécurité
- Utilisez des requêtes paramétrées pour éviter les injections SQL
- N'accordez que les privilèges minimaux nécessaires
- Validez toutes les entrées utilisateur

🔹 Lisibilité
- Utilisez une indentation cohérente
- Écrivez les mots-clés SQL en majuscules
- Donnez des noms explicites aux colonnes et tables
- Commentez les requêtes complexes`
};

const seedSummaries = async () => {
  console.log('Starting to seed all language summaries...');
  
  try {
    for (const language of programmingLanguages) {
      console.log(`Processing language: ${language.name}`);
      
      // Check if language exists
      const { data: existingLang, error: langError } = await supabase
        .from('programming_languages')
        .select('id')
        .eq('name', language.name)
        .maybeSingle();
      
      let languageId;
      
      if (langError && langError.code !== 'PGRST116') {
        console.error(`Error checking for language ${language.name}:`, langError);
        continue;
      }
      
      // If language doesn't exist, create it
      if (!existingLang) {
        console.log(`Creating language: ${language.name}`);
        const { data: newLang, error: createError } = await supabase
          .from('programming_languages')
          .insert({
            name: language.name,
            description: language.description,
            image_url: language.image_url,
            icon: language.icon || 'code',
            color: language.color || '#000000'
          })
          .select('id')
          .single();
          
        if (createError) {
          console.error(`Error creating language ${language.name}:`, createError);
          continue;
        }
        
        languageId = newLang.id;
        console.log(`Created language ${language.name} with ID: ${languageId}`);
      } else {
        languageId = existingLang.id;
        console.log(`Language ${language.name} already exists with ID: ${languageId}`);
      }
      
      // Check if summary exists
      const { data: existingSummary, error: summaryError } = await supabase
        .from('language_summaries')
        .select('id')
        .eq('language_id', languageId)
        .maybeSingle();
        
      if (summaryError && summaryError.code !== 'PGRST116') {
        console.error(`Error checking for summary of ${language.name}:`, summaryError);
        continue;
      }
      
      // If summary doesn't exist, create it
      if (!existingSummary) {
        console.log(`Creating summary for ${language.name}`);
        const { error: createSummaryError } = await supabase
          .from('language_summaries')
          .insert({
            language_id: languageId,
            title: `${language.name} Language Summary`,
            content: summaryContents[language.name] || `Summary for ${language.name} will be added soon.`
          });
          
        if (createSummaryError) {
          console.error(`Error creating summary for ${language.name}:`, createSummaryError);
          continue;
        }
        
        console.log(`Created summary for ${language.name}`);
        
        // Create a badge for the language
        const { error: badgeError } = await supabase
          .from('badges')
          .insert({
            name: `${language.name} Mastery`,
            description: `Completed ${language.name} summary and quiz`,
            icon: 'award',
            points: 100
          });
          
        if (badgeError && !badgeError.message?.includes('duplicate')) {
          console.error(`Error creating ${language.name} badge:`, badgeError);
        } else {
          console.log(`${language.name} badge created successfully`);
        }
      } else {
        console.log(`Summary for ${language.name} already exists`);
      }
    }
    
    console.log('All language summaries seeded successfully!');
  } catch (error) {
    console.error('Error seeding language summaries:', error);
  }
};

seedSummaries();
