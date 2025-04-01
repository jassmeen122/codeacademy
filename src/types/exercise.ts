
import { ExerciseStatus } from "./course";

export interface Exercise {
  id: string;
  title: string;
  description: string | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "mcq" | "open_ended" | "coding" | "file_upload";
  status: ExerciseStatus;
  time_limit: number | null;
  created_at: string;
  teacher_id: string;
  updated_at: string;
  archived?: boolean;
  teacher_name?: string; // Added to display teacher's name
}

export type ExerciseTabValue = "all" | "draft" | "published" | "archived";
