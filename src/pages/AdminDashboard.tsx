
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, MessageSquare, Settings, Shield, Database, Activity, TrendingUp, UserPlus, FileText, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalMessages: 0,
    systemHealth: 'Good'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      setStats({
        totalUsers: 245,
        totalCourses: 42,
        totalMessages: 1567,
        systemHealth: 'Excellent'
      });
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { label: 'Utilisateurs Total', value: stats.totalUsers.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Cours Actifs', value: stats.totalCourses.toString(), icon: BookOpen, color: 'bg-blue-600' },
    { label: 'Messages Système', value: stats.totalMessages.toString(), icon: MessageSquare, color: 'bg-blue-700' },
    { label: 'État Système', value: stats.systemHealth, icon: Shield, color: 'bg-blue-800' },
  ];

  const recentActivities = [
    { title: 'Nouvel utilisateur inscrit', description: 'Jean Dupont s\'est inscrit', icon: UserPlus, color: 'text-blue-600', time: 'Il y a 5 min' },
    { title: 'Nouveau cours créé', description: 'Cours Python Avancé publié', icon: BookOpen, color: 'text-blue-600', time: 'Il y a 15 min' },
    { title: 'Rapport généré', description: 'Rapport mensuel disponible', icon: FileText, color: 'text-blue-600', time: 'Il y a 1h' },
  ];

  const systemAlerts = [
    { title: 'Maintenance programmée', description: 'Maintenance serveur dimanche 3h-5h', type: 'info' },
    { title: 'Haute utilisation CPU', description: 'Serveur principal à 85% d\'utilisation', type: 'warning' },
    { title: 'Sauvegarde réussie', description: 'Sauvegarde quotidienne terminée', type: 'success' },
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
                    Tableau de Bord Administrateur
                  </h1>
                  <p className="text-lg text-blue-600">
                    Gérez et supervisez l'ensemble de la plateforme
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Database className="h-4 w-4" />
                      <span className="font-medium">Système Opérationnel</span>
                    </div>
                    <div className="w-px h-4 bg-blue-300"></div>
                    <span className="text-blue-600">Dernière connexion: Aujourd'hui</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/admin/settings")} 
                    className="border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                  <Button 
                    onClick={() => navigate("/admin/users")} 
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Gérer Utilisateurs
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
            <TabsList className="grid w-full grid-cols-4 bg-blue-50 p-1 rounded-lg border border-blue-200">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Contenu
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
              >
                Système
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Activity */}
                <Card className="xl:col-span-2 bg-white border-2 border-blue-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Activité Récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <activity.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-800">{activity.title}</h4>
                          <p className="text-sm text-blue-600">{activity.description}</p>
                          <p className="text-xs text-blue-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                      onClick={() => navigate("/admin/activity")}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Voir toute l'activité
                    </Button>
                  </CardContent>
                </Card>

                {/* Right Column - System Health */}
                <Card className="bg-white border-2 border-blue-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Shield className="h-5 w-5 text-blue-600" />
                      État du Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {systemAlerts.map((alert, i) => (
                      <div key={i} className={`p-3 rounded-lg ${
                        alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                        alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                            alert.type === 'success' ? 'text-green-600' :
                            alert.type === 'warning' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                          <div>
                            <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 bg-white"
                      onClick={() => navigate("/admin/system-health")}
                    >
                      Détails du système
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="bg-white border-2 border-blue-200 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-blue-800">Gestion des Utilisateurs</h2>
                    <p className="text-blue-600 mb-6">
                      Gérez tous les utilisateurs de la plateforme
                    </p>
                    <Button 
                      onClick={() => navigate("/admin/users")}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Accéder à la gestion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card className="bg-white border-2 border-blue-200 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-blue-800">Gestion du Contenu</h2>
                    <p className="text-blue-600 mb-6">
                      Gérez les cours, exercices et contenus
                    </p>
                    <Button 
                      onClick={() => navigate("/admin/courses")}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Gérer le contenu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <Card className="bg-white border-2 border-blue-200 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-blue-800">Administration Système</h2>
                    <p className="text-blue-600 mb-6">
                      Paramètres système et configuration
                    </p>
                    <Button 
                      onClick={() => navigate("/admin/settings")}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres système
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

export default AdminDashboard;
