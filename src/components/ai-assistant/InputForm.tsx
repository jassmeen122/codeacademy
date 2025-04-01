
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Code, Trash, FileCode } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InputFormProps {
  onSubmit: (input: string, code?: string, language?: string) => void;
  isLoading: boolean;
}

export const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
  const [input, setInput] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus on textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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

  const clearInputs = () => {
    setInput("");
    setCode("");
  };

  const programmingLanguages = [
    "javascript", "typescript", "python", "java", "csharp", "cpp", 
    "php", "ruby", "swift", "kotlin", "go", "rust", "html", "css", "c"
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={showCodeInput 
          ? "Posez une question sur votre code..." 
          : "Posez n'importe quelle question sur la programmation..."}
        className="flex-1 min-h-[80px] resize-none transition-all"
        disabled={isLoading}
      />
      
      <AnimatePresence>
        {showCodeInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <div className="flex gap-2">
              <Select 
                value={language} 
                onValueChange={setLanguage}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionnez un langage" />
                </SelectTrigger>
                <SelectContent>
                  {programmingLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={clearInputs}
                      disabled={isLoading || (!input && !code)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Effacer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Collez votre code ${language} ici...`}
              className="flex-1 min-h-[150px] font-mono text-sm resize-none"
              disabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  disabled={isLoading}
                >
                  {showCodeInput ? <FileCode className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
                  {showCodeInput ? "Masquer Code" : "Ajouter Code"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showCodeInput ? "Masquer l'éditeur de code" : "Ajouter du code à votre question"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-xs text-gray-500 hidden sm:inline">
            Appuyez sur Ctrl+Entrée pour envoyer
          </span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || (!input.trim() && !code.trim())}
          className="transition-all"
        >
          <SendHorizontal className="h-4 w-4 mr-2" />
          {isLoading ? "En attente..." : "Envoyer"}
        </Button>
      </div>
    </form>
  );
};
