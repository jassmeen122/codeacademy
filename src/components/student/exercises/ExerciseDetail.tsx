
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoEditorWrapper } from "@/components/CodeEditor/MonacoEditorWrapper";
import { LanguageSelector } from "@/components/CodeEditor/LanguageSelector";
import { Exercise } from "@/types/exercise";
import { ProgrammingLanguage } from "@/components/CodeEditor/types";

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  code: string;
  setCode: (code: string) => void;
  selectedLanguage: ProgrammingLanguage;
  setSelectedLanguage: (language: ProgrammingLanguage) => void;
  runCode: () => void;
  isRunning: boolean;
  output: string;
  analysis: string;
  editorActiveTab: "output" | "analysis";
  setEditorActiveTab: (tab: "output" | "analysis") => void;
  handleGetAIFeedback: () => void;
  isAnalyzing: boolean;
  showHint: boolean;
  setShowHint: (show: boolean) => void;
  showSolution: boolean;
  setShowSolution: (show: boolean) => void;
  difficulties: Record<string, { stars: number; className: string }>;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({
  exercise,
  onBack,
  code,
  setCode,
  selectedLanguage,
  setSelectedLanguage,
  runCode,
  isRunning,
  output,
  analysis,
  editorActiveTab,
  setEditorActiveTab,
  handleGetAIFeedback,
  isAnalyzing,
  showHint,
  setShowHint,
  showSolution,
  setShowSolution,
  difficulties
}) => {
  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 inline-block text-yellow-500 fill-yellow-500" />);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{exercise.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficulties[exercise.difficulty].className}`}>
              {renderStars(difficulties[exercise.difficulty].stars)}
            </span>
            <Badge variant="outline" className="text-sm">
              {exercise.language}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-none">{exercise.theme}</Badge>
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>Retour à la liste</Button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="font-medium mb-2">Description:</h3>
        <p className="text-gray-700">{exercise.description}</p>
        
        {exercise.tests && exercise.tests.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Exemples:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {exercise.tests.map((test, idx) => (
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
              language={selectedLanguage} 
              onChange={setSelectedLanguage} 
            />
            <Button 
              onClick={runCode} 
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
              language={selectedLanguage}
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
