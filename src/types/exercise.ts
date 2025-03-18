
export interface Exercise {
  id: string;
  title: string;
  description: string | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "mcq" | "open_ended" | "coding" | "file_upload";
  status: "draft" | "published" | "archived";
  time_limit: number | null;
  created_at: string;
  teacher_id: string;
  updated_at: string;
  archived?: boolean;
}

export type ExerciseTabValue = "all" | "draft" | "published" | "archived";
