import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProgrammingLanguage, defaultCode } from "@/components/CodeEditor/types";
import { useCodeExecution } from "@/components/CodeEditor/useCodeExecution";
import { PythonExercises } from "@/components/student/exercises/PythonExercises";
import { JavaExercises } from "@/components/student/exercises/JavaExercises";
import { JavaScriptExercises } from "@/components/student/exercises/JavaScriptExercises";
import { CExercises } from "@/components/student/exercises/CExercises";
import { CPPExercises } from "@/components/student/exercises/CPPExercises";
import { PHPExercises } from "@/components/student/exercises/PHPExercises";
import { SQLExercises } from "@/components/student/exercises/SQLExercises";
import { ExercisesHeader } from "@/components/student/exercises/ExercisesHeader";
import { ExerciseFilters } from "@/components/student/exercises/ExerciseFilters";
import { ExercisesList } from "@/components/student/exercises/ExercisesList";
import { ExerciseDetail } from "@/components/student/exercises/ExerciseDetail";
import { EmptyExerciseState } from "@/components/student/exercises/EmptyExerciseState";
import { LoadingState } from "@/components/student/exercises/LoadingState";
import { ExerciseUI } from "@/types/exerciseUI";

const difficulties = {
  "Beginner": { stars: 1, className: "bg-green-100 text-green-800" },
  "Intermediate": { stars: 2, className: "bg-yellow-100 text-yellow-800" },
  "Advanced": { stars: 3, className: "bg-orange-100 text-orange-800" },
  "Expert": { stars: 5, className: "bg-red-100 text-red-800" }
};

const themes = [
  "Algorithmes", "Structures de données", "POO", "SQL", "Fonctions", "Récursivité", 
  "Tris", "Recherche", "Expressions régulières"
];

const ExercisesPage = () => {
  const [exercises, setExercises] = useState<ExerciseUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [activeExercise, setActiveExercise] = useState<ExerciseUI | null>(null);
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedLanguageToPractice, setSelectedLanguageToPractice] = useState<ProgrammingLanguage>("javascript");
  const [activeTabSection, setActiveTabSection] = useState<"all" | "python" | "java" | "javascript" | "c" | "cpp" | "php" | "sql">("all");
  
  const { 
    output, 
    analysis, 
    isRunning, 
    isAnalyzing, 
    activeTab: editorActiveTab, 
    setActiveTab: setEditorActiveTab, 
    runCode, 
    getAIHelp 
  } = useCodeExecution();

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (activeExercise) {
      setCode(defaultCode[selectedLanguageToPractice]);
    }
  }, [activeExercise, selectedLanguageToPractice]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrichedData: ExerciseUI[] = data.map((exercise, index) => ({
        id: exercise.id,
        title: exercise.title,
        description: exercise.description || '',
        difficulty: exercise.difficulty || 'Beginner',
        type: exercise.type || 'coding',
        status: ["completed", "in_progress", "not_started"][index % 3] as "completed" | "in_progress" | "not_started",
        language: ["javascript", "python", "java", "c", "cpp"][index % 5] as ProgrammingLanguage,
        theme: themes[index % themes.length],
        tests: [
          { input: index % 2 === 0 ? "[3,1,2]" : "\"hello\"", output: index % 2 === 0 ? "[1,2,3]" : "\"olleh\"" },
          { input: "[]", output: "[]" }
        ]
      }));

      setExercises(enrichedData);
    } catch (error: any) {
      toast.error("Échec du chargement des exercices");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = () => {
    runCode(code, selectedLanguageToPractice);
  };

  const handleGetAIFeedback = () => {
    getAIHelp(code, selectedLanguageToPractice, "Analyse ce code et donne des suggestions d'amélioration.");
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === "all" || exercise.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    const matchesTheme = selectedTheme === "all" || exercise.theme === selectedTheme;
    
    return matchesSearch && matchesLanguage && matchesDifficulty && matchesTheme;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4">
          <ExercisesHeader totalProgress={35} />

          <Tabs 
            defaultValue="all" 
            value={activeTabSection} 
            onValueChange={(value) => setActiveTabSection(value as "all" | "python" | "java" | "javascript" | "c" | "cpp" | "php" | "sql")}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">Tous les exercices</TabsTrigger>
              <TabsTrigger value="python">Exercices Python</TabsTrigger>
              <TabsTrigger value="java">Exercices Java</TabsTrigger>
              <TabsTrigger value="javascript">Exercices JavaScript</TabsTrigger>
              <TabsTrigger value="c">Exercices C</TabsTrigger>
              <TabsTrigger value="cpp">Exercices C++</TabsTrigger>
              <TabsTrigger value="php">Exercices PHP</TabsTrigger>
              <TabsTrigger value="sql">Exercices SQL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {!activeExercise && (
                <ExerciseFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  selectedDifficulty={selectedDifficulty}
                  setSelectedDifficulty={setSelectedDifficulty}
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                  themes={themes}
                  exerciseProgress={35}
                />
              )}

              {loading ? (
                <LoadingState />
              ) : (
                activeExercise ? (
                  <ExerciseDetail 
                    exercise={activeExercise}
                    onBack={() => setActiveExercise(null)}
                    code={code}
                    setCode={setCode}
                    selectedLanguage={selectedLanguageToPractice}
                    setSelectedLanguage={setSelectedLanguageToPractice}
                    runCode={handleRunCode}
                    isRunning={isRunning}
                    output={output}
                    analysis={analysis}
                    editorActiveTab={editorActiveTab}
                    setEditorActiveTab={setEditorActiveTab}
                    handleGetAIFeedback={handleGetAIFeedback}
                    isAnalyzing={isAnalyzing}
                    showHint={showHint}
                    setShowHint={setShowHint}
                    showSolution={showSolution}
                    setShowSolution={setShowSolution}
                    difficulties={difficulties}
                  />
                ) : (
                  <ExercisesList 
                    exercises={filteredExercises}
                    activeExercise={activeExercise}
                    onSelectExercise={setActiveExercise}
                    difficulties={difficulties}
                  />
                )
              )}
            </TabsContent>
            
            <TabsContent value="python">
              <PythonExercises />
            </TabsContent>
            
            <TabsContent value="java">
              <JavaExercises />
            </TabsContent>
            
            <TabsContent value="javascript">
              <JavaScriptExercises />
            </TabsContent>

            <TabsContent value="c">
              <CExercises />
            </TabsContent>

            <TabsContent value="cpp">
              <CPPExercises />
            </TabsContent>

            <TabsContent value="php">
              <PHPExercises />
            </TabsContent>

            <TabsContent value="sql">
              <SQLExercises />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExercisesPage;
