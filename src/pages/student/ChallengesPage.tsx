
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChallenges, useUserPoints } from '@/hooks/useGamification';
import { useAuthState } from '@/hooks/useAuthState';
import { Trophy, Clock, Star, CheckCircle, Circle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ChallengesPage = () => {
  const { challenges, userChallenges, completeChallenge, loading: challengesLoading } = useChallenges();
  const { points, rank, loading: pointsLoading } = useUserPoints();
  const { user } = useAuthState();
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState<any[]>([]);

  useEffect(() => {
    if (challenges.length > 0 && userChallenges.length >= 0) {
      // Combine challenges with user progress
      const enrichedChallenges = challenges.map(challenge => {
        const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.id);
        return {
          ...challenge,
          completed: userChallenge?.completed || false,
          userChallengeId: userChallenge?.id
        };
      });

      // Filter by type
      setDailyChallenges(enrichedChallenges.filter(c => c.type === 'daily'));
      setWeeklyChallenges(enrichedChallenges.filter(c => c.type === 'weekly'));
      setActiveChallenges(enrichedChallenges);
    }
  }, [challenges, userChallenges]);

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error('You must be logged in to complete challenges');
      return;
    }
    
    await completeChallenge(challengeId);
  };

  if (challengesLoading || pointsLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-lg">Loading challenges...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Challenges & Rewards</h1>
          <p className="text-muted-foreground mt-2">
            Complete coding challenges to earn points and badges.
          </p>
        </div>

        {/* Player stats card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{points}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">#{rank}</p>
                <p className="text-sm text-muted-foreground">Global Rank</p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">
                  {userChallenges.filter(uc => uc.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Challenges Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenges Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Challenges</TabsTrigger>
            <TabsTrigger value="daily">Daily Challenges</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onComplete={handleCompleteChallenge} 
                />
              ))}
              {activeChallenges.length === 0 && (
                <p className="col-span-2 text-center py-8 text-muted-foreground">
                  No active challenges available right now. Check back soon!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onComplete={handleCompleteChallenge} 
                />
              ))}
              {dailyChallenges.length === 0 && (
                <p className="col-span-2 text-center py-8 text-muted-foreground">
                  No daily challenges available right now. Check back tomorrow!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onComplete={handleCompleteChallenge} 
                />
              ))}
              {weeklyChallenges.length === 0 && (
                <p className="col-span-2 text-center py-8 text-muted-foreground">
                  No weekly challenges available right now. Check back next week!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface ChallengeCardProps {
  challenge: any;
  onComplete: (id: string) => void;
}

const ChallengeCard = ({ challenge, onComplete }: ChallengeCardProps) => {
  const timeRemaining = formatTimeRemaining(challenge.end_date);
  
  return (
    <Card className={challenge.completed ? 'border-green-500' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge variant={challenge.type === 'daily' ? 'default' : 'secondary'}>
              {challenge.type === 'daily' ? 'Daily' : 'Weekly'}
            </Badge>
            {challenge.completed ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3 mr-1" /> {timeRemaining}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
            <Star className="h-4 w-4 fill-yellow-500" />
            {challenge.points} pts
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Ends: {new Date(challenge.end_date).toLocaleDateString()}
          </div>
          <Button 
            size="sm" 
            variant={challenge.completed ? "outline" : "default"}
            onClick={() => onComplete(challenge.id)}
            disabled={challenge.completed}
          >
            {challenge.completed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4 mr-2" />
                Complete
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function formatTimeRemaining(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expired';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`;
  }
  return `${diffHours}h`;
}

export default ChallengesPage;
