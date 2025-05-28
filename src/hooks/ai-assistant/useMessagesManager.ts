
import { useState, useEffect } from "react";
import { Message } from "./types";
import { intelligentAI } from "@/services/intelligentAIService";

export const useMessagesManager = (useLocalAI: boolean) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("ai-assistant-messages");
    return savedMessages 
      ? JSON.parse(savedMessages) 
      : [{ 
          role: "assistant", 
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
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([{ 
      role: "assistant", 
      content: useLocalAI ? `🤖 **IA Locale Active**\n\nSalut ! Comment puis-je t'aider avec la programmation ?` : intelligentAI.getWelcomeMessage(),
      suggestions: [
        "🐛 J'ai un bug dans mon code",
        "🐍 Apprendre Python", 
        "🟨 Apprendre JavaScript",
        "📚 Expliquer les fonctions"
      ],
      isLocal: useLocalAI
    }]);
  };

  const getLastUserMessage = (): Message | null => {
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
