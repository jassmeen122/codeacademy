
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
  ChartBar,
  FileText
} from "lucide-react";
import { useUserSkills } from "@/hooks/useUserSkills";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { UserMetric, DatabaseTables } from "@/types/progress";
import { ProgressCharts } from "@/components/student/progress/ProgressCharts";
import { RecommendationsList } from "@/components/student/progress/RecommendationsList";
import { ProgressReportGenerator } from "@/components/student/progress/ProgressReportGenerator";
import { useUserRecommendations } from "@/hooks/useUserRecommendations";
import { useUserActivityLogs } from "@/hooks/useUserActivityLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProgressPage = () => {
  const { skills, loading: skillsLoading } = useUserSkills();
  const { recommendations, loading: recommendationsLoading, markRecommendationAsViewed } = useUserRecommendations();
  const { activityLogs, loading: logsLoading } = useUserActivityLogs();
  const { user } = useAuthState();
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
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

  // Fetch user metrics/stats when component mounts
  useEffect(() => {
    if (user) {
      fetchUserMetrics();
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
      // Fetch user metrics from the database with proper typing
      const { data, error } = await supabase
        .from<DatabaseTables['user_metrics']>('user_metrics')
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

  const handleRecommendationClick = (id: string) => {
    markRecommendationAsViewed(id);
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <ChartBar className="mr-3 h-8 w-8 text-primary" />
            Learning Progress
          </h1>
          
          <div className="flex-shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
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

          {/* Skills Progress */}
          <Card className="mb-8">
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

          {/* Recommendations */}
          <div className="mb-8">
            <RecommendationsList 
              recommendations={recommendations}
              loading={recommendationsLoading}
              onRecommendationClick={handleRecommendationClick}
            />
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
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Charts component */}
            <div className="lg:col-span-2">
              <ProgressCharts 
                skills={skills}
                metrics={metrics}
                activityLogs={activityLogs}
                loading={skillsLoading || loading || logsLoading}
              />
            </div>
            
            {/* Activity details */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between py-2 border-b">
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : activityLogs.length > 0 ? (
                  <div className="space-y-1">
                    {activityLogs.slice(0, 10).map((log, index) => (
                      <div key={index} className="flex justify-between py-2 border-b last:border-0">
                        <div>
                          <span className="font-medium">
                            {log.type.replace(/_/g, ' ').split(' ').map(
                              word => word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            {log.count}x
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activities found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Learning time breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Time Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Courses</span>
                      <span>{metrics?.total_time_spent ? Math.round(metrics.total_time_spent * 0.7) : 0} hours</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exercises</span>
                      <span>{metrics?.total_time_spent ? Math.round(metrics.total_time_spent * 0.2) : 0} hours</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quizzes</span>
                      <span>{metrics?.total_time_spent ? Math.round(metrics.total_time_spent * 0.1) : 0} hours</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report generator */}
            {user && (
              <ProgressReportGenerator 
                userId={user.id}
                user={user}
                skills={skills}
                metrics={metrics}
              />
            )}
            
            {/* Report explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  About Progress Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">What's included?</h3>
                  <p className="text-sm text-muted-foreground">
                    Progress reports contain detailed information about your learning journey, including completed courses, skill levels, activity history, and overall progress metrics.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">How to use your report:</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Track your progress over time</li>
                    <li>Identify areas for improvement</li>
                    <li>Share your achievements with others</li>
                    <li>Set goals based on your current metrics</li>
                    <li>Compare your progress between different time periods</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Report formats</h3>
                  <p className="text-sm text-muted-foreground">
                    Reports are generated as PDF documents that you can download, print, or share digitally.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
