
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book, Code, FileCode, Terminal, Youtube, Activity, Trophy, Brain, Star, Clock, TrendingUp } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    { title: 'Code Warrior', description: 'Completed 10 coding challenges', icon: Code, color: 'text-primary' },
    { title: 'Learning Machine', description: 'Studied for 20 hours this week', icon: Brain, color: 'text-accent' },
    { title: 'Fast Learner', description: 'Completed a course in record time', icon: Trophy, color: 'text-yellow-500' },
  ];

  // Quick Stats
  const quickStats = [
    { label: 'Cours complétés', value: '4', icon: Book, color: 'bg-gradient-to-r from-primary to-accent' },
    { label: 'Heures d\'étude', value: '67h', icon: Clock, color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { label: 'Défis résolus', value: '23', icon: Code, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { label: 'Points obtenus', value: '2,450', icon: Star, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header Section avec gradient */}
        <div className="professional-card bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Bienvenue, {userProfile?.full_name || 'Développeur'}!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Continuez votre parcours d'apprentissage en programmation
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">+15% cette semaine</span>
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <span className="text-muted-foreground">Niveau: Intermédiaire</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/student/profile")} className="border-primary/30 hover:bg-primary/10">
                  Voir le profil
                </Button>
                <Button onClick={() => navigate("/student/courses")} className="robot-button">
                  Explorer les cours
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="professional-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Progrès
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Réussites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-8">
            {/* Actions Rapides */}
            <div>
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                <Terminal className="h-6 w-6 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Actions Rapides
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <NavigationCard
                  icon={Code}
                  title="Éditeur de Code"
                  description="Écrivez, testez et déboguez avec l'IA."
                  buttonText="Ouvrir l'éditeur"
                  onClick={() => navigate("/student/code-editor")}
                  className="professional-card bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700"
                />
                
                <NavigationCard
                  icon={FileCode}
                  title="Défi Quotidien"
                  description="Résolvez le défi du jour et gagnez des points."
                  buttonText="Commencer"
                  className="professional-card bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700"
                />
                
                <NavigationCard
                  icon={Youtube}
                  title="Tutoriels Dev"
                  description="Vidéos gratuites des meilleurs YouTubeurs."
                  buttonText="Regarder"
                  onClick={() => navigate("/student/yt-dev-tutorials")}
                  className="professional-card bg-gradient-to-br from-red-50/50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700"
                />
                
                <NavigationCard
                  icon={Brain}
                  title="Assistant IA"
                  description="Obtenez de l'aide pour vos questions."
                  buttonText="Demander à l'IA"
                  onClick={() => navigate("/student/ai-assistant")}
                  className="professional-card bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700"
                />
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - 2/3 width */}
              <div className="xl:col-span-2 space-y-8">
                {/* Activité Hebdomadaire */}
                <Card className="professional-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="text-xl font-semibold">Activité Hebdomadaire</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        Détails
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end h-40 bg-gradient-to-t from-muted/20 to-transparent rounded-lg p-4">
                      {weeklyActivity.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div 
                            className="w-8 bg-gradient-to-t from-primary to-accent rounded-t-md hover:shadow-lg transition-all duration-300"
                            style={{ height: `${Math.max(day.hours * 15, 8)}px` }}
                          ></div>
                          <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                          <span className="text-xs text-primary font-semibold">{day.hours}h</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Total cette semaine:</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-foreground">15.3 heures</span>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                          +23%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cours Inscrits */}
                <div>
                  <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                    <Book className="h-6 w-6 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Vos Cours
                    </span>
                  </h2>
                  <CourseTabs courses={courses} loading={loading} />
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Progression */}
                <Card className="professional-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Votre Progression
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Complétion des cours</span>
                          <span className="font-bold text-primary">65%</span>
                        </div>
                        <Progress value={65} className="h-3 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Défis codage</span>
                          <span className="font-bold text-accent">42%</span>
                        </div>
                        <Progress value={42} className="h-3 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Points gagnés</span>
                          <span className="font-bold text-yellow-600">2,450</span>
                        </div>
                        <Progress value={70} className="h-3 bg-muted" />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => navigate("/student/progress")}
                    >
                      Voir statistiques détaillées
                    </Button>
                  </CardContent>
                </Card>

                {/* Réussites Récentes */}
                <Card className="professional-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Réussites Récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentAchievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 p-2 rounded-lg">
                          <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
                      onClick={() => navigate("/student/achievements")}
                    >
                      Voir toutes les réussites
                    </Button>
                  </CardContent>
                </Card>

                {/* Mini Jeu */}
                <CodingMiniGame />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card className="professional-card">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold font-display mb-4">Progression Détaillée</h2>
                  <p className="text-muted-foreground mb-6">
                    Vos statistiques détaillées de progression seront affichées ici.
                  </p>
                  <Button 
                    onClick={() => navigate("/student/progress")}
                    className="robot-button"
                  >
                    Voir le rapport complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className="professional-card">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold font-display mb-4">Vos Réussites</h2>
                  <p className="text-muted-foreground mb-6">
                    Vos badges et récompenses seront affichés ici.
                  </p>
                  <Button 
                    onClick={() => navigate("/student/achievements")}
                    className="robot-button"
                  >
                    Voir toutes les réussites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
