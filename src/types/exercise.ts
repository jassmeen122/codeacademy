
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
  archived?: boolean;
}

export type ExerciseTabValue = "all" | "draft" | "published" | "archived";
