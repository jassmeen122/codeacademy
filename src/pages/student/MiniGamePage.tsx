
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodingMiniGame } from "@/components/student/CodingMiniGame";
import { GameInstructions } from "@/components/student/GameInstructions";
import { GameLeaderboard } from "@/components/student/GameLeaderboard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GameDifficulty } from "@/hooks/useCodingGame";
import { toast } from "sonner";
import { GamificationStats } from "@/components/student/GamificationStats";

const MiniGamePage = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("Beginner");
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show welcome toast to confirm page is rendering
    toast.info("Bienvenue au mini-jeu de code!");
    
    // First set loading state to ensure components start loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // After loading is complete, make components visible with a slight delay
      // to ensure all data has been fetched
      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
        console.log("Setting visibility to true");
      }, 500);
      
      return () => clearTimeout(visibilityTimer);
    }, 1000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  const handleDifficultyChange = (difficulty: GameDifficulty) => {
    setSelectedDifficulty(difficulty);
    toast.success(`Difficulté changée à: ${difficulty}`);
  };

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
          <h1 className="text-3xl font-bold">Mini-Jeu de Code</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-center">
              <p className="text-lg">Chargement du jeu...</p>
            </div>
          </div>
        ) : (
          // Only render when isVisible is true to ensure all data is ready
          isVisible && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <GameInstructions />
                  <CodingMiniGame />
                </div>
                
                {/* Ajout du composant GamificationStats en dessous du jeu */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Votre progression</h2>
                  <GamificationStats key="gamification-stats" />
                </div>
              </div>
              <div className="lg:col-span-1">
                <GameLeaderboard 
                  selectedDifficulty={selectedDifficulty}
                  onDifficultyChange={handleDifficultyChange}
                />
              </div>
            </div>
          )
        )}

        {!isLoading && !isVisible && (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <p className="text-lg">Préparation des données du jeu...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MiniGamePage;
