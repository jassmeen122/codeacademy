
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodingMiniGame } from "@/components/student/CodingMiniGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowLeft, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GameDifficulty } from "@/hooks/useCodingGame";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  score: number;
  difficulty: GameDifficulty;
  completed_at: string;
}

const MiniGamePage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("Beginner");

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

      // Fetch user names
      const userIds = scoresData?.map((score) => score.user_id) || [];
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (usersError) throw usersError;

      // Merge data
      const leaderboardData = scoresData?.map((score) => {
        const user = usersData?.find((u) => u.id === score.user_id);
        return {
          ...score,
          user_name: user?.full_name || "Utilisateur inconnu",
          difficulty: score.difficulty as GameDifficulty
        };
      }) || [];

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Erreur lors du chargement du classement");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: GameDifficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Testez vos connaissances en programmation
                </h2>
                <p className="text-gray-600">
                  Répondez aux questions pour gagner des points et débloquer des
                  badges. Les questions sont classées par niveau de difficulté:
                </p>
                <ul className="list-disc list-inside mt-2 mb-4 text-gray-600">
                  <li>
                    <span className="font-medium text-green-600">Débutant</span>: 10 questions fondamentales
                  </li>
                  <li>
                    <span className="font-medium text-yellow-600">Intermédiaire</span>: 30 questions plus avancées
                  </li>
                  <li>
                    <span className="font-medium text-red-600">Avancé</span>: 70 questions expertes
                  </li>
                </ul>
              </div>

              <CodingMiniGame />
            </div>
          </div>

          <div className="lg:col-span-1">
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
                    {["Beginner", "Intermediate", "Advanced"].map(
                      (diff) => (
                        <Button
                          key={diff}
                          variant={selectedDifficulty === diff ? "default" : "outline"}
                          size="sm"
                          className={selectedDifficulty === diff ? "" : "border-gray-200"}
                          onClick={() => setSelectedDifficulty(diff as GameDifficulty)}
                        >
                          {diff === "Beginner"
                            ? "Débutant"
                            : diff === "Intermediate"
                            ? "Intermédiaire"
                            : "Avancé"}
                        </Button>
                      )
                    )}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MiniGamePage;
