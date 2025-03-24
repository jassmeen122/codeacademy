
// This is a script to manually run to seed the database with the intermediate questions
// Not actually used in the application, but provides the questions data

const intermediateQuestions = [
  {
    question: "Que retourne len([1, 2, 3, 4]) ?",
    correct_answer: "4",
    option1: "3",
    option2: "4",
    option3: "5",
    option4: "Erreur",
    explanation: "La fonction len() en Python renvoie le nombre d'éléments dans la liste. Comme la liste a 4 éléments, elle renvoie 4.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la sortie du code suivant ? x = [1, 2, 3]; y = x; y.append(4); print(x)",
    correct_answer: "[1, 2, 3, 4]",
    option1: "[1, 2, 3]",
    option2: "[1, 2, 3, 4]",
    option3: "Erreur",
    option4: "[1, 2, 3] [1, 2, 3, 4]",
    explanation: "En Python, les listes sont des objets mutables. Quand on fait y = x, les deux variables pointent vers le même objet en mémoire. Donc les modifications via y affectent aussi x.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment créer une liste vide en Python ?",
    correct_answer: "list = []",
    option1: "list = {}",
    option2: "list = []",
    option3: "list = empty()",
    option4: "list()",
    explanation: "En Python, une liste vide se crée avec des crochets vides : []",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la sortie du code suivant ? print(2 ** 3)",
    correct_answer: "8",
    option1: "6",
    option2: "8",
    option3: "9",
    option4: "Erreur",
    explanation: "L'opérateur ** en Python représente la puissance. 2 ** 3 signifie 2 à la puissance 3, soit 2×2×2 = 8.",
    difficulty: "Intermediate"
  },
  {
    question: "Que retourne type(10 / 2) ?",
    correct_answer: "float",
    option1: "int",
    option2: "float",
    option3: "double",
    option4: "str",
    explanation: "En Python 3, la division avec / renvoie toujours un float, même quand le résultat est un nombre entier.",
    difficulty: "Intermediate"
  },
  {
    question: "Quel est le mot-clé pour déclarer une constante en Java ?",
    correct_answer: "final",
    option1: "constant",
    option2: "const",
    option3: "final",
    option4: "static",
    explanation: "En Java, on utilise le mot-clé 'final' pour déclarer une constante, c'est-à-dire une variable dont la valeur ne peut pas être modifiée après son initialisation.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la sortie de ce programme Java ? System.out.println(5 + \"5\");",
    correct_answer: "55",
    option1: "10",
    option2: "55",
    option3: "Erreur",
    option4: "5 5",
    explanation: "En Java, quand on concatène un nombre et une chaîne avec l'opérateur +, le nombre est converti en chaîne et on obtient une concaténation.",
    difficulty: "Intermediate"
  },
  {
    question: "Quel opérateur est utilisé pour la comparaison en Java ?",
    correct_answer: "==",
    option1: "=",
    option2: "==",
    option3: "===",
    option4: "!=",
    explanation: "En Java, l'opérateur == est utilisé pour comparer deux valeurs. L'opérateur = est utilisé pour l'affectation, et === n'existe pas en Java.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment déclare-t-on un tableau en Java ?",
    correct_answer: "int[] tab = new int[5];",
    option1: "int[] tab = new int[5];",
    option2: "int tab[5];",
    option3: "array<int> tab = new int[5];",
    option4: "int tab = {1,2,3,4,5};",
    explanation: "En Java, on déclare un tableau en spécifiant son type suivi de [] puis son nom, et on l'initialise avec le mot-clé new, le type et sa taille entre crochets.",
    difficulty: "Intermediate"
  },
  {
    question: "Que signifie public static void main(String[] args) ?",
    correct_answer: "C'est la fonction principale d'un programme Java",
    option1: "C'est la fonction principale d'un programme Java",
    option2: "C'est une méthode privée",
    option3: "Elle est optionnelle",
    option4: "Elle sert uniquement pour les tests",
    explanation: "C'est la méthode principale d'un programme Java, le point d'entrée par lequel l'exécution commence. 'public' signifie qu'elle est accessible partout, 'static' qu'elle appartient à la classe, 'void' qu'elle ne renvoie rien, et 'String[] args' permet de passer des arguments en ligne de commande.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment afficher un message dans la console en JavaScript ?",
    correct_answer: "console.log(\"Hello\");",
    option1: "alert(\"Hello\");",
    option2: "console.log(\"Hello\");",
    option3: "print(\"Hello\");",
    option4: "echo(\"Hello\");",
    explanation: "En JavaScript, on utilise console.log() pour afficher des messages dans la console. alert() affiche une boîte de dialogue, print() n'existe pas par défaut, et echo() est utilisé en PHP, pas en JavaScript.",
    difficulty: "Intermediate"
  },
  {
    question: "Que retourne typeof \"Hello\" ?",
    correct_answer: "string",
    option1: "string",
    option2: "String",
    option3: "text",
    option4: "char",
    explanation: "L'opérateur typeof en JavaScript renvoie 'string' pour une chaîne de caractères. En JavaScript, les types sont en minuscules.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la sortie du code suivant ? console.log(2 + \"2\");",
    correct_answer: "22",
    option1: "4",
    option2: "22",
    option3: "Erreur",
    option4: "NaN",
    explanation: "En JavaScript, quand on utilise l'opérateur + avec un nombre et une chaîne, le nombre est converti en chaîne et on obtient une concaténation.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la bonne façon de déclarer une fonction en JavaScript ?",
    correct_answer: "function maFonction() {}",
    option1: "function maFonction() {}",
    option2: "def maFonction() {}",
    option3: "function = maFonction() {}",
    option4: "fun maFonction() {}",
    explanation: "En JavaScript, on déclare une fonction avec le mot-clé 'function' suivi du nom de la fonction, des parenthèses pour les paramètres, et des accolades pour le corps de la fonction.",
    difficulty: "Intermediate"
  },
  {
    question: "Que signifie === en JavaScript ?",
    correct_answer: "Comparaison stricte (type + valeur)",
    option1: "Comparaison stricte (type + valeur)",
    option2: "Comparaison faible (valeur uniquement)",
    option3: "Affectation",
    option4: "Erreur",
    explanation: "En JavaScript, l'opérateur === est une comparaison stricte qui vérifie à la fois la valeur et le type des opérandes. Par exemple, 5 === '5' est faux car les types sont différents.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle commande SQL est utilisée pour récupérer toutes les données d'une table ?",
    correct_answer: "SELECT * FROM table;",
    option1: "GET * FROM table;",
    option2: "SELECT * FROM table;",
    option3: "FETCH * FROM table;",
    option4: "SHOW * FROM table;",
    explanation: "En SQL, la commande SELECT est utilisée pour récupérer des données d'une table. L'astérisque (*) signifie qu'on veut toutes les colonnes.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle clause SQL est utilisée pour filtrer les résultats ?",
    correct_answer: "WHERE",
    option1: "WHERE",
    option2: "FILTER",
    option3: "HAVING",
    option4: "LIMIT",
    explanation: "La clause WHERE en SQL permet de filtrer les lignes renvoyées par une requête selon une condition. HAVING est utilisé avec GROUP BY, LIMIT restreint le nombre de résultats, et FILTER n'existe pas en SQL standard.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment insérer une ligne dans une table SQL ?",
    correct_answer: "INSERT INTO table VALUES (...);",
    option1: "ADD INTO table VALUES (...);",
    option2: "INSERT INTO table VALUES (...);",
    option3: "PUT INTO table VALUES (...);",
    option4: "NEW INTO table VALUES (...);",
    explanation: "La commande INSERT INTO est utilisée en SQL pour ajouter de nouvelles lignes dans une table.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle commande permet de supprimer une table ?",
    correct_answer: "DROP TABLE table;",
    option1: "DELETE table;",
    option2: "DROP TABLE table;",
    option3: "REMOVE TABLE table;",
    option4: "CLEAR TABLE table;",
    explanation: "La commande DROP TABLE est utilisée en SQL pour supprimer complètement une table et toutes ses données. DELETE supprime des lignes, pas la table entière.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la clé primaire dans SQL ?",
    correct_answer: "Un identifiant unique pour chaque ligne",
    option1: "Une colonne qui stocke des données",
    option2: "Un identifiant unique pour chaque ligne",
    option3: "Une clé étrangère",
    option4: "Un index",
    explanation: "Une clé primaire est un identifiant unique pour chaque ligne d'une table. Elle ne peut pas contenir de valeurs NULL et doit être unique pour chaque enregistrement.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment déclare-t-on une variable en C ?",
    correct_answer: "int x = 10;",
    option1: "variable x = 10;",
    option2: "int x = 10;",
    option3: "x = 10;",
    option4: "int x; x == 10;",
    explanation: "En C, on déclare une variable en indiquant son type (ici, int pour un entier), suivi de son nom, puis éventuellement d'une initialisation avec l'opérateur =.",
    difficulty: "Intermediate"
  },
  {
    question: "Que signifie printf(\"%d\", 5); en C ?",
    correct_answer: "Affiche 5",
    option1: "Affiche 5",
    option2: "Affiche %d",
    option3: "Affiche Erreur",
    option4: "Affiche 0",
    explanation: "La fonction printf en C affiche du texte formaté. %d est un spécificateur de format pour les entiers décimaux, qui est remplacé par la valeur 5.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment allouer dynamiquement un tableau en C ?",
    correct_answer: "malloc()",
    option1: "malloc()",
    option2: "array_alloc()",
    option3: "alloc_array()",
    option4: "create_table()",
    explanation: "En C, la fonction malloc() de la bibliothèque stdlib.h est utilisée pour allouer de la mémoire dynamiquement. Par exemple: int* tab = (int*)malloc(5 * sizeof(int));",
    difficulty: "Intermediate"
  },
  {
    question: "Quel est le rôle de return dans une fonction C ?",
    correct_answer: "Les deux",
    option1: "Arrêter l'exécution de la fonction",
    option2: "Renvoyer une valeur",
    option3: "Les deux",
    option4: "Aucun",
    explanation: "L'instruction return en C a deux rôles: elle met fin à l'exécution de la fonction et renvoie une valeur à l'appelant (sauf si la fonction est de type void).",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle est la bonne syntaxe d'une boucle for en C ?",
    correct_answer: "for (int i = 0; i < 10; i++)",
    option1: "for (int i = 0; i < 10; i++)",
    option2: "for i in range(10):",
    option3: "foreach(i = 0; i < 10; i++)",
    option4: "for {i = 0; i < 10; i++}",
    explanation: "En C, une boucle for a trois parties: initialisation (int i = 0), condition (i < 10), et incrémentation (i++). La syntaxe for i in range(10) est utilisée en Python, et foreach n'existe pas en C standard.",
    difficulty: "Intermediate"
  },
  {
    question: "Quelle extension de fichier est utilisée pour les fichiers source C++ ?",
    correct_answer: ".cpp",
    option1: ".c",
    option2: ".cpp",
    option3: ".cxx",
    option4: ".java",
    explanation: "L'extension .cpp est généralement utilisée pour les fichiers source C++. Les extensions .c sont pour le C, .cxx est une alternative moins courante pour C++, et .java est pour Java.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment itérer à travers tous les caractères d'une chaîne en JavaScript ?",
    correct_answer: "for (let char of str)",
    option1: "for (let i = 0; i < str.length; i++)",
    option2: "for (let char of str)",
    option3: "str.forEach(char => {})",
    option4: "for (let char in str)",
    explanation: "En JavaScript moderne, la boucle for...of est la méthode la plus propre pour itérer sur les caractères d'une chaîne. La boucle for classique fonctionne aussi mais est plus verbeuse.",
    difficulty: "Intermediate"
  },
  {
    question: "Comment définir une méthode dans une classe en Python ?",
    correct_answer: "def methode(self, params):",
    option1: "define methode(self, params):",
    option2: "def methode(self, params):",
    option3: "function methode(this, params):",
    option4: "method methode(self, params) {",
    explanation: "En Python, on définit les méthodes de classe avec le mot-clé def, et le premier paramètre est conventionnellement nommé self, qui fait référence à l'instance de la classe.",
    difficulty: "Intermediate"
  },
  {
    question: "Quel est le résultat de l'expression SQL: SELECT COUNT(*) FROM utilisateurs WHERE age > 18;",
    correct_answer: "Le nombre d'utilisateurs de plus de 18 ans",
    option1: "La liste des utilisateurs de plus de 18 ans",
    option2: "Le nombre d'utilisateurs de plus de 18 ans",
    option3: "L'âge moyen des utilisateurs de plus de 18 ans",
    option4: "Une erreur de syntaxe",
    explanation: "La fonction SQL COUNT(*) compte le nombre de lignes qui correspondent à la condition. Cette requête renvoie donc le nombre d'utilisateurs dont l'âge est supérieur à 18.",
    difficulty: "Intermediate"
  },
  {
    question: "Qu'est-ce qu'un pointeur en programmation C ?",
    correct_answer: "Une variable qui contient l'adresse d'une autre variable",
    option1: "Une variable qui pointe vers NULL",
    option2: "Une variable qui contient l'adresse d'une autre variable",
    option3: "Un type de donnée qui ne peut pas être modifié",
    option4: "Une fonction qui retourne plusieurs valeurs",
    explanation: "Un pointeur en C est une variable qui stocke l'adresse mémoire d'une autre variable. On déclare un pointeur avec un astérisque : int* ptr;",
    difficulty: "Intermediate"
  }
];

// Insert the questions into the database
async function seedIntermediateQuizQuestions() {
  try {
    // Code to insert the questions into your database
    // This would typically use supabase or another database client
    
    /*
    Example with Supabase:
    
    import { supabase } from '@/integrations/supabase/client';
    
    const { data, error } = await supabase
      .from('coding_quiz')
      .insert(intermediateQuestions);
      
    if (error) {
      console.error('Error seeding questions:', error);
    } else {
      console.log('Successfully seeded questions:', data);
    }
    */
    
    console.log('Intermediate questions ready for seeding');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Export the questions for use in supabase seeding scripts
module.exports = {
  intermediateQuestions
};
