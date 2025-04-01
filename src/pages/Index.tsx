import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { CourseFilters } from "@/components/courses/CourseFilters";
import type { Course, CoursePath, CourseLevel } from "@/types/course";
import { 
  Code,
  Terminal,
  GraduationCap, 
  Database, 
  ArrowRight, 
  BookOpen,
  TerminalSquare,
  Brain,
  Server,
  Globe,
  Smartphone,
  Braces,
  Coffee,
  School,
  MapPin
} from "lucide-react";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoursePreview } from "@/components/landing/CoursePreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/landing/CodeBlock";

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
  const [activeDemoTab, setActiveDemoTab] = useState<string>("python");
  const paths = Array.from(new Set(allCourses.map(course => course.path))) as CoursePath[];
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const welcomeText = "console.log('Welcome to CodeAcademy');";

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

  useEffect(() => {
    if (isTyping) {
      if (typedText.length < welcomeText.length) {
        const timeout = setTimeout(() => {
          setTypedText(welcomeText.slice(0, typedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setTypedText("");
          setIsTyping(true);
        }, 3000);
      }
    }
  }, [typedText, isTyping]);

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

  const demoCodeSamples = {
    python: `# A simple Python function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
    
# Print the first 10 Fibonacci numbers
for i in range(10):
    print(fibonacci(i))`,
    javascript: `// JavaScript array methods
const developers = ['Sara', 'Ahmed', 'Yasmine'];

// Map through the array
const greetings = developers.map(name => {
  return \`Hello, \${name}! Welcome to coding.\`;
});

// Log the results
console.log(greetings);`,
    java: `// Java class example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, coding world!");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println("Loop iteration: " + i);
        }
    }
}`
  };

  const filteredCourses = (session ? allCourses : initialCourses).filter(course => {
    const matchesLevel = selectedLevel === "all" || course.difficulty === selectedLevel;
    const matchesPath = selectedPath === "all" || course.path === selectedPath;
    return matchesLevel && matchesPath;
  });

  const techFeatures = [
    {
      icon: <TerminalSquare className="h-10 w-10 text-primary" />,
      title: "Live Coding",
      description: "Write and execute code in real-time with our interactive editor"
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI Assistant",
      description: "Get personalized help from our AI coding assistant"
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: "Project-Based Learning",
      description: "Build real projects that enhance your portfolio"
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Developer Community",
      description: "Connect with peers and mentors in our global community"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section with Terminal Effect */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
                Learn to <span className="text-primary">Code</span> Like a Pro
              </h1>
              <div className="flex items-center mb-3">
                <Terminal className="text-primary h-6 w-6 mr-2" />
                <div className="h-8 font-mono text-primary">
                  {typedText}<span className={`inline-block w-2 h-5 bg-primary ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                </div>
              </div>
              <p className="text-xl text-gray-300 mb-8">
                Master in-demand programming languages with interactive courses designed by industry experts.
              </p>
              <div className="flex flex-wrap gap-4">
                {session ? (
                  <>
                    {renderPortalButton()}
                    {renderMyPlaceButton()}
                  </>
                ) : (
                  <Button
                    size="lg"
                    className="text-lg px-8 bg-primary hover:bg-primary/90 group"
                    onClick={() => navigate("/auth")}
                  >
                    Start Coding Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 bg-black/50 rounded-lg shadow-xl overflow-hidden border border-gray-700">
              <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-gray-400 text-sm font-mono">~/techmentor/demo.js</div>
              </div>
              <div className="p-4">
                <div className="flex border-b border-gray-700 mb-4">
                  <button 
                    className={`px-4 py-2 text-sm font-mono ${activeDemoTab === 'python' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveDemoTab('python')}
                  >
                    python
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-mono ${activeDemoTab === 'javascript' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveDemoTab('javascript')}
                  >
                    javascript
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-mono ${activeDemoTab === 'java' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveDemoTab('java')}
                  >
                    java
                  </button>
                </div>
                <CodeBlock code={demoCodeSamples[activeDemoTab as keyof typeof demoCodeSamples]} language={activeDemoTab} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <Code className="inline-block mr-2 text-primary" /> Cutting-Edge Learning Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides developers with the most advanced tools to learn programming efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow hover:border-primary/50">
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section with Coffee animation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 animate-ping opacity-30">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <div className="bg-white p-6 rounded-full shadow-lg">
                <Braces className="h-16 w-16 text-primary" />
              </div>
              <div className="absolute -bottom-4 -right-4 animate-pulse">
                <Code className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Programming Languages</h2>
              <p className="text-gray-600 max-w-2xl">
                Our comprehensive courses cover all the major programming languages used in industry today.
                From web development to data science, we've got you covered.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {["Python", "JavaScript", "Java", "PHP", "C++", "SQL"].map((lang, i) => (
              <Card key={i} className="hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate("/auth")}>
                <CardContent className="p-4">
                  <div className="font-mono font-bold text-lg text-primary">{lang}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Course Preview Section */}
      <CoursePreview />

      {/* Courses Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Cours Populaires</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Commencez votre parcours avec nos cours de programmation les plus populaires,
              enseignés par des professeurs expérimentés d'institutions renommées.
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

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <Footer />
      
      {/* Quick Access Button */}
      {renderQuickAccessButton()}
    </div>
  );
};

export default Index;
