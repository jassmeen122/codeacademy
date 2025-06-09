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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublishedCourseCard } from "@/components/courses/PublishedCourseCard";
import { usePublishedCourses } from "@/hooks/usePublishedCourses";

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
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [premiumCourses, setPremiumCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Utiliser le hook pour les cours publiés
  const { 
    courses: publishedCourses, 
    loading: publishedLoading, 
    enrollInCourse, 
    continueCourse 
  } = usePublishedCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
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

  const filteredPublishedCourses = searchTerm
    ? publishedCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : publishedCourses;

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
        
        <Tabs defaultValue="published" className="mb-8">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="published" className="data-[state=active]:bg-white">
              <BookOpen className="mr-2 h-4 w-4" />
              Cours Publiés
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
          
          <TabsContent value="published" className="mt-6">
            <div>
              <div className="flex items-center mb-6">
                <BookOpen className="text-primary mr-2 h-5 w-5" />
                <h2 className="text-2xl font-bold">Cours Disponibles sur la Plateforme</h2>
              </div>
              
              {publishedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPublishedCourses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun cours publié</h3>
                    <p className="text-muted-foreground">
                      Aucun cours n'a encore été publié par les enseignants.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublishedCourses.map((course) => (
                    <PublishedCourseCard
                      key={course.id}
                      course={course}
                      onEnroll={enrollInCourse}
                      onContinue={continueCourse}
                    />
                  ))}
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
