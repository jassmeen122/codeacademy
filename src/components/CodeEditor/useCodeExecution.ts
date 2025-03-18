
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
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
    setAnalysis("");
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          language,
          code
        }
      });

      if (error) throw error;

      setOutput(data.output || "Program executed successfully!");
      
      // If analysis was provided, set it
      if (data.analysis) {
        setAnalysis(data.analysis);
        setActiveTab("analysis"); // Switch to analysis tab automatically
        toast.success("Code executed with AI analysis");
      } else if (data.error) {
        // If there's an error, automatically get AI assistance
        getAIHelp(code, language, data.output);
      } else {
        toast.success("Code executed successfully");
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code. Please try again.');
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const getAIHelp = async (code: string, language: ProgrammingLanguage, currentOutput: string = output) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-code', {
        body: {
          language,
          code,
          output: currentOutput
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      setActiveTab("analysis"); // Switch to analysis tab
    } catch (error) {
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
