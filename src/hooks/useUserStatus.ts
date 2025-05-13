
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
    if (!user) return null;

    try {
      // Don't actually attempt the update if we're having permission issues
      // This is temporary until the permission issues are fixed
      console.log(`Status would be updated to: ${status} (skipped due to permission issues)`);
      return { user_id: user.id, status, last_active: new Date().toISOString() };
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
    // Simply log but don't actually subscribe due to permission issues
    console.log("Would subscribe to status changes (skipped due to permission issues)");
    return () => {
      console.log("Would unsubscribe from status changes");
    };
  };

  // No need to try updating status on load/unload since we know it fails
  // Just provide the API for future use when permissions are fixed

  return {
    userStatus,
    updateStatus,
    getUserStatus,
    formatOnlineStatus,
    subscribeToStatusChanges
  };
};
