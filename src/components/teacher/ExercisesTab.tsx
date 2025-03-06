
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExerciseForm from "./ExerciseForm";
import ExercisesList from "./ExercisesList";
import { Exercise } from "@/types/teacher";

interface ExercisesTabProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

const ExercisesTab = ({ exercises, setExercises }: ExercisesTabProps) => {
  const handleExerciseCreated = (newExercise: Exercise) => {
    setExercises([newExercise, ...exercises]);
  };

  const handleExerciseDeleted = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <ExerciseForm onExerciseCreated={handleExerciseCreated} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <ExercisesList 
            exercises={exercises} 
            onExerciseDeleted={handleExerciseDeleted} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesTab;
