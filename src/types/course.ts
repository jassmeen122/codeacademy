
export type CourseResourceType = "pdf" | "video" | "presentation" | "youtube";

export interface CourseResource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  type: CourseResourceType;
  course_id: string | null;
  order_index: number;
  created_at: string | null;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
// Update CoursePath to match what Supabase expects
export type CoursePath = "Web Development" | "Data Science" | "Artificial Intelligence";
// Update to match the exact values in the Supabase enum course_category
export type CourseCategory = "Programming Fundamentals" | "Frontend Development" | "Backend Development" | "Data Analysis" | "Machine Learning" | "AI Applications";
export type ExerciseStatus = "pending" | "approved" | "rejected" | "archived" | "draft" | "published";
// Update to match the exact values in the Supabase database
export type DatabaseExerciseStatus = "draft" | "published";

export interface CourseLesson {
  id: string;
  title: string;
  content?: string;
  module_id: string;
  order_index: number;
  is_published?: boolean;
  requires_completion?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons?: CourseLesson[];
  language_id?: string;
  course_id?: string;
  content?: string | null;
  difficulty?: CourseLevel;
  estimated_duration?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: CourseLevel;
  path: CoursePath;
  category: CourseCategory;
  duration: string;
  language: string;
  students: number;
  image: string;
  professor: {
    name: string;
    title: string;
  };
  materials: {
    videos: number;
    pdfs: number;
    presentations: number;
  };
  price?: number;
  isPremium?: boolean;
  modules?: CourseModule[];
  is_published?: boolean;
}

export interface CourseLearnResponse {
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  content?: string;
  module_id: string;
  module_title: string;
  order_index: number;
  completed: boolean;
}

// Add the CodingQuiz interface for our new mini-game
export interface CodingQuiz {
  id: string;
  question: string;
  correct_answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4?: string;
  language?: string;
  difficulty: string;
  explanation?: string;
  created_at?: string;
}

// Add the UserGamification interface for tracking user points and badges
export interface UserGamification {
  id: string;
  user_id: string;
  points: number;
  badges: string[];
  created_at: string;
  last_played_at: string;
}

// Add Quiz interface for the quizzes
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

// Add CodingExercise interface for the exercises
export interface CodingExercise {
  id: string;
  module_id: string;
  title: string;
  description: string;
  starter_code: string | null;
  expected_output: string | null;
  difficulty: CourseLevel;
  hints: string[] | null;
  created_at: string;
}

// Add UserProgress interface for tracking progress
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
