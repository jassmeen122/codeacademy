
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserMetric } from '@/types/progress';
import { toast } from 'sonner';

export const useUserMetrics = () => {
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  // Simplified fetch metrics function
  const fetchMetrics = useCallback(async () => {
    if (!user) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("⭐ Fetching user metrics...");
      
      // Check if metrics exist for the user
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching metrics:', error);
        toast.error("Couldn't load your progress data");
        setMetrics(null);
      } 
      // If no metrics exist yet, create a new record
      else if (!data) {
        console.log('🌟 No metrics found, creating new metrics record');
        
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
          console.error('Error creating metrics:', insertError);
          toast.error("Couldn't create your progress data");
          setMetrics(null);
        } else if (insertResult && insertResult.length > 0) {
          console.log('📊 Created new metrics record:', insertResult[0]);
          setMetrics(insertResult[0] as UserMetric);
        }
      } 
      // If metrics exist, use the data
      else {
        console.log('📈 Found existing metrics:', data);
        setMetrics(data as UserMetric);
      }
    } catch (error) {
      console.error("Error in fetchMetrics:", error);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch when component mounts or user changes
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
