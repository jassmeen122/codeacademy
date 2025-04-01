
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

interface JavaExercise {
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

const javaExercises: JavaExercise[] = [
  {
    id: "java-1",
    title: "Création de Classe Basique",
    concept: "Encapsulation",
    description: "Créez une classe Animal avec les attributs nom (String) et age (int), ainsi qu'un constructeur pour les initialiser.",
    difficulty: "Beginner",
    starter_code: `public class Animal {
    // Exercice : Ajoutez les attributs 'nom' (String) et 'age' (int)
    // + un constructeur pour les initialiser
}`,
    solution: `public class Animal {
    private String nom;
    private int age;

    public Animal(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
}`,
    points: 12,
    hint: "N'oubliez pas d'utiliser le principe d'encapsulation en déclarant vos attributs comme privés."
  },
  {
    id: "java-2",
    title: "Héritage Simple",
    concept: "Héritage",
    description: "Créez une classe Chien qui hérite de la classe Animal et ajoute un attribut race, ainsi qu'un constructeur utilisant super().",
    difficulty: "Beginner",
    starter_code: `public class Chien extends Animal {
    // Exercice : Ajoutez l'attribut 'race' 
    // + constructeur utilisant super()
}`,
    solution: `public class Chien extends Animal {
    private String race;

    public Chien(String nom, int age, String race) {
        super(nom, age);
        this.race = race;
    }
}`,
    points: 15,
    hint: "Utilisez le mot-clé super() pour appeler le constructeur de la classe parente."
  },
  {
    id: "java-3",
    title: "Polymorphisme",
    concept: "Polymorphisme",
    description: "Implémentez la classe Cercle qui hérite de la classe abstraite Forme et qui calcule l'aire d'un cercle.",
    difficulty: "Intermediate",
    starter_code: `public abstract class Forme {
    public abstract double calculerAire();
}

// Exercice : Implémentez la classe Cercle`,
    solution: `public class Cercle extends Forme {
    private double rayon;

    public Cercle(double r) { 
        this.rayon = r; 
    }

    @Override
    public double calculerAire() {
        return Math.PI * rayon * rayon;
    }
}`,
    points: 15,
    hint: "N'oubliez pas d'utiliser l'annotation @Override et la formule π × r²."
  },
  {
    id: "java-4",
    title: "Encapsulation",
    concept: "Encapsulation",
    description: "Complétez la classe CompteBancaire en ajoutant les méthodes getSolde() et déposer(double montant) qui vérifie que le montant est positif.",
    difficulty: "Beginner",
    starter_code: `public class CompteBancaire {
    private double solde;

    // Exercice : Créez getSolde() + déposer(double montant)
}`,
    solution: `public class CompteBancaire {
    private double solde;

    public void deposer(double montant) {
        if (montant > 0) {
            this.solde += montant;
        }
    }

    public double getSolde() {
        return this.solde;
    }
}`,
    points: 15,
    hint: "N'oubliez pas de vérifier que le montant est positif avant de l'ajouter au solde."
  },
  {
    id: "java-5",
    title: "Interface",
    concept: "Interfaces",
    description: "Implémentez la classe Avion qui implémente l'interface Volant.",
    difficulty: "Intermediate",
    starter_code: `public interface Volant {
    void decoller();
}

// Exercice : Implémentez Volant dans Avion`,
    solution: `public class Avion implements Volant {
    @Override
    public void decoller() {
        System.out.println("L'avion décolle !");
    }
}`,
    points: 10,
    hint: "Utilisez le mot-clé implements pour implémenter une interface et n'oubliez pas d'implémenter toutes ses méthodes."
  },
  {
    id: "java-6",
    title: "Composition",
    concept: "Composition",
    description: "Créez une classe Voiture qui contient un Moteur. Le Moteur doit être créé dans le constructeur de la Voiture.",
    difficulty: "Advanced",
    starter_code: `public class Moteur {
    private String type;

    public Moteur(String type) {
        this.type = type;
    }
}

// Exercice : Créez une classe Voiture contenant un Moteur`,
    solution: `public class Voiture {
    private Moteur moteur;

    public Voiture(String typeMoteur) {
        this.moteur = new Moteur(typeMoteur);
    }
}`,
    points: 18,
    hint: "La composition est une relation 'a un'. Une Voiture 'a un' Moteur."
  }
];

export const JavaExercises: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const activeExercise = javaExercises.find(ex => ex.id === activeExerciseId);

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = javaExercises.find(ex => ex.id === exerciseId);
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

  const exerciseProgress = (completedExercises.length / javaExercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exercices Java: Concepts POO</h2>
            <p className="text-gray-600">Maîtrisez les concepts de la Programmation Orientée Objet en Java</p>
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
            Ces exercices couvrent les concepts fondamentaux de la POO: Encapsulation, Héritage, Polymorphisme, Interfaces et Composition.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">Liste des exercices</h3>
            <div className="space-y-3">
              {javaExercises.map((exercise) => (
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
                      <FormattedMessage content={`\`\`\`java\n${activeExercise.solution}\n\`\`\``} />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Votre code:</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="h-[350px]">
                    <MonacoEditorWrapper
                      language="java"
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
