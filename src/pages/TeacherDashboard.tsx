
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Book, Users, Award, FileCode, Clock, PlusCircle, Calendar, Activity, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface DashboardStats {
  totalCourses: number;
  totalExercises: number;
  totalStudents: number;
  publishedExercises: number;
  draftExercises: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  date: string;
}

const TeacherDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalExercises: 0,
    totalStudents: 0,
    publishedExercises: 0,
    draftExercises: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', user?.id);

      if (coursesError) throw coursesError;

      // Get exercises stats
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('id, status')
        .eq('teacher_id', user?.id);

      if (exercisesError) throw exercisesError;

      // For demonstration purposes - normally this would be a proper query
      // but we're mocking student enrollment data here
      const totalStudents = Math.floor(Math.random() * 50) + 10;

      // Update stats
      setStats({
        totalCourses: coursesCount || 0,
        totalExercises: exercisesData?.length || 0,
        totalStudents,
        publishedExercises: exercisesData?.filter(ex => ex.status === 'published').length || 0,
        draftExercises: exercisesData?.filter(ex => ex.status === 'draft').length || 0
      });

      // Mock recent activities - in a real app, this would be fetched from the database
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'course',
          title: 'JavaScript Fundamentals Course created',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'exercise',
          title: 'DOM Manipulation Exercise published',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'student',
          title: 'New student enrolled in React Course',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setRecentActivities(mockActivities);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const exerciseCompletionData = [
    { name: 'Week 1', completed: 25, total: 30 },
    { name: 'Week 2', completed: 18, total: 30 },
    { name: 'Week 3', completed: 22, total: 30 },
    { name: 'Week 4', completed: 15, total: 30 }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <div className="flex space-x-2">
            <Button onClick={() => navigate("/teacher/courses/create")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Course
            </Button>
            <Button onClick={() => navigate("/teacher/exercises/content")}>
              <Dumbbell className="h-4 w-4 mr-2" />
              Manage Exercises
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading dashboard data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalCourses > 0 ? 'Active courses you\'re teaching' : 'No courses created yet'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalExercises}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.publishedExercises} published, {stats.draftExercises} drafts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled in your courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">76%</div>
                  <p className="text-xs text-muted-foreground">
                    Average exercise completion
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Exercise Completion</CardTitle>
                  <CardDescription>Student exercise completion over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={exerciseCompletionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#8884d8" />
                      <Bar dataKey="total" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest teaching activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No recent activity found.</p>
                    ) : (
                      recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            {activity.type === 'course' ? (
                              <Book className="h-4 w-4 text-primary" />
                            ) : activity.type === 'exercise' ? (
                              <FileCode className="h-4 w-4 text-primary" />
                            ) : (
                              <Users className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/teacher/activity")}>
                    <Activity className="h-4 w-4 mr-2" />
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Tabs defaultValue="upcoming" className="mb-8">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Deadlines</TabsTrigger>
                <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Exercise Deadlines</CardTitle>
                    <CardDescription>Deadlines for the next 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <div>
                            <p className="text-sm font-medium">JavaScript Arrays Exercise</p>
                            <p className="text-xs text-muted-foreground">Intermediate • 23 students assigned</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">Due in 2 days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/teacher/exercises/content")}>
                      View All Exercises
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="recent">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>Latest student submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm">No recent submissions to display.</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/teacher/submissions")}>
                      View All Submissions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
