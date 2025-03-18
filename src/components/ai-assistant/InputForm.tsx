
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Code } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface InputFormProps {
  onSubmit: (input: string, code?: string, language?: string) => void;
  isLoading: boolean;
}

export const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
  const [input, setInput] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !code.trim()) || isLoading) return;
    
    onSubmit(input, showCodeInput ? code : undefined, showCodeInput ? language : undefined);
    setInput("");
    setCode("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const programmingLanguages = [
    "javascript", "typescript", "python", "java", "csharp", "cpp", 
    "php", "ruby", "swift", "kotlin", "go", "rust", "html", "css"
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={showCodeInput 
          ? "Ask a question about your code..." 
          : "Ask me anything about programming..."}
        className="flex-1 min-h-[80px] resize-none"
        disabled={isLoading}
      />
      
      {showCodeInput && (
        <div className="flex flex-col gap-2 animate-fadeIn">
          <div className="flex gap-2">
            <Select 
              value={language} 
              onValueChange={setLanguage}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {programmingLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your ${language} code here...`}
            className="flex-1 min-h-[150px] font-mono text-sm resize-none"
            disabled={isLoading}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowCodeInput(!showCodeInput)}
            disabled={isLoading}
          >
            <Code className="h-4 w-4 mr-2" />
            {showCodeInput ? "Hide Code" : "Add Code"}
          </Button>
          <span className="text-xs text-gray-500">
            Press Ctrl+Enter to send
          </span>
        </div>
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
