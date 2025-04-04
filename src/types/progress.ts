
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

export interface DatabaseTables {
  user_skills_progress: UserSkillRecord;
  user_activities: UserActivity;
  user_metrics: UserMetric;
  // Add other tables as needed
  user_recommendations: UserRecommendation;
}

export interface UserRecommendation {
  id: string;
  user_id: string;
  recommendation_type: 'course' | 'exercise' | 'module' | 'skill';
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

export interface ProgressReportOptions {
  includeSkills: boolean;
  includeCourses: boolean;
  includeActivities: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ProgressReport {
  user: {
    id: string;
    name: string;
    email: string;
  };
  summary: {
    completion_percentage: number;
    total_time_spent: number;
    course_completions: number;
    exercises_completed: number;
    last_activity: string;
  };
  skills?: UserSkill[];
  courses?: {
    id: string;
    title: string;
    completion_percentage: number;
    last_accessed: string;
  }[];
  activities?: ActivityLog[];
  generated_at: string;
}
