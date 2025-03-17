
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseTabs } from "@/components/dashboard/CourseTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [premiumCourses, setPremiumCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
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

      if (error) throw error;

      const transformedCourses: Course[] = enrolledCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        duration: "8 weeks",
        students: 0,
        image: "/placeholder.svg",
        difficulty: course.difficulty,
        path: course.path,
        category: course.category,
        language: "JavaScript" as any, // Simplified for demo
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
      
      // Create premium AI courses
      const artificialIntelligenceCourses: Course[] = [
        {
          id: "premium-ai-1",
          title: "Advanced Deep Learning Specialization",
          description: "Master neural networks, CNNs, RNNs, and transformer models for cutting-edge AI applications in this comprehensive course.",
          duration: "12 weeks",
          students: 1243,
          image: "/placeholder.svg",
          difficulty: "Advanced",
          path: "Artificial Intelligence",
          category: "AI Applications",
          language: "Python" as any,
          professor: {
            name: "Dr. Sarah Chen",
            title: "AI Research Scientist"
          },
          materials: {
            videos: 32,
            pdfs: 15,
            presentations: 8
          },
          isPremium: true,
          price: 49.99
        },
        {
          id: "premium-ai-2",
          title: "Natural Language Processing Masterclass",
          description: "Learn how to build and deploy state-of-the-art NLP models for text analysis, sentiment detection, and language generation.",
          duration: "10 weeks",
          students: 876,
          image: "/placeholder.svg",
          difficulty: "Intermediate",
          path: "Artificial Intelligence",
          category: "AI Applications",
          language: "Python" as any,
          professor: {
            name: "Prof. Michael Johnson",
            title: "NLP Specialist"
          },
          materials: {
            videos: 28,
            pdfs: 12,
            presentations: 6
          },
          isPremium: true,
          price: 59.99
        },
        {
          id: "premium-ai-3",
          title: "Computer Vision and Image Recognition",
          description: "Build computer vision systems that can analyze and interpret images with the latest deep learning techniques.",
          duration: "8 weeks",
          students: 654,
          image: "/placeholder.svg",
          difficulty: "Advanced",
          path: "Artificial Intelligence",
          category: "AI Applications",
          language: "Python" as any,
          professor: {
            name: "Dr. Emily Wong",
            title: "Computer Vision Expert"
          },
          materials: {
            videos: 24,
            pdfs: 10,
            presentations: 5
          },
          isPremium: true,
          price: 49.99
        }
      ];
      
      setPremiumCourses(artificialIntelligenceCourses);
      setCourses(transformedCourses);
    } catch (error: any) {
      toast.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPremiumCourses = () => {
    return (
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Sparkles className="text-yellow-500 mr-2 h-5 w-5" />
          <h2 className="text-2xl font-bold">Premium AI Courses</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg duration-300">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600">
                  Premium
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {course.professor.name} • {course.difficulty}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold">${course.price}</div>
                  <Badge variant="outline">{course.path}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/student/courses/${course.id}/details`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
        
        {renderPremiumCourses()}
        
        <h2 className="text-2xl font-bold mb-6">Enrolled Courses</h2>
        <CourseTabs courses={courses} loading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
