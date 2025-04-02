
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
  FileSearch,
  Edit,
  PlusCircle,
  EyeIcon,
  BookText,
  GraduationCap,
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
            <h1 className="text-3xl font-bold text-gray-800">Learning Assessments</h1>
            <p className="text-gray-600">Create and manage coding challenges, quizzes, and assessments</p>
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
              Create Assessment
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assessments by title, description, instructor, difficulty, or type..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card className="bg-white border-indigo-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <FileSearch className="h-5 w-5 text-indigo-600" />
              <span>Learning Assessments Library</span>
              <span className="ml-2 text-sm font-normal text-indigo-600">
                ({filteredExercises.length} assessments)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <div className="text-sm text-indigo-800">
                <div className="flex items-center mb-2">
                  <BookText className="h-4 w-4 mr-2 text-indigo-600" />
                  <span className="font-medium">Assessment Guidelines:</span>
                </div>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Ensure assessments align with learning objectives</li>
                  <li>Provide clear instructions and expectations</li>
                  <li>Use appropriate difficulty levels for target learners</li>
                  <li>Include helpful feedback for incorrect answers</li>
                </ul>
              </div>
            </div>
            <div className="rounded-md">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Assessment Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id} className="hover:bg-indigo-50/30">
                        <TableCell>
                          <div className="font-medium text-indigo-900">{exercise.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[250px]">
                            {exercise.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-indigo-600" />
                            <span>{exercise.teacher_name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize font-medium">
                            {exercise.type === "mcq" ? "Multiple Choice" : 
                             exercise.type === "open_ended" ? "Open Ended" :
                             exercise.type === "coding" ? "Coding Challenge" : 
                             exercise.type === "file_upload" ? "Project Submission" : 
                             exercise.type}
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
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/exercises/edit/${exercise.id}`)}
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {exercise.status !== "published" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                                onClick={() => handleChangeStatus(exercise.id, "published")}
                              >
                                Publish
                              </Button>
                            )}
                            {exercise.status === "published" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 border-yellow-200"
                                onClick={() => handleChangeStatus(exercise.id, "draft")}
                              >
                                Unpublish
                              </Button>
                            )}
                            {exercise.status !== "archived" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 border-gray-200"
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
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileSearch className="h-8 w-8 mb-2 text-gray-400" />
                          <p>No assessments found.</p>
                          <Button 
                            variant="link" 
                            onClick={() => navigate('/admin/exercises/create')}
                            className="mt-2"
                          >
                            Create your first assessment
                          </Button>
                        </div>
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
                Confirm Assessment Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the assessment
                and remove it from the learning platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => confirmDeleteExercise && handleDeleteExercise(confirmDeleteExercise)}
              >
                Delete Assessment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default ExerciseManagementPage;
