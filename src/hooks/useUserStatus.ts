
import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { UserStatus } from '@/types/messaging';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserStatus = () => {
  const { user } = useAuthState();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [dbAccessGranted, setDbAccessGranted] = useState<boolean | null>(null);

  // Check if database access is available
  useEffect(() => {
    const checkDbAccess = async () => {
      if (!user) return;
      
      try {
        // Try to access the user_status table
        const { data, error } = await supabase
          .from('user_status')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        // If no error, we have access
        if (!error) {
          console.log("Database access granted for user_status");
          setDbAccessGranted(true);
          
          // If we have data, update our local state
          if (data) {
            setUserStatus(data as UserStatus);
          }
        } else {
          console.warn("Database access denied for user_status:", error.message);
          setDbAccessGranted(false);
          
          // Create a simulated status since we don't have DB access
          setUserStatus({
            id: 'local-' + user.id,
            user_id: user.id,
            status: 'online',
            last_active: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error checking database access:", error);
        setDbAccessGranted(false);
      }
    };
    
    checkDbAccess();
  }, [user]);

  // Mettre à jour son propre statut - version avec fallback local
  const updateStatus = async (status: 'online' | 'offline') => {
    if (!user) return null;

    // If we have DB access, try to update the record
    if (dbAccessGranted) {
      try {
        const { data, error } = await supabase
          .from('user_status')
          .upsert({ 
            user_id: user.id, 
            status, 
            last_active: new Date().toISOString() 
          }, { onConflict: 'user_id' })
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        setUserStatus(data as UserStatus);
        return data;
      } catch (error: any) {
        console.warn("Error updating status in database:", error.message);
        // Fall back to local status
        setDbAccessGranted(false);
      }
    }
    
    // Local fallback if no DB access
    const simulatedStatus = { 
      id: 'local-' + user.id,
      user_id: user.id, 
      status, 
      last_active: new Date().toISOString() 
    };
    
    setUserStatus(simulatedStatus as UserStatus);
    return simulatedStatus;
  };

  // Simulation d'obtention du statut d'un utilisateur
  const getUserStatus = async (userId: string) => {
    // If we have DB access, try to get real status
    if (dbAccessGranted) {
      try {
        const { data, error } = await supabase
          .from('user_status')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (!error && data) {
          return data as UserStatus;
        }
      } catch (error) {
        console.warn("Error fetching user status:", error);
      }
    }
    
    // Fallback to simulated status
    return { 
      id: 'simulated-' + userId,
      user_id: userId,
      status: 'offline',
      last_active: new Date().toISOString()
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
    if (dbAccessGranted) {
      try {
        const channel = supabase
          .channel('public:user_status')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'user_status' 
          }, (payload) => {
            console.log('Status change received:', payload);
            // Handle the change if it's relevant to the current view
          })
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.warn("Error subscribing to status changes:", error);
      }
    }
    
    // Fallback simulation
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
    subscribeToStatusChanges,
    dbAccessGranted
  };
};
