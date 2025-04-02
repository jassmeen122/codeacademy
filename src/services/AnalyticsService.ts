
import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 
  | 'course_view' 
  | 'exercise_completion'
  | 'login'
  | 'logout'
  | 'quiz_completion'
  | 'video_watch'
  | 'document_view'
  | 'code_execution';

interface TrackActivityProps {
  userId: string;
  activityType: ActivityType;
  courseId?: string;
  moduleId?: string;
  activityData?: Record<string, any>;
}

interface UpdateUserMetricsProps {
  userId: string;
  updates: {
    course_completions?: number;
    exercises_completed?: number;
    total_time_spent?: number;
    last_login?: Date;
  };
}

/**
 * Analytics Service for tracking user activity and metrics
 */
export class AnalyticsService {
  /**
   * Track a user activity
   */
  static async trackActivity({
    userId,
    activityType,
    courseId,
    moduleId,
    activityData = {}
  }: TrackActivityProps): Promise<boolean> {
    try {
      // Don't track if no userId is provided
      if (!userId) return false;

      const { error } = await supabase
        .from('user_activity' as any)
        .insert({
          user_id: userId,
          activity_type: activityType,
          course_id: courseId,
          module_id: moduleId,
          activity_data: activityData
        });

      if (error) {
        console.error("Error tracking activity:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception tracking activity:", error);
      return false;
    }
  }

  /**
   * Update user metrics
   */
  static async updateUserMetrics({
    userId,
    updates
  }: UpdateUserMetricsProps): Promise<boolean> {
    try {
      if (!userId) return false;

      // First check if user metrics record exists
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics' as any)
        .select('id')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching user metrics:", fetchError);
        return false;
      }

      // If metrics exist, update them
      if (existingMetrics) {
        const { error: updateError } = await supabase
          .from('user_metrics' as any)
          .update(updates as any)
          .eq('user_id', userId);

        if (updateError) {
          console.error("Error updating user metrics:", updateError);
          return false;
        }
      } else {
        // Otherwise, create a new metrics record
        const { error: insertError } = await supabase
          .from('user_metrics' as any)
          .insert({
            user_id: userId,
            ...updates
          } as any);

        if (insertError) {
          console.error("Error creating user metrics:", insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Exception updating user metrics:", error);
      return false;
    }
  }

  /**
   * Track login activity
   */
  static async trackLogin(userId: string): Promise<boolean> {
    try {
      const activityTracked = await this.trackActivity({
        userId,
        activityType: 'login'
      });

      const metricsUpdated = await this.updateUserMetrics({
        userId,
        updates: {
          last_login: new Date()
        }
      });

      return activityTracked && metricsUpdated;
    } catch (error) {
      console.error("Exception tracking login:", error);
      return false;
    }
  }

  /**
   * Track course view
   */
  static async trackCourseView(userId: string, courseId: string): Promise<boolean> {
    return this.trackActivity({
      userId,
      activityType: 'course_view',
      courseId
    });
  }

  /**
   * Track exercise completion and update metrics
   */
  static async trackExerciseCompletion(
    userId: string, 
    courseId: string,
    timeTaken: number
  ): Promise<boolean> {
    try {
      const activityTracked = await this.trackActivity({
        userId,
        activityType: 'exercise_completion',
        courseId,
        activityData: { time_taken: timeTaken }
      });

      // Get current metrics to increment values
      const { data: metrics } = await supabase
        .from('user_metrics' as any)
        .select('exercises_completed, total_time_spent')
        .eq('user_id', userId)
        .single();

      const metricsUpdated = await this.updateUserMetrics({
        userId,
        updates: {
          exercises_completed: ((metrics as any)?.exercises_completed || 0) + 1,
          total_time_spent: ((metrics as any)?.total_time_spent || 0) + Math.floor(timeTaken / 60) // Convert to minutes
        }
      });

      return activityTracked && metricsUpdated;
    } catch (error) {
      console.error("Exception tracking exercise completion:", error);
      return false;
    }
  }
}
