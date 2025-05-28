
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Timer, Code, Brain, Zap, Clock } from 'lucide-react';
import type { DailyChallenge } from '@/types/gamification';

interface DailyChallengesProps {
  challenges: DailyChallenge[];
  onSubmitChallenge: (challengeId: string, code?: string, answer?: string, timeTaken?: number) => Promise<any>;
  loading?: boolean;
}

const getChallengeIcon = (type: string) => {
  switch (type) {
    case 'code_fix': return Code;
    case 'quiz': return Brain;
    case 'speed_coding': return Zap;
    default: return Code;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500';
    case 'intermediate': return 'bg-yellow-500';
    case 'advanced': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const DailyChallenges: React.FC<DailyChallengesProps> = ({ 
  challenges, 
  onSubmitChallenge, 
  loading 
}) => {
  const [submissions, setSubmissions] = useState<Record<string, { code?: string; answer?: string; startTime?: number }>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleStartChallenge = (challengeId: string) => {
    setSubmissions(prev => ({
      ...prev,
      [challengeId]: {
        ...prev[challengeId],
        startTime: Date.now()
      }
    }));
  };

  const handleSubmission = async (challenge: DailyChallenge) => {
    const submission = submissions[challenge.id];
    if (!submission) return;

    setSubmitting(challenge.id);
    const timeTaken = submission.startTime ? Math.floor((Date.now() - submission.startTime) / 1000) : 0;
    
    try {
      await onSubmitChallenge(
        challenge.id,
        submission.code,
        submission.answer,
        timeTaken
      );
      
      // Retirer le défi de la liste après soumission
      setSubmissions(prev => {
        const newSubmissions = { ...prev };
        delete newSubmissions[challenge.id];
        return newSubmissions;
      });
    } catch (error) {
      console.error('Error submitting challenge:', error);
    } finally {
      setSubmitting(null);
    }
  };

  const updateSubmission = (challengeId: string, field: 'code' | 'answer', value: string) => {
    setSubmissions(prev => ({
      ...prev,
      [challengeId]: {
        ...prev[challengeId],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-blue-500" />
            Défis Quotidiens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-blue-500" />
          Défis Quotidiens
        </CardTitle>
      </CardHeader>
      <CardContent>
        {challenges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun défi disponible pour aujourd'hui.</p>
            <p className="text-sm mt-2">Revenez demain pour de nouveaux défis !</p>
          </div>
        ) : (
          <div className="space-y-6">
            {challenges.map((challenge) => {
              const IconComponent = getChallengeIcon(challenge.challenge_type);
              const submission = submissions[challenge.id];
              const hasStarted = !!submission?.startTime;
              
              return (
                <div key={challenge.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <h3 className="font-semibold">{challenge.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                        {challenge.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {challenge.time_limit}s
                      </div>
                      <Badge variant="outline" className="text-yellow-600">
                        +{challenge.points_reward} pts
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  
                  {challenge.code_snippet && (
                    <pre className="bg-gray-900 text-white p-3 rounded text-sm overflow-x-auto">
                      <code>{challenge.code_snippet}</code>
                    </pre>
                  )}
                  
                  {challenge.expected_output && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-900">Résultat attendu :</p>
                      <p className="text-sm text-blue-800">{challenge.expected_output}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {challenge.challenge_type === 'quiz' ? (
                      <Textarea
                        placeholder="Tapez votre réponse ici..."
                        value={submission?.answer || ''}
                        onChange={(e) => updateSubmission(challenge.id, 'answer', e.target.value)}
                        disabled={submitting === challenge.id}
                      />
                    ) : (
                      <Textarea
                        placeholder="Écrivez votre code ici..."
                        value={submission?.code || ''}
                        onChange={(e) => updateSubmission(challenge.id, 'code', e.target.value)}
                        disabled={submitting === challenge.id}
                        className="font-mono"
                      />
                    )}
                    
                    <div className="flex gap-2">
                      {!hasStarted ? (
                        <Button 
                          onClick={() => handleStartChallenge(challenge.id)}
                          variant="outline"
                        >
                          Commencer le défi
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleSubmission(challenge)}
                          disabled={submitting === challenge.id || (!submission?.code && !submission?.answer)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {submitting === challenge.id ? 'Soumission...' : 'Soumettre'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
