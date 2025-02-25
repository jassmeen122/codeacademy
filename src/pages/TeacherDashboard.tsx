
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookPlus,
  Users,
  BarChart,
  Clock,
  Upload,
  CheckSquare,
  Code,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

type ExerciseType = 'mcq' | 'open_ended' | 'coding' | 'file_upload';
type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type ExerciseStatus = 'draft' | 'published';

interface Exercise {
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

interface NewExercise {
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  time_limit: number;
  status: ExerciseStatus;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newExercise, setNewExercise] = useState<NewExercise>({
    title: "",
    description: "",
    type: "mcq",
    difficulty: "Beginner",
    time_limit: 30,
    status: "draft",
  });

  useEffect(() => {
    checkUserRole();
    fetchExercises();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
        toast.error("You don't have permission to access this page");
        navigate('/');
        return;
      }

      setUserRole(profile.role);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user role:', error);
      toast.error("Authentication error");
      navigate('/auth');
    }
  };

  const fetchExercises = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error("Failed to load exercises");
    }
  };

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
        .select()
        .single();

      if (error) throw error;

      setExercises([data, ...exercises]);
      toast.success("Exercise created successfully!");
      setNewExercise({
        title: "",
        description: "",
        type: "mcq",
        difficulty: "Beginner",
        time_limit: 30,
        status: "draft",
      });
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error("Failed to create exercise");
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) throw error;

      setExercises(exercises.filter(ex => ex.id !== exerciseId));
      toast.success("Exercise deleted successfully");
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error("Failed to delete exercise");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {userRole === 'admin' ? 'Administrator' : 'Teacher'} Dashboard
          </h1>
          <p className="text-gray-600">Manage your courses and student progress</p>
        </div>

        <Tabs defaultValue="exercises" className="space-y-4">
          <TabsList>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Exercise</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Exercises</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Student progress tracking interface will be implemented in the next iteration */}
                <p>Student progress tracking coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Analytics interface will be implemented in the next iteration */}
                <p>Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
