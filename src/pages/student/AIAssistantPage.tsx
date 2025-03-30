
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { MessageDisplay } from "@/components/ai-assistant/MessageDisplay";
import { InputForm } from "@/components/ai-assistant/InputForm";
import { ErrorDisplay } from "@/components/ai-assistant/ErrorDisplay";
import { ChatActions } from "@/components/ai-assistant/ChatActions";
import { AIAssistantInfo } from "@/components/ai-assistant/AIAssistantInfo";
import { DailyLimitDisplay } from "@/components/ai-assistant/DailyLimitDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";

const AIAssistantPage = () => {
  const { user, isLoading: isAuthLoading } = useAuthState();
  const {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage,
    switchAssistantModel,
    dailyLimit
  } = useAIAssistant();
  
  const [currentTab, setCurrentTab] = useState<string>("chat");

  const handleSwitchModel = () => {
    switchAssistantModel();
    toast.success("Essai avec un modèle alternatif en cours...");
  };

  const handleSendMessage = (userInput: string, code?: string, language?: string) => {
    if (!user && !isAuthLoading) {
      toast.error("Veuillez vous connecter pour utiliser l'assistant IA");
      return;
    }
    
    if (dailyLimit.limitReached) {
      toast.error(`Vous avez atteint votre limite quotidienne de ${dailyLimit.limit} questions. La limite sera réinitialisée à minuit.`);
      return;
    }
    
    sendMessage(userInput, code, language);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">AI Programming Assistant</h1>
            <div className="flex items-center gap-4">
              <TabsList className="hidden sm:flex">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="info">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  À propos
                </TabsTrigger>
              </TabsList>
              <ChatActions 
                onClearChat={clearChat} 
                onRetry={retryLastMessage} 
                showRetry={!!errorMessage} 
              />
            </div>
          </div>

          {errorMessage && (
            <ErrorDisplay errorMessage={errorMessage} onRetry={retryLastMessage}>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 flex items-center gap-1"
                onClick={handleSwitchModel}
              >
                <RefreshCw className="h-3 w-3" /> 
                Essayer un modèle alternatif
              </Button>
            </ErrorDisplay>
          )}
          
          <TabsContent value="chat">
            <Card className="h-[calc(100vh-20rem)]">
              <CardContent className="p-4 h-full flex flex-col">
                {user && <DailyLimitDisplay 
                  count={dailyLimit.count}
                  limit={dailyLimit.limit}
                  limitReached={dailyLimit.limitReached}
                  resetTime={dailyLimit.resetTime}
                />}
                
                <MessageDisplay 
                  messages={messages} 
                  isLoading={isLoading} 
                />
                <InputForm 
                  onSubmit={handleSendMessage} 
                  isLoading={isLoading}
                  disabled={dailyLimit.limitReached || (!user && !isAuthLoading)}
                  limitReached={dailyLimit.limitReached}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <AIAssistantInfo />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
