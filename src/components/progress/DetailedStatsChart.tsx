
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import { format, startOfWeek, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeeklyStats {
  exercises_completed: number;
  time_spent_minutes: number;
  languages_practiced: string[];
  streak_days: number;
  points_earned: number;
  week_start: string;
}

interface MonthlyStats {
  exercises_completed: number;
  time_spent_hours: number;
  courses_completed: number;
  badges_earned: number;
  max_streak: number;
  points_earned: number;
  month_start: string;
}

interface DetailedStatsChartProps {
  weeklyStats: WeeklyStats[];
  monthlyStats: MonthlyStats[];
  loading?: boolean;
}

export const DetailedStatsChart: React.FC<DetailedStatsChartProps> = ({
  weeklyStats,
  monthlyStats,
  loading
}) => {
  const [chartType, setChartType] = useState<'weekly' | 'monthly'>('weekly');
  const [metric, setMetric] = useState<'exercises' | 'time' | 'points'>('exercises');

  if (loading) {
    return (
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Statistiques Détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Chargement des statistiques...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    if (chartType === 'weekly') {
      return weeklyStats.map(stat => ({
        period: format(parseISO(stat.week_start), 'dd MMM', { locale: fr }),
        exercises: stat.exercises_completed,
        time: Math.round(stat.time_spent_minutes / 60 * 10) / 10, // Convertir en heures
        points: stat.points_earned,
        languages: stat.languages_practiced.length
      }));
    } else {
      return monthlyStats.map(stat => ({
        period: format(parseISO(stat.month_start), 'MMM yyyy', { locale: fr }),
        exercises: stat.exercises_completed,
        time: stat.time_spent_hours,
        points: stat.points_earned,
        courses: stat.courses_completed,
        badges: stat.badges_earned
      }));
    }
  };

  // Préparer les données pour le graphique en secteurs des langages
  const prepareLanguageData = () => {
    const languageCounts: { [key: string]: number } = {};
    
    weeklyStats.forEach(stat => {
      stat.languages_practiced.forEach(lang => {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      });
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];
    
    return Object.entries(languageCounts).map(([language, count], index) => ({
      name: language,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const chartData = prepareChartData();
  const languageData = prepareLanguageData();

  const getMetricValue = (data: any) => {
    switch (metric) {
      case 'exercises': return data.exercises;
      case 'time': return data.time;
      case 'points': return data.points;
      default: return data.exercises;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'exercises': return 'Exercices';
      case 'time': return chartType === 'weekly' ? 'Heures' : 'Heures';
      case 'points': return 'Points';
      default: return 'Exercices';
    }
  };

  const getMetricColor = () => {
    switch (metric) {
      case 'exercises': return '#8884d8';
      case 'time': return '#82ca9d';
      case 'points': return '#ffc658';
      default: return '#8884d8';
    }
  };

  // Calculer les totaux
  const totals = {
    exercises: weeklyStats.reduce((sum, stat) => sum + stat.exercises_completed, 0),
    time: weeklyStats.reduce((sum, stat) => sum + stat.time_spent_minutes, 0),
    points: weeklyStats.reduce((sum, stat) => sum + stat.points_earned, 0),
    languages: new Set(weeklyStats.flatMap(stat => stat.languages_practiced)).size
  };

  return (
    <Card className="professional-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Statistiques Détaillées
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant={chartType === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('weekly')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Semaines
            </Button>
            <Button
              variant={chartType === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('monthly')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Mois
            </Button>
          </div>
        </div>

        {/* Métriques de sélection */}
        <div className="flex gap-2 mt-4">
          {['exercises', 'time', 'points'].map(m => (
            <Button
              key={m}
              variant={metric === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetric(m as any)}
            >
              {getMetricLabel()}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Cartes de résumé */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{totals.exercises}</div>
            <div className="text-sm text-blue-600">Exercices Total</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {Math.round(totals.time / 60)}h
            </div>
            <div className="text-sm text-green-600">Temps d'Étude</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-800">{totals.points}</div>
            <div className="text-sm text-yellow-600">Points Gagnés</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Badge className="bg-purple-500 text-white mx-auto">
              {totals.languages}
            </Badge>
            <div className="text-sm text-purple-600 mt-2">Langages Pratiqués</div>
          </div>
        </div>

        {/* Graphique principal */}
        <div className="space-y-6">
          <div className="h-80">
            <h4 className="text-lg font-semibold mb-4">
              Évolution {chartType === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'} - {getMetricLabel()}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, getMetricLabel()]}
                  labelFormatter={(label) => `Période: ${label}`}
                />
                <Bar 
                  dataKey={metric} 
                  fill={getMetricColor()}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique des langages */}
          {languageData.length > 0 && (
            <div className="h-80">
              <h4 className="text-lg font-semibold mb-4">Répartition des Langages Pratiqués</h4>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {languageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [value, 'Semaines']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {languageData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm">{entry.name}</span>
                      <Badge variant="outline">{entry.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {chartData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucune donnée disponible</p>
            <p className="text-sm">Commencez à étudier pour voir vos statistiques !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
