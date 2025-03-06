
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Exercise } from "@/types/teacher";

interface ExercisesListProps {
  exercises: Exercise[];
  onExerciseDeleted: (id: string) => void;
}

const ExercisesList = ({ exercises, onExerciseDeleted }: ExercisesListProps) => {
  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) throw error;

      onExerciseDeleted(exerciseId);
      toast.success("Exercise deleted successfully");
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error("Failed to delete exercise");
    }
  };

  return (
    <div className="grid gap-4">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{exercise.title}</h3>
                <p className="text-sm text-gray-500">{exercise.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exercise.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    exercise.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {exercise.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteExercise(exercise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExercisesList;
