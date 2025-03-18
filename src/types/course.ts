
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CoursePath = "Web Development" | "Data Science" | "Artificial Intelligence";
export type CourseCategory = 
  | "Programming Fundamentals" 
  | "Frontend Development" 
  | "Backend Development" 
  | "Data Analysis" 
  | "AI Applications"
  | "Machine Learning";

export type CourseResourceType = "video" | "pdf" | "presentation" | "youtube";

export type ExerciseStatus = "draft" | "published" | "archived";
export type DatabaseExerciseStatus = "draft" | "published" | "archived";

export interface CourseResource {
  id: string;
  title: string;
  type: CourseResourceType;
  description?: string | null;
  url?: string;
  content?: string;
  file_url?: string;
  course_id?: string;
  order_index?: number;
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  image: string;
  difficulty: CourseLevel;
  path: CoursePath;
  category: CourseCategory;
  language: string;
  videoUrl?: string;
  isPremium?: boolean;
  price?: number;
  professor: {
    name: string;
    title: string;
  };
  materials: {
    videos: number;
    pdfs: number;
    presentations: number;
  };
  resources?: CourseResource[];
}

// Additional types needed for other parts of the application
export interface CourseLearnResponse {
  id: string;
  title: string;
  content: string;
  course_id: string;
  order: number;
  created_at: string;
  updated_at: string;
}
