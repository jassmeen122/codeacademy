
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { MessageDisplay } from "@/components/ai-assistant/MessageDisplay";
import { InputForm } from "@/components/ai-assistant/InputForm";
import { ErrorDisplay } from "@/components/ai-assistant/ErrorDisplay";
import { ChatActions } from "@/components/ai-assistant/ChatActions";

const AIAssistantPage = () => {
  const {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearChat,
    retryLastMessage
  } = useAIAssistant();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Programming Assistant</h1>
          <ChatActions 
            onClearChat={clearChat} 
            onRetry={retryLastMessage} 
            showRetry={!!errorMessage} 
          />
        </div>

        <ErrorDisplay errorMessage={errorMessage} />
        
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
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
