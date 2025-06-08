
import { useState, useEffect } from "react";
import { Message } from "./types";
import { intelligentAI } from "@/services/intelligentAIService";

export const useMessagesManager = (useLocalAI: boolean) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem("ai-assistant-messages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Ensure the parsed data is an array
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error parsing saved messages:", error);
    }
    
    // Return default messages if localStorage is empty, invalid, or parsing fails
    return [{ 
      role: "assistant" as const, 
      content: `🤖 **Assistant IA Local Activé !**

Salut ! Les services IA externes sont temporairement indisponibles, mais j'ai activé mon **système d'IA locale** pour t'aider !

**🧠 Ce que je peux faire :**
- 🐛 T'aider avec tes bugs de code
- 📚 T'expliquer les concepts de programmation
- 🐍 Support Python (variables, fonctions, boucles)
- 🟨 Support JavaScript (DOM, événements)
- 💡 Te donner des conseils de débogage

**💬 Parle-moi naturellement !**
- "Mon code Python ne marche pas"
- "Comment faire une boucle ?"
- "J'ai une erreur de syntaxe"

Pose-moi ta question !`,
      suggestions: [
        "🐛 J'ai un bug dans mon code",
        "🐍 Apprendre Python",
        "🟨 Apprendre JavaScript",
        "📚 Expliquer les fonctions"
      ],
      isLocal: true
    }];
  });

  useEffect(() => {
    // Only save to localStorage if messages is a valid array
    if (Array.isArray(messages)) {
      localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => {
      // Safety check to ensure prev is always an array
      if (!Array.isArray(prev)) {
        console.warn("Previous messages state was not an array, resetting to empty array");
        return [message];
      }
      return [...prev, message];
    });
  };

  const clearMessages = () => {
    const defaultMessage: Message = { 
      role: "assistant" as const, 
      content: useLocalAI ? `🤖 **IA Locale Active**\n\nSalut ! Comment puis-je t'aider avec la programmation ?` : intelligentAI.getWelcomeMessage(),
      suggestions: [
        "🐛 J'ai un bug dans mon code",
        "🐍 Apprendre Python", 
        "🟨 Apprendre JavaScript",
        "📚 Expliquer les fonctions"
      ],
      isLocal: useLocalAI
    };
    setMessages([defaultMessage]);
  };

  const getLastUserMessage = (): Message | null => {
    // Safety check to ensure messages is an array
    if (!Array.isArray(messages)) {
      return null;
    }
    
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex !== -1) {
      return messages[messages.length - 1 - lastUserMessageIndex];
    }
    return null;
  };

  return {
    messages,
    addMessage,
    clearMessages,
    getLastUserMessage
  };
};
