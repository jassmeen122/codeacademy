
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PrivateMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const usePrivateMessages = (currentUserId?: string) => {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          read,
          profiles!private_messages_sender_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedMessages = (data || []).map(msg => ({
        ...msg,
        sender: msg.profiles
      }));

      setMessages(transformedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, receiverId: string) => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .insert({
          content,
          sender_id: currentUserId,
          receiver_id: receiverId,
          message_type: 'text'
        })
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          read,
          profiles!private_messages_sender_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      if (data) {
        const transformedMessage = {
          ...data,
          sender: data.profiles
        };
        setMessages(prev => [...prev, transformedMessage]);
        toast.success('Message envoyé !');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();

      // Subscribe to real-time updates
      const subscription = supabase
        .channel('private_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages'
          },
          async (payload) => {
            // Only update if the message involves the current user
            if (payload.new.sender_id === currentUserId || payload.new.receiver_id === currentUserId) {
              // Fetch the complete message with sender info
              const { data } = await supabase
                .from('private_messages')
                .select(`
                  id,
                  content,
                  sender_id,
                  receiver_id,
                  created_at,
                  read,
                  profiles!private_messages_sender_id_fkey(
                    full_name,
                    avatar_url
                  )
                `)
                .eq('id', payload.new.id)
                .single();

              if (data) {
                const transformedMessage = {
                  ...data,
                  sender: data.profiles
                };
                setMessages(prev => {
                  // Check if message already exists to avoid duplicates
                  if (prev.some(msg => msg.id === data.id)) {
                    return prev;
                  }
                  return [...prev, transformedMessage];
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUserId]);

  return {
    messages,
    loading,
    sendMessage,
    refetchMessages: fetchMessages
  };
};
