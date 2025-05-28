
import React, { useRef, useEffect } from "react";
import { Brain, UserCircle, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormattedMessage } from "./FormattedMessage";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import "./ai-assistant.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export const MessageDisplay = ({ messages, isLoading, onSuggestionClick }: MessageDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-2 ${
              message.role === "assistant" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {message.role === "assistant" ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-4 h-4 text-gray-700" />
              </div>
            )}
            <div className="flex flex-col max-w-[85%]">
              <div
                className={`rounded-lg p-3 ${
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <FormattedMessage content={message.content} />
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
              
              {/* Afficher les suggestions pour les messages de l'assistant */}
              {message.role === "assistant" && message.suggestions && onSuggestionClick && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 space-y-1"
                >
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>Suggestions :</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, sugIndex) => (
                      <Button
                        key={sugIndex}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => onSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="rounded-lg p-3 max-w-[85%] bg-muted">
            <div className="flex gap-1">
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
