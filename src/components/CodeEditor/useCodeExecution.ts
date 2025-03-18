
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

  const runCode = async (code: string, language: ProgrammingLanguage) => {
    setIsRunning(true);
    setOutput("");
    
    try {
      const result = await executeCode(code, language);
      setOutput(result.output || "Program executed successfully!");
      toast.success("Code executed");
      
      // After running code, automatically get some basic analysis
      getAIHelp(code, language, "Analyze this code briefly.");
    } catch (error: any) {
      console.error('Error executing code:', error);
      setOutput(`Error executing code: ${error.message || 'Unknown error'}`);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const getAIHelp = async (code: string, language: ProgrammingLanguage, question: string = "") => {
    setIsAnalyzing(true);
    try {
      const reply = await getAICodeAssistance(code, language, question);
      setAnalysis(reply.content);
      setActiveTab("analysis"); // Switch to analysis tab
      toast.success("AI analysis complete");
    } catch (error: any) {
      console.error('Error getting AI help:', error);
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
    setActiveTab,
    runCode,
    getAIHelp
  };
};
