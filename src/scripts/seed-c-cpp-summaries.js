
// This script adds C and C++ language summaries to the database
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your project URL and anon key)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// C Language summary content
const cSummaryContent = `1. Le Langage C
Introduction à C
C est un langage de programmation bas niveau, très rapide et utilisé pour les systèmes d'exploitation, les logiciels embarqués et les applications nécessitant des performances optimales. Il a influencé de nombreux langages comme C++, Java et Python.

🔹 1. Déclaration des Variables en C
C est un langage fortement typé, ce qui signifie que chaque variable doit avoir un type précis.

Les principaux types de variables en C :
Type	Description	Exemple
int	Nombre entier	int age = 19;
float	Nombre à virgule (simple précision)	float prix = 10.5;
double	Nombre à virgule (double précision)	double distance = 200.99;
char	Un seul caractère	char lettre = 'A';
char[]	Chaîne de caractères	char nom[] = "Yassmine";

Exemple de déclaration de variables en C
c
#include <stdio.h>

int main() {
    int age = 19;
    float salaire = 2500.50;
    char initiale = 'Y';

    printf("Age : %d\\n", age);
    printf("Salaire : %.2f\\n", salaire);
    printf("Initiale : %c\\n", initiale);

    return 0;
}

💡 Explication :

#include <stdio.h> : Inclut la bibliothèque standard pour utiliser printf.

int main() : Fonction principale du programme.

printf() : Fonction pour afficher du texte et des variables.

🔹 2. Conditions en C (if, else if, else)
Condition if simple
c
#include <stdio.h>

int main() {
    int age = 19;

    if (age >= 18) {
        printf("Vous êtes majeur.\\n");
    }

    return 0;
}

Condition if...else
c
#include <stdio.h>

int main() {
    int age = 16;

    if (age >= 18) {
        printf("Vous êtes majeur.\\n");
    } else {
        printf("Vous êtes mineur.\\n");
    }

    return 0;
}

Condition if...else if...else
c
#include <stdio.h>

int main() {
    int note = 15;

    if (note >= 18) {
        printf("Excellent !\\n");
    } else if (note >= 14) {
        printf("Bien !\\n");
    } else if (note >= 10) {
        printf("Passable.\\n");
    } else {
        printf("Échec.\\n");
    }

    return 0;
}

💡 Explication :

Comme en JavaScript, on utilise if, else if, et else pour tester plusieurs cas.

🔹 3. Fonctions en C
Une fonction est un bloc de code qui exécute une tâche spécifique.

Fonction sans paramètre et sans retour
c
#include <stdio.h>

void direBonjour() {
    printf("Bonjour, bienvenue !\\n");
}

int main() {
    direBonjour();
    return 0;
}

Fonction avec paramètres
c
#include <stdio.h>

void saluer(char nom[]) {
    printf("Bonjour, %s !\\n", nom);
}

int main() {
    saluer("Yassmine");
    return 0;
}

Fonction avec retour de valeur
c
#include <stdio.h>

int additionner(int a, int b) {
    return a + b;
}

int main() {
    int resultat = additionner(5, 7);
    printf("Résultat : %d\\n", resultat);
    return 0;
}

💡 Explication :

Une fonction peut prendre des paramètres et retourner une valeur.

return permet de renvoyer un résultat.`;

