
import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brain, SendHorizontal, UserCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const AIAssistantPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem("ai-assistant-messages");
    return savedMessages 
      ? JSON.parse(savedMessages) 
      : [{ role: "assistant", content: "Hi! I'm your AI programming assistant. How can I help you today?" }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ai-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages for the API (excluding the initial system message)
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          prompt: input, 
          messageHistory: messageHistory 
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to get a response from the AI assistant");
      }

      // Add AI response to chat
      if (data?.reply) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.reply.content 
        }]);
      } else {
        throw new Error("Invalid response format from AI assistant");
      }

    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast.error("Failed to get a response from the AI assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([{ 
        role: "assistant", 
        content: "Chat history cleared. How can I help you today?" 
      }]);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Programming Assistant</h1>
          <Button variant="outline" onClick={handleClearChat}>
            Clear Chat
          </Button>
        </div>
        
        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-4 h-full flex flex-col">
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
                    className={`rounded-lg p-3 max-w-[85%] whitespace-pre-wrap ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about programming..."
                className="flex-1 min-h-[80px] resize-none"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Press Ctrl+Enter to send
                </span>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  {isLoading ? "Thinking..." : "Send"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
