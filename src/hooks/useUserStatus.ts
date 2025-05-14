
import { useState } from 'react';
import { useAuthState } from './useAuthState';
import { UserStatus } from '@/types/messaging';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

export const useUserStatus = () => {
  const { user } = useAuthState();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);

  // Mettre à jour son propre statut - version simulée sans accès à la table
  const updateStatus = async (status: 'online' | 'offline') => {
    if (!user) return null;

    // Simplement simuler la mise à jour sans accès à la base de données
    const simulatedStatus = { 
      user_id: user.id, 
      status, 
      last_active: new Date().toISOString() 
    };
    
    // Mise à jour locale uniquement
    setUserStatus(simulatedStatus as UserStatus);
    return simulatedStatus;
  };

  // Simulation d'obtention du statut d'un utilisateur
  const getUserStatus = async (userId: string) => {
    // Pour l'instant, renvoie simplement un statut par défaut
    return { 
      user_id: userId,
      status: 'offline',
      last_active: new Date().toISOString(),
      id: 'simulated-id'
    } as UserStatus;
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

  // Simulation d'abonnement aux changements de statut
  const subscribeToStatusChanges = () => {
    console.log("Simulation d'abonnement aux changements de statut");
    
    return () => {
      console.log("Désabonnement simulé");
    };
  };

  return {
    userStatus,
    updateStatus,
    getUserStatus,
    formatOnlineStatus,
    subscribeToStatusChanges
  };
};
