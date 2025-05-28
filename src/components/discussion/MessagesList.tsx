
import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  content: string;
  message_type: 'text' | 'audio';
  audio_url?: string;
  created_at: string;
  user_id: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  currentUserId?: string;
}

export const MessagesList = ({ messages, loading, currentUserId }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">Aucun message pour le moment</p>
            <p className="text-sm">Soyez le premier à écrire dans cette discussion !</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
