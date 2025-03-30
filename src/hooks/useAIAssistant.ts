
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useAIAssistant = () => {
  const { user } = useAuthState();
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem("ai-assistant-messages");
    return savedMessages 
      ? JSON.parse(savedMessages) 
      : [{ role: "assistant", content: "Hello! I'm your programming AI assistant. I can help with Python, Java, JavaScript, C, C++, PHP and SQL. How can I help you today?" }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useHuggingFace, setUseHuggingFace] = useState<boolean>(false);
  const [dailyLimit, setDailyLimit] = useState<{
    count: number;
    limit: number;
    limitReached: boolean;
    resetTime?: string;
  }>({
    count: 0,
    limit: 4,
    limitReached: false
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  // Check daily limit on mount
  useEffect(() => {
    if (user) {
      checkDailyLimit();
    }
  }, [user]);

  // Check the user's daily query count
  const checkDailyLimit = async () => {
    if (!user) return;
    
    try {
      // Custom query to avoid the type error
      const { data, error } = await supabase
        .from('ai_query_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0]);
      
      if (error) {
        console.error("Error checking daily limit:", error);
        return;
      }
      
      const count = data?.length || 0;
      
      setDailyLimit(prev => ({
        ...prev,
        count,
        limitReached: count >= prev.limit
      }));
      
    } catch (error) {
      console.error("Error checking daily limit:", error);
    }
  };

  const sendMessage = async (userInput: string, code?: string, language?: string) => {
    if ((!userInput.trim() && !code?.trim()) || isLoading) return;
    
    // Check if limit is reached
    if (dailyLimit.limitReached) {
      toast.error(`You have reached your daily limit of ${dailyLimit.limit} questions. The limit will reset at midnight.`);
      return;
    }

    // Format user message including code if provided
    let userContent = userInput;
    if (code && language) {
      userContent = userInput.trim() ? 
        `${userInput}\n\n\`\`\`${language}\n${code}\n\`\`\`` : 
        `Help me with this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
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
          language: language,
          userId: user?.id // Pass the user ID to track quota
        }
      });

      console.log("Response received:", response.data, response.error);

      if (response.error) {
        console.error("Edge function error:", response.error);
        throw new Error(response.error.message || "Our AI service is temporarily unavailable. Please try again later.");
      }

      // Check if daily limit is reached
      if (response.data?.limitReached) {
        setDailyLimit(prev => ({
          ...prev,
          limitReached: true,
          resetTime: response.data.resetTime
        }));
      }

      // Add AI response to chat
      if (response.data?.reply) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.data.reply.content 
        }]);
        
        // Update local limit count
        if (user) {
          setDailyLimit(prev => ({
            ...prev,
            count: prev.count + 1,
            limitReached: prev.count + 1 >= prev.limit
          }));
        }
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      } else {
        throw new Error("Our AI service is temporarily unavailable. Please try again later.");
      }

    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      
      // Customize the error message to be more user-friendly
      let friendlyError = "Our AI service is temporarily unavailable. Please try again later.";
      
      if (error.message && error.message.includes("programming languages")) {
        friendlyError = error.message;
      } else if (error.message && (
          error.message.includes("quota") || 
          error.message.includes("billing") ||
          error.message.includes("exceeded")
      )) {
        friendlyError = "The AI service is currently undergoing maintenance. We're working to restore it quickly.";
      }
      
      setErrorMessage(friendlyError);
      toast.error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([{ 
        role: "assistant", 
        content: "Chat history cleared. I'm your programming AI assistant. I can help with Python, Java, JavaScript, C, C++, PHP and SQL. How can I help you today?" 
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
      "Switching to OpenAI model." : 
      "Switching to Hugging Face model.");
    
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
    switchAssistantModel,
    dailyLimit
  };
};
