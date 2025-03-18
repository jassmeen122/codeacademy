
import { supabase } from "@/integrations/supabase/client";
import { ProgrammingLanguage } from './types';

export const executeCode = async (code: string, language: ProgrammingLanguage) => {
  try {
    const { data, error } = await supabase.functions.invoke('execute-code', {
      body: { 
        language, 
        code 
      }
    });

    if (error) throw error;
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
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { 
        code, 
        language, 
        prompt: question,
        messageHistory
      }
    });

    if (error) throw error;
    return data.reply;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    throw error;
  }
};
