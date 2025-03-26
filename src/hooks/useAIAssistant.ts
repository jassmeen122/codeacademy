
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type AIModel = "openai" | "huggingface";

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
  const [selectedModel, setSelectedModel] = useState<AIModel>(() => {
    // Try to load selected model from localStorage
    const savedModel = localStorage.getItem("ai-assistant-model");
    return (savedModel as AIModel) || "openai";
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  // Save selected model to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ai-assistant-model", selectedModel);
  }, [selectedModel]);

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

      console.log(`Sending request to ${selectedModel} assistant...`);
      
      // Call Supabase Edge Function
      const endpoint = selectedModel === "openai" ? 'ai-assistant' : 'huggingface-assistant';
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { 
          prompt: userInput, 
          messageHistory: messageHistory,
          code: code,
          language: language
        }
      });

      console.log("Response received:", data, error);

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || `Failed to get a response from the ${selectedModel} assistant`);
      }

      // Add AI response to chat
      if (data?.reply) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.reply.content 
        }]);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error(`Invalid response format from ${selectedModel} assistant`);
      }

    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      setErrorMessage(error.message || `Failed to get a response from the ${selectedModel} assistant`);
      toast.error(`Failed to get a response from the ${selectedModel} assistant. Please try again.`);
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
    retryLastMessage,
    selectedModel,
    setSelectedModel
  };
};
