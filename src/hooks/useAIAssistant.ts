
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem("ai-assistant-messages");
    return savedMessages 
      ? JSON.parse(savedMessages) 
      : [{ role: "assistant", content: "Bonjour ! Je suis votre assistant IA de programmation. Je peux vous aider avec Python, Java, JavaScript, C, C++, PHP et SQL. Comment puis-je vous aider aujourd'hui?" }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useHuggingFace, setUseHuggingFace] = useState<boolean>(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (userInput: string, code?: string, language?: string) => {
    if ((!userInput.trim() && !code?.trim()) || isLoading) return;

    // Format user message including code if provided
    let userContent = userInput;
    if (code && language) {
      userContent = userInput.trim() ? 
        `${userInput}\n\n\`\`\`${language}\n${code}\n\`\`\`` : 
        `Aidez-moi avec ce code ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    }

    // Add user message to chat
    const userMessage: Message = { role: "user", content: userContent };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Format messages for the API (excluding the initial system message)
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log(`Sending request to ${useHuggingFace ? 'Hugging Face' : 'OpenAI'} assistant...`);
      
      // Call Supabase Edge Function (OpenAI or Hugging Face based on state)
      const functionName = useHuggingFace ? 'huggingface-assistant' : 'ai-assistant';
      let response = await supabase.functions.invoke(functionName, {
        body: { 
          prompt: userInput, 
          messageHistory: messageHistory,
          code: code,
          language: language
        }
      });

      console.log("Response received:", response.data, response.error);

      if (response.error) {
        console.error("Edge function error:", response.error);
        throw new Error(response.error.message || "Notre service d'IA est temporairement indisponible. Veuillez réessayer plus tard.");
      }

      // Add AI response to chat
      if (response.data?.reply) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.data.reply.content 
        }]);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      } else {
        throw new Error("Notre service d'IA est temporairement indisponible. Veuillez réessayer plus tard.");
      }

    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      
      // Customize the error message to be more user-friendly
      let friendlyError = "Notre service d'IA est temporairement indisponible. Veuillez réessayer plus tard.";
      
      if (error.message && error.message.includes("langages de programmation")) {
        friendlyError = error.message;
      } else if (error.message && (
          error.message.includes("quota") || 
          error.message.includes("billing") ||
          error.message.includes("exceeded")
      )) {
        friendlyError = "Le service d'IA est actuellement en maintenance. Nous travaillons à le rétablir rapidement.";
      }
      
      setErrorMessage(friendlyError);
      toast.error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Êtes-vous sûr de vouloir effacer l'historique de discussion?")) {
      setMessages([{ 
        role: "assistant", 
        content: "Historique effacé. Je suis votre assistant IA de programmation. Je peux vous aider avec Python, Java, JavaScript, C, C++, PHP et SQL. Comment puis-je vous aider aujourd'hui?" 
      }]);
      setErrorMessage(null);
    }
  };

  const retryLastMessage = () => {
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      sendMessage(lastUserMessage.content);
    }
    // Remove the error message
    setErrorMessage(null);
  };

  const switchAssistantModel = () => {
    setUseHuggingFace(prev => !prev);
    setErrorMessage(null);
    toast.info(useHuggingFace ? 
      "Changement vers le modèle OpenAI." : 
      "Changement vers le modèle Hugging Face.");
    
    // Retry with the new model if there's a recent user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      // Add a slight delay to allow the UI to update
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
