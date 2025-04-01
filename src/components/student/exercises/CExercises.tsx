
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

interface CExercise {
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

const cExercises: CExercise[] = [
  {
    id: "c-1",
    title: "Inversion de Liste Chaînée",
    concept: "Pointeurs",
    description: "Inverse une liste chaînée sur place sans mémoire supplémentaire.",
    difficulty: "Advanced",
    starter_code: `/**
 * Inverse une liste chaînée sur place
 * @param head Pointeur vers le premier nœud
 * @return Nouvelle tête de liste
 */
struct Node* reverse_list(struct Node* head) {
    // Votre code ici
}`,
    solution: `struct Node* reverse_list(struct Node* head) {
    struct Node *prev = NULL, *current = head, *next = NULL;
    while (current != NULL) {
        next = current->next;  // Sauvegarde le prochain
        current->next = prev;  // Inverse le lien
        prev = current;       // Avance prev
        current = next;       // Avance current
    }
    return prev;
}`,
    points: 20,
    hint: "Utilisez trois pointeurs pour garder trace de l'élément précédent, courant et suivant durant l'inversion."
  },
  {
    id: "c-2",
    title: "Allocateur Mémoire",
    concept: "Gestion mémoire",
    description: "Implémentez un allocateur mémoire simple avec alignement 8 bytes.",
    difficulty: "Advanced",
    starter_code: `#define POOL_SIZE 1024

char memory_pool[POOL_SIZE];

/**
 * Alloue 'size' octets alignés sur 8 bytes
 * @return Pointeur vers la mémoire ou NULL
 */
void* my_malloc(size_t size) {
    // Votre code ici
}`,
    solution: `static size_t offset = 0;

void* my_malloc(size_t size) {
    if (offset + size > POOL_SIZE) return NULL;
    
    void* ptr = &memory_pool[offset];
    offset += (size + 7) & ~7;  // Alignement 8 bytes
    return ptr;
}`,
    points: 25,
    hint: "L'alignement mémoire peut être géré en arrondissant à un multiple de 8 avec une opération de masquage binaire."
  },
  {
    id: "c-3",
    title: "Tri Bitonique",
    concept: "Optimisation",
    description: "Implémentez un tri bitonique efficace pour tableaux de taille 2^n.",
    difficulty: "Advanced",
    starter_code: `/**
 * Trie un tableau avec l'algo bitonique (parallélisable)
 * @param arr Tableau de 2^n éléments
 * @param dir 1=croissant, 0=décroissant
 */
void bitonic_sort(int* arr, size_t n, int dir) {
    // Votre code ici
}`,
    solution: `void bitonic_compare(int* arr, size_t start, size_t length, int dir) {
    size_t dist = length / 2;
    for (size_t i = start; i < start + dist; i++) {
        if ((arr[i] > arr[i + dist]) == dir) {
            int temp = arr[i];
            arr[i] = arr[i + dist];
            arr[i + dist] = temp;
        }
    }
}

void bitonic_merge(int* arr, size_t start, size_t length, int dir) {
    if (length > 1) {
        size_t dist = length / 2;
        bitonic_compare(arr, start, length, dir);
        bitonic_merge(arr, start, dist, dir);
        bitonic_merge(arr, start + dist, dist, dir);
    }
}

void bitonic_sort(int* arr, size_t n, int dir) {
    if (n <= 1) return;
    
    size_t dist = n / 2;
    bitonic_sort(arr, dist, !dir);
    bitonic_sort(arr + dist, dist, dir);
    bitonic_merge(arr, 0, n, dir);
}`,
    points: 30,
    hint: "Le tri bitonique divise récursivement le tableau en sections qui sont triées dans des directions opposées, puis les fusionne."
  }
];

export const CExercises: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const activeExercise = cExercises.find(ex => ex.id === activeExerciseId);

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = cExercises.find(ex => ex.id === exerciseId);
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

  const exerciseProgress = (completedExercises.length / cExercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exercices C: Bas Niveau</h2>
            <p className="text-gray-600">Maîtrisez les pointeurs, la gestion mémoire et les optimisations</p>
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
            Ces exercices avancés couvrent les pointeurs, la gestion mémoire manuelle et les optimisations bas niveau.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">Liste des exercices</h3>
            <div className="space-y-3">
              {cExercises.map((exercise) => (
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
                      <FormattedMessage content={`\`\`\`c\n${activeExercise.solution}\n\`\`\``} />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Votre code:</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="h-[350px]">
                    <MonacoEditorWrapper
                      language="c"
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
