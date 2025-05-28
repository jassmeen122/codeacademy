
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DiscussionMessage {
  id: string;
  content: string;
  message_type: 'text' | 'audio';
  audio_url?: string;
  created_at: string;
  user_id: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useDiscussionMessages = () => {
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discussion_messages')
        .select(`
          id,
          content,
          message_type,
          audio_url,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch user profiles separately
      const userIds = [...new Set(data?.map(msg => msg.user_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user profiles
      const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);
      
      // Transform the data to match our interface
      const transformedMessages: DiscussionMessage[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'audio',
        sender: profilesMap.get(msg.user_id) || null
      }));
      
      setMessages(transformedMessages);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, messageType: 'text' | 'audio', audioUrl?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('discussion_messages')
        .insert({
          content,
          message_type: messageType,
          audio_url: audioUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Fetch the user profile for the new message
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        const transformedMessage: DiscussionMessage = {
          ...data,
          message_type: data.message_type as 'text' | 'audio',
          sender: profile || null
        };
        
        setMessages(prev => [...prev, transformedMessage]);
        toast.success('Message envoyé !');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('discussion_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discussion_messages'
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('discussion_messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            // Fetch the user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', data.user_id)
              .single();

            const transformedMessage: DiscussionMessage = {
              ...data,
              message_type: data.message_type as 'text' | 'audio',
              sender: profile || null
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
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetchMessages: fetchMessages
  };
};
