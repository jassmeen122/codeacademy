
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { MessageDisplay } from "@/components/ai-assistant/MessageDisplay";
import { InputForm } from "@/components/ai-assistant/InputForm";
import { ErrorDisplay } from "@/components/ai-assistant/ErrorDisplay";
import { ChatActions } from "@/components/ai-assistant/ChatActions";
import { AIAssistantInfo } from "@/components/ai-assistant/AIAssistantInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

const AIAssistantPage = () => {
  const {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage
  } = useAIAssistant();
  
  const [currentTab, setCurrentTab] = useState<string>("chat");

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

          <ErrorDisplay errorMessage={errorMessage} onRetry={retryLastMessage} />
          
          <TabsContent value="chat">
            <Card className="h-[calc(100vh-12rem)]">
              <CardContent className="p-4 h-full flex flex-col">
                <MessageDisplay 
                  messages={messages} 
                  isLoading={isLoading} 
                />
                <InputForm 
                  onSubmit={sendMessage} 
                  isLoading={isLoading} 
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
