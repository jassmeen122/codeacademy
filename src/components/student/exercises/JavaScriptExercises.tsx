
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MonacoEditorWrapper } from "@/components/CodeEditor/MonacoEditorWrapper";
import { toast } from 'sonner';
import { FormattedMessage } from '@/components/ai-assistant/FormattedMessage';

interface JavaScriptExercise {
  id: string;
  title: string;
  concept: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  starter_code: string;
  solution: string;
  points: number;
  hint?: string;
  test_cases?: string[];
  expected_output?: string;
}

const jsExercises: JavaScriptExercise[] = [
  {
    id: "js-1",
    title: "Fonction Fléchée",
    concept: "ES6+",
    description: "Convertir cette fonction en arrow function.",
    difficulty: "Beginner",
    starter_code: `// Convertir cette fonction en arrow function
function somme(a, b) {
    return a + b;
}`,
    solution: `const somme = (a, b) => a + b;`,
    points: 12,
    hint: "Les fonctions fléchées permettent d'utiliser un return implicite pour les expressions simples."
  },
  {
    id: "js-2",
    title: "Manipulation de Tableaux",
    concept: "Méthodes d'Array",
    description: "Utiliser map() pour doubler chaque valeur du tableau.",
    difficulty: "Beginner",
    starter_code: `// Utiliser map() pour doubler chaque valeur
const nombres = [1, 2, 3];
const doubles = /* Votre code ici */;`,
    solution: `const doubles = nombres.map(n => n * 2);`,
    points: 12,
    hint: "La méthode map() crée un nouveau tableau avec les résultats de l'appel d'une fonction fournie sur chaque élément du tableau appelant."
  },
  {
    id: "js-3",
    title: "Destructuration",
    concept: "ES6+",
    description: "Extraire 'nom' et 'age' avec la destructuration.",
    difficulty: "Beginner",
    starter_code: `// Extraire 'nom' et 'age' avec la destructuration
const utilisateur = { nom: "Alice", age: 25, ville: "Paris" };
const { /* Votre code */ } = utilisateur;`,
    solution: `const { nom, age } = utilisateur;`,
    points: 13,
    hint: "La syntaxe de destructuration permet d'extraire plusieurs propriétés d'un objet en une seule ligne."
  },
  {
    id: "js-4",
    title: "Promesses",
    concept: "Asynchrone",
    description: "Créer une promesse qui se résout après 1 seconde.",
    difficulty: "Intermediate",
    starter_code: `// Créer une promesse qui se résout après 1 seconde
const delay = /* Votre code */;`,
    solution: `const delay = new Promise(res => setTimeout(res, 1000));`,
    points: 15,
    hint: "Utilisez le constructeur Promise avec une fonction qui appelle setTimeout."
  },
  {
    id: "js-5",
    title: "Classes ES6",
    concept: "ES6+",
    description: "Complétez la classe Rectangle en ajoutant la méthode aire() qui retourne largeur * hauteur.",
    difficulty: "Intermediate",
    starter_code: `// Complétez la classe Rectangle (aire = largeur * hauteur)
class Rectangle {
    constructor(largeur, hauteur) {
        this.largeur = largeur;
        this.hauteur = hauteur;
    }
    
    // Ajoutez la méthode aire()
}`,
    solution: `class Rectangle {
    constructor(largeur, hauteur) {
        this.largeur = largeur;
        this.hauteur = hauteur;
    }
    
    aire() {
        return this.largeur * this.hauteur;
    }
}`,
    points: 12,
    hint: "Les méthodes dans les classes ES6 s'écrivent sous forme de fonctions sans le mot-clé 'function'."
  },
  {
    id: "js-6",
    title: "Fetch API",
    concept: "Asynchrone",
    description: "Récupérer des données depuis une API en utilisant fetch et await.",
    difficulty: "Advanced",
    starter_code: `// Récupérer des données depuis une API (fake)
async function getPosts() {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    // Utilisez fetch + await ici
}`,
    solution: `async function getPosts() {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const response = await fetch(url);
    return await response.json();
}`,
    points: 18,
    hint: "Utilisez 'await' pour attendre la réponse du fetch, puis un second 'await' pour extraire les données JSON."
  }
];

