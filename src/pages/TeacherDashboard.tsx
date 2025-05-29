
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Book, Users, Award, FileCode, Clock, PlusCircle, Calendar, Activity, TrendingUp, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface DashboardStats {
  totalCourses: number;
  totalExercises: number;
  totalStudents: number;
  publishedExercises: number;
  draftExercises: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  date: string;
}

const TeacherDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalExercises: 0,
    totalStudents: 0,
    publishedExercises: 0,
    draftExercises: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', user?.id);

      if (coursesError) throw coursesError;

      // Get exercises stats
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('id, status')
        .eq('teacher_id', user?.id);

      if (exercisesError) throw exercisesError;

      const totalStudents = Math.floor(Math.random() * 50) + 10;

      setStats({
        totalCourses: coursesCount || 0,
        totalExercises: exercisesData?.length || 0,
        totalStudents,
        publishedExercises: exercisesData?.filter(ex => ex.status === 'published').length || 0,
        draftExercises: exercisesData?.filter(ex => ex.status === 'draft').length || 0
      });

      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'course',
          title: 'Cours JavaScript Fundamentals créé',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'exercise',
          title: 'Exercice DOM Manipulation publié',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'student',
          title: 'Nouvel étudiant inscrit au cours React',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setRecentActivities(mockActivities);
    } catch (error: any) {
      toast.error("Échec du chargement des données du tableau de bord");
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const exerciseCompletionData = [
    { name: 'Semaine 1', completed: 25, total: 30 },
    { name: 'Semaine 2', completed: 18, total: 30 },
    { name: 'Semaine 3', completed: 22, total: 30 },
    { name: 'Semaine 4', completed: 15, total: 30 }
  ];

  const quickStats = [
    { label: 'Cours Total', value: stats.totalCourses.toString(), icon: Book, color: 'bg-blue-500' },
    { label: 'Exercices', value: stats.totalExercises.toString(), icon: FileCode, color: 'bg-blue-600' },
    { label: 'Étudiants', value: stats.totalStudents.toString(), icon: Users, color: 'bg-blue-700' },
    { label: 'Taux de Réussite', value: '76%', icon: Award, color: 'bg-blue-800' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Header Section */}
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-blue-800">
                    Tableau de Bord Enseignant
                  </h1>
                  <p className="text-lg text-blue-600">
                    Gérez vos cours et suivez vos étudiants
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Code className="h-4 w-4" />
                      <span className="font-medium">Interface Enseignant</span>
                    </div>
                    <div className="w-px h-4 bg-blue-300"></div>
                    <span className="text-blue-600">Cours actifs: {stats.totalCourses}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/teacher/courses/create")} 
                    className="border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau Cours
                  </Button>
                  <Button 
                    onClick={() => navigate("/teacher/exercises/create")} 
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvel Exercice
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-blue-800 mt-1">{stat.value}</p>
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
            <TabsList className="grid w-full grid-cols-3 bg-blue-50 p-1 rounded-lg border border-blue-200">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Mes Cours
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Statistiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Charts */}
                <Card className="xl:col-span-2 bg-white border-2 border-blue-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Progression des Exercices
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Completion des exercices par vos étudiants
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={exerciseCompletionData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#3b82f6" />
                        <Bar dataKey="total" fill="#93c5fd" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Right Column - Recent Activity */}
                <Card className="bg-white border-2 border-blue-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Activité Récente
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Vos dernières activités d'enseignement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.length === 0 ? (
                        <p className="text-blue-600 text-sm">Aucune activité récente trouvée.</p>
                      ) : (
                        recentActivities.map(activity => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              {activity.type === 'course' ? (
                                <Book className="h-4 w-4 text-blue-600" />
                              ) : activity.type === 'exercise' ? (
                                <FileCode className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Users className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-800">{activity.title}</p>
                              <p className="text-xs text-blue-600">
                                {new Date(activity.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 bg-white" 
                      onClick={() => navigate("/teacher/activity")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Voir toute l'activité
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-2 border-blue-200 shadow-md hover:border-blue-400 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Échéances à Venir
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Échéances pour les 7 prochains jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCode className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Exercice Arrays JavaScript</p>
                            <p className="text-xs text-blue-600">23 étudiants assignés</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700 font-medium">Dans 2 jours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 bg-white" 
                      onClick={() => navigate("/teacher/exercises")}
                    >
                      Voir tous les exercices
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-white border-2 border-blue-200 shadow-md hover:border-blue-400 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                      <Users className="h-5 w-5 text-blue-600" />
                      Étudiants Actifs
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Performance des étudiants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-blue-800 mb-2">{stats.totalStudents}</div>
                      <p className="text-sm text-blue-600">Étudiants inscrits</p>
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 font-medium">
                          Taux de participation: 87%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                    >
                      Voir les étudiants
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-white border-2 border-blue-200 shadow-md hover:border-blue-400 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                      <Award className="h-5 w-5 text-blue-600" />
                      Performance
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Statistiques de réussite
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Taux de réussite moyen</span>
                        <span className="text-lg font-bold text-blue-800">76%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Exercices publiés</span>
                        <span className="text-lg font-bold text-blue-800">{stats.publishedExercises}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Brouillons</span>
                        <span className="text-lg font-bold text-blue-800">{stats.draftExercises}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                    >
                      Rapport détaillé
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <Card className="bg-white border-2 border-blue-200 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Book className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-blue-800">Gestion des Cours</h2>
                    <p className="text-blue-600 mb-6">
                      Créez et gérez vos cours de programmation
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => navigate("/teacher/courses")}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Book className="mr-2 h-4 w-4" />
                        Voir tous les cours
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/teacher/courses/create")}
                        className="border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer un cours
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card className="bg-white border-2 border-blue-200 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-blue-800">Statistiques Avancées</h2>
                    <p className="text-blue-600 mb-6">
                      Analysez les performances de vos étudiants
                    </p>
                    <Button 
                      onClick={() => navigate("/teacher/analytics")}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Voir les analyses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
