
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Users, BarChart, Clock, Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import type { Course } from "@/types/course";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:teacher_id (
            name:full_name
          )
        `)
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Course type
      const transformedCourses: Course[] = (data || []).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        duration: "8 weeks", // Mock data
        students: Math.floor(Math.random() * 50) + 5, // Mock data
        image: "/placeholder.svg", // Placeholder image
        difficulty: course.difficulty,
        path: course.path,
        category: course.category,
        language: "JavaScript", // Mock data
        professor: {
          name: course.teacher?.name || "Unknown",
          title: "Course Instructor"
        },
        materials: {
          videos: Math.floor(Math.random() * 10) + 1, // Mock data
          pdfs: Math.floor(Math.random() * 8) + 1, // Mock data
          presentations: Math.floor(Math.random() * 5) + 1 // Mock data
        }
      }));
      
      setCourses(transformedCourses);
    } catch (error: any) {
      toast.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <Button onClick={() => navigate("/teacher/courses/create")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium mb-2">No courses found</p>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                You haven't created any courses yet. Start by creating your first course.
              </p>
              <Button onClick={() => navigate("/teacher/courses/create")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      {
                        Beginner: "bg-green-100 text-green-800",
                        Intermediate: "bg-yellow-100 text-yellow-800", 
                        Advanced: "bg-red-100 text-red-800"
                      }[course.difficulty]
                    }`}>
                      {course.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      {
                        "Web Development": "bg-blue-100 text-blue-800",
                        "Data Science": "bg-purple-100 text-purple-800",
                        "Artificial Intelligence": "bg-indigo-100 text-indigo-800"
                      }[course.path]
                    }`}>
                      {course.path}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Folder className="h-4 w-4" />
                    {course.category}
                  </div>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} students
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-1" />
                      {course.difficulty}
                    </div>
                  </div>
                  
                  <div className="flex mt-6 space-x-3">
                    <Button 
                      className="flex-1"
                      onClick={() => navigate(`/teacher/courses/${course.id}`)}
                    >
                      Manage
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/teacher/courses/edit/${course.id}`)}
                    >
                      Edit
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

export default CoursesPage;
