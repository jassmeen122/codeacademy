
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
  Play,
  Users,
  BookOpen,
  Sparkles,
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
      <div className="container mx-auto h-full flex animate-fade-in">
        {/* Friend List */}
        <div className="w-1/4 bg-gradient-to-br from-blue-50 to-purple-50 border-r border-blue-200 p-4 animate-slide-in-right">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-800">Contacts</h2>
            <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {friends.map((friend, index) => (
              <div
                key={friend.id}
                className={`flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-300 hover-scale mb-2 ${selectedFriendId === friend.id ? 'bg-blue-100 shadow-md' : ''}`}
                onClick={() => handleFriendSelect(friend.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                  <AvatarImage src={friend.avatar_url || ""} alt={friend.full_name || "Contact"} />
                  <AvatarFallback className="bg-blue-200 text-blue-800">{friend.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-blue-900">{friend.full_name}</p>
                  <p className="text-xs text-blue-600">{friend.email}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col bg-white shadow-xl rounded-lg overflow-hidden m-2 animate-scale-in">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 p-4 animate-slide-in-right">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-300">
                    <AvatarImage src={selectedFriend.avatar_url || ""} alt={selectedFriend.full_name || "Contact"} />
                    <AvatarFallback className="bg-blue-200 text-blue-800">{selectedFriend.full_name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      {selectedFriend.full_name}
                      <BookOpen className="h-4 w-4 text-green-500" />
                    </p>
                    <p className="text-xs text-blue-600">{selectedFriend.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
                {filteredMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex flex-col animate-fade-in ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`rounded-xl px-4 py-3 max-w-xs lg:max-w-md hover-scale transition-all duration-300 ${
                      message.sender_id === user?.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-white text-gray-800 shadow-md border border-gray-200'
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
              <div className="p-4 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <Input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 rounded-full py-3 px-4 bg-white border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="rounded-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover-scale shadow-lg"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center animate-scale-in">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-bounce" />
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
