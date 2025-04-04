
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StarDisplay } from '@/components/student/progress/StarDisplay';
import { QuickTip } from '@/components/student/progress/QuickTip';
import { WeeklyMessage } from '@/components/student/progress/WeeklyMessage';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleStarProgress } from '@/hooks/useSimpleStarProgress';
import { useProgressTracking } from '@/hooks/useProgressTracking';

export default function SimpleProgressPage() {
  const { user } = useAuthState();
  const { totalStars, weeklyStars, recentSuccess, loading } = useSimpleStarProgress();
  const { testUpdateMetrics, updating: trackingUpdating } = useProgressTracking();
  const [refreshing, setRefreshing] = React.useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      toast.success("Données actualisées !");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Impossible d'actualiser les données");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTestStarUpdate = async () => {
    await testUpdateMetrics('exercise', 1);
    toast.success("Tu as gagné une étoile ! ⭐");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <PageHeader
            heading="Ton Parcours Étoilé"
            subheading="Suis tes étoiles et progresse !"
          />
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={refreshData} 
              disabled={refreshing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestStarUpdate} 
              disabled={trackingUpdating}
              className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
            >
              <Zap className="h-4 w-4" />
              Ajouter une étoile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StarDisplay 
            stars={totalStars} 
            loading={loading}
            maxStars={5}
          />
          
          <QuickTip 
            stars={totalStars} 
            recentSuccess={recentSuccess} 
          />
          
          <WeeklyMessage 
            starsEarned={weeklyStars} 
          />
        </div>

        <div>
          <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-indigo-500">🦄</span> Ton Aventure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4 py-4">
                <p className="text-xl font-medium">
                  Chaque étoile te rapproche de la victoire !
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fais des exercices pour gagner des étoiles et débloque de nouveaux niveaux.
                  Plus tu as d'étoiles, plus tu avances !
                </p>
                <div className="flex justify-center gap-6 pt-2">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">{totalStars}</div>
                    <div className="text-sm text-gray-500">Étoiles totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{weeklyStars}</div>
                    <div className="text-sm text-gray-500">Étoiles cette semaine</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Juste un exemple de progression future pour susciter l'envie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
          <Card className="border border-dashed">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-medium">Niveau Magicien</h3>
              <p className="text-sm text-gray-500 mt-2">Débloqué à 10 étoiles</p>
            </CardContent>
          </Card>
          
          <Card className="border border-dashed">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-medium">Badge Expert</h3>
              <p className="text-sm text-gray-500 mt-2">Débloqué à 15 étoiles</p>
            </CardContent>
          </Card>
          
          <Card className="border border-dashed">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-medium">Pouvoir Spécial</h3>
              <p className="text-sm text-gray-500 mt-2">Débloqué à 20 étoiles</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
