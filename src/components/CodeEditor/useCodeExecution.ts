
import { useState } from 'react';
import { executeCode, getAICodeAssistance } from './CodeExecutionService';
import { toast } from "sonner";
import { ProgrammingLanguage } from './types';

export const useCodeExecution = () => {
  const [output, setOutput] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "analysis">("output");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runCode = async (code: string, language: ProgrammingLanguage) => {
    if (!code.trim()) {
      toast.error("Veuillez entrer du code à exécuter");
      return;
    }
    
    setIsRunning(true);
    setOutput("");
    setErrorMessage(null);
    setActiveTab("output"); // Switch to output tab when running code
    
    try {
      const result = await executeCode(code, language);
      setOutput(result.output || "Programme exécuté avec succès!");
      
      if (result.output.includes("erreur") || result.output.includes("Error")) {
        toast.error("L'exécution du code a rencontré des erreurs");
      } else {
        toast.success("Code exécuté avec succès");
      }
      
      // After running code, automatically get some basic analysis
      getAIHelp(code, language, "Analyse ce code brièvement.");
    } catch (error: any) {
      console.error('Error executing code:', error);
      const errorMsg = error.message || 'Erreur inconnue';
      setOutput(`Erreur d'exécution du code: ${errorMsg}`);
      setErrorMessage(errorMsg);
      toast.error("Échec de l'exécution du code");
    } finally {
      setIsRunning(false);
    }
  };

  const getAIHelp = async (code: string, language: ProgrammingLanguage, question: string = "") => {
    if (!code.trim()) {
      toast.error("Veuillez entrer du code à analyser");
      return;
    }
    
    setIsAnalyzing(true);
    setErrorMessage(null);
    
    try {
      const reply = await getAICodeAssistance(code, language, question);
      setAnalysis(reply);
      setActiveTab("analysis"); // Switch to analysis tab
      toast.success("Analyse AI terminée");
    } catch (error: any) {
      console.error('Error getting AI help:', error);
      setErrorMessage(error.message || "Échec de l'assistance AI");
      toast.error("Échec de l'assistance AI");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    output,
    analysis,
    isRunning,
    isAnalyzing,
    activeTab,
    errorMessage,
    setActiveTab,
    runCode,
    getAIHelp
  };
};
