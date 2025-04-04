
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { ActivityLog } from '@/types/progress';

export function useUserActivityLogs(days = 30) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchActivityLogs();
    } else {
      setActivityLogs([]);
      setLoading(false);
    }
  }, [user, days]);

  const fetchActivityLogs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
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
      setActivityLogs(logs);
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  return {
    activityLogs,
    loading,
    fetchActivityLogs
  };
}
