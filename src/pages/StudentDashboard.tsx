
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book, Code, FileCode, Terminal, Youtube } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CodeEditorWrapper } from "@/components/CodeEditor/CodeEditorWrapper";
import { toast } from "sonner";
import { NavigationCard } from "@/components/dashboard/NavigationCard";
import { CourseTabs } from "@/components/dashboard/CourseTabs";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodingMiniGame } from "@/components/student/CodingMiniGame";
import type { Course } from "@/types/course";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        toast.error("Failed to fetch user profile");
        console.error("Error fetching profile:", profileError);
      } else {
        setUserProfile(profile);
      }

      // Fetch enrolled courses
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

      if (error) {
        toast.error("Failed to fetch courses");
        console.error("Error fetching courses:", error);
      } else if (enrolledCourses) {
        // Transform the data to match our Course type
        const transformedCourses: Course[] = enrolledCourses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description || "",
          duration: "8 weeks", // Default duration
          students: 0, // We'll need to implement this
          image: "/placeholder.svg", // Default image
          difficulty: course.difficulty,
          path: course.path,
          category: course.category,
          language: "JavaScript", // Default language
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
        
        setCourses(transformedCourses);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {userProfile?.full_name || 'Student'}!
          </h1>
          <p className="text-gray-600">Track your learning progress</p>
        </div>

        {/* Grid Layout for Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Left Side: Quick Actions */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <NavigationCard
                icon={Book}
                title="Resume Learning"
                description="Continue where you left off in your latest course."
                buttonText="Continue Course"
              />

              <NavigationCard
                icon={FileCode}
                title="Daily Challenge"
                description="Complete today's coding challenge to earn points."
                buttonText="Start Challenge"
              />

              <NavigationCard
                icon={Youtube}
                title="Free Courses"
                description="Access our free programming language courses with YouTube videos."
                buttonText="Browse Free Courses"
                onClick={() => navigate("/student/free-courses")}
              />

              <NavigationCard
                icon={Terminal}
                title="Code Editor"
                description="Write, run, and debug code with AI assistance."
                buttonText="Open Code Editor"
                onClick={() => navigate("/student/editor")} 
              />
            </div>

            {/* Course Progress */}
            <CourseTabs courses={courses} loading={loading} />
          </div>

          {/* Right Side: Mini-Game */}
          <div className="md:col-span-4">
            <CodingMiniGame />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
