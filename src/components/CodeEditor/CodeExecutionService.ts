
import { supabase } from "@/integrations/supabase/client";
import { ProgrammingLanguage } from './types';

export const executeCode = async (code: string, language: ProgrammingLanguage) => {
  try {
    console.log("Executing code:", { language, codePreview: code.substring(0, 50) + "..." });
    
    const { data, error } = await supabase.functions.invoke('execute-code', {
      body: { 
        language, 
        code 
      }
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data returned from Edge Function');
      throw new Error("No response from execution service");
    }
    
    console.log("Execution result:", data);
    return data;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
};

export const getAICodeAssistance = async (
  code: string, 
  language: ProgrammingLanguage, 
  question: string = ""
) => {
  try {
    console.log("Getting AI assistance for:", { language, codePreview: code.substring(0, 50) + "...", question });
    
    // For now, we'll just simulate AI assistance since we don't have a real AI service connected
    // In a real app, you would call an AI service here
    const aiResponse = `I've analyzed your ${language} code:

1. The code appears to be a simple example.
2. It demonstrates basic syntax for ${language}.
3. It should execute without errors.

${question ? `Regarding your question: "${question}" - This is a simulated AI response since we don't have a real AI service connected yet.` : ''}`;

    // Simulate a delay to make it feel like it's thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return aiResponse;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    throw error;
  }
};
