
import React, { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalMessageDisplay } from "@/components/ai-assistant/LocalMessageDisplay";
import { CodeBlock } from "@/components/ai-assistant/CodeBlock";
import { useLocalAIAssistant } from "@/hooks/useLocalAIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Code, Send, ArrowUpCircle, Trash2, Zap, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const LocalAIAssistantPage = () => {
  const {
    messages,
    isProcessing,
    sendMessage,
    clearChat,
    analyzeCode
  } = useLocalAIAssistant();
  
  const [userInput, setUserInput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<"chat" | "code">("chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!userInput.trim() && !code.trim()) || isProcessing) return;
    
    sendMessage(userInput, activeTab === "code" ? code : undefined, activeTab === "code" ? language : undefined);
    setUserInput("");
    
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleAnalyzeCode = () => {
    if (!code.trim() || isProcessing) return;
    analyzeCode(code, language);
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Assistant IA Local</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Zap className="w-3 h-3 mr-1" />
                100% Local
              </Badge>
            </div>
            <Button 
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Effacer
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zone de chat principale */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <Card className="flex-1 flex flex-col h-[60vh]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Assistant IA de Programmation
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Privé
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
                  <LocalMessageDisplay messages={messages} isProcessing={isProcessing} />
                  
                  <div className="border-t pt-4">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chat" | "code")}>
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="chat">💬 Question Simple</TabsTrigger>
                        <TabsTrigger value="code">🔍 Analyser du Code</TabsTrigger>
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
                          
                          <Button 
                            onClick={handleAnalyzeCode}
                            disabled={isProcessing || !code.trim()}
                            variant="outline"
                            size="sm"
                            className="w-fit"
                          >
                            🔍 Analyser le code
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleSend} 
                        disabled={isProcessing || ((!userInput.trim()) && (!code.trim() && activeTab === "code"))}
                        className="gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <ArrowUpCircle className="h-4 w-4 animate-spin" />
                            Traitement...
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
            
            {/* Panneau d'information */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-600" />
                    IA Locale - Avantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800">100% Privé</h4>
                        <p className="text-sm text-gray-600">
                          Vos données ne quittent jamais votre navigateur
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Rapide</h4>
                        <p className="text-sm text-gray-600">
                          Pas de dépendance réseau, traitement instantané
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800">Intelligent</h4>
                        <p className="text-sm text-gray-600">
                          Compréhension du langage naturel et analyse de code
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Capacités :</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Explications de concepts</li>
                      <li>• Analyse et débogage de code</li>
                      <li>• Génération d'exercices</li>
                      <li>• Détection d'erreurs</li>
                      <li>• Suggestions d'amélioration</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Langages supportés :</h4>
                    <div className="flex flex-wrap gap-1">
                      {['Python', 'JavaScript', 'Java', 'C', 'C++', 'PHP', 'SQL'].map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LocalAIAssistantPage;
