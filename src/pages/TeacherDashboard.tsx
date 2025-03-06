
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart } from "lucide-react";
import { toast } from "sonner";
import { Exercise } from "@/types/teacher";
import ExercisesTab from "@/components/teacher/ExercisesTab";
import StudentsTab from "@/components/teacher/StudentsTab";
import AnalyticsTab from "@/components/teacher/AnalyticsTab";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

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

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
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
            <ExercisesTab exercises={exercises} setExercises={setExercises} />
          </TabsContent>

          <TabsContent value="students">
            <StudentsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
