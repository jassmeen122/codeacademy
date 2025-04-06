
import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Send, ArrowLeft } from 'lucide-react';
import { usePrivateMessages, PrivateMessage, Conversation } from '@/hooks/usePrivateMessages';
import { useAuthState } from '@/hooks/useAuthState';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const MessagesPage = () => {
  const {
    conversations,
    loading,
    error,
    fetchMessages,
    sendMessage
  } = usePrivateMessages();
  const { user } = useAuthState();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');
  
  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileView('list');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }
      
      setLoadingMessages(true);
      const msgs = await fetchMessages(selectedConversation.user_id);
      if (msgs) {
        setMessages(msgs);
      }
      setLoadingMessages(false);
      
      if (window.innerWidth < 768) {
        setMobileView('conversation');
      }
    };
    
    loadMessages();
  }, [selectedConversation, fetchMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    const message = await sendMessage(selectedConversation.user_id, newMessage);
    if (message) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8">Please sign in to use the messaging feature</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Conversations list */}
          <div className={`md:block ${mobileView === 'list' ? 'block' : 'hidden'}`}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">Loading conversations...</div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">Error: {error}</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No conversations yet</div>
                ) : (
                  <div>
                    {conversations.map((conversation) => (
                      <div key={conversation.user_id}>
                        <div 
                          className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                            selectedConversation?.user_id === conversation.user_id ? 'bg-gray-100 dark:bg-gray-800' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
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
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Messages */}
          <div className={`md:col-span-2 md:block ${mobileView === 'conversation' ? 'block' : 'hidden'}`}>
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-center">
                      {window.innerWidth < 768 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-2" 
                          onClick={() => setMobileView('list')}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage 
                          src={selectedConversation.avatar_url || ''} 
                          alt={selectedConversation.full_name || 'User'} 
                        />
                        <AvatarFallback>
                          {(selectedConversation.full_name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle>{selectedConversation.full_name || 'User'}</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <Separator />
                  
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center">
                        <p>Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isFromMe = message.sender_id === user.id;
                          
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
                    )}
                  </CardContent>
                  
                  <div className="p-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
