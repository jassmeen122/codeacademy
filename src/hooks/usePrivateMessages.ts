
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

export type PrivateMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type Conversation = {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  last_message: string;
  last_message_date: string;
  unread_count: number;
};

export const usePrivateMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthState();

  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get all messages where the user is either sender or receiver
      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          *,
          sender:profiles!private_messages_sender_id_fkey(
            full_name,
            avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation (other user)
      const conversationsMap = new Map<string, Conversation>();

      for (const message of (data || [])) {
        const isUserSender = message.sender_id === user.id;
        const otherUserId = isUserSender ? message.receiver_id : message.sender_id;
        
        // Get correct user profile with null safety checks
        const otherUserProfile = isUserSender ? message.receiver : message.sender;
        
        // Use nullish coalescing for safety and ensure profile objects are properly typed
        const otherUserFullName = otherUserProfile?.full_name ?? 'Unknown User';
        const otherUserAvatar = otherUserProfile?.avatar_url ?? null;
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user_id: otherUserId,
            full_name: otherUserFullName,
            avatar_url: otherUserAvatar,
            last_message: message.content,
            last_message_date: message.created_at,
            unread_count: !isUserSender && !message.read ? 1 : 0
          });
        } else if (!isUserSender && !message.read) {
          // Increment unread count for existing conversation
          const conversation = conversationsMap.get(otherUserId)!;
          conversation.unread_count += 1;
        }
      }

      setConversations(Array.from(conversationsMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (otherUserId: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          *,
          sender:profiles!private_messages_sender_id_fkey(
            full_name,
            avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Mark unread messages as read
      const unreadMessages = (data || []).filter(msg => msg.receiver_id === user.id && !msg.read);
      if (unreadMessages.length > 0) {
        await supabase
          .from('private_messages')
          .update({ read: true })
          .in('id', unreadMessages.map(msg => msg.id));
      }

      // Convert to strongly-typed messages
      const typedMessages: PrivateMessage[] = (data || []).map(message => {
        // Handle potential error responses for sender and receiver
        const senderProfile = typeof message.sender === 'object' && message.sender !== null 
          ? message.sender 
          : { full_name: 'Unknown User', avatar_url: null };
        
        const receiverProfile = typeof message.receiver === 'object' && message.receiver !== null 
          ? message.receiver 
          : { full_name: 'Unknown User', avatar_url: null };

        return {
          id: message.id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          read: message.read,
          created_at: message.created_at,
          sender: senderProfile,
          receiver: receiverProfile
        };
      });

      return typedMessages;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      return [];
    }
  };

  // Send a message to another user
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) {
      toast.error('You must be logged in to send messages');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content
        })
        .select(`
          *,
          sender:sender_id(
            full_name,
            avatar_url
          ),
          receiver:receiver_id(
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update conversations list
      fetchConversations();

      toast.success('Message sent');
      
      // Handle potential error responses for sender and receiver
      const senderProfile = typeof data.sender === 'object' && data.sender !== null 
        ? data.sender 
        : { full_name: 'Unknown User', avatar_url: null };
      
      const receiverProfile = typeof data.receiver === 'object' && data.receiver !== null 
        ? data.receiver 
        : { full_name: 'Unknown User', avatar_url: null };

      return {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        read: data.read,
        created_at: data.created_at,
        sender: senderProfile,
        receiver: receiverProfile
      } as PrivateMessage;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
    }
  };

  // Get unread message count
  const getUnreadCount = async () => {
    if (!user) return 0;

    try {
      const { count, error } = await supabase
        .from('private_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error: any) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  };

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
