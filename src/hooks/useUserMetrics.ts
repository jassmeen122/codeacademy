
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
      
      // First, try to fetch any existing metrics
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching metrics:', fetchError);
        toast.error("Couldn't load your progress data");
      }
      
      // If we already have metrics, use them
      if (existingMetrics) {
        console.log("Found existing metrics:", existingMetrics);
        setMetrics(existingMetrics as UserMetric);
        setLoading(false);
        return;
      }
      
      // If no metrics found, create a new entry
      console.log("No metrics found, creating default metrics");
      
      // Create with explicit values to satisfy TypeScript
      const newMetricsData = {
        user_id: user.id,
        course_completions: 0,
        exercises_completed: 0,
        total_time_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('user_metrics')
        .insert(newMetricsData)
        .select();
      
      if (insertError) {
        console.error("Failed to create metrics:", insertError);
        toast.error("Couldn't initialize your progress data");
        setMetrics(null);
      } else if (newData && newData.length > 0) {
        console.log("Created new metrics:", newData[0]);
        setMetrics(newData[0] as UserMetric);
      } else {
        console.error("No data returned after creating metrics");
        setMetrics(null);
      }
    } catch (error) {
      console.error("Error in fetchMetrics:", error);
      toast.error("An error occurred while loading your progress");
      setMetrics(null);
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
