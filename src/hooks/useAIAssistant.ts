
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { intelligentAI } from "@/services/intelligentAIService";

export type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("ai-assistant-messages");
    return savedMessages 
      ? JSON.parse(savedMessages) 
      : [{ 
          role: "assistant", 
          content: intelligentAI.getWelcomeMessage(),
          suggestions: [
            "🐛 J'ai un bug dans mon code",
            "📚 Expliquer les fonctions Python",
            "💪 Exercices pour débutant JavaScript"
          ]
        }];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useHuggingFace, setUseHuggingFace] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (userInput: string, code?: string, language?: string) => {
    if ((!userInput.trim() && !code?.trim()) || isLoading) return;

    try {
      // Analyser la question avec notre IA intelligente
      const { analysis, prompt, suggestions } = intelligentAI.analyzeAndRespond(
        userInput, 
        code, 
        language
      );

      console.log("🧠 Analyse NLP:", analysis);
      console.log("💡 Suggestions:", suggestions);

      // Format user message including code if provided
      let userContent = userInput;
      if (code && language) {
        userContent = userInput.trim() ? 
          `${userInput}\n\n\`\`\`${language}\n${code}\n\`\`\`` : 
          `Voici mon code ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\``;
      }

      // Add user message to chat
      const userMessage: Message = { role: "user", content: userContent };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setErrorMessage(null);

      // Vérifier si on peut répondre localement pour certains cas
      const localResponse = getLocalResponse(analysis);
      if (localResponse) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: localResponse,
          suggestions: suggestions
        }]);
        setIsLoading(false);
        return;
      }

      // Format messages for the API
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log(`📡 Envoi vers ${useHuggingFace ? 'Hugging Face' : 'OpenAI'} avec prompt intelligent...`);
      
      // Call Edge Function with intelligent prompt
      const functionName = useHuggingFace ? 'huggingface-assistant' : 'ai-assistant';
      let response = await supabase.functions.invoke(functionName, {
        body: { 
          prompt: prompt, // Utiliser le prompt intelligent généré
          messageHistory: messageHistory,
          code: code,
          language: language || analysis.language
        }
      });

      console.log("📨 Réponse reçue:", response.data, response.error);

      if (response.error) {
        console.error("❌ Erreur Edge function:", response.error);
        throw new Error(response.error.message || "Le service d'IA est temporairement indisponible.");
      }

      // Add AI response with suggestions
      if (response.data?.reply) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.data.reply.content,
          suggestions: suggestions.length > 0 ? suggestions : undefined
        }]);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      } else {
        throw new Error("Le service d'IA est temporairement indisponible.");
      }

    } catch (error: any) {
      console.error("❌ Erreur assistant IA:", error);
      
      let friendlyError = "Le service d'IA est temporairement indisponible. 😅";
      
      if (error.message && error.message.includes("langages de programmation")) {
        friendlyError = error.message;
      } else if (error.message && (
          error.message.includes("quota") || 
          error.message.includes("billing") ||
          error.message.includes("exceeded")
      )) {
        friendlyError = "Le service d'IA est en maintenance. 🔧 Essaie le modèle alternatif !";
      }
      
      setErrorMessage(friendlyError);
      toast.error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Réponses locales pour certains cas simples
  const getLocalResponse = (analysis: any): string | null => {
    if (analysis.type === 'exercise' && analysis.language && analysis.difficulty) {
      return intelligentAI.generateExerciseSuggestions(analysis.language, analysis.difficulty);
    }
    
    // Réponses pour questions très simples
    const simpleResponses: { [key: string]: string } = {
      'salut': '👋 Salut ! Comment puis-je t\'aider avec la programmation aujourd\'hui ?',
      'bonjour': '🌅 Bonjour ! Prêt à coder ? Dis-moi ce sur quoi tu travailles !',
      'aide': '🤝 Bien sûr ! Je peux t\'aider avec tes bugs, t\'expliquer des concepts ou te proposer des exercices. Que veux-tu faire ?'
    };

    const query = analysis.keywords.join(' ').toLowerCase();
    return simpleResponses[query] || null;
  };

  const clearChat = () => {
    if (confirm("🗑️ Effacer l'historique de discussion ?")) {
      setMessages([{ 
        role: "assistant", 
        content: intelligentAI.getWelcomeMessage(),
        suggestions: [
          "🐛 J'ai un bug dans mon code",
          "📚 Expliquer les fonctions Python", 
          "💪 Exercices pour débutant JavaScript"
        ]
      }]);
      setErrorMessage(null);
    }
  };

  const retryLastMessage = () => {
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      sendMessage(lastUserMessage.content);
    }
    setErrorMessage(null);
  };

  const switchAssistantModel = () => {
    setUseHuggingFace(prev => !prev);
    setErrorMessage(null);
    toast.info(useHuggingFace ? 
      "🤖 Changement vers OpenAI" : 
      "🤗 Changement vers Hugging Face");
    
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      setTimeout(() => {
        sendMessage(lastUserMessage.content);
      }, 100);
    }
  };

  return {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage,
    switchAssistantModel
  };
};
