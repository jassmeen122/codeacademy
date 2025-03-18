
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

export type ProgrammingLanguage = "JavaScript" | "Python" | "Java" | "C++" | "Ruby" | "Go";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CoursePath = "Web Development" | "Data Science" | "Artificial Intelligence" | "Machine Learning" | "Mobile Development";
export type CourseCategory = "Frontend" | "Backend" | "Database" | "DevOps" | "Full Stack" | "UI/UX" | "Cloud Computing";
export type ExerciseStatus = "pending" | "approved" | "rejected";
export type DatabaseExerciseStatus = "pending" | "approved" | "rejected";

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
