
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  image: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  path: "Web Development" | "Data Science" | "Artificial Intelligence";
  category: "Programming Fundamentals" | "Frontend Development" | "Backend Development" | "Machine Learning" | "Data Analysis" | "AI Applications";
  language: string;
  professor: {
    name: string;
    title: string;
  };
  materials: {
    videos: number;
    pdfs: number;
    presentations: number;
  };
  isPremium?: boolean;
  price?: number;
}

export type CourseResourceType = "pdf" | "video" | "presentation" | "youtube";

export interface CourseResource {
  id: string;
  course_id: string | null;
  created_at: string | null;
  title: string;
  description: string | null;
  file_url: string;
  type: CourseResourceType;
  order_index: number;
}

export interface CourseLearnResponse {
  course_id: string;
  module_id: string;
  module_title: string;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
  completed: boolean;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  language_id: string;
  title: string;
  description: string | null;
  order_index: number;
  content: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_duration: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  module_id: string;
  question: string;
  correct_answer: string;
  option1: string;
  option2: string;
  option3: string | null;
  explanation: string | null;
  created_at: string;
}

export interface CodingExercise {
  id: string;
  module_id: string;
  title: string;
  description: string;
  starter_code: string | null;
  expected_output: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hints: string[] | null;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  quiz_score: number | null;
  exercise_completed: boolean;
  last_accessed: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  points: number;
  start_date: string;
  end_date: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  completed: boolean;
  completion_date: string | null;
  status?: string;
}

export type ExerciseStatus = "pending" | "approved" | "rejected" | "archived" | "draft" | "published";
