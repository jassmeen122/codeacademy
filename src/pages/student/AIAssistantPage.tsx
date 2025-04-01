
import React, { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageDisplay } from "@/components/ai-assistant/MessageDisplay";
import { ErrorDisplay } from "@/components/ai-assistant/ErrorDisplay";
import { FormattedMessage } from "@/components/ai-assistant/FormattedMessage";
import { ChatActions } from "@/components/ai-assistant/ChatActions";
import { CodeBlock } from "@/components/ai-assistant/CodeBlock";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Code, Send, ArrowUpCircle, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIAssistantInfo } from "@/components/ai-assistant/AIAssistantInfo";

const AIAssistantPage = () => {
  const {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage,
    switchAssistantModel
  } = useAIAssistant();
  
  const [userInput, setUserInput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<"chat" | "code">("chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!userInput.trim() && !code.trim()) || isLoading) return;
    
    sendMessage(userInput, activeTab === "code" ? code : undefined, activeTab === "code" ? language : undefined);
    setUserInput("");
    
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
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Assistant IA
            </h1>
            <ChatActions 
              onClearChat={clearChat}
              onRetry={retryLastMessage}
              showRetry={messages.length > 1 && !isLoading && messages[messages.length - 1].role === "assistant"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chat Area */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <Card className="flex-1 flex flex-col h-[60vh]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Assistant de Programmation
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
                  <MessageDisplay messages={messages} isLoading={isLoading} />
                  
                  <ErrorDisplay 
                    errorMessage={errorMessage} 
                    onRetry={retryLastMessage}
                  >
                    <Button 
                      onClick={switchAssistantModel} 
                      variant="outline" 
                      size="sm"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Changer de modèle
                    </Button>
                  </ErrorDisplay>
                  
                  <div className="border-t pt-4">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chat" | "code")}>
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="chat">Message Simple</TabsTrigger>
                        <TabsTrigger value="code">Partager du Code</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="chat" className="m-0">
                        <div className="flex flex-col gap-2">
                          <Textarea
                            ref={textareaRef}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
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
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Question ou instruction pour l'assistant (optionnel)..."
                            className="min-h-[60px]"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleSend} 
                        disabled={isLoading || ((!userInput.trim()) && (!code.trim() && activeTab === "code"))}
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
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar with Information */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AIAssistantInfo />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
