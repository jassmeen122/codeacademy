
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, Book, GraduationCap } from "lucide-react";
import type { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Collection of programming language courses with YouTube links
const programmingCourses = [
  {
    id: "python-1",
    title: "Python Programming for Beginners",
    description: "Learn Python programming from scratch. Perfect for beginners with no prior coding experience.",
    language: "Python",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    difficulty: "Beginner",
    path: "Data Science",
    category: "Programming Fundamentals",
  },
  {
    id: "javascript-1",
    title: "Modern JavaScript Development",
    description: "Master the fundamentals of JavaScript and learn modern ES6+ features.",
    language: "JavaScript",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    difficulty: "Intermediate",
    path: "Web Development",
    category: "Frontend Development",
  },
  {
    id: "java-1",
    title: "Java Programming Complete Course",
    description: "Comprehensive Java course covering core concepts to advanced topics.",
    language: "Java",
    videoUrl: "https://www.youtube.com/watch?v=grEKMHGYyns",
    difficulty: "Intermediate",
    path: "Web Development",
    category: "Backend Development",
  },
  {
    id: "cplusplus-1",
    title: "C++ Programming Tutorial",
    description: "Learn C++ programming from the ground up with practical examples.",
    language: "C++",
    videoUrl: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
    difficulty: "Advanced",
    path: "Artificial Intelligence",
    category: "Programming Fundamentals",
  },
  {
    id: "php-1",
    title: "PHP for Web Development",
    description: "Learn PHP programming and server-side web development.",
    language: "PHP",
    videoUrl: "https://www.youtube.com/watch?v=OK_JCtrrv-c",
    difficulty: "Beginner",
    path: "Web Development",
    category: "Backend Development",
  },
  {
    id: "c-1",
    title: "C Programming for Beginners",
    description: "Comprehensive course on C programming language fundamentals.",
    language: "C",
    videoUrl: "https://www.youtube.com/watch?v=KJgsSFOSQv0",
    difficulty: "Beginner",
    path: "Data Science",
    category: "Programming Fundamentals",
  },
  {
    id: "sql-1",
    title: "SQL Database Programming",
    description: "Master SQL for database management and data analysis.",
    language: "SQL",
    videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    difficulty: "Intermediate",
    path: "Data Science",
    category: "Data Analysis",
  }
];

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
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
        language: course.language || "JavaScript",
        professor: {
          name: course.teacher?.name || "Unknown Professor",
          title: "Course Instructor"
        },
        materials: {
          videos: course.course_materials?.filter(m => m.type === 'video' || m.type === 'youtube').length || 0,
          pdfs: course.course_materials?.filter(m => m.type === 'pdf').length || 0,
          presentations: course.course_materials?.filter(m => m.type === 'presentation').length || 0
        }
      }));
      
      // Convert the programming language videos to featured courses
      const featuredProgrammingCourses: Course[] = programmingCourses.slice(0, 4).map((course, index) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        duration: "8 weeks",
        students: 1000 + Math.floor(Math.random() * 2000),
        image: "/placeholder.svg",
        difficulty: course.difficulty as any,
        path: course.path as any,
        category: course.category as any,
        language: course.language as any,
        professor: {
          name: "Prof. " + ["Ahmed El Amrani", "Fatima Benjelloun", "Youssef Chraibi", "Khadija Moussafir"][index % 4],
          title: "Programming Instructor"
        },
        materials: {
          videos: 1,
          pdfs: 1,
          presentations: 1
        }
      }));
      
      setFeaturedCourses(featuredProgrammingCourses);
      
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
          language: "Python",
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
          language: "Python",
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
          language: "Python",
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

  const renderProgrammingCourses = () => {
    return (
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Book className="text-primary mr-2 h-5 w-5" />
          <h2 className="text-2xl font-bold">Featured Programming Courses</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg duration-300">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600">
                  {course.language}
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
                  <div className="text-sm font-medium">8 semaines</div>
                  <Badge variant="outline">{course.path}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/student/courses/${course.id}/details`)}
                >
                  Voir Détails
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
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
                  Voir Détails
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mes Cours</h1>
          <Button onClick={() => navigate("/student")}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Voir Tableau de Bord
          </Button>
        </div>
        
        {renderProgrammingCourses()}
        
        {renderPremiumCourses()}
        
        <h2 className="text-2xl font-bold mb-6">Cours Inscrits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-6 bg-gray-100 rounded w-1/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </CardFooter>
              </Card>
            ))
          ) : courses.length === 0 ? (
            <div className="col-span-4 bg-gray-50 rounded-lg p-8 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">Vous n'êtes inscrit à aucun cours</h3>
              <p className="text-gray-600 mb-6">
                Inscrivez-vous à un cours pour commencer votre apprentissage.
              </p>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Parcourir les cours
              </Button>
            </div>
          ) : (
            courses.slice(0, 4).map((course) => (
              <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg duration-300">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary hover:bg-primary/90">
                    {course.language}
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
                    <div className="text-sm font-medium">{course.duration}</div>
                    <Badge variant="outline">{course.path}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/student/courses/${course.id}/details`)}
                  >
                    Continuer
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {courses.length > 4 && (
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate("/student/courses/all")}>
              Voir tous les cours ({courses.length})
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
