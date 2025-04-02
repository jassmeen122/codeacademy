
import { supabase } from "@/integrations/supabase/client";

type ActivityType = 
  | 'page_view'
  | 'course_started'
  | 'course_completed'
  | 'exercise_started'
  | 'exercise_completed'
  | 'tab_change'
  | 'learning_session'
  | 'code_exercise_completed'
  | 'video_watched'
  | 'practice_session'
  | 'skill_improved'
  | 'achievement_earned'
  | 'points_earned'
  | 'recommendation_action'
  | 'project_started'
  | 'project_in_progress'
  | 'project_completed'
  | 'step_completed'
  | 'site_created'
  | 'feature_used'
  | 'theme_selected'
  | 'page_added'
  | 'comment_added'
  | 'like_added'
  | 'share_content';

/**
 * Track a user activity
 * @param userId User ID
 * @param activityType Type of activity
 * @param activityData Additional data about the activity
 */
export const trackUserActivity = async (
  userId: string,
  activityType: ActivityType,
  activityData: Record<string, any> = {}
): Promise<void> => {
  try {
    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: activityType,
      activity_data: activityData
    });
  } catch (error) {
    console.error('Error tracking user activity:', error);
  }
};

/**
 * Record performance metrics
 * @param userId User ID
 * @param metrics Performance metrics to record
 */
export const recordPerformanceMetrics = async (
  userId: string,
  metrics: {
    siteGenerationTime?: number;
    responseTime?: number;
    pagesCreated?: number;
    interactionsCount?: number;
    sessionDuration?: number;
  }
): Promise<void> => {
  try {
    await supabase.from('user_performance_metrics').insert({
      user_id: userId,
      site_generation_time: metrics.siteGenerationTime,
      response_time: metrics.responseTime,
      pages_created: metrics.pagesCreated,
      interactions_count: metrics.interactionsCount,
      session_duration: metrics.sessionDuration
    });
  } catch (error) {
    console.error('Error recording performance metrics:', error);
  }
};

/**
 * Generate recommendations for a user
 * @param userId User ID
 */
export const generateRecommendations = async (userId: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('user-performance-analysis', {
      body: {
        action: 'generate_recommendations',
        userId
      }
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Recommendations generated:', data);
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }
};

/**
 * Get performance analysis for a user
 * @param userId User ID
 */
export const getPerformanceAnalysis = async (userId: string): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('user-performance-analysis', {
      body: {
        action: 'get_analysis',
        userId
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data.analysis;
  } catch (error) {
    console.error('Error getting performance analysis:', error);
    return null;
  }
};

// Track page load performance
export const trackPageLoadPerformance = (userId: string) => {
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domLoadTime = perfData.domComplete - perfData.domLoading;
    
    recordPerformanceMetrics(userId, {
      responseTime: pageLoadTime,
      sessionDuration: Math.round(Date.now() / 1000) // Current session duration in seconds
    });
  }
};

// Start session tracking
let sessionStartTime: number | null = null;

export const startSessionTracking = () => {
  sessionStartTime = Date.now();
};

// End session tracking and record duration
export const endSessionTracking = (userId: string) => {
  if (sessionStartTime) {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000); // in seconds
    recordPerformanceMetrics(userId, { sessionDuration });
    sessionStartTime = null;
  }
};
