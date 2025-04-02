import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Target,
  Award,
  TrendingUp,
  Flame,
  Brain,
  LineChart,
  BarChart,
  Code,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

import { OverviewTab } from "@/components/student/progress/OverviewTab";
import { PerformanceTab } from "@/components/student/progress/PerformanceTab";
import { RecommendationsTab } from "@/components/student/progress/RecommendationsTab";

interface UserActivity {
  day: string;
  hours: number;
}

interface SkillProgress {
  name: string;
  progress: number;
}

interface UserAchievement {
  title: string;
  description: string;
  icon: any;
  achieved: boolean;
}

interface CourseCompletion {
  name: string;
  completion: number;
}

interface LearningStats {
  totalHours: string;
  coursesCompleted: string;
  exercisesCompleted: string;
  achievementPoints: string;
  streak: string;
  lastLogin: string;
}

interface TaskStatus {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const ProgressPage = () => {
  const { user } = useAuthState();
  const [activeTab, setActiveTab] = useState("overview");
  const [weeklyActivity, setWeeklyActivity] = useState<UserActivity[]>([]);
  const [monthlyActivity, setMonthlyActivity] = useState<{name: string; value: number}[]>([]);
  const [skills, setSkills] = useState<SkillProgress[]>([
    { name: "JavaScript", progress: 75 },
    { name: "React", progress: 60 },
    { name: "TypeScript", progress: 45 },
    { name: "Node.js", progress: 30 },
    { name: "CSS/Tailwind", progress: 65 },
    { name: "Database/SQL", progress: 40 },
  ]);
  const [courseCompletions, setCourseCompletions] = useState<CourseCompletion[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([
    {
      title: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: Target,
      achieved: true,
    },
    {
      title: "Code Master",
      description: "Solve 10 coding challenges",
      icon: Award,
      achieved: true,
    },
    {
      title: "Team Player",
      description: "Help 5 other students",
      icon: Trophy,
      achieved: false,
    },
  ]);
  const [stats, setStats] = useState<LearningStats>({
    totalHours: "24h",
    coursesCompleted: "3/5",
    exercisesCompleted: "45",
    achievementPoints: "1,250",
    streak: "7 days",
    lastLogin: "Today"
  });
  const [performanceData, setPerformanceData] = useState([
    { name: 'Monday', score: 85 },
    { name: 'Tuesday', score: 70 },
    { name: 'Wednesday', score: 90 },
    { name: 'Thursday', score: 65 },
    { name: 'Friday', score: 78 },
    { name: 'Saturday', score: 82 },
    { name: 'Sunday', score: 88 },
  ]);
  const [tasks, setTasks] = useState<TaskStatus[]>([
    { 
      id: "1", 
      name: "Complete JavaScript Fundamentals", 
      status: "completed", 
      dueDate: "2023-08-15", 
      priority: "high" 
    },
    { 
      id: "2", 
      name: "Finish React Components Exercise", 
      status: "in-progress", 
      dueDate: "2023-08-25", 
      priority: "high" 
    },
    { 
      id: "3", 
      name: "Start TypeScript Module", 
      status: "not-started", 
      dueDate: "2023-09-05", 
      priority: "medium" 
    },
    { 
      id: "4", 
      name: "Complete Backend Integration Project", 
      status: "not-started", 
      dueDate: "2023-09-20", 
      priority: "medium" 
    },
  ]);
  const [retentionRate, setRetentionRate] = useState([
    { month: 'Jan', rate: 92 },
    { month: 'Feb', rate: 89 },
    { month: 'Mar', rate: 93 },
    { month: 'Apr', rate: 91 },
    { month: 'May', rate: 94 },
    { month: 'Jun', rate: 97 },
  ]);
  const [recommendations, setRecommendations] = useState([
    {
      title: "Advanced TypeScript",
      description: "Based on your progress, this course would be perfect to deepen your TypeScript knowledge",
      relevance: 95,
      icon: Code,
    },
    {
      title: "React State Management",
      description: "Complete this to master React hooks and context API",
      relevance: 87,
      icon: Brain,
    },
    {
      title: "Node.js Microservices",
      description: "Taking this would complement your backend skills",
      relevance: 82,
      icon: BarChart,
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      generateMockWeeklyActivity();
      fetchCourseCompletions();
      generateMonthlyActivityData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user?.id);

      if (progressError) {
        console.error('Error fetching student progress:', progressError);
        return;
      }

      if (progressData && progressData.length > 0) {
        const avgCompletion = progressData.reduce((sum, item) => 
          sum + (item.completion_percentage || 0), 0) / progressData.length;
        
        const updatedSkills = [...skills];
        updatedSkills[0].progress = Math.min(Math.round(avgCompletion * 1.2), 100);
        updatedSkills[1].progress = Math.min(Math.round(avgCompletion * 0.9), 100);
        setSkills(updatedSkills);
      }

      const { data: metricsData, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!metricsError && metricsData) {
        setStats({
          totalHours: `${metricsData.total_time_spent || 0}h`,
          coursesCompleted: `${metricsData.course_completions || 0}/5`,
          exercisesCompleted: `${metricsData.exercises_completed || 0}`,
          achievementPoints: `${user?.points || 0}`,
          streak: `${Math.floor(Math.random() * 14) + 1} days`,
          lastLogin: metricsData.last_login ? new Date(metricsData.last_login).toLocaleDateString() : 'Today'
        });
      }

    } catch (error) {
      console.error('Error in fetch user data:', error);
    }
  };

  const generateMockWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mockData = days.map(day => ({
      day,
      hours: parseFloat((Math.random() * 4 + 0.5).toFixed(1))
    }));
    setWeeklyActivity(mockData);
  };

  const generateMonthlyActivityData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const mockData = months.map(name => ({
      name,
      value: Math.floor(Math.random() * 40) + 10
    }));
    setMonthlyActivity(mockData);
  };

  const fetchCourseCompletions = async () => {
    try {
      const mockCourseData: CourseCompletion[] = [
        { name: "JavaScript Basics", completion: 100 },
        { name: "React Fundamentals", completion: 75 },
        { name: "TypeScript Introduction", completion: 45 },
        { name: "Node.js Essentials", completion: 20 },
        { name: "Advanced React", completion: 10 },
      ];
      setCourseCompletions(mockCourseData);
    } catch (error) {
      console.error('Error fetching course completions:', error);
    }
  };

  const trackActivity = async (activityType: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: { page: 'progress', tab: activeTab }
        });
        
      if (error) throw error;
      
      toast.success(`${activityType} tracked successfully!`);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rapport de Progression</h1>
          <p className="text-gray-600">
            Suivez votre parcours d'apprentissage, consultez vos statistiques et obtenez des recommandations personnalisées
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" onClick={() => trackActivity("Overview Tab View")}>Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="performance" onClick={() => trackActivity("Performance Tab View")}>Performance</TabsTrigger>
            <TabsTrigger value="recommendations" onClick={() => trackActivity("Recommendations Tab View")}>Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              stats={stats}
              weeklyActivity={weeklyActivity}
              tasks={tasks}
              skills={skills}
              achievements={achievements}
              onTrackActivity={trackActivity}
            />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab 
              performanceData={performanceData}
              monthlyActivity={monthlyActivity}
              retentionRate={retentionRate}
              courseCompletions={courseCompletions}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsTab 
              recommendations={recommendations}
              onTrackActivity={trackActivity}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
