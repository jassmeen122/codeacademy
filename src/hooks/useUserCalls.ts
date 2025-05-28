
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserCall } from '@/types/messaging';
import { toast } from 'sonner';

export const useUserCalls = () => {
  const { user } = useAuthState();
  const [currentCall, setCurrentCall] = useState<UserCall | null>(null);
  const [callHistory, setCallHistory] = useState<UserCall[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialiser un appel
  const initiateCall = async (receiverId: string, callType: 'audio' | 'video') => {
    if (!user) {
      toast.error('Vous devez être connecté pour passer un appel');
      return null;
    }

    try {
      setLoading(true);
      
      // Try to create the call record - with graceful fallback if table doesn't exist
      try {
        const { data, error } = await supabase
          .from('user_calls')
          .insert({
            caller_id: user.id,
            receiver_id: receiverId,
            call_type: callType,
            status: 'ongoing'
          })
          .select('*')
          .single();
          
        if (error) {
          console.warn('Could not create call record:', error);
          // Create a local call object as fallback
          const localCall: UserCall = {
            id: 'local-' + Date.now(),
            caller_id: user.id,
            receiver_id: receiverId,
            call_type: callType,
            status: 'ongoing',
            started_at: new Date().toISOString(),
            ended_at: null,
            duration: 0,
            created_at: new Date().toISOString()
          };
          setCurrentCall(localCall);
          return localCall;
        }
        
        const call = data as UserCall;
        setCurrentCall(call);
        return call;
      } catch (dbError) {
        console.warn('Database not available for calls, using local state:', dbError);
        // Fallback to local state
        const localCall: UserCall = {
          id: 'local-' + Date.now(),
          caller_id: user.id,
          receiver_id: receiverId,
          call_type: callType,
          status: 'ongoing',
          started_at: new Date().toISOString(),
          ended_at: null,
          duration: 0,
          created_at: new Date().toISOString()
        };
        setCurrentCall(localCall);
        return localCall;
      }
    } catch (error) {
      console.error('Erreur lors de l\'initiation de l\'appel:', error);
      toast.error('Impossible de passer l\'appel');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Terminer un appel
  const endCall = async (callId: string, status: 'completed' | 'missed' = 'completed') => {
    try {
      const endTime = new Date();
      const startTime = currentCall ? new Date(currentCall.started_at) : new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000); // en secondes
      
      // Try to update the database, but don't fail if it's not available
      try {
        const { error } = await supabase
          .from('user_calls')
          .update({
            status,
            ended_at: endTime.toISOString(),
            duration: duration > 0 ? duration : 0
          })
          .eq('id', callId);
          
        if (error) {
          console.warn('Could not update call record:', error);
        }
      } catch (dbError) {
        console.warn('Database not available for call update:', dbError);
      }
      
      setCurrentCall(null);
      // Only fetch call history if database is available
      if (!callId.startsWith('local-')) {
        fetchCallHistory();
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la fin de l\'appel:', error);
      toast.error('Impossible de terminer l\'appel');
      return false;
    }
  };
  
  // Récupérer l'historique des appels
  const fetchCallHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_calls')
        .select(`
          *,
          caller:caller_id(full_name, avatar_url),
          receiver:receiver_id(full_name, avatar_url)
        `)
        .or(`caller_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('started_at', { ascending: false });
        
      if (error) {
        console.warn('Could not fetch call history:', error);
        setCallHistory([]);
        return;
      }
      
      setCallHistory(data as unknown as UserCall[]);
    } catch (error) {
      console.warn('Database not available for call history:', error);
      setCallHistory([]);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    currentCall,
    callHistory,
    loading,
    initiateCall,
    endCall,
    fetchCallHistory
  };
};
