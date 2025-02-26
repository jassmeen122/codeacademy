
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, CheckCircle, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "mcq" | "open_ended" | "coding" | "file_upload";
  status: "completed" | "in_progress" | "not_started";
}

const ExercisesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setExercises(data.map(exercise => ({
        ...exercise,
        status: "not_started" // TODO: Fetch actual status from student_progress
      })));
    } catch (error: any) {
      toast.error("Failed to fetch exercises");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Exercise["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Circle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Coding Exercises</h1>
        
        {loading ? (
          <div>Loading exercises...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Card key={exercise.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {exercise.title}
                  </CardTitle>
                  {getStatusIcon(exercise.status)}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {exercise.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      {
                        Beginner: "bg-green-100 text-green-800",
                        Intermediate: "bg-yellow-100 text-yellow-800",
                        Advanced: "bg-red-100 text-red-800"
                      }[exercise.difficulty]
                    }`}>
                      {exercise.difficulty}
                    </span>
                    <Button size="sm">
                      <FileCode className="h-4 w-4 mr-2" />
                      Start Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExercisesPage;
