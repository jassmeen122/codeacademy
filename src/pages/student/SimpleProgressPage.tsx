
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { BadgesSection } from '@/components/progress/BadgesSection';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SimpleProgressPage = () => {
  const { progress, loading, updateProgress, getProgressStats, availableBadges } = useUserProgress();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-60 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!progress) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Erreur lors du chargement du progrès</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = getProgressStats();

  // Fonctions de test pour simuler les actions
  const handleTestReading = () => {
    updateProgress('reading');
  };

  const handleTestCorrectAnswer = () => {
    updateProgress('answer', true);
  };

  const handleTestWrongAnswer = () => {
    updateProgress('answer', false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-4xl">🌟</span>
            Mon Progrès
          </h1>
          <p className="text-muted-foreground">Suivez votre progression et vos achievements</p>
        </div>

        {/* Cartes de progrès */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressCard
            title="Contenu lu"
            current={progress.content_read}
            total={progress.total_content}
            icon="📚"
          />
          
          <ProgressCard
            title="Bonnes réponses"
            current={progress.correct_answers}
            total={progress.total_answers}
            icon="🧠"
            percentage={stats.answersProgress}
          />
        </div>

        {/* Section badges */}
        <div className="mb-8">
          <BadgesSection 
            earnedBadges={stats.badges}
            availableBadges={availableBadges}
          />
        </div>

        {/* Boutons de test pour simuler les actions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-blue-800">🧪 Zone de test (simuler les actions)</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestReading}
              className="bg-green-100 hover:bg-green-200"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Marquer comme lu
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestCorrectAnswer}
              className="bg-blue-100 hover:bg-blue-200"
            >
              ✅ Bonne réponse
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestWrongAnswer}
              className="bg-red-100 hover:bg-red-200"
            >
              ❌ Mauvaise réponse
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Ces boutons simulent les actions pour tester le système de badges
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
