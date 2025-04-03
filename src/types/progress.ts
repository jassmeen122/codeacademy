
export interface UserProgressReport {
  id: string;
  user_id: string;
  completion_percentage: number;
  completed_steps: any[]; // Changed from Json to any[]
  in_progress_steps: any[]; // Changed from Json to any[]
  pending_steps: any[]; // Changed from Json to any[]
  estimated_completion_time: number;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}

export interface UserMetric {
  id: string;
  user_id: string;
  course_completions: number;
  exercises_completed: number;
  total_time_spent: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  skill_name: string;
  progress: number;
  last_updated: string;
}

// Add a database row type to represent what comes from the database
export interface UserSkillRecord {
  id: string;
  user_id: string;
  skill_name: string;
  progress: number;
  last_updated: string;
}

// Add performance tracking interfaces
export interface PerformanceMetric {
  id: string;
  user_id: string;
  exercise_id: string;
  completion_time_seconds: number;
  success: boolean;
  attempts: number;
  errors: string[];
  created_at: string;
}

export interface ProgressTimelinePoint {
  date: string;
  success_rate: number;
  exercises_completed: number;
}

export interface LanguagePerformance {
  language: string;
  success_rate: number;
  exercises_completed: number;
  average_completion_time: number;
}

export interface UserRecommendation {
  id: string;
  user_id: string;
  recommendation_type: 'exercise' | 'course' | 'material' | 'video';
  item_id: string;
  relevance_score: number;
  created_at: string;
  is_viewed: boolean;
  metadata?: {
    title: string;
    description: string;
    difficulty: string;
    language?: string;
    url?: string;
  };
}

export interface TopicMastery {
  topic: string;
  mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  score: number;
  exercises_completed: number;
  last_practiced: string;
}

// Add interface for database tables that we're using
export interface DatabaseTables {
  user_skills_progress: UserSkillRecord;
  user_activities: UserActivity;
  user_metrics: UserMetric;
  performance_metrics: PerformanceMetric;
  user_recommendations: UserRecommendation;
  topic_mastery: TopicMastery;
}
