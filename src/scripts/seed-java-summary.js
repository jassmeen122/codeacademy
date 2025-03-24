
import { supabase } from '../integrations/supabase/client';

const insertJavaSummary = async () => {
  try {
    // First, get the Java language ID from the programming_languages table
    const { data: languageData, error: languageError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'Java')
      .single();

    if (languageError) {
      console.error('Error fetching Java language ID:', languageError);
      return;
    }

    if (!languageData) {
      console.error('Java language not found in the database');
      return;
    }

    const javaLanguageId = languageData.id;

    // Check if a summary already exists for Java
    const { data: existingSummary, error: checkError } = await supabase
      .from('language_summaries')
      .select('id')
      .eq('language_id', javaLanguageId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing Java summary:', checkError);
      return;
    }

    if (existingSummary) {
      console.log('Java summary already exists, updating it...');
      
      // Update the existing summary
      const { error: updateError } = await supabase
        .from('language_summaries')
        .update({
          title: 'Java Language Summary',
          content: javaContent
        })
        .eq('id', existingSummary.id);

      if (updateError) {
        console.error('Error updating Java summary:', updateError);
        return;
      }
      
      console.log('Java summary updated successfully');
    } else {
      console.log('Creating new Java summary...');
      
      // Insert the new summary
      const { error: insertError } = await supabase
        .from('language_summaries')
        .insert({
          language_id: javaLanguageId,
          title: 'Java Language Summary',
          content: javaContent
        });

      if (insertError) {
        console.error('Error inserting Java summary:', insertError);
        return;
      }
      
      console.log('Java summary inserted successfully');
    }

    // Create Java Mastery badge if it doesn't exist
    const { data: existingBadge, error: badgeCheckError } = await supabase
      .from('badges')
      .select('id')
      .eq('name', 'Java Mastery')
      .maybeSingle();

    if (badgeCheckError) {
      console.error('Error checking for existing Java badge:', badgeCheckError);
      return;
    }

    if (!existingBadge) {
      console.log('Creating Java Mastery badge...');
      
      const { error: badgeError } = await supabase
        .from('badges')
        .insert({
          name: 'Java Mastery',
          description: 'Completed Java summary and quiz',
          icon: 'award',
          points: 100
        });

      if (badgeError) {
        console.error('Error creating Java badge:', badgeError);
        return;
      }
      
      console.log('Java Mastery badge created successfully');
    } else {
      console.log('Java Mastery badge already exists');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Java content
const javaContent = `1. Déclaration des variables en Java
Qu'est-ce qu'une variable ?
Comme en Python, une variable en Java est un espace mémoire où l'on stocke une donnée.

Cependant, en Java, contrairement à Python, il faut toujours préciser le type de la variable.

Syntaxe pour déclarer une variable en Java
java
int age = 19;  // Une variable entière (int)
double prix = 99.99;  // Un nombre à virgule (double)
boolean estActif = true;  // Une valeur booléenne (true/false)
String nom = "Yassmine";  // Une chaîne de caractères (String)

📌 Différence avec Python :

En Python, on écrit juste nom = "Yassmine", et Python devine que c'est une chaîne de caractères.

En Java, on doit obligatoirement dire que c'est un String.

Les types de données en Java
Voici les principaux types que tu dois connaître :

Type	Description	Exemple
int	Nombre entier	int age = 25;
double	Nombre à virgule	double prix = 9.99;
boolean	Vrai ou Faux	boolean estVrai = true;
char	Un seul caractère	char lettre = 'A';
String	Texte	String nom = "Yassmine";

2. Les conditions en Java
Les conditions permettent d'exécuter du code seulement si une certaine situation est vraie.

La condition if...else en Java
Prenons un exemple simple :

java
int age = 19;

if (age >= 18) {
    System.out.println("Vous êtes majeur, vous pouvez entrer.");
} else {
    System.out.println("Vous êtes mineur, entrée interdite.");
}

🔹 Explication :

if (condition) → Vérifie si la condition est vraie.

else → Exécute ce code si la condition est fausse.

System.out.println() → Affiche du texte à l'écran.

📌 Différence avec Python :

En Python, on utilise print() au lieu de System.out.println().

Java utilise des {} pour entourer les blocs de code, alors que Python utilise l'indentation.

La condition if...else if...else
Imaginons qu'on veut classer une note en fonction d'une grille :

java
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

🔹 Ce qu'il faut retenir :

else if permet d'ajouter d'autres conditions.

Le programme s'arrête dès qu'une condition est vraie.

Les conditions multiples avec && et ||
Comme en Python :

&& (ET logique) → Les deux conditions doivent être vraies.

|| (OU logique) → Au moins une des conditions doit être vraie.

Exemple avec && (ET logique)
java
int age = 20;
int argent = 50;

if (age >= 18 && argent >= 100) { 
    System.out.println("Vous pouvez entrer dans la boîte de nuit.");
} else {
    System.out.println("Vous ne pouvez pas entrer.");
}

💡 Explication :
✔️ La personne doit avoir plus de 18 ans ET au moins 100€.
❌ Si l'une des conditions est fausse, elle ne peut pas entrer.

Exemple avec || (OU logique)
java
boolean carteMembre = false;
int argent = 150;

if (carteMembre || argent >= 100) { 
    System.out.println("Vous avez accès à la salle VIP !");
} else {
    System.out.println("Accès refusé.");
}

💡 Explication :
✔️ Si la personne a une carte membre OU si elle a 100€ ou plus, elle peut entrer.

3. Les fonctions en Java
Une fonction (appelée "méthode" en Java) est un bloc de code qui effectue une action précise.

Créer une fonction simple
En Java, une fonction est définie avec :

Un type de retour (void, int, String, etc.).

Un nom de fonction.

Des parenthèses () avec ou sans paramètres.

Un corps de fonction {} qui contient le code à exécuter.

Exemple d'une fonction sans paramètres
java
public static void direBonjour() {
    System.out.println("Bonjour, bienvenue en Java !");
}

// Appel de la fonction
direBonjour();

🔹 Explication :

public static void → Mot-clé utilisé pour définir une fonction en Java.

direBonjour() → Nom de la fonction.

void signifie que la fonction ne retourne rien.

Fonctions avec paramètres
Une fonction peut prendre des informations en entrée (comme en Python).

java
public static void saluer(String nom) {
    System.out.println("Bonjour, " + nom + " !");
}

// Appel de la fonction
saluer("Yassmine");
saluer("Ahmed");

💡 Explication :

La fonction saluer() prend un paramètre nom de type String.

Elle affiche "Bonjour, Yassmine !" si on appelle saluer("Yassmine").

Fonctions qui retournent une valeur
Une fonction peut renvoyer un résultat grâce au mot-clé return.

java
public static int additionner(int a, int b) {
    return a + b;  // Retourne la somme
}

public static void main(String[] args) {
    int somme = additionner(5, 7);
    System.out.println(somme);  // Affiche 12
}

💡 Explication :

additionner(int a, int b) prend deux nombres et retourne leur somme.

On stocke le résultat dans somme et on l'affiche.

Fonctions avec paramètres par défaut ?
💡 En Java, il n'y a pas de paramètres par défaut comme en Python.
On doit créer plusieurs versions d'une fonction (surcharge de méthode) :

java
public static void presentation(String nom) {
    System.out.println("Je m'appelle " + nom + " et j'ai 18 ans.");
}

public static void presentation(String nom, int age) {
    System.out.println("Je m'appelle " + nom + " et j'ai " + age + " ans.");
}

// Appel des fonctions
presentation("Yassmine");  // Prend 18 ans par défaut
presentation("Ahmed", 20);

Ici, la première fonction suppose 18 ans par défaut, et la deuxième permet de préciser l'âge.`;

// Execute the function
insertJavaSummary();
