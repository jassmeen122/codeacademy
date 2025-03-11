
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { Exercise, ExerciseTabValue } from "@/types/exercise";
import { ExerciseStatus } from "@/types/course";
import { ExerciseTabs } from "@/components/teacher/exercises/ExerciseTabs";
import { DeleteExerciseDialog } from "@/components/teacher/exercises/DeleteExerciseDialog";
import { fetchExercises, deleteExercise, changeExerciseStatus } from "@/services/exerciseService";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<ExerciseTabValue>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      loadExercises();
    }
  }, [user]);

  useEffect(() => {
    if (currentTab === "all") {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(ex => ex.status === currentTab));
    }
  }, [currentTab, exercises]);

  const loadExercises = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const data = await fetchExercises(user.id);
    setExercises(data);
    setFilteredExercises(data);
    setLoading(false);
  };

  const handleDeleteExercise = async () => {
    if (!exerciseToDelete) return;
    
    const success = await deleteExercise(exerciseToDelete);
    if (success) {
      setExercises(exercises.filter(ex => ex.id !== exerciseToDelete));
    }
    
    setDeleteDialogOpen(false);
    setExerciseToDelete(null);
  };

  const handleStatusChange = async (id: string, status: ExerciseStatus) => {
    const success = await changeExerciseStatus(id, status);
    if (success) {
      // Update exercise status in local state
      setExercises(exercises.map(ex => 
        ex.id === id ? { ...ex, status } : ex
      ));
    }
  };

  const confirmDelete = (id: string) => {
    setExerciseToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Exercises</h1>
          <Button onClick={() => navigate("/teacher/exercises/create")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Exercise
          </Button>
        </div>

        <ExerciseTabs 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          filteredExercises={filteredExercises}
          loading={loading}
          onDelete={confirmDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      <DeleteExerciseDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteExercise}
      />
    </DashboardLayout>
  );
};

export default ExercisesPage;
