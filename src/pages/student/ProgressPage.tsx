
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
  CheckCircle2,
  Calendar,
  ProgressCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

      // Fetch user metrics if available
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
          streak: `${Math.floor(Math.random() * 14) + 1} days`, // Mock data
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
      // Record user activity for analytics
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'not-started': return 'text-gray-600';
      default: return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return '';
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

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {[
                {
                  title: "Heures d'apprentissage",
                  value: stats.totalHours,
                  icon: Clock,
                  description: "Temps total d'apprentissage",
                },
                {
                  title: "Cours terminés",
                  value: stats.coursesCompleted,
                  icon: BookOpen,
                  description: "Cours complétés",
                },
                {
                  title: "Exercices",
                  value: stats.exercisesCompleted,
                  icon: Code,
                  description: "Exercices terminés",
                },
                {
                  title: "Points",
                  value: stats.achievementPoints,
                  icon: Trophy,
                  description: "Points gagnés",
                },
                {
                  title: "Série actuelle",
                  value: stats.streak,
                  icon: Flame,
                  description: "Jours consécutifs",
                },
                {
                  title: "Dernière connexion",
                  value: stats.lastLogin,
                  icon: Calendar,
                  description: "Dernière activité",
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
                  Activité d'apprentissage hebdomadaire
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
                      <YAxis label={{ value: 'Heures', angle: -90, position: 'insideLeft' }} />
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
                  Total hebdomadaire : {weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1)} heures
                </div>
              </CardContent>
            </Card>

            {/* Tasks and Progression Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ProgressCheck className="h-5 w-5 text-primary" />
                  Tâches et progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tâche</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date limite</TableHead>
                      <TableHead>Priorité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell className={getStatusColor(task.status)}>
                          {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 inline mr-1" />}
                          {task.status === 'completed' ? 'Terminé' : 
                            task.status === 'in-progress' ? 'En cours' : 'À faire'}
                        </TableCell>
                        <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'Élevée' : 
                              task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => trackActivity("View All Tasks")}
                >
                  Voir toutes les tâches
                </Button>
              </CardContent>
            </Card>

            {/* Skills Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progression des compétences
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
                  Réussites
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
                  Tendances de performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Score de performance', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" name="Score de performance quotidien" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Score de performance moyen : {Math.round(performanceData.reduce((sum, day) => sum + day.score, 0) / performanceData.length)}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Activity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Distribution d'activité mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Heures d\'apprentissage', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Heures totales" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Retention and Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Taux d'engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retentionRate}>
                      <defs>
                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FF8042" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Taux d\'engagement (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#FF8042" 
                        fillOpacity={1} 
                        fill="url(#colorRetention)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Engagement moyen : {Math.round(retentionRate.reduce((sum, item) => sum + item.rate, 0) / retentionRate.length)}%
                </div>
              </CardContent>
            </Card>

            {/* Course Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Progression des cours
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
                    Distribution du temps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Vidéos', value: 40 },
                            { name: 'Documentation', value: 25 },
                            { name: 'Exercices', value: 30 },
                            { name: 'Quiz', value: 5 },
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
                    Forces et points à améliorer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Points forts</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Fondamentaux JavaScript (top 15%)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Conception de composants React (top 20%)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Régularité d'apprentissage (top 10%)
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-2">Points à améliorer</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Types avancés TypeScript
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Développement backend
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Développement piloté par les tests
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
                  Cours recommandés
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
                                  {rec.relevance}% correspondance
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
                                Voir le cours
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
                  Parcours d'apprentissage suggéré
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {[
                    {
                      title: "Maîtrise TypeScript",
                      description: "Concentrez-vous sur les types avancés et les modèles pour renforcer vos fondamentaux",
                      status: "Actuel", 
                      icon: Target
                    },
                    {
                      title: "Développement Backend Node.js",
                      description: "Créez des API RESTful et comprenez les concepts côté serveur",
                      status: "Prochaine étape", 
                      icon: Code
                    },
                    {
                      title: "Projet d'intégration Full-Stack",
                      description: "Combinez vos compétences frontend et backend dans un projet complet",
                      status: "Futur", 
                      icon: BarChart
                    },
                    {
                      title: "Tests & DevOps",
                      description: "Apprenez à tester vos applications et à les déployer efficacement",
                      status: "Futur", 
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
                              Commencer
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Themes and Topics Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-500" />
                  Tendances et sujets populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Développement mobile React Native", trend: 92 },
                    { name: "Serverless Architecture", trend: 87 },
                    { name: "DevOps et CI/CD", trend: 83 },
                    { name: "Intelligence artificielle et ML", trend: 78 },
                    { name: "Blockchain et Web3", trend: 72 }
                  ].map((topic) => (
                    <div key={topic.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{topic.name}</span>
                        <span className="font-medium text-blue-600">{topic.trend}%</span>
                      </div>
                      <Progress value={topic.trend} className="h-2" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Basé sur les tendances actuelles du marché et votre profil d'apprentissage
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
