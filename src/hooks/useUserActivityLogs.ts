
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { ActivityLog } from '@/types/progress';

export function useUserActivityLogs(days = 30) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  const fetchActivityLogs = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log(`Fetching activity logs for the last ${days} days for user ${user.id}`);
      
      // Calculate the date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Get user activities from the database
      const { data, error } = await supabase
        .from('user_activities')
        .select('created_at, activity_type, activity_data')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log(`Found ${data?.length || 0} activity records`);
      
      // Process and group activities by date and type
      const activityMap = new Map();
      
      (data || []).forEach(activity => {
        const date = activity.created_at.split('T')[0];
        const type = activity.activity_type;
        const key = `${date}-${type}`;
        
        if (activityMap.has(key)) {
          activityMap.set(key, {
            date,
            type,
            count: activityMap.get(key).count + 1
          });
        } else {
          activityMap.set(key, {
            date,
            type,
            count: 1
          });
        }
      });
      
      const logs = Array.from(activityMap.values());
      console.log("Processed activity logs:", logs);
      setActivityLogs(logs);
      return logs;
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      toast.error("Failed to load activity logs");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, days]);

  useEffect(() => {
    if (user) {
      fetchActivityLogs();
    } else {
      setActivityLogs([]);
      setLoading(false);
    }
  }, [user, days, fetchActivityLogs]);

  return {
    activityLogs,
    loading,
    fetchActivityLogs
  };
}
