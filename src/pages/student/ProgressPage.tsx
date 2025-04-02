
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  BookOpen,
  Code,
  Target,
  Award,
  TrendingUp,
  Flame,
  Brain,
  LineChart,
  BarChart,
  Clock8,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
}

const ProgressPage = () => {
  const { user } = useAuthState();
  const [activeTab, setActiveTab] = useState("overview");
  const [weeklyActivity, setWeeklyActivity] = useState<UserActivity[]>([]);
  const [skills, setSkills] = useState<SkillProgress[]>([
    { name: "JavaScript", progress: 75 },
    { name: "React", progress: 60 },
    { name: "TypeScript", progress: 45 },
    { name: "Node.js", progress: 30 },
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
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch student progress from Supabase
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user?.id);

      if (progressError) {
        console.error('Error fetching student progress:', progressError);
        return;
      }

      // Calculate aggregated statistics based on progress data
      if (progressData && progressData.length > 0) {
        // Calculate average completion percentage
        const avgCompletion = progressData.reduce((sum, item) => 
          sum + (item.completion_percentage || 0), 0) / progressData.length;
        
        // Set skills based on course progress
        const updatedSkills = [...skills];
        updatedSkills[0].progress = Math.min(Math.round(avgCompletion * 1.2), 100); // JavaScript (just an example)
        updatedSkills[1].progress = Math.min(Math.round(avgCompletion * 0.9), 100); // React
        setSkills(updatedSkills);
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

  const fetchCourseCompletions = async () => {
    try {
      // This would ideally come from the database
      // For now using mock data
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
      // In a real application, we would track user activities in the database
      toast.success(`${activityType} tracked successfully!`);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Progress</h1>
          <p className="text-gray-600">
            Track your learning journey, view statistics, and get personalized recommendations
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" onClick={() => trackActivity("Overview Tab View")}>Overview</TabsTrigger>
            <TabsTrigger value="performance" onClick={() => trackActivity("Performance Tab View")}>Performance</TabsTrigger>
            <TabsTrigger value="recommendations" onClick={() => trackActivity("Recommendations Tab View")}>Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: "Total Learning Hours",
                  value: stats.totalHours,
                  icon: Clock,
                  description: "Time spent learning",
                },
                {
                  title: "Courses Completed",
                  value: stats.coursesCompleted,
                  icon: BookOpen,
                  description: "Completed courses",
                },
                {
                  title: "Coding Exercises",
                  value: stats.exercisesCompleted,
                  icon: Code,
                  description: "Exercises completed",
                },
                {
                  title: "Achievement Points",
                  value: stats.achievementPoints,
                  icon: Trophy,
                  description: "Points earned",
                }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock8 className="h-5 w-5 text-primary" />
                  Weekly Learning Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyActivity}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorHours)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Total weekly hours: {weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}
                </div>
              </CardContent>
            </Card>

            {/* Skills Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Skills Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <Card key={achievement.title} className={achievement.achieved ? "border-primary" : ""}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                              achievement.achieved ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-8">
            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Performance Score', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" name="Daily Performance Score" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Average performance score: {Math.round(performanceData.reduce((sum, day) => sum + day.score, 0) / performanceData.length)}
                </div>
              </CardContent>
            </Card>

            {/* Course Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Course Completion Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseCompletions}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, completion }) => `${name} (${completion}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="completion"
                        nameKey="name"
                      >
                        {courseCompletions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {courseCompletions.map((course, index) => (
                    <div key={course.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-sm truncate">{course.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{course.completion}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Watching Videos', value: 40 },
                            { name: 'Reading Docs', value: 25 },
                            { name: 'Coding Exercises', value: 30 },
                            { name: 'Quizzes', value: 5 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {[...Array(4)].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths and Weaknesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Strengths & Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Strengths</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          JavaScript fundamentals (top 15%)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          React component design (top 20%)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Consistency in learning (top 10%)
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-2">Areas to Improve</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          TypeScript advanced types
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Backend development
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Test-driven development
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-8">
            {/* Personalized Course Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    const Icon = rec.icon;
                    return (
                      <Card key={rec.title} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{rec.title}</h3>
                                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  {rec.relevance}% match
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {rec.description}
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => trackActivity(`Viewed ${rec.title} recommendation`)}
                              >
                                View Course
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Learning Path Recommendation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Suggested Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {[
                    {
                      title: "Complete TypeScript Mastery",
                      description: "Focus on advanced types and patterns to strengthen your foundation",
                      status: "Current", 
                      icon: Target
                    },
                    {
                      title: "Node.js Backend Development",
                      description: "Build RESTful APIs and understand server-side concepts",
                      status: "Next Step", 
                      icon: Code
                    },
                    {
                      title: "Full-Stack Integration Project",
                      description: "Combine your frontend and backend skills in a complete project",
                      status: "Future", 
                      icon: BarChart
                    },
                    {
                      title: "Testing & DevOps",
                      description: "Learn how to test your applications and deploy them efficiently",
                      status: "Future", 
                      icon: LineChart
                    },
                  ].map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === 0;
                    const isCompleted = false;
                    
                    return (
                      <div key={step.title} className="ml-8 mb-8 relative">
                        <div className={`absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : isActive 
                              ? "bg-primary text-white" 
                              : "bg-gray-200 text-gray-500"
                        }`}>
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{step.title}</h3>
                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                              isActive 
                                ? "bg-primary/10 text-primary" 
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          {isActive && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => trackActivity(`Started path step: ${step.title}`)}
                            >
                              Start Learning
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
