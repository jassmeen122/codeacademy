import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Code, FileText, Users, MessageSquare, 
  Calculator, Brain, Award, Calendar, BarChart 
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord</h1>
        
        {/* Quick Actions Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate("/student/courses")}
            >
              <BookOpen className="h-6 w-6" />
              <span>Mes Cours</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate("/student/programming")}
            >
              <Code className="h-6 w-6" />
              <span>Langages de Programmation</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate("/student/exercises")}
            >
              <FileText className="h-6 w-6" />
              <span>Exercices</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate("/student/discussion")}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Forum</span>
            </Button>
          </div>
        </section>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Mon Progrès</CardTitle>
                <CardDescription>Suivi de vos activités d'apprentissage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cours complétés</span>
                    <span className="text-sm font-medium">2/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exercices terminés</span>
                    <span className="text-sm font-medium">8/20</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Badges obtenus</span>
                    <span className="text-sm font-medium">3/10</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>
                
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-4"
                  onClick={() => navigate("/student/progress")}
                >
                  Voir mes statistiques détaillées
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Liens Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/student/code-editor")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Éditeur de Code
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate("/student/mini-game")}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Mini-Jeu de Programmation
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate("/student/ai-assistant")}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Assistant IA
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Second Column */}
          <div className="space-y-6">
            {/* Recent Courses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cours Récents</CardTitle>
                <CardDescription>Continuez où vous vous êtes arrêté</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded mr-3">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">Introduction à JavaScript</h4>
                      <p className="text-xs text-muted-foreground">Progrès: 60%</p>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded mr-3">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">Bases de données SQL</h4>
                      <p className="text-xs text-muted-foreground">Progrès: 25%</p>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded mr-3">
                      <Code className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">Python pour Débutants</h4>
                      <p className="text-xs text-muted-foreground">Progrès: 40%</p>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/student/courses")}
                >
                  Voir tous mes cours
                </Button>
              </CardContent>
            </Card>
            
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Échéances à Venir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Exercice JavaScript</span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Dans 2 jours</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Projet de groupe SQL</span>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Dans 5 jours</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Quiz Python</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Dans 2 semaines</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Third Column */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Derniers Succès</CardTitle>
                <CardDescription>Badges et récompenses débloqués</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <span className="text-xs text-center">Premier Cours</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-1">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-center">Codeur Novice</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-1">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-xs text-center">Collaborateur</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/student/achievements")}
                >
                  Voir tous mes badges
                </Button>
              </CardContent>
            </Card>
            
            {/* Activity Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>Votre activité des 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center">
                <div className="flex h-40 w-full items-end justify-between gap-2 px-2">
                  {[40, 15, 25, 60, 30, 70, 55].map((height, i) => (
                    <div key={i} className="relative h-full w-full">
                      <div className="absolute bottom-0 w-full rounded-sm bg-primary" style={{ height: `${height}%` }}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Community */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Discussions actives</span>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Entraide entre étudiants</span>
                    <span className="text-sm font-medium">15</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/student/discussion")}
                  >
                    Rejoindre le forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
