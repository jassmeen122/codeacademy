
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { PrivateMessage } from '@/types/messages';
import { UserProfile } from '@/hooks/useAuthState';

interface MessageListProps {
  messages: PrivateMessage[];
  loading: boolean;
  currentUser: UserProfile | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isFromMe = currentUser && message.sender_id === currentUser.id;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
          >
            {!isFromMe && (
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage 
                  src={message.sender?.avatar_url || ''} 
                  alt={message.sender?.full_name || 'User'} 
                />
                <AvatarFallback>
                  {(message.sender?.full_name || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-[70%]`}>
              <div 
                className={`p-3 rounded-lg ${
                  isFromMe 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
