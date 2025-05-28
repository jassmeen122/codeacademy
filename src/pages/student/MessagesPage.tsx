
import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthState } from '@/hooks/useAuthState';
import { usePrivateMessages, PrivateMessage } from '@/hooks/usePrivateMessages';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Play } from 'lucide-react';

const MessagesPage = () => {
  const { user } = useAuthState();
  const { messages, loading, sendMessage } = usePrivateMessages(user?.id);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSendMessage = async () => {
    if (selectedFriendId && messageContent.trim() !== '') {
      await sendMessage(messageContent, selectedFriendId);
      setMessageContent('');
    }
  };

  // Get unique contacts from messages
  const contacts = React.useMemo(() => {
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

  const selectedContact = contacts.find(contact => contact.id === selectedFriendId);

  const filteredMessages = messages.filter(msg => 
    selectedFriendId && (
      (msg.sender_id === user?.id && msg.receiver_id === selectedFriendId) ||
      (msg.sender_id === selectedFriendId && msg.receiver_id === user?.id)
    )
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto h-full flex">
        {/* Contact List */}
        <div className="w-1/4 bg-gray-100 border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Contacts</h2>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className={`flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-200 cursor-pointer ${selectedFriendId === contact.id ? 'bg-gray-200' : ''}`}
                onClick={() => setSelectedFriendId(contact.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatar_url || ""} alt={contact.full_name || "Contact"} />
                  <AvatarFallback>{contact.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{contact.full_name}</p>
                  <p className="text-xs text-gray-500">{contact.email}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar_url || ""} alt={selectedContact.full_name || "Contact"} />
                    <AvatarFallback>{selectedContact.full_name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedContact.full_name}</p>
                    <p className="text-xs text-gray-500">{selectedContact.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto">
                {filteredMessages.map(message => (
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

export default MessagesPage;
