
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, SendHorizontal } from "lucide-react";

const AIAssistantPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hi! I'm your AI programming assistant. How can I help you today?"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    // TODO: Implement AI API call
    setInput("");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Assistant</h1>
        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about programming..."
                className="flex-1"
              />
              <Button type="submit">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
