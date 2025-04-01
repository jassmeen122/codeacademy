
import React from "react";
import { ExerciseUI } from "@/types/exerciseUI";
import { ExerciseCard } from "./ExerciseCard";

interface ExercisesListProps {
  exercises: ExerciseUI[];
  activeExercise: ExerciseUI | null;
  onSelectExercise: (exercise: ExerciseUI) => void;
  difficulties: Record<string, { stars: number; className: string }>;
}

export const ExercisesList: React.FC<ExercisesListProps> = ({
  exercises,
  activeExercise,
  onSelectExercise,
  difficulties
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard 
          key={exercise.id} 
          exercise={exercise}
          isActive={activeExercise?.id === exercise.id}
          onClick={() => onSelectExercise(exercise)}
          difficulties={difficulties}
        />
      ))}
    </div>
  );
};
