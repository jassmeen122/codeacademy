
// Main script to seed the database with all needed data
import { supabase } from '../integrations/supabase/client';
import './seed-java-summary.js';

const runSeeder = async () => {
  console.log('Starting database seeding...');
  
  try {
    // Check if Java language exists, if not create it
    const { data: javaExists, error: checkError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'Java')
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for Java language:', checkError);
    }
    
    if (!javaExists) {
      // Insert Java language
      const { error: insertError } = await supabase
        .from('programming_languages')
        .insert({
          name: 'Java',
          description: 'Java est un langage de programmation orienté objet très utilisé pour le développement d\'applications d\'entreprise et Android.',
          icon: 'coffee',
          image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/1200px-Java_programming_language_logo.svg.png',
          color: '#f89820'
        });
        
      if (insertError) {
        console.error('Error inserting Java language:', insertError);
      } else {
        console.log('Java language inserted successfully');
      }
    } else {
      console.log('Java language already exists in the database');
    }
    
    // Check if JavaScript language exists, if not create it
    const { data: jsExists, error: jsCheckError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'JavaScript')
      .maybeSingle();
      
    if (jsCheckError) {
      console.error('Error checking for JavaScript language:', jsCheckError);
    }
    
    if (!jsExists) {
      // Insert JavaScript language
      const { error: jsInsertError } = await supabase
        .from('programming_languages')
        .insert({
          name: 'JavaScript',
          description: 'JavaScript est un langage de programmation de scripts principalement utilisé dans les pages web interactives et côté serveur.',
          icon: 'code',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png',
          color: '#f7df1e'
        });
        
      if (jsInsertError) {
        console.error('Error inserting JavaScript language:', jsInsertError);
      } else {
        console.log('JavaScript language inserted successfully');
      }
      
      // After creating JavaScript language, insert its summary
      await insertJavaScriptSummary();
    } else {
      console.log('JavaScript language already exists in the database');
      
      // Check if JavaScript summary exists
      const { data: jsSummary, error: jsSummaryError } = await supabase
        .from('language_summaries')
        .select('id')
        .eq('language_id', jsExists.id)
        .maybeSingle();
        
      if (jsSummaryError) {
        console.error('Error checking for JavaScript summary:', jsSummaryError);
      }
      
      if (!jsSummary) {
        await insertJavaScriptSummary(jsExists.id);
      }
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};

// Insert JavaScript summary
const insertJavaScriptSummary = async (languageId = null) => {
  try {
    // If no language ID provided, fetch it
    if (!languageId) {
      const { data, error } = await supabase
        .from('programming_languages')
        .select('id')
        .eq('name', 'JavaScript')
        .single();
        
      if (error) throw error;
      languageId = data.id;
    }
    
    // Insert JavaScript summary
    const { error: summaryError } = await supabase
      .from('language_summaries')
      .insert({
        language_id: languageId,
        title: 'JavaScript Language Summary',
        content: `1. Déclaration des variables en JavaScript
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
Exécution	Nécessite un compilateur (javac)	Directement dans le navigateur`
      });
      
    if (summaryError) {
      console.error('Error inserting JavaScript summary:', summaryError);
    } else {
      console.log('JavaScript summary inserted successfully');
      
      // Create a badge for JavaScript mastery
      const { error: badgeError } = await supabase
        .from('badges')
        .insert({
          name: 'JavaScript Mastery',
          description: 'Completed JavaScript summary and quiz',
          icon: 'award',
          points: 100
        })
        .select()
        .single();
        
      if (badgeError && !badgeError.message.includes('duplicate')) {
        console.error('Error creating JavaScript badge:', badgeError);
      } else {
        console.log('JavaScript badge created successfully');
      }
    }
  } catch (error) {
    console.error('Error inserting JavaScript summary:', error);
  }
};

runSeeder();
