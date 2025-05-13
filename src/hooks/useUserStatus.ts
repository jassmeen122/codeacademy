import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserStatus } from '@/types/messaging';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

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

      if (error) {
        console.error("Failed to update user status:", error);
        if (status === 'online') {
          // Don't show error toasts for routine status updates
          // Only log them for debugging
        }
        return null;
      }
      
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
    // Only update status if we have a user
    if (user) {
      const updateUserStatus = async () => {
        try {
          await updateStatus('online');
        } catch (error) {
          // Just log the error, don't break the app flow
          console.error("Error updating online status:", error);
        }
      };
      
      updateUserStatus();
      
      // Mettre à jour le statut lors de la fermeture de la page
      const handleBeforeUnload = () => {
        try {
          // This needs to be synchronous for beforeunload
          // Using fetch directly to ensure it runs before page unload
          
          // Get current access token from localStorage
          let token = '';
          try {
            // Try to get session from localStorage directly since we can't await in beforeunload
            const supabaseSession = localStorage.getItem('supabase.auth.token');
            if (supabaseSession) {
              const parsedSession = JSON.parse(supabaseSession);
              token = parsedSession?.currentSession?.access_token || '';
            }
          } catch (e) {
            // Fallback if localStorage access fails
            console.error("Failed to get token:", e);
          }
          
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              user_id: user.id,
              status: 'offline',
              last_active: new Date().toISOString()
            })
          };
          
          // Use the current origin for the API URL
          const url = `${window.location.origin}/rest/v1/user_status?on_conflict=user_id`;
          fetch(url, options);
        } catch (e) {
          // Can't do much in beforeunload
          console.error("Error in beforeunload:", e);
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        updateStatus('offline').catch(console.error);
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
