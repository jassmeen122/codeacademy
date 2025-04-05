
// Basic types that might be used elsewhere in the application
export interface UserSkill {
  id: string;
  skill_name: string;
  progress: number;
  last_updated: string;
}

export interface UserMetric {
  id: string;
  user_id: string;
  course_completions: number;
  exercises_completed: number;
  total_time_spent: number;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  item_id: string;
  relevance_score: number;
  is_viewed: boolean;
  created_at: string;
  item_title?: string;
  item_description?: string;
  item_image?: string;
  reason?: string;
}

export interface ActivityLog {
  date: string;
  count: number;
  type: string;
}

// Interfaces for progress tracking
export interface CourseProgress {
  id: string;
  course_id: string;
  user_id: string;
  completion_percentage: number;
  last_accessed: string;
  modules_completed: string[];
}

export interface ExerciseResult {
  id: string;
  exercise_id: string;
  user_id: string;
  score: number;
  time_taken: number;
  completed_at: string;
}

export interface ProgressSummary {
  total_courses: number;
  completed_courses: number;
  total_exercises: number;
  completed_exercises: number;
  average_score: number;
  total_time_spent: number;
}

export interface SkillProgress {
  name: string;
  progress: number;
  recent_change: number;
  last_activity: string;
}

export interface ImprovementMetric {
  period: string;
  previous_value: number;
  current_value: number;
  percentage_change: number;
}

export interface RecommendationFeedback {
  recommendation_id: string;
  helpful: boolean;
  followed: boolean;
  comments?: string;
}
