
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book, Code, FileCode, Terminal } from "lucide-react";
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
import type { Course } from "@/types/course";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch enrolled courses
      const { data: enrolledCourses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          path,
          category,
          difficulty,
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
        setCourses(enrolledCourses as Course[]);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Track your learning progress</p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <NavigationCard
            icon={Book}
            title="Courses"
            description="Access your enrolled courses and track your progress."
            buttonText="View My Courses"
          />

          <NavigationCard
            icon={FileCode}
            title="Exercises & Projects"
            description="Practice with coding exercises and complete projects."
            buttonText="Start Practicing"
          />

          <NavigationCard
            icon={Terminal}
            title="Code Editor"
            description="Write, run, and debug code with AI assistance."
            buttonText="Open Code Editor"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Code className="mr-2 h-4 w-4" />
                  Open Code Editor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-[90vw]">
                <DialogHeader>
                  <DialogTitle>AI-Powered Code Editor</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <CodeEditorWrapper />
                </div>
              </DialogContent>
            </Dialog>
          </NavigationCard>
        </div>

        {/* Detailed Content Tabs */}
        <CourseTabs courses={courses} loading={loading} />
      </div>
    </div>
  );
};

export default StudentDashboard;
