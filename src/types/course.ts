
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

export type ProgrammingLanguage = "JavaScript" | "Python" | "Java" | "C++" | "Ruby" | "Go" | "PHP" | "C" | "SQL";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
// Update CoursePath to match what Supabase expects
export type CoursePath = "Web Development" | "Data Science" | "Artificial Intelligence";
// Update to match the exact values in the Supabase enum course_category
export type CourseCategory = "Programming Fundamentals" | "Frontend Development" | "Backend Development" | "Data Analysis" | "Machine Learning" | "AI Applications";
export type ExerciseStatus = "pending" | "approved" | "rejected" | "archived" | "draft" | "published";
// Update to match the exact values in the Supabase database
export type DatabaseExerciseStatus = "draft" | "published";

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: CourseLevel;
  path: CoursePath;
  category: CourseCategory;
  duration: string;
  language: ProgrammingLanguage;
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
  language: string;
  difficulty: string;
  created_at: string;
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
