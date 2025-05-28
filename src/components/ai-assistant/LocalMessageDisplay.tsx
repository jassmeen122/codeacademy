
import React, { useRef, useEffect } from "react";
import { Brain, UserCircle, Star, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormattedMessage } from "./FormattedMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import "./ai-assistant.css";

type LocalMessage = {
  role: "user" | "assistant";
  content: string;
  type?: 'explanation' | 'suggestion' | 'exercise' | 'debug' | 'general';
  confidence?: number;
  timestamp: Date;
};

interface LocalMessageDisplayProps {
  messages: LocalMessage[];
  isProcessing: boolean;
}

export const LocalMessageDisplay = ({ messages, isProcessing }: LocalMessageDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'explanation': return '📚';
      case 'exercise': return '💪';
      case 'debug': return '🔍';
      case 'suggestion': return '💡';
      default: return '🤖';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'explanation': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'debug': return 'bg-red-100 text-red-800';
      case 'suggestion': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 ${
              message.role === "assistant" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {message.role === "assistant" ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <UserCircle className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`rounded-lg p-4 max-w-[85%] shadow-sm ${
                message.role === "assistant"
                  ? "bg-white border border-gray-200"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={getTypeColor(message.type)}>
                    {getTypeIcon(message.type)} {message.type || 'général'}
                  </Badge>
                  {message.confidence !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className={`w-3 h-3 ${getConfidenceColor(message.confidence)}`} />
                      <span className={`text-xs ${getConfidenceColor(message.confidence)}`}>
                        {Math.round(message.confidence * 100)}%
                      </span>
                    </div>
                  )}
                  <Zap className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">IA Locale</span>
                </div>
              )}
              
              {message.role === "assistant" ? (
                <FormattedMessage content={message.content} />
              ) : (
                <div className="whitespace-pre-wrap font-medium">{message.content}</div>
              )}
              
              <div className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="rounded-lg p-4 max-w-[85%] bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                🧠 traitement
              </Badge>
              <Zap className="w-3 h-3 text-purple-500" />
              <span className="text-xs text-purple-600 font-medium">IA Locale</span>
            </div>
            <div className="flex gap-1">
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="text-sm text-gray-600 ml-2">Analyse en cours...</span>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
