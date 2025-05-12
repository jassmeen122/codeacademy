
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
      
      // Créer l'enregistrement d'appel
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
        
      if (error) throw error;
      
      const call = data as UserCall;
      setCurrentCall(call);
      
      return call;
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
      
      const { error } = await supabase
        .from('user_calls')
        .update({
          status,
          ended_at: endTime.toISOString(),
          duration: duration > 0 ? duration : 0
        })
        .eq('id', callId);
        
      if (error) throw error;
      
      setCurrentCall(null);
      fetchCallHistory();
      
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
        
      if (error) throw error;
      
      setCallHistory(data as unknown as UserCall[]);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des appels:', error);
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