export const JavaScriptExercises: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const activeExercise = jsExercises.find(ex => ex.id === activeExerciseId);

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = jsExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setActiveExerciseId(exerciseId);
      setUserCode(exercise.starter_code);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const handleCodeChange = (code: string | undefined) => {
    if (code !== undefined) {
      setUserCode(code);
    }
  };

  const handleSubmit = () => {
    if (!activeExercise) return;

    // Simple code comparison (in a real app, this would be a more sophisticated evaluation)
    const normalizedUserCode = userCode.replace(/\s+/g, " ").trim();
    const normalizedSolution = activeExercise.solution.replace(/\s+/g, " ").trim();
    
    const similarity = calculateSimilarity(normalizedUserCode, normalizedSolution);
    
    if (similarity > 0.7) {
      // Code is similar enough to be considered correct
      if (!completedExercises.includes(activeExercise.id)) {
        setCompletedExercises([...completedExercises, activeExercise.id]);
        setUserPoints(userPoints + activeExercise.points);
        toast.success(`🎉 Bravo ! +${activeExercise.points} points !`);
      } else {
        toast.success("Exercice déjà complété !");
      }
    } else {
      toast.error("Votre solution n'est pas correcte. Essayez encore !");
    }
  };

  // Simple string similarity calculation
  const calculateSimilarity = (a: string, b: string): number => {
    if (a === b) return 1.0;
    if (a.length === 0 || b.length === 0) return 0.0;
    
    // This is a very simplified version - in a real app use a proper algorithm
    const commonChars = a.split('').filter(char => b.includes(char)).length;
    return commonChars / Math.max(a.length, b.length);
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exerciseProgress = (completedExercises.length / jsExercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exercices JavaScript: ES6+</h2>
            <p className="text-gray-600">Maîtrisez les fonctionnalités modernes de JavaScript</p>
          </div>
          <div>
            <Badge className="text-lg px-3 py-1 bg-blue-500">
              {userPoints} points
            </Badge>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Progression</h3>
          <div className="flex items-center gap-3">
            <Progress value={exerciseProgress} className="h-2 flex-grow" />
            <span className="text-sm font-medium">{Math.round(exerciseProgress)}%</span>
          </div>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Ces exercices couvrent les concepts modernes de JavaScript: fonctions fléchées, destructuration, promesses, classes ES6, etc.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">Liste des exercices</h3>
            <div className="space-y-3">
              {jsExercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className={`p-3 rounded-md cursor-pointer border transition-all ${
                    activeExerciseId === exercise.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectExercise(exercise.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exercise.title}</h4>
                      <p className="text-sm text-gray-600">{exercise.concept}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyBadgeClass(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      {completedExercises.includes(exercise.id) && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {activeExercise ? (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold">{activeExercise.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getDifficultyBadgeClass(activeExercise.difficulty)}>
                    {activeExercise.difficulty}
                  </Badge>
                  <Badge variant="outline">{activeExercise.concept}</Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {activeExercise.points} points
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-gray-700 mb-4">{activeExercise.description}</p>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHint(!showHint)}
                    className="text-sm"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHint ? "Cacher l'indice" : "Afficher l'indice"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-sm"
                  >
                    {showSolution ? "Cacher la solution" : "Voir la solution"}
                  </Button>
                </div>
                
                {showHint && activeExercise.hint && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Indice:</strong> {activeExercise.hint}
                    </p>
                  </div>
                )}
                
                {showSolution && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="font-medium text-sm mb-2">Solution:</p>
                    <div className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      <FormattedMessage content={`\`\`\`javascript\n${activeExercise.solution}\n\`\`\``} />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Votre code:</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="h-[350px]">
                    <MonacoEditorWrapper
                      language="javascript"
                      code={userCode}
                      onChange={handleCodeChange}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSubmit}>
                    Soumettre
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-600 mb-2">Sélectionnez un exercice</h3>
                <p className="text-gray-500">Choisissez un exercice dans la liste de gauche pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
