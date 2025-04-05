
import { useState, useEffect, useCallback } from 'react';
import { ActivityLog } from '@/types/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

export const useUserActivityLogs = (days: number = 30) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();

  const fetchActivityLogs = useCallback(async () => {
    if (!user) {
      console.log("No user available, cannot fetch activity logs");
      setActivityLogs([]);
      setLoading(false);
      return [];
    }
    
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Fetch user activities from the database
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }

      // Process activities into daily logs
      const dailyLogs: Record<string, Record<string, number>> = {};
      
      activities?.forEach(activity => {
        const date = new Date(activity.created_at).toISOString().split('T')[0];
        const type = activity.activity_type;
        
        if (!dailyLogs[date]) {
          dailyLogs[date] = {};
        }
        
        if (!dailyLogs[date][type]) {
          dailyLogs[date][type] = 0;
        }
        
        dailyLogs[date][type] += 1;
      });
      
      // Convert to ActivityLog format
      const logs: ActivityLog[] = [];
      
      Object.entries(dailyLogs).forEach(([date, typeMap]) => {
        Object.entries(typeMap).forEach(([type, count]) => {
          logs.push({
            date,
            count,
            type
          });
        });
      });
      
      setActivityLogs(logs);
      return logs;
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      toast.error('Failed to load activity data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, days]);
  
  useEffect(() => {
    if (user) {
      fetchActivityLogs();
    }
  }, [user, fetchActivityLogs]);

  return { activityLogs, loading, fetchActivityLogs };
};
