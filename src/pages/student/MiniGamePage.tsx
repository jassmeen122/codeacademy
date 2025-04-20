
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodingMiniGame } from "@/components/student/CodingMiniGame";
import { GameInstructions } from "@/components/student/GameInstructions";
import { GameLeaderboard } from "@/components/student/GameLeaderboard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GameDifficulty } from "@/hooks/useCodingGame";

const MiniGamePage = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("Beginner");

  const handleDifficultyChange = (difficulty: GameDifficulty) => {
    setSelectedDifficulty(difficulty);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <GameInstructions />
              <CodingMiniGame />
            </div>
          </div>
          <div className="lg:col-span-1">
            <GameLeaderboard 
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MiniGamePage;
