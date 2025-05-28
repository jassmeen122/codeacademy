
export interface UserProgress {
  content_read: number;
  total_content: number;
  correct_answers: number;
  total_answers: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: {
    content_read?: number;
    correct_answers?: number;
    total_answers?: number;
  };
}
