
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CoursePath = "Web Development" | "Data Science" | "Artificial Intelligence";
export type CourseCategory = 
  | "Programming Fundamentals" 
  | "Frontend Development" 
  | "Backend Development" 
  | "Data Analysis" 
  | "AI Applications";

export type CourseResourceType = "video" | "pdf" | "presentation" | "youtube";

export interface CourseResource {
  id: string;
  title: string;
  type: CourseResourceType;
  url?: string;
  content?: string;
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
