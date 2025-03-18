
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface InputFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
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
  );
};
