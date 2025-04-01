
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PythonExercise, pythonExercises } from "@/data/pythonExercises";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Lightbulb, Star, AlertCircle, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MonacoEditorWrapper } from "@/components/CodeEditor/MonacoEditorWrapper";
import { useCodeExecution } from "@/components/CodeEditor/useCodeExecution";
import { toast } from "sonner";

export const PythonExercises = () => {
  const [currentExercise, setCurrentExercise] = useState<PythonExercise | null>(null);
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<{ 
    passed: boolean;
    message: string;
    points: number;
    details: string[];
  } | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const { runCode, output, isRunning } = useCodeExecution();

  useEffect(() => {
    // Load first exercise by default
    if (pythonExercises.length > 0 && !currentExercise) {
      const exercise = pythonExercises[0];
      setCurrentExercise(exercise);
      setCode(exercise.starter_code);
    }
    
    // Try to load saved progress from localStorage
    const savedPoints = localStorage.getItem("python-exercise-points");
    const savedCompleted = localStorage.getItem("python-exercise-completed");
    
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }
    
    if (savedCompleted) {
      setCompletedExercises(JSON.parse(savedCompleted));
    }
  }, []);

  const selectExercise = (exercise: PythonExercise) => {
    setCurrentExercise(exercise);
    setCode(exercise.starter_code);
    setShowHint(false);
    setShowSolution(false);
    setTestResults(null);
  };

  const evaluateCode = async () => {
    if (!currentExercise) return;
    
    // Run code with Python interpreter
    await runCode(code, "python");
    
    // Give the output time to update
    setTimeout(() => {
      evaluateTestResults();
    }, 100);
  };
  
  const evaluateTestResults = () => {
    if (!currentExercise || !output) return;
    
    // Simple evaluation for demo purposes
    // In a real implementation, you would execute the code against test cases
    
    const passedTests: string[] = [];
    const failedTests: string[] = [];
    
    // We're going to simulate the test evaluation
    // In a real implementation, this would compare actual execution results
    let allPassed = true;
    
    if (output.includes("error") || output.includes("Error") || output.includes("undefined") || output.includes("TypeError")) {
      // There's an error in the code
      allPassed = false;
      failedTests.push("❌ Erreur dans votre code");
    } else {
      // Basic similarity check with the solution
      const similarity = calculateSimilarity(code, currentExercise.solution_code);
      
      // Add test results
      currentExercise.tests.forEach(test => {
        if (similarity > 0.5) {
          passedTests.push(`✅ ${test.input} → ${test.expected_output}`);
        } else {
          failedTests.push(`❌ ${test.input} → Attendu: ${test.expected_output}`);
          allPassed = false;
        }
      });
    }
    
    // Calculate points
    let earnedPoints = 0;
    const bonusDetails: string[] = [];
    
    if (allPassed) {
      earnedPoints = currentExercise.points.base;
      
      // Check for bonuses
      currentExercise.points.bonuses.forEach(bonus => {
        // Simple check based on code content - this is a simulation
        // In a real implementation, this would be more sophisticated
        if (evalCondition(bonus.condition, code)) {
          earnedPoints += bonus.points;
          bonusDetails.push(`+${bonus.points}pts: ${bonus.title}`);
        }
      });
      
      // Add to total and mark as completed
      if (!completedExercises.includes(currentExercise.id)) {
        setTotalPoints(prev => prev + earnedPoints);
        setCompletedExercises(prev => [...prev, currentExercise.id]);
        
        // Save progress to localStorage
        localStorage.setItem("python-exercise-points", (totalPoints + earnedPoints).toString());
        localStorage.setItem("python-exercise-completed", JSON.stringify([...completedExercises, currentExercise.id]));
      }
    }
    
    // Set test results
    setTestResults({
      passed: allPassed,
      message: allPassed ? "Bravo ! Solution correcte." : "Pas encore correct.",
      points: earnedPoints,
      details: [...passedTests, ...failedTests, ...bonusDetails]
    });
    
    if (allPassed) {
      toast.success(`Exercice réussi ! +${earnedPoints} points`);
    }
  };
  
  // Simple string similarity function for demo purposes
  const calculateSimilarity = (a: string, b: string): number => {
    // Remove comments, whitespace, and normalize
    const normalizeCode = (code: string) => {
      return code
        .replace(/#.*/g, "") // Remove comments
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
        .toLowerCase();
    };
    
    const normA = normalizeCode(a);
    const normB = normalizeCode(b);
    
    // Very simple comparison for demo
    if (normA.includes("return") && normB.includes("return")) {
      return 0.8; // Close enough for demo
    }
    
    return 0.2; // Not very similar
  };
  
  const evalCondition = (condition: string, userCode: string): boolean => {
    // This is a simplified evaluation for demo purposes
    // In a real system, this would be more secure and sophisticated
    try {
      const code = userCode.replace(/\n/g, "\\n"); // Escape newlines
      const conditionFn = new Function("code", `return ${condition};`);
      return conditionFn(code);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      return false;
    }
  };
  
  const renderDifficultyStars = (difficulty: string) => {
    const stars = {
      "Beginner": 1,
      "Intermediate": 2,
      "Advanced": 3,
      "Expert": 5
    }[difficulty] || 1;
    
    return Array(stars).fill(0).map((_, i) => (
      <Star key={i} className="h-4 w-4 inline-block text-yellow-500 fill-yellow-500" />
    ));
  };
  
  if (!currentExercise) {
    return <div>Chargement des exercices...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with total points */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Exercices Python</h2>
          <p className="text-sm text-gray-600">Résolvez ces exercices pour améliorer vos compétences Python</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{totalPoints} points</div>
          <div className="text-sm text-gray-600">{completedExercises.length}/{pythonExercises.length} exercices complétés</div>
        </div>
      </div>
      
      {/* Exercise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {pythonExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              currentExercise?.id === exercise.id ? 'border-blue-500 ring-2 ring-blue-200' : ''
            } ${completedExercises.includes(exercise.id) ? 'bg-green-50' : ''}`}
            onClick={() => selectExercise(exercise)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {exercise.title}
                </CardTitle>
                {completedExercises.includes(exercise.id) && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="mt-1">
                {renderDifficultyStars(exercise.difficulty)}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {exercise.description}
              </p>
              <Badge className="bg-blue-100 text-blue-800 border-none">
                {exercise.points.base} pts + bonus
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Current exercise */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {currentExercise.title}
              <span className="text-sm ml-2">
                {renderDifficultyStars(currentExercise.difficulty)}
              </span>
            </h2>
            <Badge className="mt-2 bg-blue-100 text-blue-800 border-none">
              Python
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHint ? "Cacher l'indice" : "Afficher l'indice"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showSolution ? "Cacher la solution" : "Voir la solution"}
            </Button>
          </div>
        </div>
        
        {/* Exercise description */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
          <h3 className="font-medium mb-2">Description:</h3>
          <p className="text-gray-700">{currentExercise.description}</p>
          
          {currentExercise.tests && currentExercise.tests.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Exemples:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {currentExercise.tests.map((test, idx) => (
                  <div key={idx}>
                    {test.input} → {test.expected_output}
                  </div>
                ))}
              </pre>
            </div>
          )}
          
          {showHint && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <Lightbulb className="h-4 w-4 text-yellow-800" />
              <AlertDescription className="text-yellow-800">
                <strong>Indice:</strong> {currentExercise.hints[0]}
              </AlertDescription>
            </Alert>
          )}
          
          {showSolution && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium text-sm mb-2">Solution:</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {currentExercise.solution_code}
              </pre>
              <p className="text-xs text-red-500 mt-2">
                Note: Afficher la solution désactive les points pour cet exercice.
              </p>
            </div>
          )}
        </div>
        
        {/* Code editor */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Votre solution:</h3>
            <Button
              onClick={evaluateCode}
              disabled={isRunning || showSolution}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exécution...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Vérifier la solution
                </>
              )}
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="h-[300px]">
              <MonacoEditorWrapper
                language="python"
                code={code}
                onChange={setCode}
              />
            </div>
          </div>
        </div>
        
        {/* Test results */}
        <Tabs defaultValue="output" className="mt-4">
          <TabsList>
            <TabsTrigger value="output">Résultats</TabsTrigger>
            <TabsTrigger value="points">Points & Progression</TabsTrigger>
          </TabsList>
          
          <TabsContent value="output">
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md min-h-[150px] max-h-[250px] overflow-auto font-mono text-sm">
              {testResults ? (
                <div>
                  <div className={`font-bold mb-2 ${testResults.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.passed ? '✅ ' : '❌ '} 
                    {testResults.message}
                    {testResults.passed && ` (${testResults.points} points)`}
                  </div>
                  
                  {testResults.details.map((detail, i) => (
                    <div key={i} className="mb-1">{detail}</div>
                  ))}
                </div>
              ) : output ? (
                <pre>{output}</pre>
              ) : (
                <p className="text-gray-400">Exécutez votre code pour voir les résultats...</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="points">
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium mb-3">Votre progression</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progression globale</span>
                    <span>{Math.round((completedExercises.length / pythonExercises.length) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(completedExercises.length / pythonExercises.length) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Points gagnés</h4>
                  <div className="text-3xl font-bold">{totalPoints} <span className="text-sm text-gray-500">/ {pythonExercises.reduce((acc, ex) => acc + ex.points.base + ex.points.bonuses.reduce((a, b) => a + b.points, 0), 0)}</span></div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-100 mt-4">
                  <AlertCircle className="h-4 w-4 text-blue-800" />
                  <AlertDescription className="text-blue-800">
                    Complétez tous les exercices pour gagner un badge Python!
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
