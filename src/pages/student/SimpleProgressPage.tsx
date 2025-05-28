
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { BadgesSection } from '@/components/progress/BadgesSection';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, CheckCircle, XCircle, BookOpen, Brain, Target } from 'lucide-react';

const SimpleProgressPage = () => {
  const { progress, loading, updateProgress, getProgressStats, availableBadges } = useUserProgress();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-card/50 rounded w-1/3 border border-knowledge-blue/30 knowledge-glow"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-card/50 rounded border border-education-gold/30 study-focus"></div>
              <div className="h-48 bg-card/50 rounded border border-learning-teal/30"></div>
            </div>
            <div className="h-80 bg-card/50 rounded border border-knowledge-blue/30 knowledge-glow"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!progress) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="cyber-card p-8 text-center knowledge-glow">
            <p className="text-knowledge-blue font-mono flex items-center justify-center gap-2">
              <span>📚</span>
              ERROR: Learning progress data not found...
              <span>💡</span>
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = getProgressStats();

  // Fonctions de test pour simuler les actions éducatives
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
            <span className="text-5xl animate-knowledge-hologram">🎓</span>
            <span className="text-cyber-gradient typewriter">MY_LEARNING_JOURNEY</span>
            <span className="text-3xl animate-bulb-flash">💡</span>
          </h1>
          <p className="text-muted-foreground font-mono terminal-text flex items-center gap-2">
            <span>📊</span>
            {`> Tracking educational progress and knowledge achievements...`}
            <span className="animate-book-study">📚</span>
          </p>
        </div>

        {/* Cartes de progrès éducatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressCard
            title="KNOWLEDGE_ABSORPTION"
            current={progress.content_read}
            total={progress.total_content}
            icon="📚"
          />
          
          <ProgressCard
            title="SKILL_MASTERY"
            current={progress.correct_answers}
            total={progress.total_answers}
            icon="🧠"
            percentage={stats.answersProgress}
          />
        </div>

        {/* Section badges éducatives */}
        <div className="mb-8">
          <BadgesSection 
            earnedBadges={stats.badges}
            availableBadges={availableBadges}
          />
        </div>

        {/* Zone d'apprentissage interactif */}
        <div className="cyber-card p-6 bg-gradient-to-r from-knowledge-blue/5 to-education-gold/5 border-knowledge-blue/30 study-focus">
          <h3 className="font-mono font-bold mb-4 text-education-gold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            LEARNING_LAB // Interactive study simulator
            <span className="animate-bulb-flash">💡</span>
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestReading}
              className="cyber-button bg-learning-teal/10 border-learning-teal/30 hover:border-learning-teal/80 font-mono group"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span>📖</span>
              complete_reading()
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestCorrectAnswer}
              className="cyber-button bg-education-gold/10 border-education-gold/30 hover:border-education-gold/80 font-mono"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>🎯</span>
              correct_answer()
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestWrongAnswer}
              className="cyber-button bg-red-500/10 border-red-500/30 hover:border-red-500/80 font-mono"
            >
              <XCircle className="h-4 w-4 mr-2" />
              <span>📝</span>
              learn_from_mistake()
            </Button>
          </div>
          
          <div className="p-3 bg-black/20 rounded border border-learning-teal/20 mb-4">
            <p className="text-xs text-learning-teal font-mono terminal-text flex items-center gap-2">
              <span>💡</span>
              {`> Execute learning functions to simulate educational progress and unlock achievements`}
              <span className="animate-diploma-shine">🏆</span>
            </p>
          </div>

          {/* Indicateurs de progression en temps réel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-knowledge-blue/10 rounded border border-knowledge-blue/30">
              <div className="text-2xl mb-1 animate-book-study">📚</div>
              <div className="text-sm font-mono text-knowledge-blue">Study Sessions</div>
              <div className="text-lg font-bold text-education-gold">{progress.content_read}</div>
            </div>
            
            <div className="text-center p-3 bg-education-gold/10 rounded border border-education-gold/30">
              <div className="text-2xl mb-1 animate-bulb-flash">💡</div>
              <div className="text-sm font-mono text-education-gold">Knowledge Points</div>
              <div className="text-lg font-bold text-learning-teal">{progress.correct_answers}</div>
            </div>
            
            <div className="text-center p-3 bg-learning-teal/10 rounded border border-learning-teal/30">
              <div className="text-2xl mb-1 animate-diploma-shine">🎓</div>
              <div className="text-sm font-mono text-learning-teal">Achievements</div>
              <div className="text-lg font-bold text-knowledge-blue">{stats.badges.length}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
