
import { useState, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { CourseFilters } from "@/components/student/freeCourses/CourseFilters";
import { CourseList } from "@/components/student/freeCourses/CourseList";
import { FreeCourse } from "@/components/student/freeCourses/CourseCard";

// Course data
const programmingCourses: FreeCourse[] = [
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
        <CourseFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />

        {/* Courses List */}
        <CourseList 
          courses={filteredCourses} 
          userProgress={userProgress} 
          onProgressUpdate={updateProgress}
          onResetFilter={() => setFilter("all")}
        />
      </div>
    </DashboardLayout>
  );
};

export default FreeCoursesDashboard;
