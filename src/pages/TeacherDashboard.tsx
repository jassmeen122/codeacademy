
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Book,
  CheckCircle,
  Clock,
  FileText,
  Users,
  PlusCircle,
  Calendar,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseCount, setCourseCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [recentExercises, setRecentExercises] = useState([]);

  useEffect(() => {
    checkUserRole();
    fetchDashboardData();
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

      setLoading(false);
    } catch (error) {
      console.error('Error checking user role:', error);
      toast.error("Authentication error");
      navigate('/auth');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch course count
      const { count: courses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', user.id);
      
      setCourseCount(courses || 0);

      // Fetch exercise count
      const { count: exercises } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', user.id);
      
      setExerciseCount(exercises || 0);

      // Fetch student count (this would typically be a count of enrollments in the teacher's courses)
      // This is a placeholder - you would need a proper enrollment table for this
      setStudentCount(0);

      // Fetch recent exercises
      const { data: recent } = await supabase
        .from('exercises')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentExercises(recent || []);

      // Fetch pending reviews (placeholder)
      setPendingReviews(0);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Teacher Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your courses and track student progress</p>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="text-xl mb-1">{courseCount}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mb-4">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="text-xl mb-1">{exerciseCount}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created Exercises</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="text-xl mb-1">{studentCount}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled Students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 mb-4">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <CardTitle className="text-xl mb-1">{pendingReviews}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create and manage your educational content</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={() => navigateTo('/teacher/courses/create')} className="flex gap-2">
              <Book className="h-4 w-4" />
              Create New Course
            </Button>
            <Button onClick={() => navigateTo('/teacher/exercises/create')} className="flex gap-2">
              <FileText className="h-4 w-4" />
              Create Exercise
            </Button>
            <Button onClick={() => navigateTo('/teacher/progress')} className="flex gap-2">
              <BarChart className="h-4 w-4" />
              View Student Progress
            </Button>
            <Button onClick={() => navigateTo('/teacher/discussion')} className="flex gap-2">
              <Users className="h-4 w-4" />
              Discussion Forum
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Exercises */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exercises</CardTitle>
              <CardDescription>Your most recently created exercises</CardDescription>
            </CardHeader>
            <CardContent>
              {recentExercises.length > 0 ? (
                <div className="space-y-4">
                  {recentExercises.map((exercise) => (
                    <div key={exercise.id} className="border-b pb-3 last:border-0">
                      <h3 className="font-medium">{exercise.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {exercise.difficulty}
                        </span>
                        <span className="text-gray-500">
                          {new Date(exercise.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No exercises created yet</p>
                  <Button onClick={() => navigateTo('/teacher/exercises/create')} variant="outline" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Exercise
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your upcoming classes and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No upcoming events</p>
                <p className="text-sm mt-1">Schedule management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
