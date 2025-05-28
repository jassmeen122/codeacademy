
import { useState, useCallback } from 'react';
import { LocalAIAssistant, AIResponse } from '@/services/localAI/LocalAIAssistant';

export type LocalMessage = {
  role: 'user' | 'assistant';
  content: string;
  type?: 'explanation' | 'suggestion' | 'exercise' | 'debug' | 'general';
  confidence?: number;
  timestamp: Date;
};

export const useLocalAIAssistant = () => {
  const [messages, setMessages] = useState<LocalMessage[]>(() => {
    const savedMessages = localStorage.getItem('local-ai-messages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        role: 'assistant',
        content: `# 🤖 Assistant IA Local

Bonjour ! Je suis votre assistant IA de programmation **100% local**. Je fonctionne entièrement dans votre navigateur, sans envoyer de données à des serveurs externes.

## Mes capacités :
- 🧠 Compréhension du langage naturel
- 📚 Explications détaillées des concepts
- 🔍 Analyse et débogage de code
- 💪 Suggestions d'exercices personnalisés
- 🎯 Détection d'erreurs communes

**Langages supportés :** Python, JavaScript, Java, C, C++, PHP, SQL

Posez-moi vos questions sur la programmation !`,
        type: 'general',
        confidence: 1.0,
        timestamp: new Date()
      }
    ];
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [assistant] = useState(() => new LocalAIAssistant());

  const sendMessage = useCallback(async (
    userInput: string, 
    code?: string, 
    language?: string
  ) => {
    if (!userInput.trim() || isProcessing) return;

    // Ajouter le message utilisateur
    const userMessage: LocalMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      localStorage.setItem('local-ai-messages', JSON.stringify(updated));
      return updated;
    });

    setIsProcessing(true);

    try {
      // Simuler un délai de traitement pour une expérience réaliste
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Traiter la requête avec l'IA locale
      const response: AIResponse = await assistant.processQuery(userInput, code, language);
      
      // Ajouter la réponse de l'assistant
      const assistantMessage: LocalMessage = {
        role: 'assistant',
        content: response.content,
        type: response.type,
        confidence: response.confidence,
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        localStorage.setItem('local-ai-messages', JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      console.error('Erreur de traitement IA locale:', error);
      
      const errorMessage: LocalMessage = {
        role: 'assistant',
        content: "Désolé, j'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer.",
        type: 'general',
        confidence: 0.1,
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, errorMessage];
        localStorage.setItem('local-ai-messages', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsProcessing(false);
    }
  }, [assistant, isProcessing]);

  const clearChat = useCallback(() => {
    if (confirm("Êtes-vous sûr de vouloir effacer l'historique de discussion ?")) {
      const initialMessage: LocalMessage = {
        role: 'assistant',
        content: `# 🤖 Assistant IA Local

Historique effacé ! Je suis votre assistant IA de programmation **100% local**.

Posez-moi vos questions sur la programmation !`,
        type: 'general',
        confidence: 1.0,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      localStorage.setItem('local-ai-messages', JSON.stringify([initialMessage]));
    }
  }, []);

  const analyzeCode = useCallback(async (code: string, language: string) => {
    setIsProcessing(true);
    
    try {
      const response = await assistant.processQuery(
        "Analyse ce code et détecte les erreurs",
        code,
        language
      );
      
      const analysisMessage: LocalMessage = {
        role: 'assistant',
        content: response.content,
        type: 'debug',
        confidence: response.confidence,
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, analysisMessage];
        localStorage.setItem('local-ai-messages', JSON.stringify(updated));
        return updated;
      });
      
    } catch (error) {
      console.error('Erreur d\'analyse de code:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [assistant]);

  return {
    messages,
    isProcessing,
    sendMessage,
    clearChat,
    analyzeCode
  };
};
