
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { UserSkill, UserMetric, ActivityLog } from '@/types/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressChartsProps {
  skills: UserSkill[];
  activityLogs: ActivityLog[];
  metrics?: UserMetric | null;
  loading: boolean;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  skills,
  activityLogs,
  metrics,
  loading
}) => {
  const COLORS = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];
  
  // Transform skills data for bar chart
  const skillsData = skills
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)
    .map(skill => ({
      name: skill.skill_name,
      progress: skill.progress
    }));
  
  // Group activity logs by type
  const activityByType = activityLogs.reduce((acc: any, log) => {
    acc[log.type] = (acc[log.type] || 0) + log.count;
    return acc;
  }, {});
  
  // Create pie chart data
  const activityPieData = Object.keys(activityByType).map((key, index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: activityByType[key]
  }));
  
  // Format activity logs for time series
  const last7Days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date.toISOString().split('T')[0];
  });
  
  const timeSeriesData = last7Days.map(date => {
    const matching = activityLogs.filter(log => log.date.startsWith(date));
    return {
      date: date.split('-').slice(1).reverse().join('/'), // Format as DD/MM
      activities: matching.reduce((sum, log) => sum + log.count, 0)
    };
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time Series Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium mb-2">Activity Last 7 Days</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="activities" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Learning Distribution Pie Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium mb-2">Activity Distribution</h3>
                <div className="h-64">
                  {activityPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activityPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {activityPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No activity data available yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium mb-2">Top 5 Skills</h3>
              <div className="h-72">
                {skillsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={skillsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                      <Bar dataKey="progress" fill="#4f46e5" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No skills data available yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium mb-4">Metrics Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Courses Completed</div>
                    <div className="text-2xl font-bold">{metrics?.course_completions || 0}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Exercises Finished</div>
                    <div className="text-2xl font-bold">{metrics?.exercises_completed || 0}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Learning Time</div>
                    <div className="text-2xl font-bold">{metrics?.total_time_spent || 0} min</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
