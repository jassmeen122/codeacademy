
const { createClient } = require('@supabase/supabase-js');

// Initialiser le client Supabase avec vos identifiants
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PYTHON_LANGUAGE_ID = 'python'; // Remplacez par l'ID réel dans votre base de données

const pythonSummary = {
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
};

async function updatePythonSummary() {
  // Vérifier si un résumé Python existe déjà
  const { data: existingSummary, error: fetchError } = await supabase
    .from('language_summaries')
    .select('*')
    .eq('language_id', PYTHON_LANGUAGE_ID)
    .maybeSingle();

  if (fetchError) {
    console.error('Erreur lors de la vérification du résumé:', fetchError);
    return;
  }

  if (existingSummary) {
    // Mettre à jour le résumé existant
    const { error: updateError } = await supabase
      .from('language_summaries')
      .update({
        title: pythonSummary.title,
        content: pythonSummary.content
      })
      .eq('id', existingSummary.id);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du résumé:', updateError);
    } else {
      console.log('Résumé Python mis à jour avec succès!');
    }
  } else {
    // Insérer un nouveau résumé
    const { error: insertError } = await supabase
      .from('language_summaries')
      .insert([{
        language_id: PYTHON_LANGUAGE_ID,
        title: pythonSummary.title,
        content: pythonSummary.content
      }]);

    if (insertError) {
      console.error('Erreur lors de l\'insertion du résumé:', insertError);
    } else {
      console.log('Résumé Python inséré avec succès!');
    }
  }
}

updatePythonSummary()
  .catch(console.error)
  .finally(() => {
    console.log('Script terminé');
  });
