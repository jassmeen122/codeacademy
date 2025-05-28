
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { BadgesSection } from '@/components/progress/BadgesSection';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, CheckCircle, XCircle, BookOpen, Brain, Target, TrendingUp, BarChart3 } from 'lucide-react';

const SimpleProgressPage = () => {
  const { progress, loading, updateProgress, getProgressStats, availableBadges } = useUserProgress();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-card rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-card rounded"></div>
              <div className="h-48 bg-card rounded"></div>
            </div>
            <div className="h-80 bg-card rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!progress) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="professional-card p-8 text-center">
            <p className="text-muted-foreground">
              Données de progression non disponibles
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = getProgressStats();

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
          <h1 className="text-4xl font-bold font-display mb-3 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mon Parcours d'Apprentissage
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Suivez votre progression et développez vos compétences en informatique
          </p>
        </div>

        {/* Cartes de progression */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        </div>

        {/* Section réalisations */}
        <div className="mb-8">
          <BadgesSection 
            earnedBadges={stats.badges}
            availableBadges={availableBadges}
          />
        </div>

        {/* Zone d'interaction */}
        <div className="professional-card p-6">
          <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Laboratoire d'Apprentissage
            <span className="text-xs bg-robot-primary/10 text-robot-primary px-2 py-1 rounded-full">
              Simulateur
            </span>
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-6">
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
          </div>
          
          <div className="p-4 bg-tech-dark rounded-lg border border-border mb-6">
            <p className="text-sm text-tech-light font-mono">
              💡 Utilisez ces fonctions pour simuler votre progression et débloquer de nouvelles réalisations
            </p>
          </div>

          {/* Statistiques en temps réel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
