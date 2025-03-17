import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { BookOpen, GraduationCap, Users, Activity, FileCode, RefreshCw } from "lucide-react";
import { NavigationCard } from "@/components/dashboard/NavigationCard";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    teachers: 0,
    students: 0,
    totalExercises: 0
  });

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

      fetchData();
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
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

      if (usersError || coursesError || exercisesError || teachersError || studentsError) 
        throw new Error("Error fetching stats");

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalExercises: exercisesCount || 0,
        teachers: teachers?.length || 0,
        students: students?.length || 0,
      });
      setLoading(false);
    } catch (error: any) {
      toast.error(`Failed to fetch data: ${error.message}`);
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await fetchData();
    toast.success("Data refreshed successfully");
    setIsRefreshing(false);
  };

  const navigationCards = [
    {
      title: "User Management",
      description: "Manage users, roles and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-50 text-purple-500"
    },
    {
      title: "Course Management",
      description: "Create and manage courses",
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-blue-50 text-blue-500"
    },
    {
      title: "Exercise Management",
      description: "Manage programming exercises",
      icon: FileCode,
      href: "/admin/exercises",
      color: "bg-green-50 text-green-500"
    },
    {
      title: "Analytics",
      description: "View platform statistics",
      icon: Activity,
      href: "/admin/analytics",
      color: "bg-orange-50 text-orange-500"
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Administrator Dashboard</h1>
            <p className="text-gray-600">Welcome to your admin control center</p>
          </div>
          <Button 
            onClick={handleRefreshData} 
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Active Courses</CardTitle>
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
              <CardTitle className="text-xl font-medium">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <p className="text-3xl font-bold">{stats.students}</p>
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
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Quick Navigation</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {navigationCards.map((card, index) => (
            <NavigationCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
              iconClassName={card.color}
            />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-10 text-center text-muted-foreground">
                Activity data will be displayed here.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Server Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Storage Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">87% Free</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Backup</span>
                  <span className="text-sm">Today, 04:30 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
