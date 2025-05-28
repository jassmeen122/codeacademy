
import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthState } from '@/hooks/useAuthState';
import { usePrivateMessages, PrivateMessage } from '@/hooks/usePrivateMessages';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Users,
  BookOpen,
  SendHorizontal
} from 'lucide-react';

const KnowledgeSharePage = () => {
  const { user } = useAuthState();
  const { messages, sendMessage } = usePrivateMessages(user?.id);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [filteredMessages, setFilteredMessages] = useState<PrivateMessage[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFriendId && user?.id) {
      const filtered = messages.filter(
        msg => 
          (msg.sender_id === user.id && msg.receiver_id === selectedFriendId) ||
          (msg.sender_id === selectedFriendId && msg.receiver_id === user.id)
      );
      setFilteredMessages(filtered);
    }
  }, [selectedFriendId, messages, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [filteredMessages]);

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriendId(friendId);
  };

  const handleSendMessage = async () => {
    if (selectedFriendId && messageContent.trim() !== '') {
      await sendMessage(messageContent, selectedFriendId);
      setMessageContent('');
    }
  };

  // Get unique contacts from messages
  const friends = React.useMemo(() => {
    if (!user?.id) return [];
    const contactsMap = new Map();
    
    messages.forEach(msg => {
      const contactId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      const isFromMe = msg.sender_id === user.id;
      
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          id: contactId,
          full_name: isFromMe ? 'Utilisateur' : msg.sender?.full_name || 'Utilisateur',
          avatar_url: isFromMe ? null : msg.sender?.avatar_url,
          email: ''
        });
      }
    });
    
    return Array.from(contactsMap.values());
  }, [messages, user?.id]);

  const selectedFriend = friends.find(friend => friend.id === selectedFriendId);

  return (
    <DashboardLayout>
      <div className="container mx-auto h-full flex">
        {/* Friend List */}
        <div className="w-1/4 bg-white border-r border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className={`flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors mb-2 ${selectedFriendId === friend.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleFriendSelect(friend.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friend.avatar_url || ""} alt={friend.full_name || "Contact"} />
                  <AvatarFallback className="bg-gray-200 text-gray-800">{friend.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{friend.full_name}</p>
                  <p className="text-xs text-gray-600">{friend.email}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col bg-white shadow-sm rounded-lg overflow-hidden m-2">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedFriend.avatar_url || ""} alt={selectedFriend.full_name || "Contact"} />
                    <AvatarFallback className="bg-gray-200 text-gray-800">{selectedFriend.full_name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      {selectedFriend.full_name}
                      <BookOpen className="h-4 w-4 text-green-500" />
                    </p>
                    <p className="text-xs text-gray-600">{selectedFriend.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex flex-col ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`rounded-lg px-4 py-3 max-w-xs lg:max-w-md ${
                      message.sender_id === user?.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <Separator />

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <Input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Partage de Connaissances</h3>
                <p className="text-gray-500">Sélectionnez un contact pour commencer une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeSharePage;
