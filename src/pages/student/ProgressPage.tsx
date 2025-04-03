
import { useEffect, useState } from "react";
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
  Database,
  Server,
  Smartphone,
  Cloud,
  LineChart,
  BarChart,
  PieChart
} from "lucide-react";
import { useUserSkills } from "@/hooks/useUserSkills";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { UserMetric, LanguagePerformance, ProgressTimelinePoint, UserRecommendation } from "@/types/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const ProgressPage = () => {
  const { skills, loading: skillsLoading } = useUserSkills();
  const { user } = useAuthState();
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState<ProgressTimelinePoint[]>([]);
  const [languagePerformance, setLanguagePerformance] = useState<LanguagePerformance[]>([]);
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [stats, setStats] = useState([
    {
      title: "Total Learning Hours",
      value: "24h",
      icon: Clock,
      description: "Time spent learning",
    },
    {
      title: "Courses Completed",
      value: "3/5",
      icon: BookOpen,
      description: "Completed courses",
    },
    {
      title: "Coding Exercises",
      value: "45",
      icon: Code,
      description: "Exercises completed",
    },
    {
      title: "Achievement Points",
      value: "1,250",
      icon: Trophy,
      description: "Points earned",
    },
  ]);

  // Define available programming languages for skills
  const availableSkills = [
    { name: "JavaScript", progress: 0, icon: Code },
    { name: "React", progress: 0, icon: Code },
    { name: "TypeScript", progress: 0, icon: Code },
    { name: "Node.js", progress: 0, icon: Server },
    { name: "Python", progress: 0, icon: Code },
    { name: "SQL", progress: 0, icon: Database },
    { name: "HTML/CSS", progress: 0, icon: Code },
    { name: "Mobile", progress: 0, icon: Smartphone },
    { name: "DevOps", progress: 0, icon: Cloud },
  ];

  // Merge available skills with user progress data
  const [mergedSkills, setMergedSkills] = useState(availableSkills);

  // Simple difficulty distribution data
  const difficultyData = [
    { name: 'Easy', value: 65, color: '#34D399' },
    { name: 'Medium', value: 25, color: '#FBBF24' },
    { name: 'Hard', value: 10, color: '#F87171' },
  ];

  // Fetch user metrics/stats when component mounts
  useEffect(() => {
    if (user) {
      fetchUserMetrics();
      fetchTimelineData();
      fetchLanguagePerformance();
      fetchRecommendations();
    }
  }, [user]);

  // Update merged skills whenever user skills change
  useEffect(() => {
    if (skills.length > 0) {
      const updated = availableSkills.map(skill => {
        const userSkill = skills.find(s => s.skill_name === skill.name);
        return {
          ...skill,
          progress: userSkill ? userSkill.progress : 0
        };
      });
      setMergedSkills(updated);
    }
  }, [skills]);

  const fetchUserMetrics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Fetch user metrics from the database
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        // Use proper typing when setting the metrics
        setMetrics(data as UserMetric);
        
        // Update stats with actual values
        setStats([
          {
            title: "Total Learning Hours",
            value: `${data.total_time_spent || 0}h`,
            icon: Clock,
            description: "Time spent learning",
          },
          {
            title: "Courses Completed",
            value: `${data.course_completions || 0}`,
            icon: BookOpen,
            description: "Completed courses",
          },
          {
            title: "Coding Exercises",
            value: `${data.exercises_completed || 0}`,
            icon: Code,
            description: "Exercises completed",
          },
          {
            title: "Achievement Points",
            value: `${user?.points || 0}`,
            icon: Trophy,
            description: "Points earned",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      toast.error("Failed to load progress metrics");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimelineData = async () => {
    if (!user) return;
    
    // This would normally fetch from the backend, but we'll use mock data for now
    const mockData: ProgressTimelinePoint[] = [
      { date: "2025-01-01", success_rate: 65, exercises_completed: 5 },
      { date: "2025-01-08", success_rate: 70, exercises_completed: 8 },
      { date: "2025-01-15", success_rate: 75, exercises_completed: 12 },
      { date: "2025-01-22", success_rate: 72, exercises_completed: 15 },
      { date: "2025-01-29", success_rate: 78, exercises_completed: 20 },
      { date: "2025-02-05", success_rate: 85, exercises_completed: 25 },
      { date: "2025-02-12", success_rate: 82, exercises_completed: 30 },
      { date: "2025-02-19", success_rate: 88, exercises_completed: 35 },
      { date: "2025-02-26", success_rate: 90, exercises_completed: 42 },
      { date: "2025-03-05", success_rate: 92, exercises_completed: 45 },
    ];
    
    setTimelineData(mockData);
  };

  const fetchLanguagePerformance = async () => {
    if (!user) return;
    
    // Mock language performance data
    const mockData: LanguagePerformance[] = [
      { language: "JavaScript", success_rate: 85, exercises_completed: 20, average_completion_time: 240 },
      { language: "Python", success_rate: 92, exercises_completed: 15, average_completion_time: 180 },
      { language: "SQL", success_rate: 78, exercises_completed: 8, average_completion_time: 300 },
      { language: "HTML/CSS", success_rate: 95, exercises_completed: 12, average_completion_time: 150 },
      { language: "TypeScript", success_rate: 80, exercises_completed: 5, average_completion_time: 270 },
    ];
    
    setLanguagePerformance(mockData);
  };

  const fetchRecommendations = async () => {
    if (!user) return;
    
    // Mock recommendations data
    const mockRecommendations: UserRecommendation[] = [
      {
        id: "1",
        user_id: user.id,
        recommendation_type: "exercise",
        item_id: "ex123",
        relevance_score: 0.95,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "Advanced SQL Joins",
          description: "Practice complex SQL join operations",
          difficulty: "intermediate",
          language: "SQL"
        }
      },
      {
        id: "2",
        user_id: user.id,
        recommendation_type: "course",
        item_id: "c456",
        relevance_score: 0.88,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "React Hooks Masterclass",
          description: "Deepen your understanding of React hooks",
          difficulty: "advanced",
          language: "JavaScript"
        }
      },
      {
        id: "3",
        user_id: user.id,
        recommendation_type: "video",
        item_id: "v789",
        relevance_score: 0.82,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "Understanding Recursion",
          description: "A visual guide to recursion in programming",
          difficulty: "intermediate",
          url: "https://example.com/video123"
        }
      }
    ];
    
    setRecommendations(mockRecommendations);
  };

  const achievements = [
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
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Learning Progress</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
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

        {/* Performance Tracking Tabs */}
        <Tabs defaultValue="timeline" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">
              <LineChart className="h-4 w-4 mr-2" />
              Progress Timeline
            </TabsTrigger>
            <TabsTrigger value="languages">
              <BarChart className="h-4 w-4 mr-2" />
              Language Performance
            </TabsTrigger>
            <TabsTrigger value="difficulty">
              <PieChart className="h-4 w-4 mr-2" />
              Exercise Difficulty
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="success_rate"
                        stroke="#8884d8"
                        name="Success Rate (%)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="exercises_completed"
                        stroke="#82ca9d"
                        name="Exercises Completed"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Language</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={languagePerformance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="language" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="success_rate" name="Success Rate (%)" fill="#8884d8" />
                      <Bar dataKey="exercises_completed" name="Exercises Completed" fill="#82ca9d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="difficulty">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Difficulty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Skills Progress */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Skills Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  mergedSkills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <skill.icon className="h-4 w-4 text-muted-foreground" />
                          {skill.name}
                        </span>
                        <span>{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {rec.recommendation_type === 'exercise' && <Code className="h-4 w-4 text-blue-500" />}
                        {rec.recommendation_type === 'course' && <BookOpen className="h-4 w-4 text-green-500" />}
                        {rec.recommendation_type === 'video' && <Target className="h-4 w-4 text-purple-500" />}
                        <span className="font-medium">{rec.metadata?.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.metadata?.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {rec.metadata?.difficulty}
                        </span>
                        {rec.metadata?.language && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            {rec.metadata.language}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
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
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
