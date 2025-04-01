
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

interface CPPExercise {
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

const cppExercises: CPPExercise[] = [
  {
    id: "cpp-1",
    title: "Smart Pointer Personnalisé",
    concept: "Gestion Mémoire",
    description: "Implémentez une version simplifiée de unique_ptr avec constructeur, destructeur, et opérateur flèche.",
    difficulty: "Advanced",
    starter_code: `template<typename T>
class UniquePtr {
    T* ptr;
public:
    // À implémenter :
    // 1. Constructeur explicite
    // 2. Destructeur
    // 3. Opérateur ->
    // 4. Interdire la copie
    // 5. Sémantique de déplacement (Bonus)
};`,
    solution: `template<typename T>
class UniquePtr {
    T* ptr;
public:
    explicit UniquePtr(T* p = nullptr) : ptr(p) {}  // 1. Constructeur

    ~UniquePtr() { delete ptr; }  // 2. Destructeur

    T* operator->() const { return ptr; }  // 3. Opérateur ->

    UniquePtr(const UniquePtr&) = delete;  // 4. Pas de copie
    UniquePtr& operator=(const UniquePtr&) = delete;

    // 5. Sémantique de déplacement (Bonus)
    UniquePtr(UniquePtr&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }
    UniquePtr& operator=(UniquePtr&& other) noexcept {
        if (this != &other) {
            delete ptr;
            ptr = other.ptr;
            other.ptr = nullptr;
        }
        return *this;
    }
};`,
    points: 30,
    hint: "Le RAII (Resource Acquisition Is Initialization) est le principe clé ici. Assurez-vous que le destructeur libère la mémoire allouée."
  },
  {
    id: "cpp-2",
    title: "CRTP pour le Pattern Flyweight",
    concept: "Meta-programmation",
    description: "Implémentez un système Flyweight utilisant CRTP (Curiously Recurring Template Pattern).",
    difficulty: "Advanced",
    starter_code: `template<typename Derived>
class Flyweight {
    static std::unordered_map<std::string, Derived*> cache;
public:
    static Derived* get(const std::string& key) {
        // À implémenter : retourne une instance partagée
    }
};

class Texture : public Flyweight<Texture> {
    std::string path;
    Texture(const std::string& p) : path(p) {}
public:
    friend class Flyweight<Texture>;
};`,
    solution: `template<typename Derived>
std::unordered_map<std::string, Derived*> Flyweight<Derived>::cache;

template<typename Derived>
Derived* Flyweight<Derived>::get(const std::string& key) {
    auto it = cache.find(key);
    if (it == cache.end()) {
        cache[key] = new Derived(key);
    }
    return cache[key];
}`,
    points: 40,
    hint: "Le CRTP permet à la classe de base d'accéder aux méthodes de la classe dérivée. Utilisez une carte statique pour stocker les instances déjà créées."
  },
  {
    id: "cpp-3",
    title: "Pool de Mémoire Lock-Free",
    concept: "Concurrence",
    description: "Implémentez un allocateur de mémoire thread-safe sans utiliser de mutex ou verrou.",
    difficulty: "Advanced",
    starter_code: `class LockFreePool {
    struct Block { std::atomic<Block*> next; };
    std::atomic<Block*> freeList;
public:
    void* allocate(size_t size);
    void deallocate(void* ptr);
};`,
    solution: `void* LockFreePool::allocate(size_t size) {
    Block* block = freeList.load(std::memory_order_acquire);
    while (block && !freeList.compare_exchange_weak(
               block, block->next, std::memory_order_release));
    return block;
}

void LockFreePool::deallocate(void* ptr) {
    Block* block = static_cast<Block*>(ptr);
    Block* oldHead = freeList.load(std::memory_order_relaxed);
    do {
        block->next = oldHead;
    } while (!freeList.compare_exchange_weak(
            oldHead, block, std::memory_order_release));
}`,
    points: 50,
    hint: "Utilisez les opérations atomiques (compare_exchange_weak) pour modifier la liste sans verrous. Assurez-vous de gérer correctement l'ordre mémoire."
  }
];

export const CPPExercises: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const activeExercise = cppExercises.find(ex => ex.id === activeExerciseId);

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = cppExercises.find(ex => ex.id === exerciseId);
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
    
    if (similarity > 0.6) {
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

  const exerciseProgress = (completedExercises.length / cppExercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exercices C++: Avancés</h2>
            <p className="text-gray-600">Maîtrisez la gestion mémoire, méta-programmation et concurrence</p>
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
            Ces exercices exigent une bonne maîtrise des fonctionnalités avancées de C++ comme les templates, RAII et programmation concurrente.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">Liste des exercices</h3>
            <div className="space-y-3">
              {cppExercises.map((exercise) => (
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
                      <FormattedMessage content={`\`\`\`cpp\n${activeExercise.solution}\n\`\`\``} />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Votre code:</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="h-[350px]">
                    <MonacoEditorWrapper
                      language="cpp"
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
