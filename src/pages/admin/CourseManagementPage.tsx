
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Trash2,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Edit,
  PlusCircle,
} from "lucide-react";
import type { Course, CourseLevel, CoursePath, CourseCategory } from "@/types/course";

const CourseManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteCourse, setConfirmDeleteCourse] = useState<string | null>(null);
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

      fetchCourses();
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setIsRefreshing(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:teacher_id (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Course type
      const transformedCourses: Course[] = (data || []).map(course => ({
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
        // Mock data for the following fields
        duration: "8 weeks",
        students: Math.floor(Math.random() * 100), 
        image: "/placeholder.svg",
        language: "Multiple",
        materials: {
          videos: Math.floor(Math.random() * 10) + 1,
          pdfs: Math.floor(Math.random() * 8) + 1,
          presentations: Math.floor(Math.random() * 5) + 1
        }
      }));

      setCourses(transformedCourses);
      toast.success("Courses loaded successfully");
    } catch (error: any) {
      toast.error(`Failed to load courses: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.filter(course => course.id !== courseId));
      toast.success("Course deleted successfully");
      setConfirmDeleteCourse(null);
    } catch (error: any) {
      toast.error(`Failed to delete course: ${error.message}`);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
            <p className="text-gray-600">Manage all courses on the platform</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchCourses} 
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/admin/courses/create')}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Course
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses by title, teacher, category, difficulty, or path..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>Platform Courses</span>
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredCourses.length} courses)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Path</TableHead>
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
                        <TableCell>
                          {course.professor.name}
                        </TableCell>
                        <TableCell>
                          {course.category}
                        </TableCell>
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
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-800 border-blue-200"
                          >
                            {course.path}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDeleteCourse(course.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!confirmDeleteCourse} onOpenChange={(open) => !open && setConfirmDeleteCourse(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Course Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course
                and remove it from the platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => confirmDeleteCourse && handleDeleteCourse(confirmDeleteCourse)}
              >
                Delete Course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default CourseManagementPage;
