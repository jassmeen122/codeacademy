
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

export type UserPerformanceMetric = {
  id: string;
  user_id: string;
  site_generation_time: number | null;
  response_time: number | null;
  pages_created: number;
  interactions_count: number;
  session_duration: number | null;
  recorded_at: string;
};

export type UserActivity = {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
};

export type UserRecommendation = {
  id: string;
  user_id: string;
  recommendation_type: string;
  item_id: string | null;
  relevance_score: number;
  is_viewed: boolean;
  created_at: string;
};

export type UserProgressReport = {
  id: string;
  user_id: string;
  completion_percentage: number;
  completed_steps: any[];
  in_progress_steps: any[];
  pending_steps: any[];
  estimated_completion_time: number | null;
  updated_at: string;
};

export const useUserPerformance = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<UserPerformanceMetric[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [progressReport, setProgressReport] = useState<UserProgressReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user performance metrics
  const fetchPerformanceMetrics = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setMetrics(data || []);
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    }
  };

  // Fetch user activities
  const fetchUserActivities = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setActivities(data || []);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    }
  };

  // Fetch user recommendations
  const fetchUserRecommendations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRecommendations(data || []);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
    }
  };

  // Fetch user progress report
  const fetchProgressReport = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_progress_reports')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      setProgressReport(data || null);
    } catch (err: any) {
      console.error('Error fetching progress report:', err);
      setError(err.message);
    }
  };

  // Log a new user activity
  const logUserActivity = async (activityType: string, activityData: any = {}) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData
        });
      
      if (error) {
        throw error;
      }
      
      // Refresh activities after logging a new one
      fetchUserActivities();
      // Also refresh recommendations and progress as they may have been updated by triggers
      fetchUserRecommendations();
      fetchProgressReport();
    } catch (err: any) {
      console.error('Error logging activity:', err);
      setError(err.message);
    }
  };

  // Mark a recommendation as viewed
  const markRecommendationAsViewed = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('user_recommendations')
        .update({ is_viewed: true })
        .eq('id', recommendationId);
      
      if (error) {
        throw error;
      }
      
      // Refresh recommendations
      fetchUserRecommendations();
    } catch (err: any) {
      console.error('Error marking recommendation as viewed:', err);
      setError(err.message);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    await Promise.all([
      fetchPerformanceMetrics(),
      fetchUserActivities(),
      fetchUserRecommendations(),
      fetchProgressReport()
    ]);
    
    setLoading(false);
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    metrics,
    activities,
    recommendations,
    progressReport,
    logUserActivity,
    markRecommendationAsViewed,
    refreshData: fetchAllData
  };
};
