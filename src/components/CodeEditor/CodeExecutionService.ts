
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
  question: string = "", 
  messageHistory: Array<{role: string, content: string}> = []
) => {
  try {
    console.log("Getting AI assistance for:", { language, codePreview: code.substring(0, 50) + "...", question });
    
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { 
        code, 
        language, 
        prompt: question,
        messageHistory
      }
    });

    if (error) {
      console.error('Error from AI Assistant Edge Function:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    if (!data || !data.reply) {
      console.error('Invalid response from AI Assistant Edge Function');
      throw new Error("Invalid response from AI assistant");
    }
    
    console.log("AI assistance response received");
    return data.reply;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    throw error;
  }
};
