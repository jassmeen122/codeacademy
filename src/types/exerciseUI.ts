
import { ProgrammingLanguage } from "@/components/CodeEditor/types";

export type ExerciseStatus = "completed" | "in_progress" | "not_started";

export interface ExerciseUI {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  type: "mcq" | "open_ended" | "coding" | "file_upload";
  status: ExerciseStatus;
  language?: ProgrammingLanguage;
  theme?: string;
  tests?: { input: string; output: string }[];
}
