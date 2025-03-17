
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Edit, Trash2, RefreshCw, Clock, FileCode } from "lucide-react";
import type { Exercise } from "@/types/exercise";

const ExercisesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          teacher:teacher_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setExercises(data as Exercise[]);
      setLoading(false);
    } catch (error: any) {
      toast.error(`Failed to fetch exercises: ${error.message}`);
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await fetchExercises();
    toast.success("Exercise data refreshed successfully");
    setIsRefreshing(false);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);
        
      if (error) throw error;
      
      toast.success(`Exercise deleted successfully`);
      fetchExercises();
    } catch (error: any) {
      toast.error(`Failed to delete exercise: ${error.message}`);
    }
  };

  const handleUpdateExerciseStatus = async (exerciseId: string, status: Exercise["status"]) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ status })
        .eq('id', exerciseId);
        
      if (error) throw error;
      
      toast.success(`Exercise status updated to ${status}`);
      fetchExercises();
    } catch (error: any) {
      toast.error(`Failed to update exercise status: ${error.message}`);
    }
  };

  const filteredExercises = exercises.filter(exercise => 
    exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              onClick={handleRefreshData} 
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button onClick={() => navigate('/admin/exercises/create')} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Exercise
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, description, difficulty or type..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Loading exercises...
                      </TableCell>
                    </TableRow>
                  ) : filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <div className="font-medium">{exercise.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {exercise.time_limit && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {exercise.time_limit} min
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileCode className="h-4 w-4 mr-1 text-indigo-500" />
                            {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              exercise.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : exercise.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {exercise.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              exercise.status === "published"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : exercise.status === "draft"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {exercise.status.charAt(0).toUpperCase() + exercise.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/exercises/${exercise.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/exercises/edit/${exercise.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {exercise.status !== 'published' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateExerciseStatus(exercise.id, 'published')}
                              >
                                Publish
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteExercise(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No exercises found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExercisesPage;
