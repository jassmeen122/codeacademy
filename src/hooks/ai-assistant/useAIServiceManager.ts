
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { intelligentAI } from "@/services/intelligentAIService";
import { localAI } from "@/services/localAIService";
import { Message } from "./types";

export const useAIServiceManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useHuggingFace, setUseHuggingFace] = useState<boolean>(false);
  const [useLocalAI, setUseLocalAI] = useState<boolean>(true);

  const sendToAI = async (
    userInput: string, 
    code?: string, 
    language?: string,
    messageHistory: Message[] = []
  ): Promise<Message> => {
    console.log("🚀 Début envoi message IA:", { userInput, code: !!code, language, useLocal: useLocalAI });

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Essayer d'abord l'IA locale si activée
      if (useLocalAI || true) { // Force l'IA locale pour le moment
        console.log("🤖 Utilisation de l'IA locale");
        
        const localResponse = localAI.analyzeQuery(userInput);
        
        if (localResponse.confidence > 0.3) {
          console.log("💬 Réponse locale trouvée:", localResponse.confidence);
          toast.success("Réponse générée localement !");
          return { 
            role: "assistant", 
            content: localResponse.answer,
            suggestions: localResponse.suggestions,
            isLocal: true
          };
        }
      }

      // Fallback vers l'IA externe
      console.log("📡 Tentative IA externe...");

      const { analysis, prompt, suggestions } = intelligentAI.analyzeAndRespond(
        userInput, 
        code, 
        language
      );

      const apiMessageHistory = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log(`📡 Envoi vers ${useHuggingFace ? 'Hugging Face' : 'OpenAI'} avec prompt intelligent...`);
      
      const functionName = useHuggingFace ? 'huggingface-assistant' : 'ai-assistant';
      let response = await supabase.functions.invoke(functionName, {
        body: { 
          prompt: prompt,
          messageHistory: apiMessageHistory,
          code: code,
          language: language || analysis.language
        }
      });

      console.log("📨 Réponse reçue:", response.data, response.error);

      if (response.error) {
        throw new Error(response.error.message || "Service IA externe indisponible");
      }

      if (response.data?.reply) {
        console.log("✅ Message IA externe ajouté avec succès");
        return { 
          role: "assistant", 
          content: response.data.reply.content,
          suggestions: suggestions.length > 0 ? suggestions : undefined,
          isLocal: false
        };
      } else {
        throw new Error("Service IA externe indisponible");
      }

    } catch (error: any) {
      console.error("❌ Erreur assistant IA:", error);
      
      // En cas d'erreur, utiliser l'IA locale comme fallback
      console.log("🔄 Fallback vers IA locale");
      const localResponse = localAI.analyzeQuery(userInput);
      
      toast.info("IA locale utilisée (service externe indisponible)");
      return { 
        role: "assistant", 
        content: `⚠️ **Service IA externe indisponible**\n\n${localResponse.answer}`,
        suggestions: localResponse.suggestions,
        isLocal: true
      };
    } finally {
      setIsLoading(false);
    }
  };

  const switchAssistantModel = () => {
    setUseLocalAI(prev => !prev);
    setErrorMessage(null);
    const newModel = !useLocalAI ? "IA Locale" : "IA Externe";
    console.log(`🔄 Changement vers ${newModel}`);
    toast.info(useLocalAI ? 
      "🌐 Changement vers IA externe" : 
      "🤖 Changement vers IA locale");
  };

  const toggleLocalAI = () => {
    setUseLocalAI(prev => !prev);
    const message = useLocalAI ? 
      "🌐 IA externe activée (si disponible)" : 
      "🤖 IA locale activée";
    toast.info(message);
  };

  return {
    isLoading,
    errorMessage,
    useLocalAI,
    sendToAI,
    switchAssistantModel,
    toggleLocalAI,
    setErrorMessage
  };
};
