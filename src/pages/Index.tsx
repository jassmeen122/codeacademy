import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { CourseFilters } from "@/components/courses/CourseFilters";
import type { Course, CoursePath, CourseLevel } from "@/types/course";
import { School, GraduationCap, Database, ArrowRight, MapPin } from "lucide-react";

const allCourses: Course[] = [
  {
    id: "1",
    title: "Python Programming",
    description: "Start your coding journey with Python, the most beginner-friendly programming language",
    duration: "8 weeks",
    students: 1234,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80",
    difficulty: "Beginner",
    path: "Data Science",
    category: "Programming Fundamentals",
    language: "Python",
    professor: {
      name: "Prof. Ahmed El Amrani",
      title: "Data Science Lead"
    },
    materials: {
      videos: 24,
      pdfs: 12,
      presentations: 8
    }
  },
  {
    id: "2",
    title: "Modern JavaScript Development",
    description: "Master JavaScript and modern web development practices",
    duration: "12 weeks",
    students: 2156,
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80",
    difficulty: "Intermediate",
    path: "Web Development",
    category: "Frontend Development",
    language: "JavaScript",
    professor: {
      name: "Prof. Youssef Chraibi",
      title: "Frontend Development Lead"
    },
    materials: {
      videos: 36,
      pdfs: 15,
      presentations: 12
    }
  },
  {
    id: "3",
    title: "Java Enterprise Applications",
    description: "Build robust enterprise applications with Java",
    duration: "10 weeks",
    students: 1589,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    difficulty: "Advanced",
    path: "Web Development",
    category: "Backend Development",
    language: "Java",
    professor: {
      name: "Prof. Fatima Benjelloun",
      title: "Enterprise Solutions Lead"
    },
    materials: {
      videos: 28,
      pdfs: 18,
      presentations: 10
    }
  },
  {
    id: "4",
    title: "SQL Database Design",
    description: "Master database design and SQL query optimization",
    duration: "8 weeks",
    students: 1876,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80",
    difficulty: "Intermediate",
    path: "Data Science",
    category: "Data Analysis",
    language: "SQL",
    professor: {
      name: "Prof. Khadija Moussafir",
      title: "Database Systems Lead"
    },
    materials: {
      videos: 42,
      pdfs: 24,
      presentations: 16
    }
  },
  {
    id: "5",
    title: "C++ Game Development",
    description: "Create games and understand game engine architecture with C++",
    duration: "14 weeks",
    students: 2341,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
    difficulty: "Advanced",
    path: "Artificial Intelligence",
    category: "Programming Fundamentals",
    language: "C++",
    professor: {
      name: "Prof. Samira Idrissi",
      title: "Game Development Lead"
    },
    materials: {
      videos: 32,
      pdfs: 20,
      presentations: 14
    }
  },
  {
    id: "6",
    title: "PHP Web Applications",
    description: "Build dynamic web applications with PHP and MySQL",
    duration: "10 weeks",
    students: 1432,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
    difficulty: "Intermediate",
    path: "Web Development",
    category: "Backend Development",
    language: "PHP",
    professor: {
      name: "Prof. Redouane Bekkali",
      title: "Web Applications Lead"
    },
    materials: {
      videos: 48,
      pdfs: 30,
      presentations: 20
    }
  },
  {
    id: "7",
    title: "C Programming Fundamentals",
    description: "Master the fundamentals of C programming and system architecture",
    duration: "10 weeks",
    students: 1567,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80",
    difficulty: "Beginner",
    path: "Web Development",
    category: "Programming Fundamentals",
    language: "C",
    professor: {
      name: "Prof. Hicham Alaoui",
      title: "Systems Programming Lead"
    },
    materials: {
      videos: 40,
      pdfs: 25,
      presentations: 15
    }
  }
];

