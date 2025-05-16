
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
  const [dbAccessGranted, setDbAccessGranted] = useState<boolean>(false);

  // Check if database access is available - with fallback
  useEffect(() => {
    if (!user) {
      setUserStatus(null);
      return;
    }
    
    // Always create a local status object immediately
    const localStatus = {
      id: 'local-' + user.id,
      user_id: user.id,
      status: 'online',
      last_active: new Date().toISOString()
    };
    
    // Set the local status immediately
    setUserStatus(localStatus as UserStatus);

    // Then try to update the database in the background
    const updateStatusInDb = async () => {
      try {
        // Try to access the user_status table
        const { data, error } = await supabase
          .from('user_status')
          .upsert({ 
            user_id: user.id, 
            status: 'online', 
            last_active: new Date().toISOString() 
          }, { onConflict: 'user_id' });
          
        // If successful, we have db access
        if (!error) {
          console.log("Database access granted for user_status");
          setDbAccessGranted(true);
        } else {
          console.warn("Cannot access user_status table:", error.message);
          setDbAccessGranted(false);
        }
      } catch (error) {
        console.warn("Error checking user_status database access:", error);
        setDbAccessGranted(false);
      }
    };
    
    // Try to update status in background
    updateStatusInDb();
    
  }, [user]);

  // Update own status - with fallback for when DB access fails
  const updateStatus = async (status: 'online' | 'offline') => {
    if (!user) return null;

    const localStatus = { 
      id: userStatus?.id || 'local-' + user.id,
      user_id: user.id, 
      status, 
      last_active: new Date().toISOString() 
    };

    // Always update local state immediately
    setUserStatus(localStatus as UserStatus);
    
    // If we have DB access, try to update the record
    if (dbAccessGranted) {
      try {
        const { error } = await supabase
          .from('user_status')
          .upsert({ 
            user_id: user.id, 
            status, 
            last_active: new Date().toISOString() 
          }, { onConflict: 'user_id' });
          
        if (error) {
          console.warn("Error updating status in database (non-critical):", error.message);
        }
        
        return localStatus;
      } catch (error: any) {
        console.warn("Error updating status (non-critical):", error.message);
      }
    }
    
    return localStatus;
  };

  // Get status of a specific user
  const getUserStatus = async (userId: string) => {
    // If we have DB access, try to get real status
    if (dbAccessGranted) {
      try {
        const { data, error } = await supabase
          .from('user_status')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (!error && data) {
          return data as UserStatus;
        }
      } catch (error) {
        console.warn("Error fetching user status (non-critical):", error);
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

  // Format status for display
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

  // Subscribe to status changes - with fallback
  const subscribeToStatusChanges = () => {
    if (dbAccessGranted) {
      try {
        const channel = supabase
          .channel('user_status_changes')
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
        console.warn("Error subscribing to status changes (non-critical):", error);
      }
    }
    
    return () => {}; // Empty cleanup function as fallback
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
