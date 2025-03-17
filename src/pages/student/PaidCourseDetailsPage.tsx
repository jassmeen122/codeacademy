
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayPalButton } from "@/components/payments/PayPalButton";
import { toast } from "sonner";
import { 
  BookOpen, 
  Clock, 
  User, 
  ChevronLeft, 
  AlertTriangle,
  FileText,
  Video,
  Presentation
} from "lucide-react";
import type { Course } from "@/types/course";

const PaidCourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
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
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      if (courseData) {
        // Transform to Course type
        const transformedCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description || "",
          duration: "8 weeks",
          students: 0,
          image: "/placeholder.svg",
          difficulty: courseData.difficulty,
          path: courseData.path,
          category: courseData.category,
          language: "JavaScript" as any, // This is a simplification
          professor: {
            name: courseData.teacher?.name || "Unknown Professor",
            title: "Course Instructor"
          },
          materials: {
            videos: courseData.course_materials?.filter(m => m.type === 'video').length || 0,
            pdfs: courseData.course_materials?.filter(m => m.type === 'pdf').length || 0,
            presentations: courseData.course_materials?.filter(m => m.type === 'presentation').length || 0
          }
        };

        setCourse(transformedCourse);
        
        // Check if user is already enrolled
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: enrollmentData } = await supabase
            .from('student_progress')
            .select('id')
            .eq('course_id', courseId)
            .eq('student_id', session.session.user.id)
            .single();
            
          setEnrolled(!!enrollmentData);
        }
      }
    } catch (error: any) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    // In a real app, you would verify the payment on the server
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id || !courseId) {
        toast.error("User not authenticated");
        return;
      }
      
      // Record enrollment in student_progress
      const { error } = await supabase
        .from('student_progress')
        .insert({
          student_id: session.session.user.id,
          course_id: courseId,
          started_at: new Date().toISOString(),
          completion_percentage: 0,
          completed_materials: []
        });
        
      if (error) throw error;
      
      toast.success("You are now enrolled in this course!");
      setEnrolled(true);
      setShowPayment(false);
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to complete enrollment");
    }
  };

  const renderEnrollmentOptions = () => {
    if (enrolled) {
      return (
        <Button className="w-full" onClick={() => navigate(`/student/courses/${courseId}/learn`)}>
          Continue Learning
        </Button>
      );
    }
    
    if (showPayment) {
      return (
        <div className="space-y-4">
          <PayPalButton 
            amount={49.99} 
            courseId={courseId || ""}
            courseTitle={course?.title || ""}
            onSuccess={handlePaymentSuccess}
            onError={() => toast.error("Payment failed. Please try again.")}
          />
          <Button variant="outline" className="w-full" onClick={() => setShowPayment(false)}>
            Cancel
          </Button>
        </div>
      );
    }
    
    return (
      <Button className="w-full" onClick={() => setShowPayment(true)}>
        Enroll for $49.99
      </Button>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="mb-4">The course you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/student/courses')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/student/courses')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{course.difficulty}</Badge>
                <Badge variant="outline">{course.path}</Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>
              <p className="text-gray-600">{course.description}</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-green-500"></div>
                    <span>Master artificial intelligence core concepts and applications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-green-500"></div>
                    <span>Implement machine learning algorithms from scratch</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-green-500"></div>
                    <span>Build neural networks using modern frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-green-500"></div>
                    <span>Deploy AI solutions to solve real-world problems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    8 sections • 24 lectures • 12 hours total
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="font-medium mb-2">1. Introduction to Artificial Intelligence</div>
                    <div className="pl-4 space-y-2 text-sm">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span>What is Artificial Intelligence?</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span>History and Evolution of AI</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>AI Ethics and Considerations</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="font-medium mb-2">2. Machine Learning Fundamentals</div>
                    <div className="pl-4 space-y-2 text-sm">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span>Supervised vs Unsupervised Learning</span>
                      </div>
                      <div className="flex items-center">
                        <Presentation className="h-4 w-4 mr-2" />
                        <span>Linear Regression Implementation</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span>Classification Algorithms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt={course.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="text-3xl font-bold mb-4">$49.99</div>
                
                {renderEnrollmentOptions()}
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{course.duration} duration</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">24 lessons</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Instructor: {course.professor.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This course includes:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">12 hours on-demand video</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">8 downloadable resources</span>
                </div>
                <div className="flex items-center">
                  <Presentation className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">4 interactive exercises</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Full lifetime access</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaidCourseDetailsPage;
