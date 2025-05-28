
import { useMessagesManager } from "./ai-assistant/useMessagesManager";
import { useAIServiceManager } from "./ai-assistant/useAIServiceManager";
import { Message } from "./ai-assistant/types";

export type { Message };

export const useAIAssistant = () => {
  const {
    isLoading,
    errorMessage,
    useLocalAI,
    sendToAI,
    switchAssistantModel,
    toggleLocalAI,
    setErrorMessage
  } = useAIServiceManager();

  const {
    messages,
    addMessage,
    clearMessages,
    getLastUserMessage
  } = useMessagesManager(useLocalAI);

  const sendMessage = async (userInput: string, code?: string, language?: string) => {
    if ((!userInput.trim() && !code?.trim()) || isLoading) return;

    try {
      // Format user message including code if provided
      let userContent = userInput;
      if (code && language) {
        userContent = userInput.trim() ? 
          `${userInput}\n\n\`\`\`${language}\n${code}\n\`\`\`` : 
          `Voici mon code ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\``;
      }

      // Add user message to chat
      const userMessage: Message = { role: "user", content: userContent };
      addMessage(userMessage);

      // Send to AI and get response
      const aiResponse = await sendToAI(userInput, code, language, [...messages, userMessage]);
      addMessage(aiResponse);

    } catch (error: any) {
      console.error("❌ Erreur dans sendMessage:", error);
      setErrorMessage(error.message || "Une erreur est survenue");
    }
  };

  const clearChat = () => {
    if (confirm("🗑️ Effacer l'historique de discussion ?")) {
      clearMessages();
      setErrorMessage(null);
      console.log("🗑️ Chat effacé");
    }
  };

  const retryLastMessage = () => {
    const lastUserMessage = getLastUserMessage();
    if (lastUserMessage) {
      console.log("🔄 Retry du dernier message:", lastUserMessage.content.substring(0, 50) + "...");
      sendMessage(lastUserMessage.content);
    }
    setErrorMessage(null);
  };

  return {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage,
    switchAssistantModel,
    toggleLocalAI,
    useLocalAI
  };
};
