
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, X, MinimizeIcon, Cpu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MessageDisplay } from "@/components/ai-assistant/MessageDisplay";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Textarea } from "@/components/ui/textarea";
import { ErrorDisplay } from "@/components/ai-assistant/ErrorDisplay";
import { ChatActions } from "@/components/ai-assistant/ChatActions";
import { Badge } from "@/components/ui/badge";

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userInput, setUserInput] = useState("");
  const {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage,
    switchAssistantModel,
    toggleLocalAI,
    useLocalAI
  } = useAIAssistant();

  const handleSend = () => {
    if (!userInput.trim() || isLoading) return;
    
    console.log("🎯 Envoi message depuis FloatingAI:", userInput);
    sendMessage(userInput);
    setUserInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      // Nettoyer la suggestion des emojis pour l'envoi
      const cleanSuggestion = suggestion.replace(/^[🐛📚💪🎯🔧🐍🟨🤖⚡🌐🔄]+\s*/, '');
      console.log("💡 Suggestion cliquée:", cleanSuggestion);
      sendMessage(cleanSuggestion);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button - toujours visible */}
      {!isOpen && (
        <Button
          onClick={() => {
            console.log("🚀 Ouverture assistant IA");
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 h-14 w-14 p-0 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-300 animate-pulse hover:animate-none"
          title="Assistant IA - Aide à la programmation"
        >
          {useLocalAI ? <Cpu className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
        </Button>
      )}

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b p-4 bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <div className="flex justify-between items-center">
                <SheetTitle className="flex items-center gap-2 text-white">
                  {useLocalAI ? <Cpu className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
                  Assistant IA {useLocalAI ? "Local" : "Intelligent"}
                  <Badge variant="secondary" className="text-xs">
                    {useLocalAI ? "🤖 Local" : "🌐 Externe"}
                  </Badge>
                </SheetTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <MinimizeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetHeader>

            {!isMinimized && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                  <MessageDisplay 
                    messages={messages} 
                    isLoading={isLoading}
                    onSuggestionClick={handleSuggestionClick}
                  />
                  
                  <ErrorDisplay 
                    errorMessage={errorMessage} 
                    onRetry={retryLastMessage}
                  >
                    <Button 
                      onClick={toggleLocalAI} 
                      variant="outline" 
                      size="sm"
                      className="mr-2"
                    >
                      {useLocalAI ? "🌐 IA Externe" : "🤖 IA Locale"}
                    </Button>
                    <Button 
                      onClick={switchAssistantModel} 
                      variant="outline" 
                      size="sm"
                    >
                      Changer de modèle
                    </Button>
                  </ErrorDisplay>
                </div>

                <div className="border-t p-4 space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <ChatActions 
                      onClearChat={clearChat}
                      onRetry={retryLastMessage}
                      showRetry={messages.length > 1 && !isLoading && messages[messages.length - 1].role === "assistant"}
                    />
                    <Badge variant={useLocalAI ? "default" : "secondary"} className="text-xs">
                      {useLocalAI ? "🤖 Mode Local" : "🌐 Mode Externe"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={useLocalAI ? 
                        "💬 Dis-moi ton problème de code (IA locale)..." : 
                        "💬 Dis-moi ton problème ou pose ta question..."
                      }
                      className="min-h-[80px] resize-none"
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={!userInput.trim() || isLoading}
                      className="self-end"
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
