import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Edit, Trash2, RefreshCw, BookOpen, GraduationCap, Users } from "lucide-react";
import type { UserProfile } from "@/hooks/useAuthState";
import type { Course, CourseLevel, CoursePath, CourseCategory } from "@/types/course";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    teachers: 0,
    students: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

      setUserRole(profile?.role);
      fetchUsers();
      fetchCourses();
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data as UserProfile[]);
      
      // Calculate stats
      const teachers = data.filter(user => user.role === 'teacher').length;
      const students = data.filter(user => user.role === 'student').length;
      const admins = data.filter(user => user.role === 'admin').length;
      
      setStats(prev => ({
        ...prev,
        totalUsers: data.length,
        teachers,
        students
      }));
    } catch (error: any) {
      toast.error(`Failed to fetch users: ${error.message}`);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:teacher_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedCourses = data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        difficulty: course.difficulty as CourseLevel,
        path: course.path as CoursePath,
        category: course.category as CourseCategory,
        professor: {
          name: course.teacher?.full_name || "Unknown",
          title: "Course Instructor"
        },
        // Mock data for the rest of the fields
        duration: "8 weeks",
        students: 0,
        image: "/placeholder.svg",
        language: "JavaScript",
        materials: {
          videos: 0,
          pdfs: 0,
          presentations: 0
        }
      }));
      
      setCourses(transformedCourses);
      setStats(prev => ({
        ...prev,
        totalCourses: data.length
      }));
    } catch (error: any) {
      toast.error(`Failed to fetch courses: ${error.message}`);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchUsers(), fetchCourses()]);
    toast.success("Data refreshed successfully");
    setIsRefreshing(false);
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'teacher' | 'student') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Administrator Dashboard</h1>
            <p className="text-gray-600">Manage your platform settings and users</p>
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
            <Button onClick={() => navigate('/admin/settings')} className="gap-2">
              Settings
            </Button>
          </div>
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
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, role, or course..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate('/admin/users/add')} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="font-medium">{user.full_name || "No Name"}</div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                    : user.role === "teacher"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : "bg-green-100 text-green-800 hover:bg-green-100"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {user.role !== "admin" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateUserRole(user.id, "admin")}
                                  >
                                    Make Admin
                                  </Button>
                                )}
                                {user.role !== "teacher" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateUserRole(user.id, "teacher")}
                                  >
                                    Make Teacher
                                  </Button>
                                )}
                                {user.role !== "student" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateUserRole(user.id, "student")}
                                  >
                                    Make Student
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/admin/courses/create')} className="mb-4">
                  Add New Course
                </Button>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>
                              <div className="font-medium">{course.title}</div>
                            </TableCell>
                            <TableCell>{course.professor.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  course.difficulty === "Beginner"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : course.difficulty === "Intermediate"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {course.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No courses found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="siteName">Platform Name</Label>
                    <Input id="siteName" defaultValue="Code Academy" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Platform Description</Label>
                    <Input
                      id="siteDescription"
                      defaultValue="Your Journey to Programming Excellence"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailContact">Contact Email</Label>
                    <Input
                      id="emailContact"
                      type="email"
                      defaultValue="contact@codeacademy.example"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit">Save Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
