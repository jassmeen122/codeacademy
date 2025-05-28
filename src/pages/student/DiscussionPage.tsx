
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesList } from '@/components/discussion/MessagesList';
import { MessageInput } from '@/components/discussion/MessageInput';
import { useDiscussionMessages } from '@/hooks/useDiscussionMessages';
import { useAuthState } from '@/hooks/useAuthState';
import { MessageSquare } from 'lucide-react';

export default function DiscussionPage() {
  const { messages, loading, sendMessage } = useDiscussionMessages();
  const { user } = useAuthState();

  const handleSendMessage = async (content: string, type: 'text' | 'audio', audioUrl?: string) => {
    await sendMessage(content, type, audioUrl);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8">Veuillez vous connecter pour participer aux discussions</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 h-[calc(100vh-120px)]">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-3xl font-bold">Discussion Forum</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Discutez avec la communauté, partagez vos idées et posez vos questions
          </p>
        </div>
        
        <Card className="h-[calc(100vh-250px)] flex flex-col">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-lg">Messages de la communauté</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <MessagesList 
              messages={messages} 
              loading={loading} 
              currentUserId={user?.id}
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={loading}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
