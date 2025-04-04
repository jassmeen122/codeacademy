
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserMetric } from '@/types/progress';
import { toast } from 'sonner';

export const useUserMetrics = () => {
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  const fetchMetrics = useCallback(async () => {
    if (!user) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching user metrics directly from database...");
      
      // Direct DB query to get fresh metrics data
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        // Only show error if it's not a "no rows returned" error
        if (error.code !== 'PGRST116') {
          console.error('Error fetching metrics:', error);
          toast.error("Couldn't load your progress data");
        }
        
        // Create default metrics if none found
        console.log("No metrics found, creating default entry");
        
        // Make sure user_id is explicitly set to avoid TypeScript error
        const defaultMetricsData = {
          user_id: user.id,
          course_completions: 0,
          exercises_completed: 0,
          total_time_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('user_metrics')
          .insert(defaultMetricsData)
          .select();
          
        if (insertError) {
          console.error("Failed to create default metrics:", insertError);
          return;
        }
        
        if (newData && newData.length > 0) {
          console.log("Created default metrics:", newData[0]);
          setMetrics(newData[0] as UserMetric);
        }
      } else if (data) {
        console.log("Fetched metrics:", data);
        setMetrics(data as UserMetric);
      } else {
        console.log("No metrics data found");
        
        // Fallback case - create metrics if data is null
        const defaultMetricsData = {
          user_id: user.id,
          course_completions: 0,
          exercises_completed: 0,
          total_time_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_metrics')
          .insert(defaultMetricsData)
          .select();
          
        if (!fallbackError && fallbackData && fallbackData.length > 0) {
          console.log("Created fallback metrics:", fallbackData[0]);
          setMetrics(fallbackData[0] as UserMetric);
        }
      }
    } catch (error) {
      console.error("Error in fetchMetrics:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    fetchMetrics
  };
};
