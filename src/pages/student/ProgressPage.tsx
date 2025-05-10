
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
} from "lucide-react";
import { useUserSkills } from "@/hooks/useUserSkills";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { UserMetric } from "@/types/progress";

const ProgressPage = () => {
  const { skills, loading: skillsLoading } = useUserSkills();
  const { user } = useAuthState();
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
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
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }
      
      if (data) {
        // Cast data to UserMetric type safely
        const userMetric = data as UserMetric;
        setMetrics(userMetric);
        
        // Update stats with actual values
        setStats([
          {
            title: "Total Learning Hours",
            value: `${userMetric.total_time_spent || 0}h`,
            icon: Clock,
            description: "Time spent learning",
          },
          {
            title: "Courses Completed",
            value: `${userMetric.course_completions || 0}`,
            icon: BookOpen,
            description: "Completed courses",
          },
          {
            title: "Coding Exercises",
            value: `${userMetric.exercises_completed || 0}`,
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
