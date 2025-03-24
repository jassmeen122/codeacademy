import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Seed programming languages
    const languages = [
      { 
        name: 'Python', 
        description: 'Python est un langage de programmation polyvalent, idéal pour les débutants. Il est utilisé dans de nombreux domaines comme l\'intelligence artificielle, le développement web et l\'analyse de données.',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png'
      },
      { 
        name: 'JavaScript', 
        description: 'JavaScript est un langage de programmation essentiel pour le développement web. Il permet de créer des sites web interactifs et est utilisé tant côté client que côté serveur avec Node.js.',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png'
      },
      { 
        name: 'Java', 
        description: 'Java est un langage orienté objet très populaire, utilisé principalement pour le développement d\'applications Android et de systèmes d\'entreprise.',
        image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/1200px-Java_programming_language_logo.svg.png'
      },
      { 
        name: 'SQL', 
        description: 'SQL est le langage standard pour gérer et manipuler les bases de données. Il est crucial pour les développeurs travaillant avec des systèmes de gestion de bases de données relationnelles.',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png'
      },
      { 
        name: 'PHP', 
        description: 'PHP est un langage de script côté serveur conçu pour le développement web, mais également utilisé comme langage de programmation généraliste.',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/2560px-PHP-logo.svg.png'
      },
    ];

    const { data: languagesData, error: languagesError } = await supabaseClient
      .from('programming_languages')
      .insert(languages)
      .select();

    if (languagesError) {
      throw languagesError;
    }

    const languageMap = languagesData.reduce((acc, lang) => {
      acc[lang.name] = lang.id;
      return acc;
    }, {});

    // Seed Python modules
    if (languageMap.Python) {
      const pythonModules = [
        {
          language_id: languageMap.Python,
          title: 'Introduction à Python',
          description: 'Découvrez les bases du langage Python, son histoire et comment configurer votre environnement de développement.',
          content: `# Introduction à Python

Python est un langage de programmation polyvalent, interprété et de haut niveau. Créé par Guido van Rossum à la fin des années 1980, il est aujourd'hui l'un des langages les plus populaires et utilisés dans le monde.

## Histoire de Python

Python a été conçu pour mettre l'accent sur la lisibilité du code. Sa syntaxe permet aux programmeurs d'exprimer des concepts en moins de lignes de code qu'il ne serait possible dans des langages comme C++ ou Java.

## Installation de Python

Pour installer Python, rendez-vous sur le site officiel python.org et téléchargez la dernière version compatible avec votre système d'exploitation.

## Votre premier programme Python

\`\`\`
# Ceci est un commentaire
print("Hello, World!")  # Affiche Hello, World!
\`\`\`

## Variables et types de données

En Python, vous pouvez créer des variables sans déclarer leur type :

\`\`\`
# Variables et types de base
nombre = 42        # Entier
decimal = 3.14     # Flottant
texte = "Python"   # Chaîne de caractères
est_vrai = True    # Booléen
\`\`\``,
          order_index: 1,
          difficulty: 'Beginner',
          estimated_duration: '1 heure'
        },
        {
          language_id: languageMap.Python,
          title: 'Structures de contrôle',
          description: 'Apprenez à contrôler le flux d\'exécution de vos programmes Python avec les conditions et les boucles.',
          content: `# Structures de contrôle en Python

Les structures de contrôle permettent de modifier le flux d'exécution d'un programme en fonction de certaines conditions ou de répéter des actions.

## Les conditions (if, elif, else)

\`\`\`
age = 18

if age < 18:
    print("Vous êtes mineur")
elif age == 18:
    print("Vous venez d'être majeur")
else:
    print("Vous êtes majeur")
\`\`\`

## Les boucles for

La boucle for est utilisée pour itérer sur une séquence (liste, tuple, dictionnaire, ensemble ou chaîne).

\`\`\`
# Parcourir une liste
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(fruit)

# Utiliser la fonction range
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)
\`\`\`

## Les boucles while

La boucle while exécute un bloc de code tant qu'une condition est vraie.

\`\`\`
compte = 0
while compte < 5:
    print(compte)
    compte += 1  # Incrémente compte
\`\`\`

## Les instructions break et continue

- break : sort complètement de la boucle
- continue : passe à l'itération suivante

\`\`\`
for i in range(10):
    if i == 3:
        continue  # Saute quand i vaut 3
    if i == 7:
        break     # Sort de la boucle quand i vaut 7
    print(i)
\`\`\``,
          order_index: 2,
          difficulty: 'Beginner',
          estimated_duration: '2 heures'
        },
        {
          language_id: languageMap.Python,
          title: 'Fonctions et modules',
          description: 'Découvrez comment structurer votre code avec des fonctions et utiliser les modules Python.',
          content: `# Fonctions et modules en Python

## Définir une fonction

Les fonctions permettent de regrouper du code réutilisable.

```python
def saluer(nom):
    """Cette fonction affiche un message de salutation."""
    return f"Bonjour, {nom} !"

# Appel de la fonction
message = saluer("Alice")
print(message)  # Affiche: Bonjour, Alice !
```

## Paramètres par défaut

```python
def saluer(nom, message="Bonjour"):
    return f"{message}, {nom} !"

print(saluer("Bob"))  # Utilise la valeur par défaut: Bonjour, Bob !
print(saluer("Charlie", "Salut"))  # Remplace la valeur par défaut: Salut, Charlie !
```

## Arguments nommés

```python
def presenter(prenom, nom, age):
    return f"{prenom} {nom}, {age} ans"

# Vous pouvez spécifier les arguments dans n'importe quel ordre si vous les nommez
print(presenter(age=30, nom="Dupont", prenom="Jean"))
```

## Modules et packages

Les modules sont des fichiers Python contenant du code réutilisable. Les packages sont des dossiers contenant plusieurs modules.

```python
# Importer un module entier
import math
print(math.sqrt(16))  # Utilise la fonction sqrt du module math

# Importer une fonction spécifique
from math import cos
print(cos(0))  # Utilise directement la fonction cos

# Importer avec un alias
import numpy as np
arr = np.array([1, 2, 3])
````,
          order_index: 3,
          difficulty: 'Beginner',
          estimated_duration: '2 heures'
        },
        {
          language_id: languageMap.Python,
          title: 'Programmation Orientée Objet',
          description: 'Apprenez les principes de la POO en Python et comment créer vos propres classes.',
          content: `# Programmation Orientée Objet en Python

La Programmation Orientée Objet (POO) est un paradigme de programmation qui utilise des "objets" pour modéliser des données et des comportements.

## Classes et objets

Une classe est un modèle pour créer des objets.

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def se_presenter(self):
        return f"Je m'appelle {self.nom} et j'ai {self.age} ans."

# Création d'un objet (instance de la classe)
personne1 = Personne("Alice", 30)
print(personne1.se_presenter())
```

## Héritage

L'héritage permet à une classe d'hériter des attributs et méthodes d'une autre classe.

```python
class Etudiant(Personne):
    def __init__(self, nom, age, ecole):
        # Appel du constructeur de la classe parente
        super().__init__(nom, age)
        self.ecole = ecole
    
    def etudier(self):
        return f"{self.nom} étudie à {self.ecole}."

etudiant1 = Etudiant("Bob", 20, "Université Python")
print(etudiant1.se_presenter())  # Méthode héritée
print(etudiant1.etudier())       # Nouvelle méthode
```

## Encapsulation

L'encapsulation consiste à restreindre l'accès à certains composants d'un objet.

```python
class CompteBancaire:
    def __init__(self, proprietaire, solde=0):
        self.proprietaire = proprietaire
        self.__solde = solde  # Attribut privé (convention: préfixe __)
    
    def deposer(self, montant):
        if montant > 0:
            self.__solde += montant
            return True
        return False
    
    def retirer(self, montant):
        if 0 < montant <= self.__solde:
            self.__solde -= montant
            return True
        return False
    
    def get_solde(self):
        return self.__solde

compte = CompteBancaire("Charlie")
compte.deposer(1000)
print(compte.get_solde())  # 1000
```

## Polymorphisme

Le polymorphisme permet à différentes classes d'avoir des méthodes de même nom mais avec des comportements différents.

```python
class Animal:
    def faire_bruit(self):
        pass

class Chien(Animal):
    def faire_bruit(self):
        return "Woof!"

class Chat(Animal):
    def faire_bruit(self):
        return "Meow!"

def faire_parler(animal):
    return animal.faire_bruit()

animaux = [Chien(), Chat()]
for animal in animaux:
    print(faire_parler(animal))
````,
          order_index: 4,
          difficulty: 'Intermediate',
          estimated_duration: '3 heures'
        },
        {
          language_id: languageMap.Python,
          title: 'Gestion des erreurs',
          description: 'Apprenez à gérer les exceptions et à déboguer votre code Python.',
          content: `# Gestion des erreurs en Python

La gestion des erreurs est une partie importante de tout programme robuste. Python utilise des exceptions pour gérer les erreurs.

## Try et Except

Le bloc try/except permet de capturer et gérer les exceptions.

```python
try:
    # Code susceptible de générer une erreur
    nombre = int(input("Entrez un nombre: "))
    resultat = 10 / nombre
    print(f"10 divisé par {nombre} est égal à {resultat}")
except ValueError:
    # Exécuté si l'utilisateur n'entre pas un nombre valide
    print("Erreur: Veuillez entrer un nombre valide.")
except ZeroDivisionError:
    # Exécuté si l'utilisateur entre 0 (division par zéro)
    print("Erreur: La division par zéro n'est pas autorisée.")
except Exception as e:
    # Capture toute autre exception
    print(f"Une erreur inattendue s'est produite: {e}")
```

## Else et Finally

Le bloc else est exécuté si aucune exception n'est levée dans le bloc try.
Le bloc finally est toujours exécuté, qu'une exception soit levée ou non.

```python
try:
    fichier = open("donnees.txt", "r")
    contenu = fichier.read()
except FileNotFoundError:
    print("Le fichier n'existe pas.")
else:
    print(f"Contenu du fichier: {contenu}")
finally:
    # Ce bloc s'exécute toujours
    print("Opération terminée.")
    # Fermer le fichier s'il a été ouvert
    if 'fichier' in locals() and not fichier.closed:
        fichier.close()
```

## Lever des exceptions

Vous pouvez lever des exceptions avec l'instruction raise.

```python
def diviser(a, b):
    if b == 0:
        raise ValueError("La division par zéro n'est pas autorisée.")
    return a / b

try:
    resultat = diviser(10, 0)
except ValueError as e:
    print(f"Erreur: {e}")
```

## Créer des exceptions personnalisées

Vous pouvez créer vos propres classes d'exceptions.

```python
class MonErreurPersonnalisee(Exception):
    """Exception levée pour des erreurs spécifiques à mon application."""
    pass

def verifier_age(age):
    if age < 0:
        raise MonErreurPersonnalisee("L'âge ne peut pas être négatif.")
    if age > 150:
        raise MonErreurPersonnalisee("L'âge semble trop élevé.")
    return age

try:
    mon_age = verifier_age(200)
except MonErreurPersonnalisee as e:
    print(f"Erreur de validation: {e}")
````,
          order_index: 5,
          difficulty: 'Intermediate',
          estimated_duration: '2 heures'
        },
      ];

      const { error: modulesError } = await supabaseClient
        .from('course_modules')
        .insert(pythonModules);

      if (modulesError) {
        throw modulesError;
      }

      // Fetch the created modules to get their IDs
      const { data: createdModules, error: fetchModulesError } = await supabaseClient
        .from('course_modules')
        .select('id, title')
        .eq('language_id', languageMap.Python);

      if (fetchModulesError) {
        throw fetchModulesError;
      }

      // Create quiz questions for the Python modules
      const quizzes = [];

      // Introduction module quizzes
      if (createdModules[0]?.id) {
        quizzes.push(
          {
            module_id: createdModules[0].id,
            question: "Qui a créé le langage Python ?",
            correct_answer: "Guido van Rossum",
            option1: "Guido van Rossum",
            option2: "James Gosling",
            option3: "Bjarne Stroustrup",
            explanation: "Python a été créé par Guido van Rossum à la fin des années 1980."
          },
          {
            module_id: createdModules[0].id,
            question: "Que fait cette ligne de code : print('Hello, World!') ?",
            correct_answer: "Elle affiche le texte 'Hello, World!' dans la console",
            option1: "Elle affiche le texte 'Hello, World!' dans la console",
            option2: "Elle crée une variable nommée Hello",
            option3: "Elle génère une erreur",
            explanation: "La fonction print() affiche son argument dans la console."
          }
        );
      }

      // Structures de contrôle module quizzes
      if (createdModules[1]?.id) {
        quizzes.push(
          {
            module_id: createdModules[1].id,
            question: "Que fait cette boucle : for i in range(5): print(i) ?",
            correct_answer: "Affiche les nombres de 0 à 4",
            option1: "Affiche les nombres de 0 à 4",
            option2: "Affiche les nombres de 1 à 5",
            option3: "Génère une erreur",
            explanation: "range(5) génère une séquence de nombres de 0 à 4 (5 nombres au total)."
          },
          {
            module_id: createdModules[1].id,
            question: "Quelle instruction permet de sortir immédiatement d'une boucle en Python ?",
            correct_answer: "break",
            option1: "break",
            option2: "exit",
            option3: "continue",
            explanation: "L'instruction break permet de sortir complètement d'une boucle."
          }
        );
      }

      const { error: quizzesError } = await supabaseClient
        .from('quizzes')
        .insert(quizzes);

      if (quizzesError) {
        throw quizzesError;
      }

      // Create coding exercises for Python modules
      const exercises = [];

      // Introduction module exercises
      if (createdModules[0]?.id) {
        exercises.push({
          module_id: createdModules[0].id,
          title: "Premier programme Python",
          description: "Écrivez un programme qui affiche le message 'Bonjour, Python !'",
          starter_code: "# Écrivez votre code ici\n",
          expected_output: "Bonjour, Python !",
          difficulty: "Beginner",
          hints: ["Utilisez la fonction print() pour afficher du texte"]
        });
      }

      // Structures de contrôle module exercises
      if (createdModules[1]?.id) {
        exercises.push({
          module_id: createdModules[1].id,
          title: "Nombres pairs",
          description: "Écrivez un programme qui affiche tous les nombres pairs de 0 à 10 (inclus) en utilisant une boucle for et la condition if.",
          starter_code: "# Utilisez une boucle for avec range\nfor i in range(11):\n    # Vérifiez si i est pair\n    # ...\n",
          expected_output: "0\n2\n4\n6\n8\n10",
          difficulty: "Beginner",
          hints: ["Un nombre est pair s'il est divisible par 2 (i % 2 == 0)"]
        });
      }

      const { error: exercisesError } = await supabaseClient
        .from('coding_exercises')
        .insert(exercises);

      if (exercisesError) {
        throw exercisesError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Course data seeded successfully",
        data: {
          languages: languagesData.length,
          modules: "Python modules created",
          quizzes: "Python quizzes created",
          exercises: "Python exercises created"
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("Error seeding course data:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to seed course data", 
        error: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to create Supabase client (copy of Supabase JS library function)
function createClient(
  supabaseUrl: string,
  supabaseKey: string,
  options: any = {}
) {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const response = await fetch(
              `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&limit=1`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  ...options?.global?.headers
                }
              }
            );
            const json = await response.json();
            if (!response.ok) throw { error: json, status: response.status };
            if (json.length === 0) throw { error: { message: 'No rows found' }, status: 404 };
            return { data: json[0], error: null };
          },
          order: (column: string, { ascending = true } = {}) => ({
            limit: (limit: number) => ({
              single: async () => {
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&order=${column}.${ascending ? 'asc' : 'desc'}&limit=${limit}`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'apikey': supabaseKey,
                      'Authorization': `Bearer ${supabaseKey}`,
                      ...options?.global?.headers
                    }
                  }
                );
                const json = await response.json();
                if (!response.ok) throw { error: json, status: response.status };
                if (json.length === 0) throw { error: { message: 'No rows found' }, status: 404 };
                return { data: json[0], error: null };
              }
            })
          })
        }),
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => ({
            single: async () => {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${column}.${ascending ? 'asc' : 'desc'}&limit=${limit}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    ...options?.global?.headers
                  }
                }
              );
              const json = await response.json();
              if (!response.ok) throw { error: json, status: response.status };
              if (json.length === 0) throw { error: { message: 'No rows found' }, status: 404 };
              return { data: json[0], error: null };
            }
          })
        })
      }),
      insert: (data: any) => ({
        select: async (columns = '*') => {
          const response = await fetch(
            `${supabaseUrl}/rest/v1/${table}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=representation',
                ...options?.global?.headers
              },
              body: JSON.stringify(data)
            }
          );
          const json = await response.json();
          if (!response.ok) return { data: null, error: json };
          return { data: json, error: null };
        }
      })
    })
  };
}
