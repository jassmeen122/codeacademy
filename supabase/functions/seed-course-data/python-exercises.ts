
export function createPythonExercises(moduleIds: Record<string, string>) {
  const exercises = [];

  // Introduction module exercises
  if (moduleIds['Introduction à Python']) {
    exercises.push({
      module_id: moduleIds['Introduction à Python'],
      title: "Premier programme Python",
      description: "Écrivez un programme qui affiche le message 'Bonjour, Python !'",
      starter_code: "# Écrivez votre code ici\n",
      expected_output: "Bonjour, Python !",
      difficulty: "Beginner",
      hints: ["Utilisez la fonction print() pour afficher du texte"]
    });
  }

  // Structures de contrôle module exercises
  if (moduleIds['Structures de contrôle']) {
    exercises.push({
      module_id: moduleIds['Structures de contrôle'],
      title: "Nombres pairs",
      description: "Écrivez un programme qui affiche tous les nombres pairs de 0 à 10 (inclus) en utilisant une boucle for et la condition if.",
      starter_code: "# Utilisez une boucle for avec range\nfor i in range(11):\n    # Vérifiez si i est pair\n    # ...\n",
      expected_output: "0\n2\n4\n6\n8\n10",
      difficulty: "Beginner",
      hints: ["Un nombre est pair s'il est divisible par 2 (i % 2 == 0)"]
    });
  }

  return exercises;
}
