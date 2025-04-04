
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
      console.log("Fetching user metrics...");
      
      // First check if metrics exist at all for the user
      const { data: metricsExists, error: checkError } = await supabase
        .from('user_metrics')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (checkError) {
        console.error('Error checking metrics existence:', checkError);
        throw checkError;
      }
      
      // If metrics don't exist, create a new record
      if (!metricsExists || metricsExists.length === 0) {
        console.log('No metrics found, creating new metrics record');
        
        const newMetricsData = {
          user_id: user.id,
          course_completions: 0,
          exercises_completed: 0,
          total_time_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: insertResult, error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetricsData])
          .select('*');
          
        if (insertError) {
          console.error('Error creating new metrics:', insertError);
          toast.error("Couldn't initialize your progress data");
          setMetrics(null);
        } else if (insertResult && insertResult.length > 0) {
          console.log('Created new metrics record:', insertResult[0]);
          setMetrics(insertResult[0] as UserMetric);
        } else {
          console.error("No data returned after creating metrics");
          setMetrics(null);
        }
      } else {
        // If metrics exist, fetch the full record by ID
        const metricsId = metricsExists[0].id;
        console.log(`Found existing metrics with ID: ${metricsId}`);
        
        const { data: fullMetrics, error: fetchError } = await supabase
          .from('user_metrics')
          .select('*')
          .eq('id', metricsId)
          .single();
        
        if (fetchError) {
          console.error('Error fetching current metrics:', fetchError);
          toast.error("Couldn't load your progress data");
          setMetrics(null);
        } else {
          console.log('Fetched metrics successfully:', fullMetrics);
          setMetrics(fullMetrics as UserMetric);
        }
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
    if (user) {
      fetchMetrics();
    }
  }, [user, fetchMetrics]);

  return {
    metrics,
    loading,
    fetchMetrics
  };
};
