
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  UserCheck, 
  ExternalLink, 
  FileText,
  Download,
  MessageSquare
} from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface Course {
  id: string;
  language: string;
  title: string;
  description: string;
  image: string;
  youtubeUrl: string;
  difficulty: string;
  estimatedHours: number;
  students: number;
  category: string;
  resources: {
    pdf: boolean;
    presentation: boolean;
  }
}

const programmingCourses: Course[] = [
  {
    id: "python",
    language: "Python",
    title: "Python Programming for Beginners",
    description: "Learn the fundamentals of Python, one of the most popular languages for web development, scripting, and AI.",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    difficulty: "Beginner",
    estimatedHours: 12,
    students: 5420,
    category: "Programming Fundamentals",
    resources: {
      pdf: true,
      presentation: true
    }
  },
  {
    id: "java",
    language: "Java",
    title: "Java Programming Full Course",
    description: "Java is a versatile language used in enterprise applications, web development, and more.",
    image: "https://images.unsplash.com/photo-1610986603166-f78428624e76?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=grEKMHGYyns",
    difficulty: "Intermediate",
    estimatedHours: 18,
    students: 3267,
    category: "Object-Oriented Programming",
    resources: {
      pdf: true,
      presentation: true
    }
  },
  {
    id: "javascript",
    language: "JavaScript",
    title: "JavaScript Full Course for Beginners",
    description: "JavaScript is essential for client-side web development.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    difficulty: "Beginner",
    estimatedHours: 15,
    students: 7829,
    category: "Web Development",
    resources: {
      pdf: true,
      presentation: true
    }
  },
  {
    id: "c",
    language: "C",
    title: "C Programming Full Course",
    description: "C is the foundation of many other programming languages and is essential for system programming.",
    image: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=KJgsSFOSQv0",
    difficulty: "Intermediate",
    estimatedHours: 20,
    students: 2458,
    category: "System Programming",
    resources: {
      pdf: true,
      presentation: true
    }
  },
  {
    id: "cpp",
    language: "C++",
    title: "C++ Programming Full Course",
    description: "C++ extends C and is widely used for software development, game programming, and systems engineering.",
    image: "https://images.unsplash.com/photo-1650991459270-01d53a6afbcd?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
    difficulty: "Advanced",
    estimatedHours: 24,
    students: 3219,
    category: "Game Development",
    resources: {
      pdf: true,
      presentation: true
    }
  },
  {
    id: "php",
    language: "PHP",
    title: "PHP Full Course for Beginners",
    description: "PHP is primarily used for dynamic web development.",
    image: "https://images.unsplash.com/photo-1599507593548-0187ac4043c6?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=OK_JCtrrv-c",
    difficulty: "Intermediate",
    estimatedHours: 14,
    students: 1986,
    category: "Web Development",
    resources: {
      pdf: true,
      presentation: true
    }
  },
  {
    id: "sql",
    language: "SQL",
    title: "SQL Full Course for Beginners",
    description: "SQL is used to manage and manipulate relational databases.",
    image: "https://images.unsplash.com/photo-1603322327561-7520bfc3b8f5?auto=format&fit=crop&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    difficulty: "Beginner",
    estimatedHours: 10,
    students: 4123,
    category: "Database Management",
    resources: {
      pdf: true,
      presentation: true
    }
  }
];

const FreeCoursesDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthState();
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate loading progress data from storage or API
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      // Initialize with demo progress for a better first-time user experience
      const demoProgress = {
        "python": 25,
        "javascript": 50,
        "java": 10
      };
      setUserProgress(demoProgress);
      localStorage.setItem('courseProgress', JSON.stringify(demoProgress));
    }
  }, []);

  const updateProgress = (courseId: string, progress: number) => {
    const newProgress = { ...userProgress, [courseId]: progress };
    setUserProgress(newProgress);
    localStorage.setItem('courseProgress', JSON.stringify(newProgress));
    toast.success(`Progress updated for ${courseId}`);
  };

  const downloadResource = (courseId: string, resourceType: 'pdf' | 'presentation') => {
    // In a real app, this would download actual files
    toast.success(`Downloading ${resourceType} for ${courseId} course`);
  };

  const handleWatchCourse = (course: Course) => {
    // Update progress if not started
    if (!userProgress[course.id]) {
      updateProgress(course.id, 5);
    }
    
    // Open YouTube in new tab
    window.open(course.youtubeUrl, '_blank');
  };

  const filteredCourses = filter === "all" 
    ? programmingCourses 
    : programmingCourses.filter(course => 
        filter === "in-progress" 
          ? userProgress[course.id] && userProgress[course.id] < 100 
          : filter === "completed" 
            ? userProgress[course.id] && userProgress[course.id] === 100
            : course.difficulty === filter
      );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Free Programming Courses</h1>
          <p className="text-gray-600">
            Explore our free programming language courses with video tutorials, downloadable resources, and more.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
          >
            All Courses
          </Button>
          <Button 
            variant={filter === "Beginner" ? "default" : "outline"} 
            onClick={() => setFilter("Beginner")}
          >
            Beginner
          </Button>
          <Button 
            variant={filter === "Intermediate" ? "default" : "outline"} 
            onClick={() => setFilter("Intermediate")}
          >
            Intermediate
          </Button>
          <Button 
            variant={filter === "Advanced" ? "default" : "outline"} 
            onClick={() => setFilter("Advanced")}
          >
            Advanced
          </Button>
          <Button 
            variant={filter === "in-progress" ? "default" : "outline"} 
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"} 
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.language}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary">{course.language}</Badge>
                </div>
                {userProgress[course.id] && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${userProgress[course.id]}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.category}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.estimatedHours} hours
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-1" />
                    {course.students.toLocaleString()} students
                  </div>
                </div>
                
                {userProgress[course.id] && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Your progress</span>
                      <span>{userProgress[course.id]}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${userProgress[course.id]}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Resources */}
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Free Resources:</h4>
                  <div className="flex gap-2">
                    {course.resources.pdf && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => downloadResource(course.id, 'pdf')}
                      >
                        <FileText className="h-4 w-4" />
                        PDF Notes
                      </Button>
                    )}
                    {course.resources.presentation && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => downloadResource(course.id, 'presentation')}
                      >
                        <Download className="h-4 w-4" />
                        Slides
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleWatchCourse(course)}
                >
                  Watch Course
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/student/courses/${course.id}/discussion`)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-md">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              No courses match your current filter. Try changing your filter options.
            </p>
            <Button onClick={() => setFilter("all")}>
              Show All Courses
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FreeCoursesDashboard;
