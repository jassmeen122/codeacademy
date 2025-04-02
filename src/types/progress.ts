
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
