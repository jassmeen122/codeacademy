
import { useState } from 'react';
import { useAuthState } from './useAuthState';
import { UserCall } from '@/types/messaging';
import { toast } from 'sonner';

export const useUserCalls = () => {
  const { user } = useAuthState();
  const [currentCall, setCurrentCall] = useState<UserCall | null>(null);
  const [callHistory, setCallHistory] = useState<UserCall[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialiser un appel (mode local uniquement)
  const initiateCall = async (receiverId: string, callType: 'audio' | 'video') => {
    if (!user) {
      toast.error('Vous devez être connecté pour passer un appel');
      return null;
    }

    try {
      setLoading(true);
      
      // Créer un appel local
      const localCall: UserCall = {
        id: 'local-' + Date.now(),
        caller_id: user.id,
        receiver_id: receiverId,
        call_type: callType,
        status: 'ongoing',
        started_at: new Date().toISOString(),
        ended_at: null,
        duration: 0
      };
      
      setCurrentCall(localCall);
      toast.success('Appel initié en mode local');
      return localCall;
    } catch (error) {
      console.error('Erreur lors de l\'initiation de l\'appel:', error);
      toast.error('Impossible de passer l\'appel');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Terminer un appel (mode local uniquement)
  const endCall = async (callId: string, status: 'completed' | 'missed' = 'completed') => {
    try {
      const endTime = new Date();
      const startTime = currentCall ? new Date(currentCall.started_at) : new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
      
      // Mettre à jour l'historique local
      if (currentCall) {
        const completedCall: UserCall = {
          ...currentCall,
          status,
          ended_at: endTime.toISOString(),
          duration: duration > 0 ? duration : 0
        };
        
        setCallHistory(prev => [completedCall, ...prev]);
      }
      
      setCurrentCall(null);
      toast.success('Appel terminé');
      return true;
    } catch (error) {
      console.error('Erreur lors de la fin de l\'appel:', error);
      toast.error('Impossible de terminer l\'appel');
      return false;
    }
  };
  
  // Récupérer l'historique des appels (mode local uniquement)
  const fetchCallHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Historique des appels en mode local');
      // L'historique est déjà géré dans l'état local
    } catch (error) {
      console.warn('Mode local - historique géré en mémoire');
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
