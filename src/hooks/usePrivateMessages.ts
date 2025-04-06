
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { useNotifications } from '@/hooks/useNotifications';
import { Conversation, PrivateMessage } from '@/types/messages';
import * as messageService from '@/services/messageService';

export type { PrivateMessage, Conversation } from '@/types/messages';

export const usePrivateMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthState();
  const { createNotification } = useNotifications();

  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await messageService.fetchConversations(user.id);
      setConversations(result);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (otherUserId: string) => {
    if (!user) return [];
    return messageService.fetchMessages(user.id, otherUserId);
  };

  // Send a message to another user
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return null;
    const result = await messageService.sendMessage(
      user.id, 
      receiverId, 
      content,
      createNotification
    );
    
    // Update conversations list if message was sent successfully
    if (result) {
      fetchConversations();
    }
    
    return result;
  };

  // Get unread message count
  const getUnreadCount = async () => {
    if (!user) return 0;
    return messageService.getUnreadCount(user.id);
  };

  // Subscribe to real-time updates for private messages
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('public:private_messages')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'private_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          fetchConversations();
          
          // Show a toast notification when receiving a new message
          if (payload.new && payload.new.sender_id) {
            // Get sender info
            supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single()
              .then(({ data }) => {
                const senderName = data?.full_name || 'Someone';
                const message = `New message from ${senderName}`;
                
                // Only show toast if we're not already on the messages page
                if (!window.location.pathname.includes('/messages')) {
                  import('sonner').then(({ toast }) => {
                    toast(message, {
                      description: 'Click to view',
                      action: {
                        label: 'View',
                        onClick: () => window.location.href = '/student/messages',
                      },
                    });
                  });
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  // Initialize by fetching conversations
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    getUnreadCount
  };
};
