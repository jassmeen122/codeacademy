
// Base de connaissances pour l'assistant IA local
export interface KnowledgeItem {
  id: string;
  topic: string;
  language?: string;
  keywords: string[];
  content: string;
  examples?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class KnowledgeBase {
  private knowledge: KnowledgeItem[] = [
    // Python
    {
      id: 'python-variables',
      topic: 'Variables en Python',
      language: 'python',
      keywords: ['variable', 'python', 'déclaration', 'affectation'],
      content: `Les variables en Python sont des conteneurs pour stocker des données. Elles sont créées automatiquement lors de l'affectation.

Syntaxe : nom_variable = valeur

Types de base :
- str : chaîne de caractères
- int : nombre entier
- float : nombre décimal
- bool : booléen (True/False)`,
      examples: [
        'nom = "Alice"',
        'age = 25',
        'taille = 1.75',
        'est_etudiant = True'
      ],
      difficulty: 'beginner'
    },
    {
      id: 'python-functions',
      topic: 'Fonctions en Python',
      language: 'python',
      keywords: ['fonction', 'python', 'def', 'return', 'paramètre'],
      content: `Les fonctions permettent de regrouper du code réutilisable.

Syntaxe :
def nom_fonction(paramètres):
    # corps de la fonction
    return résultat`,
      examples: [
        'def saluer(nom):\n    return f"Bonjour {nom}!"',
        'def additionner(a, b):\n    return a + b'
      ],
      difficulty: 'beginner'
    },
    // JavaScript
    {
      id: 'js-variables',
      topic: 'Variables en JavaScript',
      language: 'javascript',
      keywords: ['variable', 'javascript', 'var', 'let', 'const'],
      content: `JavaScript propose trois mots-clés pour déclarer des variables :

- var : portée de fonction (évitée en moderne)
- let : portée de bloc, réassignable
- const : portée de bloc, non réassignable`,
      examples: [
        'let nom = "Alice";',
        'const age = 25;',
        'let estEtudiant = true;'
      ],
      difficulty: 'beginner'
    },
    // Java
    {
      id: 'java-classes',
      topic: 'Classes en Java',
      language: 'java',
      keywords: ['classe', 'java', 'objet', 'constructeur', 'méthode'],
      content: `Une classe est un modèle pour créer des objets.

Syntaxe :
public class NomClasse {
    // attributs
    // constructeur
    // méthodes
}`,
      examples: [
        'public class Personne {\n    private String nom;\n    \n    public Personne(String nom) {\n        this.nom = nom;\n    }\n}'
      ],
      difficulty: 'intermediate'
    },
    // Erreurs communes
    {
      id: 'common-syntax-errors',
      topic: 'Erreurs de syntaxe communes',
      keywords: ['erreur', 'syntaxe', 'bug', 'debug'],
      content: `Erreurs de syntaxe les plus fréquentes :

1. Parenthèses/crochets non fermés
2. Points-virgules manquants (JavaScript, Java, C++)
3. Indentation incorrecte (Python)
4. Quotes non fermées
5. Noms de variables invalides`,
      examples: [
        'print("Hello World"  # Parenthèse manquante',
        'if x = 5:  # Devrait être ==',
        'String nom;  # En Java, pas de majuscule'
      ],
      difficulty: 'beginner'
    }
  ];

  search(keywords: string[], language?: string): KnowledgeItem[] {
    return this.knowledge
      .filter(item => {
        const languageMatch = !language || !item.language || item.language === language;
        const keywordMatch = keywords.some(keyword => 
          item.keywords.some(itemKeyword => 
            itemKeyword.includes(keyword) || keyword.includes(itemKeyword)
          )
        );
        return languageMatch && keywordMatch;
      })
      .sort((a, b) => {
        const aScore = this.calculateRelevanceScore(a, keywords);
        const bScore = this.calculateRelevanceScore(b, keywords);
        return bScore - aScore;
      });
  }

  private calculateRelevanceScore(item: KnowledgeItem, keywords: string[]): number {
    let score = 0;
    keywords.forEach(keyword => {
      item.keywords.forEach(itemKeyword => {
        if (itemKeyword.includes(keyword) || keyword.includes(itemKeyword)) {
          score += 1;
        }
      });
    });
    return score;
  }

  getRandomExercise(language?: string, difficulty?: string): string {
    const exercises = {
      python: {
        beginner: [
          "Créez une fonction qui calcule l'aire d'un rectangle.",
          "Écrivez un programme qui affiche les nombres de 1 à 10.",
          "Créez une liste de vos 5 fruits préférés et affichez-les."
        ],
        intermediate: [
          "Implémentez un algorithme de tri par bulles.",
          "Créez une classe Calculator avec les opérations de base.",
          "Écrivez une fonction qui trouve le plus grand élément d'une liste."
        ]
      },
      javascript: {
        beginner: [
          "Créez une fonction qui vérifie si un nombre est pair ou impair.",
          "Affichez la table de multiplication de 5 dans la console.",
          "Créez un tableau d'objets représentant des étudiants."
        ]
      }
    };

    const lang = language || 'python';
    const diff = difficulty || 'beginner';
    const langExercises = exercises[lang as keyof typeof exercises];
    
    if (langExercises && langExercises[diff as keyof typeof langExercises]) {
      const exerciseList = langExercises[diff as keyof typeof langExercises];
      return exerciseList[Math.floor(Math.random() * exerciseList.length)];
    }
    
    return "Créez un petit programme qui résout un problème de votre choix.";
  }
}
