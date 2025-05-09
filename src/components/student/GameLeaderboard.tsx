
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GameDifficulty } from "@/hooks/useCodingGame";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  score: number;
  difficulty: string;
  completed_at: string;
}

interface GameLeaderboardProps {
  selectedDifficulty: GameDifficulty;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
}

export const GameLeaderboard = ({
  selectedDifficulty,
  onDifficultyChange,
}: GameLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedDifficulty]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      const { data: scoresData, error: scoresError } = await supabase
        .from("mini_game_scores")
        .select("id, user_id, score, difficulty, completed_at")
        .eq("difficulty", selectedDifficulty)
        .order("score", { ascending: false })
        .limit(10);
      
      if (scoresError) throw scoresError;
      
      if (!scoresData || scoresData.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }
      
      const userIds = scoresData.map(score => score.user_id);
      
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      
      if (usersError) throw usersError;
      
      const leaderboardData = scoresData.map(score => {
        const user = usersData?.find(u => u.id === score.user_id);
        return {
          id: score.id,
          user_id: score.user_id,
          user_name: user?.full_name || "Utilisateur inconnu",
          score: score.score,
          difficulty: score.difficulty,
          completed_at: score.completed_at
        };
      });
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Erreur lors du chargement du classement");
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Classement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex space-x-2">
            {["Beginner", "Intermediate", "Advanced"].map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "outline"}
                size="sm"
                className={selectedDifficulty === diff ? "" : "border-gray-200"}
                onClick={() => onDifficultyChange(diff as GameDifficulty)}
              >
                {diff === "Beginner"
                  ? "Débutant"
                  : diff === "Intermediate"
                  ? "Intermédiaire"
                  : "Avancé"}
              </Button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Aucun score enregistré pour ce niveau
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-md bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 text-center">
                    {getMedalIcon(index) || `${index + 1}.`}
                  </div>
                  <div className="ml-2">
                    <div className="font-medium">{entry.user_name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="font-bold">{entry.score}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
