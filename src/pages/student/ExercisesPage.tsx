
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, CheckCircle, Circle, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Coding Exercises</h1>
          <Button onClick={() => navigate("/student/language-selection")} className="md:w-auto w-full">
            <Code className="mr-2 h-4 w-4" />
            Accéder aux Cours Vidéo
          </Button>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">Nouveau système de cours</h2>
          <p className="text-blue-600">
            Découvrez notre nouveau système simplifié de cours et d'exercices basé sur des vidéos YouTube.
            Choisissez un langage de programmation et accédez directement au contenu d'apprentissage.
          </p>
          <Button variant="link" onClick={() => navigate("/student/language-selection")} className="mt-2 p-0 text-blue-700">
            Explorer les cours vidéo →
          </Button>
        </div>
        
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
