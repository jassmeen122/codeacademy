
import { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from "recharts";
import { 
  Activity, 
  BarChart2, 
  BookOpen, 
  Clock, 
  Code, 
  Lightbulb, 
  Target, 
  TrendingUp 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { CourseSuggestionCard } from "@/components/student/CourseSuggestionCard";

interface UserMetrics {
  id: string;
  user_id: string;
  course_completions: number;
  exercises_completed: number;
  total_time_spent: number;
  last_login: string;
}

interface UserProgressSummary {
  course_completions: number;
  exercises_completed: number;
  total_time_spent: number;
  courses_in_progress: number;
  avg_completion_rate: number;
  last_active_course: string | null;
}

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  relevance_score: number;
  path: string;
}

const AnalyticsDashboard = () => {
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [progressSummary, setProgressSummary] = useState<UserProgressSummary | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchUserMetrics();
      fetchActivityData();
      fetchRecommendations();
    }
  }, [user]);

  const fetchUserMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch user metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (metricsError && metricsError.code !== 'PGRST116') {
        throw metricsError;
      }

      if (metricsData) {
        setUserMetrics(metricsData as UserMetrics);
      }

      // Fetch progress summary using the stored function
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_user_progress_summary', {
          user_uuid: user?.id
        });

      if (summaryError) {
        throw summaryError;
      }

      if (summaryData) {
        setProgressSummary(summaryData as UserProgressSummary);
      }

      // Generate mock skills data
      setSkillsData([
        { name: "JavaScript", progress: 72 },
        { name: "Python", progress: 45 },
        { name: "React", progress: 65 },
        { name: "Node.js", progress: 38 },
        { name: "CSS", progress: 55 }
      ]);

    } catch (error: any) {
      console.error("Error fetching user metrics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityData = async () => {
    try {
      // In a real app, this would fetch from user_activity table
      // For now, generating mock data
      const mockActivityData = [
        { day: 'Mon', hours: 2.5, courses: 1, exercises: 3 },
        { day: 'Tue', hours: 1.8, courses: 2, exercises: 4 },
        { day: 'Wed', hours: 3.0, courses: 1, exercises: 7 },
        { day: 'Thu', hours: 0.5, courses: 0, exercises: 1 },
        { day: 'Fri', hours: 2.0, courses: 1, exercises: 5 },
        { day: 'Sat', hours: 4.0, courses: 3, exercises: 8 },
        { day: 'Sun', hours: 1.5, courses: 1, exercises: 2 },
      ];
      
      setActivityData(mockActivityData);
    } catch (error: any) {
      console.error("Error fetching activity data:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // In a real app, fetch from user_recommendations
      // For demo purposes, using mock data
      const mockRecommendations = [
        {
          id: "1",
          title: "Advanced JavaScript Patterns",
          description: "Master the advanced concepts of JavaScript with practical examples",
          difficulty: "Advanced",
          relevance_score: 0.92,
          path: "frontend"
        },
        {
          id: "2",
          title: "React Hooks Masterclass",
          description: "Become an expert in using React Hooks for state management",
          difficulty: "Intermediate",
          relevance_score: 0.87,
          path: "frontend"
        },
        {
          id: "3",
          title: "Node.js API Development",
          description: "Learn to build robust APIs with Node.js and Express",
          difficulty: "Intermediate",
          relevance_score: 0.78,
          path: "backend"
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (error: any) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Calculate weekly progress statistics
  const calculateWeeklyStat = (data: any[]) => {
    return data.reduce((sum, day) => sum + day.hours, 0).toFixed(1);
  };

  const weeklyHours = activityData.length > 0 ? calculateWeeklyStat(activityData) : 0;

  // Configuration for the charts
  const chartConfig = {
    hours: {
      label: "Hours",
      theme: {
        light: "#4f46e5",
        dark: "#818cf8"
      }
    },
    courses: {
      label: "Courses",
      theme: {
        light: "#8b5cf6",
        dark: "#a78bfa"
      }
    },
    exercises: {
      label: "Exercises",
      theme: {
        light: "#ec4899",
        dark: "#f472b6"
      }
    }
  };

  // Pie chart data for completion stats
  const completionData = [
    { name: "Completed", value: progressSummary?.course_completions || 0, color: "#4f46e5" },
    { name: "In Progress", value: progressSummary?.courses_in_progress || 0, color: "#8b5cf6" },
    { name: "Not Started", value: 5 - ((progressSummary?.course_completions || 0) + (progressSummary?.courses_in_progress || 0)), color: "#e5e7eb" }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-8 items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Learning Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your learning progress and performance
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            <BarChart2 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progressSummary?.total_time_spent || 0} mins
              </div>
              <p className="text-xs text-muted-foreground">
                {weeklyHours} hours this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progressSummary?.course_completions || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {progressSummary?.courses_in_progress || 0} in progress
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exercises Completed</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progressSummary?.exercises_completed || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                4 completed this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(progressSummary?.avg_completion_rate || 0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Course completion average
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="skills">Skills Progress</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>
                    Your learning hours, courses and exercises during the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="hours" name="Hours" fill="var(--color-hours)" />
                      <Bar dataKey="courses" name="Courses" fill="var(--color-courses)" />
                      <Bar dataKey="exercises" name="Exercises" fill="var(--color-exercises)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Course Completion</CardTitle>
                  <CardDescription>
                    Your overall course completion status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {completionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Learning Progress Trends</CardTitle>
                <CardDescription>
                  Track how your learning has progressed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <LineChart data={[
                    { month: 'Jan', progress: 20 },
                    { month: 'Feb', progress: 35 },
                    { month: 'Mar', progress: 30 },
                    { month: 'Apr', progress: 45 },
                    { month: 'May', progress: 60 },
                    { month: 'Jun', progress: 55 },
                    { month: 'Jul', progress: 75 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="var(--color-hours)" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Progress Tab */}
          <TabsContent value="skills">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Skills Mastery</CardTitle>
                <CardDescription>
                  Your progress in different programming languages and technologies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillsData.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
                
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    Learning Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Your JavaScript skills are improving rapidly. Consider taking advanced courses to reach expert level.
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        You've been consistent with React learning. Try building a real project to apply your knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Recommended Courses</CardTitle>
                    <CardDescription>
                      Personalized course recommendations based on your learning patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {recommendations.map((course) => (
                      <CourseSuggestionCard 
                        key={course.id}
                        id={course.id} 
                        title={course.title}
                        description={course.description}
                        difficulty={course.difficulty}
                        relevanceScore={course.relevance_score}
                        path={course.path}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Learning Path Progress</CardTitle>
                    <CardDescription>Your journey towards becoming a developer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Frontend Development</span>
                          <span className="text-sm text-muted-foreground">60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Backend Development</span>
                          <span className="text-sm text-muted-foreground">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">DevOps</span>
                          <span className="text-sm text-muted-foreground">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        Suggested Next Steps
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-sm flex items-start">
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 shrink-0">1</span>
                          <span>Complete React Hooks Masterclass</span>
                        </li>
                        <li className="text-sm flex items-start">
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 shrink-0">2</span>
                          <span>Build a full-stack project with Node.js</span>
                        </li>
                        <li className="text-sm flex items-start">
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 shrink-0">3</span>
                          <span>Take the DevOps fundamentals course</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <Activity className="h-12 w-12 mb-4 text-white/80" />
                    <h3 className="text-xl font-bold mb-2">Weekly Challenge</h3>
                    <p className="text-sm text-white/80 mb-4">
                      Complete 3 courses this week to earn a special achievement badge!
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
                      <div className="bg-white h-2.5 rounded-full w-2/5"></div>
                    </div>
                    <p className="text-xs text-white/80">2/5 days completed</p>
                    <Button variant="secondary" className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-none">
                      View Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
