
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
  materials: {
    videos?: number;
    pdfs?: number;
    presentations?: number;
  };
}
