
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';
import { EnhancedPrivateMessage, EnhancedConversation, VoiceMessage } from '@/types/messaging';

export const useEnhancedPrivateMessages = () => {
  const [conversations, setConversations] = useState<EnhancedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthState();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch conversations with online status
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
      const conversationsMap = new Map<string, EnhancedConversation>();

      for (const message of (data || [])) {
        const isUserSender = message.sender_id === user.id;
        const otherUserId = isUserSender ? message.receiver_id : message.sender_id;
        
        const otherUserProfile = isUserSender ? message.receiver : message.sender;
        const otherUserFullName = otherUserProfile?.full_name ?? 'Utilisateur inconnu';
        const otherUserAvatar = otherUserProfile?.avatar_url ?? null;
        
        // Get user status
        const { data: statusData } = await supabase
          .from('user_status')
          .select('*')
          .eq('user_id', otherUserId)
          .single();
          
        const status = statusData ? statusData.status : 'offline';
        const lastActive = statusData ? statusData.last_active : new Date().toISOString();
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user_id: otherUserId,
            full_name: otherUserFullName,
            avatar_url: otherUserAvatar,
            status: status as 'online' | 'offline',
            last_active: lastActive,
            last_message: message.content,
            last_message_date: message.created_at,
            unread_count: !isUserSender && !message.read ? 1 : 0
          });
        } else if (!isUserSender && !message.read) {
          const conversation = conversationsMap.get(otherUserId)!;
          conversation.unread_count += 1;
        }
      }

      setConversations(Array.from(conversationsMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message);
      toast.error('Impossible de charger les conversations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation, including replies and voice messages
  const fetchMessages = async (otherUserId: string) => {
    if (!user) return [];

    try {
      // Fetch basic messages
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

      // Fetch voice messages
      const { data: voiceMessagesData, error: voiceError } = await supabase
        .from('voice_messages')
        .select('*')
        .in('message_id', data?.map(msg => msg.id) || []);
        
      if (voiceError) throw voiceError;

      // Convert to strongly-typed messages with voice messages attached
      const enhancedMessages: EnhancedPrivateMessage[] = (data || []).map(message => {
        const senderProfile = typeof message.sender === 'object' && message.sender !== null 
          ? message.sender 
          : { full_name: 'Utilisateur inconnu', avatar_url: null };
        
        const receiverProfile = typeof message.receiver === 'object' && message.receiver !== null 
          ? message.receiver 
          : { full_name: 'Utilisateur inconnu', avatar_url: null };

        // Find associated voice message
        const voiceMessage = voiceMessagesData?.find(vm => vm.message_id === message.id);

        return {
          id: message.id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          read: message.read,
          created_at: message.created_at,
          reply_to_id: message.reply_to_id,
          message_type: message.message_type,
          sender: senderProfile,
          receiver: receiverProfile,
          voice_message: voiceMessage || null
        };
      });

      // Process replies (link messages to the messages they reply to)
      const messagesById = new Map<string, EnhancedPrivateMessage>();
      enhancedMessages.forEach(msg => messagesById.set(msg.id, msg));
      
      enhancedMessages.forEach(msg => {
        if (msg.reply_to_id) {
          msg.reply_to_message = messagesById.get(msg.reply_to_id) || null;
        }
      });

      return enhancedMessages;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Impossible de charger les messages');
      return [];
    }
  };

  // Send a text message to another user
  const sendMessage = async (receiverId: string, content: string, replyToId?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer des messages');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: 'text',
          reply_to_id: replyToId || null
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
      
      // Handle potential error responses for sender and receiver
      const senderProfile = typeof data.sender === 'object' && data.sender !== null 
        ? data.sender 
        : { full_name: 'Utilisateur inconnu', avatar_url: null };
      
      const receiverProfile = typeof data.receiver === 'object' && data.receiver !== null 
        ? data.receiver 
        : { full_name: 'Utilisateur inconnu', avatar_url: null };

      return {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        read: data.read,
        created_at: data.created_at,
        reply_to_id: data.reply_to_id,
        message_type: data.message_type,
        sender: senderProfile,
        receiver: receiverProfile
      } as EnhancedPrivateMessage;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Impossible d\'envoyer le message');
      return null;
    }
  };

  // Start recording a voice message
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Impossible de démarrer l\'enregistrement');
    }
  };
  
  // Stop recording and return the audio blob
  const stopRecording = () => {
    return new Promise<Blob>((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      
      if (!mediaRecorder) {
        reject('No recording in progress');
        return;
      }
      
      mediaRecorder.onstop = () => {
        // Clear timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        
        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        resolve(audioBlob);
      };
      
      mediaRecorder.stop();
    });
  };
  
  // Send a voice message
  const sendVoiceMessage = async (receiverId: string, audioBlob: Blob) => {
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer des messages');
      return null;
    }

    try {
      // First, upload the audio file to storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('voice_messages')
        .upload(fileName, audioBlob);
      
      if (uploadError) throw uploadError;
      
      // Create the message
      const { data: messageData, error: messageError } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: 'Message vocal',  // Placeholder content
          message_type: 'voice'
        })
        .select('*')
        .single();
        
      if (messageError) throw messageError;
      
      // Create the voice message record
      const { data: voiceData, error: voiceError } = await supabase
        .from('voice_messages')
        .insert({
          message_id: messageData.id,
          audio_url: uploadData.path,
          duration: recordingTime
        })
        .select('*')
        .single();
        
      if (voiceError) throw voiceError;
      
      // Update conversations list
      fetchConversations();
      
      toast.success('Message vocal envoyé');
      return true;
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      toast.error('Impossible d\'envoyer le message vocal');
      return null;
    }
  };
  
  // Get audio URL from path
  const getVoiceMessageUrl = async (path: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('voice_messages')
        .getPublicUrl(path);
        
      if (error) throw error;
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting voice message URL:', error);
      return null;
    }
  };
  
  // Play a voice message
  const playVoiceMessage = async (voiceMessage: VoiceMessage) => {
    try {
      const url = await getVoiceMessageUrl(voiceMessage.audio_url);
      
      if (!url) {
        throw new Error('Impossible de récupérer l\'URL du message vocal');
      }
      
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      
      audioRef.current.play();
    } catch (error) {
      console.error('Error playing voice message:', error);
      toast.error('Impossible de lire le message vocal');
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

  // Subscribe to new messages
  const subscribeToMessages = () => {
    if (!user) return () => {};
    
    const channel = supabase
      .channel('private_messages_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
        filter: `receiver_id=eq.${user.id}`
      }, payload => {
        // Notification for new message
        if (payload.new && payload.new.sender_id !== user.id) {
          const fetchSender = async () => {
            const { data } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();
              
            toast.info(`Nouveau message de ${data?.full_name || 'Un utilisateur'}`, {
              description: payload.new.content.substring(0, 50) + (payload.new.content.length > 50 ? '...' : '')
            });
          };
          
          fetchSender();
          fetchConversations();
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Initialize by fetching conversations and subscribing to new messages
  useEffect(() => {
    if (user) {
      fetchConversations();
      const unsubscribe = subscribeToMessages();
      return unsubscribe;
    }
  }, [user]);

  // Clean up audio resources
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    getUnreadCount,
    // Voice message functions
    startRecording,
    stopRecording,
    sendVoiceMessage,
    playVoiceMessage,
    getVoiceMessageUrl,
    isRecording,
    recordingTime
  };
};
