
export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  progress: number;
  last_updated: string;
  created_at: string;
}

export interface UserProgressDetailed {
  id: string;
  user_id: string;
  module_id: string;
  chapter_name: string;
  completion_percentage: number;
  completed_steps: any[];
  in_progress_steps: any[];
  pending_steps: any[];
  estimated_completion_time?: number;
  last_accessed: string;
  updated_at: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'code_fix' | 'quiz' | 'speed_coding';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_limit: number;
  code_snippet?: string;
  expected_output?: string;
  correct_answer?: string;
  points_reward: number;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

export interface ChallengeSubmission {
  id: string;
  user_id: string;
  challenge_id: string;
  submission_code?: string;
  submitted_answer?: string;
  time_taken: number;
  is_correct: boolean;
  points_earned: number;
  submitted_at: string;
}

export interface UserLeaderboard {
  id: string;
  user_id: string;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  current_streak: number;
  longest_streak: number;
  badges_earned: number;
  challenges_completed: number;
  last_activity: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  points_required: number;
}
