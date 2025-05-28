
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { intelligentAI } from "@/services/intelligentAIService";
import { localAI } from "@/services/localAIService";

export type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  isLocal?: boolean; // Nouveau : indique si c'est une réponse locale
};

export const useAIAssistant = () => {
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useHuggingFace, setUseHuggingFace] = useState<boolean>(false);
  const [useLocalAI, setUseLocalAI] = useState<boolean>(true); // Nouveau : utiliser l'IA locale par défaut

  useEffect(() => {
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (userInput: string, code?: string, language?: string) => {
    if ((!userInput.trim() && !code?.trim()) || isLoading) return;

    try {
      console.log("🚀 Début envoi message IA:", { userInput, code: !!code, language, useLocal: useLocalAI });

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

      // Essayer d'abord l'IA locale si activée
      if (useLocalAI || true) { // Force l'IA locale pour le moment
        console.log("🤖 Utilisation de l'IA locale");
        
        // Analyser avec l'IA locale
        const localResponse = localAI.analyzeQuery(userInput);
        
        if (localResponse.confidence > 0.3) {
          console.log("💬 Réponse locale trouvée:", localResponse.confidence);
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: localResponse.answer,
            suggestions: localResponse.suggestions,
            isLocal: true
          }]);
          setIsLoading(false);
          toast.success("Réponse générée localement !");
          return;
        }
      }

      // Fallback vers l'IA externe uniquement si l'IA locale n'a pas de bonne réponse
      console.log("📡 Tentative IA externe...");

      // Analyser la question avec notre IA intelligente
      const { analysis, prompt, suggestions } = intelligentAI.analyzeAndRespond(
        userInput, 
        code, 
        language
      );

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
          prompt: prompt,
          messageHistory: messageHistory,
          code: code,
          language: language || analysis.language
        }
      });

      console.log("📨 Réponse reçue:", response.data, response.error);

      if (response.error) {
        throw new Error(response.error.message || "Service IA externe indisponible");
      }

      // Add AI response with suggestions
      if (response.data?.reply) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.data.reply.content,
          suggestions: suggestions.length > 0 ? suggestions : undefined,
          isLocal: false
        }]);
        console.log("✅ Message IA externe ajouté avec succès");
      } else {
        throw new Error("Service IA externe indisponible");
      }

    } catch (error: any) {
      console.error("❌ Erreur assistant IA:", error);
      
      // En cas d'erreur, utiliser l'IA locale comme fallback
      console.log("🔄 Fallback vers IA locale");
      const localResponse = localAI.analyzeQuery(userInput);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `⚠️ **Service IA externe indisponible**\n\n${localResponse.answer}`,
        suggestions: localResponse.suggestions,
        isLocal: true
      }]);
      
      toast.info("IA locale utilisée (service externe indisponible)");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("🗑️ Effacer l'historique de discussion ?")) {
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
      setErrorMessage(null);
      console.log("🗑️ Chat effacé");
    }
  };

  const retryLastMessage = () => {
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      console.log("🔄 Retry du dernier message:", lastUserMessage.content.substring(0, 50) + "...");
      sendMessage(lastUserMessage.content);
    }
    setErrorMessage(null);
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
