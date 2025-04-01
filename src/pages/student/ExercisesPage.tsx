import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, CheckCircle, Circle, Code, Search, Filter, Star, Play, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCodeExecution } from "@/components/CodeEditor/useCodeExecution";
import { MonacoEditorWrapper } from "@/components/CodeEditor/MonacoEditorWrapper";
import { ProgrammingLanguage, defaultCode } from "@/components/CodeEditor/types";
import { LanguageSelector } from "@/components/CodeEditor/LanguageSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PythonExercises } from "@/components/student/exercises/PythonExercises";
import { JavaExercises } from "@/components/student/exercises/JavaExercises";
import { JavaScriptExercises } from "@/components/student/exercises/JavaScriptExercises";
import { CExercises } from "@/components/student/exercises/CExercises";
import { CPPExercises } from "@/components/student/exercises/CPPExercises";

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  type: "mcq" | "open_ended" | "coding" | "file_upload";
  status: "completed" | "in_progress" | "not_started";
  language?: ProgrammingLanguage;
  theme?: string;
  tests?: { input: string; output: string }[];
}

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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedLanguageToPractice, setSelectedLanguageToPractice] = useState<ProgrammingLanguage>("javascript");
  const [activeTabSection, setActiveTabSection] = useState<"all" | "python" | "java" | "javascript" | "c" | "cpp">("all");
  const navigate = useNavigate();
  
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

      const enrichedData = data.map((exercise, index) => ({
        ...exercise,
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

  const getStatusIcon = (status: Exercise["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Circle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
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

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 inline-block text-yellow-500 fill-yellow-500" />);
  };

  const renderExercisesList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExercises.map((exercise) => (
        <Card 
          key={exercise.id} 
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeExercise?.id === exercise.id ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
          onClick={() => setActiveExercise(exercise)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {exercise.title}
            </CardTitle>
            {getStatusIcon(exercise.status)}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {exercise.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficulties[exercise.difficulty].className}`}>
                  {renderStars(difficulties[exercise.difficulty].stars)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {exercise.language}
                </Badge>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-none">{exercise.theme}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderExerciseDetail = () => {
    if (!activeExercise) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{activeExercise.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficulties[activeExercise.difficulty].className}`}>
                {renderStars(difficulties[activeExercise.difficulty].stars)}
              </span>
              <Badge variant="outline" className="text-sm">
                {activeExercise.language}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-none">{activeExercise.theme}</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => setActiveExercise(null)}>Retour à la liste</Button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-medium mb-2">Description:</h3>
          <p className="text-gray-700">{activeExercise.description}</p>
          
          {activeExercise.tests && activeExercise.tests.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Exemples:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {activeExercise.tests.map((test, idx) => (
                  <div key={idx}>
                    Input: {test.input} → Output: {test.output}
                  </div>
                ))}
              </pre>
            </div>
          )}
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHint(!showHint)}
              className="text-sm"
            >
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
          
          {showHint && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Indice:</strong> Pensez à utiliser une boucle pour parcourir la chaîne de caractères et une approche pour inverser l'ordre des éléments.
              </p>
            </div>
          )}
          
          {showSolution && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium text-sm mb-2">Solution:</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`// Solution en JavaScript
function solution(str) {
  return str.split('').reverse().join('');
}

// Solution en Python
def solution(s):
  return s[::-1]`}
              </pre>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Votre solution:</h3>
            <div className="flex items-center gap-2">
              <LanguageSelector 
                language={selectedLanguageToPractice} 
                onChange={setSelectedLanguageToPractice} 
              />
              <Button 
                onClick={handleRunCode} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exécution...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Exécuter
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="h-[300px]">
              <MonacoEditorWrapper 
                language={selectedLanguageToPractice}
                code={code}
                onChange={setCode}
              />
            </div>
          </div>
          
          <Tabs 
            defaultValue="output" 
            className="mt-4"
            value={editorActiveTab}
            onValueChange={(value) => setEditorActiveTab(value as "output" | "analysis")}
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="output">Résultats</TabsTrigger>
                <TabsTrigger value="analysis">Feedback IA</TabsTrigger>
              </TabsList>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGetAIFeedback}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyse en cours..." : "Obtenir une analyse IA"}
              </Button>
            </div>
            
            <TabsContent value="output">
              <div className="bg-gray-900 text-gray-100 p-3 rounded-md h-[150px] overflow-auto font-mono text-sm">
                {output ? (
                  <pre>{output}</pre>
                ) : (
                  <p className="text-gray-400">Exécutez votre code pour voir les résultats...</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="bg-gray-900 text-gray-100 p-3 rounded-md h-[150px] overflow-auto font-mono text-sm">
                {analysis ? (
                  <pre>{analysis}</pre>
                ) : (
                  <p className="text-gray-400">Demandez une analyse IA pour obtenir un feedback sur votre code...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h3 className="font-medium flex items-center gap-2 text-blue-800">
            <Info className="h-4 w-4" />
            Progression
          </h3>
          <div className="mt-2 space-y-2">
            <div>
              <div className="flex justify-between mb-1 text-sm text-blue-800">
                <span>Algorithmes</span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm text-blue-800">
                <span>Syntaxe</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Exercices de Programmation</h1>
              <p className="text-gray-600">Pratiquez et améliorez vos compétences de programmation</p>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={() => navigate("/student/code-editor")} className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Éditeur de Code
              </Button>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 mb-4">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Complétez des exercices pour gagner des points et des badges. Votre progression est suivie automatiquement.
            </AlertDescription>
          </Alert>

          <Tabs 
            defaultValue="all" 
            value={activeTabSection} 
            onValueChange={(value) => setActiveTabSection(value as "all" | "python" | "java" | "javascript" | "c" | "cpp")}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">Tous les exercices</TabsTrigger>
              <TabsTrigger value="python">Exercices Python</TabsTrigger>
              <TabsTrigger value="java">Exercices Java</TabsTrigger>
              <TabsTrigger value="javascript">Exercices JavaScript</TabsTrigger>
              <TabsTrigger value="c">Exercices C</TabsTrigger>
              <TabsTrigger value="cpp">Exercices C++</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {!activeExercise && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Rechercher par titre, description ou mot-clé..." 
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-[150px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Langage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les langages</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-[150px]">
                          <Star className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Difficulté" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les difficultés</SelectItem>
                          <SelectItem value="Beginner">Débutant</SelectItem>
                          <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="Advanced">Avancé</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger className="w-[150px]">
                          <Code className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Thème" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les thèmes</SelectItem>
                          {themes.map(theme => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Progression globale</h2>
                    <div className="flex items-center gap-3">
                      <Progress value={35} className="h-2 flex-grow" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                activeExercise ? renderExerciseDetail() : renderExercisesList()
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
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExercisesPage;
