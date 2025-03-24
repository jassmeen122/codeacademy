
export function createPythonQuizzes(moduleIds: Record<string, string>) {
  const quizzes = [];

  // Introduction module quizzes
  if (moduleIds['Introduction à Python']) {
    quizzes.push(
      {
        module_id: moduleIds['Introduction à Python'],
        question: "Qui a créé le langage Python ?",
        correct_answer: "Guido van Rossum",
        option1: "Guido van Rossum",
        option2: "James Gosling",
        option3: "Bjarne Stroustrup",
        explanation: "Python a été créé par Guido van Rossum à la fin des années 1980."
      },
      {
        module_id: moduleIds['Introduction à Python'],
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
  if (moduleIds['Structures de contrôle']) {
    quizzes.push(
      {
        module_id: moduleIds['Structures de contrôle'],
        question: "Que fait cette boucle : for i in range(5): print(i) ?",
        correct_answer: "Affiche les nombres de 0 à 4",
        option1: "Affiche les nombres de 0 à 4",
        option2: "Affiche les nombres de 1 à 5",
        option3: "Génère une erreur",
        explanation: "range(5) génère une séquence de nombres de 0 à 4 (5 nombres au total)."
      },
      {
        module_id: moduleIds['Structures de contrôle'],
        question: "Quelle instruction permet de sortir immédiatement d'une boucle en Python ?",
        correct_answer: "break",
        option1: "break",
        option2: "exit",
        option3: "continue",
        explanation: "L'instruction break permet de sortir complètement d'une boucle."
      }
    );
  }

  return quizzes;
}