const initialCourses = allCourses.slice(0, 4);

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | "all">("all");
  const [selectedPath, setSelectedPath] = useState<CoursePath | "all">("all");
  const paths = Array.from(new Set(allCourses.map(course => course.path))) as CoursePath[];

  useEffect(() => {
    checkAuthAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthAndRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    
    if (session) {
      await fetchUserRole(session.user.id);
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserRole(profile?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleViewAllCourses = () => {
    if (!session) {
      navigate("/auth");
    }
  };

  const renderAuthPrompt = () => (
    <div className="text-center p-8 bg-primary/5 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Sign In to Access All Courses</h3>
      <p className="text-gray-600 mb-6">
        Please sign in or create an account to view our complete course catalog and start learning.
      </p>
      <Button 
        size="lg"
        className="bg-primary hover:bg-primary/90"
        onClick={() => navigate("/auth")}
      >
        Get Started Now
      </Button>
    </div>
  );

  const navigateToPortal = () => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'teacher') {
      navigate('/teacher');
    } else if (userRole === 'student') {
      navigate('/student');
    } else {
      navigate('/auth');
    }
  };

  const renderPortalButton = () => {
    if (!userRole) return null;
    
    let icon;
    let label;
    
    switch(userRole) {
      case 'admin':
        icon = <Database className="h-5 w-5 mr-2" />;
        label = "Admin Portal";
        break;
      case 'teacher':
        icon = <School className="h-5 w-5 mr-2" />;
        label = "Teacher Portal";
        break;
      case 'student':
        icon = <GraduationCap className="h-5 w-5 mr-2" />;
        label = "Student Portal";
        break;
      default:
        return null;
    }
    
    return (
      <Button
        size="lg"
        className="flex items-center text-lg px-8 bg-primary hover:bg-primary/90"
        onClick={navigateToPortal}
      >
        {icon}
        {label}
      </Button>
    );
  };

  const renderMyPlaceButton = () => {
    if (userRole) {
      let icon;
      let label = "My Place";
      let destination = '/';
      
      switch(userRole) {
        case 'admin':
          icon = <Database className="h-5 w-5 mr-2" />;
          destination = '/admin';
          break;
        case 'teacher':
          icon = <School className="h-5 w-5 mr-2" />;
          destination = '/teacher';
          break;
        case 'student':
          icon = <GraduationCap className="h-5 w-5 mr-2" />;
          destination = '/student';
          break;
        default:
          icon = <MapPin className="h-5 w-5 mr-2" />;
      }
      
      return (
        <Button
          size="lg"
          className="flex items-center text-lg px-8 bg-blue-500 hover:bg-blue-600 ml-4"
          onClick={() => navigate(destination)}
        >
          {icon}
          {label}
        </Button>
      );
    }
    return null;
  };

  const renderQuickAccessButton = () => {
    if (!session) return null;
    
    return (
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90 p-6"
          onClick={navigateToPortal}
          title="Accéder à votre tableau de bord"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    );
  };

  const canManageCourses = userRole === 'admin' || userRole === 'teacher';

  const filteredCourses = (session ? allCourses : initialCourses).filter(course => {
    const matchesLevel = selectedLevel === "all" || course.difficulty === selectedLevel;
    const matchesPath = selectedPath === "all" || course.path === selectedPath;
    return matchesLevel && matchesPath;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 text-foreground">
              Learn to Code with
              <span className="text-primary"> Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Join millions of learners and start coding with our structured learning paths.
              Master in-demand programming skills through hands-on practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {renderPortalButton()}
                  {renderMyPlaceButton()}
                </div>
              ) : (
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/auth")}
                >
                  Get Started Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start your journey with our most popular programming courses,
              taught by experienced professors from leading institutions.
            </p>
          </div>
          
          <CourseFilters
            selectedLevel={selectedLevel}
            selectedPath={selectedPath}
            onLevelChange={setSelectedLevel}
            onPathChange={setSelectedPath}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          {!session && (
            <div className="text-center mt-8">
              {renderAuthPrompt()}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CodeAcademy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience a new way of learning with our cutting-edge platform features
              designed to accelerate your growth in programming.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards will be added in next iteration */}
          </div>
        </div>
      </section>
      
      {/* Bouton d'accès rapide */}
      {renderQuickAccessButton()}
    </div>
  );
};

export default Index;

