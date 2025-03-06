
export type ExerciseType = 'mcq' | 'open_ended' | 'coding' | 'file_upload';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ExerciseStatus = 'draft' | 'published';

export interface Exercise {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  time_limit: number;
  status: ExerciseStatus;
  created_at: string;
  updated_at: string;
}

export interface NewExercise {
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  time_limit: number;
  status: ExerciseStatus;
}
