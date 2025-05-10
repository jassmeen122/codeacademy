
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, X, MinimizeIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MessageDisplay } from "@/components/ai-assistant/MessageDisplay";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Textarea } from "@/components/ui/textarea";
import { ErrorDisplay } from "@/components/ai-assistant/ErrorDisplay";
import { ChatActions } from "@/components/ai-assistant/ChatActions";

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
    switchAssistantModel
  } = useAIAssistant();

  const handleSend = () => {
    if (!userInput.trim() || isLoading) return;
    
    sendMessage(userInput);
    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 h-14 w-14 p-0"
        >
          <Brain className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b p-4">
              <div className="flex justify-between items-center">
                <SheetTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Assistant IA
                </SheetTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8"
                  >
                    <MinimizeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetHeader>

            {!isMinimized && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
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
                      Changer de modèle
                    </Button>
                  </ErrorDisplay>
                </div>

                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <ChatActions 
                      onClearChat={clearChat}
                      onRetry={retryLastMessage}
                      showRetry={messages.length > 1 && !isLoading && messages[messages.length - 1].role === "assistant"}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Posez votre question..."
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
