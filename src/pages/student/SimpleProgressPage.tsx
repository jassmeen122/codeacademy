
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { BadgesSection } from '@/components/progress/BadgesSection';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, CheckCircle, XCircle } from 'lucide-react';

const SimpleProgressPage = () => {
  const { progress, loading, updateProgress, getProgressStats, availableBadges } = useUserProgress();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-card/50 rounded w-1/3 border border-neon-blue/30"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-card/50 rounded border border-neon-blue/30"></div>
              <div className="h-48 bg-card/50 rounded border border-neon-blue/30"></div>
            </div>
            <div className="h-80 bg-card/50 rounded border border-neon-blue/30"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!progress) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="cyber-card p-8 text-center">
            <p className="text-neon-blue font-mono">ERROR: Progress data not found...</p>
          </div>
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
          <h1 className="text-4xl font-bold font-mono mb-3 flex items-center gap-3">
            <span className="text-5xl animate-hologram">🌟</span>
            <span className="text-cyber-gradient typewriter">MY_JOURNEY</span>
          </h1>
          <p className="text-muted-foreground font-mono terminal-text">
            {`> Monitoring progress and achievements...`}
          </p>
        </div>

        {/* Cartes de progrès */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressCard
            title="CONTENT_READ"
            current={progress.content_read}
            total={progress.total_content}
            icon="📚"
          />
          
          <ProgressCard
            title="CORRECT_ANSWERS"
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

        {/* Zone de test cyber */}
        <div className="cyber-card p-6 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 border-neon-blue/30">
          <h3 className="font-mono font-bold mb-4 text-neon-blue flex items-center gap-2">
            <Play className="h-5 w-5" />
            DEBUG_MODE // Simulation controls
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestReading}
              className="cyber-button bg-neon-green/10 border-neon-green/30 hover:border-neon-green/80 font-mono"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              mark_as_read()
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestCorrectAnswer}
              className="cyber-button bg-neon-blue/10 border-neon-blue/30 hover:border-neon-blue/80 font-mono"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              correct_answer()
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestWrongAnswer}
              className="cyber-button bg-red-500/10 border-red-500/30 hover:border-red-500/80 font-mono"
            >
              <XCircle className="h-4 w-4 mr-2" />
              wrong_answer()
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-mono terminal-text">
            {`> Execute functions to test badge system integration`}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
