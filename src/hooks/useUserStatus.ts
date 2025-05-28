
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

  // Check if database access is available and update status
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

    // Try to update the database in the background
    const updateStatusInDb = async () => {
      try {
        await supabase.rpc('update_user_status_safe', { status_value: 'online' });
        setDbAccessGranted(true);
        console.log("User status updated successfully in database");
      } catch (error) {
        console.warn("Error with user status (non-critical):", error);
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
    
    // Try to update database
    try {
      await supabase.rpc('update_user_status_safe', { status_value: status });
      setDbAccessGranted(true);
    } catch (error) {
      console.warn("Could not update status in database (non-critical):", error);
      setDbAccessGranted(false);
    }
    
    return localStatus;
  };

  // Get status of a specific user
  const getUserStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_status')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        // Convert the database response to match our UserStatus type
        return {
          id: data.id.toString(), // Convert number to string
          user_id: data.user_id,
          status: data.status,
          last_active: data.last_active
        } as UserStatus;
      }
    } catch (error) {
      console.warn("Could not get user status from database:", error);
    }

    // Return simulated status if database access fails
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

  // Subscribe to status changes
  const subscribeToStatusChanges = () => {
    if (!dbAccessGranted) {
      return () => {};
    }

    try {
      const subscription = supabase
        .channel('user_status_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_status' },
          (payload) => {
            console.log('Status change received:', payload);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.warn("Could not subscribe to status changes:", error);
      return () => {};
    }
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
