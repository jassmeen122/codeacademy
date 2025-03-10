
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, FileCode, Clock, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { ExerciseStatus } from "@/types/course";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Exercise {
  id: string;
  title: string;
  description: string | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "mcq" | "open_ended" | "coding" | "file_upload";
  status: ExerciseStatus;
  time_limit: number | null;
  created_at: string;
  teacher_id: string;
}

const ExercisesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"all" | "draft" | "published" | "archived">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user]);

  useEffect(() => {
    if (currentTab === "all") {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(ex => ex.status === currentTab));
    }
  }, [currentTab, exercises]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch exercises");
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setExerciseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deleteExercise = async () => {
    if (!exerciseToDelete) return;
    
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseToDelete);
      
      if (error) throw error;
      
      setExercises(exercises.filter(ex => ex.id !== exerciseToDelete));
      toast.success("Exercise deleted successfully");
    } catch (error: any) {
      toast.error(`Failed to delete exercise: ${error.message}`);
      console.error("Error deleting exercise:", error);
    } finally {
      setDeleteDialogOpen(false);
      setExerciseToDelete(null);
    }
  };

  const changeExerciseStatus = async (id: string, status: ExerciseStatus) => {
    try {
      // Cast the status to the appropriate type accepted by the database
      // This ensures TypeScript knows we're handling the type difference
      const { error } = await supabase
        .from('exercises')
        .update({ status: status as "draft" | "published" | "archived" })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update exercise status in local state
      setExercises(exercises.map(ex => 
        ex.id === id ? { ...ex, status } : ex
      ));
      
      toast.success(`Exercise ${status === 'published' ? 'published' : status === 'archived' ? 'archived' : 'saved as draft'} successfully`);
    } catch (error: any) {
      toast.error(`Failed to update exercise: ${error.message}`);
      console.error("Error updating exercise:", error);
    }
  };

  const getExerciseTypeIcon = (type: Exercise['type']) => {
    switch (type) {
      case 'coding':
        return <FileCode className="h-5 w-5" />;
      case 'mcq':
        return <BarChart className="h-5 w-5" />;
      default:
        return <FileCode className="h-5 w-5" />;
    }
  };

  const getStatusBadgeColor = (status: Exercise['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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

        <Tabs defaultValue="all" value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Exercises</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab}>
            {loading ? (
              <div className="text-center py-8">Loading exercises...</div>
            ) : filteredExercises.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No exercises found in this category.</p>
                  <Button onClick={() => navigate("/teacher/exercises/create")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Exercise
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getExerciseTypeIcon(exercise.type)}
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            {
                              Beginner: "bg-green-100 text-green-800",
                              Intermediate: "bg-yellow-100 text-yellow-800",
                              Advanced: "bg-red-100 text-red-800"
                            }[exercise.difficulty]
                          }`}>
                            {exercise.difficulty}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(exercise.status)}`}>
                            {exercise.status.charAt(0).toUpperCase() + exercise.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mt-2">{exercise.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {exercise.description || "No description provided."}
                      </p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        {exercise.time_limit && (
                          <div className="flex items-center mr-4">
                            <Clock className="h-4 w-4 mr-1" />
                            {exercise.time_limit} min
                          </div>
                        )}
                        <div className="flex items-center">
                          <FileCode className="h-4 w-4 mr-1" />
                          {exercise.type.replace('_', ' ').charAt(0).toUpperCase() + exercise.type.replace('_', ' ').slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/teacher/exercises/edit/${exercise.id}`)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex-1"
                          onClick={() => confirmDelete(exercise.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        {exercise.status !== 'published' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => changeExerciseStatus(exercise.id, 'published')}
                          >
                            Publish
                          </Button>
                        )}
                        {exercise.status !== 'draft' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => changeExerciseStatus(exercise.id, 'draft')}
                          >
                            Save as Draft
                          </Button>
                        )}
                        {exercise.status !== 'archived' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => changeExerciseStatus(exercise.id, 'archived')}
                          >
                            Archive
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this exercise and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteExercise} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ExercisesPage;
