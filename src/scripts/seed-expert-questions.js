
/**
 * Script to seed the coding_quiz table with expert-level questions
 * 
 * Run this script with:
 * npx node src/scripts/seed-expert-questions.js
 */

import { supabase } from '../integrations/supabase/client.js';

const expertQuestions = [
  // Python (Master Level)
  {
    question: "Quelle est la sortie du code suivant ? \n```python\ndef foo(bar, lst=[]):\n    lst.append(bar)\n    return lst\n\nprint(foo(1))\nprint(foo(2, []))\nprint(foo(3))```",
    correct_answer: "[1] [2] [1, 3]",
    option1: "[1] [2] [3]",
    option2: "[1] [2] [1, 3]",
    option3: "[1] [2] [1, 2, 3]",
    language: "Python",
    difficulty: "Advanced",
    explanation: "L'objet lst par défaut est partagé entre les appels de la fonction. Lors du premier appel, lst devient [1]. Le deuxième appel utilise un nouvel objet liste vide. Le troisième appel utilise la liste originale qui contient déjà [1]."
  },
  {
    question: "Que retourne cette expression ? \n```python\nprint((lambda x: (x, x+1, x+2))(*[3]))```",
    correct_answer: "(3, 4, 5)",
    option1: "(3, 4, 5)",
    option2: "(3, 4)",
    option3: "[3, 4, 5]",
    language: "Python",
    difficulty: "Advanced",
    explanation: "L'opérateur * décompresse la liste [3] en un argument unique passé à la lambda. La fonction retourne un tuple de 3 valeurs."
  },
  
  // Java (Master Level)
  {
    question: "Quelle est la sortie de ce code Java ? \n```java\nclass Test {\n    public static void main(String[] args) {\n        System.out.println(100 == 100);\n        System.out.println(200 == 200);\n        Integer a = 100, b = 100;\n        Integer x = 200, y = 200;\n        System.out.println(a == b);\n        System.out.println(x == y);\n    }\n}```",
    correct_answer: "true true true false",
    option1: "true true true true",
    option2: "true true true false",
    option3: "true false true false",
    language: "Java",
    difficulty: "Advanced",
    explanation: "Les objets Integer entre -128 et 127 sont mis en cache par la JVM, donc a et b référencent le même objet. Les valeurs au-delà de cette plage (x et y) sont des objets distincts, donc == compare leurs références, pas leurs valeurs."
  },
  {
    question: "Que fait le code suivant en Java ? \n```java\ntry {\n    System.exit(0);\n} finally {\n    System.out.println(\"Will this be printed?\");\n}```",
    correct_answer: "Ne fait rien",
    option1: "Affiche \"Will this be printed?\"",
    option2: "Ne fait rien",
    option3: "finally est exécuté avant la sortie",
    language: "Java",
    difficulty: "Advanced",
    explanation: "System.exit(0) arrête immédiatement la JVM sans exécuter le bloc finally. C'est l'une des rares exceptions où un bloc finally n'est pas exécuté."
  },
  
  // JavaScript (Master Level)
  {
    question: "Que retourne ce code en JavaScript ? \n```javascript\nconsole.log(+\"3\" - -\"2\" + \"1\");```",
    correct_answer: "\"51\"",
    option1: "\"51\"",
    option2: "\"31\"",
    option3: "6",
    language: "JavaScript",
    difficulty: "Advanced",
    explanation: "Le + devant \"3\" le convertit en nombre 3. Le - devant -\"2\" le convertit en nombre 2. 3 - (-2) = 5. Puis 5 + \"1\" est une concaténation qui donne \"51\"."
  },
  {
    question: "Que fait ce code en JavaScript ? \n```javascript\nlet a = {};\nlet b = { key: \"b\" };\nlet c = { key: \"c\" };\n\na[b] = 123;\na[c] = 456;\nconsole.log(a[b]);```",
    correct_answer: "456",
    option1: "123",
    option2: "456",
    option3: "undefined",
    language: "JavaScript",
    difficulty: "Advanced",
    explanation: "Quand on utilise un objet comme clé, JavaScript le convertit en string en appelant sa méthode toString(). Pour les objets, cela donne \"[object Object]\". Les deux objets b et c sont donc convertis en la même clé \"[object Object]\", donc a[c] écrase a[b]."
  },
  
  // SQL (Master Level)
  {
    question: "Que fait cette requête SQL ? \n```sql\nSELECT COUNT(*) FROM students WHERE age = (SELECT MAX(age) FROM students);```",
    correct_answer: "Retourne le nombre d'étudiants avec l'âge maximal",
    option1: "Retourne l'âge maximum des étudiants",
    option2: "Retourne le nombre d'étudiants avec l'âge maximal",
    option3: "Retourne NULL",
    language: "SQL",
    difficulty: "Advanced",
    explanation: "La requête compte le nombre d'étudiants dont l'âge est égal à l'âge maximal. Si plusieurs étudiants ont le même âge maximal, ils seront tous comptés."
  },
  {
    question: "Quelle est la sortie de cette requête en SQL ? \n```sql\nSELECT COALESCE(NULL, NULL, 5, NULL);```",
    correct_answer: "5",
    option1: "NULL",
    option2: "5",
    option3: "0",
    language: "SQL",
    difficulty: "Advanced",
    explanation: "La fonction COALESCE retourne la première valeur non NULL dans la liste d'arguments. Ici, la première valeur non NULL est 5."
  },
  
  // C (Master Level)
  {
    question: "Quelle est la sortie de ce code en C ? \n```c\n#include <stdio.h>\n#define A 1+2\nint main() {\n    int x = A * A;\n    printf(\"%d\\n\", x);\n}```",
    correct_answer: "7",
    option1: "9",
    option2: "1",
    option3: "7",
    language: "C",
    difficulty: "Advanced",
    explanation: "La macro A est remplacée textuellement par 1+2. L'expression devient donc 1+2*1+2, qui est évaluée comme 1+(2*1)+2 = 7 selon les règles de priorité des opérateurs."
  },
  {
    question: "Que fait ce code en C ? \n```c\nint main() {\n    int arr[3] = {1, 2, 3};\n    printf(\"%d\", 2[arr]);\n}```",
    correct_answer: "3",
    option1: "Erreur",
    option2: "2",
    option3: "3",
    language: "C",
    difficulty: "Advanced",
    explanation: "En C, arr[i] est équivalent à *(arr + i), qui est également équivalent à *(i + arr), qui peut s'écrire i[arr]. Donc 2[arr] est le troisième élément (indice 2) du tableau, qui est 3."
  },
  
  // C++ (Master Level)
  {
    question: "Quelle est la sortie du code suivant en C++ ? \n```cpp\n#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void show() = 0;\n};\n\nclass Derived : public Base {};\n\nint main() {\n    Derived d;\n    return 0;\n}```",
    correct_answer: "Erreur de compilation",
    option1: "Compile avec succès",
    option2: "Erreur de compilation",
    option3: "Segmentation fault",
    language: "C++",
    difficulty: "Advanced",
    explanation: "Derived hérite de Base qui a une méthode virtuelle pure (show). Comme Derived ne surcharge pas cette méthode, elle reste une classe abstraite et ne peut pas être instanciée."
  },
  {
    question: "Quelle est la sortie du code suivant en C++ ? \n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 10;\n    auto lambda = [=]() mutable { x = 20; };\n    lambda();\n    cout << x;\n}```",
    correct_answer: "10",
    option1: "20",
    option2: "10",
    option3: "Erreur",
    language: "C++",
    difficulty: "Advanced",
    explanation: "Avec la capture [=], la lambda capture une copie de x. Le mot-clé 'mutable' permet de modifier cette copie dans la lambda, mais cela n'affecte pas la variable x originale, qui reste à 10."
  },
  
  // PHP (Master Level)
  {
    question: "Quelle est la sortie de ce code PHP ? \n```php\n$a = '1';\n$a[$a] = '2';\necho $a;```",
    correct_answer: "1",
    option1: "12",
    option2: "1",
    option3: "Erreur",
    language: "PHP",
    difficulty: "Advanced",
    explanation: "En PHP, lorsqu'on essaie de modifier un caractère dans une chaîne à un index qui dépasse sa longueur, l'opération est ignorée. Ici, $a[1] n'existe pas donc l'affectation n'a aucun effet."
  },
  {
    question: "Que fait le code suivant en PHP ? \n```php\nfunction &foo() {\n    static $x = 0;\n    return $x;\n}\n\n$y = foo();\n$y = 5;\necho foo();```",
    correct_answer: "0",
    option1: "0",
    option2: "5",
    option3: "Erreur",
    language: "PHP",
    difficulty: "Advanced",
    explanation: "Bien que foo() retourne une référence (&), l'affectation $y = foo() ne capture pas cette référence. Il faudrait écrire $y = &foo() pour que $y soit une référence à $x. Sans cela, $y reçoit simplement la valeur 0, puis est réaffecté à 5, sans effet sur $x qui reste à 0."
  }
];

const seedExpertQuestions = async () => {
  console.log('Seeding expert-level coding quiz questions...');
  
  try {
    const { data: existingQuestions, error: fetchError } = await supabase
      .from('coding_quiz')
      .select('question')
      .eq('difficulty', 'Advanced');
    
    if (fetchError) {
      console.error('Error fetching existing questions:', fetchError);
      return;
    }
    
    const existingQuestionTexts = existingQuestions.map(q => q.question);
    const questionsToInsert = expertQuestions.filter(
      question => !existingQuestionTexts.includes(question.question)
    );
    
    if (questionsToInsert.length === 0) {
      console.log('All expert questions already exist in the database.');
      return;
    }
    
    const { error: insertError } = await supabase
      .from('coding_quiz')
      .insert(questionsToInsert);
    
    if (insertError) {
      console.error('Error inserting expert questions:', insertError);
      return;
    }
    
    console.log(`Successfully added ${questionsToInsert.length} expert-level quiz questions.`);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Run the seeding function
seedExpertQuestions();