// C++ Language summary content
const cppSummaryContent = `2. Le Langage C++
Introduction à C++
C++ est une extension de C, avec en plus la programmation orientée objet (POO). Il est utilisé pour les jeux vidéo, les applications de bureau, les logiciels système, etc.

💡 Différence principale : C est un langage procédural, tandis que C++ ajoute la POO.

🔹 1. Déclaration des Variables en C++
Les variables sont déclarées de la même manière qu'en C, mais on peut aussi utiliser std::string pour les chaînes de caractères.

cpp
#include <iostream>
using namespace std;

int main() {
    int age = 19;
    double prix = 10.99;
    char initiale = 'Y';
    string nom = "Yassmine"; // Différence avec C

    cout << "Nom : " << nom << endl;
    cout << "Age : " << age << endl;

    return 0;
}

💡 Différence avec C :

En C++, on utilise cout et cin au lieu de printf et scanf.

🔹 2. Conditions en C++ (if, else if, else)
Les conditions sont identiques à celles de C.

cpp
#include <iostream>
using namespace std;

int main() {
    int note = 15;

    if (note >= 18) {
        cout << "Excellent !" << endl;
    } else if (note >= 14) {
        cout << "Bien !" << endl;
    } else if (note >= 10) {
        cout << "Passable." << endl;
    } else {
        cout << "Échec." << endl;
    }

    return 0;
}

🔹 3. Fonctions en C++
Les fonctions en C++ sont similaires à celles en C, mais avec cout au lieu de printf.

Fonction sans paramètre
cpp
#include <iostream>
using namespace std;

void direBonjour() {
    cout << "Bonjour, bienvenue !" << endl;
}

int main() {
    direBonjour();
    return 0;
}

Fonction avec paramètres
cpp
#include <iostream>
using namespace std;

void saluer(string nom) {
    cout << "Bonjour, " << nom << " !" << endl;
}

int main() {
    saluer("Yassmine");
    return 0;
}

Fonction avec retour de valeur
cpp
#include <iostream>
using namespace std;

int additionner(int a, int b) {
    return a + b;
}

int main() {
    int resultat = additionner(5, 7);
    cout << "Résultat : " << resultat << endl;
    return 0;
}

Différences entre C et C++
Caractéristique	C	C++
Paradigme	Procédural	Procédural + Orienté Objet
Chaînes de caractères	char[]	std::string
Entrée/Sortie	printf()	cout et cin
POO (Classes, Objets)	❌ Non	✅ Oui

Conclusion
✔️ C est un langage bas niveau, rapide et utilisé pour les systèmes embarqués.
✔️ C++ ajoute la POO, et est utilisé pour les jeux, les applications et la finance.
✔️ Les conditions et les fonctions sont similaires, mais C++ offre plus de flexibilité.

🚀 C++ est plus puissant que C grâce à la programmation orientée objet.`;

// Add C and C++ language summaries
async function addLanguageSummaries() {
  try {
    console.log('Adding C language summary...');
    const { data: cLanguage, error: cLanguageError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'C')
      .single();
      
    if (cLanguageError) {
      console.error('Error fetching C language:', cLanguageError);
      return;
    }
    
    const { error: cSummaryError } = await supabase
      .from('language_summaries')
      .insert({
        language_id: cLanguage.id,
        title: 'Fondamentaux du langage C',
        content: cSummaryContent
      });
      
    if (cSummaryError) {
      console.error('Error adding C language summary:', cSummaryError);
    } else {
      console.log('C language summary added successfully!');
    }
    
    // Ensure C badge exists
    const { error: cBadgeError } = await supabase
      .from('badges')
      .insert({
        name: 'C Mastery',
        description: 'Completed C language summary and quiz',
        icon: 'award',
        points: 100
      })
      .onConflict(['name'])
      .ignore();
      
    if (cBadgeError) {
      console.error('Error adding C badge:', cBadgeError);
    }
    
    console.log('Adding C++ language summary...');
    const { data: cppLanguage, error: cppLanguageError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'C++')
      .single();
      
    if (cppLanguageError) {
      console.error('Error fetching C++ language:', cppLanguageError);
      return;
    }
    
    const { error: cppSummaryError } = await supabase
      .from('language_summaries')
      .insert({
        language_id: cppLanguage.id,
        title: 'Fondamentaux du langage C++',
        content: cppSummaryContent
      });
      
    if (cppSummaryError) {
      console.error('Error adding C++ language summary:', cppSummaryError);
    } else {
      console.log('C++ language summary added successfully!');
    }
    
    // Ensure C++ badge exists
    const { error: cppBadgeError } = await supabase
      .from('badges')
      .insert({
        name: 'C++ Mastery',
        description: 'Completed C++ language summary and quiz',
        icon: 'award',
        points: 100
      })
      .onConflict(['name'])
      .ignore();
      
    if (cppBadgeError) {
      console.error('Error adding C++ badge:', cppBadgeError);
    }
    
    console.log('Language summaries and badges added successfully!');
  } catch (error) {
    console.error('Error in addLanguageSummaries:', error);
  }
}

// Run the function
addLanguageSummaries();
