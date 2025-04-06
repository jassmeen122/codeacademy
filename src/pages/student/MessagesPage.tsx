
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { usePrivateMessages, Conversation, PrivateMessage } from '@/hooks/usePrivateMessages';
import { useAuthState } from '@/hooks/useAuthState';
import { ConversationList } from '@/components/messages/ConversationList';
import { ConversationView } from '@/components/messages/ConversationView';

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
  const [loadingMessages, setLoadingMessages] = useState(false);
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
  
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;
    
    const message = await sendMessage(selectedConversation.user_id, content);
    if (message) {
      setMessages(prev => [...prev, message]);
    }
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card>
            <div className="p-6">
              <p className="text-center py-8">Please sign in to use the messaging feature</p>
            </div>
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
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Conversations</h3>
              </div>
              <div className="overflow-y-auto">
                <ConversationList 
                  conversations={conversations} 
                  loading={loading} 
                  error={error}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                />
              </div>
            </Card>
          </div>
          
          {/* Messages */}
          <div className={`md:col-span-2 md:block ${mobileView === 'conversation' ? 'block' : 'hidden'}`}>
            <ConversationView 
              conversation={selectedConversation}
              messages={messages}
              loadingMessages={loadingMessages}
              currentUser={user}
              onBack={handleBackToList}
              onSendMessage={handleSendMessage}
              isMobile={window.innerWidth < 768}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
