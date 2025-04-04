
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GameInstructions } from "@/components/student/GameInstructions";
import { GameLeaderboard } from "@/components/student/GameLeaderboard";
import { ArrowLeft, MousePointerClick, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GameDifficulty } from "@/hooks/useCodingGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";

const MiniGamePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("Beginner");
  const [points, setPoints] = useState(0);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Effet d'animation pour le clic
  useEffect(() => {
    if (clickAnimation) {
      const timer = setTimeout(() => {
        setClickAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [clickAnimation]);

  // Charger les points depuis le localStorage au démarrage
  useEffect(() => {
    const savedPoints = localStorage.getItem('clickPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    }
  }, []);

  // Sauvegarder les points dans localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('clickPoints', points.toString());
    
    // Sauvegarder dans la base de données aussi si l'utilisateur est connecté
    if (user && points % 5 === 0 && points > 0) {
      savePointsToDatabase();
    }
  }, [points]);

  // Fonction pour sauvegarder les points dans la base de données
  const savePointsToDatabase = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_gamification')
        .upsert([{
          user_id: user.id,
          points: points,
          last_played_at: new Date().toISOString()
        }], { onConflict: 'user_id' });
      
      if (error) throw error;
      
      // Notifier l'utilisateur seulement aux étapes importantes
      if (points % 10 === 0) {
        toast.success(`Progression sauvegardée: ${points} points!`);
      }
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  };

  // Gérer le clic sur le bouton
  const handleClick = (e: React.MouseEvent) => {
    // Calculer la position du clic pour l'animation
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClickPosition({ x, y });
    setClickAnimation(true);
    setPoints(prevPoints => prevPoints + 1);
    
    // Afficher des toasts de réussite à certains paliers
    if ((points + 1) === 10) {
      toast.success("🏆 Niveau Intermédiaire débloqué !");
    } else if ((points + 1) === 20) {
      toast.success("🦄 Niveau Expert débloqué !");
    } else if ((points + 1) === 50) {
      toast.success("🥇 Badge Or débloqué !");
    } else if ((points + 1) % 25 === 0) {
      toast.success(`🎯 +25 points! Continue comme ça!`);
    }
  };

  // Déterminer le niveau actuel
  const getCurrentLevel = () => {
    if (points < 10) return { name: "Débutant", icon: "🐣" };
    if (points < 20) return { name: "Intermédiaire", icon: "🏆" };
    return { name: "Expert", icon: "🦄" };
  };

  // Obtenir le prochain objectif
  const getNextGoal = () => {
    if (points < 10) return { points: 10, name: "Intermédiaire" };
    if (points < 20) return { points: 20, name: "Expert" };
    if (points < 50) return { points: 50, name: "Badge Or" };
    if (points < 100) return { points: 100, name: "Badge Platine" };
    return { points: points + 50, name: "Niveau supérieur" };
  };

  // Calculer le pourcentage pour la barre de progression
  const progressPercentage = () => {
    const nextGoal = getNextGoal();
    const previousGoal = points < 10 ? 0 : points < 20 ? 10 : points < 50 ? 20 : points < 100 ? 50 : points - 50;
    return Math.round(((points - previousGoal) / (nextGoal.points - previousGoal)) * 100);
  };

  const level = getCurrentLevel();
  const nextGoal = getNextGoal();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => navigate("/student")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Mini-Jeu de Clic</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600">
                <CardTitle className="text-white">Jeu de Clic Simple</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-8">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2">{points} Points</div>
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    Niveau: {level.name} {level.icon}
                  </Badge>
                </div>

                <div className="w-full max-w-md mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression vers {nextGoal.name}</span>
                    <span>{progressPercentage()}%</span>
                  </div>
                  <Progress value={progressPercentage()} className="h-2" />
                  <div className="text-xs text-center mt-1 text-gray-500">
                    {points} / {nextGoal.points} points
                  </div>
                </div>

                <div className="relative">
                  <Button 
                    onClick={handleClick}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-8 px-16 rounded-lg shadow-lg transition-all hover:scale-105"
                  >
                    <MousePointerClick className="mr-2 h-6 w-6" />
                    CLIC ICI !
                  </Button>
                  {clickAnimation && (
                    <div 
                      className="absolute text-2xl font-bold text-green-500 animate-fade-out pointer-events-none"
                      style={{ top: clickPosition.y - 20, left: clickPosition.x - 10 }}
                    >
                      +1
                    </div>
                  )}
                </div>

                <div className="text-center text-gray-600 mt-4">
                  Prochain badge à {nextGoal.points} points !
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Comment jouer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Clique sur le bouton bleu pour gagner 1 point</li>
                  <li>Atteins différents niveaux : Débutant 🐣, Intermédiaire 🏆, Expert 🦄</li>
                  <li>Débloque des badges spéciaux à 50 et 100 points</li>
                  <li>Tes points sont sauvegardés automatiquement</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Récompenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-3 rounded-md border ${points >= 10 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{points >= 10 ? '🏆' : '🔒'}</div>
                    <div>
                      <p className="font-medium">Niveau Intermédiaire</p>
                      <p className="text-xs text-gray-500">10 points requis</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-md border ${points >= 20 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{points >= 20 ? '🦄' : '🔒'}</div>
                    <div>
                      <p className="font-medium">Niveau Expert</p>
                      <p className="text-xs text-gray-500">20 points requis</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-md border ${points >= 50 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{points >= 50 ? '🥇' : '🔒'}</div>
                    <div>
                      <p className="font-medium">Badge Or</p>
                      <p className="text-xs text-gray-500">50 points requis</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-md border ${points >= 100 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{points >= 100 ? '💎' : '🔒'}</div>
                    <div>
                      <p className="font-medium">Badge Platine</p>
                      <p className="text-xs text-gray-500">100 points requis</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const shouldReset = window.confirm("Êtes-vous sûr de vouloir réinitialiser vos points ?");
                    if (shouldReset) {
                      setPoints(0);
                      toast.info("Points réinitialisés à zéro");
                    }
                  }}
                >
                  Réinitialiser les points
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MiniGamePage;
