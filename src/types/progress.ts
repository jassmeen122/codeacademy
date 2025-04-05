
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
