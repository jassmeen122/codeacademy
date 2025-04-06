
import React from 'react';
import { Conversation, PrivateMessage } from '@/types/messages';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { UserProfile } from '@/hooks/useAuthState';

interface ConversationViewProps {
  conversation: Conversation | null;
  messages: PrivateMessage[];
  loadingMessages: boolean;
  currentUser: UserProfile | null;
  onBack: () => void;
  onSendMessage: (message: string) => void;
  isMobile: boolean;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  messages,
  loadingMessages,
  currentUser,
  onBack,
  onSendMessage,
  isMobile,
}) => {
  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage 
              src={conversation.avatar_url || ''} 
              alt={conversation.full_name || 'User'} 
            />
            <AvatarFallback>
              {(conversation.full_name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{conversation.full_name || 'User'}</h2>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={messages} 
          loading={loadingMessages} 
          currentUser={currentUser}
        />
      </CardContent>
      
      <div className="p-4 flex-shrink-0">
        <MessageComposer onSendMessage={onSendMessage} />
      </div>
    </Card>
  );
};
