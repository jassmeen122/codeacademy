
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseType, DifficultyLevel, ExerciseStatus, NewExercise } from "@/types/teacher";

interface ExerciseFormProps {
  onExerciseCreated: (exercise: any) => void;
}

const ExerciseForm = ({ onExerciseCreated }: ExerciseFormProps) => {
  const [newExercise, setNewExercise] = useState<NewExercise>({
    title: "",
    description: "",
    type: "mcq",
    difficulty: "Beginner",
    time_limit: 30,
    status: "draft",
  });

  const handleCreateExercise = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to create exercises");
        return;
      }

      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            ...newExercise,
            teacher_id: user.id,
          },
        ])
        .then(result => ({ data: result.data?.[0], error: result.error }));

      if (error) throw error;

      if (data) {
        onExerciseCreated(data);
        toast.success("Exercise created successfully!");
        setNewExercise({
          title: "",
          description: "",
          type: "mcq",
          difficulty: "Beginner",
          time_limit: 30,
          status: "draft",
        });
      }
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error("Failed to create exercise");
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Title</label>
        <Input
          value={newExercise.title}
          onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
          placeholder="Exercise title"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Input
          value={newExercise.description}
          onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
          placeholder="Exercise description"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <Select
            value={newExercise.type}
            onValueChange={(value: ExerciseType) =>
              setNewExercise({ ...newExercise, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">Multiple Choice</SelectItem>
              <SelectItem value="open_ended">Open Ended</SelectItem>
              <SelectItem value="coding">Coding Challenge</SelectItem>
              <SelectItem value="file_upload">File Upload</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Difficulty</label>
          <Select
            value={newExercise.difficulty}
            onValueChange={(value: DifficultyLevel) =>
              setNewExercise({ ...newExercise, difficulty: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Time Limit (minutes)</label>
          <Input
            type="number"
            value={newExercise.time_limit}
            onChange={(e) => setNewExercise({ ...newExercise, time_limit: parseInt(e.target.value) })}
            min={1}
          />
        </div>
      </div>
      <Button onClick={handleCreateExercise} className="w-full md:w-auto">
        <BookPlus className="mr-2" />
        Create Exercise
      </Button>
    </div>
  );
};

export default ExerciseForm;
