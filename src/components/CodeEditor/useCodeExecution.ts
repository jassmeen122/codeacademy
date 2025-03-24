
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
      toast.error("Please enter some code to execute");
      return;
    }
    
    setIsRunning(true);
    setOutput("");
    setErrorMessage(null);
    setActiveTab("output"); // Switch to output tab when running code
    
    try {
      const result = await executeCode(code, language);
      setOutput(result.output || "Program executed successfully!");
      
      if (result.output.includes("error") || result.output.includes("Error")) {
        toast.error("Code execution completed with errors");
      } else {
        toast.success("Code executed successfully");
      }
      
      // After running code, automatically get some basic analysis
      getAIHelp(code, language, "Analyze this code briefly.");
    } catch (error: any) {
      console.error('Error executing code:', error);
      const errorMsg = error.message || 'Unknown error';
      setOutput(`Error executing code: ${errorMsg}`);
      setErrorMessage(errorMsg);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const getAIHelp = async (code: string, language: ProgrammingLanguage, question: string = "") => {
    if (!code.trim()) {
      toast.error("Please enter some code for analysis");
      return;
    }
    
    setIsAnalyzing(true);
    setErrorMessage(null);
    
    try {
      const reply = await getAICodeAssistance(code, language, question);
      setAnalysis(reply);
      setActiveTab("analysis"); // Switch to analysis tab
      toast.success("AI analysis complete");
    } catch (error: any) {
      console.error('Error getting AI help:', error);
      setErrorMessage(error.message || 'Failed to get AI assistance');
      toast.error("Failed to get AI assistance");
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
