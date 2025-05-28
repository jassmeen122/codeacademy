
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface PrivateChatProps {
  selectedUserId: string;
  selectedUserName: string;
  currentUserId: string;
  messages: Message[];
  onSendMessage: (content: string, receiverId: string) => void;
  loading?: boolean;
}

export const PrivateChat = ({ 
  selectedUserId, 
  selectedUserName, 
  currentUserId, 
  messages, 
  onSendMessage,
  loading 
}: PrivateChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage, selectedUserId);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredMessages = messages.filter(
    msg => 
      (msg.sender_id === currentUserId && msg.receiver_id === selectedUserId) ||
      (msg.sender_id === selectedUserId && msg.receiver_id === currentUserId)
  );

  return (
    <Card className="h-full flex flex-col shadow-lg">
      {/* Chat Header */}
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-blue-500 text-white">
                  {selectedUserName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gray-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {selectedUserName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discussion privée
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/20">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Chargement des messages...</div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium mb-1">Aucun message pour le moment</p>
                <p className="text-sm">Commencez la conversation avec {selectedUserName} !</p>
              </div>
            </div>
          ) : (
            <>
              {filteredMessages.map((message) => {
                const isOwnMessage = message.sender_id === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                      {!isOwnMessage && (
                        <Avatar className="h-7 w-7 border border-gray-200">
                          <AvatarImage src={message.sender?.avatar_url || ''} />
                          <AvatarFallback className="text-xs bg-gray-100">
                            {(message.sender?.full_name || selectedUserName).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`group relative`}>
                        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                          isOwnMessage 
                            ? 'bg-blue-500 text-white rounded-br-md' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
                        }`}>
                          <div className="break-words leading-relaxed">{message.content}</div>
                        </div>
                        <div className={`text-xs mt-1 opacity-70 px-1 ${
                          isOwnMessage ? 'text-right text-gray-600' : 'text-left text-gray-500'
                        }`}>
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true,
                            locale: fr 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder={`Écrivez à ${selectedUserName}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className="rounded-full h-10 w-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Appuyez sur Entrée pour envoyer
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
