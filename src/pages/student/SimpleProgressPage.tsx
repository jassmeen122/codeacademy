
import React from 'react';
import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ActionCard } from '@/components/common/ActionCard';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useProgressStats } from '@/hooks/useProgressStats';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { BadgesSection } from '@/components/progress/BadgesSection';
import { InteractiveBadges } from '@/components/progress/InteractiveBadges';
import { DetailedStatsChart } from '@/components/progress/DetailedStatsChart';
import { StreakDisplay } from '@/components/progress/StreakDisplay';
import { CertificatesSection } from '@/components/student/CertificatesSection';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { useGamification } from '@/hooks/useGamification';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookOpen, CheckCircle, XCircle, Brain, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { toast } from 'sonner';

const SimpleProgressPage = () => {
  const { progress, loading, updateProgress, getProgressStats, availableBadges } = useUserProgress();
  const { weeklyStats, monthlyStats, streakData, loading: statsLoading, recordActivity } = useProgressStats();
  const { leaderboard, userStats, loading: gamificationLoading } = useGamification();

  if (loading || statsLoading) {
    return (
      <StudentLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-card rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-card rounded"></div>
            <div className="h-48 bg-card rounded"></div>
          </div>
          <div className="h-80 bg-card rounded"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!progress) {
    return (
      <StudentLayout>
        <div className="professional-card p-8 text-center">
          <p className="text-muted-foreground">
            Données de progression non disponibles
          </p>
        </div>
      </StudentLayout>
    );
  }

  const stats = getProgressStats();

  const handleTestReading = async () => {
    updateProgress('reading');
    await recordActivity('lesson_viewed', { 
      lesson_id: 'demo', 
      duration: Math.floor(Math.random() * 30) + 15 
    });
    toast.success('Lecture terminée ! +5 points');
  };

  const handleTestCorrectAnswer = async () => {
    updateProgress('answer', true);
    await recordActivity('exercise_completed', { 
      exercise_id: 'demo',
      points: 10,
      language: ['JavaScript', 'Python', 'Java'][Math.floor(Math.random() * 3)]
    });
    toast.success('Bonne réponse ! +10 points');
  };

  const handleTestWrongAnswer = () => {
    updateProgress('answer', false);
    toast.error('Continuez à apprendre, vous progressez !');
  };

  const handleCodeSession = async () => {
    await recordActivity('study_session', {
      duration: Math.floor(Math.random() * 60) + 30,
      language: 'JavaScript'
    });
    toast.success('Session de code enregistrée !');
  };

  // Préparer les données des badges pour le nouveau composant
  const interactiveBadges = availableBadges.map(badge => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    points: 10, // Valeur par défaut pour les points
    earned: stats.badges.some(earnedBadge => earnedBadge.id === badge.id),
    progress: Math.floor(Math.random() * 100), // Simulation de progression
    category: (
      badge.name.includes('Code') || badge.name.includes('JavaScript') || badge.name.includes('Python') ? 'coding' :
      badge.name.includes('Série') || badge.name.includes('Régulier') || badge.name.includes('Assidu') ? 'consistency' :
      badge.name.includes('Champion') || badge.name.includes('Expert') || badge.name.includes('Master') ? 'achievement' :
      'social'
    ) as 'coding' | 'consistency' | 'achievement' | 'social'
  }));

  return (
    <StudentLayout>
      <PageHeader
        title="Mon Parcours d'Apprentissage Avancé"
        description="Suivez votre progression, développez vos compétences et atteignez vos objectifs d'apprentissage"
        icon={TrendingUp}
      />

      {/* Cartes de progression rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProgressCard
          title="Contenu Étudié"
          current={progress.content_read}
          total={progress.total_content}
          icon="📚"
        />
        
        <ProgressCard
          title="Maîtrise Technique"
          current={progress.correct_answers}
          total={progress.total_answers}
          icon="🧠"
          percentage={stats.answersProgress}
        />

        <div className="professional-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🔥</div>
            <div>
              <h3 className="font-semibold">Série Active</h3>
              <p className="text-sm text-muted-foreground">Jours consécutifs</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {streakData.current_streak}
          </div>
        </div>

        <div className="professional-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h3 className="font-semibold">Classement</h3>
              <p className="text-sm text-muted-foreground">Position actuelle</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary">
            #{userStats ? leaderboard.findIndex(u => u.user_id === userStats.user_id) + 1 || '-' : '-'}
          </div>
        </div>
      </div>

      {/* Streak Display */}
      <div className="mb-8">
        <StreakDisplay streakData={streakData} loading={statsLoading} />
      </div>

      {/* Statistiques détaillées */}
      <div className="mb-8">
        <DetailedStatsChart 
          weeklyStats={weeklyStats} 
          monthlyStats={monthlyStats}
          loading={statsLoading}
        />
      </div>

      {/* Badges interactifs */}
      <div className="mb-8">
        <InteractiveBadges 
          badges={interactiveBadges}
          onBadgeClick={(badge) => {
            if (badge.earned) {
              toast.success(`Badge "${badge.name}" déjà obtenu !`);
            } else {
              toast.info(`Continuez pour débloquer "${badge.name}"`);
            }
          }}
        />
      </div>

      {/* Leaderboard */}
      <div className="mb-8">
        <Leaderboard 
          leaderboard={leaderboard}
          userStats={userStats}
          loading={gamificationLoading}
        />
      </div>

      {/* Section certificats */}
      <div className="mb-8">
        <CertificatesSection />
      </div>

      {/* Zone d'interaction améliorée */}
      <ActionCard
        title="Laboratoire d'Apprentissage Avancé"
        description="Testez les nouvelles fonctionnalités et simulez votre progression pour débloquer badges et statistiques"
        icon={Brain}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleTestReading}
              className="robot-button"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Terminer une Lecture
            </Button>
            
            <Button 
              onClick={handleTestCorrectAnswer}
              className="bg-education-success hover:bg-education-success/90 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Réponse Correcte
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleTestWrongAnswer}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Apprendre d'une Erreur
            </Button>

            <Button 
              onClick={handleCodeSession}
              className="bg-purple-500 hover:bg-purple-600 text-white"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Session de Code
            </Button>
          </div>

          {/* Statistiques en temps réel améliorées */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-sm font-medium text-primary">Sessions d'Étude</div>
              <div className="text-2xl font-bold text-foreground">{progress.content_read}</div>
            </div>
            
            <div className="text-center p-4 bg-education-secondary/10 rounded-lg border border-education-secondary/20">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-education-secondary">Points de Compétence</div>
              <div className="text-2xl font-bold text-foreground">{progress.correct_answers}</div>
            </div>
            
            <div className="text-center p-4 bg-robot-accent/10 rounded-lg border border-robot-accent/20">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-medium text-robot-accent">Réalisations</div>
              <div className="text-2xl font-bold text-foreground">{stats.badges.length}</div>
            </div>

            <div className="text-center p-4 bg-orange-100 rounded-lg border border-orange-200">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-orange-600">Série Active</div>
              <div className="text-2xl font-bold text-foreground">{streakData.current_streak}</div>
            </div>
          </div>

          {/* Conseils d'amélioration */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Conseils pour Progresser
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Maintenez une série quotidienne d'au moins 15 minutes</li>
              <li>• Variez les langages pour devenir polyglotte</li>
              <li>• Participez aux défis pour gagner plus de points</li>
              <li>• Aidez d'autres étudiants pour débloquer des badges sociaux</li>
            </ul>
          </div>
        </div>
      </ActionCard>
    </StudentLayout>
  );
};

export default SimpleProgressPage;
