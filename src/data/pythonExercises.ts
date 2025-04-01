
import { ProgrammingLanguage } from "@/components/CodeEditor/types";

export type PythonExercise = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  language: ProgrammingLanguage;
  starter_code: string;
  solution_code: string;
  tests: { input: string; expected_output: string }[];
  hints: string[];
  points: {
    base: number;
    bonuses: {
      title: string;
      points: number;
      condition: string;
    }[];
  };
};

export const pythonExercises: PythonExercise[] = [
  {
    id: "py-1",
    title: "Addition Simple",
    description: "Écrire une fonction qui renvoie la somme de a et b",
    difficulty: "Beginner",
    language: "python",
    starter_code: "def addition(a, b):\n    # Votre code ici",
    solution_code: "def addition(a, b):\n    return a + b",
    tests: [
      { input: "addition(2, 3)", expected_output: "5" },
      { input: "addition(-1, 1)", expected_output: "0" },
      { input: "addition(5, 0)", expected_output: "5" }
    ],
    hints: ["Utilisez l'opérateur + entre a et b"],
    points: {
      base: 10,
      bonuses: [
        {
          title: "Solution élégante",
          points: 2,
          condition: "code.includes('return a + b') && code.split('\\n').length <= 2"
        }
      ]
    }
  },
  {
    id: "py-2",
    title: "Pair ou Impair",
    description: "Complétez la fonction pour vérifier si un nombre est pair",
    difficulty: "Beginner",
    language: "python",
    starter_code: "def est_pair(n):\n    # Votre code ici",
    solution_code: "def est_pair(n):\n    return n % 2 == 0",
    tests: [
      { input: "est_pair(4)", expected_output: "True" },
      { input: "est_pair(7)", expected_output: "False" },
      { input: "est_pair(0)", expected_output: "True" }
    ],
    hints: ["Utilisez l'opérateur modulo (%) pour vérifier le reste de la division par 2"],
    points: {
      base: 10,
      bonuses: [
        {
          title: "Solution concise",
          points: 2,
          condition: "code.includes('return') && code.includes('%') && code.split('\\n').length <= 2"
        }
      ]
    }
  },
  {
    id: "py-3",
    title: "Somme des éléments",
    description: "Calculez la somme d'une liste de nombres",
    difficulty: "Beginner",
    language: "python",
    starter_code: "def somme_liste(liste):\n    # Votre code ici",
    solution_code: "def somme_liste(liste):\n    total = 0\n    for num in liste:\n        total += num\n    return total",
    tests: [
      { input: "somme_liste([1, 2, 3])", expected_output: "6" },
      { input: "somme_liste([])", expected_output: "0" },
      { input: "somme_liste([5])", expected_output: "5" }
    ],
    hints: ["Initialisez une variable pour le total, puis parcourez la liste en ajoutant chaque élément"],
    points: {
      base: 10,
      bonuses: [
        {
          title: "Utilisation de boucle",
          points: 2,
          condition: "code.includes('for') && code.includes('in') && code.includes('+=')"
        },
        {
          title: "Solution pythonique",
          points: 3,
          condition: "code.includes('return sum(')"
        }
      ]
    }
  },
  {
    id: "py-4",
    title: "Inverser une chaîne",
    description: "Inversez la chaîne de caractères (sans utiliser [::-1])",
    difficulty: "Beginner",
    language: "python",
    starter_code: "def inverser(chaine):\n    # Votre code ici",
    solution_code: "def inverser(chaine):\n    return ''.join(reversed(chaine))",
    tests: [
      { input: "inverser('hello')", expected_output: "'olleh'" },
      { input: "inverser('')", expected_output: "''" },
      { input: "inverser('a')", expected_output: "'a'" }
    ],
    hints: ["Vous pouvez utiliser la fonction 'reversed()' et ''.join()' pour joindre les caractères"],
    points: {
      base: 10,
      bonuses: [
        {
          title: "Solution élégante",
          points: 2,
          condition: "code.includes('reversed') || code.includes('join')"
        },
        {
          title: "Sans slice",
          points: 3, 
          condition: "!code.includes('[::-1]')"
        }
      ]
    }
  },
  {
    id: "py-5",
    title: "Factorielle",
    description: "Calculez la factorielle (n!) avec une boucle",
    difficulty: "Intermediate",
    language: "python",
    starter_code: "def factorielle(n):\n    # Votre code ici",
    solution_code: "def factorielle(n):\n    result = 1\n    for i in range(1, n+1):\n        result *= i\n    return result",
    tests: [
      { input: "factorielle(5)", expected_output: "120" },
      { input: "factorielle(0)", expected_output: "1" },
      { input: "factorielle(1)", expected_output: "1" }
    ],
    hints: ["Initialisez le résultat à 1, puis multipliez par chaque nombre de 1 à n"],
    points: {
      base: 10,
      bonuses: [
        {
          title: "Utilisation de boucle",
          points: 2,
          condition: "code.includes('for') && code.includes('range')"
        },
        {
          title: "Gestion des cas limites",
          points: 3,
          condition: "code.includes('if') && (code.includes('n == 0') || code.includes('n <= 1'))"
        }
      ]
    }
  },
  {
    id: "py-6",
    title: "Nombre premier",
    description: "Vérifiez si un nombre est premier",
    difficulty: "Intermediate",
    language: "python",
    starter_code: "def est_premier(n):\n    # Votre code ici",
    solution_code: "def est_premier(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0:\n            return False\n    return True",
    tests: [
      { input: "est_premier(7)", expected_output: "True" },
      { input: "est_premier(4)", expected_output: "False" },
      { input: "est_premier(1)", expected_output: "False" },
      { input: "est_premier(2)", expected_output: "True" }
    ],
    hints: [
      "N'oubliez pas que 1 n'est pas un nombre premier",
      "Vous n'avez besoin de vérifier que jusqu'à la racine carrée de n"
    ],
    points: {
      base: 10,
      bonuses: [
        {
          title: "Gestion des cas < 2",
          points: 3,
          condition: "code.includes('if') && code.includes('n < 2')"
        },
        {
          title: "Optimisation mathématique",
          points: 5,
          condition: "code.includes('**0.5') || code.includes('sqrt')"
        }
      ]
    }
  }
];
