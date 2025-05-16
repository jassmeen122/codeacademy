
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
        // First ensure the user exists in the user_status table
        const { error: upsertError } = await supabase
          .from('user_status')
          .upsert({ 
            user_id: user.id, 
            status: 'online', 
            last_active: new Date().toISOString() 
          }, { onConflict: 'user_id' });
        
        if (upsertError) {
          console.log("Database access issue when upserting user_status:", upsertError.message);
          
          // Create a simulated status as fallback
          setUserStatus({
            id: 'local-' + user.id,
            user_id: user.id,
            status: 'online',
            last_active: new Date().toISOString()
          });
          setDbAccessGranted(false);
          return;
        }
        
        // Then try to access the user_status table
        const { data, error } = await supabase
          .from('user_status')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // If no error, we have access
        if (!error) {
          console.log("Database access granted for user_status");
          setDbAccessGranted(true);
          
          // If we have data, update our local state
          if (data) {
            setUserStatus(data as UserStatus);
          } else {
            // Create a default status since record wasn't found
            setUserStatus({
              id: 'local-' + user.id,
              user_id: user.id,
              status: 'online',
              last_active: new Date().toISOString()
            });
          }
        } else {
          console.warn("Database access issue for user_status:", error.message);
          setDbAccessGranted(false);
          
          // Create a simulated status as fallback
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
        
        // Fallback to simulated status
        if (user) {
          setUserStatus({
            id: 'local-' + user.id,
            user_id: user.id,
            status: 'online',
            last_active: new Date().toISOString()
          });
        }
      }
    };
    
    // Attempt to initialize or update status
    if (user) {
      setTimeout(() => {
        checkDbAccess();
      }, 1000); // Add some delay to avoid potential auth conflicts
    } else {
      setUserStatus(null);
      setDbAccessGranted(null);
    }
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

  // Subscribe to status changes
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
