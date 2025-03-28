
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book, Code, FileCode, Terminal, Youtube } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CodeEditorWrapper } from "@/components/CodeEditor/CodeEditorWrapper";
import { toast } from "sonner";
import { NavigationCard } from "@/components/dashboard/NavigationCard";
import { CourseTabs } from "@/components/dashboard/CourseTabs";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodingMiniGame } from "@/components/student/CodingMiniGame";
import type { Course } from "@/types/course";
import { useAuthState } from "@/hooks/useAuthState";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const { user, loading: authLoading } = useAuthState();

  useEffect(() => {
    // Check if user authentication has finished loading
    if (!authLoading) {
      // If no user is authenticated after loading completes, redirect to auth page
      if (!user) {
        console.log("No authenticated user found, redirecting to auth page");
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/auth");
        return;
      }
      
      // Only fetch courses if we have an authenticated user
      fetchCourses();
    }
  }, [user, authLoading, navigate]);

  const fetchCourses = async () => {
    try {
      setDataLoading(true);
      console.log("Fetching courses for user:", user?.id);
      
      // Fetch enrolled courses
      const { data: enrolledCourses, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:teacher_id (
            name:full_name
          ),
          course_materials (
            id,
            type,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Échec du chargement des cours");
        console.error("Error fetching courses:", error);
      } else if (enrolledCourses) {
        // Transform the data to match our Course type
        const transformedCourses: Course[] = enrolledCourses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description || "",
          duration: "8 weeks", // Default duration
          students: 0, // We'll need to implement this
          image: "/placeholder.svg", // Default image
          difficulty: course.difficulty,
          path: course.path,
          category: course.category,
          language: "JavaScript", // Default language
          professor: {
            name: course.teacher?.name || "Unknown Professor",
            title: "Course Instructor"
          },
          materials: {
            videos: course.course_materials?.filter(m => m.type === 'video').length || 0,
            pdfs: course.course_materials?.filter(m => m.type === 'pdf').length || 0,
            presentations: course.course_materials?.filter(m => m.type === 'presentation').length || 0
          }
        }));
        
        setCourses(transformedCourses);
      }
    } catch (error: any) {
      toast.error("Une erreur est survenue");
      console.error("Unexpected error:", error);
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  };

  // Display loading state while authentication is in progress
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If auth is not loading but we don't have a user, the useEffect will handle redirecting
  // This is a fallback just in case
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenue, {user?.full_name || 'Étudiant'}!
          </h1>
          <p className="text-gray-600">Suivez votre progression d'apprentissage</p>
        </div>

        {/* Grid Layout for Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Left Side: Quick Actions */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <NavigationCard
                icon={Book}
                title="Reprendre l'apprentissage"
                description="Continuez où vous vous êtes arrêté dans votre dernier cours."
                buttonText="Continuer le cours"
              />

              <NavigationCard
                icon={FileCode}
                title="Défi quotidien"
                description="Complétez le défi de codage du jour pour gagner des points."
                buttonText="Commencer le défi"
              />

              <NavigationCard
                icon={Youtube}
                title="Cours gratuits"
                description="Accédez à nos cours gratuits de langages de programmation avec des vidéos YouTube."
                buttonText="Explorer les cours gratuits"
                onClick={() => navigate("/student/free-courses")}
              />

              <NavigationCard
                icon={Terminal}
                title="Éditeur de code"
                description="Écrivez, exécutez et déboguez du code avec l'assistance IA."
                buttonText="Ouvrir l'éditeur de code"
                onClick={() => navigate("/student/editor")} 
              />
            </div>

            {/* Course Progress */}
            <CourseTabs courses={courses} loading={dataLoading} />
          </div>

          {/* Right Side: Mini-Game */}
          <div className="md:col-span-4">
            <CodingMiniGame />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
