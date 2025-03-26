
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
      : [{ role: "assistant", content: "Hi! I'm your AI programming assistant. How can I help you today?" }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        `Please help with this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
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

      console.log("Sending request to OpenAI assistant...");
      
      // Call Supabase Edge Function
      let response = await supabase.functions.invoke('ai-assistant', {
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
        throw new Error(response.error.message || "Failed to get a response from the AI assistant");
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
        throw new Error("Invalid response format from AI assistant");
      }

    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      setErrorMessage(error.message || "Failed to get a response from the AI assistant");
      toast.error(`Failed to get a response from the AI assistant. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([{ 
        role: "assistant", 
        content: "Chat history cleared. How can I help you today?" 
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

  return {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage
  };
};
