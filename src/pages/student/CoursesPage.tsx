
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { GraduationCap, Code, Terminal, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Course } from "@/types/course";
import { FeaturedCourses } from "@/components/student/FeaturedCourses";
import { PremiumCourses } from "@/components/student/PremiumCourses";
import { EnrolledCourses } from "@/components/student/EnrolledCourses";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Collection of programming language courses with YouTube links
const programmingCourses = [
  {
    id: "python-1",
    title: "Python Programming for Beginners",
    description: "Python is a versatile programming language, ideal for beginners. It's used in many fields such as artificial intelligence, web development, and data analysis.",
    language: "Python",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    difficulty: "Beginner",
    path: "Data Science",
    category: "Programming Fundamentals",
    estimatedTime: "2-3 months"
  },
  {
    id: "java-1",
    title: "Java Programming Complete Course",
    description: "Java is one of the most popular programming languages, mainly used for developing Android applications and enterprise systems.",
    language: "Java",
    videoUrl: "https://www.youtube.com/watch?v=grEKMHGYyns",
    difficulty: "Intermediate",
    path: "Web Development",
    category: "Backend Development",
    estimatedTime: "3-4 months"
  },
  {
    id: "javascript-1",
    title: "Modern JavaScript Development",
    description: "JavaScript is a programming language used to create interactive web pages. It is essential for any web developer who wants to build dynamic websites.",
    language: "JavaScript",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    difficulty: "Intermediate",
    path: "Web Development",
    category: "Frontend Development",
    estimatedTime: "2-3 months"
  },
  {
    id: "sql-1",
    title: "SQL Database Programming",
    description: "SQL is the standard language for managing and manipulating databases. It is crucial for developers working with relational database management systems.",
    language: "SQL",
    videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    difficulty: "Intermediate",
    path: "Data Science",
    category: "Data Analysis",
    estimatedTime: "1-2 months"
  }
];

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [premiumCourses, setPremiumCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        language: "JavaScript", // Default language if not provided
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
      const featuredProgrammingCourses: Course[] = programmingCourses.map((course, index) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        duration: course.estimatedTime,
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

  const filteredFeaturedCourses = searchTerm 
    ? featuredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.language.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : featuredCourses;

  const filteredPremiumCourses = searchTerm
    ? premiumCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : premiumCourses;

  const filteredEnrolledCourses = searchTerm
    ? courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center mb-2">
                <BookOpen className="mr-3 h-7 w-7" />
                Mes Cours
              </h1>
              <p className="text-indigo-100 max-w-2xl">
                Développez vos compétences de programmation avec nos cours interactifs et projets pratiques
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-white text-indigo-900 hover:bg-indigo-100"
              onClick={() => navigate("/student")}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Tableau de Bord
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" />
            <Input 
              className="pl-10 bg-indigo-800/50 border-indigo-700 text-white placeholder:text-indigo-300 focus:ring-2 focus:ring-white w-full md:w-1/2 lg:w-1/3"
              placeholder="Rechercher des cours..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              <Code className="mr-2 h-4 w-4" />
              Tous les cours
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-white">
              <Terminal className="mr-2 h-4 w-4" />
              Langages de programmation
            </TabsTrigger>
            <TabsTrigger value="premium" className="data-[state=active]:bg-white">
              <GraduationCap className="mr-2 h-4 w-4" />
              Cours Premium
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-12">
              <FeaturedCourses courses={filteredFeaturedCourses} />
              
              <PremiumCourses courses={filteredPremiumCourses} />
              
              <div>
                <div className="flex items-center mb-6">
                  <BookOpen className="text-primary mr-2 h-5 w-5" />
                  <h2 className="text-2xl font-bold">Cours Inscrits</h2>
                </div>
                <EnrolledCourses courses={filteredEnrolledCourses} loading={loading} />
              </div>
              
              {courses.length > 4 && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => navigate("/student/courses/all")}>
                    Voir tous les cours ({courses.length})
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            <FeaturedCourses courses={filteredFeaturedCourses} />
          </TabsContent>
          
          <TabsContent value="premium" className="mt-6">
            <PremiumCourses courses={filteredPremiumCourses} />
          </TabsContent>
        </Tabs>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="rounded-full bg-indigo-100 p-4">
                <Code className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Vous souhaitez améliorer vos compétences en programmation?</h3>
                <p className="text-gray-600 mb-4">
                  Essayez notre éditeur de code intégré pour pratiquer en temps réel
                </p>
                <Button 
                  onClick={() => navigate("/student/code-editor")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Ouvrir l'éditeur de code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
