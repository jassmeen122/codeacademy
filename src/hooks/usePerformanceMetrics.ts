
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { PerformanceMetric, ProgressTimelinePoint, LanguagePerformance, UserRecommendation } from "@/types/progress";

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [timeline, setTimeline] = useState<ProgressTimelinePoint[]>([]);
  const [languagePerformance, setLanguagePerformance] = useState<LanguagePerformance[]>([]);
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchMetrics();
      fetchRecommendations();
    } else {
      setMetrics([]);
      setTimeline([]);
      setLanguagePerformance([]);
      setRecommendations([]);
      setLoading(false);
    }
  }, [user]);

  const fetchMetrics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch performance metrics
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMetrics(data as PerformanceMetric[] || []);
      
      // Process timeline data
      const timelineData = processTimelineData(data as PerformanceMetric[]);
      setTimeline(timelineData);
      
      // Process language performance data
      const languageData = processLanguageData(data as PerformanceMetric[]);
      setLanguagePerformance(languageData);
      
    } catch (error: any) {
      console.error("Error fetching performance metrics:", error);
      toast.error("Failed to load performance metrics");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecommendations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_viewed', false)
        .order('relevance_score', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setRecommendations(data as UserRecommendation[] || []);
      
    } catch (error: any) {
      console.error("Error fetching recommendations:", error);
    }
  };
  
  const markRecommendationAsViewed = async (recommendationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_recommendations')
        .update({ is_viewed: true })
        .eq('id', recommendationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setRecommendations(prev => 
        prev.filter(rec => rec.id !== recommendationId)
      );
      
    } catch (error: any) {
      console.error("Error marking recommendation as viewed:", error);
    }
  };
  
  // Helper functions to process data
  const processTimelineData = (metrics: PerformanceMetric[]): ProgressTimelinePoint[] => {
    // Group metrics by date
    const groupedByDate = metrics.reduce((acc, metric) => {
      const date = new Date(metric.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { successes: 0, total: 0 };
      }
      if (metric.success) {
        acc[date].successes++;
      }
      acc[date].total++;
      
      return acc;
    }, {} as Record<string, { successes: number, total: number }>);
    
    // Convert to timeline points
    return Object.entries(groupedByDate).map(([date, stats]) => ({
      date,
      success_rate: stats.total > 0 ? (stats.successes / stats.total) * 100 : 0,
      exercises_completed: stats.total
    })).sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const processLanguageData = (metrics: PerformanceMetric[]): LanguagePerformance[] => {
    // This is a simplified implementation that would need proper language detection
    // In a real app, we would have language information in the metrics data
    
    // For now, we'll create sample data
    // In a real implementation, you would extract the language from exercise_id or metadata
    
    const languages = ['JavaScript', 'Python', 'Java', 'SQL'];
    
    return languages.map(language => {
      // Filter metrics that might be for this language
      const langMetrics = metrics.filter(m => 
        m.exercise_id.toLowerCase().includes(language.toLowerCase())
      );
      
      const successCount = langMetrics.filter(m => m.success).length;
      const totalCount = langMetrics.length;
      
      return {
        language,
        success_rate: totalCount > 0 ? (successCount / totalCount) * 100 : 0,
        exercises_completed: totalCount,
        average_completion_time: totalCount > 0 
          ? langMetrics.reduce((sum, m) => sum + m.completion_time_seconds, 0) / totalCount 
          : 0
      };
    });
  };

  return {
    metrics,
    timeline,
    languagePerformance,
    recommendations,
    loading,
    markRecommendationAsViewed,
    refreshMetrics: fetchMetrics,
    refreshRecommendations: fetchRecommendations
  };
};
