
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

interface LanguageSummary {
  id: string;
  language_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface UserProgress {
  id?: string;
  user_id: string;
  language_id: string;
  summary_read: boolean;
  quiz_completed: boolean;
  badge_earned: boolean;
  last_updated?: string;
}

export const useLanguageSummary = (languageId: string | undefined) => {
  const [summary, setSummary] = useState<LanguageSummary | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthState();

  useEffect(() => {
    if (!languageId) {
      setLoading(false);
      return;
    }

    const fetchSummaryAndProgress = async () => {
      try {
        setLoading(true);
        
        // Récupérer le résumé du langage
        const { data: summaryData, error: summaryError } = await supabase
          .from('language_summaries')
          .select('*')
          .eq('language_id', languageId)
          .maybeSingle();
          
        if (summaryError) {
          console.error('Erreur lors de la récupération du résumé:', summaryError);
          // Ne pas jeter d'erreur ici, simplement logger pour le débogage
        }
        
        if (summaryData) {
          setSummary(summaryData as LanguageSummary);
        } else {
          // Si aucun résumé n'existe, on crée un résumé par défaut basé sur l'ID du langage
          createDefaultSummary(languageId);
        }
        
        // Récupérer la progression de l'utilisateur si connecté
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_language_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('language_id', languageId)
            .maybeSingle();
            
          if (progressError) {
            console.error('Erreur lors de la récupération de la progression:', progressError);
          } else if (progressData) {
            setProgress(progressData as UserProgress);
          } else {
            // Créer une nouvelle entrée de progression par défaut
            setProgress({
              user_id: user.id,
              language_id: languageId,
              summary_read: false,
              quiz_completed: false,
              badge_earned: false
            });
          }
        }
      } catch (err: any) {
        console.error('Erreur lors de la récupération des données:', err);
        setError(err);
        toast.error('Erreur lors du chargement du résumé');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryAndProgress();
  }, [languageId, user]);

  // Fonction pour créer un résumé par défaut
  const createDefaultSummary = (langId: string) => {
    // Résumé par défaut pour Python
    if (langId === 'python') {
      const pythonSummaryContent = {
        id: 'temp-id',
        language_id: 'python',
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

Ces notions sont la base de tout programme en Python !`,
        created_at: new Date().toISOString()
      };
      
      setSummary(pythonSummaryContent as LanguageSummary);
      
      // Tenter d'enregistrer ce résumé dans la base de données
      // On le fait de façon asynchrone sans bloquer l'affichage
      saveDefaultSummary(pythonSummaryContent);
    } 
    // Résumé par défaut pour Java
    else if (langId === 'java') {
      const javaSummaryContent = {
        id: 'temp-id',
        language_id: 'java',
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
    System.out.println("Vous êtes mineur, entrée interdite.");
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

Java est plus strict que Python, mais il est très puissant et utilisé dans les grandes applications !`,
        created_at: new Date().toISOString()
      };
      
      setSummary(javaSummaryContent as LanguageSummary);
      
      // Tenter d'enregistrer ce résumé dans la base de données sans bloquer l'affichage
      saveDefaultSummary(javaSummaryContent);
    }
    else {
      // Résumés par défaut pour d'autres langages peuvent être ajoutés ici
      setSummary(null);
    }
  };

  // Fonction pour sauvegarder un résumé par défaut dans la base de données
  const saveDefaultSummary = async (summaryContent: any) => {
    try {
      const { error } = await supabase
        .from('language_summaries')
        .insert([{
          language_id: summaryContent.language_id,
          title: summaryContent.title,
          content: summaryContent.content
        }]);
        
      if (error) {
        console.error('Erreur lors de l\'enregistrement du résumé par défaut:', error);
      } else {
        console.log('Résumé par défaut enregistré avec succès');
      }
    } catch (err) {
      console.error('Exception lors de l\'enregistrement du résumé par défaut:', err);
    }
  };

  const markAsRead = async () => {
    if (!user || !languageId) return;
    
    try {
      let progData = progress;
      
      if (!progData) {
        // Créer une nouvelle entrée de progression
        progData = {
          user_id: user.id,
          language_id: languageId,
          summary_read: true,
          quiz_completed: false,
          badge_earned: false
        };
      } else {
        progData.summary_read = true;
      }
      
      const { data, error } = await supabase
        .from('user_language_progress')
        .upsert([progData], { onConflict: 'user_id,language_id' })
        .select()
        .single();
        
      if (error) throw error;
      
      setProgress(data as UserProgress);
      toast.success('Résumé marqué comme lu !');
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la progression:', err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return { summary, progress, loading, error, markAsRead };
};
