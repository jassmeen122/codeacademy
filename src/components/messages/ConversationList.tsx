
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '@/types/messages';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  error,
  selectedConversation,
  onSelectConversation,
}) => {
  if (loading) {
    return <div className="p-4 text-center">Loading conversations...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (conversations.length === 0) {
    return <div className="p-4 text-center text-gray-500">No conversations yet</div>;
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <div key={conversation.user_id}>
          <div 
            className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
              selectedConversation?.user_id === conversation.user_id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={conversation.avatar_url || ''} alt={conversation.full_name || 'User'} />
              <AvatarFallback>{(conversation.full_name || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{conversation.full_name || 'User'}</h3>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.last_message_date), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 truncate flex-1">
                  {conversation.last_message}
                </p>
                {conversation.unread_count > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </div>
  );
};
