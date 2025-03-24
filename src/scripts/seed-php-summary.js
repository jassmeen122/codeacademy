// This script adds PHP language summary to the database
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the correct project URL and anon key
const supabaseUrl = 'https://tgjtkmduelappimtorwe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnanRrbWR1ZWxhcHBpbXRvcndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTQ1NTAsImV4cCI6MjA1NTk3MDU1MH0.4MT-8B_L86nFmGsrnDN612BIdL6gM1mrgenaFnbXHd0';
const supabase = createClient(supabaseUrl, supabaseKey);

// PHP Language summary content
const phpSummaryContent = `📌 Introduction à PHP
PHP (Hypertext Preprocessor) est un langage de programmation côté serveur utilisé principalement pour le développement web. Il permet de générer des pages dynamiques, se connecter à une base de données, et gérer les formulaires.

💡 Points forts de PHP :
✔️ Facile à apprendre et à utiliser.
✔️ Intégré avec HTML.
✔️ Compatible avec MySQL, PostgreSQL, SQLite, etc.
✔️ Fonctionne sur tous les serveurs web (Apache, Nginx…).

1. Déclaration des Variables en PHP
En PHP, les variables commencent toujours par $, et il n'est pas nécessaire de préciser le type de la variable (PHP est un langage faiblement typé).

🔹 Syntaxe des Variables
php
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

2. Conditions en PHP (if, else if, else)
PHP utilise les mêmes conditions que la plupart des langages de programmation (if, else if, else).

🔹 Condition if simple
php
<?php
$age = 20;

if ($age >= 18) {
    echo "Vous êtes majeur.";
}
?>
💡 Explication :
Si $age est supérieur ou égal à 18, on affiche "Vous êtes majeur.".

🔹 Condition if...else
php
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
php
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

3. Fonctions en PHP
Une fonction est un bloc de code qui exécute une tâche spécifique.

🔹 Déclaration d'une fonction sans paramètre
php
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
php
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
php
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

4. PHP et HTML : Exemple Complet
PHP est souvent intégré dans des pages HTML.

php
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
💡 Explication :

PHP est intégré entre <?php ... ?>.

L'instruction echo "<p>Bonjour, $nom !</p>"; affiche du texte dans une balise HTML.

Résumé des Différences avec d'autres Langages
Caractéristique	PHP	JavaScript	Python
Exécution	Côté serveur	Côté client	Serveur/Bureau
Déclaration variable	$nom = "Ali";	let nom = "Ali";	nom = "Ali"
Affichage	echo "Texte";	console.log("Texte");	print("Texte")
Conditions	if...else	if...else	if...else
Fonctions	function nom()	function nom()	def nom()
Conclusion
✔️ PHP est un langage puissant pour le développement web dynamique.
✔️ Les variables sont déclarées avec $ sans type spécifique.
✔️ Les conditions et les fonctions sont similaires aux autres langages.
✔️ PHP fonctionne en combinaison avec HTML pour générer des pages interactives.

🚀 PHP est l'un des langages les plus utilisés pour créer des sites web dynamiques comme Facebook, WordPress et Wikipedia !`;

// Add PHP language summary
async function addPHPLanguageSummary() {
  try {
    console.log('Adding PHP language summary...');
    const { data: phpLanguage, error: phpLanguageError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'PHP')
      .single();
      
    if (phpLanguageError) {
      console.error('Error fetching PHP language:', phpLanguageError);
      
      // If PHP language doesn't exist yet, create it
      const { data: newLanguage, error: createLangError } = await supabase
        .from('programming_languages')
        .insert({
          name: 'PHP',
          description: 'PHP is a server-side scripting language designed for web development',
          image_url: 'https://www.php.net/images/logos/new-php-logo.svg'
        })
        .select();
        
      if (createLangError) {
        console.error('Error creating PHP language:', createLangError);
        return;
      }
      
      console.log('PHP language created:', newLanguage);
      
      // Use the newly created language ID
      const { error: phpSummaryError } = await supabase
        .from('language_summaries')
        .insert({
          language_id: newLanguage[0].id,
          title: 'Fondamentaux du langage PHP',
          content: phpSummaryContent
        });
        
      if (phpSummaryError) {
        console.error('Error adding PHP language summary:', phpSummaryError);
      } else {
        console.log('PHP language summary added successfully!');
      }
      
      return;
    }
    
    // Check if summary already exists
    const { data: existingSummary, error: existingSummaryError } = await supabase
      .from('language_summaries')
      .select('id')
      .eq('language_id', phpLanguage.id)
      .maybeSingle();
      
    if (existingSummaryError && existingSummaryError.code !== 'PGRST116') {
      console.error('Error checking existing summary:', existingSummaryError);
      return;
    }
    
    if (existingSummary) {
      console.log('PHP language summary already exists, updating content...');
      
      // Update existing summary
      const { error: updateError } = await supabase
        .from('language_summaries')
        .update({
          content: phpSummaryContent
        })
        .eq('id', existingSummary.id);
        
      if (updateError) {
        console.error('Error updating PHP language summary:', updateError);
      } else {
        console.log('PHP language summary updated successfully!');
      }
    } else {
      // Create new summary
      const { error: phpSummaryError } = await supabase
        .from('language_summaries')
        .insert({
          language_id: phpLanguage.id,
          title: 'Fondamentaux du langage PHP',
          content: phpSummaryContent
        });
        
      if (phpSummaryError) {
        console.error('Error adding PHP language summary:', phpSummaryError);
      } else {
        console.log('PHP language summary added successfully!');
      }
    }
    
    // Ensure PHP badge exists
    const { error: phpBadgeError } = await supabase
      .from('badges')
      .insert({
        name: 'PHP Mastery',
        description: 'Completed PHP language summary and quiz',
        icon: 'award',
        points: 100
      })
      .onConflict(['name'])
      .ignore();
      
    if (phpBadgeError) {
      console.error('Error adding PHP badge:', phpBadgeError);
    }
    
    console.log('PHP language summary and badge setup completed successfully!');
  } catch (error) {
    console.error('Error in addPHPLanguageSummary:', error);
  }
}

// Create a function to check PHP summary by name
async function checkPHPSummaryByName() {
  try {
    // Get PHP language ID
    const { data: phpLanguage, error: phpLanguageError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'PHP')
      .maybeSingle();
      
    if (phpLanguageError && phpLanguageError.code !== 'PGRST116') {
      console.error('Error fetching PHP language:', phpLanguageError);
      return null;
    }
    
    if (!phpLanguage) {
      console.log('PHP language not found, creating it now...');
      await addPHPLanguageSummary();
      return;
    }
    
    // Check if summary exists
    const { data: summary, error: summaryError } = await supabase
      .from('language_summaries')
      .select('*')
      .eq('language_id', phpLanguage.id)
      .maybeSingle();
      
    if (summaryError && summaryError.code !== 'PGRST116') {
      console.error('Error fetching PHP summary:', summaryError);
      return null;
    }
    
    if (!summary) {
      console.log('PHP summary not found, creating it now...');
      await addPHPLanguageSummary();
    } else {
      console.log('PHP summary found:', summary.title);
      return summary;
    }
  } catch (error) {
    console.error('Error checking PHP summary:', error);
    return null;
  }
}

// Run the function
addPHPLanguageSummary();

// Export the check function for direct use
export { checkPHPSummaryByName };
