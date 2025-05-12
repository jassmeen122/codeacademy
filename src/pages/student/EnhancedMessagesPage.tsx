import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthState } from '@/hooks/useAuthState';
import { usePrivateMessages, PrivateMessage } from '@/hooks/usePrivateMessages';
import { useUserFriends } from '@/hooks/useUserFriends';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Play
} from 'lucide-react';

const EnhancedMessagesPage = () => {
  const { user } = useAuthState();
  const { conversations, fetchMessages, sendMessage } = usePrivateMessages();
  const { friends } = useUserFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFriendId) {
      fetchMessages(selectedFriendId).then(messages => {
        setMessages(messages);
      });
    }
  }, [selectedFriendId, fetchMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriendId(friendId);
  };

  const handleSendMessage = async () => {
    if (selectedFriendId && messageContent.trim() !== '') {
      const newMessage = await sendMessage(selectedFriendId, messageContent);
      if (newMessage) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessageContent('');
      }
    }
  };

  const selectedFriend = friends.find(friend => friend.id === selectedFriendId);

  return (
    <DashboardLayout>
      <div className="container mx-auto h-full flex">
        {/* Friend List */}
        <div className="w-1/4 bg-gray-100 border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Contacts</h2>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {friends.map(friend => (
              <div
                key={friend.id}
                className={`flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-200 cursor-pointer ${selectedFriendId === friend.id ? 'bg-gray-200' : ''}`}
                onClick={() => handleFriendSelect(friend.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar_url || ""} alt={friend.full_name || "Contact"} />
                  <AvatarFallback>{friend.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{friend.full_name}</p>
                  <p className="text-xs text-gray-500">{friend.email}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedFriend.avatar_url || ""} alt={selectedFriend.full_name || "Contact"} />
                    <AvatarFallback>{selectedFriend.full_name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedFriend.full_name}</p>
                    <p className="text-xs text-gray-500">{selectedFriend.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-2 flex flex-col ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`rounded-xl px-4 py-2 ${message.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <Separator />

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-1 rounded-full py-2 px-4 bg-gray-50 border-gray-300 focus:ring-0 focus:border-blue-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="rounded-full p-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                  >
                    <Play className="h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <MessageCircle className="h-12 w-12 text-gray-400" />
              <p className="text-gray-500 ml-2">Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedMessagesPage;
