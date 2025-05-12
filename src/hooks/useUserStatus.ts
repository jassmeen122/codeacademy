
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserStatus } from '@/types/messaging';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const useUserStatus = () => {
  const { user } = useAuthState();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);

  // Mettre à jour son propre statut
  const updateStatus = async (status: 'online' | 'offline') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_status')
        .upsert({
          user_id: user.id,
          status,
          last_active: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select('*')
        .single();

      if (error) throw error;
      setUserStatus(data as UserStatus);
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return null;
    }
  };

  // Obtenir le statut d'un utilisateur
  const getUserStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_status')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No data found
          console.error('Erreur lors de la récupération du statut:', error);
        }
        return null;
      }

      return data as UserStatus;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      return null;
    }
  };

  // Formater le statut en ligne pour l'affichage
  const formatOnlineStatus = (status: UserStatus | null) => {
    if (!status) return 'Hors ligne';

    if (status.status === 'online') {
      return 'En ligne';
    }

    return `Vu ${formatDistanceToNow(new Date(status.last_active), { 
      addSuffix: true,
      locale: fr
    })}`;
  };

  // S'inscrire aux changements de statut en temps réel
  const subscribeToStatusChanges = () => {
    const channel = supabase
      .channel('status-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_status'
      }, (payload) => {
        console.log('Status changed:', payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Marquer l'utilisateur comme en ligne au chargement
  useEffect(() => {
    if (user) {
      updateStatus('online');
      
      // Mettre à jour le statut lors de la fermeture de la page
      const handleBeforeUnload = () => {
        updateStatus('offline');
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        updateStatus('offline');
      };
    }
  }, [user]);

  return {
    userStatus,
    updateStatus,
    getUserStatus,
    formatOnlineStatus,
    subscribeToStatusChanges
  };
};
