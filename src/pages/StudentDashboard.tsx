
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book, Code, FileCode, Terminal, Youtube, Activity, Trophy, Brain } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

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

  // Weekly Activity Data (mock)
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.0 },
    { day: 'Thu', hours: 0.5 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 1.5 },
  ];

  // Recent Achievements (mock)
  const recentAchievements = [
    { title: 'Code Warrior', description: 'Completed 10 coding challenges', icon: Code },
    { title: 'Learning Machine', description: 'Studied for 20 hours this week', icon: Brain },
    { title: 'Fast Learner', description: 'Completed a course in record time', icon: Trophy },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Dashboard Header with Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Welcome back, {userProfile?.full_name || 'Student'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Your learning dashboard - Track your programming journey
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/student/profile")}>
                  View Profile
                </Button>
                <Button onClick={() => navigate("/student/courses")}>
                  Browse Courses
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <TabsContent value="overview" className="mt-0 space-y-6" forceMount={activeTab === "overview" ? true : undefined}>
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="md:col-span-8 space-y-6">
                {/* Quick Actions Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NavigationCard
                    icon={Code}
                    title="Code Editor"
                    description="Write, run, and debug code with AI assistance."
                    buttonText="Open Editor"
                    onClick={() => navigate("/student/editor")}
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 hover:shadow-md transition-all border-indigo-200 dark:border-indigo-800"
                  />
                  
                  <NavigationCard
                    icon={FileCode}
                    title="Daily Challenge"
                    description="Complete today's coding challenge to earn points."
                    buttonText="Start Challenge"
                    className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-md transition-all border-purple-200 dark:border-purple-800"
                  />
                  
                  <NavigationCard
                    icon={Youtube}
                    title="Dev Tutorials"
                    description="Access free programming videos from top YouTubers."
                    buttonText="Watch Now"
                    onClick={() => navigate("/student/yt-dev-tutorials")}
                    className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:shadow-md transition-all border-red-200 dark:border-red-800"
                  />
                  
                  <NavigationCard
                    icon={Brain}
                    title="AI Assistant"
                    description="Get help with your code and learning questions."
                    buttonText="Ask AI"
                    onClick={() => navigate("/student/ai-assistant")}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 hover:shadow-md transition-all border-teal-200 dark:border-teal-800"
                  />
                </div>
                
                {/* Weekly Activity */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" />
                        Weekly Coding Activity
                      </h2>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end h-32 mt-2">
                      {weeklyActivity.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-8 bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-all"
                            style={{ height: `${day.hours * 10}px` }}
                          ></div>
                          <span className="text-xs font-medium text-gray-600">{day.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <span>Total: 15.3 hours this week</span>
                      <span className="text-green-600 font-medium">+23% from last week</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Enrolled Courses */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Book className="h-5 w-5 text-indigo-500" />
                    Your Courses
                  </h2>
                  <CourseTabs courses={courses} loading={loading} />
                </div>
              </div>
              
              {/* Right Column */}
              <div className="md:col-span-4 space-y-6">
                {/* User Stats */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                      <h3 className="text-white font-medium">Your Progress</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Course Completion</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Coding Challenges</span>
                          <span className="font-medium">42%</span>
                        </div>
                        <Progress value={42} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Points Earned</span>
                          <span className="font-medium">2,450</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => navigate("/student/progress")}
                      >
                        View Detailed Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Achievements */}
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Recent Achievements
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentAchievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                          <achievement.icon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => navigate("/student/achievements")}
                    >
                      View All Achievements
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Mini Game Component */}
                <CodingMiniGame />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0" forceMount={activeTab === "progress" ? true : undefined}>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
                <p className="text-gray-500">Detailed progress stats will be displayed here.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/student/progress")}
                >
                  View Full Progress Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-0" forceMount={activeTab === "achievements" ? true : undefined}>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
                <p className="text-gray-500">Your badges and achievements will be displayed here.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/student/achievements")}
                >
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

