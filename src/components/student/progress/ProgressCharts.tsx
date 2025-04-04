
import React, { useMemo } from 'react';
import {
  PieChart, Pie, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserSkill, UserMetric, ActivityLog } from '@/types/progress';

interface ProgressChartsProps {
  skills: UserSkill[];
  metrics?: UserMetric | null;
  activityLogs?: ActivityLog[];
  loading: boolean;
}

// Educational-friendly colors
const COLORS = [
  '#9b87f5', // Primary Purple
  '#33C3F0', // Sky Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#03A9F4', // Light Blue
  '#FF5722', // Deep Orange
  '#2196F3'  // Blue
];

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ 
  skills, 
  metrics, 
  activityLogs = [],
  loading 
}) => {
  console.log("ProgressCharts rendering with:", { skills, metrics, activityLogsCount: activityLogs.length, loading });
  
  // Process skills data for the chart
  const skillsData = useMemo(() => {
    return skills.map(skill => ({
      name: skill.skill_name,
      value: skill.progress
    }));
  }, [skills]);

  // Process activity logs for the activity chart
  const activityData = useMemo(() => {
    // Create an array of the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    // Create a map of dates to count
    const activityMap = new Map();
    last7Days.forEach(date => {
      activityMap.set(date, 0);
    });
    
    // Fill in the actual activity counts
    activityLogs.forEach(log => {
      const date = log.date;
      if (activityMap.has(date)) {
        activityMap.set(date, (activityMap.get(date) || 0) + log.count);
      }
    });
    
    // Convert map to array for chart
    return Array.from(activityMap.entries()).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      count
    }));
  }, [activityLogs]);

  // Format time data for the chart
  const timeData = useMemo(() => {
    console.log("Computing time data from metrics:", metrics);
    const totalHours = metrics?.total_time_spent ? metrics.total_time_spent / 60 : 0;
    const avgDailyHours = totalHours / 30; // Assuming metrics are for 30 days
    
    return [
      { name: 'Total Heures', hours: parseFloat(totalHours.toFixed(1)) },
      { name: 'Moy. Quotidienne', hours: parseFloat(avgDailyHours.toFixed(1)) }
    ];
  }, [metrics]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Progression d'Apprentissage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
        <CardTitle className="flex items-center gap-2">
          <span className="text-purple-600 dark:text-purple-400">📊</span> 
          Votre Progression d'Apprentissage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="skills">
          <TabsList className="mb-4">
            <TabsTrigger value="skills">Distribution des Compétences</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="time">Temps Passé</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {skillsData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {skillsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`} 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '10px' }}
                  />
                </PieChart>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-blue-50/20 dark:bg-blue-900/10 rounded-lg p-6">
                  <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-2">Pas encore de données de compétences</p>
                  <p className="text-muted-foreground text-center">Complétez des cours et exercices pour développer vos compétences et voir votre progression ici.</p>
                </div>
              )}
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="activity" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {activityData.some(item => item.count > 0) ? (
                <LineChart
                  data={activityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Activités" 
                    stroke="#9b87f5"
                    strokeWidth={2}
                    activeDot={{ r: 8, fill: '#9b87f5', stroke: '#ffffff', strokeWidth: 2 }} 
                    animationDuration={1500}
                  />
                </LineChart>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-green-50/20 dark:bg-green-900/10 rounded-lg p-6">
                  <p className="text-xl text-green-600 dark:text-green-400 font-medium mb-2">Pas encore d'activités enregistrées</p>
                  <p className="text-muted-foreground text-center">Commencez à apprendre pour voir votre activité apparaître ici. Chaque action compte!</p>
                </div>
              )}
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="time" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {metrics?.total_time_spent ? (
                <BarChart
                  data={timeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="hours" 
                    fill="#33C3F0" 
                    name="Heures"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-amber-50/20 dark:bg-amber-900/10 rounded-lg p-6">
                  <p className="text-xl text-amber-600 dark:text-amber-400 font-medium mb-2">Pas encore de données de temps</p>
                  <p className="text-muted-foreground text-center">Votre temps d'apprentissage sera enregistré lorsque vous suivrez des cours et compléterez des exercices.</p>
                </div>
              )}
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg">
          <p className="text-sm text-center text-blue-700 dark:text-blue-300">
            "La persévérance est la clé du succès. Chaque minute d'apprentissage vous rapproche de vos objectifs! 🌱"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
