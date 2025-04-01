
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, ArrowUpCircle } from "lucide-react";

interface InputFormProps {
  onSendMessage: (input: string, code?: string, language?: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<"text" | "code">("text");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!input.trim() && !code.trim()) || isLoading) return;
    
    onSendMessage(
      input, 
      activeTab === "code" ? code : undefined, 
      activeTab === "code" ? language : undefined
    );
    
    setInput("");
    // Don't clear code to allow for iterations
    
    // Focus back on textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t pt-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "code")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text">Message Simple</TabsTrigger>
          <TabsTrigger value="code">Partager du Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="m-0">
          <div className="flex flex-col gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question sur la programmation..."
              className="min-h-[100px] flex-1 resize-none"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="m-0">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Langage:</label>
              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Langage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Collez votre code ${language} ici...`}
              className="min-h-[150px] font-mono text-sm"
            />
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Question ou instruction pour l'assistant (optionnel)..."
              className="min-h-[60px]"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleSend} 
          disabled={isLoading || ((!input.trim()) && (!code.trim() && activeTab === "code"))}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <ArrowUpCircle className="h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Envoyer
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
