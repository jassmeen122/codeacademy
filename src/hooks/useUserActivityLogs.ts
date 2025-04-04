
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { ActivityLog } from '@/types/progress';

export const useUserActivityLogs = (days: number = 30) => {
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
      
      // Format for database query
      const startDateStr = startDate.toISOString();
      
      // Get user activities
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!activities || activities.length === 0) {
        console.log("No activities found");
        setActivityLogs([]);
        return;
      }
      
      console.log(`Found ${activities.length} activity records`);
      
      // Process and group activities by date and type
      const groupedActivities: Map<string, Map<string, number>> = new Map();
      
      activities.forEach(activity => {
        const date = new Date(activity.created_at).toISOString().split('T')[0];
        const type = activity.activity_type;
        
        if (!groupedActivities.has(date)) {
          groupedActivities.set(date, new Map());
        }
        
        const dateGroup = groupedActivities.get(date)!;
        dateGroup.set(type, (dateGroup.get(type) || 0) + 1);
      });
      
      // Convert to the expected format
      const processedLogs: ActivityLog[] = [];
      
      groupedActivities.forEach((typeMap, date) => {
        typeMap.forEach((count, type) => {
          processedLogs.push({
            date,
            type,
            count
          });
        });
      });
      
      console.log("Processed activity logs:", processedLogs);
      setActivityLogs(processedLogs);
      
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  }, [user, days]);

  // Fetch logs on component mount and when dependencies change
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
};
