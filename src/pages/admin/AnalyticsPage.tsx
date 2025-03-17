
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Users, BookOpen, GraduationCap, FileCode, Brain, Trophy } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalExercises: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    completedExercises: 0,
    teachers: 0,
    students: 0,
  });

  const [userGrowthData, setUserGrowthData] = useState<{ name: string; students: number; teachers: number }[]>([]);
  const [courseDistributionData, setCourseDistributionData] = useState<{ name: string; value: number }[]>([]);
  const [exerciseCompletionData, setExerciseCompletionData] = useState<{ name: string; completed: number; attempted: number }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchUserGrowthData(),
        fetchCourseDistributionData(),
        fetchExerciseCompletionData()
      ]);
      setLoading(false);
    } catch (error: any) {
      toast.error(`Failed to load analytics data: ${error.message}`);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Get exercises count
      const { count: exercisesCount, error: exercisesError } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true });

      // Get teacher count
      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'teacher');

      // Get student count
      const { data: students, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'student');

      if (usersError || coursesError || exercisesError || teachersError || studentsError) throw new Error("Error fetching stats");

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalExercises: exercisesCount || 0,
        activeUsers: Math.floor(Math.random() * (usersCount || 0)), // Mock data
        newUsersThisMonth: Math.floor(Math.random() * 50), // Mock data
        completedExercises: Math.floor(Math.random() * (exercisesCount || 0)), // Mock data
        teachers: teachers?.length || 0,
        students: students?.length || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error(`Failed to fetch statistics: ${error.message}`);
    }
  };

  const fetchUserGrowthData = async () => {
    // This would typically come from an API call that aggregates data by month
    // For now, let's create mock data
    const mockData = [
      { name: 'Jan', students: 20, teachers: 5 },
      { name: 'Feb', students: 30, teachers: 7 },
      { name: 'Mar', students: 45, teachers: 8 },
      { name: 'Apr', students: 60, teachers: 9 },
      { name: 'May', students: 75, teachers: 10 },
      { name: 'Jun', students: 95, teachers: 12 },
    ];
    setUserGrowthData(mockData);
  };

  const fetchCourseDistributionData = async () => {
    // Mock data for course distribution by category
    const mockData = [
      { name: 'Web Dev', value: 35 },
      { name: 'Data Science', value: 25 },
      { name: 'AI/ML', value: 20 },
      { name: 'Mobile', value: 15 },
      { name: 'DevOps', value: 5 },
    ];
    setCourseDistributionData(mockData);
  };

  const fetchExerciseCompletionData = async () => {
    // Mock data for exercise completion rate
    const mockData = [
      { name: 'Beginner', completed: 85, attempted: 100 },
      { name: 'Intermediate', completed: 45, attempted: 75 },
      { name: 'Advanced', completed: 15, attempted: 40 },
    ];
    setExerciseCompletionData(mockData);
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await fetchData();
    toast.success("Analytics data refreshed successfully");
    setIsRefreshing(false);
  };

  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600">Platform statistics and insights</p>
          </div>
          <Button 
            onClick={handleRefreshData} 
            disabled={isRefreshing || loading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                +{stats.newUsersThisMonth} new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary mr-3" />
                <p className="text-3xl font-bold">{stats.totalCourses}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary mr-3" />
                <p className="text-3xl font-bold">{stats.teachers}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileCode className="h-8 w-8 text-primary mr-3" />
                <p className="text-3xl font-bold">{stats.totalExercises}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.completedExercises} completed by students
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="user-growth" className="space-y-8">
          <TabsList>
            <TabsTrigger value="user-growth">User Growth</TabsTrigger>
            <TabsTrigger value="course-distribution">Course Distribution</TabsTrigger>
            <TabsTrigger value="exercise-completion">Exercise Completion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="teachers" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="course-distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {courseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exercise-completion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Completion Rate by Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={exerciseCompletionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attempted" fill="#8884d8" name="Attempted" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
