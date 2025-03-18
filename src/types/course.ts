
export type CourseResourceType = "pdf" | "video" | "presentation";

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
export type CoursePath = "Web Development" | "Data Science" | "Artificial Intelligence" | "Machine Learning" | "Mobile Development";
// Update to match the exact values in the Supabase enum course_category
export type CourseCategory = "Programming Fundamentals" | "Frontend Development" | "Backend Development" | "Data Analysis" | "Machine Learning" | "AI Applications";
export type ExerciseStatus = "pending" | "approved" | "rejected" | "archived" | "draft" | "published";
export type DatabaseExerciseStatus = "pending" | "approved" | "rejected" | "draft" | "published";

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
