
export interface UserProgress {
  id: string;
  user_id: string;
  content_read: number;
  total_content: number;
  correct_answers: number;
  total_answers: number;
  badges_earned: string[];
  last_updated: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: 'reading' | 'answers' | 'streak';
  requirement_value: number;
}

export interface ProgressStats {
  contentProgress: number;
  answersProgress: number;
  badges: Badge[];
}
