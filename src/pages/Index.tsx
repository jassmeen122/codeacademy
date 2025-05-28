import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { TechFeaturesSection } from "@/components/landing/TechFeaturesSection";
import { LanguagesSection } from "@/components/landing/LanguagesSection";
import { PopularCoursesSection } from "@/components/landing/PopularCoursesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoursePreview } from "@/components/landing/CoursePreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { QuickAccessButton } from "@/components/landing/QuickAccessButton";
import type { Course } from "@/types/course";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <HeroSection />
      
      <TechFeaturesSection />
      
      <LanguagesSection />
      
      <HowItWorks />
      
      <CoursePreview />
      
      <PopularCoursesSection 
        allCourses={allCourses} 
        initialCourses={initialCourses} 
        session={session} 
      />
      
      <Testimonials />
      
      <Footer />
      
      {session && <QuickAccessButton onClick={navigateToPortal} />}
    </div>
  );
};

export default Index;
