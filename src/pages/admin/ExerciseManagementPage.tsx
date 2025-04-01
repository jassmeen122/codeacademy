
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Trash2,
  AlertTriangle,
  RefreshCw,
  FileCode,
  Edit,
  PlusCircle,
  EyeIcon,
} from "lucide-react";
import type { Exercise } from "@/types/exercise";
import { fetchExercises, deleteExercise, changeExerciseStatus } from "@/services/exerciseService";

const ExerciseManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      loadExercises();
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      setIsRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all exercises (not just for a specific teacher)
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          profiles:teacher_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Exercise type
      const transformedExercises: Exercise[] = (data || []).map(exercise => ({
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
        difficulty: exercise.difficulty,
        type: exercise.type,
        status: exercise.status,
        time_limit: exercise.time_limit,
        created_at: exercise.created_at,
        updated_at: exercise.updated_at,
        teacher_id: exercise.teacher_id,
        teacher_name: exercise.profiles?.full_name || "Unknown"
      }));

      setExercises(transformedExercises);
      toast.success("Exercises loaded successfully");
    } catch (error: any) {
      toast.error(`Failed to load exercises: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) throw error;

      setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
      toast.success("Exercise deleted successfully");
      setConfirmDeleteExercise(null);
    } catch (error: any) {
      toast.error(`Failed to delete exercise: ${error.message}`);
    }
  };

  const handleChangeStatus = async (exerciseId: string, newStatus: "draft" | "published" | "archived") => {
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ 
          status: newStatus === "archived" ? "draft" : newStatus,
          archived: newStatus === "archived"
        })
        .eq('id', exerciseId);
      
      if (error) throw error;
      
      // Update local state
      setExercises(exercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, status: newStatus } 
          : exercise
      ));
      
      toast.success(`Exercise ${newStatus === "published" ? "published" : newStatus === "archived" ? "archived" : "saved as draft"} successfully`);
    } catch (error: any) {
      toast.error(`Failed to update exercise: ${error.message}`);
    }
  };

  const filteredExercises = exercises.filter(exercise => 
    exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    exercise.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exercise.teacher_name && exercise.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Beginner</Badge>;
      case "Intermediate":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Intermediate</Badge>;
      case "Advanced":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Advanced</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{difficulty}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Exercise Management</h1>
            <p className="text-gray-600">Manage all exercises on the platform</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadExercises} 
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/admin/exercises/create')}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exercises by title, description, teacher, difficulty, or type..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              <span>Platform Exercises</span>
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredExercises.length} exercises)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <div className="font-medium">{exercise.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[250px]">
                            {exercise.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {exercise.teacher_name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {exercise.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getDifficultyBadge(exercise.difficulty)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(exercise.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/exercises/${exercise.id}`)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/exercises/edit/${exercise.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {exercise.status !== "published" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                onClick={() => handleChangeStatus(exercise.id, "published")}
                              >
                                Publish
                              </Button>
                            )}
                            {exercise.status === "published" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
                                onClick={() => handleChangeStatus(exercise.id, "draft")}
                              >
                                Unpublish
                              </Button>
                            )}
                            {exercise.status !== "archived" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                                onClick={() => handleChangeStatus(exercise.id, "archived")}
                              >
                                Archive
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDeleteExercise(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No exercises found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!confirmDeleteExercise} onOpenChange={(open) => !open && setConfirmDeleteExercise(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Exercise Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the exercise
                and remove it from the platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => confirmDeleteExercise && handleDeleteExercise(confirmDeleteExercise)}
              >
                Delete Exercise
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default ExerciseManagementPage;
