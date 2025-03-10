export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CoursePath = 
  | "Web Development"
  | "Data Science"
  | "Artificial Intelligence";

export type CourseCategory = 
  | "Programming Fundamentals"
  | "Frontend Development"
  | "Backend Development"
  | "Machine Learning"
  | "Data Analysis"
  | "AI Applications";

export type ProgrammingLanguage = 
  | "Python"
  | "Java"
  | "JavaScript"
  | "C"
  | "C++"
  | "PHP"
  | "SQL";

export type CourseResourceType = "video" | "presentation" | "pdf";

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
  language: ProgrammingLanguage;
  professor: {
    name: string;
    title: string;
  };
  materials: {
    videos?: number;
    pdfs?: number;
    presentations?: number;
  };
}

export interface CourseResource {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  type: CourseResourceType;
  order_index: number;
  course_id?: string;
  created_at?: string;
}
