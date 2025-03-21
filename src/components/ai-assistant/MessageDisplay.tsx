
import React, { useRef, useEffect } from "react";
import { Brain, UserCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormattedMessage } from "./FormattedMessage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageDisplay = ({ messages, isLoading }: MessageDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
      {messages.map((message, index) => (
        <div
          key={index}
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
          <div
            className={`rounded-lg p-3 max-w-[85%] ${
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
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="rounded-lg p-3 max-w-[85%] bg-muted">
            <div className="flex gap-1">
              <Skeleton className="h-3 w-3 rounded-full animate-pulse" />
              <Skeleton className="h-3 w-3 rounded-full animate-pulse delay-100" />
              <Skeleton className="h-3 w-3 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
