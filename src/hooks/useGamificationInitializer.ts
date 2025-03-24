
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

export const useGamificationInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const { user, session } = useAuthState();

  useEffect(() => {
    if (user && session && !initialized) {
      const initializeGamification = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('seed-course-data', {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });

          if (error) throw error;
          setInitialized(true);
        } catch (err: any) {
          console.error('Error initializing gamification:', err);
        }
      };

      initializeGamification();
    }
  }, [user, session, initialized]);

  return { initialized };
};
