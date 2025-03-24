
// This is a script to manually run to seed the database with the advanced questions
// Not actually used in the application, but provides the questions data

const advancedQuestions = [
  // Python Advanced Questions
  {
    question: "Quelle est la sortie de ce code ? (function with default mutable arg)\ndef func(x, lst=[]):\n    lst.append(x)\n    return lst\n\nprint(func(1))\nprint(func(2))",
    correct_answer: "[1] puis [1, 2]",
    option1: "[1] puis [2]",
    option2: "[1] puis [1, 2]",
    option3: "[1] puis [2, 1]",
    option4: "Erreur",
    explanation: "Les arguments par défaut muables en Python sont évalués une seule fois à la définition de la fonction, pas à chaque appel.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la complexité de sorted() en Python (Timsort) ?",
    correct_answer: "O(n log n)",
    option1: "O(n^2)",
    option2: "O(n log n)",
    option3: "O(n)",
    option4: "O(log n)",
    explanation: "Timsort, l'algorithme utilisé par sorted() en Python, a une complexité de O(n log n) dans le pire des cas.",
    difficulty: "Advanced"
  },
  {
    question: "Que retourne lambda x: x + 2 ?",
    correct_answer: "Une fonction anonyme",
    option1: "Une fonction anonyme",
    option2: "x + 2",
    option3: "Une erreur",
    option4: "Une classe",
    explanation: "lambda en Python crée une fonction anonyme qui retourne l'expression qui suit les arguments.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie du code suivant ?\na = (1, 2, 3)\na[0] = 4",
    correct_answer: "Erreur",
    option1: "(4, 2, 3)",
    option2: "Erreur",
    option3: "(1, 4, 3)",
    option4: "None",
    explanation: "Les tuples en Python sont immuables. On ne peut pas modifier leurs éléments après création.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie du code suivant ? (another default mutable arg)\ndef foo(lst, val=[]):\n    val.append(lst)\n    return val\n\nprint(foo(10))\nprint(foo(20))",
    correct_answer: "[10] puis [10, 20]",
    option1: "[10] puis [20]",
    option2: "[10] puis [10, 20]",
    option3: "[10] puis [10]",
    option4: "Erreur",
    explanation: "Les arguments par défaut muables comme val=[] sont évalués une seule fois à la définition, donc val conserve son état entre les appels.",
    difficulty: "Advanced"
  },
  {
    question: "Comment empêcher une classe d'être instanciée en Python ?",
    correct_answer: "En utilisant __new__ pour lever une exception",
    option1: "En utilisant __new__ pour lever une exception",
    option2: "En utilisant __init__ avec raise Exception",
    option3: "En utilisant @staticmethod",
    option4: "Impossible",
    explanation: "Surcharger __new__ pour qu'il lève une exception empêche la création d'instances car cette méthode est appelée avant __init__.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie du code suivant ?\nprint(sum([True, False, True, True]))",
    correct_answer: "3",
    option1: "True",
    option2: "1",
    option3: "3",
    option4: "Erreur",
    explanation: "En Python, True est converti en 1 et False en 0 lors d'opérations numériques, donc sum additionne 1+0+1+1=3.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la complexité temporelle de dict.get() en Python ?",
    correct_answer: "O(1)",
    option1: "O(1)",
    option2: "O(n log n)",
    option3: "O(log n)",
    option4: "O(n)",
    explanation: "Les dictionnaires Python utilisent des tables de hachage qui permettent un accès en temps constant O(1) en moyenne.",
    difficulty: "Advanced"
  },
  
  // Java Advanced Questions
  {
    question: "Quelle est la sortie du code suivant ?\nString str1 = \"hello\";\nString str2 = new String(\"hello\");\nSystem.out.println(str1 == str2);",
    correct_answer: "false",
    option1: "true",
    option2: "false",
    option3: "hellohello",
    option4: "Erreur",
    explanation: "L'opérateur == compare les références en Java, pas le contenu. str1 est dans le pool de chaînes tandis que str2 est une nouvelle instance.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie de ce code ?\nint x = 5;\nSystem.out.println(x++ * ++x);",
    correct_answer: "30",
    option1: "30",
    option2: "25",
    option3: "Erreur",
    option4: "20",
    explanation: "x++ utilise x (5) puis l'incrémente à 6. ++x incrémente x à 7 avant de l'utiliser. Donc 5 * 7 = 35.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie de ce code ?\npublic class Test {\n    public static void main(String[] args) {\n        System.out.println(10 + 20 + \"30\");\n    }\n}",
    correct_answer: "3030",
    option1: "3030",
    option2: "102030",
    option3: "30",
    option4: "Erreur",
    explanation: "Java évalue de gauche à droite. D'abord 10+20=30, puis concaténation avec \"30\" donne \"3030\".",
    difficulty: "Advanced"
  },
  {
    question: "Que fait final lorsqu'il est appliqué à une variable en Java ?",
    correct_answer: "Rend la variable immuable",
    option1: "Rend la variable immuable",
    option2: "Rend la variable accessible uniquement en lecture",
    option3: "Permet la surcharge de méthodes",
    option4: "Augmente la performance",
    explanation: "Le mot-clé final en Java signifie qu'une variable ne peut être assignée qu'une seule fois, la rendant immuable.",
    difficulty: "Advanced"
  },
  
  // JavaScript Advanced Questions
  {
    question: "Quelle est la sortie de ce code ?\nconsole.log(typeof null);",
    correct_answer: "object",
    option1: "null",
    option2: "object",
    option3: "undefined",
    option4: "Erreur",
    explanation: "En JavaScript, typeof null retourne 'object'. C'est un bug historique qui n'a jamais été corrigé pour préserver la compatibilité.",
    difficulty: "Advanced"
  },
  {
    question: "Que retourne console.log(1 + '1' - 1); ?",
    correct_answer: "10",
    option1: "1",
    option2: "10",
    option3: "0",
    option4: "11",
    explanation: "Le + avec une chaîne fait une concaténation: 1+'1'='11'. Puis l'opérateur - convertit tout en nombre, donc '11'-1=10.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie de ce code ?\nconsole.log([] + []);",
    correct_answer: "\"\" (chaîne vide)",
    option1: "\"\" (chaîne vide)",
    option2: "[]",
    option3: "undefined",
    option4: "Erreur",
    explanation: "JavaScript convertit les tableaux en chaînes vides lors de l'addition, donc [] + [] = \"\" + \"\" = \"\".",
    difficulty: "Advanced"
  },
  {
    question: "Que fait Object.freeze(obj) en JavaScript ?",
    correct_answer: "Rend obj immuable",
    option1: "Rend obj immuable",
    option2: "Supprime obj de la mémoire",
    option3: "Rend obj invisible",
    option4: "Rien",
    explanation: "Object.freeze() empêche d'ajouter, supprimer ou modifier les propriétés d'un objet, le rendant immuable.",
    difficulty: "Advanced"
  },
  
  // SQL Advanced Questions
  {
    question: "Quelle est la différence entre INNER JOIN et LEFT JOIN ?",
    correct_answer: "Les deux réponses sont correctes",
    option1: "INNER JOIN retourne uniquement les correspondances",
    option2: "LEFT JOIN retourne toutes les lignes de la table de gauche et les correspondances de droite",
    option3: "Les deux réponses sont correctes",
    option4: "Aucune des réponses",
    explanation: "INNER JOIN retourne les lignes quand il y a correspondance dans les deux tables. LEFT JOIN retourne toutes les lignes de la table de gauche et les correspondances de droite.",
    difficulty: "Advanced"
  },
  {
    question: "Que fait cette requête SQL ?\nSELECT name FROM students ORDER BY age DESC LIMIT 1;",
    correct_answer: "Retourne l'étudiant le plus âgé",
    option1: "Retourne l'étudiant le plus jeune",
    option2: "Retourne l'étudiant le plus âgé",
    option3: "Retourne tous les étudiants triés par âge",
    option4: "Erreur",
    explanation: "ORDER BY age DESC trie par âge décroissant et LIMIT 1 ne retourne que la première ligne, donc l'étudiant le plus âgé.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie de cette requête ?\nSELECT COUNT(NULL), COUNT(1), COUNT(*) FROM students;",
    correct_answer: "0, nombre de lignes, nombre de lignes",
    option1: "0, nombre de lignes, nombre de lignes",
    option2: "nombre de lignes, nombre de lignes, nombre de lignes",
    option3: "1, nombre de lignes, nombre de lignes",
    option4: "Erreur",
    explanation: "COUNT(NULL) renvoie toujours 0 car NULL est ignoré. COUNT(1) et COUNT(*) renvoient le nombre total de lignes.",
    difficulty: "Advanced"
  },
  {
    question: "Quel est l'avantage de INDEX en SQL ?",
    correct_answer: "Accélère les requêtes SELECT",
    option1: "Accélère les requêtes SELECT",
    option2: "Accélère les requêtes INSERT",
    option3: "Augmente la taille de la base",
    option4: "Rend la base plus lente",
    explanation: "Les index accélèrent les requêtes SELECT en créant des structures de données pour un accès plus rapide, similaires à un index de livre.",
    difficulty: "Advanced"
  },
  
  // C/C++ Advanced Questions
  {
    question: "Que fait ce code en C ?\nint a = 5;\nprintf(\"%d\", a+++a);",
    correct_answer: "10",
    option1: "10",
    option2: "11",
    option3: "Erreur",
    option4: "5",
    explanation: "a+++a est interprété comme (a++) + a. Le a++ utilise la valeur 5 puis incrémente a à 6. Ensuite, 5 + 6 = 11.",
    difficulty: "Advanced"
  },
  {
    question: "Que signifie volatile en C ?",
    correct_answer: "Empêche l'optimisation du compilateur",
    option1: "Empêche l'optimisation du compilateur",
    option2: "Rend une variable globale",
    option3: "Déclare une constante",
    option4: "Force une valeur à être NULL",
    explanation: "volatile indique au compilateur que la variable peut être modifiée par des facteurs externes, empêchant certaines optimisations.",
    difficulty: "Advanced"
  },
  {
    question: "Que fait ce code en C++ ?\nclass Base {\npublic:\n    virtual ~Base() = 0;\n};\nBase::~Base() {}\n\nclass Derived : public Base {};\n\nint main() {\n    Derived d;\n}",
    correct_answer: "Compilation réussie",
    option1: "Compilation réussie",
    option2: "Erreur de compilation",
    option3: "Segmentation fault",
    option4: "Erreur d'exécution",
    explanation: "Le code est valide. Bien que Base ait un destructeur virtuel pur = 0, son implémentation est fournie, donc Derived peut être instanciée.",
    difficulty: "Advanced"
  },
  {
    question: "Quelle est la sortie du code suivant ?\nint a = 5;\nprintf(\"%d\", a-- - --a);",
    correct_answer: "1",
    option1: "1",
    option2: "0",
    option3: "5",
    option4: "Erreur",
    explanation: "a-- utilise 5 puis décrémente à 4. --a décrémente encore à 3 avant utilisation. Donc 5-3=2.",
    difficulty: "Advanced"
  },
  {
    question: "Que retourne sizeof('A') en C ?",
    correct_answer: "4",
    option1: "1",
    option2: "2",
    option3: "4",
    option4: "Erreur",
    explanation: "En C, un caractère entre apostrophes est de type int, donc sizeof('A') est généralement 4 (taille d'un int) sur les architectures modernes.",
    difficulty: "Advanced"
  },
  
  // Additional Advanced Questions
  {
    question: "En Python, que fait la fonction isinstance() ?",
    correct_answer: "Vérifie si un objet est d'un type spécifié",
    option1: "Vérifie si un objet est d'un type spécifié",
    option2: "Convertit un objet en un type spécifié",
    option3: "Crée une nouvelle instance",
    option4: "Compare deux instances",
    explanation: "isinstance() vérifie si un objet est une instance d'une classe ou d'un type spécifié, retournant True ou False.",
    difficulty: "Advanced"
  },
  {
    question: "Que fait le sélecteur CSS :nth-child(2n+1) ?",
    correct_answer: "Sélectionne les éléments impairs",
    option1: "Sélectionne les éléments pairs",
    option2: "Sélectionne les éléments impairs",
    option3: "Sélectionne le deuxième élément",
    option4: "Sélectionne tous les éléments",
    explanation: "La formule 2n+1 sélectionne les éléments 1, 3, 5, etc. (impairs) car n prend les valeurs 0, 1, 2, etc.",
    difficulty: "Advanced"
  },
  {
    question: "En C++, que signifie std::move() ?",
    correct_answer: "Convertit un objet en référence rvalue",
    option1: "Déplace physiquement un objet en mémoire",
    option2: "Copie un objet",
    option3: "Convertit un objet en référence rvalue",
    option4: "Supprime un objet",
    explanation: "std::move() ne déplace rien mais convertit un objet en référence rvalue, permettant l'utilisation de constructeurs et opérateurs de déplacement.",
    difficulty: "Advanced"
  },
  {
    question: "Dans les bases de données, qu'est-ce qu'une transaction ACID ?",
    correct_answer: "Une opération atomique, cohérente, isolée et durable",
    option1: "Une opération acide sur les données",
    option2: "Une opération atomique, cohérente, isolée et durable",
    option3: "Un type de requête SQL",
    option4: "Une technique d'optimisation",
    explanation: "ACID signifie Atomicité, Cohérence, Isolation et Durabilité, les propriétés qui garantissent la fiabilité des transactions de base de données.",
    difficulty: "Advanced"
  }
];

// Insert the questions into the database
async function seedQuizQuestions() {
  try {
    // Code to insert the questions into your database
    // This would typically use supabase or another database client
    
    /*
    Example with Supabase:
    
    import { supabase } from '@/integrations/supabase/client';
    
    const { data, error } = await supabase
      .from('coding_quiz')
      .insert(advancedQuestions);
      
    if (error) {
      console.error('Error seeding questions:', error);
    } else {
      console.log('Successfully seeded questions:', data);
    }
    */
    
    console.log('Questions ready for seeding');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Export the questions for use in supabase seeding scripts
module.exports = {
  advancedQuestions
};
