
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, Video } from 'lucide-react';
import { CallButton } from './CallButton';
import { CallInterface } from './CallInterface';
import { useUserCalls } from '@/hooks/useUserCalls';
import { useEnhancedPrivateMessages } from '@/hooks/useEnhancedPrivateMessages';

interface EnhancedPrivateChatProps {
  selectedUserId: string;
  selectedUserName: string;
  selectedUserAvatar?: string;
}

export const EnhancedPrivateChat: React.FC<EnhancedPrivateChatProps> = ({
  selectedUserId,
  selectedUserName,
  selectedUserAvatar
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { currentCall } = useUserCalls();
  const { sendMessage, fetchMessages } = useEnhancedPrivateMessages();

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await fetchMessages(selectedUserId);
      setMessages(msgs);
    };
    
    if (selectedUserId) {
      loadMessages();
    }
  }, [selectedUserId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = await sendMessage(selectedUserId, message);
    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const isInCallWithUser = currentCall && 
    (currentCall.receiver_id === selectedUserId || currentCall.caller_id === selectedUserId);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedUserAvatar} />
              <AvatarFallback>
                {selectedUserName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{selectedUserName}</CardTitle>
              <p className="text-sm text-gray-500">En ligne</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <CallButton 
              receiverId={selectedUserId}
              receiverName={selectedUserName}
              variant="audio"
              size="sm"
            />
            <CallButton 
              receiverId={selectedUserId}
              receiverName={selectedUserName}
              variant="video"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>

      {/* Call Interface */}
      {isInCallWithUser && (
        <div className="p-4 border-b bg-blue-50">
          <CallInterface 
            call={currentCall}
            userName={selectedUserName}
            userAvatar={selectedUserAvatar}
          />
        </div>
      )}

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender_id === selectedUserId ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.sender_id === selectedUserId 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-blue-500 text-white'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
